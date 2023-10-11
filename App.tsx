/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';

import {
  addConfigLines,
  CandyMachineItem,
  ConfigLine,
  create,
  fetchCandyMachine,
  mintV2,
  mplCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import {
  createNft,
  mplTokenMetadata,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';
import {
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  percentAmount,
  PublicKey,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

import AddCircle from './src/images/AddCircle.svg';
import { env } from './src/utils/env';
import { CandyMachineParams, NftMetadata } from './src/utils/types';

// initialize umi
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata())
  .use(mplCandyMachine());

// use authority wallet to sign transactions
const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(
  env.authority.privateKey,
);
const authority = createSignerFromKeypair(umi, authorityKeypair);
umi.use(keypairIdentity(authority));

async function waitForTransaction(signature: Uint8Array) {
  let transaction;
  while (!transaction) {
    try {
      transaction = await umi.rpc.getTransaction(signature);
    } catch (error) {
      console.error('Error retrieving transaction:', error);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return transaction;
}

async function mintNftCollection(
  nftMetadata: NftMetadata,
): Promise<PublicKey | undefined> {
  try {
    // const [nftCollectionImageUri] = await umi.uploader.upload([imageFile])
    // const [nftCollectionBannerUri] = await umi.uploader.upload([bannerFile])
    //const nftCollectionUri = await umi.uploader.uploadJson(nftMetadata);
    const nftCollectionUri = 'someUri';
    console.log('NFT Collection metadata uploaded to ', nftCollectionUri);

    const collectionMint = generateSigner(umi);
    const { signature } = await createNft(umi, {
      mint: collectionMint,
      authority: authority,
      name: nftMetadata.name,
      uri: nftCollectionUri,
      sellerFeeBasisPoints: percentAmount(0),
      isCollection: true,
    }).sendAndConfirm(umi);
    await waitForTransaction(signature);

    console.log(
      `NFT Collection minted to https://explorer.solana.com/address/${collectionMint.publicKey}?cluster=devnet`,
    );

    return collectionMint.publicKey;
  } catch (error) {
    console.error('Error generating NFT collection:', error);
  }
}

async function createCandyMachine(
  candyMachineParams: CandyMachineParams,
): Promise<PublicKey | undefined> {
  try {
    const collectionMintPublicKey = await mintNftCollection(
      candyMachineParams.metadata,
    );

    const candyMachine = generateSigner(umi);
    const { signature } = await (
      await create(umi, {
        candyMachine,
        collectionMint: publicKey(collectionMintPublicKey!),
        collectionUpdateAuthority: authority,
        tokenStandard: TokenStandard.NonFungible,
        sellerFeeBasisPoints: percentAmount(0),
        itemsAvailable: candyMachineParams.itemsAvailable,
        creators: [
          {
            address: authority.publicKey,
            verified: true,
            percentageShare: 100,
          },
        ],
        configLineSettings: some({
          prefixName: '#$ID+1$',
          nameLength: 0,
          prefixUri: `https://s3.${env.aws.bucket.region}.amazonaws.com/${env.aws.bucket.name}/`,
          uriLength: 20,
          isSequential: false,
        }),
        guards: {
          solPayment: some({
            lamports: sol(candyMachineParams.pricePerToken),
            destination: candyMachineParams.treasury,
          }),
          startDate: some({ date: candyMachineParams.startDate }),
        },
      })
    ).sendAndConfirm(umi);
    await waitForTransaction(signature);

    console.log(
      `The Candy machine was created at https://explorer.solana.com/address/${candyMachine.publicKey}?cluster=devnet`,
    );

    return candyMachine.publicKey;
  } catch (error) {
    console.error('Error creating candy machine:', error);
  }
}

async function insertNfts(
  candyMachinePublicKey: PublicKey,
  nfts: ConfigLine[],
) {
  try {
    console.log('Inserting NFTs...');

    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);

    const { signature } = await addConfigLines(umi, {
      candyMachine: candyMachine.publicKey,
      index: candyMachine.itemsLoaded,
      configLines: nfts,
    }).sendAndConfirm(umi);
    waitForTransaction(signature);

    console.log(`Successfully inserted ${nfts.length} NFTs`);
  } catch (error) {
    console.error('Error inserting NFTs:', error);
  }
}

async function fetchNfts(
  candyMachinePublicKey: PublicKey,
): Promise<CandyMachineItem[] | undefined> {
  try {
    console.log('Fetching NFTs...');

    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);

    console.log(candyMachine.items);
    // candyMachine.items.forEach((item) => {
    //   console.log(`
    //     Minted ${item.minted}
    //     Item ${item.name}
    //     URI ${item.uri}
    //   `);
    // });

    return candyMachine.items;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
  }
}

async function mintNft(
  candyMachinePublicKey: PublicKey,
  treasury: PublicKey,
): Promise<PublicKey | undefined> {
  try {
    console.log('Minting NFT...');
    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);

    const nftMint = generateSigner(umi);
    const { signature } = await transactionBuilder()
      .add(setComputeUnitLimit(umi, { units: 800_000 }))
      .add(
        mintV2(umi, {
          candyMachine: candyMachine.publicKey,
          nftMint: nftMint,
          collectionMint: candyMachine.collectionMint,
          collectionUpdateAuthority: authority.publicKey,
          mintArgs: {
            solPayment: some({ destination: treasury }),
          },
        }),
      )
      .sendAndConfirm(umi);
    waitForTransaction(signature);

    console.log(
      `Successfully minted an NFT to https://explorer.solana.com/address/${nftMint.publicKey}?cluster=devnet$`,
    );

    return nftMint.publicKey;
  } catch (error) {
    console.error('Error minting NFT:', error);
  }
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <AddCircle width={120} height={120} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

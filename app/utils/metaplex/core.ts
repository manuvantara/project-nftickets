import {
  TokenStandard,
  createNft,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  PublicKey,
  Umi,
  generateSigner,
  percentAmount,
  publicKey,
  sol,
  some,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { CandyMachineParams, NftMetadata } from '../types';
import { waitForTransaction } from '../helpers/wait-for-transaction';
import {
  ConfigLine,
  addConfigLines,
  create,
  fetchCandyMachine,
  mintV2,
} from '@metaplex-foundation/mpl-candy-machine';
import { PREFIX_URI, updateEventMetadata } from './metadata';
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox';

export async function createCandyMachine(
  umi: Umi,
  candyMachineParams: CandyMachineParams,
): Promise<PublicKey> {
  try {
    console.log('Creating candy machine...');

    const collectionMintPublicKey = await mintNftCollection(
      umi,
      candyMachineParams.metadata,
    );

    const candyMachine = generateSigner(umi);
    const { signature } = await (
      await create(umi, {
        candyMachine,
        collectionMint: publicKey(collectionMintPublicKey),
        collectionUpdateAuthority: umi.payer,
        tokenStandard: TokenStandard.NonFungible,
        sellerFeeBasisPoints: percentAmount(0),
        itemsAvailable: candyMachineParams.itemsAvailable,
        creators: [
          {
            address: umi.payer.publicKey,
            verified: true,
            percentageShare: 100,
          },
        ],
        configLineSettings: some({
          prefixName: '#$ID+1$',
          nameLength: 0,
          prefixUri: PREFIX_URI,
          uriLength: 59,
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
    await waitForTransaction(umi, signature);

    console.log(
      `The Candy machine was created at https://explorer.solana.com/address/${candyMachine.publicKey}?cluster=devnet`,
    );

    await updateEventMetadata(
      umi,
      collectionMintPublicKey,
      candyMachine.publicKey,
      candyMachineParams,
    );

    return candyMachine.publicKey;
  } catch (error) {
    console.error('createCandyMachine', error);
    throw new Error('Error creating candy machine');
  }
}

export async function mintNftCollection(
  umi: Umi,
  nftMetadata: NftMetadata,
): Promise<PublicKey> {
  try {
    console.log('Minting NFT collection...');

    const collectionMint = generateSigner(umi);
    const { signature } = await createNft(umi, {
      mint: collectionMint,
      authority: umi.payer,
      name: nftMetadata.name,
      uri: '',
      sellerFeeBasisPoints: percentAmount(0),
      isCollection: true,
    }).sendAndConfirm(umi);
    await waitForTransaction(umi, signature);

    console.log(
      `NFT Collection minted to https://explorer.solana.com/address/${collectionMint.publicKey}?cluster=devnet`,
    );

    return collectionMint.publicKey;
  } catch (error) {
    console.error('mintNftCollection', error);
    throw new Error('Error generating NFT collection');
  }
}

export async function insertNfts(
  umi: Umi,
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
    await waitForTransaction(umi, signature);

    console.log(`Successfully inserted ${nfts.length} NFTs`);
  } catch (error) {
    console.error('insertNfts', error);
    throw new Error('Error inserting NFTs');
  }
}

export async function mintNft(
  umi: Umi,
  candyMachinePublicKey: PublicKey,
  treasury: PublicKey,
): Promise<PublicKey> {
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
          collectionUpdateAuthority: umi.payer.publicKey,
          mintArgs: {
            solPayment: some({ destination: treasury }),
          },
        }),
      )
      .sendAndConfirm(umi);
    await waitForTransaction(umi, signature);

    console.log(
      `Successfully minted an NFT to https://explorer.solana.com/address/${nftMint.publicKey}?cluster=devnet$`,
    );

    return nftMint.publicKey;
  } catch (error) {
    console.error('mintNft', error);
    throw new Error('Error minting NFT');
  }
}

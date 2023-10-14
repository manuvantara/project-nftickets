import { launchImageLibrary } from 'react-native-image-picker';
import ReactNativeBlobUtil from 'react-native-blob-util'

import {
  fetchMetadataFromSeeds,
  updateV1,
} from '@metaplex-foundation/mpl-token-metadata';
import Config from 'react-native-config';
import { CandyMachineParams, NftMetadata } from '../types';
import { PublicKey, Umi } from '@metaplex-foundation/umi';
import { waitForTransaction } from '../helpers/wait-for-transaction';
import { fetchMetadataByMint } from './nft-retrieval';

export const PREFIX_URI = 'ipfs://';
export const GATEWAY_HOST = 'https://nftstorage.link/ipfs/';

export async function uploadImage(): Promise<string | undefined> {
  try {
    console.log('Uploading image...');
    // Select an image from the user's device
    const photo = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
    });
    const selectedPhoto = photo?.assets?.[0];
    if (!selectedPhoto?.uri) {
      console.warn('Selected photo not found');
      return;
    }
    const imagePath = selectedPhoto.uri;

    // Read the image file and get the base64 string.
    const imageBytesInBase64: string = await ReactNativeBlobUtil.fs.readFile(
      imagePath,
      'base64',
    );

    // Convert base64 into raw bytes.
    const imageBytes = Buffer.from(imageBytesInBase64, 'base64');

    // Upload to IPFS
    const imageUpload = await uploadToIpfs(imageBytes, 'image/jpg');
    if (!imageUpload) return;

    console.log(
      `The image was uploaded uploaded to ${GATEWAY_HOST}${imageUpload.value.cid}`,
    );
    return `${imageUpload.value.cid}`;
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

export async function uploadToIpfs(
  data: any,
  contentType: 'image/jpg' | 'application/json',
): Promise<{ value: { cid: string } } | undefined> {
  try {
    console.log('Uploading to ipfs...');
    const upload = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${Config.NFT_STORAGE_API_KEY}`,
        'Content-Type': contentType,
      },
      body: data,
    });

    return await upload.json();
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
  }
}

export async function uploadMetadata(
  nftMetadata: NftMetadata,
): Promise<string | undefined> {
  try {
    console.log('Uploading metadata...');
    const metadataUpload = await uploadToIpfs(
      JSON.stringify(nftMetadata),
      'application/json',
    );
    if (!metadataUpload) return;

    console.log(
      `The metadata was uploaded uploaded to ${GATEWAY_HOST}${metadataUpload.value.cid}`,
    );
    return `${metadataUpload.value.cid}`;
  } catch (error) {
    console.error('Error uploading metadata:', error);
  }
}

export async function updateTicketVisits(
  umi: Umi,
  nftMintPublicKey: PublicKey,
): Promise<void> {
  try {
    console.log('Updating ticket`s metadata...');

    const initialMetadata = await fetchMetadataByMint(umi, nftMintPublicKey);
    if (!initialMetadata) return;

    const updatedMetadata = initialMetadata;
    updatedMetadata.attributes[3].value = (
      Number(initialMetadata.attributes[3].value) + 1
    ).toString();

    const cid = await uploadMetadata(updatedMetadata);
    if (!cid) return;

    const nftMetadataAccount = await fetchMetadataFromSeeds(umi, {
      mint: nftMintPublicKey,
    });

    const { signature } = await updateV1(umi, {
      mint: nftMintPublicKey,
      authority: umi.payer,
      data: { ...nftMetadataAccount, uri: `${PREFIX_URI}${cid}` },
    }).sendAndConfirm(umi);
    await waitForTransaction(umi, signature);

    console.log('Ticket`s metadata was successfully updated');
  } catch (error) {
    console.error('Error updating ticket`s metadata:', error);
  }
}

export async function updateEventMetadata(
  umi: Umi,
  collectionMintPublicKey: PublicKey,
  candyMachinePublicKey: PublicKey,
  candyMachineParams: CandyMachineParams,
): Promise<string | undefined> {
  try {
    console.log('Updating event`s metadata...');

    const updatedMetadata = candyMachineParams.metadata;
    updatedMetadata.attributes[0].value =
      candyMachineParams.startDate.toString();
    updatedMetadata.attributes[1].value = candyMachinePublicKey;

    const cid = await uploadMetadata(updatedMetadata);
    if (!cid) return;

    const collectionMetadataAccount = await fetchMetadataFromSeeds(umi, {
      mint: collectionMintPublicKey,
    });

    const { signature } = await updateV1(umi, {
      mint: collectionMintPublicKey,
      authority: umi.payer,
      data: { ...collectionMetadataAccount, uri: `${PREFIX_URI}${cid}` },
    }).sendAndConfirm(umi);
    await waitForTransaction(umi, signature);

    console.log('Event`s metadata was successfully updated');
  } catch (error) {
    console.error('Error updating event`s metadata:', error);
  }
}

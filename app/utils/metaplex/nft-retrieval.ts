import {
  CandyMachineItem,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import {
  DigitalAsset,
  fetchAllDigitalAssetByOwner,
} from '@metaplex-foundation/mpl-token-metadata';
import { EventMetadata, TicketEventPairs, TicketMetadata } from '../types';
import { PublicKey, Umi, publicKey } from '@metaplex-foundation/umi';
import { GATEWAY_HOST, fetchNftMetadata } from './metadata';

export async function fetchCandyMachineItems(
  umi: Umi,
  candyMachinePublicKey: PublicKey,
): Promise<CandyMachineItem[] | undefined> {
  try {
    console.log('Fetching NFTs...');

    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);

    console.log(candyMachine.items);
    return candyMachine.items;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
  }
}

// Fetches NFTs from uri array in parallel
export async function fetchNftsMetadata(
  uris: string[],
): Promise<EventMetadata[] | TicketMetadata[] | undefined> {
  try {
    console.log('Fetching nft(s) metadata...');

    const fetchPromises: Promise<any>[] = [];

    for (const uri of uris) {
      const cid = uri.split('/').pop();
      if (cid?.length !== 59) continue;
      const metadataPromise = fetch(`${GATEWAY_HOST}${cid}`);
      fetchPromises.push(metadataPromise);
    }

    const results = await Promise.all(fetchPromises);
    const jsons = await Promise.all(results.map(r => r.json()));
    console.log(jsons);

    return jsons;
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
  }
}

export async function fetchTicketsByEvent(
  umi: Umi,
  eventPublicKey: PublicKey,
): Promise<String[] | undefined> {
  try {
    console.log('Fetching event tickets...');

    const eventMetadata = await fetchNftMetadata(umi, eventPublicKey);
    if (!eventMetadata) return;

    const candyMachineTrait = eventMetadata.attributes.find(
      trait => trait.trait_type === 'candy_machine',
    );
    if (!candyMachineTrait) {
      throw new Error('Attributes should contain candy machine trait.');
    }

    const candyMachinePublicKey = publicKey(candyMachineTrait.value);
    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);

    console.log(candyMachine.items);
    return candyMachine.items.map(item => item.uri);
  } catch (error) {
    console.error('Error getting tickets by event', error);
  }
}

export async function fetchTicketEventPairsByOwner(
  umi: Umi,
  ownerPublicKey: PublicKey,
): Promise<TicketEventPairs | undefined> {
  try {
    console.log('Fetching ticket-event pairs...');

    const assets = await fetchAllDigitalAssetByOwner(umi, ownerPublicKey);
    const tickets = assets.filter(
      asset => asset.metadata.collection.__option === 'Some',
    );

    const ticketEventPairs: TicketEventPairs = [];

    for (const ticket of tickets) {
      const collectionDetails = ticket.metadata.collection;
      if (collectionDetails.__option === 'None') continue;

      const eventPublicKey = collectionDetails.value.key;

      ticketEventPairs.push({
        ticketPublicKey: publicKey(ticket.publicKey),
        eventPublicKey: publicKey(eventPublicKey),
      });
    }

    console.log(ticketEventPairs);
    return ticketEventPairs;
  } catch (error) {
    console.error('Error fetching ticket-event pairs', error);
  }
}

export async function fetchMyEvents(
  umi: Umi,
): Promise<DigitalAsset[] | undefined> {
  try {
    console.log('Fetching my events...');

    const assets = await fetchAllDigitalAssetByOwner(umi, umi.payer.publicKey);
    const eventAssets = assets.filter(
      asset => asset.metadata.collection.__option === 'None',
    );

    return eventAssets;
  } catch (error) {
    console.error('Error fetching my events', error);
  }
}

import {
  CandyMachineItem,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import { fetchAllDigitalAssetByOwner } from '@metaplex-foundation/mpl-token-metadata';
import { TicketEventPairs, TicketMetadata } from '../types';
import { PublicKey, Umi, publicKey } from '@metaplex-foundation/umi';
import { fetchNftMetadata } from './metadata';

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
): Promise<TicketMetadata[] | undefined> {
  try {
    console.log('Fetching nft(s) metadata...');

    const fetchPromises: Promise<any>[] = [];

    for (const uri of uris) {
      const metadataPromise = (await fetch(uri)).json();
      fetchPromises.push(metadataPromise);
    }

    const results: TicketMetadata[] = await Promise.all(fetchPromises);
    console.log(results);

    return results;
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
): Promise<TicketEventPairs | undefined> {
  try {
    console.log('Fetching ticket-event pairs...');

    const assets = await fetchAllDigitalAssetByOwner(umi, umi.payer.publicKey);
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
): Promise<PublicKey[] | undefined> {
  try {
    console.log('Fetching my events...');

    const assets = await fetchAllDigitalAssetByOwner(umi, umi.payer.publicKey);
    const eventAssets = assets.filter(
      asset => asset.metadata.collection.__option === 'None',
    );

    const events: PublicKey[] = eventAssets.map(
      eventAsset => eventAsset.publicKey,
    );
    console.log(events);
    return events;
  } catch (error) {
    console.error('Error fetching my events', error);
  }
}

import {
  CandyMachineItem,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import {
  DigitalAsset,
  fetchAllDigitalAsset,
  fetchAllDigitalAssetByOwner,
  fetchDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  EventMetadata,
  TicketMetadata,
  TicketsAndRespectiveEvents,
} from '../types';
import { PublicKey, Umi, publicKey } from '@metaplex-foundation/umi';
import { GATEWAY_HOST } from './metadata';
import { EMPTY_EVENT_METADATA } from '../placeholders';

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

export async function fetchMetadataByMint(
  umi: Umi,
  mintPublicKey: PublicKey,
): Promise<EventMetadata | TicketMetadata | undefined> {
  try {
    const uri = (await fetchDigitalAsset(umi, mintPublicKey)).metadata.uri;
    const cid = uri.split('/').pop(); // Extract the last part of the uri i.e. cid

    const response = await fetch(`${GATEWAY_HOST}${cid}`);
    const metadata = await response.json();

    return metadata;
  } catch (error) {
    console.error('Error fetching metadata:', error);
  }
}

// Fetches NFTs from uri array in parallel
export async function fetchMetadatasByUris(
  uris: string[],
): Promise<EventMetadata[] | TicketMetadata[] | undefined> {
  try {
    console.log('Fetching nft(s) metadata...');

    const fetchPromises: Promise<any>[] = [];

    for (const uri of uris) {
      const cid = uri.split('/').pop();
      const metadataPromise = fetch(`${GATEWAY_HOST}${cid}`);
      fetchPromises.push(metadataPromise);
    }

    const responses = await Promise.all(fetchPromises);
    const results = await Promise.allSettled(responses.map(r => r.json()));

    return results.map(result =>
      result.status === 'rejected' ? EMPTY_EVENT_METADATA : result.value,
    );
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
  }
}

export async function fetchTicketsByEvent(
  umi: Umi,
  eventPublicKey: PublicKey,
): Promise<string[] | undefined> {
  try {
    console.log('Fetching event tickets...');

    const eventMetadata = await fetchMetadataByMint(umi, eventPublicKey);
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
): Promise<TicketsAndRespectiveEvents | undefined> {
  try {
    console.log('Fetching ticket-event pairs...');

    const assets = await fetchAllDigitalAssetByOwner(umi, umi.payer.publicKey);

    const ticketsAndRespectiveEvents: TicketsAndRespectiveEvents = {
      events: [],
      tickets: [],
    };

    for (const ticket of assets) {
      const collectionDetails = ticket.metadata.collection;
      if (collectionDetails.__option === 'None') continue;

      ticketsAndRespectiveEvents.events.push(collectionDetails.value.key);
      ticketsAndRespectiveEvents.tickets.push(ticket.mint.publicKey);
    }

    console.log(ticketsAndRespectiveEvents);
    return ticketsAndRespectiveEvents;
  } catch (error) {
    console.error('Error fetching ticket-event pairs', error);
  }
}

export async function fetchEventsByOwner(
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

export async function fetchUrisByMintList(
  umi: Umi,
  mintList: PublicKey[],
): Promise<string[] | undefined> {
  try {
    console.log('Fetching uris by public keys...');

    const assets = await fetchAllDigitalAsset(umi, mintList);
    return assets.map(asset => asset.metadata.uri);
  } catch (error) {
    console.error('Error fetching uris by public keys', error);
  }
}

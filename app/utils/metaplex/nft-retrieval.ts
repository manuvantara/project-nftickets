import {
  CandyMachine,
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
import { EMPTY_EVENT_METADATA } from '../placeholders';
import { uriToPath } from '../helpers/uri-to-path';

export async function fetchCandyMachineItems(
  umi: Umi,
  candyMachinePublicKey: PublicKey,
): Promise<CandyMachineItem[]> {
  try {
    const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);

    return candyMachine.items;
  } catch (error) {
    console.error('fetchCandyMachineItems', error);
    throw new Error('Error fetching NFTs');
  }
}

export async function fetchMetadataByMint(
  umi: Umi,
  mintPublicKey: PublicKey,
): Promise<EventMetadata | TicketMetadata> {
  try {
    const uri = (await fetchDigitalAsset(umi, mintPublicKey)).metadata.uri;
    const path = uriToPath(uri);

    const response = await fetch(path);
    const metadata = await response.json();

    return metadata;
  } catch (error) {
    console.error('fetchMetadataByMint', error);
    throw new Error('Error fetching NFT metadata');
  }
}

// Fetches NFTs from uri array in parallel
export async function fetchMetadatasByUris(
  uris: string[],
): Promise<EventMetadata[] | TicketMetadata[]> {
  try {
    const fetchPromises: Promise<any>[] = [];
    for (const uri of uris) {
      const path = uriToPath(uri);
      const metadataPromise = fetch(path);
      fetchPromises.push(metadataPromise);
    }

    const responses = await Promise.all(fetchPromises);
    const results = await Promise.allSettled(responses.map(r => r.json()));

    return results.map(result =>
      result.status === 'rejected' ? EMPTY_EVENT_METADATA : result.value,
    );
  } catch (error) {
    console.error('fetchMetadatasByUris', error);
    throw new Error('Error fetching NFT metadata');
  }
}

export async function fetchCandyMachineByEvent(
  umi: Umi,
  eventPublicKey: PublicKey,
): Promise<CandyMachine> {
  try {
    const eventMetadata = await fetchMetadataByMint(umi, eventPublicKey);

    const candyMachineTrait = eventMetadata.attributes.find(
      trait => trait.trait_type === 'candy_machine',
    );
    if (!candyMachineTrait) {
      throw new Error('Attributes should contain candy machine trait.');
    }

    const candyMachinePublicKey = publicKey(candyMachineTrait.value);
    return await fetchCandyMachine(umi, candyMachinePublicKey);
  } catch (error) {
    console.error('fetchCandyMachineByEvent', error);
    throw new Error('Error fetching event candy machine');
  }
}

export async function fetchTicketsByEvent(
  umi: Umi,
  eventPublicKey: PublicKey,
): Promise<string[]> {
  try {
    const candyMachine = await fetchCandyMachineByEvent(umi, eventPublicKey);

    return candyMachine.items.map(item => item.uri);
  } catch (error) {
    console.error('fetchTicketsByEvent', error);
    throw new Error('Error fetching event tickets');
  }
}

export async function fetchTicketEventPairsByOwner(
  umi: Umi,
): Promise<TicketsAndRespectiveEvents> {
  try {
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

    return ticketsAndRespectiveEvents;
  } catch (error) {
    console.error('fetchTicketEventPairsByOwner', error);
    throw new Error('Error fetching ticket-event pairs');
  }
}

export async function fetchEventsByOwner(umi: Umi): Promise<DigitalAsset[]> {
  try {
    const assets = await fetchAllDigitalAssetByOwner(umi, umi.payer.publicKey);
    const eventAssets = assets.filter(
      asset => asset.metadata.collection.__option === 'None',
    );

    return eventAssets;
  } catch (error) {
    console.error('fetchEventsByOwner', error);
    throw new Error('Error fetching my events');
  }
}

export async function fetchUrisByMintList(
  umi: Umi,
  mintList: PublicKey[],
): Promise<string[]> {
  try {
    const assets = await fetchAllDigitalAsset(umi, mintList);
    return assets.map(asset => asset.metadata.uri);
  } catch (error) {
    console.error('fetchUrisByMintList', error);
    throw new Error('Error fetching uris by public keys');
  }
}

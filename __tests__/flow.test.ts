import { createCandyMachine, insertNfts, mintNft } from '../app/utils/metaplex/core';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { CandyMachineItem, mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { PublicKey, createSignerFromKeypair, keypairIdentity } from '@metaplex-foundation/umi';
import { CANDY_MACHINE_PARAMS, NFT } from '../app/utils/placeholders';
import { it, expect, describe } from '@jest/globals';


describe('Main Flow', () => {
    const umi = createUmi('https://api.devnet.solana.com')
        .use(mplTokenMetadata())
        .use(mplCandyMachine());

    const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(
        new Uint8Array(JSON.parse("[170, 105, 56, 177, 107, 157, 170, 31, 212, 195, 94, 52, 9, 23, 123, 230, 105, 205, 179, 181, 67, 71, 155, 113, 53, 12, 176, 49, 65, 98, 85, 123, 214, 128, 235, 129, 211, 115, 183, 135, 171, 195, 46, 155, 199, 124, 153, 75, 175, 179, 143, 161, 171, 242, 141, 167, 128, 48, 45, 205, 62, 228, 200, 232]")),
    );

    const authority = createSignerFromKeypair(umi, authorityKeypair);
    umi.use(keypairIdentity(authority));

    it('creates umi', () => expect(umi).toBeDefined());
    it('creates authority', () => expect(authority).toBeDefined());

    let unsafeCandyMachinePublicKey;
    it('creates candy machine', async () => {
        unsafeCandyMachinePublicKey = await createCandyMachine(umi, CANDY_MACHINE_PARAMS);
        expect(unsafeCandyMachinePublicKey).toBeDefined();
    });

    const candyMachinePublicKey = unsafeCandyMachinePublicKey as PublicKey;
    
    /*await insertNfts(umi, candyMachinePublicKey, Array(5).fill(NFT));
    const unsafeItems = await fetchCandyMachineItems(umi, candyMachinePublicKey);
    it('fetches candy machine items', () => {
        expect(unsafeItems).toBeDefined();
        expect(unsafeItems).toHaveLength(5);
    });

    const items = unsafeItems as CandyMachineItem[];
    it('has valid candy machine items', () => {
        for (let item of items) {
            expect(item.uri).toBeDefined();
            expect(NFT.uri).toContain(item.uri);
        }
    });

    const unsafeCollection = await mintNft(umi, candyMachinePublicKey, authority.publicKey);
    it('creates collection', () => expect(unsafeCollection).toBeDefined());

    const collection = unsafeCollection as PublicKey;
    const unsafeTicketUris = await fetchTicketsByEvent(umi, collection);
    it('fetches tickets uris by event (collection)', () => {
        expect(unsafeTicketUris).toBeDefined();
        expect(unsafeTicketUris).toHaveLength(5);
    });

    const ticketUris = unsafeTicketUris as string[];
    const unsafeMetadata = await fetchNftsMetadata(ticketUris);
    it('fetches tickets metadata by event (collection)', () => {
        expect(unsafeMetadata).toBeDefined();
        expect(unsafeMetadata).toHaveLength(5);
    });

    const unsafeOwnerTickets = await fetchTicketEventPairsByOwner(umi);
    it('fetches ticket-event pairs by owner', () => {
        expect(unsafeOwnerTickets).toBeDefined();
        expect(unsafeOwnerTickets).toHaveLength(5);
    });

    const ownerTickets = unsafeOwnerTickets as TicketEventPairs;
    it('has valid owner tickets', () => {
        for (let ticket of ownerTickets) {
            expect(ticket.ticketPublicKey).toBeDefined();
            expect(ticket.eventPublicKey).toBeDefined();     
        }
    });*/
});
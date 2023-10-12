import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { jest, expect, it, describe } from '@jest/globals';
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { PublicKey, Umi, publicKey } from '@metaplex-foundation/umi';
import { fetchNfts } from '../src/utils/nft-tools/nft-retrieval';

jest.mock('@metaplex-foundation/umi-bundle-defaults');

describe("fetchNfts", async () => {
  it("should return the candyMachine items", async () => {
    // Mock the createUmi function
    const mockUmi = jest.fn(() => 
        createUmi('https://api.devnet.solana.com')
        .use(mplTokenMetadata())
        .use(mplCandyMachine()));
    const mockFetchNfts = jest.fn((umi: Umi, candyMachinePublicKey: PublicKey) => fetchNfts(umi, candyMachinePublicKey));

    // Rest of your test code
    const umi = mockUmi();
    const candyMachinePublicKey = publicKey('Ae8c49JXw5E2sj3UMAf3oBJ7PYqYMjWjLxeHaVFpBm8Z');
    const expectedItems = [{"index": 0, "minted": false, "name": "#1", "uri": "ipfs://bafkreidgwakxiplpk2t4yf7b4zmn6pu7ygln3fmftmva7fcb6cm3plf6mq"}, {"index": 1, "minted": false, "name": "#2", "uri": "ipfs://bafkreidgwakxiplpk2t4yf7b4zmn6pu7ygln3fmftmva7fcb6cm3plf6mq"}, {"index": 2, "minted": false, "name": "#3", "uri": "ipfs://bafkreidgwakxiplpk2t4yf7b4zmn6pu7ygln3fmftmva7fcb6cm3plf6mq"}, {"index": 3, "minted": false, "name": "#4", "uri": "ipfs://bafkreidgwakxiplpk2t4yf7b4zmn6pu7ygln3fmftmva7fcb6cm3plf6mq"}, {"index": 4, "minted": true, "name": "#5", "uri": "ipfs://bafkreidgwakxiplpk2t4yf7b4zmn6pu7ygln3fmftmva7fcb6cm3plf6mq"}];
    const result = await mockFetchNfts(umi, candyMachinePublicKey);

    // Assertions
    expect(result).toEqual(expectedItems);
  });
});
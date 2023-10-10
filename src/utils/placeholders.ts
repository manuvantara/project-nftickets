import { ConfigLine } from '@metaplex-foundation/mpl-candy-machine';
import { CandyMachineParams, NftMetadata } from './types';
import { dateTime, publicKey } from '@metaplex-foundation/umi';

export const NFT: ConfigLine = {
  name: '',
  uri: 'ipfs', // link to the uploaded metadata
};

export const NFT_METADATA: NftMetadata = {
  name: 'Atlass Weekend 2023 Ticket',
  description: '',
  image: 'should be first uploaded to ipfs/aws',
  animation_url: '',
  external_url: 'https://atlasfestival.com/',
  attributes: [
    {
      trait_type: 'expiry_time',
      value: '1696603837',
    },
    {
      trait_type: 'ticket_type',
      value: 'VIP',
    },
    {
      trait_type: 'visits_allowed',
      value: '-1',
    },
    {
      trait_type: 'visits',
      value: '0',
    },
  ],
  properties: {
    files: [],
    category: '',
  },
};

export const COLLECTION_METADATA: NftMetadata = {
  name: 'Atlass Weekend 2023',
  description: '',
  image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg', // nftCollectionImageUri
  animation_url: '',
  external_url: 'https://atlasfestival.com/', // event website
  attributes: [
    {
      trait_type: 'start_time',
      value: '1696603837',
    },
    {
      trait_type: 'candy_machine',
      value: '#cadsasdawd',
    },
  ],
  properties: {
    files: [
      {
        uri: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg', // nftCollectionBannerUri
        type: 'image/jpg',
        cdn: true,
      },
    ],
    category: 'banner',
  },
};

export const CANDY_MACHINE_PARAMS: CandyMachineParams = {
  itemsAvailable: 5,

  startDate: dateTime(new Date()),
  pricePerToken: 0.01,
  treasury: publicKey('FSLGMiNAfKAszf6M3zyEVZaZx3mA5ZeQJYBkeAzfKEVm'),

  metadata: COLLECTION_METADATA,
};

export const SOME_CANDY_MACHINE = publicKey(
  'H29kuck8pWXqsTbmkQy7cuMNJ3kXhCdCska7dDwC1nq4',
);

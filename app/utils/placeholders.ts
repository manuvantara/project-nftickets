import { ConfigLine } from '@metaplex-foundation/mpl-candy-machine';
import { CandyMachineParams, EventMetadata, TicketMetadata } from './types';
import { dateTime, publicKey } from '@metaplex-foundation/umi';

export const NFT: ConfigLine = {
  name: '',
  uri: 'bafkreif5bapa3ih2co5r3gvchp5zb24uefvmn3aue5vd3x2bfa7ewtvymi', // only cid
};

export const NFT_METADATA: TicketMetadata = {
  name: '#123123',
  description: '',
  image: 'ipfs://bafybeicolpbcv7e6w7qqd3sexnjyegbtatlddix5qmvtjoozsio3fuezhe',
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
      trait_type: 'allowed_visits',
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

export const COLLECTION_METADATA: EventMetadata = {
  name: 'Atlass Weekend 2023',
  description: '',
  image: 'ipfs://bafybeicolpbcv7e6w7qqd3sexnjyegbtatlddix5qmvtjoozsio3fuezhe', // nftCollectionImageUri
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
        uri: 'ipfs://bafybeicolpbcv7e6w7qqd3sexnjyegbtatlddix5qmvtjoozsio3fuezhe', // nftCollectionBannerUri
        type: 'image/jpg',
        cdn: false,
      },
    ],
    category: 'banner',
  },
};

export const CANDY_MACHINE_PARAMS: CandyMachineParams = {
  itemsAvailable: 5,

  startDate: dateTime(new Date()),
  pricePerToken: 0.01,
  treasury: publicKey('Ec4gukukmjCzbfkkioMHhnGWgPgcuMK7eEafTJ6XowbJ'),

  metadata: COLLECTION_METADATA,
};

export const SOME_CANDY_MACHINE = publicKey(
  '7uZpYgQ4gKvRaM9ShTNtrDJw9wPK47aqa4H17YJeLGUq',
);

export const SOME_NFT_COLLECTION = publicKey(
  '4MJPpHsdZQCi77GP4d9RqX3bNhauGtZC1PnpZoRJuxj3',
);

export const SOME_NFT = publicKey(
  'BWdspE5HaBCg4QKJ7Qw9xgf255UKz6ZRimsQcTXQn1nK',
);

export const EMPTY_EVENT_METADATA: EventMetadata = {
  name: '',
  description: '',
  image: '',
  animation_url: '',
  external_url: '',
  attributes: [
    {
      trait_type: 'start_time',
      value: '',
    },
    {
      trait_type: 'candy_machine',
      value: '',
    },
  ],
  properties: {
    files: [
      {
        uri: '',
        type: 'image/jpg',
        cdn: false,
      },
    ],
    category: 'banner',
  },
};

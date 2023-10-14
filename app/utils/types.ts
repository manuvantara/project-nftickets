import { PublicKey } from '@metaplex-foundation/umi';

export type CandyMachineParams = {
  itemsAvailable: number;

  startDate: bigint;
  pricePerToken: number;
  treasury: PublicKey;

  metadata: EventMetadata;
};

export type NftMetadata = {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  external_url: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  properties: {
    files: {
      uri: string;
      type: string;
      cdn: boolean;
    }[];
    category: string;
  };
};

export type EventMetadata = NftMetadata & {
  attributes: [
    {
      trait_type: 'start_time';
      value: string;
    },
    {
      trait_type: 'candy_machine';
      value: string;
    },
  ];
  properties: {
    files: [
      {
        uri: string;
        type: 'image/jpg';
        cdn: false;
      },
    ];
    category: 'banner';
  };
};

export type TicketMetadata = NftMetadata & {
  attributes: [
    {
      trait_type: 'expiry_time';
      value: string;
    },
    {
      trait_type: 'ticket_type';
      value: string;
    },
    {
      trait_type: 'allowed_visits';
      value: string;
    },
    {
      trait_type: 'visits';
      value: string;
    },
  ];
};

export type TicketsAndRespectiveEvents = {
  events: PublicKey[];
  tickets: PublicKey[];
};

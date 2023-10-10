import { PublicKey } from '@metaplex-foundation/umi';

export type CandyMachineParams = {
  itemsAvailable: number;

  startDate: bigint;
  pricePerToken: number;
  treasury: PublicKey;

  metadata: NftMetadata;
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

import React, { createContext, useEffect, useState } from 'react';
import {
  Umi,
  createSignerFromKeypair,
  keypairIdentity,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import Config from 'react-native-config';

export const UmiContext = createContext<Umi | null>(null);

export default function UmiProvider({ children }: { children: JSX.Element }) {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata())
    .use(mplCandyMachine());

  if (!Config.AUTHORITY_PRIVATE_KEY)
    throw new Error('AUTHORITY_PRIVATE_KEY is not defined');
  const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(JSON.parse(Config.AUTHORITY_PRIVATE_KEY)),
  );
  const authority = createSignerFromKeypair(umi, authorityKeypair);
  umi.use(keypairIdentity(authority));

  return <UmiContext.Provider value={umi}>{children}</UmiContext.Provider>;
}

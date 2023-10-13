import React, { createContext, useEffect, useState } from 'react';
import {
  Umi,
  createSignerFromKeypair,
  keypairIdentity,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { AUTHORITY_PRIVATE_KEY } from '@env';

interface UmiProviderContextType {
  umi: Umi;
}
export const UmiContext = createContext<UmiProviderContextType | null>(null);

export default function UmiProvider({ children }: { children: JSX.Element }) {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata())
    .use(mplCandyMachine());

  const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(JSON.parse(AUTHORITY_PRIVATE_KEY)),
  );
  const authority = createSignerFromKeypair(umi, authorityKeypair);
  umi.use(keypairIdentity(authority));

  return <UmiContext.Provider value={{ umi }}>{children}</UmiContext.Provider>;
}

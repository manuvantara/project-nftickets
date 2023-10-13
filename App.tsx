import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddCircle from './src/images/AddCircle.svg';

import { AUTHORITY_PRIVATE_KEY } from '@env';
import { initializeUmi } from './src/utils/metaplex/core';
import {
  createSignerFromKeypair,
  keypairIdentity,
} from '@metaplex-foundation/umi';

// initialize umi
const umi = initializeUmi();
// initialize signer
const authorityKeypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(JSON.parse(AUTHORITY_PRIVATE_KEY)),
);
const authority = createSignerFromKeypair(umi, authorityKeypair);
umi.use(keypairIdentity(authority));

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>Home Screen</Text>
      <AddCircle width={120} height={120} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

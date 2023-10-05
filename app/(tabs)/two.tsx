// Code taken from Solana mobile expo template

import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CLUSTER,
  ConnectionProvider,
} from '../../components/ConnectionProvider';
import { clusterApiUrl } from '@solana/web3.js';
import { AuthorizationProvider } from '../../components/AuthorizationProvider';
import MainScreen from '../../components/MainScreen';
import { Header } from '../../components/Header';

export const APP_IDENTITY = {
  name: 'Expo Starter Template',
};

export default function App() {
  return (
    <ConnectionProvider
      config={{ commitment: 'processed' }}
      endpoint={clusterApiUrl(CLUSTER)}
    >
      <AuthorizationProvider>
        <SafeAreaView style={styles.shell}>
          <Header />
          <MainScreen />
        </SafeAreaView>
      </AuthorizationProvider>
    </ConnectionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shell: {
    height: '100%',
  },
});

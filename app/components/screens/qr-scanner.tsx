import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import Button from '../button';
import CloseIcon from '../../images/CloseCircle.svg';
import { useIsFocused } from '@react-navigation/native';
import { useAppState } from '@react-native-community/hooks';
import { RootStackScreenProps } from '../../types/navigation';
import { ROUTES } from '../../constants/routes';
import FastImage from 'react-native-fast-image';
import { publicKey } from '@metaplex-foundation/umi';

const dimensions = Dimensions.get('window');

export default async function QRScannerScreen({
  navigation,
}: RootStackScreenProps<'QR Scanner'>) {
  const isFocused = useIsFocused();
  const appState = useAppState();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    // TODO: See if it's the correct size
    regionOfInterest: {
      x: dimensions.width / 2 - 120,
      y: dimensions.height / 2 - 120,
      width: 240,
      height: 240,
    },
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      console.log(`Scanned ${codes.length} codes!`);
      codes.forEach(code => {
        const codeValue: string = code.value as string;
        const publicKeys = codeValue.split(' ');
        let isValid = false;
        
        fetch('https://qr-code-api-c44s.onrender.com/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ticketPublicKey: publicKeys[0],
            eventPublicKey: publicKeys[1],
          }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('isValid');
          console.log(data);
          isValid = data.valid;
        });
    });
  }});

  const isActive = isFocused && appState === 'active';

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (!device) {
    return (
      <View
        style={[
          s.container,
          { alignItems: 'center', justifyContent: 'center' },
        ]}>
        <Text>Camera not available</Text>
        <Button onPress={() => requestPermission()}>Grant permission</Button>
      </View>
    );
  }

  return (
    <View
      style={[s.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <Camera
        device={device}
        style={StyleSheet.absoluteFill}
        isActive={isActive}
        codeScanner={codeScanner}
      />
      <Pressable
        style={s.closeButton}
        onPress={() => navigation.navigate(ROUTES.TAB.INDEX)}>
        <CloseIcon color="black" width={32} height={32} />
      </Pressable>
      <FastImage source={require('../../images/Frame.png')} style={s.image} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 24,
    left: 24,
  },
  image: {
    width: 240,
    height: 240,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

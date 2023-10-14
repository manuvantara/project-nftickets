import React, { useCallback } from 'react';
import { Linking, TouchableOpacity } from 'react-native';

export function ExternalLink({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  const onPress = useCallback(async () => {
    // const supported = await Linking.canOpenURL(url);

    // supported
    //   ? await Linking.openURL(url)
    //   : console.error('Can not handle url: ' + url);

    await Linking.openURL(url);
  }, [url]);

  return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
}

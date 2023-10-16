import React, { useCallback } from 'react';
import { Linking, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {
  url: string;
  children: React.ReactNode;
};

export function ExternalLink({ url, children, ...props }: Props) {
  const onPress = useCallback(async () => {
    // const supported = await Linking.canOpenURL(url);

    // supported
    //   ? await Linking.openURL(url)
    //   : console.error('Can not handle url: ' + url);

    await Linking.openURL(url);
  }, [url]);

  return (
    <TouchableOpacity onPress={onPress} {...props}>
      {children}
    </TouchableOpacity>
  );
}

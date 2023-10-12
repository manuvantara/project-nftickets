module.exports = {
  preset: 'react-native',
  globals: {
    __DEV__: true
  },
  moduleNameMapper: {
    "uuid": require.resolve('uuid'),
    "react-native": require.resolve('react-native'),
    "rn-fetch-blob": require.resolve('rn-fetch-blob'),
    "react-native-image-picker": require.resolve('react-native-image-picker'),
  },
};

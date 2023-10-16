/**
 * @format
 */

import { AppRegistry } from 'react-native';

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
global.Buffer = require('buffer').Buffer;
global.TextEncoder = require('text-encoding').TextEncoder;

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

/**
 * @format
 */

import { AppRegistry } from 'react-native';

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import { TextDecoder } from 'fastestsmallesttextencoderdecoder';
global.Buffer = Buffer;
global.TextDecoder = TextDecoder;

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

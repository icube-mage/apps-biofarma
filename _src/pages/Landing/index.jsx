import React from 'react';
import {StyleSheet} from 'react-native';
import Config from 'react-native-config';
import useRequestPermission from '../../hooks/useRequestPermission';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';

const styles = StyleSheet.create({
  fullScreen: {flex: 1},
});

const Landing = () => {
  useRequestPermission();
  const webViewURL = Config.PWA_BASE_URL;
  const webViewRef = React.useRef(null);
  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `

  /**
   * ---------------------------------------------------- *
   * @function onNavigationStateChange
   * @summary on navigation state change for webview change
   * ---------------------------------------------------- *
   */
  const onNavigationStateChange = webViewState => {
    // const url = webViewState?.url;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']} />
      <WebView
        style={styles.fullScreen}
        ref={webViewRef}
        originWhitelist={['*']}
        source={{uri: webViewURL}}
        geolocationEnabled={true}
        javaScriptEnabled={true}
        onNavigationStateChange={onNavigationStateChange}
        androidHardwareAccelerationDisabled={false}
        cacheEnabled={false}
        overScrollMode="never"
        hideKeyboardAccessoryView
        injectedJavaScript={INJECTEDJAVASCRIPT}
        onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('[err] webview', nativeEvent);
        }}
      />
    </SafeAreaProvider>
  );
};

export default Landing;

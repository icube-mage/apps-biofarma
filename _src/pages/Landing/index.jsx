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
  console.log('webViewURL', webViewURL);
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
        source={{uri: webViewURL}}
        geolocationEnabled={true}
        javaScriptEnabled={true}
        onNavigationStateChange={onNavigationStateChange}
      />
    </SafeAreaProvider>
  );
};

export default Landing;

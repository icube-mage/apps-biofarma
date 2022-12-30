import React from 'react';
import Config from 'react-native-config';
import useRequestPermission from '../../hooks/useRequestPermission';
import {WebView} from 'react-native-webview';

const Landing = () => {
  useRequestPermission();
  const webViewURL = Config.PWA_BASE_URL;
  const webViewRef = React.useRef(null);

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
    <WebView
      ref={webViewRef}
      source={{uri: webViewURL}}
      geolocationEnabled={true}
      javaScriptEnabled={true}
      onNavigationStateChange={onNavigationStateChange}
    />
  );
};

export default Landing;

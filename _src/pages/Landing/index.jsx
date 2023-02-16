import React, {useState} from 'react';
import {
  Button,
  RefreshControl,
  ScrollView,
  View,
  Text,
  Platform,
} from 'react-native';
import Config from 'react-native-config';
import useRequestPermission from '../../hooks/useRequestPermission';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';

const Landing = () => {
  useRequestPermission();
  const webViewRef = React.useRef(null);
  const [isEnabled, setEnabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isWebViewError, setIsWebViewError] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [webViewURL, setWebViewURL] = useState(Config.PWA_BASE_URL);
  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;

  /**
   * ---------------------------------------------------- *
   * @function onNavigationStateChange
   * @summary on navigation state change for webview change
   * ---------------------------------------------------- *
   */
  const onNavigationStateChange = webViewState => {
    const url = webViewState?.url;
    setWebViewURL(url);
  };

  /**
   * ---------------------------------------------------- *
   * @function onRefresh
   * @summary on pull to refresh
   * ---------------------------------------------------- *
   */
  const onRefresh = () => {
    setIsRefreshing(true);
    if (Platform.OS !== 'ios') {
      webViewRef.current.clearCache(true);
      webViewRef.current.reload();
    }
    setIsRefreshing(false);
  };

  /**
   * ---------------------------------------------------- *
   * @function onReload
   * @summary on reload webview after an error
   * ---------------------------------------------------- *
   */
  const onReload = () => {
    setWebViewURL(Config.PWA_BASE_URL);
    setIsWebViewError(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']} />
      <ScrollView
        onLayout={e => setScrollViewHeight(e.nativeEvent.layout.height)}
        refreshControl={
          <RefreshControl
            enabled={isEnabled}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
          />
        }
        showsVerticalScrollIndicator={false}
        style={{flex: 1, height: '100%'}}>
        {isWebViewError ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: scrollViewHeight,
              marginHorizontal: 70,
            }}>
            <Text style={{marginBottom: 10, fontSize: 18, fontWeight: 'bold'}}>
              Oops!
            </Text>
            <Text style={{textAlign: 'center', marginBottom: 20}}>
              Something went wrong. Please press button below to reload.
            </Text>
            <Button
              onPress={onReload}
              title="Reload"
              buttonStyle={{
                backgroundColor: '#FFF',
              }}
            />
          </View>
        ) : (
          <WebView
            androidHardwareAccelerationDisabled={false}
            cacheEnabled={false}
            geolocationEnabled={true}
            hideKeyboardAccessoryView={true}
            injectedJavaScript={INJECTEDJAVASCRIPT}
            javaScriptEnabled={true}
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              setIsWebViewError(true);
              console.warn('[err] webview', nativeEvent);
            }}
            onNavigationStateChange={onNavigationStateChange}
            onScroll={e => setEnabled(e.nativeEvent.contentOffset.y === 0)}
            originWhitelist={['*']}
            overScrollMode="never"
            ref={webViewRef}
            source={{uri: webViewURL}}
            style={{width: '100%', height: scrollViewHeight}}
            userAgent="wrapper-pwa-biofarma"
          />
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Landing;

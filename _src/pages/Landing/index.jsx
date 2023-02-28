import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Button,
  NativeModules,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Config from 'react-native-config';
import useRequestPermission from '../../hooks/useRequestPermission';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';

const Landing = () => {
  useRequestPermission();
  const webViewRef = React.useRef(null);
  const [backPressCount, setBackPressCount] = useState(0);
  const [isCanGoBack, setIsCanGoBack] = useState(false);
  const [isEnabled, setEnabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isWebViewError, setIsWebViewError] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [webViewURL, setWebViewURL] = useState(Config.PWA_BASE_URL);
  const IS_IOS = Platform.OS === 'ios';
  const INJECTED_JAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
  const USER_AGENT = !IS_IOS
    ? 'wrapper-pwa-biofarma-android'
    : 'wrapper-pwa-biofarma-ios';

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, [backPressCount, isCanGoBack]);

  /**
   * ---------------------------------------------------- *
   * @function onLoadProgress
   * @summary on load progress webview
   * ---------------------------------------------------- *
   */
  const onLoadProgress = event => {
    const {nativeEvent} = event;
    setIsCanGoBack(nativeEvent?.canGoBack);
    if (IS_IOS) {
      const url = nativeEvent?.url;
      if (url.startsWith('https://seller.medbiz.id/login')) {
        Linking.openURL(url);
        webViewRef.current.goBack();
      }
    }
  };

  /**
   * ---------------------------------------------------- *
   * @function onNavigationStateChange
   * @summary on navigation state change for webview change
   * ---------------------------------------------------- *
   */
  const onNavigationStateChange = webViewState => {
    const url = webViewState?.url;
  };

  /**
   * ---------------------------------------------------- *
   * @function onRefresh
   * @summary on pull to refresh
   * ---------------------------------------------------- *
   */
  const onRefresh = async () => {
    setIsRefreshing(true);
    if (!IS_IOS) {
      webViewRef.current.clearCache(true);
      webViewRef.current.reload();
    } else {
      await NativeModules.ClearWebviewCache.clearWebviewIOS();
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

  /**
   * ---------------------------------------------------- *
   * @function onBackPress
   * @summary on handle backpress button
   * ---------------------------------------------------- *
   */
  const onBackPress = () => {
    if (isCanGoBack) {
      webViewRef.current.goBack();
      return true;
    } else {
      if (backPressCount === 0) {
        setBackPressCount(1);
        setTimeout(() => setBackPressCount(0), 2000);
        ToastAndroid.show('Press one more time to exit', ToastAndroid.SHORT);
        return true;
      } else if (backPressCount === 1) {
        setBackPressCount(0);
        BackHandler.exitApp();
        return false;
      }
    }
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
            injectedJavaScript={INJECTED_JAVASCRIPT}
            javaScriptEnabled={true}
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              setIsWebViewError(true);
              console.warn('[err] webview', nativeEvent);
            }}
            onLoadProgress={onLoadProgress}
            onNavigationStateChange={onNavigationStateChange}
            onScroll={e => setEnabled(e.nativeEvent.contentOffset.y === 0)}
            originWhitelist={['*']}
            overScrollMode="never"
            ref={webViewRef}
            source={{uri: webViewURL}}
            style={{width: '100%', height: scrollViewHeight}}
            userAgent={USER_AGENT}
          />
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Landing;

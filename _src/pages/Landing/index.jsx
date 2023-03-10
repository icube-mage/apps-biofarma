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
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS, {downloadFile} from 'react-native-fs';

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
  const onLoadProgress = async syntheticEvent => {
    const {nativeEvent} = syntheticEvent;
    setIsCanGoBack(nativeEvent?.canGoBack);
    if (IS_IOS) {
      const url = nativeEvent?.url;
      if (
        url.startsWith('https://seller.medbiz.id/login') ||
        url.startsWith(`${Config.PWA_BASE_URL}/ar`)
      ) {
        Linking.openURL(url)
          .then(() => webViewRef.current.goBack())
          .catch(() => webViewRef.current.goBack());
      }
    }
    if (nativeEvent?.url.startsWith(`${Config.PWA_BASE_URL}`)) {
      // onDownloadFile();
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

  /**
   * ---------------------------------------------------- *
   * @function onDownloadFile
   * @summary on download file
   * ---------------------------------------------------- *
   */
  const onDownloadFile = url => {
    ReactNativeBlobUtil.fetch('GET', url)
      .then(async res => {
        // Get file name
        const contentDispositionHeader =
          res.info().headers['Content-Disposition'];
        const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const match = regex.exec(contentDispositionHeader);
        let fileName = match[1].replace(/['"]/g, '');

        // Adding timestamp to the file name
        const timestamp = new Date().getTime();
        const newFileName = fileName.replace('.', '_' + timestamp + '.');

        const status = res.info().status;
        if (status == 200) {
          const filePath = `${RNFS.DownloadDirectoryPath}/${newFileName}`;
          await RNFS.writeFile(filePath, res.data, 'base64')
            .then(() => {
              console.log('[d] FILE WRITTEN!');
            })
            .catch(err => {
              console.log('[err] RNFS writeFile', err.message);
            });
        }
      })
      .catch(errorMessage => {
        console.log('[err] RNBlob', errorMessage);
      });
  };

  /**
   * ---------------------------------------------------- *
   * @function onMessage
   * @summary on handle onMessage
   * ---------------------------------------------------- *
   */
  const onMessage = event => {
    if (event?.nativeEvent?.data) {
      const parsedData = JSON.parse(event?.nativeEvent?.data);
      if (parsedData?.type) {
        switch (parsedData?.type) {
          case 'DOWNLOAD_ATTACHMENT':
            onDownloadFile(parsedData?.url);
            break;
          default:
            break;
        }
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
            onMessage={onMessage}
            onNavigationStateChange={onNavigationStateChange}
            onScroll={e => setEnabled(e.nativeEvent.contentOffset.y === 0)}
            originWhitelist={['*']}
            overScrollMode="never"
            ref={webViewRef}
            setBuiltInZoomControls={false}
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

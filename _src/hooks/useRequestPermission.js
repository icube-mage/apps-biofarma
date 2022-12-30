import React from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import RNPermissions, {
  PERMISSIONS,
  request,
  requestMultiple,
} from 'react-native-permissions';

const PLATFORM_PERMISSIONS = Platform.select({
  ios: [PERMISSIONS.IOS.LOCATION_ALWAYS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
  android: [
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ],
});

const useRequestPermission = () => {
  const mount = React.useRef(null);
  React.useEffect(() => {
    mount.current = true;
    if (mount.current) {
      requestMultiple(PLATFORM_PERMISSIONS)
        .then(res => {
          console.log('[res] request permission', res);
        })
        .catch(err => {
          console.log('[err] request permission', err);
        });
    }
    return () => {
      mount.current = false;
    };
  }, []);
  return null;
};

export default useRequestPermission;

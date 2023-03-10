/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import Landing from './pages/Landing';

const App = () => {
    const timeoutRef = React.useRef(null);

    React.useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            SplashScreen.hide();
        }, 2000);

        return () => {
            clearTimeout(timeoutRef.current);
        }
    }, []);
    return <Landing />;
};

export default App;

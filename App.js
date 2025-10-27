import React, { useState } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function App({ children }) {
	const [fontsLoaded, setFontsLoaded] = useState(false);

	if (!fontsLoaded) {
		return (
			<AppLoading
				startAsync={() =>
					Font.loadAsync({
						'Blinker-Bold': require('./assets/fonts/Blinker/Blinker-Bold.ttf'),
					})
				}
				onFinish={() => setFontsLoaded(true)}
				onError={console.warn}
			/>
		);
	}

	return children ? children : null;
}

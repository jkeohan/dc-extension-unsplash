import React, { useEffect, useState } from 'react';
import { init } from 'dc-extensions-sdk';
import axios from 'axios';

const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/';
const ACCESS_KEY = '2ZkUE3AQkR9S2T69Egey_tRLEoQ3iagJ0epRSvug3Yw'; // Replace with your access key

const App = () => {
	const [images, setImages] = useState([]);
	const [sdk, setSdk] = useState(null);

	console.log('sdk', sdk);

	useEffect(() => {
		axios
			.get(`${UNSPLASH_API_URL}?client_id=${ACCESS_KEY}`)
			.then((response) => {
				console.log(response.data);
				setImages(response.data);
			})
			.catch((error) => console.log(error));
	}, []);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const setCurrentValue = async () => {
		try {
			const savedValue = await sdk.field.getValue();
			console.log('savedValue', savedValue);
			if (typeof savedValue !== 'undefined') {
				// this.selectItem(savedValue);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		async function initialize() {
			console.log('initialize');
			const sdk = await init();
			setSdk(sdk);

			setCurrentValue();
		}

		initialize();
		// eslint-disable-next-line no-use-before-define
	}, [setCurrentValue]);

	return (
		<div>
			<h1>Unsplash Images</h1>
			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				{images.map((image) => (
					<div key={image.id} style={{ margin: '10px' }}>
						<img
							src={image.urls.small}
							alt={image.description || 'Image from Unsplash'}
							style={{ width: '200px', height: '200px', objectFit: 'cover' }}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default App;

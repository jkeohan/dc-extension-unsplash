import React, { useEffect, useState } from 'react';
import { init } from 'dc-extensions-sdk';
import axios from 'axios';

const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/';
const ACCESS_KEY = '2ZkUE3AQkR9S2T69Egey_tRLEoQ3iagJ0epRSvug3Yw'; // Replace with your access key

const App = () => {
	const [images, setImages] = useState([]);
  const [currentValue, setCurrentValue] = useState({url: '', alt_description: ''});
	const [sdk, setSdk] = useState(null);

	console.log('sdk', sdk);

	useEffect(() => {
		axios
			.get(`${UNSPLASH_API_URL}?client_id=${ACCESS_KEY}`)
			.then((response) => {
				console.log("response", response.data);
				setImages(response.data);
			})
			.catch((error) => console.log(error));
	}, []);

	const setSelectedImage = async ({urls, alt_description }) => {
		try {
			 await sdk.field.setValue({ "url": urls.full, "alt_description": alt_description })
       setCurrentValue({ url: urls.full, alt_description: alt_description });
       const image = await sdk.field.getValue();
       console.log('setSelectedImage', image)
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		async function initialize() {
			const sdk = await init();
      console.log('useEffect - sdk', sdk)
      const savedValue = await sdk.field.getValue();
      if(typeof savedValue !== "undefined" && savedValue.url !== "") {
        setCurrentValue(savedValue);
      }
			console.log('savedValue', savedValue);

			setSdk(sdk);

			// setCurrentValue();
		}

		initialize();
		// eslint-disable-next-line no-use-before-define
	}, []);

    const handleImageClick = (image) => {
			console.log(`Image clicked: ${image.alt_description || 'No description'}`);
			console.log(`Image URL: ${image.urls.full}`);
    
      setSelectedImage(image)
		};

     const handleShowAllImages = () => {
				setCurrentValue({ url: '', alt_description: '' });
			};

      console.log('currentValue', currentValue)

	return (
		<div>
			<h1>Unsplash Images</h1>
			{currentValue.url !== undefined && (
				<button onClick={handleShowAllImages} style={{ marginBottom: '20px' }}>
					Show All Images
				</button>
			)}
			<div style={{ display: 'flex', flexWrap: 'wrap' }}>
				{currentValue.url ? (
					<div style={{ margin: '10px' }}>
						<div>{currentValue.alt_description}</div>
						<img
							src={currentValue.url}
							alt={currentValue.alt_description || 'Selected Image'}
							style={{ width: '200px', height: '200px', objectFit: 'cover' }}
						/>
					</div>
				) : (
					images.map((image) => (
						<div key={image.id} style={{ margin: '10px' }}>
							<div>{currentValue.alt_description}</div>
							<img
								src={image.urls.small}
								alt={image.description || 'Image from Unsplash'}
								style={{ width: '200px', height: '200px', objectFit: 'cover' }}
								onClick={() => handleImageClick(image)}
							/>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default App;

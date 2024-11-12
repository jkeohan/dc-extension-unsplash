import React, { useEffect, useState, useCallback } from 'react';
import { init } from 'dc-extensions-sdk';
import axios from 'axios';
import './App.css';

const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/';
const UNSPLASH_SEARCH_API_URL = 'https://api.unsplash.com/search/photos';
const DEFAULT_ACCESS_KEY = '2ZkUE3AQkR9S2T69Egey_tRLEoQ3iagJ0epRSvug3Yw'; // Replace with your access key

const App = () => {
	const [images, setImages] = useState([]);
	const [currentValue, setCurrentValue] = useState({
		url: '',
		alt_description: ' A land rover is parked on the side of the road',
	});
	const [sdk, setSdk] = useState(null);
	const [query, setQuery] = useState('');
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [accessKey, setAccessKey] = useState(DEFAULT_ACCESS_KEY);

	useEffect(() => {
		async function initializeSdk() {
			try {
				const sdkInstance = await init();
        console.log('SDK initialized:', sdkInstance);
				const savedValue = await sdkInstance.field.getValue();
				if (savedValue?.url) setCurrentValue(savedValue);

				const sdkAccessKey = sdkInstance.params.installation?.api_key;
				setAccessKey(sdkAccessKey || DEFAULT_ACCESS_KEY);
				setSdk(sdkInstance);
			} catch (error) {
				console.error('SDK initialization failed:', error);
			}
		}

		initializeSdk();
	}, []);

	const fetchImages = useCallback(
		async (url, searchQuery = '') => {
			try {
				const response = await axios.get(url, {
					params: {
						client_id: accessKey,
						query: searchQuery,
						per_page: 10,
					},
				});
				setImages(searchQuery ? response.data.results : response.data);
				setIsSearchActive(!!searchQuery);
			} catch (error) {
				console.error('Error fetching images:', error);
			}
		},
		[accessKey]
	);

	useEffect(() => {
		if (!accessKey) return;
		fetchImages(UNSPLASH_API_URL);
	}, [accessKey, fetchImages]);

	const setSelectedImage = async ({ urls, alt_description }) => {
		console.log('setSelectedImage', urls, alt_description);
		try {
			await sdk.field.setValue({ url: urls.full, alt_description });
			setCurrentValue({ url: urls.full, alt_description });
			setIsSearchActive(false);
		} catch (err) {
			console.log(err);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		fetchImages(UNSPLASH_SEARCH_API_URL, query);
	};

	const handleShowAllImages = () => {
		setCurrentValue({ url: '', alt_description: '' });
		setIsSearchActive(false);
		fetchImages(UNSPLASH_API_URL);
	};

	console.log('currentValue', currentValue);

	return (
		<div className='App'>
			<header>
				<h1>Unsplash Images</h1>
				{/* Search Form */}
				<form onSubmit={handleSearch}>
					<input
						type='text'
						placeholder='Search for images...'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						style={{ marginRight: '10px', padding: '8px' }}
					/>
					<button className='ampx-button ampx-button__primary' type='submit'>
						Search
					</button>
				</form>

				{/* Show All Button */}
				{currentValue.url && (
					<button
						className='ampx-button ampx-button__primary'
						onClick={handleShowAllImages}
						style={{ margin: '20px 0px' }}>
						Show All Images
					</button>
				)}
			</header>
			<div className='image-container'>
				{currentValue.url && !isSearchActive ? (
					<div className='image-item'>
						<div>{currentValue.alt_description}</div>
						<img
							src={currentValue.url}
							alt={currentValue.alt_description || 'Selected Image'}
							style={{ width: '200px', height: '200px', objectFit: 'cover' }}
						/>
					</div>
				) : (
					images.map((image) => (
						<div className='image-item' key={image.id}>
							<div>{currentValue.alt_description}</div>
							<img
								src={image.urls.small}
								alt={image.description || 'Image from Unsplash'}
								style={{ width: '200px', height: '200px', objectFit: 'cover' }}
								onClick={() => setSelectedImage(image)}
							/>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default App;
import React, { useEffect, useState } from 'react';
import { useSdk } from './useSdk';
import axios from 'axios';
import './App.css';

const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/';
const UNSPLASH_SEARCH_API_URL = 'https://api.unsplash.com/search/photos';

const App = () => {
	const { sdk, url, alt_description, apiKey } = useSdk(null);
	const [images, setImages] = useState([]);
	const [currentValue, setCurrentValue] = useState(null);
	const [query, setQuery] = useState('');
	const [isSearchActive, setIsSearchActive] = useState(false);

	useEffect(() => {
		if (sdk && url) {
			setCurrentValue({ url, alt_description });
		}
	}, [alt_description, sdk, url]);

	const fetchImages = async (url, searchQuery = '') => {
		console.log('fetchImages - apiKey', apiKey);
		try {
			const response = await axios.get(url, {
				params: {
					client_id: apiKey,
					query: searchQuery,
					per_page: 10,
				},
			});
			setImages(searchQuery ? response.data.results : response.data);
			setIsSearchActive(!!searchQuery);
		} catch (error) {
			console.error('Error fetching images:', error);
		}
	};

	useEffect(() => {
		console.log('useEffect - apiKey', apiKey);
		if (!apiKey) return;
		fetchImages(UNSPLASH_API_URL);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [apiKey]);

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
		setQuery('');
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
				{currentValue && currentValue.url && (
					<button
						className='ampx-button ampx-button__primary'
						onClick={handleShowAllImages}>
						Show All Images
					</button>
				)}
			</header>

			<div className='image-container'>
				{currentValue && currentValue.url && !isSearchActive ? (
					// Render Currently Selected Image
					<div className='image-item'>
						<div>{currentValue.alt_description}</div>
						<img
							src={currentValue.url}
							alt={
								currentValue.alt_description || 'no alt description available'
							}
						/>
					</div>
				) : (
					// Render All Images
					images.map((image) => (
						<div className='image-item' key={image.id}>
							<div>{image.alt_description}</div>
							<img
								src={image.urls.small}
								alt={image.description || 'Image from Unsplash'}
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

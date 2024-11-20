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
		if (!apiKey) return;
		fetchImages(UNSPLASH_API_URL);
	}, [apiKey]);

	const setSelectedImage = async ({ urls, alt_description }) => {
		try {
			await sdk.field.setValue({ url: urls.full, alt_description });
			setCurrentValue({ url: urls.full, alt_description });
			setIsSearchActive(false);
			// Focus the selected image
			document.getElementById('selected-image').focus();
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

	return (
		<div className='App'>
			<header>
				<h1>Unsplash Images</h1>
				<form onSubmit={handleSearch} aria-label='Search Unsplash Images'>
					<input
						id='search-input'
						aria-label='Search Unsplash Images'
						type='text'
						placeholder='Search for images...'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<button
						className='ampx-button ampx-button__primary'
						type='submit'
						aria-label='Search'>
						Search
					</button>
				</form>

				{currentValue && currentValue.url && (
					<button
						className='ampx-button ampx-button__primary'
						onClick={handleShowAllImages}
						aria-label='Show all images'>
						Show All Images
					</button>
				)}
			</header>

			<main>
				<section
					className='image-container'
					aria-label='Image Gallery'>
					{currentValue && currentValue.url && !isSearchActive ? (
						<article className='image-item' tabIndex='0' id='selected-image'>
							<p>
								{currentValue.alt_description || 'No description available'}
							</p>
							<img
								src={currentValue.url}
								alt={
									currentValue.alt_description || 'No alt description available'
								}
								aria-labelledby='selected-image'
							/>
						</article>
					) : (
						images.map((image) => (
							<article
								className='image-item'
								key={image.id}
								tabIndex='0'
								role='button'
								aria-label={`Select image: ${
									image.alt_description || 'No description available'
								}`}
								onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(image)}
								onClick={() => setSelectedImage(image)}>
								<p>{image.alt_description || 'No description available'}</p>
								<img
									src={image.urls.small}
									alt={image.description || 'Image from Unsplash'}
								/>
							</article>
						))
					)}
				</section>
			</main>
		</div>
	);
};

export default App;
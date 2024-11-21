import React, { useEffect, useState, useCallback } from 'react';
import { useSdk } from './useSdk';
import { fetchImages, searchImages } from './services/unsplashAPI';
import './App.css';

const App = () => {
	const { sdk, url, alt_description, apiKey } = useSdk(null);
	const [images, setImages] = useState([]);
	const [currentValue, setCurrentValue] = useState(null);
	const [query, setQuery] = useState('');
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (sdk && url) {
			setCurrentValue({ url, alt_description });
		}
	}, [sdk, url, alt_description]);

	const loadImages = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const imageResults = await fetchImages(apiKey);
			setImages(imageResults);
		} catch (error) {
			console.error('Error loading images:', error);
			setError('Failed to load images. Please try again.');
		} finally {
			setIsLoading(false);
		}
	}, [apiKey]);

	const searchForImages = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const searchResults = await searchImages(apiKey, query);
			setImages(searchResults);
			setIsSearchActive(true);
		} catch (error) {
			console.error('Error searching for images:', error);
			setError('Failed to search images. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (apiKey) {
			loadImages();
		}
	}, [apiKey, loadImages]);

	const setSelectedImage = async ({ urls: { full }, alt_description }) => {
		try {
			await sdk.field.setValue({ url: full, alt_description });
			setCurrentValue({ url: full, alt_description });
			setIsSearchActive(false);
			document.getElementById('selected-image').focus();
		} catch (err) {
			console.error('Error setting selected image:', err);
			setError('Failed to select image. Please try again.');
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (query) {
			searchForImages();
		} else {
			loadImages();
		}
	};

	const handleShowAllImages = () => {
		setCurrentValue({ url: '', alt_description: '' });
		setIsSearchActive(false);
		setQuery('');
		loadImages();
	};

	return (
		<div className='App'>
			<header>
				<h1>Unsplash Images</h1>
				<form onSubmit={handleSearch} aria-label='Search Unsplash Images'>
					<input
						id='search-input'
						type='text'
						placeholder='Search for images...'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						aria-label='Search Unsplash Images'
					/>
					<button
						type='submit'
						className='ampx-button ampx-button__primary'
						aria-label='Search'>
						Search
					</button>
				</form>

				{currentValue?.url && (
					<button
						className='ampx-button ampx-button__primary'
						onClick={handleShowAllImages}
						aria-label='Show all images'>
						Show All Images
					</button>
				)}
			</header>

			<main>
				{isLoading && <p>Loading images...</p>}
				{error && <p className='error'>{error}</p>}

				<section className='image-container' aria-label='Image Gallery'>
					{!isLoading && currentValue?.url && !isSearchActive ? (
						<article className='image-item' tabIndex='0' id='selected-image'>
							<p>
								{currentValue.alt_description || 'No description available'}
							</p>
							<img
								src={currentValue.url}
								alt={currentValue.alt_description || 'Selected Unsplash image'}
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

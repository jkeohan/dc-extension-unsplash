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

	useEffect(() => {
		console.log('useEffect - sdk:', sdk, apiKey);
		if (sdk && url) {
			setCurrentValue({ url, alt_description });
		}
	}, [alt_description, apiKey, sdk, url]);

	const loadImages = useCallback(async () => {
		try {
			const imageResults = await fetchImages(apiKey);
			setImages(imageResults);
		} catch (error) {
			console.error('Error loading images:', error);
		}
	}, [apiKey]);

	const searchForImages = async () => {
		console.log('searchForImage - apiKey, query', apiKey, query);
		try {
			const searchResults = await searchImages(apiKey, query);
			console.log('searchResults:', searchResults);
			setImages(searchResults);
			setIsSearchActive(true);
		} catch (error) {
			console.error('Error searching for images:', error);
		}
	};

	useEffect(() => {
		if (!apiKey) return;

		const fetchData = async () => {
			const results = await loadImages(apiKey);
			console.log('useEffect - results:', results);
			if (results) {
				setImages(results);
			}
		};

		fetchData();
	}, [apiKey, loadImages]);

	const setSelectedImage = async ({ urls: { full }, alt_description }) => {
		try {
			await sdk.field.setValue({ url: full, alt_description });
			setCurrentValue({ url: full, alt_description });
			setIsSearchActive(false);
			// Focus the selected image
			document.getElementById('selected-image').focus();
		} catch (err) {
			console.log(err);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (query) {
			searchForImages();
		} else {
			loadImages(); // Reload default images if search query is cleared
		}
	};

	const handleShowAllImages = () => {
		setCurrentValue({ url: '', alt_description: '' });
		setIsSearchActive(false);
		setQuery('');
		const fetchData = async () => {
			const results = await loadImages(apiKey);
			console.log('useEffect - results:', results);
			if (results) {
				setImages(results);
			}
		};

		fetchData();
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
				<section className='image-container' aria-label='Image Gallery'>
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

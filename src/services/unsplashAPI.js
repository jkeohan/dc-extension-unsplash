import axios from 'axios';
import {
	UNSPLASH_API_URL,
	UNSPLASH_SEARCH_API_URL,
} from '../utils/constants';

// Fetch general Unsplash images
export const fetchImages = async (apiKey) => {
	try {
		const response = await axios.get(UNSPLASH_API_URL, {
			params: {
				client_id: apiKey,
				per_page: 10,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching images:', error);
		throw error;
	}
};

// Search Unsplash images by query
export const searchImages = async (apiKey, query) => {
	try {
		const response = await axios.get(UNSPLASH_SEARCH_API_URL, {
			params: {
				client_id: apiKey,
				query,
				per_page: 10,
			},
		});
		return response.data.results;
	} catch (error) {
		console.error('Error searching images:', error);
		throw error;
	}
};

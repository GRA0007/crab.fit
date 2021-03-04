import axios from 'axios';

export const instance = axios.create({
	baseURL: 'http://localhost:8080',
	timeout: 1000 * 300,
	headers: {
		'Content-Type': 'application/json',
	},
});

const handleError = error => {
	if (error.response && error.response.status) {
		console.log('[Error handler] res:', error.response);
	}
	return Promise.reject(error.response);
};

const api = {
	get: async (endpoint, data) => {
		try {
			const response = await instance.get(endpoint, data);
			return Promise.resolve(response);
		} catch (error) {
			return handleError(error);
		}
	},
	post: async (endpoint, data, options = {}) => {
		try {
			const response = await instance.post(endpoint, data, options);
			return Promise.resolve(response);
		} catch (error) {
			return handleError(error);
		}
	},
	patch: async (endpoint, data) => {
		try {
			const response = await instance.patch(endpoint, data);
			return Promise.resolve(response);
		} catch (error) {
			return handleError(error);
		}
	},
};

export default api;

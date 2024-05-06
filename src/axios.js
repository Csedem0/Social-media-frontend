import axios from 'axios';

const baseURL = 'https://social-media-xrma.onrender.com/api/';

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		Authorization: localStorage.getItem('access_token')
			? 'JWT ' + localStorage.getItem('access_token')
			: null,
		'Content-Type': 'application/json',
		accept: 'application/json',
	},
});

axiosInstance.interceptors.response.use(
	(response) => {
	  return response;
	},
	async function (error) {
	  const originalRequest = error.config;
  
	  // Check if it's a server/network error or CORS issue
	  if (typeof error.response === 'undefined') {
		// Log the error and return a Promise rejection
		console.error('A server/network error occurred:', error);
		return Promise.reject(error);
	  }
  
	  // Handle 401 Unauthorized errors
	  if (
		error.response.status === 401 &&
		originalRequest.url === baseURL + 'token/refresh/'
	  ) {
		// Redirect to the login page
		window.location.href = '/login/';
		return Promise.reject(error);
	  }
  
	  // Handle token expiration errors
	  if (
		error.response.data.code === 'token_not_valid' &&
		error.response.status === 401 &&
		error.response.statusText === 'Unauthorized'
	  ) {
		const refreshToken = localStorage.getItem('refresh_token');
  
		if (refreshToken) {
		  const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
		  const now = Math.ceil(Date.now() / 1000);
  
		  if (tokenParts.exp > now) {
			// Try to refresh the token
			try {
			  const response = await axiosInstance.post('/token/refresh/', {
				refresh: refreshToken,
			  });
  
			  // Update tokens and retry the original request
			  localStorage.setItem('access_token', response.data.access);
			  localStorage.setItem('refresh_token', response.data.refresh);
			  axiosInstance.defaults.headers['Authorization'] =
				'JWT ' + response.data.access;
			  originalRequest.headers['Authorization'] =
				'JWT ' + response.data.access;
  
			  return axiosInstance(originalRequest);
			} catch (refreshError) {
			  console.error('Error refreshing token:', refreshError);
			}
		  } else {
			console.log('Refresh token is expired:', tokenParts.exp, now);
			// Redirect to the login page
			window.location.href = '/login/';
		  }
		} else {
		  console.log('Refresh token not available.');
		  // Redirect to the login page
		  window.location.href = '/login/';
		}
	  }
  
	  // Log other errors and return a Promise rejection
	  console.error('Error:', error);
	  return Promise.reject(error);
	}
  );

export default axiosInstance;

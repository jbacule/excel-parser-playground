import axios from 'axios';

const Api = axios.create({
	headers: {
		'content-type': 'application/json'
	},
	timeout: 60000
});

Api.interceptors.request.use(
	config => {
		return Promise.resolve(config);
	},
	error => {
		return Promise.reject(error);
	}
);

Api.interceptors.response.use(
  response => {
		return Promise.resolve(response);
	},
  error => {
    return Promise.reject(error.response);
  }
);

export default Api;
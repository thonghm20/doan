import axios from 'axios'
const instance = axios.create({
    baseURL: "http://localhost:3030/api",
  });

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    let localStorage = window.localStorage.getItem('persist:shop/user')
    if(localStorage && typeof localStorage === 'string') {
      localStorage = JSON.parse(localStorage)
      const accessToken = JSON.parse(localStorage?.token)
      config.headers = {authorization:  `Bearer ${accessToken}` }
      return config;
    }else return config
  
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error.response.data;
  });

  export default instance
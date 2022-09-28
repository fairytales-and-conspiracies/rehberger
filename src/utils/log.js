export const logError = (e) => {
  if (e.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    console.log('Server responded');
    console.log('Data:', e.response.data);
    console.log('Status', e.response.status);
    console.log('Headers', e.response.headers);
  } else if (e.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    console.log('Server did not respond');
    console.log('Request:', e.request);
  } else {
    // Something happened in setting up the request and triggered an Error
    console.log('Config error');
    console.log('Message:', e.message);
  }

  console.log('Config:', e.config);
};

'use strict';

const api_key = 'f4d5de1c1540c3260c4329d336dbb019';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

/**
 * fetch data from a server using the `url` and passes
 * the result in JSON data to a `callback` function,
 * along with an optional parameter if has `optionalParam`.
 * optionalParam provides parameters to the callback function if needed
 */

const fetchDataFromServer = function (url, callback, optionalParam) {
    fetch(url)
      .then(response => response.json())
      .then(data => callback(data, optionalParam));
  }

  export { imageBaseURL, api_key, fetchDataFromServer };

  /*When to Use the Callback Function
Callbacks ensure that the function will not run before the task is completed but will run right after the task is completed. It develops asynchronous JavaScript code and keeps them safe from errors. In JavaScript, the way to create a callback function is to pass it as a parameter to another function and then call it back after the task is completed.

There are ways to handle callbacks.

Use of Promise: A promise can be generated for each callback. When the callback is successful, the promise is resolved, and if the callback fails, the promise is rejected.
Use of Async-Await: Asynchronous functions are executed sequentially with the use of await; execution stops until the promise is revolved and function execution is successful.
*/
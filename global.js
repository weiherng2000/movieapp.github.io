'use strict';//activates strict mode so no undeclared variables allowed


/**
 * Add event on multiple elements
 * elements are the elements we are trying to find such as p,div
 * eventType is like onclick or hover
 * callBack is the function we execute when eventType occurs
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (const elem of elements) elem.addEventListener(eventType, callback);
}

/**
 * Toggle search box in mobile device || small screen
 * searchBox finds the nearest element with the search-box attribute
 * searchTogglers finds all elements with the search-toggler attribute
 * so when any searchTogglers element are clicked we execute the function
 * to toggle between active or not in the searchBox element
 */

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchTogglers, "click", function () {
  searchBox.classList.toggle("active");
});


/**
 * store movieId in `localStorage`.
 * when you click any movie card
 */

const setMovieDetail = function (movieId) {
  window.localStorage.setItem("movieId", String(movieId));
}



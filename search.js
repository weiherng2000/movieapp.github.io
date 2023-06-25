'use-strict';

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./moviecard.js";

export function search()
{
    /*from the header element*/
    const searchWrapper = document.querySelector("[search-wrapper]");
    const searchField = document.querySelector("[search-field]");

    /*create the search element list when we search something*/
    const searchResultModal = document.createElement("div");
    searchResultModal.classList.add("search-modal");
    document.querySelector("main").appendChild(searchResultModal);

    let searchTimeout;
    /*activate event when input something into the search field*/
    searchField.addEventListener("input", function () {
        /*searchField.value retrieves the value entered into the input field.*/
        /*!searchField.value.trim() checks if the trimmed value is an empty string or consists only of whitespace*/
        if (!searchField.value.trim()) {
            searchResultModal.classList.remove("active");
            searchWrapper.classList.remove("searching");
            clearTimeout(searchTimeout);
            return;
        }
        /*If the condition is true (i.e., the search field is empty or contains only whitespace):
        *searchResultModal.classList.remove("active") removes the CSS class "active" from the element with the class searchResultModal.
        *searchWrapper.classList.remove("searching") removes the CSS class "searching" from the element with the class searchWrapper.
        *clearTimeout(searchTimeout) cancels a previously scheduled timeout, specified by searchTimeout.
        *return exits the function or code block where this code is located.
        *
        */
        
        /*if search input field not empty*/
        searchWrapper.classList.add("searching");
        /*This cancels any previously scheduled timeout associated with the searchTimeout variable. 
        This step ensures that any previously set timeout is cleared before scheduling a new one.*/
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(function () {
        /*fetch data from the server using the searchvalue*/
        /*delay of 5 seconds after searching*/
        fetchDataFromServer(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`, function ({ results: movieList }) {

            searchWrapper.classList.remove("searching");
            searchResultModal.classList.add("active");
            searchResultModal.innerHTML = ""; // remove old results

            searchResultModal.innerHTML = `
            <h1 class="label">Results for</h1>
            
            <h1 class="heading">${searchField.value}</h1>
            
            <div class="movie-list">
                <div class="grid-list"></div>
            </div>
            `;

            for (const movie of movieList) {
            const movieCard = createMovieCard(movie);

            searchResultModal.querySelector(".grid-list").appendChild(movieCard);
            }

        });

        }, 500);

    });
}
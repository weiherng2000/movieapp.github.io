'use strict';

import { api_key, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./moviecard.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");
// collectc genre name & url parameter from local storage
const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");

sidebar();
/*url param controls what we will fetch data by e.g genre,language etc*/

let currentPage = 1;
let totalPages = 0;

fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`, function ({ results: movieList, total_pages }) 
{
    /*total_pages is 998 in numerical value*/
    totalPages = total_pages;
    document.title = `${genreName} Movies `;
  
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list", "genre-list");
    movieListElem.ariaLabel = `${genreName} Movies`;
  
    movieListElem.innerHTML = `
      <div class="title-wrap">
        <h1 class="heading">All ${genreName} Movies</h1>
      </div>
      
      <div class="grid-list"></div>
      
      <button class="btn load-more" load-more>Load More</button>
    `;

    /**
   * add movie card based on fetched item
   */
    for (const movie of movieList) {
        const movieCard = createMovieCard(movie);

        movieListElem.querySelector(".grid-list").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);

    /**
   * load more button functionality
   */

    document.querySelector("[load-more]").addEventListener("click", function (){

        if (currentPage >= totalPages) 
        {
            this.style.display = "none"; // this == loading-btn
            return;
        }
        /*since currentpage is lesser than totalPage we increment the currentpage*/
        currentPage++;
        this.classList.add("loading"); // this == loading-btn and loading is for the loading animation
        /*fetch the next page of data using the fetchdata function*/
        fetchDataFromServer(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`, ({ results: movieList }) => {
        this.classList.remove("loading"); // this == loading-btn

        for (const movie of movieList) {
            const movieCard = createMovieCard(movie);

            movieListElem.querySelector(".grid-list").appendChild(movieCard);
        }
        });

    })



})

search();
'use-strict';

import { imageBaseURL } from "./api.js";

/*create our moviecard here*/

export function createMovieCard(movie)
{

    const {
        poster_path,
        title,
        vote_average,
        release_date,
        id
      } = movie;
    

    const moviecardelem = document.createElement("div");
    moviecardelem.classList.add("movie-card");

    moviecardelem.innerHTML = `

    <figure class = "poster card-banner">
        <img src = "${imageBaseURL}w400${poster_path}" alt = "${title}"class = "img-cover" loading = "eager">
    </figure>
    <h4 class = "title">${title}</h4>
    <div class = "meta-list">
        <img src = "assets/images/star.png" alt = "star" height = "24px" width = "24px">
        <div class="rating">${vote_average.toFixed(1)}</div>
        <div class="year">${release_date.split('-')[0]}</div>
    </div>
    <a href = "./moviedetail.html" class = "card-btn"  title="${title}"></a>
    
  `;

  return moviecardelem;


   
}

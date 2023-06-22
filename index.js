'use-strict'

import {sidebar} from "./sidebar.js";
import { api_key,fetchDataFromServer,imageBaseURL } from "./api.js";

//call the sidebar function to activate the sidebar
sidebar();

//find the element with page-content attribute which is the container
const pageContent = document.querySelector("[page-content]");

/**
 * fetch all genres eg: [ { "id": "123", "name": "Action" } ]
 * then change genre formate eg: { 123: "Action" }
 */
const genreList = 
{
    // create genre string from genre_id eg: [23, 43] -> "Action, Romance".
    asString(genreIdList)
    {
        //this new list will store only the strings of genre no id
        let newGenreList = [];

        for(const genreId of genreIdList)
        {
            //if genreList[genreId] exists we push it to the list
            if (this[genreId])
            {
                newGenreList.push(this[genreId]);// this == genreList;
            }
        }
        //join returns an array as a String with the ',' as a separator

        return  newGenreList.join(", ");


    }

};

fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
    
        for (const { id, name } of genres) {
        genreList[id] = name;
        }

        //fetch popular movies
        fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`, heroBanner);

});



/*we destructure the results from the fetch data api which is the json data into movieList*/
const heroBanner = function({ results: movieList })
{
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.ariaLabel = "Popular Movies";

    banner.innerHTML = `

    <div class="banner-slider">
    </div>

    <div class = "slider-control">
    </div>
    
    `

    let controlItemIndex = 0;
    /*now for the logic of the main banner */
    for (const [index, movie] of movieList.entries()) 
    {
        /*this is the object from the api results/movieList*/
        /*we destructure the movie object into different variables here*/
        const {
            backdrop_path,
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id
          } = movie;

          const sliderItem = document.createElement("div");
          sliderItem.classList.add("slider-item");
          sliderItem.setAttribute("slider-item", "");
          
            /*backdrop path contains the file path for the image w1280 sepcifies the width to be 1280
            *Release date if true has to split as the data is in 2023-05-01 so we only the year
            *year is first index 0 so we split by the "-"
            *ToFixed defines the number of decimal place ToFixed(1) is 1dp
            */
          sliderItem.innerHTML = `
          <div class="slider-item">
             <img src = "${imageBaseURL}w1280${backdrop_path}" alt = "${title}"class = "img-cover" loading = ${index === 0 ? "eager" : "lazy"
            }>
             <div class="banner-content">

                <h2 class = "heading">${title}</h2>

                <div class="meta-list">
                  <div class="year">${release_date?.split("-")[0] ?? "Not Released"}</div>
                  <div class="rating">${vote_average.toFixed(1)}</div>
                </div>

                <p class = "Genre">${genreList.asString(genre_ids)}</p>
                <p class = "synopsis">${overview}</p>
                <a href="./moviedetail.html" class = "watch-btn">
                    <img src = "assets/images/watch button.png" alt = "Watch now" height = 80px; width = 60px;>
                </a>

              </div>
           </div>
          
          `//add the slider item into the empty banner-slider element*/
          banner.querySelector(".banner-slider").appendChild(sliderItem);

          const controlItem = document.createElement("button");
          controlItem.classList.add("slider-button");
          controlItem.setAttribute("slider-control", `${controlItemIndex}`);

          controlItemIndex++;

          controlItem.innerHTML = `
            <img src = "assets/images/left-arrow.png" height = "100px"  width = "80px" class = "arrow">
            `;
           const controlItem2 = document.createElement("button");
           controlItem2.classList.add("slider-button");
           controlItem2.setAttribute("slider-control", `${controlItemIndex}`);

           controlItem2.innerHTML = `
            <img src = "assets/images/right-arrow.png" height = "100px"  width = "80px" class = "arrow">
            `;

           banner.querySelector(".slider-control").appendChild(controlItem);
           banner.querySelector(".slider-control").appendChild(controlItem2);
      
    }
    
    /*add the content to the article container*/
    pageContent.appendChild(banner);


}

heroBanner();


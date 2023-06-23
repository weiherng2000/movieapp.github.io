'use-strict'

import {sidebar} from "./sidebar.js";
import { api_key,fetchDataFromServer,imageBaseURL } from "./api.js";
import { createMovieCard } from "./moviecard.js";
//call the sidebar function to activate the sidebar
sidebar();

/**
 * Home page sections (Top rated, Upcoming, Trending movies)
 */

const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming"
  },
  {
    title: "Weekly Trending Movies",
    path: "/trending/movie/week"
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated"
  }
]

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
    /*we use.entries for arrays only*/
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

           
          <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" loading=${index === 0 ? "eager" : "lazy"
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
        
          
          `//add the slider item into the empty banner-slider element*/
          banner.querySelector(".banner-slider").appendChild(sliderItem);


         
    }
    
    /*add the left and right buttons*/
    const controlItem = document.createElement("button");
    controlItem.classList.add("slider-button-left");

    /*left button added*/
    controlItem.innerHTML = `
      <img src = "assets/images/left-arrow.png" height = "100px"  width = "80px" class = "arrow">
      `;
     const controlItem2 = document.createElement("button");
     controlItem2.classList.add("slider-button-right");
     
     /*right button added*/
     controlItem2.innerHTML = `
      <img src = "assets/images/right-arrow.png" height = "100px"  width = "80px" class = "arrow">
      `;

     banner.querySelector(".slider-control").appendChild(controlItem);
     banner.querySelector(".slider-control").appendChild(controlItem2);
    
    /*add the content to the article container*/
    pageContent.appendChild(banner);

    /*add functionality to he left and right button*/
    addHeroSlide();

    for(const{title,path} of homePageSections)
    {
        fetchDataFromServer(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`, createMovieList, title);
    }

}


const addHeroSlide = function()
{
  /*currentslide is index 0*/
  var currentSlide = 0;
  /*select all banner slide elements*/
  const sliderItems = document.querySelectorAll("[slider-item]");


  /*checker will check whether current index matches the array slideindex,slideIndex is a parameter of ForEach*/
  const checker = (index) => {
    sliderItems.forEach((slide, slideIndex) => {
      if (slideIndex === index) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });
  };

  checker(0);

  
  

  /*next and pre buttons will ensure the currentslide variable will not exceed the max length*/
  
  const next = () => {
    currentSlide >= sliderItems.length - 1 ? currentSlide = 0 : currentSlide++;
    checker(currentSlide);
  }

  const prev = () => {
    currentSlide <= 0 ? currentSlide = sliderItems.length - 1 : currentSlide--;
    checker(currentSlide);
  }

  
document.querySelector(".slider-button-right").addEventListener("click", next);
document.querySelector(".slider-button-left").addEventListener("click", prev);

  

}
/*We destructure the results from the to movieList again*/
/*we pass in the api data into the callback function */ 
/*title is the optionalParam here*/
/*movieList is the destructured object that has results saved into*/
const createMovieList = function( {results: movieList},title){

  const movieListelem = document.createElement("section");
  movieListelem.classList.add("movie-list");
  movieListelem.ariaLabel = `${title}`;

 
  movieListelem.innerHTML = `

    <div class="title-wrap">
       <h3 class = "title-card">${title}</h3>
    </div>
    <div class="slider-list">
      <div class="innerlist">
      </div>
    </div>
    
  `;

  for (const movie of movieList) 
  {
    const movieCard = createMovieCard(movie); // called from movie_card.js
    movieListelem.querySelector(".innerlist").appendChild(movieCard);
  }

  pageContent.appendChild(movieListelem);
      
 



}



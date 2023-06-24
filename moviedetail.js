'use-strict';

import { api_key,imageBaseURL,fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./moviecard.js";
import{ sidebar} from "./sidebar.js";

/*The window object represents an open window in a browser.*/
/*If a document contain frames (<iframe> tags), the browser creates one window object for the HTML document, 
and one additional window object for each frame.*/
/*The localStorage object allows you to save key/value pairs in the browser.*/
/*getItem will return null if there is nothing inside currently*/
const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

sidebar();


const getGenres = function(genres)
{
    const genreList = [];

    for(const {name} of genres )
    {
        genreList.push(name);
    }

    return genreList.join(",");
}

const getCasts = function(cast)
{
    const castlist = [];

    for(let i = 0, len = cast.length; i < len && i < 10; i++)
    {
        /*destructure name from the cast[i] object*/
        const { name } = cast[i];
        castlist.push(name);
    }

    return castlist.join(",");
}
const getDirectors = function(crewList)
{
const directors = crewList.filter(({ job }) => job === "Director");

  const directorList = [];
  for (const { name } of directors) directorList.push(name);

  return directorList.join(", ");


}

// returns only trailers and teasers as array
const filterVideos = function (videoList) 
{
    return videoList.filter(({ type, site }) => (type === "Trailer" || type === "Teaser") && site === "YouTube");
}
/*get data of the specific movie and add info such as casts list,video*/
fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`, function (movie)
{

    const {
        backdrop_path,
        poster_path,
        title,
        release_date,
        runtime,
        vote_average,
        releases: { countries: [{ certification } = { certification: "N/A" }] },
        genres,
        overview,
        casts: { cast, crew },
        videos: { results: videos }
      } = movie;

    document.title = `${title}`;



    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");
    movieDetail.innerHTML = `
            <div class="backdrop-image" style="background-image: url('${imageBaseURL}${"w1280" || "original"}${backdrop_path || poster_path}')">
            </div>
            <figure class = "poster movie">
                <img src = "${imageBaseURL}w342${poster_path}" alt = "Puss in Boots Last Wish"class = "img-cover" loading = "eager">
            </figure>
            <div class="detail-box">
                <div class="detail-content">
                    <h1 class = "heading">${title}</h1>
                    <div class="meta-list">
                        <div class="meta-item">
                            <img src = "assets/images/star.png" height = "40px" width = "40px">
                            <span class = "span">${vote_average}</span>
                        </div>
                        <div class="bullet">
                        </div>
                        <div class="meta-item">
                            ${runtime}
                        </div>
                        <div class="bullet"></div>
                        <div class="meta-item">
                           ${release_date && release_date.split("-")[0] ? release_date.split("-")[0] : "Not Released"}
                        </div>
                        <div class="bullet"></div>
                        <div class = "meta-item rating">${certification}</div>
                    </div>
                  <p class = "genre">${getGenres(genres)}</p>
                </div>
            </div>
            <div>
            <p class = "actor-title">Cast:</p>
            <h4>${getCasts(cast)}</h4>
            <p class = "actor-title" >Directed by:</p>
            <h4>${getDirectors(crew)}</h4>
       
    
    `;
    

    pageContent.appendChild(movieDetail);


    const movieplot = document.createElement("div");
    movieplot.classList.add("movie-plot");

    movieplot.innerHTML = `
    
    <h2 class = "title">Plot</h2>
    <p>${overview}</p>
    <div class = "trailers-box">
        <h3 class = "title">Trailers</h3>
    </div>
    <div class = "slider-list">
        <div class="innerlist">
        </div>
    </div>
    
    
    `
    pageContent.appendChild(movieplot);

    for (const { key, name } of filterVideos(videos)) {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");
    
        videoCard.innerHTML = `
          <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
            frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
        `;
    
        movieplot.querySelector(".innerlist").appendChild(videoCard);
      }

    
    
    

    /*fetch recommendations of the current movie based on movieid*/
    fetchDataFromServer(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`, addSuggestedMovies);

    

});

const addSuggestedMovies = function({ results: movieList }, title)
{
    const movieListElem = document.createElement("div");
    movieListElem.classList.add("movie-list");
    movieListElem.ariaLabel = "Recommendations";

    movieListElem.innerHTML = `

    <div>
        <h3 class = "title">Recommendations</h3>
    </div>

    <div class="slider-list">
      <div class="innerlist"></div>
    </div>
    
    `;

    for(const movie of movieList)
    {
        const movieobject = createMovieCard(movie);
        movieListElem.querySelector('.innerlist').appendChild(movieobject);
    }

    pageContent.appendChild(movieListElem);

    addCast();

    
}


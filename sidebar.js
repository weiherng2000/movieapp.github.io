'use strict';

import { api_key,fetchDataFromServer } from "./api.js";

export function sidebar(){
    
    /*create a dictionary*/
    const genreList = {};

    /*use fetchdata function from api.js */
    fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
    
    /*id and name are from the movie genre api*/
    /*genres will be the data object*/
    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    genreLink();

    });

    /*we create a new div element*/
    const sidebarInner = document.createElement("div");
    /*in this new element we add a new class sidebar-inner*/
    sidebarInner.classList.add("sidebar-inner");

    /*we add sidebar from index.html to the new element tag*/
    sidebarInner.innerHTML = `

    <div class="sidebar-list">

          <p class = "title">Genre</p>

        
    </div>
    <div class = "sidebar-footer">
            <img src = "assets/images/tmdb-logo.svg" height = 140px width = 170px alt = "TMDB">
    </div>
      
    
    `;

    /*we need to create links for our genre sidebar element tag*/
    const genreLink = function()
    {
        /*Object entries take the key value pair of genreList*/
        for(const[genreId,genreName] of Object.entries(genreList))
        {
            /*create an a tag to generate links*/
            const link = document.createElement("a");
            link.classList.add("sidebar-link");
            link.setAttribute("href", "./movielist.html");
            link.setAttribute("menu-close", "");
            /*set an onclick event with the function getMovieList*/
            /*The first argument is a string "with_genres=${genreId}", which appears to be a query parameter for filtering movie lists by genre ID.
              The second argument is a string genreName, which likely represents the name of the genre being clicked.
            */
            
            link.setAttribute("onclick", `getMovieList("with_genres=${genreId}", "${genreName}")`);
            link.textContent = genreName;
            /*The appendChild() method appends a node (element) as the last child of an element.*/
            /*so we add a link to the sidebar-list*/
            sidebarInner.querySelector(".sidebar-list").appendChild(link);

        }
        /*find the sidebar attribute in the index.html*/
        const sidebar = document.querySelector("[sidebar]");
        /*add the sidebarInner to the sidebar element*/
        sidebar.appendChild(sidebarInner);
        toggleSidebar(sidebar);
    }

    const toggleSidebar = function(sidebar)
    {
        const sidebarBtn = document.querySelector("[menu-btn]");
        const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
        const sidebarClose = document.querySelectorAll("[menu-close]");
        const overlay = document.querySelector("[overlay]");
        
        /*for each element that menu-toggler attribute we add an event listener*/
        /*the event is for an onclick event*/
        /*when clicked the sidebar will add or remove the active attribute from the class*/
        addEventOnElements(sidebarTogglers, "click", function () 
        {
            sidebar.classList.toggle("active");
            sidebarBtn.classList.toggle("active");
            overlay.classList.toggle("active");
        });
      
        addEventOnElements(sidebarClose, "click", function () 
        {
            sidebar.classList.remove("active");
            sidebarBtn.classList.remove("active");
            overlay.classList.remove("active");
        });
    }

    

}

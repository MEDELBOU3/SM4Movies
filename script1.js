// script.js
const API_KEY = '431fb541e27bceeb9db2f4cab69b54e1';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const SEARCH_API = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;

const main = document.getElementById('main');
const search = document.getElementById('search');
const genresList = document.getElementById('genres');

const filterMovies = (type) => {
    const url = `${BASE_URL}/discover/${type}?sort_by=popularity.desc&api_key=${API_KEY}`;
    getMovies(url);
}

const getGenres = async () => {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    data.genres.forEach(genre => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" onclick="filterByGenre(${genre.id})">${genre.name}</a>`;
        genresList.appendChild(li);
    });
}

const filterByGenre = (genreId) => {
    const url = `${BASE_URL}/discover/movie?with_genres=${genreId}&api_key=${API_KEY}`;
    getMovies(url);
}

// Get initial movies
getMovies(API_URL);
getGenres();

async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    showMovies(data.results);
}

async function getMovieTrailer(movie_id) {
    const res = await fetch(`${BASE_URL}/movie/${movie_id}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results.find(video => video.type === 'Trailer');
}

function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach(async (movie) => {
        const { id, title, poster_path, vote_average, overview } = movie;
        const trailer = await getMovieTrailer(id);

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span>${vote_average}</span>
            </div>
            <div class="movie-overview">
                <h4>Overview:</h4>
                ${overview}
            </div>
            ${trailer ? `<button class="trailer-button"  onclick="window.open('https://www.youtube.com/watch?v=${trailer.key}', '_blank')">Watch Trailer</button>` : ''}
        `;

        main.appendChild(movieEl);
    });
}

// Search function
search.addEventListener('keyup', (e) => {
    const searchTerm = e.target.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);
    } else {
        getMovies(API_URL);
    }
});


const express = require('express');
const axios = require('axios');
const moment = require('moment');

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_DISCOVER_URL = 'https://api.themoviedb.org/3/discover/movie';
const TMDB_MOVIE_URL = 'https://api.themoviedb.org/3/movie';
const TMDB_TOP_RATED_URL = 'https://api.themoviedb.org/3/movie/top_rated';

// Helper function to fetch movies by date range
const fetchMovies = async (days) => {
  const today = moment().format('YYYY-MM-DD');
  const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
  let allMovies = [];
  let page = 1;
  let totalPages = 1;

  try {
    while (page <= totalPages && page <= 500) {
      const response = await axios.get(TMDB_DISCOVER_URL, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          sort_by: 'release_date.desc',
          'release_date.gte': startDate,
          'release_date.lte': today,
          page: page
        }
      });
      allMovies = [...allMovies, ...response.data.results];
      totalPages = response.data.total_pages;
      page++;
    }
    return allMovies;
  } catch (error) {
    console.error('Error fetching movies:', error.response?.data || error.message);
    return [];
  }
};

// Route: Last 30 days
router.get('/last-30-days', async (req, res) => {
  const movies = await fetchMovies(30);
  res.json(movies);
});

// Route: Last 45 days
router.get('/last-45-days', async (req, res) => {
  const movies = await fetchMovies(45);
  res.json(movies);
});

// Route: Last 90 days
router.get('/last-90-days', async (req, res) => {
  const movies = await fetchMovies(90);
  res.json(movies);
});

// Route: Get top rated movies
router.get('/top-rated', async (req, res) => {
  try {
    const response = await axios.get(TMDB_TOP_RATED_URL, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        page: 1
      }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching top rated movies:', error.response?.data || error.message);
    res.status(500).send('Error fetching top rated movies');
  }
});

// Route: Get details for a specific movie
router.get('/movie/:id', async (req, res) => {
  const movieId = req.params.id;
  try {
    const response = await axios.get(`${TMDB_MOVIE_URL}/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movie details:', error.response?.data || error.message);
    res.status(500).send('Error fetching movie details');
  }
});

module.exports = router;

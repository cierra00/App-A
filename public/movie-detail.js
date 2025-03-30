const detailsContainer = document.getElementById('movie-details');

// Function to get the movie ID from the URL query parameter
function getMovieIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');  // Expects ?id=123
}

// Capitalize the first letter of the movie title
function capitalizeFirstWord(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function loadMovieDetails() {
  const movieId = getMovieIdFromURL();

  if (!movieId) {
    detailsContainer.innerHTML = '<p class="no-results">No movie ID found in the URL.</p>';
    return;
  }

  const spinner = document.getElementById('spinner');
  spinner.style.display = 'block';

  try {
    console.log('Fetching:', `/movies/movie/${movieId}`);
    const res = await fetch(`/movies/movie/${movieId}`);

    if (!res.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const movie = await res.json();
    console.log('Movie response:', movie);

    if (!movie || !movie.title) {
      detailsContainer.innerHTML = '<p class="no-results">Movie not found.</p>';
      return;
    }

    const posterHTML = movie.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="detail-poster" />`
      : `<div class="poster-placeholder">No Image Available</div>`;

    detailsContainer.innerHTML = `
      <div class="movie-details-layout">
        <div class="poster-column">
          ${posterHTML}
        </div>
        <div class="info-column">
          <h1>${capitalizeFirstWord(movie.title)}</h1>
          <p class="sub-info"><strong>Release Date:</strong> ${movie.release_date || 'N/A'}</p>
          <p class="sub-info"><strong>Runtime:</strong> ${movie.runtime ? `${movie.runtime} min` : 'N/A'}</p>
          <p class="sub-info"><strong>Genres:</strong> ${movie.genres ? movie.genres.map(g => g.name).join(', ') : 'N/A'}</p>
          <div class="overview">${movie.overview || 'No overview available.'}</div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    detailsContainer.innerHTML = '<p class="no-results">Error loading movie details.</p>';
  } finally {
    spinner.style.display = 'none';
  }
}

window.onload = loadMovieDetails;

const container = document.getElementById('movie-container');
const spinner = document.getElementById('spinner');

// Capitalize first letter of movie title
function capitalizeFirstLetter(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Truncate description to 200 characters and add "..."
function truncateDescription(description) {
  if (description.length > 200) {
    return description.substring(0, 200) + '...';
  }
  return description;
}

async function loadMovies() {
  spinner.style.display = 'block';

  try {
    // 🔧 Dynamically determine endpoint based on page
    let endpoint = '/movies/last-30-days';
    const path = window.location.pathname;

    if (path.includes('45')) {
      endpoint = '/movies/last-45-days';
    } else if (path.includes('90')) {
      endpoint = '/movies/last-90-days';
    }

    console.log(`📦 Fetching from: ${endpoint}`);
    const res = await fetch(endpoint);
    const movies = await res.json();

    spinner.style.display = 'none';
    container.innerHTML = '';

    const filteredMovies = movies.filter(m => m.poster_path && m.overview?.trim());

    if (filteredMovies.length === 0) {
      container.innerHTML = '<p class="no-results">No movies found with images.</p>';
      return;
    }

    console.log(`🎬 Loaded ${filteredMovies.length} movies from ${endpoint}`);

    filteredMovies.forEach(movie => {
      const div = document.createElement('div');
      div.className = 'movie-card';

      div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" class="poster" />
        <h3>${capitalizeFirstLetter(movie.title)}</h3>
        <p class="release">Release: ${movie.release_date}</p>
        <p class="description">${truncateDescription(movie.overview)}</p>
        <div class="card-footer">
          <a href="movie-detail.html?id=${movie.id}" class="view-more-btn">View More</a>
        </div>
      `;

      container.appendChild(div);
    });

  } catch (error) {
    spinner.style.display = 'none';
    container.innerHTML = '<p class="no-results">Error loading movies.</p>';
    console.error(error);
  }
}

window.onload = loadMovies;

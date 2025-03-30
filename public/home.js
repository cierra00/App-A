async function loadCategory(endpoint, containerId, spinnerId) {
  const container = document.getElementById(containerId);
  const spinner = document.getElementById(spinnerId);
  spinner.style.display = 'flex';

  try {
    const res = await fetch(endpoint);
    const movies = await res.json();
    spinner.style.display = 'none';
    container.innerHTML = '';

    const filtered = movies
      .filter(m => m.poster_path && m.overview)
      .slice(0, 6); // ✅ Limit to 2 rows = 6 movies

    filtered.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
        <h5>${movie.title}</h5>
        <p class="release">Release: ${movie.release_date}</p>
        <p class="description">${movie.overview.slice(0, 150)}...</p>
        <div class="card-footer">
          <a href="movie-detail.html?id=${movie.id}" class="view-more-btn">View More</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    spinner.style.display = 'none';
    container.innerHTML = `<p class="no-results">Error loading movies.</p>`;
  }
}

// Load categories
window.onload = () => {
  loadCategory('/movies/last-30-days', 'featured-container', 'spinner-featured');
  loadCategory('/movies/last-45-days', 'trending-container', 'spinner-trending');
  loadCategory('/movies/top-rated', 'top-rated-container', 'spinner-top-rated'); // Optional custom endpoint
  loadCategory('/movies/last-90-days', 'recent-container', 'spinner-recent');
};

// components/layout.js

fetch('/components/header.html')
  .then(res => res.text())
  .then(html => {
    const header = document.getElementById('header');
    header.innerHTML = html;

    const toggle = header.querySelector('#menu-toggle');
    const navLinks = header.querySelector('#nav-links');

    toggle?.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  })
  .catch(err => console.error('❌ Failed to load header:', err));

fetch('/components/footer.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('footer').innerHTML = html;
  })
  .catch(err => console.error('❌ Failed to load footer:', err));

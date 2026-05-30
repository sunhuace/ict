function toggleToc() {
  document.getElementById('toc').classList.toggle('open');
}

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  lb.querySelector('img').src = src;
  lb.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function () {
  // Lightbox close
  document.getElementById('lightbox').addEventListener('click', function () {
    this.classList.remove('active');
  });

  // Back to top
  const bt = document.getElementById('back-top');
  window.addEventListener('scroll', function () {
    bt.classList.toggle('visible', window.scrollY > 400);
  });
  bt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

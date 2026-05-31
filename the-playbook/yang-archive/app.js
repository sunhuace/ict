// ── TOC ──────────────────────────────────────────────────────────────────────
function toggleToc() {
  document.getElementById('toc').classList.toggle('open');
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  lb.querySelector('img').src = src;
  lb.classList.add('active');
}

// ── 懒加载：把当前页的 data-src 赋给 src ────────────────────────────────────
function loadPageImages(page) {
  document.querySelectorAll(`.posts article[data-page="${page}"] img[data-src]`).forEach(function (img) {
    if (!img.src || img.src === window.location.href) {
      img.src = img.dataset.src;
    }
  });
}

// ── Pagination ────────────────────────────────────────────────────────────────
let currentPage = 1;

function getPageSize() {
  const el = document.getElementById('pagination-top');
  return el ? parseInt(el.dataset.pageSize) || 20 : 20;
}

function getTotalPages() {
  const el = document.getElementById('pagination-top');
  if (!el) return 1;
  const total    = parseInt(el.dataset.total) || 0;
  const pageSize = parseInt(el.dataset.pageSize) || 20;
  return Math.ceil(total / pageSize);
}

function showPage(page) {
  const totalPages = getTotalPages();
  page = Math.max(1, Math.min(page, totalPages));
  currentPage = page;

  // 显示/隐藏帖子
  document.querySelectorAll('.posts article[data-page]').forEach(function (el) {
    el.style.display = parseInt(el.dataset.page) === page ? '' : 'none';
  });

  // 加载当前页图片
  loadPageImages(page);

  // 渲染两处分页条
  ['pagination-top', 'pagination-bot'].forEach(function (id) {
    renderPagination(document.getElementById(id), page, totalPages);
  });

  // 滚动到顶
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPagination(container, page, totalPages) {
  if (!container) return;
  container.innerHTML = '';

  function btn(label, targetPage, active, disabled) {
    const b = document.createElement('button');
    b.textContent = label;
    b.className   = 'page-btn' + (active ? ' active' : '') + (disabled ? ' disabled' : '');
    if (!disabled) b.addEventListener('click', function () { showPage(targetPage); });
    return b;
  }

  container.appendChild(btn('«', 1,        false, page === 1));
  container.appendChild(btn('‹', page - 1, false, page === 1));

  // 页码窗口：最多显示 7 个
  let start = Math.max(1, page - 3);
  let end   = Math.min(totalPages, start + 6);
  start     = Math.max(1, end - 6);

  if (start > 1) {
    container.appendChild(btn('1', 1, false, false));
    if (start > 2) {
      const dots = document.createElement('span');
      dots.className = 'page-dots';
      dots.textContent = '…';
      container.appendChild(dots);
    }
  }

  for (let p = start; p <= end; p++) {
    container.appendChild(btn(String(p), p, p === page, false));
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      const dots = document.createElement('span');
      dots.className = 'page-dots';
      dots.textContent = '…';
      container.appendChild(dots);
    }
    container.appendChild(btn(String(totalPages), totalPages, false, false));
  }

  container.appendChild(btn('›', page + 1,   false, page === totalPages));
  container.appendChild(btn('»', totalPages,  false, page === totalPages));

  // 跳页输入框
  const wrap  = document.createElement('span');
  wrap.className = 'page-jump';
  const input = document.createElement('input');
  input.type      = 'number';
  input.min       = 1;
  input.max       = totalPages;
  input.value     = page;
  input.className = 'page-input';
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const v = parseInt(this.value);
      if (v >= 1 && v <= totalPages) showPage(v);
    }
  });
  const label = document.createElement('span');
  label.textContent = ` / ${totalPages} 页`;
  label.className   = 'page-total';
  wrap.appendChild(input);
  wrap.appendChild(label);
  container.appendChild(wrap);
}

// ── Init ──────────────────────────────────────────────────────────────────────
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

  // 初始化：只显示第 1 页，只加载第 1 页图片
  showPage(1);

  // TOC 锚点点击：先切换到对应页再跳转
  document.getElementById('toc').addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#post-"]');
    if (!a) return;
    e.preventDefault();
    const tid     = a.getAttribute('href').slice(1);
    const article = document.getElementById(tid);
    if (!article) return;
    const targetPage = parseInt(article.dataset.page);
    if (targetPage !== currentPage) {
      showPage(targetPage);
      setTimeout(function () {
        const el = document.getElementById(tid);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      article.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.getElementById('toc').classList.remove('open');
  });
});

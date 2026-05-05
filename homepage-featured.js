const encodeFeaturedPath = (path) => {
  try {
    return encodeURI(decodeURI(path)).replace(/#/g, '%23');
  } catch {
    return encodeURI(path).replace(/#/g, '%23');
  }
};

const homepageLargeBuilds =
  typeof PERSONAL_LARGE_BUILDS !== 'undefined' && Array.isArray(PERSONAL_LARGE_BUILDS)
    ? PERSONAL_LARGE_BUILDS
    : [];

const pickFeaturedBuild = (items, key) => {
  if (!Array.isArray(items) || !items.length) return null;

  const storageKey = `featured-${key}-index`;
  const previous = Number(window.localStorage.getItem(storageKey) || '-1');
  const next = (previous + 1) % items.length;
  window.localStorage.setItem(storageKey, String(next));
  return items[next];
};

const featuredBuildSets = [
  {
    key: 'small',
    label: 'Small Home',
    price: '35m gil',
    type: 'Personal home',
    href: 'personal-small-build.html?build=',
    items: Array.isArray(window.personalSmallBuildsData) ? window.personalSmallBuildsData : []
  },
  {
    key: 'medium',
    label: 'Medium Home',
    price: '50m gil',
    type: 'Personal home',
    href: 'personal-medium-build.html?build=',
    items: Array.isArray(window.personalMediumBuildsData) ? window.personalMediumBuildsData : []
  },
  {
    key: 'large',
    label: 'Large Home',
    price: '75m gil',
    type: 'Personal home',
    href: 'personal-large-build.html?build=',
    items: homepageLargeBuilds
  }
];

const renderFeaturedBuilds = () => {
  const root = document.querySelector('[data-featured-builds]');
  if (!root) return;

  const cards = featuredBuildSets
    .map((set) => {
      const build = pickFeaturedBuild(set.items, set.key);
      if (!build || !Array.isArray(build.images) || !build.images.length) return '';

      const images = build.images.slice(0, Math.min(build.images.length, 5)).map(encodeFeaturedPath);
      const note = build.style || `${set.label.toLowerCase()} with a softer, character-led presentation.`;

      return `
        <article class="featured-card">
          <a class="featured-card-media" href="${set.href}${build.slug}">
            <div class="featured-badges">
              <span class="featured-badge featured-badge-size">${set.label}</span>
              <span class="featured-badge">${set.price}</span>
            </div>
            <div class="preview-rotator featured-rotator" data-rotate-gallery data-rotate-interval="3000" data-images="${images.join('|')}">
              <img class="gallery-image" src="${images[0]}" alt="${build.title} rotating featured preview.">
            </div>
          </a>
          <div class="featured-card-copy">
            <p class="featured-label">${set.label} Pick</p>
            <h3 class="card-title">${build.title}</h3>
            <p class="body-copy featured-card-note">${note}</p>
            <div class="featured-meta">
              <span>${set.type}</span>
              <span>${build.images.length} views</span>
            </div>
            <a class="featured-link" href="${set.href}${build.slug}">Tour ${build.title}</a>
          </div>
        </article>
      `;
    })
    .filter(Boolean)
    .join('');

  root.innerHTML = cards;
};

renderFeaturedBuilds();

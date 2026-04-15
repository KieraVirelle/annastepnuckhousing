const encodeSmallVenuePath = (path) => encodeURI(path).replace(/#/g, '%23');

const getSmallVenueConfig = () => {
  const config = window.smallVenueGalleryConfig || {};
  const builds = Array.isArray(config.builds) ? config.builds : [];
  return { ...config, builds };
};

const renderSmallVenueLanding = () => {
  const list = document.querySelector('[data-small-venue-build-list]');
  const total = document.querySelector('[data-small-venue-total]');
  if (!list) return;

  const config = getSmallVenueConfig();
  if (total) total.textContent = String(config.builds.length);

  list.innerHTML = config.builds.map((build) => {
    const previewImages = build.images.slice(0, Math.min(build.images.length, 5)).map(encodeSmallVenuePath);
    return `
      <article class="build-entry panel">
        <div class="build-entry-copy">
          <h2 class="gallery-title">${build.title}</h2>
          <p class="body-copy">${build.title} is part of the ${config.collectionLabel.toLowerCase()} collection. Open the dedicated page to flip through the uploaded screenshots in sequence.</p>
          <div class="build-entry-meta">
            <p><strong>Starting price</strong><span>25m gil</span></p>
            <p><strong>Build type</strong><span>${config.buildType}</span></p>
            <p><strong>Images</strong><span>${build.images.length} views</span></p>
          </div>
          <div class="hero-actions">
            <a class="button" href="venue-small-build.html?category=${config.slug}&build=${build.slug}">Open ${build.title}</a>
          </div>
        </div>
        <div class="build-entry-frame">
          <div class="preview-stack preview-stack-large">
            <div class="preview-card preview-card-back"></div>
            <div class="preview-card preview-card-mid"></div>
            <div class="preview-card preview-card-front">
              <div class="preview-rotator" data-rotate-gallery data-rotate-interval="2600" data-images="${previewImages.join('|')}">
                <img class="gallery-image" src="${previewImages[0]}" alt="${build.title} rotating preview.">
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
};

const renderSmallVenueDetail = () => {
  const root = document.querySelector('[data-small-venue-detail]');
  if (!root) return;
  const config = getSmallVenueConfig();
  if (!config.builds.length) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('build');
  const index = config.builds.findIndex((build) => build.slug === slug);
  const build = index >= 0 ? config.builds[index] : config.builds[0];
  const prevBuild = config.builds[index - 1] || null;
  const nextBuild = config.builds[index + 1] || null;
  const images = build.images.map(encodeSmallVenuePath);

  document.title = `Annastepnuk Housing | ${build.title}`;
  root.querySelectorAll('[data-small-venue-title], [data-small-venue-build-name]').forEach((node) => {
    node.textContent = build.title;
  });
  const lead = root.querySelector('[data-small-venue-lead]');
  if (lead) lead.textContent = `${build.title} is part of the ${config.collectionLabel.toLowerCase()} collection and keeps the uploaded screenshots in their intended order.`;
  const note = root.querySelector('[data-small-venue-note]');
  if (note) note.textContent = `Thank you for touring the design. Flip through the gallery to follow ${build.title} one image at a time.`;
  const total = root.querySelector('[data-small-venue-total-images]');
  if (total) total.textContent = String(images.length);

  const stageImage = root.querySelector('.stack-main-image');
  const stageButton = root.querySelector('[data-stack-open]');
  if (stageImage) {
    stageImage.src = images[0];
    stageImage.alt = `${build.title} small venue featured interior view.`;
  }
  if (stageButton) {
    stageButton.dataset.imageSrc = images[0];
    stageButton.dataset.imageAlt = `${build.title} small venue featured interior view.`;
  }

  const thumbs = root.querySelector('[data-stack-thumbs]');
  if (thumbs) {
    thumbs.innerHTML = images.map((src, i) => `
      <button class="stack-thumb${i === 0 ? ' active' : ''}" type="button" data-stack-thumb data-image-src="${src}" data-image-alt="${build.title} small venue image ${i + 1}.">
        <img class="gallery-image" src="${src}" alt="">
      </button>
    `).join('');
  }

  const prevLink = root.querySelector('[data-small-venue-prev]');
  const nextLink = root.querySelector('[data-small-venue-next]');
  if (prevLink) {
    if (prevBuild) {
      prevLink.href = `venue-small-build.html?category=${config.slug}&build=${prevBuild.slug}`;
      prevLink.innerHTML = `<span class="gallery-pager-label">Previous Build</span><strong>${prevBuild.title}</strong>`;
    } else {
      prevLink.href = config.landingPage;
      prevLink.innerHTML = `<span class="gallery-pager-label">Back</span><strong>${config.collectionLabel}</strong>`;
    }
  }
  if (nextLink) {
    if (nextBuild) {
      nextLink.href = `venue-small-build.html?category=${config.slug}&build=${nextBuild.slug}`;
      nextLink.innerHTML = `<span class="gallery-pager-label">Next Build</span><strong>${nextBuild.title}</strong>`;
    } else {
      nextLink.href = config.landingPage;
      nextLink.innerHTML = `<span class="gallery-pager-label">Back</span><strong>${config.collectionLabel}</strong>`;
    }
  }
};

renderSmallVenueLanding();
renderSmallVenueDetail();

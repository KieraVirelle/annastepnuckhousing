const encodeMediumPath = (path) => encodeURI(path).replace(/#/g, '%23');

const renderPersonalMediumLanding = () => {
  const list = document.querySelector('[data-medium-build-list]');
  const total = document.querySelector('[data-medium-total]');
  if (!list) return;

  const builds = Array.isArray(window.personalMediumBuildsData) ? window.personalMediumBuildsData : [];
  if (total) total.textContent = String(builds.length);

  list.innerHTML = builds.map((build) => {
    const previewImages = build.images.slice(0, Math.min(build.images.length, 5)).map(encodeMediumPath);
    return `
      <article class="build-entry panel">
        <div class="build-entry-copy">
          <h2 class="gallery-title">${build.title}</h2>
          <p class="body-copy">${build.title} is part of the personal medium home collection. Open the dedicated page to flip through the uploaded screenshots in sequence.</p>
          <div class="build-entry-meta">
            <p><strong>Starting price</strong><span>35m gil</span></p>
            <p><strong>Build type</strong><span>Medium personal home</span></p>
            <p><strong>Images</strong><span>${build.images.length} views</span></p>
          </div>
          <div class="hero-actions">
            <a class="button" href="personal-medium-build.html?build=${build.slug}">Open ${build.title}</a>
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

const renderPersonalMediumDetail = () => {
  const root = document.querySelector('[data-medium-detail]');
  if (!root) return;

  const builds = Array.isArray(window.personalMediumBuildsData) ? window.personalMediumBuildsData : [];
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('build');
  const index = builds.findIndex((build) => build.slug === slug);
  const build = index >= 0 ? builds[index] : builds[0];
  if (!build) return;

  const prevBuild = builds[index - 1] || null;
  const nextBuild = builds[index + 1] || null;
  const images = build.images.map(encodeMediumPath);

  document.title = `Annastepnuk Housing | ${build.title}`;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute('content', `${build.title} personal medium home gallery for Annastepnuk Housing.`);
  }

  root.querySelectorAll('[data-medium-title], [data-medium-build-name]').forEach((node) => {
    node.textContent = build.title;
  });
  const lead = root.querySelector('[data-medium-lead]');
  if (lead) lead.textContent = `${build.title} is part of the personal medium home collection and keeps the uploaded screenshots in their intended order.`;
  const note = root.querySelector('[data-medium-note]');
  if (note) note.textContent = `Thank you for touring the design. Flip through the gallery to follow ${build.title} one image at a time.`;
  const total = root.querySelector('[data-medium-total-images]');
  if (total) total.textContent = String(images.length);

  const stageImage = root.querySelector('.stack-main-image');
  const stageButton = root.querySelector('[data-stack-open]');
  if (stageImage) {
    stageImage.src = images[0];
    stageImage.alt = `${build.title} medium personal home featured interior view.`;
  }
  if (stageButton) {
    stageButton.dataset.imageSrc = images[0];
    stageButton.dataset.imageAlt = `${build.title} medium personal home featured interior view.`;
  }

  const thumbs = root.querySelector('[data-stack-thumbs]');
  if (thumbs) {
    thumbs.innerHTML = images.map((src, i) => `
      <button class="stack-thumb${i === 0 ? ' active' : ''}" type="button" data-stack-thumb data-image-src="${src}" data-image-alt="${build.title} medium personal home image ${i + 1}.">
        <img class="gallery-image" src="${src}" alt="">
      </button>
    `).join('');
  }

  const prevLink = root.querySelector('[data-medium-prev]');
  const nextLink = root.querySelector('[data-medium-next]');
  if (prevLink) {
    if (prevBuild) {
      prevLink.href = `personal-medium-build.html?build=${prevBuild.slug}`;
      prevLink.innerHTML = `<span class="gallery-pager-label">Previous Build</span><strong>${prevBuild.title}</strong>`;
    } else {
      prevLink.href = 'personal-medium-homes.html';
      prevLink.innerHTML = '<span class="gallery-pager-label">Back</span><strong>Personal - Medium Homes</strong>';
    }
  }
  if (nextLink) {
    if (nextBuild) {
      nextLink.href = `personal-medium-build.html?build=${nextBuild.slug}`;
      nextLink.innerHTML = `<span class="gallery-pager-label">Next Build</span><strong>${nextBuild.title}</strong>`;
    } else {
      nextLink.href = 'personal-medium-homes.html';
      nextLink.innerHTML = '<span class="gallery-pager-label">Back</span><strong>Personal - Medium Homes</strong>';
    }
  }
};

renderPersonalMediumLanding();
renderPersonalMediumDetail();

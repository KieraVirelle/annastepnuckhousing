const renderPersonalSmallLanding = () => {
  const list = document.querySelector('[data-small-build-list]');
  const total = document.querySelector('[data-small-total]');
  if (!list) return;

  const builds = Array.isArray(window.personalSmallBuildsData) ? window.personalSmallBuildsData : [];
  if (total) total.textContent = String(builds.length);

  list.innerHTML = builds.map((build) => {
    const previewImages = build.images.slice(0, Math.min(build.images.length, 5)).map((src) => encodeURI(src).replace(/#/g, '%23'));
    return `
      <article class="build-entry panel">
        <div class="build-entry-copy">
          <h2 class="gallery-title">${build.title}</h2>
          <p class="body-copy">${build.title} is part of the personal small home collection. Open the dedicated page to flip through the uploaded screenshots in sequence.</p>
          <div class="build-entry-meta">
            <p><strong>Starting price</strong><span>35m gil</span></p>
            <p><strong>Build type</strong><span>Small personal home</span></p>
            <p><strong>Images</strong><span>${build.images.length} views</span></p>
          </div>
          <div class="hero-actions">
            <a class="button" href="personal-small-build.html?build=${build.slug}">Open ${build.title}</a>
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

const renderPersonalSmallDetail = () => {
  const root = document.querySelector('[data-small-detail]');
  if (!root) return;

  const builds = Array.isArray(window.personalSmallBuildsData) ? window.personalSmallBuildsData : [];
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('build');
  const index = builds.findIndex((build) => build.slug === slug);
  const build = index >= 0 ? builds[index] : builds[0];
  if (!build) return;

  const prevBuild = builds[index - 1] || null;
  const nextBuild = builds[index + 1] || null;
  const images = build.images.map((src) => encodeURI(src).replace(/#/g, '%23'));

  document.title = `Annastepnuk Housing | ${build.title}`;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute('content', `${build.title} personal small home gallery for Annastepnuk Housing.`);
  }

  root.querySelectorAll('[data-small-title], [data-small-build-name]').forEach((node) => {
    node.textContent = build.title;
  });
  const lead = root.querySelector('[data-small-lead]');
  if (lead) lead.textContent = `${build.title} is part of the personal small home collection and keeps the uploaded screenshots in their intended order.`;
  const note = root.querySelector('[data-small-note]');
  if (note) note.textContent = `Thank you for touring the design. Flip through the gallery to follow ${build.title} one image at a time.`;
  const total = root.querySelector('[data-small-total-images]');
  if (total) total.textContent = String(images.length);

  const stageImage = root.querySelector('.stack-main-image');
  const stageButton = root.querySelector('[data-stack-open]');
  if (stageImage) {
    stageImage.src = images[0];
    stageImage.alt = `${build.title} small personal home featured interior view.`;
  }
  if (stageButton) {
    stageButton.dataset.imageSrc = images[0];
    stageButton.dataset.imageAlt = `${build.title} small personal home featured interior view.`;
  }

  const thumbs = root.querySelector('[data-stack-thumbs]');
  if (thumbs) {
    thumbs.innerHTML = images.map((src, i) => `
      <button class="stack-thumb${i === 0 ? ' active' : ''}" type="button" data-stack-thumb data-image-src="${src}" data-image-alt="${build.title} small personal home image ${i + 1}.">
        <img class="gallery-image" src="${src}" alt="">
      </button>
    `).join('');
  }

  const prevLink = root.querySelector('[data-small-prev]');
  const nextLink = root.querySelector('[data-small-next]');
  if (prevLink) {
    if (prevBuild) {
      prevLink.href = `personal-small-build.html?build=${prevBuild.slug}`;
      prevLink.innerHTML = `<span class="gallery-pager-label">Previous Build</span><strong>${prevBuild.title}</strong>`;
    } else {
      prevLink.href = 'personal-small-homes.html';
      prevLink.innerHTML = '<span class="gallery-pager-label">Back</span><strong>Personal - Small Homes</strong>';
    }
  }
  if (nextLink) {
    if (nextBuild) {
      nextLink.href = `personal-small-build.html?build=${nextBuild.slug}`;
      nextLink.innerHTML = `<span class="gallery-pager-label">Next Build</span><strong>${nextBuild.title}</strong>`;
    } else {
      nextLink.href = 'personal-small-homes.html';
      nextLink.innerHTML = '<span class="gallery-pager-label">Back</span><strong>Personal - Small Homes</strong>';
    }
  }
};

renderPersonalSmallLanding();
renderPersonalSmallDetail();

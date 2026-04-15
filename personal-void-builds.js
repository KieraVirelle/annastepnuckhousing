const getPersonalVoidBuilds = () => {
  const source = Array.isArray(window.personalVoidBuildsData) ? window.personalVoidBuildsData : [];

  return source.map((build, index) => {
    const images = Array.from({ length: build.count }, (_, imageIndex) =>
      `${build.directory}${build.prefix}${imageIndex + 1}${build.suffix}`
    );

    return {
      ...build,
      order: index + 1,
      images
    };
  });
};

const renderPersonalVoidLanding = () => {
  const list = document.querySelector('[data-personal-void-build-list]');
  const total = document.querySelector('[data-personal-void-total]');
  if (!list) return;

  const builds = getPersonalVoidBuilds();
  if (total) total.textContent = String(builds.length);

  list.innerHTML = builds
    .map((build) => {
      const previewImages = build.images.slice(0, Math.min(build.images.length, 5));
      const previewSrc = previewImages[0];
      const previewData = previewImages.join('|');

      return `
        <article class="build-entry panel">
          <div class="build-entry-copy">
            <h2 class="gallery-title">${build.title}</h2>
            <p class="body-copy">${build.title} is part of the large personal void build collection. Open the dedicated page to flip through the uploaded screenshots in sequence.</p>
            <div class="build-entry-meta">
              <p><strong>Starting price</strong><span>50m gil</span></p>
              <p><strong>Build type</strong><span>Large personal void build</span></p>
              <p><strong>Images</strong><span>${build.count} views</span></p>
            </div>
            <div class="hero-actions">
              <a class="button" href="personal-large-void-build.html?build=${build.slug}">Open ${build.title}</a>
            </div>
          </div>
          <div class="build-entry-frame">
            <div class="preview-stack preview-stack-large">
              <div class="preview-card preview-card-back"></div>
              <div class="preview-card preview-card-mid"></div>
              <div class="preview-card preview-card-front">
                <div class="preview-rotator" data-rotate-gallery data-rotate-interval="2600" data-images="${previewData}">
                  <img class="gallery-image" src="${previewSrc}" alt="${build.title} rotating preview.">
                </div>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
};

const renderPersonalVoidDetail = () => {
  const detailRoot = document.querySelector('[data-personal-void-detail]');
  if (!detailRoot) return;

  const builds = getPersonalVoidBuilds();
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('build');
  const index = builds.findIndex((build) => build.slug === slug);
  const build = index >= 0 ? builds[index] : builds[0];

  if (!build) return;

  const previousBuild = builds[index - 1] || null;
  const nextBuild = builds[index + 1] || null;

  document.title = `Annastepnuk Housing | ${build.title}`;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute('content', `${build.title} large personal void build gallery for Annastepnuk Housing.`);
  }

  const title = detailRoot.querySelector('[data-personal-void-title]');
  const buildName = detailRoot.querySelectorAll('[data-personal-void-build-name]');
  const lead = detailRoot.querySelector('[data-personal-void-lead]');
  const note = detailRoot.querySelector('[data-personal-void-note]');
  const total = detailRoot.querySelector('[data-personal-void-total-images]');
  const stageImage = detailRoot.querySelector('.stack-main-image');
  const stageButton = detailRoot.querySelector('[data-stack-open]');
  const thumbs = detailRoot.querySelector('[data-stack-thumbs]');
  const prevLink = detailRoot.querySelector('[data-personal-void-prev]');
  const nextLink = detailRoot.querySelector('[data-personal-void-next]');

  const firstImage = build.images[0];

  if (title) title.textContent = build.title;
  buildName.forEach((node) => {
    node.textContent = build.title;
  });
  if (lead) lead.textContent = `${build.title} is part of the large personal void build collection, kept separate from the standard personal large home portfolio so visitors can browse this style on its own.`;
  if (note) note.textContent = `Thank you for touring the design. Flip through the gallery to follow how ${build.title} unfolds through the void-build layout one image at a time.`;
  if (total) total.textContent = String(build.count);

  if (stageImage) {
    stageImage.src = firstImage;
    stageImage.alt = `${build.title} large personal void build featured interior view.`;
  }

  if (stageButton) {
    stageButton.dataset.imageSrc = firstImage;
    stageButton.dataset.imageAlt = `${build.title} large personal void build featured interior view.`;
  }

  if (thumbs) {
    thumbs.innerHTML = build.images
      .map((image, thumbIndex) => {
        const alt = thumbIndex === build.count - 1
          ? `${build.title} large personal void build closing showcase angle.`
          : `${build.title} large personal void build image ${thumbIndex + 1}.`;

        return `
          <button class="stack-thumb${thumbIndex === 0 ? ' active' : ''}" type="button" data-stack-thumb data-image-src="${image}" data-image-alt="${alt}">
            <img class="gallery-image" src="${image}" alt="">
          </button>
        `;
      })
      .join('');
  }

  if (prevLink) {
    if (previousBuild) {
      prevLink.href = `personal-large-void-build.html?build=${previousBuild.slug}`;
      prevLink.innerHTML = `<span class="gallery-pager-label">Previous Build</span><strong>${previousBuild.title}</strong>`;
    } else {
      prevLink.href = 'personal-large-void-builds.html';
      prevLink.innerHTML = '<span class="gallery-pager-label">Back</span><strong>Personal Void Builds</strong>';
    }
  }

  if (nextLink) {
    if (nextBuild) {
      nextLink.href = `personal-large-void-build.html?build=${nextBuild.slug}`;
      nextLink.innerHTML = `<span class="gallery-pager-label">Next Build</span><strong>${nextBuild.title}</strong>`;
    } else {
      nextLink.href = 'personal-large-void-builds.html';
      nextLink.innerHTML = '<span class="gallery-pager-label">Back</span><strong>Personal Void Builds</strong>';
    }
  }
};

renderPersonalVoidLanding();
renderPersonalVoidDetail();

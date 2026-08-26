const getVoidBuilds = () => {
  const source = Array.isArray(window.voidBuildsData) ? window.voidBuildsData : [];

  return source.map((build, index) => {
    const images = Array.isArray(build.images) && build.images.length
      ? build.images
      : Array.from({ length: build.count }, (_, imageIndex) =>
          `${build.directory}${build.prefix}${imageIndex + 1}${build.suffix}`
        );

    return {
      ...build,
      order: index + 1,
      images
    };
  });
};

const encodeImagePath = (path) => encodeURI(path).replace(/#/g, '%23');

const getVoidMediaItems = (build) => {
  const images = Array.isArray(build.images) ? build.images : [];
  const media = images.map((src, index) => ({
    type: 'image',
    src,
    alt: `${build.title} large venue void build image ${index + 1}.`
  }));

  if (build.video) {
    media.push({
      type: 'video',
      src: build.video,
      alt: `${build.title} large venue void build video tour.`
    });
  }

  return media;
};

const renderVoidMedia = (item) => {
  const src = encodeImagePath(item.src);
  if (item.type === 'video') {
    return `<video class="gallery-image" src="${src}" muted playsinline loop preload="metadata" aria-label="${item.alt}"></video>`;
  }
  return `<img class="gallery-image" src="${src}" alt="${item.alt}">`;
};

const renderVoidLanding = () => {
  const list = document.querySelector('[data-void-build-list]');
  const total = document.querySelector('[data-void-total]');
  if (!list) return;

  const builds = getVoidBuilds();
  if (total) total.textContent = String(builds.length);

  list.innerHTML = builds
    .map((build) => {
      const mediaItems = getVoidMediaItems(build);
      const previewImages = build.images.slice(0, Math.min(build.images.length, 5)).map(encodeImagePath);
      const previewSrc = previewImages[0];
      const previewData = previewImages.join('|');
      const mediaLabel = build.video ? 'Media' : 'Images';
      const mediaValue = build.video ? mediaItems.length : build.images.length;
      const mediaSuffix = build.video ? 'items' : 'views';

      return `
        <article class="build-entry panel">
          <div class="build-entry-copy">
            <h2 class="gallery-title">${build.title}</h2>
            <p class="body-copy">${build.title} is part of the large venue void build collection. Open the dedicated page to flip through the uploaded screenshots in sequence.</p>
            <div class="build-entry-meta">
              <p><strong>Starting price</strong><span>75m gil</span></p>
              <p><strong>Build type</strong><span>Large venue void build</span></p>
              <p><strong>${mediaLabel}</strong><span>${mediaValue} ${mediaSuffix}</span></p>
            </div>
            <div class="hero-actions">
              <a class="button" href="venue-large-void-build.html?build=${build.slug}">Open ${build.title}</a>
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

const renderVoidDetail = () => {
  const detailRoot = document.querySelector('[data-void-detail]');
  if (!detailRoot) return;

  const builds = getVoidBuilds();
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('build');
  const index = builds.findIndex((build) => build.slug === slug);
  const build = index >= 0 ? builds[index] : builds[0];

  if (!build) return;

  const previousBuild = builds[index - 1] || null;
  const nextBuild = builds[index + 1] || null;
  const mediaItems = getVoidMediaItems(build);
  const firstMedia = mediaItems[0];

  document.title = `Annastepnuk Housing | ${build.title}`;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute('content', `${build.title} large venue void build gallery for Annastepnuk Housing.`);
  }

  const title = detailRoot.querySelector('[data-void-title]');
  const buildName = detailRoot.querySelector('[data-void-build-name]');
  const lead = detailRoot.querySelector('[data-void-lead]');
  const note = detailRoot.querySelector('[data-void-note]');
  const total = detailRoot.querySelector('[data-void-total-images]');
  const stageImage = detailRoot.querySelector('.stack-main-image');
  const stageButton = detailRoot.querySelector('[data-stack-open]');
  const thumbs = detailRoot.querySelector('[data-stack-thumbs]');
  const prevLink = detailRoot.querySelector('[data-void-prev]');
  const nextLink = detailRoot.querySelector('[data-void-next]');
  const stageCaption = detailRoot.querySelector('.gallery-tile-caption');

  if (title) title.textContent = build.title;
  if (buildName) buildName.textContent = build.title;
  if (lead) lead.textContent = `${build.title} is part of the large venue void build collection, kept separate from the standard venue portfolio so visitors can browse this style on its own.`;
  if (note) note.textContent = `Thank you for touring the design. Flip through the gallery to follow how ${build.title} unfolds through the void-build layout one frame at a time.`;
  if (total) total.textContent = String(mediaItems.length);

  if (stageImage && firstMedia) {
    stageImage.src = encodeImagePath(firstMedia.src);
    stageImage.alt = `${build.title} large venue void build featured interior view.`;
  }

  if (stageButton && firstMedia) {
    const encoded = encodeImagePath(firstMedia.src);
    stageButton.dataset.mediaType = firstMedia.type;
    stageButton.dataset.mediaSrc = encoded;
    stageButton.dataset.mediaAlt = firstMedia.alt;
    stageButton.dataset.imageSrc = encoded;
    stageButton.dataset.imageAlt = firstMedia.alt;
    if (stageCaption) {
      stageCaption.textContent = firstMedia.type === 'video' ? 'Play full view' : 'Open full view';
    }
  }

  if (thumbs) {
    thumbs.innerHTML = mediaItems
      .map((item, thumbIndex) => {
        const encoded = encodeImagePath(item.src);
        return `
          <button class="stack-thumb${thumbIndex === 0 ? ' active' : ''}" type="button" data-stack-thumb data-media-type="${item.type}" data-media-src="${encoded}" data-media-alt="${item.alt}" data-image-src="${encoded}" data-image-alt="${item.alt}">
            ${renderVoidMedia(item)}
          </button>
        `;
      })
      .join('');
  }

  if (prevLink) {
    if (previousBuild) {
      prevLink.href = `venue-large-void-build.html?build=${previousBuild.slug}`;
      prevLink.innerHTML = `<span class="gallery-pager-label">Previous Build</span><strong>${previousBuild.title}</strong>`;
    } else {
      prevLink.href = 'venue-large-void-builds.html';
      prevLink.innerHTML = '<span class="gallery-pager-label">Back</span><strong>Large Void Builds</strong>';
    }
  }

  if (nextLink) {
    if (nextBuild) {
      nextLink.href = `venue-large-void-build.html?build=${nextBuild.slug}`;
      nextLink.innerHTML = `<span class="gallery-pager-label">Next Build</span><strong>${nextBuild.title}</strong>`;
    } else {
      nextLink.href = 'venue-large-void-builds.html';
      nextLink.innerHTML = '<span class="gallery-pager-label">Back</span><strong>Large Void Builds</strong>';
    }
  }
};

renderVoidLanding();
renderVoidDetail();

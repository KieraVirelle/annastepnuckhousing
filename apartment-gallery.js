const encodeApartmentImagePath = (path) => encodeURI(path).replace(/#/g, '%23');

const getApartmentConfig = () => {
  const config = window.apartmentGalleryConfig || {};
  const builds = Array.isArray(config.builds) ? config.builds : [];
  return { ...config, builds };
};

const renderApartmentLanding = () => {
  const root = document.querySelector('[data-apartment-build-list]');
  if (!root) return;

  const config = getApartmentConfig();
  const total = document.querySelector('[data-apartment-total]');
  if (total) total.textContent = String(config.builds.length);

  if (!config.builds.length) {
    root.innerHTML = `
      <section class="panel section">
        <p class="section-kicker">No Builds Yet</p>
        <h2 class="section-heading">This collection is ready for uploads.</h2>
        <p class="body-copy">The category page is wired in, but there are no screenshots in this folder yet. Add the images and the collection can be populated next.</p>
      </section>
    `;
    return;
  }

  root.innerHTML = config.builds.map((build) => {
    const previewImages = build.images.slice(0, Math.min(build.images.length, 5)).map(encodeApartmentImagePath);
    return `
      <article class="build-entry panel">
        <div class="build-entry-copy">
          <h2 class="gallery-title">${build.title}</h2>
          <p class="body-copy">${build.title} is part of the ${config.collectionLabel.toLowerCase()} collection. Open the dedicated page to flip through the uploaded screenshots in sequence.</p>
          <div class="build-entry-meta">
            <p><strong>Starting price</strong><span>15m gil</span></p>
            <p><strong>Build type</strong><span>${config.buildType}</span></p>
            <p><strong>Images</strong><span>${build.images.length} views</span></p>
          </div>
          <div class="hero-actions">
            <a class="button" href="apartment-build.html?category=${config.slug}&build=${build.slug}">Open ${build.title}</a>
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

const renderApartmentDetail = () => {
  const root = document.querySelector('[data-apartment-detail]');
  if (!root) return;

  const config = getApartmentConfig();
  if (!config.builds.length) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('build');
  const index = config.builds.findIndex((build) => build.slug === slug);
  const build = index >= 0 ? config.builds[index] : config.builds[0];
  const prevBuild = config.builds[index - 1] || null;
  const nextBuild = config.builds[index + 1] || null;
  const encodedImages = build.images.map(encodeApartmentImagePath);

  document.title = `Annastepnuk Housing | ${build.title}`;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute('content', `${build.title} ${config.collectionLabel.toLowerCase()} gallery for Annastepnuk Housing.`);
  }

  const setText = (selector, text) => {
    root.querySelectorAll(selector).forEach((node) => {
      node.textContent = text;
    });
  };

  setText('[data-apartment-title]', build.title);
  setText('[data-apartment-build-name]', build.title);
  setText('[data-apartment-category]', config.collectionLabel);
  setText('[data-apartment-build-type]', config.buildType);
  setText('[data-apartment-total-images]', String(build.images.length));

  const lead = root.querySelector('[data-apartment-lead]');
  if (lead) lead.textContent = `${build.title} is part of the ${config.collectionLabel.toLowerCase()} collection and keeps the uploaded screenshots in their intended order.`;

  const note = root.querySelector('[data-apartment-note]');
  if (note) note.textContent = `Thank you for touring the design. Flip through the gallery to follow ${build.title} one image at a time.`;

  const stageImage = root.querySelector('.stack-main-image');
  const stageButton = root.querySelector('[data-stack-open]');
  if (stageImage) {
    stageImage.src = encodedImages[0];
    stageImage.alt = `${build.title} apartment featured interior view.`;
  }
  if (stageButton) {
    stageButton.dataset.imageSrc = encodedImages[0];
    stageButton.dataset.imageAlt = `${build.title} apartment featured interior view.`;
  }

  const thumbs = root.querySelector('[data-stack-thumbs]');
  if (thumbs) {
    thumbs.innerHTML = encodedImages.map((src, thumbIndex) => `
      <button class="stack-thumb${thumbIndex === 0 ? ' active' : ''}" type="button" data-stack-thumb data-image-src="${src}" data-image-alt="${build.title} apartment image ${thumbIndex + 1}.">
        <img class="gallery-image" src="${src}" alt="">
      </button>
    `).join('');
  }

  const prevLink = root.querySelector('[data-apartment-prev]');
  const nextLink = root.querySelector('[data-apartment-next]');

  if (prevLink) {
    if (prevBuild) {
      prevLink.href = `apartment-build.html?category=${config.slug}&build=${prevBuild.slug}`;
      prevLink.innerHTML = `<span class="gallery-pager-label">Previous Build</span><strong>${prevBuild.title}</strong>`;
    } else {
      prevLink.href = config.landingPage;
      prevLink.innerHTML = `<span class="gallery-pager-label">Back</span><strong>${config.collectionLabel}</strong>`;
    }
  }

  if (nextLink) {
    if (nextBuild) {
      nextLink.href = `apartment-build.html?category=${config.slug}&build=${nextBuild.slug}`;
      nextLink.innerHTML = `<span class="gallery-pager-label">Next Build</span><strong>${nextBuild.title}</strong>`;
    } else {
      nextLink.href = config.landingPage;
      nextLink.innerHTML = `<span class="gallery-pager-label">Back</span><strong>${config.collectionLabel}</strong>`;
    }
  }
};

renderApartmentLanding();
renderApartmentDetail();

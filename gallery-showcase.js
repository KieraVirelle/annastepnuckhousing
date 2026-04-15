const setupRotators = () => {
  const rotators = document.querySelectorAll('[data-rotate-gallery]');

  rotators.forEach((rotator) => {
    const img = rotator.querySelector('img');
    const sources = (rotator.dataset.images || '')
      .split('|')
      .map((item) => item.trim())
      .filter(Boolean);

    if (!img || sources.length < 2) return;

    let index = 0;
    const interval = Number(rotator.dataset.rotateInterval || 4200);
    let isTransitioning = false;

    const swapImage = (nextIndex) => {
      if (isTransitioning) return;
      isTransitioning = true;
      rotator.classList.add('is-transitioning');

      window.setTimeout(() => {
        index = nextIndex;
        img.src = sources[index];
        requestAnimationFrame(() => {
          rotator.classList.remove('is-transitioning');
          window.setTimeout(() => {
            isTransitioning = false;
          }, 760);
        });
      }, 360);
    };

    window.setInterval(() => {
      const nextIndex = (index + 1) % sources.length;
      swapImage(nextIndex);
    }, interval);
  });
};

const setupStackShowcases = () => {
  const showcases = document.querySelectorAll('[data-stack-showcase]');

  showcases.forEach((showcase) => {
    const thumbs = Array.from(showcase.querySelectorAll('[data-stack-thumb]'));
    const mainImage = showcase.querySelector('.stack-main-image');
    const openButton = showcase.querySelector('[data-stack-open]');
    const current = showcase.querySelector('[data-stack-current]');
    const total = showcase.querySelector('[data-stack-total]');
    const prev = showcase.querySelector('[data-stack-prev]');
    const next = showcase.querySelector('[data-stack-next]');

    if (!thumbs.length || !mainImage || !openButton) return;

    let index = thumbs.findIndex((thumb) => thumb.classList.contains('active'));
    if (index < 0) index = 0;
    let isTransitioning = false;

    const render = (animate = false) => {
      const activeThumb = thumbs[index];
      const src = activeThumb.dataset.imageSrc;
      const alt = activeThumb.dataset.imageAlt || '';

      if (animate) {
        if (isTransitioning) return;
        isTransitioning = true;
        showcase.classList.add('is-transitioning');
      }

      const commit = () => {
        mainImage.src = src;
        mainImage.alt = alt;
        openButton.dataset.imageSrc = src;
        openButton.dataset.imageAlt = alt;

        thumbs.forEach((thumb, thumbIndex) => {
          thumb.classList.toggle('active', thumbIndex === index);
        });

        if (current) current.textContent = String(index + 1);
        if (total) total.textContent = String(thumbs.length);
      };

      if (animate) {
        window.setTimeout(() => {
          commit();
          requestAnimationFrame(() => {
            showcase.classList.remove('is-transitioning');
            window.setTimeout(() => {
              isTransitioning = false;
            }, 780);
          });
        }, 340);
        return;
      }

      commit();
    };

    thumbs.forEach((thumb, thumbIndex) => {
      thumb.addEventListener('click', () => {
        if (thumbIndex === index) return;
        index = thumbIndex;
        render(true);
      });
    });

    if (prev) {
      prev.addEventListener('click', () => {
        if (isTransitioning) return;
        index = (index - 1 + thumbs.length) % thumbs.length;
        render(true);
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        if (isTransitioning) return;
        index = (index + 1) % thumbs.length;
        render(true);
      });
    }

    render();
  });
};

const setupLightbox = () => {
  const lightbox = document.querySelector('[data-lightbox]');
  if (!lightbox) return;

  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const closeTargets = lightbox.querySelectorAll('[data-lightbox-close]');
  const triggers = document.querySelectorAll('[data-gallery-image]');
  let lastTrigger = null;

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.src = '';
    lightboxImage.alt = '';
    document.body.style.overflow = '';
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.dataset.imageSrc;
      const alt = trigger.dataset.imageAlt || '';
      if (!src) return;

      lastTrigger = trigger;
      lightboxImage.src = src;
      lightboxImage.alt = alt;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  closeTargets.forEach((target) => {
    target.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
};

setupRotators();
setupStackShowcases();
setupLightbox();

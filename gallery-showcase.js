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

const createGalleryMediaElement = (media, { lightbox = false } = {}) => {
  const type = media.type === 'video' ? 'video' : 'image';
  const src = media.src || '';
  const alt = media.alt || '';

  if (type === 'video') {
    const video = document.createElement('video');
    video.className = 'gallery-image';
    video.src = src;
    video.playsInline = true;
    video.preload = 'metadata';
    video.controls = lightbox;
    video.autoplay = !lightbox;
    video.loop = !lightbox;
    video.muted = true;
    video.setAttribute('aria-label', alt);
    return video;
  }

  const img = document.createElement('img');
  img.className = 'gallery-image';
  img.src = src;
  img.alt = alt;
  return img;
};

const readGalleryMedia = (trigger) => {
  const src = trigger.dataset.mediaSrc || trigger.dataset.imageSrc || '';
  const alt = trigger.dataset.mediaAlt || trigger.dataset.imageAlt || '';
  const type = trigger.dataset.mediaType || (/\.(mp4|webm)$/i.test(src) ? 'video' : 'image');
  return { type, src, alt };
};

const setupStackShowcases = () => {
  const showcases = document.querySelectorAll('[data-stack-showcase]');

  showcases.forEach((showcase) => {
    const thumbs = Array.from(showcase.querySelectorAll('[data-stack-thumb]'));
    const mediaContainer = showcase.querySelector('[data-stack-media]');
    let stageNode = showcase.querySelector('.stack-main-image');
    const openButton = showcase.querySelector('[data-stack-open]');
    const current = showcase.querySelector('[data-stack-current]');
    const total = showcase.querySelector('[data-stack-total]');
    const prev = showcase.querySelector('[data-stack-prev]');
    const next = showcase.querySelector('[data-stack-next]');
    const caption = showcase.querySelector('.gallery-tile-caption');

    if (!thumbs.length || (!mediaContainer && !stageNode) || !openButton) return;

    let index = thumbs.findIndex((thumb) => thumb.classList.contains('active'));
    if (index < 0) index = 0;
    let isTransitioning = false;

    const renderMedia = (media) => {
      const element = createGalleryMediaElement(media);

      if (mediaContainer) {
        mediaContainer.replaceChildren(element);
        stageNode = mediaContainer.querySelector('.gallery-image');
      } else if (stageNode) {
        if (stageNode.tagName === 'IMG' && element.tagName === 'IMG') {
          stageNode.src = element.src;
          stageNode.alt = element.alt;
        } else {
          stageNode.replaceWith(element);
          stageNode = element;
        }
      }

      if (media.type === 'video' && stageNode && stageNode.tagName === 'VIDEO') {
        stageNode.play().catch(() => {});
      }
    };

    const commit = () => {
      const activeThumb = thumbs[index];
      const media = readGalleryMedia(activeThumb);

      const activeVideo = mediaContainer?.querySelector('video') || (stageNode && stageNode.tagName === 'VIDEO' ? stageNode : null);
      if (activeVideo && activeVideo !== stageNode) activeVideo.pause();

      renderMedia(media);

      openButton.dataset.mediaType = media.type;
      openButton.dataset.mediaSrc = media.src;
      openButton.dataset.mediaAlt = media.alt;
      openButton.dataset.imageSrc = media.src;
      openButton.dataset.imageAlt = media.alt;
      if (caption) {
        caption.textContent = media.type === 'video' ? 'Play full view' : 'Open full view';
      }

      thumbs.forEach((thumb, thumbIndex) => {
        thumb.classList.toggle('active', thumbIndex === index);
      });

      if (current) current.textContent = String(index + 1);
      if (total) total.textContent = String(thumbs.length);
    };

    const render = (animate = false) => {
      if (!animate) {
        commit();
        return;
      }

      if (isTransitioning) return;
      isTransitioning = true;
      showcase.classList.add('is-transitioning');

      window.setTimeout(() => {
        commit();
        requestAnimationFrame(() => {
          showcase.classList.remove('is-transitioning');
          window.setTimeout(() => {
            isTransitioning = false;
          }, 780);
        });
      }, 340);
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

  const lightboxDialog = lightbox.querySelector('.lightbox-dialog');
  const lightboxMedia = lightbox.querySelector('[data-lightbox-media]');
  let lightboxNode = lightboxMedia?.querySelector('.gallery-image') || lightbox.querySelector('.lightbox-image');
  const closeTargets = lightbox.querySelectorAll('[data-lightbox-close]');
  const triggers = document.querySelectorAll('[data-gallery-image]');
  let lastTrigger = null;

  const closeLightbox = () => {
    const activeVideo = lightboxMedia?.querySelector('video') || (lightboxNode && lightboxNode.tagName === 'VIDEO' ? lightboxNode : null);
    if (activeVideo) activeVideo.pause();
    if (lightboxMedia) {
      lightboxMedia.replaceChildren();
    }
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const media = readGalleryMedia(trigger);
      if (!media.src && !lightboxNode && !lightboxMedia) return;

      lastTrigger = trigger;
      const element = createGalleryMediaElement(media, { lightbox: true });

      if (lightboxMedia) {
        lightboxMedia.replaceChildren(element);
        lightboxNode = lightboxMedia.querySelector('.gallery-image');
      } else if (lightboxNode) {
        if (lightboxNode.tagName === 'IMG' && element.tagName === 'IMG') {
          lightboxNode.src = element.src;
          lightboxNode.alt = element.alt;
        } else {
          lightboxNode.replaceWith(element);
          lightboxNode = element;
        }
      }

      if (lightboxDialog) {
        lightboxDialog.setAttribute('aria-label', media.type === 'video' ? 'Expanded gallery video' : 'Expanded gallery image');
      }
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';

      if (media.type === 'video' && element.tagName === 'VIDEO') {
        element.play().catch(() => {});
      }
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

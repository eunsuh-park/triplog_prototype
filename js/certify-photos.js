/**
 * 인증 플로우 — 사진 선택 (앨범 / 카메라) 상태
 */
(function () {
  const MAX = 5;
  const MIN = 1;

  const ALBUM_POOL = [
    { id: 'a1', src: 'https://images.unsplash.com/photo-1538485049741-fc4ae4a8b63e?w=300&h=300&fit=crop' },
    { id: 'a2', src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=300&fit=crop' },
    { id: 'a3', src: 'https://images.unsplash.com/photo-1517154428173-894dca833cd7?w=300&h=300&fit=crop' },
    { id: 'a4', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop' },
    { id: 'a5', src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop' },
    { id: 'a6', src: 'https://images.unsplash.com/photo-1596436889106-be68e8434434?w=300&h=300&fit=crop' },
    { id: 'a7', src: 'https://images.unsplash.com/photo-1469854523086-cc02efe5d880?w=300&h=300&fit=crop' },
    { id: 'a8', src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=300&fit=crop' },
    { id: 'a9', src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=300&fit=crop' },
    { id: 'a10', src: 'https://images.unsplash.com/photo-1528183429752-a97d0ef99f5e?w=300&h=300&fit=crop' },
    { id: 'a11', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop' },
    { id: 'a12', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop' },
  ];

  let selected = [];
  let cameraShotIndex = 0;

  function getPhoto(id) {
    return ALBUM_POOL.find((p) => p.id === id) || selected.find((p) => p.id === id);
  }

  function isSelected(id) {
    return selected.some((p) => p.id === id);
  }

  function atMax() {
    return selected.length >= MAX;
  }

  function toggleAlbum(id) {
    if (isSelected(id)) {
      selected = selected.filter((p) => p.id !== id);
      return;
    }
    if (atMax()) return;
    const photo = ALBUM_POOL.find((p) => p.id === id);
    if (photo) selected = [...selected, photo];
  }

  function addCameraShot() {
    if (atMax()) return;
    cameraShotIndex += 1;
    const id = `cam${cameraShotIndex}`;
    const photo = {
      id,
      src: ALBUM_POOL[(cameraShotIndex - 1) % ALBUM_POOL.length].src,
    };
    selected = [...selected, photo];
    return photo;
  }

  function reset() {
    selected = [];
    cameraShotIndex = 0;
  }

  function updateNextButtons() {
    const enabled = selected.length >= MIN;
    document.querySelectorAll('[data-cert-photos-next]').forEach((btn) => {
      btn.disabled = !enabled;
      btn.classList.toggle('cert-flow__next--active', enabled);
    });
    document.querySelectorAll('[data-cert-photos-count]').forEach((el) => {
      el.textContent = `${selected.length}/${MAX}`;
    });
  }

  function renderAlbumGrid(root) {
    const grid = root?.querySelector('[data-cert-album-grid]');
    if (!grid) return;

    grid.innerHTML = ALBUM_POOL.map((photo) => {
      const on = isSelected(photo.id);
      const disabled = !on && atMax();
      return `
        <button
          type="button"
          class="cert-photo-cell${on ? ' cert-photo-cell--selected' : ''}${disabled ? ' cert-photo-cell--disabled' : ''} is-pressable"
          data-cert-photo-id="${photo.id}"
          ${disabled ? 'disabled' : ''}
          aria-pressed="${on}"
        >
          <img src="${photo.src}" alt="">
          ${on ? '<span class="cert-photo-cell__check"><iconify-icon icon="mingcute:check-fill" width="14"></iconify-icon></span>' : ''}
        </button>
      `;
    }).join('');

    updateNextButtons();
  }

  function renderCameraPreview(root) {
    const preview = root?.querySelector('[data-cert-camera-preview]');
    const strip = root?.querySelector('[data-cert-camera-strip]');
    const shutter = root?.querySelector('[data-cert-camera-capture]');
    if (preview && selected.length) {
      const last = selected[selected.length - 1];
      preview.innerHTML = `<img src="${last.src}" alt="촬영 미리보기">`;
    } else if (preview) {
      preview.innerHTML = '<span class="cert-camera__placeholder">촬영 대기</span>';
    }
    if (strip) {
      strip.innerHTML = selected
        .map(
          (p) =>
            `<span class="cert-camera__thumb"><img src="${p.src}" alt=""></span>`
        )
        .join('');
    }
    if (shutter) {
      shutter.disabled = atMax();
      shutter.classList.toggle('cert-camera__shutter--disabled', atMax());
    }
    updateNextButtons();
  }

  function removePhoto(id) {
    selected = selected.filter((p) => p.id !== id);
    renderReviewPhotos();
    updateNextButtons();
  }

  function renderReviewPhotos() {
    document.querySelectorAll('[data-cert-review-photos]').forEach((wrap) => {
      const editable = wrap.dataset.certReviewEditable === 'true';

      const items = selected
        .map(
          (p) => `
        <div class="cert-review-photos__cell">
          <img class="cert-review-photos__item" src="${p.src}" alt="">
          ${
            editable
              ? `<button type="button" class="cert-review-photos__remove is-pressable" data-cert-review-remove="${p.id}" aria-label="사진 삭제"><iconify-icon icon="mingcute:close-line" width="10"></iconify-icon></button>`
              : ''
          }
        </div>
      `
        )
        .join('');

      const addBtn =
        editable && !atMax()
          ? `<button type="button" class="cert-review-photos__add is-pressable" data-go="certifyPhotoSource" aria-label="사진 추가"><iconify-icon icon="mingcute:add-line" width="22"></iconify-icon></button>`
          : '';

      if (!selected.length && !addBtn) {
        wrap.hidden = true;
        wrap.innerHTML = '';
        return;
      }

      wrap.hidden = false;
      wrap.innerHTML = items + addBtn;
    });
  }

  function bindPicker(app) {
    if (!app) return;

    app.addEventListener('click', (e) => {
      const albumBtn = e.target.closest('[data-cert-photo-id]');
      if (albumBtn && !albumBtn.disabled) {
        toggleAlbum(albumBtn.dataset.certPhotoId);
        const root = albumBtn.closest('[data-cert-album-root]');
        renderAlbumGrid(root);
        return;
      }

      const captureBtn = e.target.closest('[data-cert-camera-capture]');
      if (captureBtn && !captureBtn.disabled) {
        addCameraShot();
        const root = captureBtn.closest('[data-cert-camera-root]');
        renderCameraPreview(root);
        return;
      }

      const nextBtn = e.target.closest('[data-cert-photos-next]');
      if (nextBtn && !nextBtn.disabled && window.showCertifyReviewWithPhotos) {
        window.showCertifyReviewWithPhotos();
        return;
      }

      const removeBtn = e.target.closest('[data-cert-review-remove]');
      if (removeBtn) {
        removePhoto(removeBtn.dataset.certReviewRemove);
      }
    });
  }

  window.CertifyPhotos = {
    MAX,
    MIN,
    reset,
    renderAlbumGrid,
    renderCameraPreview,
    renderReviewPhotos,
    getSelected: () => [...selected],
  };

  const app = document.getElementById('interactiveApp');
  bindPicker(app);
})();

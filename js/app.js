/**
 * Triplog — navigation, feedback, micro-interactions
 */
(function () {
  const app = document.getElementById('interactiveApp');
  if (!app) return;

  const panels = app.querySelectorAll('[data-screen]');
  const navItems = app.querySelectorAll('[data-nav]');
  const bottomNav = app.querySelector('.bottom-nav');
  const backButtons = app.querySelectorAll('[data-back]');
  const segments = app.querySelectorAll('.segment-control button');
  const carouselPrev = app.querySelector('[data-carousel-prev]');
  const carouselNext = app.querySelector('[data-carousel-next]');
  const carouselPager = app.querySelector('[data-carousel-pager]');
  const carouselImg = app.querySelector('[data-carousel-img]');
  const carouselName = app.querySelector('[data-carousel-name]');
  const carouselAddr = app.querySelector('[data-carousel-addr]');
  const carouselCard = app.querySelector('[data-carousel-card]');
  const topbarLabel = app.querySelector('[data-screen-label]');
  const progressFills = app.querySelectorAll('[data-animate-progress]');

  const regionDetailRoot = app.querySelector('[data-region-detail]');

  const TAB_SCREENS = ['map', 'dex', 'rank', 'settings'];
  const SUB_SCREENS = [
    'detail',
    'exploreProvince',
    'exploreCity',
    'certifySearch',
    'certify',
    'certifyVisit',
    'certifyPhoto',
    'certifyPhotoSource',
    'certifyPhotoAlbum',
    'certifyPhotoCamera',
    'certifyReview',
    'certifyReviewDone',
    'certifyComplete',
    'certHistory',
  ];

  const landmarks = [
    {
      name: '경복궁',
      addr: '서울특별시 종로구 사직로 161',
      img: 'https://images.unsplash.com/photo-1538485049741-fc4ae4a8b63e?w=400&h=500&fit=crop',
    },
    {
      name: '남산서울타워',
      addr: '서울특별시 용산구 남산공원길 105',
      img: 'https://images.unsplash.com/photo-1517154428173-894dca833cd7?w=400&h=500&fit=crop',
    },
    {
      name: '북촌한옥마을',
      addr: '서울특별시 종로구 계동길 37',
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=500&fit=crop',
    },
  ];

  let carouselIndex = 0;
  let toastTimer = null;
  let certifySearchTimer = null;
  const screenStack = ['map'];

  const CERTIFY_SEARCH_DELAY_MS = 1400;

  const screenLabels = {
    map: '홈 · 전국 지도 · EXPLORE-01',
    dex: '도감 · HOME-01',
    rank: '랭킹 · RANK-01',
    settings: '마이 · MY-01',
    detail: '랜드마크 상세 · RECORD-01',
    exploreProvince: '탐험 · 경기도 · EXPLORE-02',
    exploreCity: '탐험 · 하남시 · EXPLORE-03',
    certifySearch: '인증 · 검색 · CERT-01',
    certify: '인증 · 랜드마크 선택 · CERT-02',
    certifyVisit: '인증 · 방문 완료 · CERT-03',
    certifyPhoto: '인증 · 사진 · CERT-04',
    certifyPhotoSource: '인증 · 사진 선택 · CERT-04a',
    certifyPhotoAlbum: '인증 · 앨범 · CERT-04b',
    certifyPhotoCamera: '인증 · 카메라 · CERT-04c',
    certifyReview: '인증 · 후기 · CERT-05',
    certifyReviewDone: '인증 · 후기 완료 · CERT-06',
    certifyComplete: '인증 · 완료 · CERT-07',
    certHistory: '마이 · 인증 내역 · HISTORY-01',
  };

  const toastEl = document.createElement('div');
  toastEl.className = 'toast';
  toastEl.setAttribute('role', 'status');
  app.appendChild(toastEl);

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  function animateProgressBars() {
    progressFills.forEach((bar) => {
      const target = bar.dataset.animateProgress;
      bar.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.width = target;
        });
      });
    });
  }

  function clearCertifySearchTimer() {
    if (certifySearchTimer) {
      clearTimeout(certifySearchTimer);
      certifySearchTimer = null;
    }
  }

  function scheduleCertifySearchAdvance() {
    clearCertifySearchTimer();
    certifySearchTimer = setTimeout(() => {
      certifySearchTimer = null;
      if (screenStack[screenStack.length - 1] !== 'certifySearch') return;
      screenStack[screenStack.length - 1] = 'certify';
      showScreen('certify', false);
    }, CERTIFY_SEARCH_DELAY_MS);
  }

  function showScreen(id, push = true) {
    panels.forEach((p) => {
      const on = p.dataset.screen === id;
      p.classList.toggle('active', on);
      if (on) {
        p.style.animation = 'none';
        void p.offsetWidth;
        p.style.animation = '';
      }
    });

    const isSubScreen = SUB_SCREENS.includes(id);
    const isTabScreen = TAB_SCREENS.includes(id);

    if (bottomNav) bottomNav.classList.toggle('hidden', isSubScreen);

    navItems.forEach((n) => {
      n.classList.toggle('active', isTabScreen && n.dataset.nav === id);
    });

    if (id === 'certHistory' && window.renderCertHistory) {
      renderCertHistory(app.querySelector('[data-cert-history-root]'));
    }
    if (id === 'certify' && window.renderCertifyList) {
      renderCertifyList(app.querySelector('[data-certify-root]'));
    }
    if (id === 'certifyPhotoAlbum' && window.CertifyPhotos) {
      CertifyPhotos.renderAlbumGrid(app.querySelector('[data-cert-album-root]'));
    }
    if (id === 'certifyPhotoCamera' && window.CertifyPhotos) {
      CertifyPhotos.renderCameraPreview(app.querySelector('[data-cert-camera-root]'));
    }
    if ((id === 'certifyReview' || id === 'certifyReviewDone') && window.CertifyPhotos) {
      CertifyPhotos.renderReviewPhotos();
    }

    if (id === 'certifySearch') {
      scheduleCertifySearchAdvance();
    } else {
      clearCertifySearchTimer();
    }

    if (topbarLabel) topbarLabel.textContent = screenLabels[id] || id;
    if (push) screenStack.push(id);

    if (id === 'dex') animateProgressBars();
  }

  function openRegionDetail(regionName) {
    const region = window.TRIPLOG_REGIONS?.find((r) => r.name === regionName);
    if (!region) return;

    setRegionView('grid');

    if (window.renderRegionDetail && regionDetailRoot) {
      window.renderRegionDetail(region, regionDetailRoot);
    }

    showScreen('exploreProvince');

    if (topbarLabel) {
      topbarLabel.textContent = `탐험 · ${region.name} · EXPLORE-02`;
    }
  }

  function setRegionView(view) {
    app.querySelectorAll('[data-region-view]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.regionView === view);
    });
    app.querySelectorAll('[data-region-view-panel]').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.regionViewPanel === view);
    });
  }

  app.querySelectorAll('[data-region-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setRegionView(btn.dataset.regionView);
    });
  });

  if (regionDetailRoot) {
    regionDetailRoot.addEventListener('click', (e) => {
      if (e.target.closest('[data-go="detail"]')) {
        showScreen('detail');
        return;
      }
      const home = e.target.closest('[data-region-homepage]');
      if (home && home.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('공식 홈페이지 (준비 중)');
      }
    });
  }

  function goBack() {
    if (screenStack.length > 1) {
      screenStack.pop();
      showScreen(screenStack[screenStack.length - 1], false);
    }
  }

  window.showCertifyReviewWithPhotos = function showCertifyReviewWithPhotos() {
    if (window.CertifyPhotos) CertifyPhotos.renderReviewPhotos();
    showScreen('certifyReview');
  };

  function updateCarousel(direction) {
    const item = landmarks[carouselIndex];
    if (carouselImg) {
      carouselImg.style.opacity = '0';
      carouselImg.style.transform = direction === 'next' ? 'translateX(12px)' : direction === 'prev' ? 'translateX(-12px)' : 'none';
      setTimeout(() => {
        carouselImg.src = item.img;
        carouselImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        carouselImg.style.opacity = '1';
        carouselImg.style.transform = 'translateX(0)';
      }, 120);
    }
    if (carouselName) carouselName.textContent = item.name;
    if (carouselAddr) carouselAddr.textContent = item.addr;
    if (carouselPager) carouselPager.textContent = `${carouselIndex + 1} / ${landmarks.length}`;
    if (carouselCard) {
      carouselCard.classList.remove('shake');
      void carouselCard.offsetWidth;
      carouselCard.classList.add('shake');
    }
  }

  navItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nav = btn.dataset.nav;
      if (!nav) return;
      const labels = { map: '홈', dex: '도감', rank: '랭킹', settings: '마이' };
      screenStack.length = 0;
      screenStack.push(nav);
      showScreen(nav, false);
      if (nav === 'map' && window.KoreaMapModule) KoreaMapModule.showNational();
      showToast(`${labels[nav]} 탭`);
    });
  });

  const certifyNavBtn = app.querySelector('[data-action="certify"]');
  if (certifyNavBtn) {
    certifyNavBtn.addEventListener('click', () => {
      const lastTab = [...screenStack].reverse().find((id) => TAB_SCREENS.includes(id)) || 'map';
      if (screenStack[screenStack.length - 1] !== lastTab) {
        screenStack.length = 0;
        screenStack.push(lastTab);
      }
      showScreen('certifySearch', true);
    });
  }

  function finishCertifyFlow() {
    const lastTab = [...screenStack].reverse().find((id) => TAB_SCREENS.includes(id)) || 'map';
    screenStack.length = 0;
    screenStack.push(lastTab);
    showScreen(lastTab, false);
  }

  backButtons.forEach((btn) => btn.addEventListener('click', goBack));

  app.addEventListener('click', (e) => {
    const finishBtn = e.target.closest('[data-action="certify-finish"]');
    if (finishBtn && app.contains(finishBtn)) {
      finishCertifyFlow();
      return;
    }

    const btn = e.target.closest('[data-go]');
    if (!btn || !app.contains(btn)) return;

    if (btn.dataset.certSkipPhotos && window.CertifyPhotos) {
      CertifyPhotos.reset();
    }
    if (btn.dataset.certResetPhotos && window.CertifyPhotos) {
      CertifyPhotos.reset();
    }

    const target = btn.dataset.go;
    if (!target) return;

    const regionName = btn.dataset.region;
    if (target === 'exploreProvince' && regionName) {
      openRegionDetail(regionName);
      return;
    }

    showScreen(target);
  });

  segments.forEach((btn) => {
    btn.addEventListener('click', () => {
      segments.forEach((s) => s.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const nicknameEditBtn = app.querySelector('[data-nickname-edit]');
  if (nicknameEditBtn) {
    nicknameEditBtn.addEventListener('click', () => showToast('닉네임 변경 (준비 중)'));
  }

  app.querySelectorAll('.my-menu__item').forEach((item) => {
    item.addEventListener('click', () => {
      if (item.dataset.go) return;
      const label = item.querySelector('span')?.textContent;
      if (label) showToast(`${label} (준비 중)`);
    });
  });

  const fab = app.querySelector('.fab');
  if (fab) {
    fab.addEventListener('click', () => showToast('내 위치로 이동'));
  }

  const moreBtn = app.querySelector('[data-more]');
  if (moreBtn) {
    moreBtn.addEventListener('click', () => showToast('최근 방문 더보기'));
  }

  if (carouselPrev) {
    carouselPrev.addEventListener('click', () => {
      carouselIndex = (carouselIndex - 1 + landmarks.length) % landmarks.length;
      updateCarousel('prev');
    });
  }

  if (carouselNext) {
    carouselNext.addEventListener('click', () => {
      carouselIndex = (carouselIndex + 1) % landmarks.length;
      updateCarousel('next');
    });
  }

  let touchStartX = 0;
  const carouselWrap = app.querySelector('[data-carousel-card]');
  if (carouselWrap) {
    carouselWrap.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carouselWrap.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) {
        carouselIndex = (carouselIndex + 1) % landmarks.length;
        updateCarousel('next');
      } else {
        carouselIndex = (carouselIndex - 1 + landmarks.length) % landmarks.length;
        updateCarousel('prev');
      }
    }, { passive: true });
  }

  const koreaMapEl = app.querySelector('[data-korea-map]');
  if (koreaMapEl && window.KoreaMapModule) {
    KoreaMapModule.init(koreaMapEl, {
      onRegionExplore(regionName) {
        openRegionDetail(regionName);
      },
    });
  }

  if (window.renderCertHistory) {
    renderCertHistory(app.querySelector('[data-cert-history-root]'));
  }
  if (window.renderCertifyList) {
    renderCertifyList(app.querySelector('[data-certify-root]'));
  }

  updateCarousel();
  showScreen('map', false);
})();

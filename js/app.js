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
  const carouselPager = app.querySelector('[data-carousel-pager]');
  const carouselTrack = app.querySelector('[data-carousel-track]');
  const detailStars = app.querySelector('[data-detail-stars]');
  const detailGrade = app.querySelector('[data-detail-grade]');
  const detailDistrict = app.querySelector('[data-detail-district]');
  const detailDate = app.querySelector('[data-detail-date]');
  const detailDesc = app.querySelector('[data-detail-desc]');
  const detailTagline = app.querySelector('[data-detail-tagline]');
  const detailRarity = app.querySelector('[data-detail-rarity]');
  const detailLoc = app.querySelector('[data-detail-loc]');
  const detailGradeEn = app.querySelector('[data-detail-grade-en]');
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
    'activityHistory',
    'myRegions',
    'myCards',
    'myBadges',
    'myRecords',
    'profileEdit',
    'rankGuide',
    'settingsNotify',
    'settingsHelp',
    'settingsApp',
    'authLogin',
    'authTerms',
    'authNickname',
    'recordWrite',
    'recordDetail',
    'weeklyMission',
    'titleSelect',
    'repBadge',
    'repCard',
    'feed',
    'feedDetail',
    'dexDistrict',
  ];

  // 카드 등급: Common · Rare · Epic · Legendary (정책 기준)
  const GRADE_META = {
    L: { ko: '전설', en: 'Legendary', tagline: '지역 상징성이 매우 큰 대표 명소' },
    E: { ko: '에픽', en: 'Epic', tagline: '인지도 높은 주요 명소' },
    R: { ko: '레어', en: 'Rare', tagline: '지역 대표 관광지' },
    C: { ko: '일반', en: 'Common', tagline: '일반 관광지' },
  };

  const landmarks = [
    {
      name: '경복궁',
      addr: '서울특별시 종로구 사직로 161',
      district: '서울 종로구',
      img: 'https://images.unsplash.com/photo-1538485049741-fc4ae4a8b63e?w=400&h=500&fit=crop',
      grade: 'R',
      rating: 4,
      date: '2026.03.20',
      desc: '조선 왕조의 법궁',
    },
    {
      name: '남산서울타워',
      addr: '서울특별시 용산구 남산공원길 105',
      district: '서울 용산구',
      img: 'https://images.unsplash.com/photo-1517154428173-894dca833cd7?w=400&h=500&fit=crop',
      grade: 'E',
      rating: 3,
      date: '2024.06.05',
      desc: '서울 야경의 랜드마크',
    },
    {
      name: '북촌한옥마을',
      addr: '서울특별시 종로구 계동길 37',
      district: '서울 종로구',
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=500&fit=crop',
      grade: 'C',
      rating: 3,
      date: '2026.02.11',
      desc: '전통 한옥이 모인 마을',
    },
  ];

  let carouselIndex = 0;
  let toastTimer = null;
  let certifySearchTimer = null;
  const screenStack = ['map'];

  const CERTIFY_SEARCH_DELAY_MS = 1400;
  const HOME_SCREEN = 'map';
  const SCROLL_NAV_HIDE_THRESHOLD = 10;
  const scrollNavPositions = new WeakMap();

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
    activityHistory: '마이 · 활동 히스토리 · ACTIVITY-01',
    myRegions: '마이 · 지역 정복 현황 · MY-02',
    myCards: '마이 · 카드 도감 · MY-03',
    myBadges: '마이 · 배지 컬렉션 · MY-04',
    myRecords: '마이 · 여행 기록 · MY-RECORDS',
    profileEdit: '마이 · 프로필 편집 · MY-EDIT',
    rankGuide: '마이 · 랭크 안내 · RANK-GUIDE',
    settingsNotify: '마이 · 알림 설정 · MY-05',
    settingsHelp: '마이 · 도움말/문의 · MY-06',
    settingsApp: '마이 · 앱 설정 · MY-07',
    authLogin: '인증 · 로그인 · AUTH-01',
    authTerms: '인증 · 약관 동의 · AUTH-02',
    authNickname: '인증 · 닉네임 · AUTH-03',
    recordWrite: '기록 · 작성 · RECORD-WRITE',
    recordDetail: '기록 · 상세 · RECORD-DETAIL',
    weeklyMission: '미션 · 주간 · MISSION-01',
    titleSelect: '프로필 · 칭호 · TITLE-01',
    repBadge: '프로필 · 대표 뱃지 · REP-BADGE',
    repCard: '프로필 · 대표 카드 · REP-CARD',
    feed: '커뮤니티 · 피드 · FEED-01',
    feedDetail: '커뮤니티 · 상세 · FEED-DETAIL',
    dexDistrict: '도감 · 대전 상세 · DEX-02',
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

  window.showToast = showToast;

  function setBottomNavScrollHidden(hidden) {
    if (!bottomNav || bottomNav.classList.contains('hidden')) return;
    bottomNav.classList.toggle('is-scroll-hidden', hidden);
  }

  function resetBottomNavScrollHide() {
    setBottomNavScrollHidden(false);
    const active = app.querySelector('.screen-panel.active');
    if (!active) return;
    active.querySelectorAll('.screen-scroll, .rank-scroll, .region-detail__body, .subpage__scroll, .certify-list').forEach((el) => {
      scrollNavPositions.set(el, el.scrollTop);
    });
  }

  function handleBottomNavScroll(e) {
    const container = e.currentTarget;
    const panel = container.closest('.screen-panel');
    if (!panel?.classList.contains('active')) return;
    if (panel.dataset.screen === HOME_SCREEN) return;
    if (!bottomNav || bottomNav.classList.contains('hidden')) return;

    const current = container.scrollTop;
    const previous = scrollNavPositions.get(container) ?? current;
    scrollNavPositions.set(container, current);

    if (current <= 0) {
      setBottomNavScrollHidden(false);
      return;
    }

    const delta = current - previous;
    if (delta > SCROLL_NAV_HIDE_THRESHOLD) {
      setBottomNavScrollHidden(true);
    } else if (delta < -SCROLL_NAV_HIDE_THRESHOLD) {
      setBottomNavScrollHidden(false);
    }
  }

  function initBottomNavScrollHide() {
    const scrollSelector = '.screen-scroll, .rank-scroll, .region-detail__body, .subpage__scroll, .certify-list';
    app.querySelectorAll(scrollSelector).forEach((el) => {
      if (el.dataset.scrollNavBound) return;
      el.dataset.scrollNavBound = '1';
      el.addEventListener('scroll', handleBottomNavScroll, { passive: true });
    });
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

    if (bottomNav) {
      bottomNav.classList.toggle('hidden', isSubScreen);
      if (id === HOME_SCREEN || isSubScreen) {
        bottomNav.classList.remove('is-scroll-hidden');
      }
    }
    resetBottomNavScrollHide();

    navItems.forEach((n) => {
      n.classList.toggle('active', isTabScreen && n.dataset.nav === id);
    });

    if (id === 'certHistory' && window.renderCertHistory) {
      renderCertHistory(app.querySelector('[data-cert-history-root]'));
    }
    if (id === 'activityHistory' && window.renderActivityHistory) {
      renderActivityHistory(app.querySelector('[data-activity-history-root]'));
    }
    if (id === 'myRecords' && window.renderMyRecords) {
      renderMyRecords(app.querySelector('[data-my-records-root]'));
    }
    if (id === 'rankGuide' && window.renderRankGuide) {
      renderRankGuide(app.querySelector('[data-rank-guide-root]'));
    }
    if (id === 'weeklyMission' && window.renderExtraScreens) {
      renderExtraScreens();
    }
    if (id === 'feed' && window.renderExtraScreens) {
      renderExtraScreens();
    }
    if (id === 'dexDistrict' && window.renderExtraScreens) {
      renderExtraScreens();
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
    if (id === 'detail') {
      updateCarousel();
      requestAnimationFrame(() => scrollDetailCarouselTo(carouselIndex, 'auto'));
    }
  }

  window.showScreen = showScreen;

  function openRegionDetail(regionName) {
    const region = window.TRIPLOG_REGIONS?.find((r) => r.name === regionName);
    if (!region) return;

    setRegionTab('cards');
    setRegionView('grid');

    if (window.renderRegionDetail && regionDetailRoot) {
      window.renderRegionDetail(region, regionDetailRoot);
    }

    showScreen('exploreProvince');

    if (topbarLabel) {
      topbarLabel.textContent = `탐험 · ${region.name} · EXPLORE-02`;
    }
  }

  let regionTab = 'cards';
  let regionView = 'grid';

  function syncRegionPanels() {
    app.querySelectorAll('[data-region-tab]').forEach((btn) => {
      const on = btn.dataset.regionTab === regionTab;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    app.querySelectorAll('[data-region-view]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.regionView === regionView);
    });
    app.querySelectorAll('[data-region-tab-panel]').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.regionTabPanel === regionTab);
    });
    app.querySelectorAll('[data-region-view-panel]').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.regionViewPanel === regionView);
    });
  }

  function setRegionTab(tab) {
    regionTab = tab;
    syncRegionPanels();
  }

  function setRegionView(view) {
    regionView = view;
    if (regionTab !== 'cards') regionTab = 'cards';
    syncRegionPanels();
  }

  app.querySelectorAll('[data-region-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setRegionTab(btn.dataset.regionTab);
    });
  });

  app.querySelectorAll('[data-region-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setRegionView(btn.dataset.regionView);
    });
  });

  if (regionDetailRoot) {
    regionDetailRoot.addEventListener('click', (e) => {
      const detailBtn = e.target.closest('[data-go="detail"]');
      if (detailBtn) {
        const idx = detailBtn.dataset.landmarkIndex;
        if (idx !== undefined && idx !== '') {
          carouselIndex = parseInt(idx, 10);
        }
        showScreen('detail');
        updateCarousel(carouselIndex);
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

  function buildDetailCarouselTrack() {
    if (!carouselTrack) return;
    carouselTrack.innerHTML = landmarks
      .map((item, index) => {
        const grade = GRADE_META[item.grade] || GRADE_META.C;
        const gradeCls = `grade-tag--${item.grade || 'C'}`;
        return `
          <div class="landmark-carousel__slide" data-carousel-slide="${index}">
            <div class="landmark-carousel__slide-inner">
              <img src="${item.img}" alt="${item.name}">
              <div class="landmark-carousel__overlay">
                <span class="grade-tag grade-tag--solid ${gradeCls}">${grade.en}</span>
                <div class="landmark-carousel__name">${item.name}</div>
                <div class="landmark-carousel__addr">${item.addr}</div>
              </div>
            </div>
          </div>`;
      })
      .join('');
  }

  function getDetailCarouselIndex() {
    if (!carouselTrack) return 0;
    const slides = carouselTrack.querySelectorAll('[data-carousel-slide]');
    if (!slides.length) return 0;
    const index = Math.round(carouselTrack.scrollLeft / carouselTrack.clientWidth);
    return Math.max(0, Math.min(index, slides.length - 1));
  }

  function scrollDetailCarouselTo(index, behavior = 'smooth') {
    if (!carouselTrack) return;
    const slide = carouselTrack.querySelector(`[data-carousel-slide="${index}"]`);
    if (!slide) return;
    carouselTrack.scrollTo({ left: slide.offsetLeft, behavior });
  }

  function initDetailCarousel() {
    if (!carouselTrack || carouselTrack.dataset.carouselInit) return;
    carouselTrack.dataset.carouselInit = '1';
    let scrollTimer;
    carouselTrack.addEventListener(
      'scroll',
      () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          const index = getDetailCarouselIndex();
          if (index !== carouselIndex) {
            carouselIndex = index;
            updateCarousel();
          }
        }, 80);
      },
      { passive: true }
    );
  }

  function updateCarousel(direction) {
    const item = landmarks[carouselIndex];
    if (!item) return;

    if (direction && carouselTrack) {
      scrollDetailCarouselTo(carouselIndex, 'smooth');
    }

    if (carouselPager) carouselPager.textContent = `${carouselIndex + 1} / ${landmarks.length}`;

    const activeSlide = carouselTrack?.querySelector(`[data-carousel-slide="${carouselIndex}"]`);
    if (activeSlide && direction) {
      activeSlide.classList.remove('shake');
      void activeSlide.offsetWidth;
      activeSlide.classList.add('shake');
    }

    updateDetailStats(item);
  }

  function updateDetailStats(item) {
    if (!item) return;
    const grade = GRADE_META[item.grade] || GRADE_META.C;
    const gradeCls = `grade-tag--${item.grade || 'C'}`;
    const shortLoc = (item.district || '').split(' ').slice(1).join(' ') || item.district || '';

    if (detailStars) {
      const max = 5;
      const rating = Math.max(0, Math.min(max, item.rating || 0));
      detailStars.innerHTML = Array.from({ length: max }, (_, i) =>
        `<iconify-icon icon="${i < rating ? 'mingcute:star-fill' : 'mingcute:star-line'}" width="16"></iconify-icon>`
      ).join('');
    }
    if (detailGrade) {
      detailGrade.textContent = grade.ko;
      detailGrade.className = `grade-tag ${gradeCls}`;
    }
    if (detailDistrict) detailDistrict.textContent = item.district || '';
    if (detailDate) detailDate.textContent = item.date || '';
    if (detailDesc) detailDesc.textContent = item.desc || '';
    if (detailTagline) {
      detailTagline.textContent = grade.tagline;
      detailTagline.className = `card-detail__tagline grade-text--${item.grade || 'C'}`;
    }
    if (detailRarity) detailRarity.textContent = grade.ko;
    if (detailLoc) detailLoc.textContent = shortLoc;
    if (detailGradeEn) detailGradeEn.textContent = grade.en;
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

    const authComplete = e.target.closest('[data-action="auth-complete"]');
    if (authComplete && app.contains(authComplete)) {
      screenStack.length = 0;
      screenStack.push('map');
      showScreen('map', false);
      showToast('환영해요! 트립로그를 시작해볼까요?');
      return;
    }

    const saveProfile = e.target.closest('[data-action="save-profile"]');
    if (saveProfile && app.contains(saveProfile)) {
      showToast('프로필이 저장되었어요');
      goBack();
      return;
    }

    const changeAvatar = e.target.closest('[data-action="change-avatar"]');
    if (changeAvatar && app.contains(changeAvatar)) {
      showToast('프로필 사진 변경 (준비 중)');
      return;
    }

    const logoutBtn = e.target.closest('[data-action="logout"]');
    if (logoutBtn && app.contains(logoutBtn)) {
      screenStack.length = 0;
      screenStack.push('authLogin');
      showScreen('authLogin', false);
      showToast('로그아웃되었습니다');
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
      if (regionName === '대전광역시') {
        showScreen('dexDistrict');
        return;
      }
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
      if (item.dataset.go || item.dataset.action) return;
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

  buildDetailCarouselTrack();
  initDetailCarousel();
  updateCarousel();
  requestAnimationFrame(() => scrollDetailCarouselTo(carouselIndex, 'auto'));

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

  initBottomNavScrollHide();
  showScreen('map', false);
})();

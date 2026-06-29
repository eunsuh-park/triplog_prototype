/**
 * 추가 화면 렌더 — 인증·기록·미션·피드·도감상세·프로필설정
 */
(function () {
  const TITLES = [
    { name: '대전 탐험가', condition: '대전 랜드마크 5곳 방문', earned: true, selected: true },
    { name: '기록형 여행자', condition: '여행 기록 10개 작성', earned: true, selected: false },
    { name: '사진 여행자', condition: '이미지 포함 기록 10개', earned: true, selected: false },
    { name: '카드 수집가', condition: '랜드마크 카드 10장', earned: true, selected: false },
    { name: '지도 정복자', condition: '지역 10곳 방문 완료', earned: false, selected: false },
  ];

  const MISSIONS = [
    { label: '랜드마크 1곳 인증하기', done: true, reward: '80 XP · 50 Score' },
    { label: '여행 기록 1개 작성하기', done: true, reward: '20 XP · 5 Score' },
    { label: '새로운 지역 방문하기', done: false, reward: '80 XP · 100 Score' },
    { label: '카드 1장 획득하기', done: false, reward: '20 XP · 20 Score' },
  ];

  const FEED = [
    { user: '대전여행자', avatar: '대', place: '한밭수목원', region: '대전 서구', date: '2시간 전', likes: 12, comments: 3, img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=280&fit=crop', excerpt: '봄꽃이 만개한 수목원 산책이었어요.' },
    { user: 'triplog123', avatar: 'T', place: '경복궁', region: '서울 종로구', date: '1일 전', likes: 28, comments: 7, img: 'https://images.unsplash.com/photo-1538485049741-fc4ae4a8b63e?w=400&h=280&fit=crop', excerpt: '한복 체험하고 경복궁 둘러봤어요.' },
    { user: '여행하는민서', avatar: '민', place: '해운대', region: '부산 해운대구', date: '3일 전', likes: 45, comments: 11, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=280&fit=crop', excerpt: '바다 보며 힐링하는 주말.' },
  ];

  const DEX_DISTRICTS = [
    { name: '유성구', visited: 8, total: 8, pct: 100, status: '완료' },
    { name: '중구', visited: 6, total: 8, pct: 80, status: '진행 중' },
    { name: '서구', visited: 4, total: 7, pct: 60, status: '진행 중' },
    { name: '동구', visited: 2, total: 6, pct: 30, status: '진행 중' },
    { name: '대덕구', visited: 0, total: 5, pct: 0, status: '미방문' },
  ];

  function renderTitles(root) {
    if (!root) return;
    const list = root.querySelector('[data-title-list]');
    if (!list) return;
    list.innerHTML = TITLES.map((t) => `
      <button class="title-row${t.selected ? ' title-row--selected' : ''}${!t.earned ? ' title-row--locked' : ''} is-pressable" type="button"${t.earned ? '' : ' disabled'}>
        <span class="title-row__badge">${t.earned ? '<iconify-icon icon="mingcute:check-circle-fill" width="20"></iconify-icon>' : '<iconify-icon icon="mingcute:lock-line" width="20"></iconify-icon>'}</span>
        <span class="title-row__body">
          <strong>${t.name}</strong>
          <em>${t.condition}</em>
        </span>
        ${t.selected ? '<span class="title-row__chip">대표</span>' : ''}
      </button>
    `).join('');
  }

  function renderRepBadges(root) {
    if (!root) return;
    const list = root.querySelector('[data-rep-badge-list]');
    const badges = window.TRIPLOG_MYPAGE?.BADGES?.filter((b) => b.earned) || [];
    if (!list) return;
    list.innerHTML = badges.map((b, i) => `
      <button class="rep-select-item${i < 5 ? ' rep-select-item--on' : ''} is-pressable" type="button">
        <span class="rep-select-item__icon"><iconify-icon icon="${b.icon}" width="24"></iconify-icon></span>
        <span class="rep-select-item__label">${b.label}</span>
        ${i < 5 ? '<iconify-icon class="rep-select-item__check" icon="mingcute:check-circle-fill" width="18"></iconify-icon>' : ''}
      </button>
    `).join('');
  }

  function renderRepCards(root) {
    if (!root) return;
    const list = root.querySelector('[data-rep-card-list]');
    const cards = window.TRIPLOG_MYPAGE?.CARDS || [];
    if (!list) return;
    list.innerHTML = cards.slice(0, 6).map((c, i) => `
      <button class="rep-card-item${i === 0 ? ' rep-card-item--on' : ''} is-pressable" type="button">
        <img src="${c.img}" alt="">
        <span>${c.name}</span>
        ${i === 0 ? '<iconify-icon class="rep-card-item__check" icon="mingcute:check-circle-fill" width="18"></iconify-icon>' : ''}
      </button>
    `).join('');
  }

  function renderMissions(root) {
    if (!root) return;
    const list = root.querySelector('[data-mission-list]');
    const done = MISSIONS.filter((m) => m.done).length;
    const progress = root.querySelector('[data-mission-progress]');
    const count = root.querySelector('[data-mission-count]');
    if (progress) progress.style.width = `${(done / MISSIONS.length) * 100}%`;
    if (count) count.textContent = `${done}/${MISSIONS.length}`;
    if (!list) return;
    list.innerHTML = MISSIONS.map((m) => `
      <div class="mission-row${m.done ? ' mission-row--done' : ''}">
        <span class="mission-row__check">${m.done ? '<iconify-icon icon="mingcute:check-circle-fill" width="22"></iconify-icon>' : '<span class="mission-row__circle"></span>'}</span>
        <div class="mission-row__body">
          <p class="mission-row__label">${m.label}</p>
          <p class="mission-row__reward">${m.reward}</p>
        </div>
      </div>
    `).join('');
  }

  function renderFeed(root) {
    if (!root) return;
    const list = root.querySelector('[data-feed-list]');
    if (!list) return;
    list.innerHTML = FEED.map((f) => `
      <article class="feed-card is-pressable" data-go="feedDetail">
        <header class="feed-card__head">
          <span class="feed-card__avatar">${f.avatar}</span>
          <div>
            <strong>${f.user}</strong>
            <em>${f.date}</em>
          </div>
        </header>
        <img class="feed-card__img" src="${f.img}" alt="">
        <div class="feed-card__body">
          <p class="feed-card__place">${f.place} · ${f.region}</p>
          <p class="feed-card__excerpt">${f.excerpt}</p>
          <div class="feed-card__actions">
            <span><iconify-icon icon="mingcute:thumb-up-2-line" width="16"></iconify-icon> ${f.likes}</span>
            <span><iconify-icon icon="mingcute:comment-line" width="16"></iconify-icon> ${f.comments}</span>
          </div>
        </div>
      </article>
    `).join('');
  }

  function renderDexDistrict(root) {
    if (!root) return;
    const list = root.querySelector('[data-dex-district-list]');
    if (!list) return;
    list.innerHTML = DEX_DISTRICTS.map((d) => {
      const cls = d.pct >= 100 ? 'dex-district--done' : d.pct > 0 ? 'dex-district--active' : 'dex-district--empty';
      return `
        <button class="dex-district ${cls} is-pressable" type="button" data-go="exploreCity">
          <div class="dex-district__head">
            <strong>${d.name}</strong>
            <span class="dex-district__status">${d.status}</span>
          </div>
          <div class="dex-district__bar progress-bar"><div class="progress-bar__fill" style="width:${d.pct}%"></div></div>
          <p class="dex-district__meta">랜드마크 ${d.visited}/${d.total} · ${d.pct}%</p>
        </button>
      `;
    }).join('');
  }

  window.renderExtraScreens = function () {
    const app = document.getElementById('interactiveApp');
    if (!app) return;
    renderTitles(app.querySelector('[data-title-select-root]'));
    renderRepBadges(app.querySelector('[data-rep-badge-root]'));
    renderRepCards(app.querySelector('[data-rep-card-root]'));
    renderMissions(app.querySelector('[data-mission-root]'));
    renderFeed(app.querySelector('[data-feed-root]'));
    renderDexDistrict(app.querySelector('[data-dex-district-root]'));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.renderExtraScreens);
  } else {
    window.renderExtraScreens();
  }
})();

/**
 * 마이페이지(MY-01) — 정책 기준 구성
 * ① 프로필·성장 ② 활동 요약 ③ 대표 뱃지 ④ 수집 카드 ⑤ 여행 기록
 */
(function () {
  const PROFILE = {
    initial: '성',
    name: '여행하는성훈',
    title: '대전 탐험가',
    level: 24,
    levelTitle: '여행 탐험가',
    rank: 'Gold',
    score: 1840,
    xp: 3720,
    xpMax: 4000,
  };

  const STATS = [
    { icon: 'mingcute:location-line', tint: 'teal', value: 7, unit: '곳', label: '방문 완료 지역', go: 'myRegions' },
    { icon: 'mingcute:camera-line', tint: 'green', value: 24, unit: '개', label: '인증 랜드마크', go: 'certHistory' },
    { icon: 'mingcute:medal-line', tint: 'gold', value: 12, unit: '개', label: '획득 뱃지', go: 'myBadges' },
    { icon: 'mingcute:card-line', tint: 'purple', value: 18, unit: '장', label: '수집 카드', go: 'myCards' },
  ];

  const GRADES = {
    L: { name: 'Legendary', ko: '전설', cls: 'grade--L' },
    E: { name: 'Epic', ko: '에픽', cls: 'grade--E' },
    R: { name: 'Rare', ko: '레어', cls: 'grade--R' },
    C: { name: 'Common', ko: '일반', cls: 'grade--C' },
  };

  const IMG = {
    seongsim: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=360&fit=crop',
    arboretum: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=360&fit=crop',
    expo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=360&fit=crop',
    hotspring: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=300&h=360&fit=crop',
    jangtae: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&h=360&fit=crop',
    bridge: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300&h=360&fit=crop',
    market: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=300&h=360&fit=crop',
    night: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300&h=360&fit=crop',
  };

  const CARDS = [
    { name: '성심당 본점', district: '대전 중구', grade: 'E', img: IMG.seongsim },
    { name: '한밭수목원', district: '대전 서구', grade: 'R', img: IMG.arboretum },
    { name: '엑스포과학공원', district: '대전 유성구', grade: 'R', img: IMG.expo },
    { name: '유성온천', district: '대전 유성구', grade: 'C', img: IMG.hotspring },
    { name: '장태산 자연휴양림', district: '대전 서구', grade: 'L', img: IMG.jangtae },
    { name: '대청호 오백리길', district: '대전 동구', grade: 'E', img: IMG.bridge },
    { name: '대전 중앙시장', district: '대전 중구', grade: 'C', img: IMG.market },
    { name: '국립중앙과학관', district: '대전 유성구', grade: 'L', img: IMG.expo },
  ];

  const CARDS_TOTAL = 32;

  const BADGES = [
    { icon: 'mingcute:footprint-line', label: '첫 발자국', desc: '첫 여행 기록 작성', earned: true, featured: true, current: 1, total: 1 },
    { icon: 'mingcute:map-2-line', label: '첫 랜드마크', desc: '랜드마크 1개 방문 인증', earned: true, featured: true, current: 1, total: 1 },
    { icon: 'mingcute:edit-line', label: '기록하는 여행자', desc: '여행 기록 5개 작성', earned: true, featured: true, current: 5, total: 5 },
    { icon: 'mingcute:camera-line', label: '사진 수집가', desc: '이미지 포함 기록 10개', earned: true, featured: false, current: 10, total: 10 },
    { icon: 'mingcute:location-line', label: '지역 탐험가', desc: '시/군/구 3곳 방문 완료', earned: true, featured: true, current: 3, total: 3 },
    { icon: 'mingcute:flag-1-line', label: '대전 정복자', desc: '대전 지역 완료', earned: true, featured: true, current: 1, total: 1 },
    { icon: 'mingcute:card-line', label: '카드 수집가', desc: '랜드마크 카드 10장', earned: true, featured: false, current: 10, total: 10 },
    { icon: 'mingcute:paint-brush-line', label: '지도 컬러러', desc: '지역 5곳 색칠 완료', earned: true, featured: false, current: 5, total: 5 },
    { icon: 'mingcute:earth-line', label: '전국 탐험가', desc: '시/군/구 10곳 방문 완료', earned: false, featured: false, current: 7, total: 10 },
    { icon: 'mingcute:crown-line', label: '트립로그 마스터', desc: '뱃지 10개 이상', earned: false, featured: false, current: 8, total: 10 },
  ];

  function travelTimelinePreview() {
    if (typeof window.renderTimelineItems === 'function' && window.TRIPLOG_RECORDS) {
      return renderTimelineItems(TRIPLOG_RECORDS, { limit: 3, clickable: true });
    }
    return '';
  }

  const CONQUER = [
    { name: '유성구', pct: 100, status: '완료' },
    { name: '중구', pct: 80, status: '진행 중' },
    { name: '서구', pct: 60, status: '진행 중' },
    { name: '동구', pct: 30, status: '진행 중' },
    { name: '대덕구', pct: 0, status: '미방문' },
  ];

  const NOTIFY = [
    { label: '레벨업 알림', desc: '레벨이 상승했을 때 알려드려요', on: true },
    { label: '랭크 상승 알림', desc: '랭크가 올랐을 때 알려드려요', on: true },
    { label: '뱃지 획득 알림', desc: '새 뱃지를 얻었을 때 알려드려요', on: true },
    { label: '카드 획득 알림', desc: '랜드마크 카드를 얻었을 때', on: true },
    { label: '지역 방문 완료 알림', desc: '지역 정복을 달성했을 때', on: true },
    { label: '주간 미션 완료 알림', desc: '주간 미션을 완료했을 때', on: false },
  ];

  const FAQ = [
    { q: 'XP와 Score는 무엇이 다른가요?', a: 'XP는 레벨 상승에, Score는 랭크와 랭킹 산정에 사용돼요. 방문 인증은 둘 다 올라가요.' },
    { q: '방문 인증은 어떻게 하나요?', a: '랜드마크 100m 이내에서 하단 인증 버튼을 눌러 GPS 또는 사진으로 인증할 수 있어요.' },
    { q: '지역 방문 완료 조건은?', a: '시/군/구 내 대표 랜드마크 방문 수에 따라 자동 판정돼요.' },
    { q: '닉네임 규칙은?', a: '2~12자, 한글·영문·숫자만 가능해요. 공백·특수문자·이모지는 사용할 수 없어요.' },
  ];

  const APP_SETTINGS = [
    { label: '대표 칭호 설정', kind: 'link', go: 'titleSelect' },
    { label: '대표 뱃지 설정', kind: 'link', go: 'repBadge' },
    { label: '대표 카드 설정', kind: 'link', go: 'repCard' },
    { label: '버전 정보', value: 'v1.0.0', kind: 'value' },
    { label: '이용약관', kind: 'link' },
    { label: '개인정보 처리방침', kind: 'link' },
  ];

  function pct(c, t) {
    return Math.min(100, Math.round((c / t) * 100));
  }

  function gradeChip(grade) {
    const g = GRADES[grade];
    return `<span class="grade-chip ${g ? g.cls : ''}">${g?.ko || grade}</span>`;
  }

  function collectCard(card, compact) {
    const sub = compact ? '' : `<p class="collect-card__sub">${card.district}</p>`;
    return `
      <button class="collect-card ${GRADES[card.grade]?.cls || ''} is-pressable" type="button" data-go="detail">
        <div class="collect-card__thumb">
          <img src="${card.img}" alt="" loading="lazy">
          ${gradeChip(card.grade)}
        </div>
        <p class="collect-card__name">${card.name}</p>
        ${sub}
      </button>
    `;
  }

  function badgeProgress(badge) {
    if (badge.earned) return 100;
    if (typeof badge.progress === 'number') return Math.min(100, Math.max(0, badge.progress));
    return pct(badge.current || 0, badge.total || 1);
  }

  function badgeProgressRing(progress, size) {
    const stroke = 3;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const p = Math.max(0, Math.min(100, progress));
    const offset = c - (c * p) / 100;
    const half = size / 2;
    return `<svg class="badge-item__ring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">
      <circle class="badge-item__ring-track" cx="${half}" cy="${half}" r="${r}" />
      <circle class="badge-item__ring-fill" cx="${half}" cy="${half}" r="${r}"
        stroke-dasharray="${c.toFixed(2)}"
        stroke-dashoffset="${offset.toFixed(2)}"
        transform="rotate(-90 ${half} ${half})" />
    </svg>`;
  }

  function badgeItem(badge, compact) {
    const lockedCls = badge.earned ? '' : ' badge-item--locked';
    const desc = !compact && badge.desc ? `<span class="badge-item__desc">${badge.desc}</span>` : '';
    const progress = badgeProgress(badge);
    const size = compact ? 56 : 64;
    const iconSize = compact ? 20 : 24;
    const progressLabel = badge.earned ? '100%' : `${progress}%`;
    return `
      <div class="badge-item${lockedCls}">
        <div class="badge-item__icon-wrap${badge.earned ? ' badge-item__icon-wrap--earned' : ''}" style="--badge-ring-size:${size}px" aria-label="달성율 ${progressLabel}">
          ${badgeProgressRing(progress, size)}
          <span class="badge-item__icon">
            <iconify-icon icon="${badge.earned ? badge.icon : 'mingcute:lock-line'}" width="${iconSize}" aria-hidden="true"></iconify-icon>
          </span>
        </div>
        <span class="badge-item__label">${badge.label}</span>
        ${desc}
        ${!compact && !badge.earned ? `<span class="badge-item__progress">${badge.current}/${badge.total}</span>` : ''}
      </div>
    `;
  }

  function renderMain(root) {
    if (!root) return;
    const xpPct = pct(PROFILE.xp, PROFILE.xpMax);

    root.innerHTML = `
      <div class="my-profile-card">
        <div class="my-profile-card__top">
          <span class="my-profile-card__avatar">${PROFILE.initial}</span>
          <div class="my-profile-card__actions">
            <button class="my-profile-card__btn is-pressable" type="button" data-go="profileEdit" aria-label="프로필 편집">
              <iconify-icon icon="mingcute:edit-2-line" width="16"></iconify-icon> 편집
            </button>
            <button class="my-profile-card__btn is-pressable" type="button" data-go="settingsApp" aria-label="설정">
              <iconify-icon icon="mingcute:settings-3-line" width="16"></iconify-icon> 설정
            </button>
          </div>
        </div>
        <p class="my-profile-card__name">${PROFILE.name}</p>
        <div class="my-profile-card__pills">
          <span class="my-pill my-pill--soft">Lv.${PROFILE.level}</span>
        </div>
        <div class="my-profile-card__scores">
          <button class="my-pill my-pill--gold is-pressable" type="button" data-go="rankGuide" aria-label="랭크 구간 안내">
            <iconify-icon icon="mingcute:trophy-fill" width="13"></iconify-icon> ${PROFILE.rank} Rank
            <iconify-icon icon="mingcute:right-line" width="13"></iconify-icon>
          </button>
          <div class="my-profile-card__scores-row">
            <span class="my-profile-card__scores-label">누적 Score</span>
            <strong>${PROFILE.score.toLocaleString()}</strong>
          </div>
        </div>
        <div class="my-profile-card__xp">
          <div class="my-profile-card__xp-row"><span>경험치</span><span class="my-profile-card__xp-val">${PROFILE.xp} / ${PROFILE.xpMax} XP</span></div>
          <div class="progress-bar progress-bar--thick"><div class="progress-bar__fill" style="width:${xpPct}%"></div></div>
        </div>
      </div>

      <div class="my-stats">
        ${STATS.map((s) => `
          <button class="my-stat-card is-pressable" type="button" data-go="${s.go}">
            <span class="my-stat-card__icon tint--${s.tint}"><iconify-icon icon="${s.icon}" width="20"></iconify-icon></span>
            <span class="my-stat-card__body">
              <span class="my-stat-card__value">${s.value}<em>${s.unit}</em></span>
              <span class="my-stat-card__label">${s.label}</span>
            </span>
          </button>
        `).join('')}
      </div>

      <section class="my-section">
        <div class="my-section__head">
          <h3 class="my-section__title"><iconify-icon icon="mingcute:card-line" width="18"></iconify-icon>최근 획득한 카드</h3>
          <button class="my-section__more is-pressable" type="button" data-go="myCards">전체보기</button>
        </div>
        <div class="my-card-scroll">
          ${CARDS.slice(0, 4).map((c) => collectCard(c, true)).join('')}
        </div>
      </section>

      <section class="my-section my-section--travel">
        <div class="my-section__head">
          <h3 class="my-section__title"><iconify-icon icon="mingcute:location-fill" width="18"></iconify-icon>나의 여행 기록</h3>
          <button class="my-section__more is-pressable" type="button" data-go="myRecords">더보기</button>
        </div>
        <div class="my-travel-card">
          <div class="cert-timeline cert-timeline--my" data-my-travel-preview>
            ${travelTimelinePreview()}
          </div>
        </div>
      </section>

      <section class="my-section my-section--menu">
        <h3 class="my-section__title my-section__title--plain">내 활동</h3>
        <div class="my-menu__list">
          <button class="my-menu__item is-pressable" type="button" data-go="activityHistory">
            <span class="my-menu__icon tint--blue"><iconify-icon icon="mingcute:time-line" width="20"></iconify-icon></span>
            <span class="my-menu__text"><span class="my-menu__label">활동 히스토리</span><span class="my-menu__sub">방문·뱃지·레벨 기록</span></span>
            <iconify-icon class="chevron" icon="mingcute:right-line" width="18"></iconify-icon>
          </button>
        </div>
      </section>

      <section class="my-section my-section--menu">
        <h3 class="my-section__title my-section__title--plain">설정</h3>
        <div class="my-menu__list">
          <button class="my-menu__item is-pressable" type="button" data-go="settingsNotify">
            <span class="my-menu__icon tint--orange"><iconify-icon icon="mingcute:notification-line" width="20"></iconify-icon></span>
            <span class="my-menu__text"><span class="my-menu__label">알림 설정</span></span>
            <iconify-icon class="chevron" icon="mingcute:right-line" width="18"></iconify-icon>
          </button>
          <button class="my-menu__item is-pressable" type="button" data-go="settingsHelp">
            <span class="my-menu__icon tint--blue"><iconify-icon icon="mingcute:question-line" width="20"></iconify-icon></span>
            <span class="my-menu__text"><span class="my-menu__label">도움말 / 문의</span></span>
            <iconify-icon class="chevron" icon="mingcute:right-line" width="18"></iconify-icon>
          </button>
          <button class="my-menu__item my-menu__item--danger is-pressable" type="button" data-action="logout">
            <span class="my-menu__icon tint--red"><iconify-icon icon="mingcute:exit-line" width="20"></iconify-icon></span>
            <span class="my-menu__text"><span class="my-menu__label">로그아웃</span></span>
          </button>
        </div>
      </section>
    `;
  }

  function renderRegions(root) {
    if (!root) return;
    root.innerHTML = CONQUER.map((r) => {
      const done = r.pct >= 100;
      const active = r.pct > 0 && r.pct < 100;
      const cls = done ? 'conquer-row--done' : active ? 'conquer-row--active' : '';
      return `
        <button class="conquer-row ${cls} is-pressable" type="button" data-go="exploreCity">
          <div class="conquer-row__head">
            <span class="conquer-row__name">${r.name}${done ? ' <iconify-icon icon="mingcute:check-circle-fill" width="15"></iconify-icon>' : ''}</span>
            <span class="conquer-row__status">${r.status}</span>
          </div>
          <div class="progress-bar"><div class="progress-bar__fill" style="width:${r.pct}%"></div></div>
          <span class="conquer-row__count">${r.pct}%</span>
        </button>
      `;
    }).join('');
  }

  // 지역(시/군/구)별 전체 카드 수 — 미획득 카드 placeholder 산정용
  const REGION_TOTALS = {
    '대전 중구': 6,
    '대전 서구': 5,
    '대전 유성구': 6,
    '대전 동구': 4,
  };

  function lockedCard() {
    return `
      <div class="collect-card collect-card--locked">
        <div class="collect-card__thumb"><span class="collect-card__unknown">???</span></div>
        <p class="collect-card__name">미획득</p>
      </div>
    `;
  }

  function renderCards(root, countEl) {
    if (!root) return;
    if (countEl) countEl.textContent = `${CARDS.length} / ${CARDS_TOTAL}장 수집`;

    // 지역별 그루핑
    const groups = new Map();
    CARDS.forEach((card) => {
      if (!groups.has(card.district)) groups.set(card.district, []);
      groups.get(card.district).push(card);
    });

    const sections = Array.from(groups.entries()).map(([region, cards], idx) => {
      const total = REGION_TOTALS[region] || cards.length;
      const lockedCount = Math.max(0, total - cards.length);
      const open = idx === 0;
      const ownedHtml = cards.map((c) => collectCard(c, true)).join('');
      const lockedHtml = Array.from({ length: lockedCount }, lockedCard).join('');
      return `
        <section class="card-accordion${open ? ' is-open' : ''}" data-card-accordion>
          <button class="card-accordion__head is-pressable" type="button" aria-expanded="${open}">
            <span class="card-accordion__title">
              <iconify-icon icon="mingcute:location-line" width="16"></iconify-icon>
              ${region}
            </span>
            <span class="card-accordion__meta">${cards.length}/${total}</span>
            <iconify-icon class="card-accordion__chevron" icon="mingcute:down-line" width="18"></iconify-icon>
          </button>
          <div class="card-accordion__body">
            <div class="collect-grid">${ownedHtml}${lockedHtml}</div>
          </div>
        </section>
      `;
    }).join('');

    root.innerHTML = sections;
  }

  function renderBadges(root, countEl) {
    if (!root) return;
    const earned = BADGES.filter((b) => b.earned).length;
    if (countEl) countEl.textContent = `${earned} / ${BADGES.length}개 획득`;
    root.innerHTML = BADGES.map((b) => badgeItem(b, false)).join('');
  }

  function renderNotify(root) {
    if (!root) return;
    root.innerHTML = NOTIFY.map((n, i) => `
      <div class="toggle-row">
        <div class="toggle-row__text">
          <span class="toggle-row__label">${n.label}</span>
          <span class="toggle-row__desc">${n.desc}</span>
        </div>
        <button class="switch${n.on ? ' is-on' : ''}" type="button" role="switch" aria-checked="${n.on}" data-switch="${i}" aria-label="${n.label}">
          <span class="switch__dot"></span>
        </button>
      </div>
    `).join('');
  }

  function renderHelp(root) {
    if (!root) return;
    root.innerHTML = FAQ.map((f, i) => `
      <div class="faq-item" data-faq="${i}">
        <button class="faq-item__q is-pressable" type="button" aria-expanded="false">
          <span>${f.q}</span>
          <iconify-icon class="faq-item__chevron" icon="mingcute:down-line" width="18"></iconify-icon>
        </button>
        <div class="faq-item__a"><p>${f.a}</p></div>
      </div>
    `).join('');
  }

  function renderAppSettings(root) {
    if (!root) return;
    root.innerHTML = APP_SETTINGS.map((s) => `
      <button class="setting-row is-pressable" type="button"${s.go ? ` data-go="${s.go}"` : ''}>
        <span class="setting-row__label">${s.label}</span>
        ${s.kind === 'value'
          ? `<span class="setting-row__value">${s.value}</span>`
          : '<iconify-icon class="chevron" icon="mingcute:right-line" width="18"></iconify-icon>'}
      </button>
    `).join('');
  }

  // 랭크 구간 — 정책 §4 누적 Score 기준
  const RANK_TIERS = [
    { name: 'Bronze', min: 0, icon: 'mingcute:trophy-line', cls: 'rank-tier--bronze' },
    { name: 'Silver', min: 500, icon: 'mingcute:trophy-line', cls: 'rank-tier--silver' },
    { name: 'Gold', min: 1500, icon: 'mingcute:trophy-fill', cls: 'rank-tier--gold' },
    { name: 'Platinum', min: 3000, icon: 'mingcute:diamond-line', cls: 'rank-tier--platinum' },
    { name: 'Diamond', min: 5000, icon: 'mingcute:diamond-fill', cls: 'rank-tier--diamond' },
    { name: 'Master', min: 8000, icon: 'mingcute:crown-line', cls: 'rank-tier--master' },
    { name: 'Grandmaster', min: 12000, icon: 'mingcute:crown-fill', cls: 'rank-tier--grandmaster' },
  ];

  function currentTierIndex(score) {
    let idx = 0;
    RANK_TIERS.forEach((t, i) => { if (score >= t.min) idx = i; });
    return idx;
  }

  function renderRankGuide(root) {
    if (!root) return;
    const score = PROFILE.score;
    const curIdx = currentTierIndex(score);
    const next = RANK_TIERS[curIdx + 1];

    const scoreEl = root.querySelector('[data-rank-guide-score]');
    if (scoreEl) scoreEl.textContent = score.toLocaleString();

    const hintEl = root.querySelector('[data-rank-guide-hint]');
    if (hintEl) {
      hintEl.textContent = next
        ? `${next.name}까지 ${(next.min - score).toLocaleString()} Score 남았어요`
        : '최고 등급에 도달했어요';
    }

    const listEl = root.querySelector('[data-rank-guide-list]');
    if (!listEl) return;
    listEl.innerHTML = RANK_TIERS.map((t, i) => {
      const isCurrent = i === curIdx;
      const range = RANK_TIERS[i + 1]
        ? `${t.min.toLocaleString()} ~ ${(RANK_TIERS[i + 1].min - 1).toLocaleString()}`
        : `${t.min.toLocaleString()}+`;
      return `
        <div class="rank-tier ${t.cls}${isCurrent ? ' rank-tier--current' : ''}">
          <span class="rank-tier__icon"><iconify-icon icon="${t.icon}" width="22"></iconify-icon></span>
          <span class="rank-tier__body">
            <span class="rank-tier__name">${t.name}${isCurrent ? ' <span class="rank-tier__chip">현재</span>' : ''}</span>
            <span class="rank-tier__range">누적 Score ${range}</span>
          </span>
        </div>
      `;
    }).join('');
  }

  function bindInteractions(appRoot) {
    if (!appRoot) return;
    appRoot.addEventListener('click', (e) => {
      const sw = e.target.closest('[data-switch]');
      if (sw && appRoot.contains(sw)) {
        const on = sw.classList.toggle('is-on');
        sw.setAttribute('aria-checked', String(on));
        return;
      }
      const faqBtn = e.target.closest('.faq-item__q');
      if (faqBtn && appRoot.contains(faqBtn)) {
        const item = faqBtn.closest('.faq-item');
        const open = item.classList.toggle('is-open');
        faqBtn.setAttribute('aria-expanded', String(open));
        return;
      }
      const accHead = e.target.closest('.card-accordion__head');
      if (accHead && appRoot.contains(accHead)) {
        const section = accHead.closest('[data-card-accordion]');
        const open = section.classList.toggle('is-open');
        accHead.setAttribute('aria-expanded', String(open));
        return;
      }
      const actionEl = e.target.closest('[data-action="logout"], [data-action="contact"]');
      if (actionEl && appRoot.contains(actionEl)) {
        if (actionEl.dataset.action === 'contact' && typeof window.showToast === 'function') {
          window.showToast('문의 접수 (준비 중)');
        }
      }
    });
  }

  window.TRIPLOG_MYPAGE = { PROFILE, CARDS, BADGES, CONQUER, GRADES };
  window.renderRankGuide = renderRankGuide;

  function init() {
    const app = document.getElementById('interactiveApp');
    if (!app) return;
    renderMain(app.querySelector('[data-mypage-root]'));
    renderRegions(app.querySelector('[data-my-regions]'));
    renderCards(app.querySelector('[data-my-cards]'), app.querySelector('[data-my-cards-count]'));
    renderBadges(app.querySelector('[data-my-badges]'), app.querySelector('[data-my-badges-count]'));
    renderNotify(app.querySelector('[data-settings-notify]'));
    renderHelp(app.querySelector('[data-settings-help]'));
    renderAppSettings(app.querySelector('[data-settings-app]'));
    bindInteractions(app);
  }

  init();
})();

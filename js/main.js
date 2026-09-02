// ============================================
// 共通スクリプト: 商品カード描画・カテゴリ絞り込み
// ============================================

function productCard(p) {
  const photo = p.photo
    ? `<img src="images/${p.photo}" alt="${p.name}">`
    : `<span aria-hidden="true">${p.emoji}</span>`;

  const badge = p.soldOut
    ? `<span class="badge">SOLD OUT</span>`
    : p.isNew
      ? `<span class="badge" style="background:var(--terra)">NEW</span>`
      : "";

  // オンライン販売期間外(ONLINE_SALE = false)は購入ボタンを出さない
  const buy = typeof ONLINE_SALE !== "undefined" && !ONLINE_SALE
    ? ""
    : p.soldOut
      ? `<span class="buy-btn soldout">売り切れ</span>`
      : p.buyUrl
        ? `<a class="buy-btn" href="${p.buyUrl}" target="_blank" rel="noopener">オンラインで購入</a>`
        : `<a class="buy-btn" href="${SHOP_BASE_URL}" target="_blank" rel="noopener">オンラインストアへ</a>`;

  return `
    <article class="product-card" data-category="${p.category}">
      <div class="product-photo" style="background:${p.tint}">
        ${badge}
        ${photo}
      </div>
      <div class="product-body">
        <span class="artist">${p.artist}</span>
        <h3>${p.name}</h3>
        <span class="price">¥${p.price.toLocaleString()}<small>(税込)</small></span>
        <div class="buy-row">${buy}</div>
      </div>
    </article>`;
}

// 商品一覧を描画(limit 指定でトップページ用に件数制限)
function renderProducts(targetId, { limit = 0, category = "すべて" } = {}) {
  const el = document.getElementById(targetId);
  if (!el) return;

  let items = PRODUCTS;
  if (category !== "すべて") items = items.filter((p) => p.category === category);
  if (limit > 0) items = items.slice(0, limit);

  if (items.length === 0) {
    el.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-soft);">ただいま準備中です。楽しみにお待ちください。</p>`;
    return;
  }

  el.innerHTML = items.map(productCard).join("");
}

// ---------- 取扱作家 ----------

const SEASON_ORDER = ["春", "夏", "秋", "冬"];

// 作家カード1枚分のHTML
function artistCard(a) {
  const photo = a.photo
    ? `<img src="images/artists/${a.photo}" alt="${a.name} の作品">`
    : `<span class="artist-placeholder" style="background:${a.tint || "#f2efe9"}">${a.name}</span>`;

  // detailUrl があるカードはカード全体が <a> になるため、中に別の <a>(Instagramリンク)を
  // 入れるとHTMLとして不正(リンクの入れ子)になり表示が崩れる。その場合はInstagramリンクを
  // 省略する(詳細ページ側に別途Instagramリンクがあるため)。
  const insta = a.instagram && !a.detailUrl
    ? `<a class="artist-insta" href="${a.instagram}" target="_blank" rel="noopener">Instagram →</a>`
    : "";

  // お菓子の作家さんで会期指定がある場合は「※夏・冬の会期のみ」等の注記を付ける
  const seasonNote = a.category === "お菓子" && a.seasons
    ? ` <small>※${a.seasons.join("・")}の会期のみ</small>`
    : "";

  // detailUrl があるカードは全体がリンクになり、詳細ページ(管理者サイトの
  // 「作家ポートフォリオ」から書き出したHTML)へ遷移する。無ければ従来通り非リンク。
  const tag = a.detailUrl ? "a" : "article";
  const linkAttrs = a.detailUrl ? ` href="${a.detailUrl}"` : "";
  const detailHint = a.detailUrl ? `<span class="artist-detail-link">詳しく見る →</span>` : "";

  return `
    <${tag} class="artist-card"${linkAttrs}>
      <div class="artist-photo">${photo}</div>
      <div class="artist-body">
        <h3>${a.name}${a.kana ? ` <small>${a.kana}</small>` : ""}</h3>
        <span class="artist-genre">${a.genre}${seasonNote}</span>
        <p>${a.desc}</p>
        ${insta}
        ${detailHint}
      </div>
    </${tag}>`;
}

// お菓子の作家さん(通年)の描画。seasons 指定がある作家は現在の会期のときだけ表示
function renderArtists(targetId, category) {
  const el = document.getElementById(targetId);
  if (!el || typeof ARTISTS === "undefined") return;

  let items = ARTISTS;
  if (category === "お菓子") {
    items = items.filter((a) => a.category === "お菓子")
      .filter((a) => !a.seasons || a.seasons.includes(CURRENT_SEASON));
  }

  if (items.length === 0) {
    el.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-soft);">ただいま準備中です。楽しみにお待ちください。</p>`;
    return;
  }

  el.innerHTML = items.map(artistCard).join("");
}

// 取扱作家ページ: 会期(春夏秋冬)ごとのセクションで描画。
// 現在の会期が一番上、以降は新しい順(例: 夏 → 春 → 冬 → 秋)。
// seasons 未指定の作家さんは現在の会期に表示されます。
function renderArtistsBySeason(targetId) {
  const el = document.getElementById(targetId);
  if (!el || typeof ARTISTS === "undefined") return;

  const start = SEASON_ORDER.indexOf(CURRENT_SEASON);
  const hidden = typeof HIDDEN_SEASONS !== "undefined" ? HIDDEN_SEASONS : [];
  const order = [0, 1, 2, 3]
    .map((i) => SEASON_ORDER[(start - i + 4) % 4])
    .filter((season) => !hidden.includes(season));

  el.innerHTML = order.map((season) => {
    const items = ARTISTS.filter((a) => a.category !== "お菓子")
      .filter((a) => (a.seasons || [CURRENT_SEASON]).includes(season));
    if (items.length === 0) return "";
    return `
      <h3 class="season-heading">～${season}のルリエ～</h3>
      <div class="artist-grid">${items.map(artistCard).join("")}</div>`;
  }).join("");
}

// カテゴリ絞り込みボタン(shopページ用)。商品が1件もないときは絞り込みバー自体を出さない
function setupFilters(barId, gridId) {
  const bar = document.getElementById(barId);
  if (!bar || PRODUCTS.length === 0) return;

  const categories = ["すべて", ...new Set(PRODUCTS.map((p) => p.category))];
  bar.innerHTML = categories
    .map(
      (c, i) =>
        `<button class="filter-btn${i === 0 ? " active" : ""}" data-category="${c}">${c}</button>`
    )
    .join("");

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    bar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(gridId, { category: btn.dataset.category });
  });
}

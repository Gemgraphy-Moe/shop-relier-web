// ============================================
// 取扱作家データ
// 実データは js/artists-data.json に入っています(管理者サイトの
// 「作家ポートフォリオ」から「公開する」を押すと自動で更新されます)。
// 手動で直したい場合は artists-data.json を直接編集してください。
//
// photo:     作家さんの作品写真。images/artists/ フォルダに入れて
//            ファイル名を指定(例: "melt.jpg")。未指定なら名前入りのプレースホルダー表示。
// instagram: 作家さんのInstagram URL。指定するとカードにリンクが付きます。
// category:  "お菓子" と書くと「お菓子の作家さん」ページ(sweets.html)に表示されます。
//            それ以外(未指定含む)は「取扱作家」ページ(artists.html)に表示されます。
// seasons:   参加している会期。例: ["夏"] や ["夏", "冬"]。
//            取扱作家ページでは会期ごとの「～夏のルリエ～」等のセクションに表示されます。
//            お菓子の作家さんは通年なので指定不要(指定すると、その会期のみ表示されます)。
// detailUrl: 詳細ページのファイルパス(例: "artists/melt.html")。
//            管理者サイトの「作家ポートフォリオ」から書き出したHTMLを artists/ フォルダに
//            保存し、ここに指定するとカード全体がリンクになります。未指定ならリンクなし。
//            詳しくは artists/README.md を参照。
// ============================================

// ★ 現在の会期。会期が変わったらここを書き換えてください(春 / 夏 / 秋 / 冬)
const CURRENT_SEASON = "夏";

let ARTISTS = [];

// artists-data.json を読み込んで ARTISTS を埋める。呼び出し側は
// loadArtists().then(() => { ... render ... }) のように非同期で使うこと。
async function loadArtists() {
  const res = await fetch("js/artists-data.json?v=1");
  ARTISTS = await res.json();
}

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
//    (管理者サイトの並び替え画面はこの1行を読み取っています)
let CURRENT_SEASON = "秋";

// ★ 取扱作家ページで表示しない会期。まだ告知していない会期などをここに入れてください。
//    例: 冬の会期がまだ未公開なら ["冬"]。無ければ空配列 [] のままにしてください。
let HIDDEN_SEASONS = ["冬"];

// ★ 会期の予約切り替え。from の日時(日本時間)を過ぎると、自動で上の2つを置き換えます。
//    切り替え後に上の2行を書き換えたら、ここは空配列 [] に戻してください。
const SEASON_SWITCHES = [
  { from: "2026-12-01T00:00:00+09:00", season: "冬", hidden: [] },
];
for (const sw of SEASON_SWITCHES) {
  if (new Date() >= new Date(sw.from)) {
    CURRENT_SEASON = sw.season;
    HIDDEN_SEASONS = sw.hidden;
  }
}

let ARTISTS = [];

// artists-data.json を読み込んで ARTISTS を埋める。呼び出し側は
// loadArtists().then(() => { ... render ... }) のように非同期で使うこと。
// このファイルは管理者サイトの「公開する」ボタンで随時書き換わるため、
// 固定のバージョン番号でキャッシュ対策するのではなく、
// 毎回サーバーへ問い合わせて最新の内容を取得する(cache: "no-store")。
async function loadArtists() {
  const res = await fetch("js/artists-data.json", { cache: "no-store" });
  ARTISTS = await res.json();
}

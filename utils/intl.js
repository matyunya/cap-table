import { derived } from "tinyx";
import { language } from "/store.js";

const translations = {
  "30秒で無料登録、すぐ使えます！": {
    en: "Capital Dash service is free, it only requires this simple form.",
  },
  "資本政策表を失敗せず、簡単に作れる。": {
    en: "Dead simple Capital Dash",
  },
  "プロフィール編集画面": {
    en: "Edit profile",
  },
  "創業メンバー%": {
    en: "Founder share",
  },
  プロフィール: {
    en: "Profile",
  },
  ログアウト: {
    en: "Sign out",
  },
  パスワード: {
    en: "Password",
  },
  "会社名": {
    en: "Company name",
  },
  "肩書き": {
    en: "Title",
  },
  "姓": {
    en: "Last name",
  },
  "名": {
    en: "First name",
  },
  "郵便番号": {
    en: "ZIP code",
  },
  "住所": {
    en: "Address",
  },
  "TEL": {
    en: "Phone",
  },
  "キャンセル": {
    en: "Cancel",
  },
  "URL": {
    en: "Homepage"
  },
  "保存する": {
    en: "Save",
  },
  "登録する": {
    en: "Sign up",
  },
  "すでに登録済みの方": {
    en: "Already signed up?"
  },
  "ログイン": {
    en: "Log in"
  },
  "合計": {
    en: "Total",
  },
  "株価": {
    en: "Share price",
  },
  "調達金額": {
    en: "New equity (¥)",
  },
  "時価総額（Pre）": {
    en: "Pre money (¥)",
  },
  "時価総額（Post）": {
    en: "Post money (¥)",
  },
  "時価総額（Pre/潜在込）": {
    en: "Pre money diluted (¥)",
  },
  "時価総額（Post/潜在込）": {
    en: "Post money diluted (¥)",
  },
  "株式数": {
    en: "#shares",
  },
  "潜在株式数": {
    en: "#voting shares",
  },
  "share±": {
    en: "share±",
  },
  "%": {
    en: "%shares",
  },
  "株式増減": {
    en: "share±",
  },
  "新規登録": {
    en: "Sign up",
  },
  "潜在株式増減": {
    en: "voting share±",
  },
  "発行済株式数": {
    en: "Total #shares",
  },
  "新ラウンド作成（普通株式）": {
    en: "Add new round (Ordinary share)",
  },
  "J-kissラウンド作成": {
    en: "Add J-kiss round",
  },
  "株式分割ラウンド作成": {
    en: "Add split round",
  },
  "分割数": {
    en: "Split by",
  },
  "ラウンド削除": {
    en: "Remove this round",
  },
  "グループ追加": {
    en: "Add group",
  },
  "投資家追加": {
    en: "Add investor",
  },
  "削除": {
    en: "Remove",
  },
  "投資額": {
    en: "Sum"
  },
  "ﾊﾞﾘｭｴｰｼｮﾝｷｬｯﾌﾟ": {
    en: "Valuation cap"
  },
  "割引率": {
    en: "Discount"
  },
  "共有する": {
    en: "Make public",
  },
  "このテーブルをコピー": {
    en: "Make a copy"
  },
  "認証メールを発信しました。ご確認をお願いします。": {
    en: "Please check your email."
  },
  "エラーが発生しました。恐れ入りますが、リフレッシュしてもう一度発信してみてください。": {
    en: "Unexpected error. Please refresh the page."
  },
  "新しいテーブル": {
    en: "New table"
  },
  "リセット": {
    en: "Reset table",
  },
  "共有をキャンセル": {
    en: "Make private",
  },
  "このページは見つかりませんでした。": {
    en: "This page does not exist"
  },
  "パスワードを忘れた方はこちらチェックしてください。": {
    en: "Check to reset password"
  },
  "従業員数": {
    en: "Number of employees",
  },
  "資本政策": {
    en: "Cap table",
  },
  "正社員": {
    en: "Full-time"
  },
  "この項目が必須です。": {
    en: "This field is required"
  },
  "決算を終えたのはいつですか": {
    en: "Last settlement date"
  },
  "決算月": {
    en: "Settlement month"
  },
  "直近決算": {
    en: "Last settlement",
  },
  "終わっていない": {
    en: "Not finished",
  },
  "終わっている": {
    en: "Finished",
  },
  "業務委託": {
    en: "Subcontractors"
  },
  "会社情報": {
    en: "Company information"
  },
  "ユーザー登録": {
    en: "User registration"
  },
  "資金調達計画": {
    en: "Some capital plan"
  },
  "スキップする": {
    en: "Skip for now"
  },
  "人": {
    en: ""
  },
  [`はじめに・・・<br />
        本ツールでは、簡単３ステップで、資金調達に必要な準備（資本政策表作成、株価算定）ができます。<br />
        時間とチャンスを無駄にしないように、投資家に会う前にしっかりと理論武装しましょう。`]: {
    en: "lead text"
  }
};

const translate = (key, lang) => {
  if (lang === "ja") return key;

  if (!translations[key] || translations[key][lang] === undefined) {
    return key;
  }

  return translations[key][lang]
};

export default derived(language, (s) => key => translate(key, s));

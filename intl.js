import { derived } from "tinyx";
import { language } from "./store.js";

const translations = {
  "30秒で無料登録、すぐ使えます！": {
    en: "Cap table service is free, it only requires this simple form.",
  },
  "資本政策表を失敗せず、簡単に作れる。": {
    en: "Dead simple cap table",
  },
  "プロフィール編集画面": {
    en: "Edit profile",
  },
  プロフィール: {
    en: "Profile",
  },
  ログアウト: {
    en: "Sign out",
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
    en: "Start using the app",
  },
  "すでに登録済みの方": {
    en: "Already signed up? Enter your email to log in."
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
  "時価総額（Pre/ 潜在込）": {
    en: "Pre money diluted (¥)",
  },
  "時価総額（Pre/潜在込）": {
    en: "Post money diluted (¥)",
  },
  "株式数": {
    en: "#shares",
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
  "発行済株式数": {
    en: "Total #shares",
  },
  "潜在株式": {
    en: "Potentially voting",
  },
  "新ラウンド作成（普通株式）": {
    en: "Add new round (Ordinary share)",
  },
  "J-kiss ラウンド作成": {
    en: "Add J-kiss round",
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
  "バリュエーションキャップ": {
    en: "Valuation cap"
  },
  "割引": {
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
};

const translate = (key, lang) => {
  if (lang === "ja") return key;

  if (!translations[key] || !translations[key][lang]) {
    return key;
  }

  return translations[key][lang]
};

export default derived(language, (s) => key => translate(key, s));

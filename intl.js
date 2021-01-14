import { derived } from "tinyx";
import { store } from "./store.js";

const translations = {
  "<b>無料</b>で登録してからすぐ使えます。": {
    en: "Just fill the registration form to use",
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
};

const translate = (key, lang) => {
  if (lang === "ja") return key;

  if (!translations[key] || !translations[key][lang]) {
    console.log("Missing translation", { lang, key });
    return key;
  }

  return translations[key][lang]
};

export default derived(store, (s) => key => translate(key, s.language));

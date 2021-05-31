import { derived } from "tinyx";
import { language } from "/store.js";

const translations = {
  "30秒で無料登録、すぐ使えます！": {
    en: "Capital Dash service is free, it only requires this simple form.",
  },
  "資本政策表を失敗せず、簡単に作れる。": {
    en: "Dead simple Capital Dash",
  },
  プロフィール編集画面: {
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
  会社名: {
    en: "Company name",
  },
  肩書き: {
    en: "Title",
  },
  姓: {
    en: "Last name",
  },
  名: {
    en: "First name",
  },
  郵便番号: {
    en: "ZIP code",
  },
  住所: {
    en: "Address",
  },
  TEL: {
    en: "Phone",
  },
  キャンセル: {
    en: "Cancel",
  },
  URL: {
    en: "Homepage",
  },
  保存する: {
    en: "Save",
  },
  登録する: {
    en: "Sign up",
  },
  すでに登録済みの方: {
    en: "Already signed up?",
  },
  ログイン: {
    en: "Log in",
  },
  合計: {
    en: "Total",
  },
  株価: {
    en: "Share price",
  },
  調達金額: {
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
  株式数: {
    en: "#shares",
  },
  潜在株式数: {
    en: "#voting shares",
  },
  "share±": {
    en: "share±",
  },
  "%": {
    en: "%shares",
  },
  株式増減: {
    en: "share±",
  },
  未設定: {
    en: "Unspecified",
  },
  新規登録: {
    en: "Sign up",
  },
  潜在株式増減: {
    en: "voting share±",
  },
  発行済株式数: {
    en: "Total #shares",
  },
  "新ラウンド作成（普通株式）": {
    en: "Add new round (Ordinary share)",
  },
  "J-kissラウンド作成": {
    en: "Add J-kiss round",
  },
  株式分割ラウンド作成: {
    en: "Add split round",
  },
  分割数: {
    en: "Split by",
  },
  チャートを表示: {
    en: "View chart",
  },
  Excelでダウンロード: {
    en: "Export to Excel",
  },
  ラウンド削除: {
    en: "Remove this round",
  },
  グループ追加: {
    en: "Add group",
  },
  設定する: {
    en: "Update",
  },
  [`パスワードをお忘れの方へ、パスワードの再発行を行います。メールアドレスをご入力の上、
    「パスワードを再発行する」ボタンを押して下さい。`]: {
    en: "Please enter your email to reset password.",
  },
  パスワードを再発行する: {
    en: "Send reset password link",
  },
  ログインへ戻る: {
    en: "Return to login",
  },
  投資家追加: {
    en: "Add investor",
  },
  削除: {
    en: "Remove",
  },
  投資額: {
    en: "Sum",
  },
  ﾊﾞﾘｭｴｰｼｮﾝｷｬｯﾌﾟ: {
    en: "Valuation cap",
  },
  割引率: {
    en: "Discount",
  },
  共有する: {
    en: "Make public",
  },
  このテーブルを複製: {
    en: "Make a copy",
  },
  "認証メールを発信しました。ご確認をお願いします。": {
    en: "Please check your email.",
  },
  "エラーが発生しました。恐れ入りますが、リフレッシュしてもう一度発信してみてください。":
  {
    en: "Unexpected error. Please refresh the page.",
  },
  新しいテーブル: {
    en: "Create new table",
  },
  リセット: {
    en: "Reset table",
  },
  "1月": {
    en: "January",
  },
  "2月": {
    en: "February",
  },
  "3月": {
    en: "March",
  },
  "4月": {
    en: "April",
  },
  "5月": {
    en: "May",
  },
  "6月": {
    en: "June",
  },
  "7月": {
    en: "July",
  },
  "8月": {
    en: "August",
  },
  "9月": {
    en: "September",
  },
  "10月": {
    en: "October",
  },
  "11月": {
    en: "November",
  },
  "12月": {
    en: "December",
  },
  共有をキャンセル: {
    en: "Make private",
  },
  "このページは見つかりませんでした。": {
    en: "This page does not exist",
  },
  "パスワードを忘れた方はこちらチェックしてください。": {
    en: "Check to reset password",
  },
  従業員数: {
    en: "Number of employees",
  },
  資本政策: {
    en: "Cap table",
  },
  "プロフィール情報確認・変更": {
    en: "Edit user profile",
  },
  メールアドレス: {
    en: "Email address",
  },
  お名前: {
    en: "Full name",
  },
  利用規約: {
    en: "Site rules",
  },
  Googleアカウントでログイン: {
    en: "Log in with Google account",
  },
  Googleアカウントで登録: {
    en: "Sign up with Google account",
  },
  プライバシーポリシー: {
    en: "Privacy policy",
  },
  に同意の上: {
    en: "",
  },
  半角英数字8文字以上: {
    en: "At least 8 characters long",
  },
  "パスワード（確認）": {
    en: "Confirm password",
  },
  正社員: {
    en: "Full-time",
  },
  必須項目です: {
    en: "This field is required",
  },
  上限を超過しました: {
    en: "Value is too large",
  },
  次へ: {
    en: "Next",
  },
  決算を終えたのはいつですか: {
    en: "Last settlement date",
  },
  決算月: {
    en: "Settlement month",
  },
  直近決算: {
    en: "Last settlement",
  },
  終わっていない: {
    en: "Not finished",
  },
  終わっている: {
    en: "Finished",
  },
  "様 はじめまして": {
    en: ", hello",
  },
  最終閲覧: {
    en: "Last viewed",
  },
  業務委託: {
    en: "Subcontractors",
  },
  会社情報: {
    en: "Company information",
  },
  ユーザー登録: {
    en: "User registration",
  },
  ユーザー情報: {
    en: "User information",
  },
  株価算定: {
    en: "Stock price calculator",
  },
  事業計画: {
    en: "Business plan",
  },
  プロフィール: {
    en: "Profile",
  },
  新しいパスワード: {
    en: "New password",
  },
  "新しいパスワード（確認）": {
    en: "Confirm new password",
  },
  お問い合わせ内容: {
    en: "Subject",
  },
  選択してください: {
    en: "Select an option",
  },
  お問い合わせ内容の詳細: {
    en: "Body",
  },
  送信する: {
    en: "Submit",
  },
  "弊社サービスにご興味をお持ちいただきまして、ありがとうございます。以下よりお問い合わせください。":
  {
    en: "Thank you for using Capital Dash. We'd love to hear from you!",
  },
  資本政策シミュレーター: {
    en: "Cap table simulator",
  },
  ご利用ガイド: {
    en: "Tutorial",
  },
  お問い合わせ: {
    en: "Feedback form",
  },
  新規テーブルを作成: {
    en: "New table",
  },
  パスワード再設定: {
    en: "Change password",
  },
  資金調達計画: {
    en: "Financing plan",
  },
  スキップする: {
    en: "Skip for now",
  },
  "登録して始める​": {
    en: "Go to app",
  },
  パスワードをお忘れの方: {
    en: "Password recovery",
  },
  株価算定までの3ステップ: {
    en: "Three steps to something",
  },
  人: {
    en: "",
  },
  [`はじめに・・・<br />
        本ツールでは、簡単３ステップで、資金調達に必要な準備（資本政策表作成、株価算定）ができます。<br />
        時間とチャンスを無駄にしないように、投資家に会う前にしっかりと理論武装しましょう。`]:
  {
    en: "lead text",
  },
  お問い合わせ内容を入力する: {
    en: "Your message",
  },
  プロダクトの不具合: {
    en: "Report a problem",
  },
  資金調達のご相談: {
    en: "Advice on financing plan",
  },
  その他: {
    en: "Other",
  },
  テーブル名: {
    en: "Title",
  },
  新株予約権個数: {
    en: "#stock options",
  },
  [`ご登録ありがとうございます。<br />
  本人認証のために、メールを送信しました。<br />
  メールにて本人認証を行ってください。​`]: {
    en: "Thank you for signing up. Please check your email.",
  },
  アカウントをお持ちの方は: {
    en: "Already have an account?",
  },
  売上高: {
    en: "Sales",
  },
  売上高成長率: {
    en: "Sales growth rate",
  },
  売上原価: {
    en: "Cost of sales",
  },
  売上総利益: {
    en: "Gross profit",
  },
  販売費及び: {
    en: "Selling expenses and",
  },
  一般管理費: {
    en: "General and administrative expenses",
  },
  営業利益: {
    en: "Operating income",
  },
  営業利益率: {
    en: "Operating profit margin",
  },
  営業外収入: {
    en: "Non-operating income",
  },
  営業外費用: {
    en: "Non-operating expenses",
  },
  経常利益: {
    en: "Ordinary income",
  },
  特別利益: {
    en: "Extraordinary profit",
  },
  特別損失: {
    en: "Extraordinary loss",
  },
  税引前当期損益: {
    en: "Profit and loss before tax",
  },
  "法人税（実効税率）": {
    en: "Corporate tax (effective tax rate)",
  },
  当期利益: {
    en: "Net income",
  },
  現預金残高: {
    en: "Cash and deposit balance",
  },
  設備投資額: {
    en: "Capital investment amount",
  },
  運転資金: {
    en: "Working capital",
  },
  減価償却額: {
    en: "Depreciation amount",
  },
  従業員数: {
    en: "Number of employees",
  },
  資金調達額: {
    en: "Funding amount",
  },
  株式資金調達: {
    en: "Stock financing"
  },
  政府系金融機関借入: {
    en: "Borrowing government"
  },
  民間金融機関借入: {
    en: "Borrowing private"
  },
  自己資金: {
    en: "Own resources"
  },
  その他: {
    en: "Other"
  },
  主力事業: {
    en: "Main project",
  },
  新規事業A: {
    en: "Project A",
  }
};

const translate = (key, lang) => {
  if (lang === "ja") return key;

  if (!translations[key] || translations[key][lang] === undefined) {
    return key;
  }

  return translations[key][lang];
};

export default derived(language, (s) => (key) => translate(key, s));

const defaultNames = {
  docTitle: {
    en: "New table",
    ja: "新しいテーブル",
  },
  founded: {
    en: "Founded",
    ja: "創立",
  },
  founders: {
    en: "Founders",
    ja: "創業メンバー",
  },
  partners: {
    en: "Partners",
    ja: "共同創業者名",
  },
  founder: {
    en: "Founder name",
    ja: "創業者名",
  },
  partner: {
    en: "Partner name",
    ja: "共同創業者名",
  },
  employee: {
    en: "Employee name",
    ja: "従業員名",
  },
  employees: {
    en: "Employee name",
    ja: "従業員",
  },
  planTitle: {
    en: "New plan",
    ja: "無題の計画"
  },
  project: {
    ja: "新規事業",
    en: "New project",
  }
};

export const defaultName = (n) => {
  try {
    return defaultNames[n][language.get()];
  } catch (e) {
    console.error(n, e);

    return "";
  }
};

export function getDefaultTitle(docs, key) {
  const defaultZeroName = defaultName(key);
  const defaultNameDocsCount = [...docs.values()]
    .map((d) => d.title)
    .filter((t) => t.startsWith(defaultZeroName)).length;

  return (
    defaultZeroName + (defaultNameDocsCount ? defaultNameDocsCount + 1 : "")
  );
}

// import { derived } from "tinyx";
// import { language } from "./store.js";

// const translations = {
//   "<b>無料</b>で登録してからすぐ使えます。": {
//     EN: "Register <b>for free</b> to use",
//   },
// }

// const translate = (key, lang) => {
//   if (lang === "JA") return key;

//   try {
//     return translations[key][lang];
//   } catch (e) {
//     console.log("Missing translation", { lang, key });
//     return key;
//   }
// };

// export default key => {
//   const store = writable(translate(key, language.get()));

//   language.subscribe(v => store.set(translate(key, language.get())));

//   return store;
// }

// const store = writable(translate(key, language.get()));

// language.subscribe(v => store.set(translate(key, language.get())));

// export default function _(key) {
//   return derived(language, l => translate(key, l));
// }

export default i => i;

import ellxify from "~ellx-hub/lib/utils/svelte.js";
import Sheet from "./Sheet.svelte";
import App from "./App.svelte";
import HomePage from "./HomePage.svelte";

export { store } from "./store.js";
export { roundTypes } from "./actions.js";
export { calcShare, uid } from "./utils.js";

export const makeSheetWith = (s, docId) => ({ store: s, docId });

export const sheet = ellxify(Sheet);
export const app = ellxify(App);

export const homepage = ellxify(HomePage);
/*
TODOs:

- router
- drag and drop
- global error handler for production
*/

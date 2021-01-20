import ellxify from "~ellx-hub/lib/utils/svelte.js";
import Sheet from "/components/Sheet.svelte";
import App from "./App.svelte";
import HomePage from "./HomePage.svelte";

export { store } from "/store.js";
export { roundTypes } from "/utils/actions.js";
export { calcShare, uid } from "/utils/index.js";
export { default as router } from "/utils/router.js";

export const makeSheetWith = (s, docId) => ({ store: s, docId });

export const app = ellxify(App);

/*
TODO:

translations:
split by
error document not found

- drag and drop
- global error handler for production
- headlong mounted event
*/

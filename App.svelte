<script>
  import { tx } from "tinyx";
  import { writable } from "svelte/store";
  import { scale } from "svelte/transition";
  import { select } from "tinyx";
  import headlong from "~matyunya/headlong";
  import { onMount, onDestroy, tick } from "svelte";
  import HomePage from "./HomePage.svelte";
  import Sheet from "./Sheet.svelte";
  import Logo from "./Logo.svelte";
  import ProfileForm from "./ProfileForm.svelte";
  import Scrim from "./Scrim.svelte";
  import Nav from "./Nav.svelte";
  import { sync, deserialize } from "./sync.js";
  import { defaultProfile, UPDATE_PROFILE, SET_LANGUAGE, docId, user, defaultDocument } from "./store.js";
  import { togglePublic } from "./actions.js";
  import route from "./router.js";
  import { calcFounderShare } from "./utils.js";
  import { getAppData, getDoc, addDoc } from "./firebase.js";
  import {
    colsCount,
    rowsCount,
    toBlocks,
  } from "./selectors.js";
  import _ from "./intl.js";

  let blocks = new Map();
  let nRows = 10;
  let nCols = 5;
  let founderShare = 100;
  let loading = true;
  export let store;

  let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  $: if (dark) {
    document.querySelector('body').classList.add('mode-dark');
  } else {
    document.querySelector('body').classList.remove('mode-dark');
  }

  $: {
    blocks = toBlocks(activeSheet, $docId);
    nRows = $activeSheet ? rowsCount($activeSheet.investors) : 0;
    nCols = $activeSheet ? colsCount($activeSheet.rounds) : 0;
    founderShare = calcFounderShare($activeSheet);
  }

  let unsubs = new Map();
  let showProfile = false;
  let activeSheet = select(store, () => ["documents", $docId || "DOC_0"]);
  let errors = { ...defaultProfile };

  let userProfile = select(store, () => ["profile"]);
  let ids = new Set();

  let appData, profile;

  $: if ($route) selectDoc(...$route.split('/'));

  async function getDocAnon({ userId, appId, id }) {
    try {
      const doc = await getDoc(id, { appId });

      console.log('Anonymous user fetching', { userId, appId, id, $user, userId });

      activeSheet = select(store, () => ["anonymous"]);

      await doc.get().then(d => {
        console.log("anon doc data", deserialize(d.data()));
        activeSheet.commit(() => ({ set }) => set({
          ...deserialize(d.data()),
          readOnly: true,
        }));
      });
    } catch (e) {
      console.log('Error fetching doc', e);
    }
  }

  async function getDocAuth(id) {
    if (!appData) return;

    activeSheet = select(store, () => ["documents", id]);

    if (unsubs.has(id)) {
      unsubs.get(id)();
    }

    if (!ids.has(id)) {
      try {
        const res = await addDoc(id, $user, store.get("documents").get(id) || defaultDocument);
      } catch (e) {
        console.error("ADD DOC ERROR", e);
      }
    }

    unsubs.set(
      id,
      sync(getDoc(id, $user), activeSheet, $user.userId, () => {
        loading = false;
      })
    );
  }

  async function selectDoc(userId, appId, id) {
    loading = true;
    console.log("selecting", { userId, appId, id });

    if (!$user.userId) {
      try {
        $user = await window.ellx.login();
      } catch (e) {
        console.log('is anonymous user');
        // anonymous user
      }
    }

    try {
      if (!$user.userId || ($user.userId && $user.userId !== userId)) {
        await getDocAnon({ userId, appId, id });
        return;
      }

      if (userId && $user.userId === userId) {
        await getDocAuth(id);
      }
    } finally {
      loading = false;
    }
  }

  async function onAuthenticated(e) {
    loading = true;
    const { commit } = store;
    ({ appData, profile, authInfo } = e.detail);

    console.log({ appData, store, authInfo });

    if (profile) {
      store.commit((p) => ({ set }) => set('profile', p), profile);
      await addDoc("profile", authInfo, profile);
    }

    $user = authInfo;

    await appData.get().then(docs => {
      docs.forEach(doc => {
        ids.add(doc.id);
        console.log("ID", doc.id);
        if (unsubs.has(doc.id)) return;

        const selector = doc.id === "profile"
          ? userProfile
          : select(store, () => ["documents", doc.id]);

        console.log('Trying to sync', doc.id);
        unsubs.set(doc.id, (sync(getDoc(doc.id, $user), selector, $user.userId)));
      });

      selectDoc($user.userId, $user.appId, ($docId || "DOC_0"));
    });

    if (!$docId) {
      $route = $user.userId + "/" +  $user.appId + "/" + "DOC_0";
    }
  }

  onDestroy(() => [...unsubs.values()]);

  onMount(async () => {
    setTimeout(async () => {
      headlong();

      const el = document.getElementById('app');
      if (!el) return;

      el.classList.remove('hidden');
      await tick();
      setTimeout(() => el.classList.remove('opacity-0'), 50);
      el.classList.add('opacity-100');
    }, 50);

    tick().then(() => route.set(window.location.hash.slice(1)));

    console.log($route, "route on mount");
    try {
      const authInfo = await window.ellx.login();
      console.log({ authInfo });
      if (authInfo && authInfo.userId) {
        await onAuthenticated({ detail: { appData: getAppData(authInfo), authInfo } });
      }
    } catch (e) {
      console.log(e);
    } finally {
      loading = false;
    }

    if ($route) selectDoc(...$route.split("/"));
  });

  function updateProfile(data) {
    store.commit(UPDATE_PROFILE, { profile: data });
    showProfile = false;
  }

  function onCancelProfileEdit() {
    showProfile = false;
    window.scrollTo(0, 0);
  }

  async function logout() {
    await window.ellx.logout();
    [...unsubs.values()].forEach(a => a());
    unsubs = new Map();
    store.resetStore();
    activeSheet = select(store, () => ["documents", "DOC_0"]);
    $route = "";
    $user = { userId: null, appId: null };
    loading = false;
  }
</script>

<div class="fixed top-0 left-0 w-full h-full bg-gradient-to-r from-warm-gray-100 dark:from-gray-900 via-gray-200 dark:via-gray-800 to-warm-gray-100 dark:to-warm-gray-800" />

<Nav
  bind:dark
  bind:showProfile
  togglePublic={() => togglePublic(activeSheet)}
  {logout}
  {store}
  {founderShare}
/>

{#if !$route}
  <HomePage bind:loading on:success={onAuthenticated} />
{:else}
  {#if loading}
    <div class="h-full w-full absolute flex items-center justify-center">
      <div transition:scale={{ delay: 200 }}>
        <Logo animated size={64} />
      </div>
    </div>
  {:else}
    {#if showProfile}
      <div class="flex flex-wrap align-center justify-center">
        <div class="max-w-xl mx-auto w-full lg:w-6/12 px-4">
          <div
            class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow rounded bg-gray-300 mt-8 text-gray-800 antialiased bg-gradient-to-r from-blue-gray-100 via-gray-200 to-warm-gray-200"
          >
            <div class="w-full text-center text-lg md:text-2xl text-black mt-12 px-4 uppercase tracking-widest font-bold">
              {$_("プロフィール編集画面")}
            </div>
            <ProfileForm
              initial={false}
              label="保存する"
              data={{ ...$userProfile}}
              {errors}
              onSave={updateProfile}
              onCancel={onCancelProfileEdit}
            />
          </div>
        </div>
      </div>
    {:else}
      <Sheet
        bind:dark
        {blocks}
        {nRows}
        {nCols}
        store={activeSheet}
      />
    {/if}
  {/if}
{/if}

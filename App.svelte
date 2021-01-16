<script>
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
  import { sync } from "./sync.js";
  import { defaultProfile, UPDATE_PROFILE, SET_LANGUAGE, docId } from "./store.js";
  import { togglePublic } from "./actions.js";
  import {
    colsCount,
    rowsCount,
    toBlocks,
  } from "./selectors.js";
  import _ from "./intl.js";

  let blocks = new Map();
  let nRows = 10;
  let nCols = 5;
  export let store;

  let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  $: if (dark) {
    document.querySelector('body').classList.add('mode-dark');
  } else {
    document.querySelector('body').classList.remove('mode-dark');
  }

  $: activeSheet = select(store, () => ["documents", $docId]);

  $: {
     blocks = toBlocks(activeSheet, $docId);
     nRows = rowsCount($activeSheet.investors);
     nCols = colsCount($activeSheet.rounds);
  }

  let page = "home";
  let unsubs = new Map();
  let prefetching = false;
  let showProfile = false;
  let errors = { ...defaultProfile };

  let userProfile = select(store, () => ["profile"]);

  let appData, profile;

//   Uncomment to jump straight to the table
//   page = "cap-table";

  $: if ($docId) selectDoc($docId);

  function selectDoc(id) {
    if (!appData) return;

    if (unsubs.has(id)) return;

    unsubs.set(
      id,
      sync(appData.doc(id), select(store, () => ["documents", id]), () => {
        prefetching = false;
      })
    );
  }

  async function onAuthenticated(e) {
    prefetching = true;
    const { commit } = store;
    ({ appData, profile } = e.detail);

    console.log({ appData, store });

    if (profile) {
      store.commit((p) => ({ set }) => set('profile', p), profile);
    }

    // TODO: change subscription on doc change
    appData.get().then(docs => {
      docs.forEach(doc => {
        if (doc.id === $docId || unsubs.has(doc.id)) return;

        const selector = doc.id === "profile"
          ? userProfile
          : select(store, () => ["documents", doc.id]);

          unsubs.set(doc.id, (sync(appData.doc(doc.id), selector)));
      });

      selectDoc($docId);
    });

    page = "cap-table";
  }

  onDestroy(() => [...unsubs.values()]);

  onMount(() => {
    setTimeout(async () => {
      headlong();
      const el = document.getElementById('app');
      if (!el) return;

      el.classList.remove('hidden');
      el.classList.remove('opacity-0');
      await tick();
      el.classList.add('opacity-100');
    }, 50);
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
    $docId = "DOC_0";
    store.resetStore();
    page = "home";
  }
</script>

<div class="fixed top-0 left-0 w-full h-full bg-gradient-to-r from-warm-gray-100 dark:from-gray-900 via-gray-200 dark:via-gray-800 to-warm-gray-100 dark:to-warm-gray-800" />

<Nav
  bind:dark
  bind:showProfile
  togglePublic={() => togglePublic(activeSheet)}
  {logout}
  {store}
/>

{#if page === 'home'}
  <HomePage on:success={onAuthenticated} />
{:else}
  {#if prefetching}
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

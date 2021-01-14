<script>
  import { scale } from "svelte/transition";
  import headlong from "~matyunya/headlong";
  import { onMount, onDestroy, tick } from "svelte";
  import HomePage from "./HomePage.svelte";
  import Sheet from "./Sheet.svelte";
  import Logo from "./Logo.svelte";
  import ProfileForm from "./ProfileForm.svelte";
  import Scrim from "./Scrim.svelte";
  import Nav from "./Nav.svelte";
  import { sync } from "./sync.js";
  import { defaultProfile, UPDATE_PROFILE, SET_LANGUAGE } from "./store.js";
  import _ from "./intl.js";

  export let blocks = new Map();
  export let nRows = 10;
  export let nCols = 5;
  export let store;
  export let login = () => {};

  let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  $: if (dark) {
    document.querySelector('body').classList.add('mode-dark');
  } else {
    document.querySelector('body').classList.remove('mode-dark');
  }

  let page = "home";
  let unsub = () => {};
  let prefetching = false;
  let showProfile = false;
  let errors = { ...defaultProfile };
  let userProfile;

  $: userProfile = { ...store.get().profile };

//   Uncomment to jump straight to the table
//   page = "cap-table";

  async function onAuthenticated(e) {
    prefetching = true;
    const { commit } = store;
    const { appData, profile } = e.detail;

    if (profile) store.commit((p) => ({ set }) => set('profile', p), profile);

    unsub = sync(appData, store, () => {
      prefetching = false;
    });

    page = "cap-table";
  }

  onDestroy(unsub);

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
    userProfile = { ...store.get().profile };
    window.scrollTo(0, 0);
  }

  async function logout() {
    await window.ellx.logout();
    unsub();
    store.resetStore();
    page = "home";
    unsub = () => {};
  }
</script>

<div class="fixed top-0 left-0 w-full h-full bg-gradient-to-r from-warm-gray-100 dark:from-gray-900 via-gray-200 dark:via-gray-800 to-warm-gray-100 dark:to-warm-gray-800" />

<Nav {logout} {store} bind:dark bind:showProfile />

{#if page === 'home'}
  <HomePage on:success={onAuthenticated} {login} />
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
              data={userProfile}
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
        {store}
      />
    {/if}
  {/if}
{/if}

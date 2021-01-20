<script>
  import { tx } from "tinyx";
  import { scale } from "svelte/transition";
  import { select } from "tinyx";
  import headlong from "~matyunya/headlong";
  import { onMount, onDestroy, tick } from "svelte";

  import HomePage from "./HomePage.svelte";
  import EditProfilePage from "./EditProfilePage.svelte";

  import Sheet from "/components/Sheet.svelte";
  import Logo from "/components/Logo.svelte";
  import Nav from "/components/Nav.svelte";
  import { deserialize } from "/utils/sync.js";
  import { docId, user, store } from "./store.js";
  import { togglePublic } from "/utils/actions.js";
  import route from "/utils/router.js";
  import { calcFounderShare } from "/utils/index.js";
  import { getDoc } from "/utils/firebase.js";
  import { connect } from "/models/docs.js";
  import { connect as connectProfile } from "/models/profile.js";
  import {
    colsCount,
    rowsCount,
    toBlocks,
  } from "/utils/selectors.js";
  import _ from "/utils/intl.js";

  let blocks = new Map();
  let nRows = 10;
  let nCols = 5;
  let founderShare = 1;
  let loading = true;
  let disconnect = i => i;
  let disconnectProfile = i => i;
  let showNotFound = false;

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

  let showProfile = false;

  $: activeSheet = select(store, () => {
    const [routeUserId] = ($route || "").split("/");

    return routeUserId === $user.userId
      ? ["documents", $docId]
      : ["anonymous"];
  });

  let ids = new Set();

  $: if ($route) {
    console.log("NEW ROUTE", $route);
    showNotFound = false;
    selectDoc(...$route.split('/'));
  }

  $: console.log({ $activeSheet });

// TODO: set showNotFound after store is set
//   $: if ($docId && !loading) {
//     tick().then(() => {
//       showNotFound = !$activeSheet || $activeSheet.size === 0;
//     });
//   }

  async function getDocAnon({ userId, appId, id }) {
    try {
      const doc = await getDoc(id, { appId });

      console.log('Anonymous user fetching', { userId, appId, id, $user, userId });

      await doc.get().then(d => {
        store.commit(() => ({ set }) => set("anonymous", {
          ...deserialize(d.data()),
          readOnly: true,
        }));
      });
    } catch (e) {
      console.log('Error fetching doc', e);
      showNotFound = true;
    }
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

    } finally {
      loading = false;
    }
  }

  function onAuthenticated() {
    $user = ellx.auth();
    disconnectProfile = connectProfile();
    // TODO:
    // always redirect if no doc id
    disconnect = connect();
  }

  onDestroy(disconnect);

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

    try {
      const authInfo = await window.ellx.login();
      if (authInfo && authInfo.userId) {
        await onAuthenticated();
      }
    } catch (e) {
      console.log(e);
    } finally {
      loading = false;
    }
  });

  async function logout() {
    await window.ellx.logout();
    $route = "";
    $user = { userId: null, appId: null };
    disconnect();
    disconnectProfile();
    store.resetStore();
    loading = false;
  }
</script>

<div class="fixed z-0 top-0 left-0 w-full h-full bg-gradient-to-r from-warm-gray-100 dark:from-gray-900 via-gray-200 dark:via-gray-800 to-warm-gray-100 dark:to-warm-gray-800" />

<Nav
  bind:dark
  bind:showProfile
  togglePublic={() => togglePublic(activeSheet)}
  {logout}
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
      <EditProfilePage bind:showProfile />
    {:else if showNotFound}
      <div class="w-full text-center mt-16 text-lg relative text-red-400">
        {$_("このページは見つかりませんでした。")}
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

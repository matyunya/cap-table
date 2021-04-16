<script>
  import { scale } from "svelte/transition";
  import headlong from "~matyunya/headlong";
  import { onMount } from "svelte";

  import HomePage from "/HomePage.svelte";
  import EditProfilePage from "/EditProfilePage.svelte";

  import Sheet from "/components/sheet/Sheet.svelte";
  import Logo from "/components/ui/Logo.svelte";
  import Nav from "/components/Nav.svelte";
  import { deserialize } from "/utils/sync.js";
  import { store, documentIds } from "/store.js";
  import route from "/utils/router.js";
  import { getDoc } from "/utils/firebase.js";
  import _ from "/utils/intl.js";

  const { userId, appId } = require("/index.ellx");

  let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  $: if (dark) {
    document.querySelector("body").classList.add("mode-dark");
  } else {
    document.querySelector("body").classList.remove("mode-dark");
  }

  $: if ($route && $route !== "404") selectDoc(...$route.split("/"));

  // $: if (
  //   $documentIds.length > 0 &&
  //   $docId &&
  //   !$documentIds.find(([id]) => id === $docId)
  // ) {
  //   $route = "404";
  // }

  async function getDocAnon({ appId, id }) {
    try {
      const doc = getDoc(id, { appId });

      await doc.get().then((d) => {
        store.commit(() => ({ set }) =>
          set(id, {
            ...deserialize(d.data()),
            readOnly: true,
          })
        );
      });
    } catch (e) {
      console.log("Error fetching doc", e);
      $route = "404";
    }
  }

  async function selectDoc(docUserId, appId, id) {
    console.log("selecting", { userId, appId, id });

    if (!$userId || ($userId && $userId !== docUserId)) {
      await getDocAnon({ appId, id });
      return;
    }
  }

  onMount(async () => headlong());

  async function logout() {
    window.ellx.logout();
    $route = "";
    store.resetStore();
  }
</script>

<div
  class="fixed z-0 top-0 left-0 w-full h-full bg-gradient-to-r from-warm-gray-100 dark:from-gray-900 via-gray-200 dark:via-gray-800 to-warm-gray-100 dark:to-warm-gray-800"
/>

<Nav bind:dark hideSelect={!$route && $documentIds.length > 0} {logout} />

{#if !$route}
  {#if $documentIds.length > 0}
    <section class="relative block py-24 lg:pt-0 md:mt-24">
      <div class="max-w-sm mx-auto px-4">
        <ul class="p-4 max-w-sm mx-auto relative flex flex-col space-y-2">
          {#each $documentIds as [id, title]}
            <button
              class="cursor-pointer p-4 font-mono my-2 rounded hover:ring-1 ring-0 transition duration-150 text-light-blue-500 ring-light-blue-500"
              on:click={() =>
                ($route = `#${$userId}/${$appId}/${id}`)}
              ><li>{title}</li>
            </button>
          {/each}
        </ul>
      </div>
    </section>
  {:else}
    <HomePage />
  {/if}
{:else if $route === "profile"}
  <EditProfilePage />
{:else if $route === "404"}
  <div class="w-full text-center mt-16 text-lg relative text-red-400">
    {$_("このページは見つかりませんでした。")}
  </div>
{:else if false}
  <div class="h-full w-full absolute flex items-center justify-center">
    <div transition:scale={{ delay: 200 }}>
      <Logo animated size={64} />
    </div>
  </div>
{:else}
  <Sheet />
{/if}

<script>
  import { scale } from "svelte/transition";
  import headlong from "~matyunya/headlong";
  import { onMount } from "svelte";

  import HomePage from "/HomePage.svelte";
  import EditProfilePage from "/EditProfilePage.svelte";
  import SignUpPage from "/SignUpPage.svelte";
  import LoginPage from "/LoginPage.svelte";
  import PasswordRecoveryPage from "/PasswordRecoveryPage.svelte";

  import Sheet from "/components/sheet/Sheet.svelte";
  import Logo from "/components/ui/Logo.svelte";
  import Nav from "/components/Nav.svelte";
  import { store, documentIds } from "/store.js";
  import route from "/utils/router.js";
  import _ from "/utils/intl.js";
  import CapTableListPage from "/CapTableListPage.svelte";

  let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  $: if (dark) {
    document.querySelector("body").classList.add("mode-dark");
  } else {
    document.querySelector("body").classList.remove("mode-dark");
  }

  onMount(() => {
    const { apply } = headlong();
    apply('.button', 'bg-gray-600 tracking-widest transition duration-300 font-bold text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 mt-6');
  });

  function logout() {
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
    <CapTableListPage />
  {:else}
    <HomePage />
  {/if}
{:else if $route === "profile"}
  <EditProfilePage />
{:else if $route === "404"}
  <div class="w-full text-center mt-16 text-lg relative text-red-400">
    {$_("このページは見つかりませんでした。")}
  </div>
{:else if $route === "forgot"}
  <PasswordRecoveryPage />
{:else if $route === "login"}
  <LoginPage />
{:else if $route.includes("signup")}
  <SignUpPage />
{:else if false}
  <div class="h-full w-full absolute flex items-center justify-center">
    <div transition:scale={{ delay: 200 }}>
      <Logo animated size={64} />
    </div>
  </div>
{:else}
  <Sheet />
{/if}

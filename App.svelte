<script>
  import headlong from "~matyunya/headlong";
  import { onMount } from "svelte";
  import { classes } from "/utils/cn.js";

  import HomePage from "/pages/HomePage.svelte";
  import DashboardPage from "/pages/DashboardPage.svelte";
  import EditProfilePage from "/pages/EditProfilePage.svelte";
  import SignUpPage from "/pages/SignUpPage.svelte";
  import LoginPage from "/pages/LoginPage.svelte";
  import PasswordRecoveryPage from "/pages/PasswordRecoveryPage.svelte";
  import PasswordResetPage from "/pages/PasswordResetPage.svelte";
  import PlanPage from "/pages/PlanPage.svelte";
  import CalcPage from "/pages/CalcPage.svelte";
  import TutorialPage from "/pages/TutorialPage.svelte";
  import FeedbackPage from "/pages/FeedbackPage.svelte";

  import Sheet from "/components/sheet/Sheet.svelte";
  import Nav from "/components/Nav.svelte";
  import ContextMenu from "/components/ui/ContextMenu.svelte";
  import { store } from "/store.js";
  import _ from "/utils/intl.js";
  import CapTableListPage from "/pages/CapTableListPage.svelte";

  let dark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  $: if (dark) {
    document.querySelector("body").classList.add("mode-dark");
  } else {
    document.querySelector("body").classList.remove("mode-dark");
  }

  const { route } = require("/index.ellx");

  onMount(() => {
    const { apply, unsubscribe, ...hl } = headlong({ classes });
    apply(
      ".button",
      "bg-gray-600 transition duration-300 font-bold text-white active:bg-gray-700 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 mt-6 text-center ring-0 ring-light-blue-500"
    );
    apply(
      ".button:hover",
      "bg-gray-500 shadow-lg"
    );
    apply(
      ".button:active",
      "ring-2 bg-gray-400"
    );
    apply(
      ".button:focus",
      "ring-1"
    );
    apply(".nav-button", "h-6 p-1 px-3 text-xs mt-0 mb-0 mr-0");

    window.hl = hl;

    return unsubscribe;
  });

  function logout() {
    window.ellx.logout();
    window.ellx.router.go("/");
    store.resetStore();
  }
</script>

<Nav bind:dark {logout} />

<ContextMenu />

{#if $route === "/"}
  <HomePage />
{:else if $route === "/dashboard"}
  <DashboardPage />
{:else if $route === "/docs"}
  <CapTableListPage />
{:else if $route && $route.startsWith("/docs")}
  <Sheet />
{:else if $route === "/profile"}
  <EditProfilePage />
{:else if $route === "/404"}
  <div class="w-full text-center mt-16 text-lg relative text-red-400">
    {$_("このページは見つかりませんでした。")}
  </div>
{:else if $route === "/forgot"}
  <PasswordRecoveryPage />
{:else if $route === "/plan"}
  <PlanPage />
{:else if $route === "/calc"}
  <CalcPage />
{:else if $route === "/reset"}
  <PasswordResetPage />
{:else if $route === "/login"}
  <LoginPage />
{:else if $route === "/tutorial"}
  <TutorialPage />
{:else if $route === "/feedback"}
  <FeedbackPage />
{:else if $route && $route.includes("signup")}
  <SignUpPage />
{:else}
  Not found
{/if}

<style>
  :global(.min-h-screen) {
    height: calc(100vh - 5rem);
  }
</style>

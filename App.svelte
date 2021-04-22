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

  import Sheet from "/components/sheet/Sheet.svelte";
  import Nav from "/components/Nav.svelte";
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
    const { apply, ...hl } = headlong({ classes });
    apply(
      ".button",
      "bg-gray-600 transition duration-300 font-bold text-white active:bg-gray-700 text-sm font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 mt-6"
    );

    window.hl = hl;
  });

  function logout() {
    window.ellx.logout();
    window.ellx.router.go("/");
    store.resetStore();
  }
</script>

<Nav bind:dark {logout} />

{#if $route === "/"}
  <HomePage />
{:else if $route === "/dashboard"}
  <DashboardPage />
{:else if $route === "/docs"}
  <CapTableListPage />
{:else if $route === "/profile"}
  <EditProfilePage />
{:else if $route === "/404"}
  <div class="w-full text-center mt-16 text-lg relative text-red-400">
    {$_("このページは見つかりませんでした。")}
  </div>
{:else if $route === "/forgot"}
  <PasswordRecoveryPage />
{:else if $route === "/login"}
  <LoginPage />
{:else if $route && $route.includes("signup")}
  <SignUpPage />
{:else}
  <Sheet />
{/if}

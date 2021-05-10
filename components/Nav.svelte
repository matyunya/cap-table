<script>
  import Select from "/components/ui/Select.svelte";
  import { language, documentIds, SET_LANGUAGE, store } from "/store.js";
  import _ from "/utils/intl.js";
  import { updateProfile } from "/models/profile.js";
  import { openContextMenu } from "/components/ui/ContextMenu.svelte";
  import { getDocMenuItems } from "/utils/menus.js";
  import FounderShare from "/components/FounderShare.svelte";

  export let logout = () => {};
  export let dark;

  const {
    isAuthenticated,
    docId,
    userId,
    appId,
    route,
    profile,
  } = require("/index.ellx");

  function setLanguage(language) {
    if ($isAuthenticated) {
      updateProfile({ language });
    } else {
      store.commit(SET_LANGUAGE, { language });
    }
  }

  $: options = $documentIds.find(([id]) => $docId === id)
    ? $documentIds
    : [[$docId, "--"], ...$documentIds];

  function routeName(r) {
    if (!r) return false;

    if (typeof r === "string" && r.startsWith("/docs/")) {
      return "資本政策";
    }
  }
</script>

<div
  class="fixed z-0 top-0 left-0 w-full h-full bg-gradient-to-r from-warm-gray-100 dark:from-gray-900 via-gray-100 dark:via-gray-800 to-blue-gray-100 dark:to-warm-gray-800"
/>

<nav class="w-screen h-10 flex flex-row px-8 text-gray-600 dark:text-gray-200">
  <div
    class="flex items-center h-full justify-start text-sm sm:text-xs font-medium z-30 pt-2"
  >
    {#if $route && !$route.startsWith("/docs/")}
      <a
        href="/"
        class="font-bold tracking-wide text-base mr-4 text-black dark:text-white ring-0 dark:ring-white ring-black hover:ring-1 rounded p-1 transition duration-300"
      >
        Capital Dash
      </a>
      {#if $isAuthenticated && !$route.startsWith("/signup")}
        <a
          class="mx-2 font-mono hover:text-black hover:dark:text-white hover:underline transition duration-150"
          href="/docs"
          class:font-bold={$route === "/docs"}
        >
          {$_("資本政策")}
        </a>
        <a
          class="mx-2 font-mono hover:text-black hover:dark:text-white hover:underline transition duration-150"
          href="/plan"
          class:font-bold={$route === "/plan"}
        >
          {$_("事業計画")}
        </a>
        <a
          class="mx-2 font-mono hover:text-black hover:dark:text-white hover:underline transition duration-150"
          href="/calc"
          class:font-bold={$route === "/calc"}
        >
          {$_("株価算定")}
        </a>
      {/if}
    {/if}
    {#if routeName($route)}
      <a
        href="/docs"
        class="text-xs font-mono underline text-light-blue-500 rounded p-1"
      >
        ← {$_(routeName($route))}
      </a>
    {/if}
    {#if $route && $route.startsWith("/docs/")}
      <Select
        classes="ml-6 mr-3 focus:ring-2 w-32 truncate transition p-1 duration-200 bg-transparent text-xs shadow focus:outline-none rounded mr-3 text-light-blue-500"
        hasEmpty={false}
        value={$docId}
        on:change={({ target }) =>
          window.ellx.router.go(`/docs/${$userId}/${$appId}/${target.value}`)}
        {options}
      />
      <button
        title="Dark mode toggle"
        class="text-xs h-6 w-6 flex items-center justify-center rounded-full ring-1 mx-3 hover:ring-2 cursor-pointer text-xs dark:ring-gray-100 ring-gray-600 p-1"
        on:click={(e) => openContextMenu(getDocMenuItems(), e)}
      >
        ☰
      </button>
    {/if}
    <FounderShare />
  </div>
  <div class="flex-grow" />
  <div
    class="flex items-center h-full justify-end text-sm sm:text-xs font-medium px-8 z-30 pt-2"
  >
    <button
      title="Dark mode toggle"
      class="text-xs h-6 w-6 flex items-center justify-center rounded-full ring-1 mx-3 hover:ring-2 cursor-pointer text-base dark:ring-gray-100 ring-gray-600"
      on:click={() => (dark = !dark)}
    >
      {dark ? "💡" : "🕶️"}
    </button>
    <button
      title="Switch language"
      class="text-xs h-6 w-6 flex items-center justify-center rounded-full ring-1 mx-3 hover:ring-2 cursor-pointer text-xs dark:ring-gray-100 ring-gray-600"
      on:click={() => setLanguage($language === "ja" ? "en" : "ja")}
      style="font-variant: small-caps;"
    >
      {$language}
    </button>
    {#if $isAuthenticated}
      <button
        on:click={(e) =>
          openContextMenu(
            [
              {
                text: "ご利用ガイド",
                cb: () => window.ellx.router.go("/tutorial"),
              },
              {
                text: "お問い合わせ",
                cb: () => window.ellx.router.go("/feedback"),
              },
            ],
            e
          )}
        class="text-xs h-6 w-6 flex items-center justify-center rounded-full ring-1 mx-3 hover:ring-2 cursor-pointer text-base dark:ring-gray-100 ring-gray-600"
        >?</button
      >
      <button
        on:click={(e) =>
          openContextMenu(
            [
              {
                text: "プロフィール情報確認・変更",
                cb: () => window.ellx.router.go("/profile"),
              },
              {
                text: "パスワード再設定",
                cb: () => window.ellx.router.go("/reset"),
              },
              {
                text: "ログアウト",
                cb: logout,
              },
            ],
            e
          )}
        class="button nav-button truncate w-24 mx-3"
      >
        {$profile.name || $_("プロフィール")}
      </button>
    {:else}
      {#if $route && $route.startsWith("/signup")}
        <span class="ml-5">{$_("アカウントをお持ちの方は")}</span>
      {/if}
      <a class="ml-5 button nav-button" href="/login">
        {$_("ログイン")}
      </a>
    {/if}
  </div>
</nav>

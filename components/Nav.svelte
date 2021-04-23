<script>
  import Select from "/components/ui/Select.svelte";
  import { language, documentIds, SET_LANGUAGE, store } from "/store.js";
  import _ from "/utils/intl.js";
  import { updateProfile } from "/models/profile.js";
  import { openContextMenu } from "/components/ui/ContextMenu.svelte";
  import { getDocMenuItems } from "/utils/menus.js";
  import Icon from "/components/ui/Icon.svelte";
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

  const languages = [
    ["en", "EN"],
    ["ja", "JA"],
  ];

  function setLanguage({ target: { value: language } }) {
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

    if (r.startsWith("/docs/")) {
      return "資本政策";
    }
  }
</script>

<div
  class="fixed z-0 top-0 left-0 w-full h-full bg-gradient-to-r from-warm-gray-100 dark:from-gray-900 via-gray-100 dark:via-gray-800 to-blue-gray-100 dark:to-warm-gray-800"
/>

<nav class="w-screen h-10 flex flex-row px-8">
  <div
    class="flex items-center h-full justify-start text-sm sm:text-xs font-medium z-30"
  >
    {#if $route && !$route.startsWith("/docs/")}
      <a href="/" class="font-bold tracking-wide text-base mr-4">
        Capital Dash
      </a>
      {#if $isAuthenticated && !$route.startsWith("/signup")}
        <a class="mx-2 font-mono" href="/docs">{$_("資本政策")}</a>
        <a class="mx-2 font-mono" href="/plan">{$_("事業計画")}</a>
        <a class="mx-2 font-mono" href="/calc">{$_("株価算定")}</a>
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
        classes="mx-6 focus:ring-2 w-32 truncate transition p-1 duration-200 bg-transparent text-xs shadow focus:outline-none rounded mr-3 text-light-blue-500"
        hasEmpty={false}
        value={$docId}
        on:change={({ target }) =>
          window.ellx.router.go(`/docs/${$userId}/${$appId}/${target.value}`)}
        {options}
      />
      <Icon
        on:click={(e) => openContextMenu(getDocMenuItems(), e)}
        size="24"
        class="mx-4"
        absolute={false}
        rotate="90"
      />
    {/if}
    <FounderShare />
  </div>
  <div class="flex-grow" />
  <div
    class="flex items-center h-full justify-end text-sm sm:text-xs font-medium px-8 z-30"
  >
    <button
      title="Dark mode toggle"
      class="rounded-full outline-none ring-gray-100 mr-3 text-base h-6 w-6 hover:ring-4 transition duration-500"
      on:click={() => (dark = !dark)}
    >
      {dark ? "☀️" : "🌙"}
    </button>
    <Select
      classes="focus:ring-2 p-1 transition duration-200 bg-transparent text-xs shadow focus:outline-none rounded mr-3 text-light-blue-500"
      hasEmpty={false}
      value={$language}
      on:change={setLanguage}
      options={languages}
    />
    {#if $isAuthenticated}
      <button
        on:click={(e) =>
          openContextMenu(
            [
              {
                text: "登録情報確認・変更",
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
        class="button nav-button truncate w-16"
      >
        {$profile.name}
      </button>
    {:else}
      {#if $route && $route.startsWith("/signup")}
        <span class="mr-3 ml-5">{$_("アカウントをお持ちの方は")}</span>
      {/if}
      <a class="button nav-button" href="/login">
        {$_("ログイン")}
      </a>
    {/if}
  </div>
</nav>

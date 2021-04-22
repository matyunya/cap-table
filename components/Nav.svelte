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

<nav class="w-screen h-10 flex flex-row mb-8">
  <div
    class="flex items-center h-full justify-start text-sm sm:text-xs font-medium z-30"
  >
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
      <a
        class="rounded text-light-blue-500 hover:ring-1 ring-light-blue-500 cursor-pointer mx-1 px-3 sm:px-1"
        href="profile"
      >
        {$_("プロフィール")}
      </a>
      <button
        class="rounded text-light-blue-500 hover:ring-1 ring-light-blue-500 cursor-pointer mx-1 px-3 sm:px-1"
        on:click={logout}
      >
        {$_("ログアウト")}
      </button>
    {:else}
      {#if $route && $route.startsWith("/signup")}
        <span>{$_("アカウントをお持ちの方は")}</span>
      {/if}
      <a
        class="rounded text-light-blue-500 hover:ring-1 ring-light-blue-500 cursor-pointer mx-1 px-3 sm:px-1"
        href="/login"
      >
        {$_("ログイン")}
      </a>
    {/if}
  </div>
</nav>

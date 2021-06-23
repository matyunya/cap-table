<script>
  import Select from "/components/ui/Select.svelte";
  import { store } from "/store.js";
  import { SET_LANGUAGE } from "/utils/mutations/profile.js";
  import _ from "/utils/intl.js";
  import { updateProfile } from "/models/profile.js";
  import { openContextMenu } from "/components/ui/ContextMenu.svelte";
  import { getDocMenuItems, getPlanMenuItems } from "/utils/menus.js";
  import FounderShare from "/components/FounderShare.svelte";
  import LogoDash from "/icons/logo-dash.svelte";

  export let logout = () => {};
  export let dark;

  const {
    isAuthenticated,
    activeItemId,
    userId,
    route,
    isDoc,
    isItem,
    itemIds,
    language,
    isPlan,
  } = require("/index.ellx");

  function setLanguage(language) {
    if ($isAuthenticated) {
      updateProfile({ language });
    } else {
      store.commit(SET_LANGUAGE, { language });
    }
  }

  let options = [];

  $: if (Array.isArray($itemIds))
    options = $itemIds.find(([id]) => $activeItemId === id)
      ? $itemIds
      : [[$activeItemId, "--"], ...$itemIds];

  function routeName(r) {
    if (!r) return false;

    if ($route.startsWith("/docs/")) {
      return "資本政策";
    }
    if ($route.startsWith("/plans/")) {
      return "事業計画";
    }
  }

  function backRoute(r) {
    if (!r) return "/";

    if ($route.startsWith("/docs/")) {
      return "/docs";
    }
    if ($route.startsWith("/plans/")) {
      return "/plans";
    }
  }
</script>

<div
  style="z-index: -100"
  class="fixed top-0 left-0 w-full h-full bg-gradient-to-r from-warm-gray-50 dark:from-gray-900 via-gray-50 dark:via-gray-800 to-blue-gray-100 dark:to-warm-gray-800"
/>

<nav
  class="bg-blurred bg-white dark:bg-black shadow-sm w-screen z-30 h-12 pb-1 flex flex-row px-8 text-gray-600 dark:text-gray-200 fixed top-0 left-0"
>
  <div
    class="flex items-center h-full justify-start text-sm sm:text-xs font-medium z-30 pt-2"
  >
    {#if !$isItem}
      <a
        href="/"
        class="font-bold tracking-wide text-base mr-4 text-black dark:text-white ring-0 ring-blue-800 hover:ring-1 rounded-xl p-1 transition duration-300"
      >
        <LogoDash class="w-32" />
      </a>
      {#if $isAuthenticated && typeof $route === "string" && !$route.startsWith("/signup")}
        <a
          class="mx-2 hover:text-black hover:dark:text-white hover:underline transition duration-150"
          href="/docs"
          class:text-black={$route === "/docs"}
          class:dark:text-white={$route === "/docs"}
          class:underline={$route === "/docs"}
        >
          {$_("資本政策")}
        </a>
        <a
          class="mx-2 hover:text-black hover:dark:text-white hover:underline transition duration-150"
          href="/plans"
          class:text-black={$route === "/plans"}
          class:dark:text-white={$route === "/plans"}
          class:underline={$route === "/plans"}
        >
          {$_("事業計画")}
        </a>
        <a
          class="mx-2 hover:text-black hover:dark:text-white hover:underline transition duration-150"
          href="/scenarios"
          class:text-black={$route === "/scenarios"}
          class:dark:text-white={$route === "/scenarios"}
          class:underline={$route === "/scenarios"}
        >
          {$_("株価算定")}
        </a>
      {/if}
    {/if}
    {#if routeName($route)}
      <a href={backRoute($route)} class="text-xs underline rounded-xl p-1">
        ← {$_(routeName($route))}
      </a>
    {/if}
    {#if $isItem}
      <Select
        classes="ml-6 mr-3 focus:ring-2 w-48 truncate transition p-1 duration-200 bg-transparent text-xs shadow focus:outline-none rounded-xl mr-3"
        hasEmpty={false}
        value={$activeItemId}
        on:change={({ target }) =>
          window.ellx.router.go(
            ($isDoc ? "/docs/" : "/plans/") + `${$userId}/${target.value}`
          )}
        {options}
      />
      <button
        class="text-xs h-6 w-6 flex items-center justify-center rounded-full ring-1 mx-3 hover:ring-2 cursor-pointer text-xs dark:ring-gray-100 ring-gray-600 p-1 shadow-lg hover:shadow-xl dark:bg-light-blue-100 bg-white hover:bg-gray-50 dark:bg-light-blue-900  hover:text-black hover:dark:text-gray-100 hover:dark:bg-light-blue-700 transition duration-200"
        on:click={(e) =>
          openContextMenu($isPlan ? getPlanMenuItems() : getDocMenuItems(), e)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
          />
        </svg>
      </button>
    {/if}
    <FounderShare />
  </div>
  <div class="flex-grow" />
  <div
    class="flex items-center h-full justify-end text-sm sm:text-xs font-medium px-8 z-30 pt-2"
  >
    {#if $route !== "/signup/2"}
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
        class:hidden={!$isAuthenticated}
        class="text-xs h-6 w-6 flex items-center justify-center rounded-full ring-1 mx-3 hover:ring-2 cursor-pointer text-base dark:ring-gray-100 ring-gray-600"
        >?</button
      >
      <button
        on:click={(e) =>
          openContextMenu(
            [
              $isAuthenticated && {
                text: "プロフィール情報確認・変更",
                cb: () => window.ellx.router.go("/profile"),
              },
              $isAuthenticated && {
                text: "パスワード再設定",
                cb: () => window.ellx.router.go("/reset"),
              },
              {
                text: $language === "ja" ? "English" : "日本語",
                cb: () => setLanguage($language === "ja" ? "en" : "ja"),
              },
              {
                text: "外観モード：" + (dark ? "ライト" : "ダーク") + "に変更",
                cb: () => (dark = !dark),
              },
              $isAuthenticated && {
                text: "ログアウト",
                cb: logout,
              },
            ].filter(Boolean),
            e
          )}
        class="text-xs h-6 w-6 flex items-center justify-center rounded-full ring-1 mx-3 hover:ring-2 cursor-pointer text-xs dark:ring-gray-100 ring-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
        >
          <path
            d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"
          />
        </svg>
      </button>
      {#if !$isAuthenticated}
        {#if typeof $route === "string" && $route.startsWith("/signup")}
          <span class="ml-5">{$_("アカウントをお持ちの方は")}</span>
        {/if}
        {#if $route !== "/login"}
          <a class="ml-5 button nav-button" href="/login">
            {$_("ログイン")}
          </a>
        {/if}
      {/if}
    {/if}
  </div>
</nav>

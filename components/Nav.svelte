<script>
  import route from "/utils/router.js";
  import Select from "./Select.svelte";
  import { isAuthenticated, language, documentIds, docId, user, SET_LANGUAGE, store } from "/store.js";
  export let showProfile;
  import _ from "/utils/intl.js";
  import { updateProfile } from "/models/profile.js";
  import { format } from "/utils/index.js";

  export let logout = () => {};
  export let dark;
  export let togglePublic = () => {};
  export let founderShare = 0;

  const languages = [["en", "🇬🇧"], ["ja", "🇯🇵"]];

  function setLanguage({ target: { value: language } }) {
    if ($isAuthenticated) {
      updateProfile({ language }, { merge: true });
    } else {
      store.commit(SET_LANGUAGE, { language });
    }
  }
</script>

<style>
  .blurred-bg {
    backdrop-filter: blur(2px);
  }
</style>

<div
  class="fixed w-full h-8 top-0 z-20 blurred-bg flex"
>
  {#if $isAuthenticated}
    <div class="flex items-center h-full justify-start text-sm sm:text-xs font-medium px-8">
      <Select
        classes="focus:ring-2 w-32 truncate transition duration-200 bg-transparent text-xs shadow focus:outline-none rounded mr-3 text-light-blue-500"
        hasEmpty={false}
        value={$docId}
        on:change={({ target }) => route.set(`${$user.userId}/${$user.appId}/${target.value}`)}
        options={$documentIds}
      />
    </div>
  {/if}
  <div class="flex-grow" />
  <div class="select-none flex items-center h-full justify-end text-sm sm:text-xs font-medium px-8">
    {#if founderShare > 0 && founderShare !== 1}
        <div
          class="text-xs mr-3 font-mono"
          class:text-green-500={founderShare > 0.5}
          class:text-yellow-500={founderShare < 0.5 && founderShare > 0.34}
          class:text-red-300={founderShare < 0.34}>
          {$_("創業メンバー%")} {format.percent.format(founderShare)}
        </div>
    {/if}
    <button title="Dark mode toggle" class="rounded-full outline-none ring-gray-100 mr-3 text-base h-6 w-6 hover:ring-4 transition duration-500" on:click={() => dark = !dark}>
      {dark ? "☀️" : "🌙"}
    </button>
    <Select
      classes="focus:ring-2 transition duration-200 bg-transparent text-lg shadow focus:outline-none rounded mr-3 text-light-blue-500"
      hasEmpty={false}
      value={$language}
      on:change={setLanguage}
      options={languages}
    />
    {#if $isAuthenticated}
      <button class="rounded text-light-blue-500 hover:ring-1 ring-light-blue-500 cursor-pointer mx-1 px-3 sm:px-1" on:click={() => showProfile = !showProfile}>{$_("プロフィール")}</button>
      <button class="rounded text-light-blue-500 hover:ring-1 ring-light-blue-500 cursor-pointer mx-1 px-3 sm:px-1" on:click={logout}>{$_("ログアウト")}</button>
    {/if}
  </div>
</div>

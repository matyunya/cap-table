<script>
  import Select from "./Select.svelte";
  import { SET_LANGUAGE, isAuthenticated } from "./store.js";
  export let showProfile;

  export let logout = () => {};
  export let dark;

  const languages = [["EN", "🇬🇧"], ["JA", "🇯🇵"]];

  function setLanguage({ target }) {
    store.commit(SET_LANGUAGE, { language: target.value });
  }
</script>

<style>
  .blurred-bg {
    backdrop-filter: blur(2px);
  }
</style>

<div
  class="fixed w-full h-8 top-0 z-20 blurred-bg select-none"
>
  <div class="flex items-center h-full justify-end text-sm sm:text-xs font-medium px-8">
    <button title="Dark mode toggle" class="rounded-full outline-none ring-gray-100 mr-3 text-base h-6 w-6 hover:ring-4 transition duration-500" on:click={() => dark = !dark}>
      {dark ? "☀️" : "🌙"}
    </button>
    <Select
      classes="focus:ring-2 transition duration-200 bg-transparent text-lg shadow focus:outline-none rounded mr-3"
      hasEmpty={false}
      value={store.get('language')}
      on:change={setLanguage}
      options={languages}
    />
    {#if $isAuthenticated}
      <button class="a cursor-pointer px-3 sm:px-1" on:click={() => showProfile = !showProfile}>プロフィール</button>
      <button class="a cursor-pointer px-3 sm:px-1" on:click={logout}>ログアウト</button>
    {/if}
  </div>
</div>

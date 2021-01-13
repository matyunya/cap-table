<script>
  export let showProfile;

  export let logout = () => {};
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
    <button class="a cursor-pointer px-3 sm:px-1" on:click={() => showProfile = !showProfile}>プロフィール</button>
<!--     <button class="a cursor-pointer px-3 sm:px-1" on:click={logout}>ログアウト</button> -->
  </div>
</div>

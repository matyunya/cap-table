<script>
  import { documentIds } from "/store.js";
  import Icon from "/components/ui/Icon.svelte";
  const { userId, appId } = require("/index.ellx");
</script>

<section
  class="relative block py-24 text-sm flex items-center justify-center min-h-screen"
>
  <ul
    class="p-4 max-w-5xl w-full mx-auto relative grid grid-cols-4 grid-auto-rows gap-4"
  >
    {#each $documentIds as [id, title]}
      <li
        class="relative cursor-pointer h-32 w-full p-3 font-mono rounded hover:ring-2 ring-1 transition duration-150 text-light-blue-500 ring-light-blue-500 flex flex-col justify-between"
        on:click={() =>
          window.ellx.router.go(`/docs/${$userId}/${$appId}/${id}`)}
      >
        <div class="flex flex-row justify-between">
          <li>{title}</li>
          <Icon wrapperClasses="" absolute={false} size="20" />
        </div>
        <div class="text-xs">最終閲覧 16:05</div>
      </li>
    {/each}
  </ul>
</section>

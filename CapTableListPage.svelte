<script>
  import { documentIds } from "/store.js";
  import route from "/utils/router.js";
  const { userId, appId } = require("/index.ellx");
</script>

<section class="relative block py-24 lg:pt-0">
  <div class="max-w-sm mx-auto px-4">
    <ul class="p-4 max-w-sm mx-auto relative flex flex-col space-y-2">
      {#each $documentIds as [id, title]}
        <button
          class="cursor-pointer p-4 font-mono my-2 rounded hover:ring-1 ring-0 transition duration-150 text-light-blue-500 ring-light-blue-500"
          on:click={() =>
            ($route = `#${$userId}/${$appId}/${id}`)}
          ><li>{title}</li>
        </button>
      {/each}
    </ul>
  </div>
</section>

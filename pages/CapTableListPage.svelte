<script>
  import { format, isToday } from "date-fns";
  import { documentIds } from "/store.js";
  import Icon from "/components/ui/Icon.svelte";
  const { userId, appId } = require("/index.ellx");

  function formatDate(d) {
    if (!d) return "--";
    return format(new Date(d), isToday(new Date(d)) ? "HH:mm" : "MM/dd HH:mm");
  }
</script>

<section
  class="relative block py-24 text-sm flex items-center justify-center min-h-screen"
>
  <ul
    class="p-4 max-w-5xl w-full mx-auto relative grid grid-cols-4 grid-auto-rows gap-4"
  >
    {#each $documentIds as [id, title, lastViewed]}
      <li
        class="relative cursor-pointer h-32 w-full p-3 font-mono rounded hover:ring-2 ring-1 transition duration-150 ring-gray-200 shadow hover:shadow-lg flex flex-col justify-between"
        on:click={() =>
          window.ellx.router.go(`/docs/${$userId}/${$appId}/${id}`)}
      >
        <div class="flex flex-row justify-between">
          <li>{title}</li>
          <Icon wrapperClasses="" absolute={false} size="20" />
        </div>
        <div class="text-xs">
          最終閲覧 {formatDate(lastViewed)}
        </div>
      </li>
    {/each}
  </ul>
</section>

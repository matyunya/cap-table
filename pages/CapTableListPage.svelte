<script>
  import Cell, { setEditing } from "/components/sheet/Cell.svelte";
  import _ from "/utils/intl.js";
  import { format, isToday } from "date-fns";
  import { documentIds } from "/store.js";
  import Icon from "/components/ui/Icon.svelte";
  import { renameDocument, createDocument } from "/utils/actions.js";
  import { openContextMenu } from "/components/ui/ContextMenu.svelte";
  import { getCommonMenuItems } from "/utils/menus.js";

  const { userId, appId } = require("/index.ellx");

  function formatDate(d) {
    if (!d) return "--";
    return format(new Date(d), isToday(new Date(d)) ? "HH:mm" : "MM/dd HH:mm");
  }
</script>

<section class="relative text-sm flex min-h-screen flex-col max-w-4xl mx-auto">
  <h2 class="font-bold text-lg mt-6 text-left w-full tracking-wide">
    {$_("資本政策シミュレーター")}
  </h2>
  <button on:click={createDocument} class="button w-full">
    {$_("新規テーブルを作成")}
  </button>
  <ul
    class="max-w-5xl w-full mx-auto relative grid grid-cols-4 grid-auto-rows gap-4 mt-12"
  >
    {#each $documentIds as [id, title, lastViewed]}
      <li
        class="relative bg-gray-200 dark:bg-gray-900 cursor-pointer h-32 w-full p-3 font-mono rounded hover:ring-2 ring-1 transition duration-150 ring-gray-200 shadow hover:shadow-lg flex flex-col justify-between"
        on:click={() =>
          window.ellx.router.go(`/docs/${$userId}/${$appId}/${id}`)}
      >
        <div
          on:click|preventDefault|stopPropagation={setEditing}
          class="flex flex-row justify-between relative"
        >
          <Cell
            class="text-left text-sm font-medium"
            on:change={({ detail }) => renameDocument({ id, detail })}
            value={title}
          />
          <Icon
            on:click={(e) => openContextMenu(getCommonMenuItems(id), e)}
            wrapperClasses="top-0 right-0 h-full flex items-center" />
        </div>
        <div class="text-xs">
          {$_("最終閲覧")}
          {formatDate(lastViewed)}
        </div>
      </li>
    {/each}
  </ul>
</section>

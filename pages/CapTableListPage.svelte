<script>
  import Cell, { setEditing } from "/components/sheet/Cell.svelte";

  import _ from "/utils/intl.js";
  import isToday from "date-fns/isToday";
  import format from "date-fns/format";
  import { documentIds } from "/store.js";
  import Icon from "/components/ui/Icon.svelte";
  import { renameDocument, createDocument } from "/utils/actions.js";
  import { openContextMenu } from "/components/ui/ContextMenu.svelte";
  import ThumbnailChart from "/components/ThumbnailChart.svelte";
  import { getCommonMenuItems } from "/utils/menus.js";

  const { userId, appId } = require("/index.ellx");

  function formatDate(d) {
    if (!d) return "--";
    return format(new Date(d), isToday(new Date(d)) ? "HH:mm" : "MM/dd HH:mm");
  }
</script>

<section class="relative text-sm flex flex-col max-w-4xl mx-auto mt-12">
  <h2 class="font-bold text-lg mt-6 text-left w-full tracking-wide">
    {$_("資本政策シミュレーター")}
  </h2>
  <ul
    class="max-w-5xl w-full mx-auto relative grid grid-cols-4 grid-auto-rows gap-4 mt-12"
  >
    <li
      class="relative bg-gray-200 dark:bg-gray-900 cursor-pointer w-full p-3 font-mono rounded hover:ring-2 ring-1 transition duration-150 ring-gray-200 shadow hover:shadow-lg flex flex-col justify-between"
      on:click={createDocument}
    >
      <div class="flex items-center justify-center flex-col h-full text-5xl">
        <span>+</span>
        <span class="text-xs mt-4">{$_("新しいテーブル")}</span>
      </div>
    </li>
    {#each $documentIds as [id, title, lastViewed]}
      <li
        class="relative bg-gray-200 dark:bg-gray-900 cursor-pointer w-full p-3 font-mono rounded hover:ring-2 ring-1 transition duration-150 ring-gray-200 shadow hover:shadow-lg flex flex-col justify-between"
        on:click={() =>
          window.ellx.router.go(`/docs/${$userId}/${$appId}/${id}`)}
      >
        <div
          on:click|preventDefault|stopPropagation={setEditing}
          class="flex flex-row justify-between items-center relative"
        >
          <Cell
            class="text-left text-sm font-medium"
            on:change={({ detail }) => renameDocument({ id, detail })}
            value={title}
          />
          <Icon
            absolute={false}
            on:click={(e) => openContextMenu(getCommonMenuItems(id), e)}
            wrapperClasses="ml-3 h-full flex items-center"
          />
        </div>
        <ThumbnailChart {id} />
        <div class="text-xs">
          {$_("最終閲覧")}
          {formatDate(lastViewed)}
        </div>
      </li>
    {/each}
  </ul>
</section>

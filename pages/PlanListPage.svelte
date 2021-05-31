<script>
  import Cell, { setEditing } from "/components/sheet/Cell.svelte";
  import _ from "/utils/intl.js";
  import {
    renamePlan,
    createPlan,
    removePlan,
  } from "/utils/actions/plans.js";
  import { formatDate } from "/utils/index.js";
  import exportExcel from "/utils/excel.js";

  const { userId, itemIds } = require("/index.ellx");
</script>

<section class="relative text-sm flex flex-col max-w-5xl mx-auto mt-12">
  <div class="flex justify-start items-center space-x-6">
    <h2 class="font-bold text-lg mt-6 text-left tracking-wide">
      {$_("事業計画")}
    </h2>
    <button on:click={createPlan} class="button text-xs">
      {$_("新規計画を作成")}
    </button>
  </div>

  <ul
    class="w-full mx-auto relative grid grid-cols-4 grid-auto-rows gap-8 mt-12"
  >
    {#each $itemIds as [id, title, lastViewed]}
      <li
        class="relative bg-white dark:bg-gray-700 cursor-pointer w-full p-3 rounded-xl hover:ring-2 ring-1 transition duration-150 ring-gray-200 shadow-lg hover:shadow-xl flex flex-col space-y-6 justify-between"
        on:click={() => window.ellx.router.go(`/plans/${$userId}/${id}`)}
      >
        <div on:click|preventDefault|stopPropagation={setEditing}>
          <Cell
            class="text-left text-sm font-medium"
            on:change={({ detail }) => renamePlan({ id, detail })}
            value={title}
          />
        </div>
        <div class="text-xs flex justify-between items-center">
          <button
            on:click|stopPropagation={() => exportExcel(id)}
            class="flex items-center transition duration-200 hover:text-green-800"
          >
            <div
              class="text-xs h-5 w-5 flex items-center justify-center rounded-full ring-0 p-1 cursor-pointer  dark:ring-green-100 ring-green-600 hover:text-green-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 11h5l-9 10-9-10h5v-11h8v11zm3 8v3h-14v-3h-2v5h18v-5h-2z"
                />
              </svg>
            </div>
            <div>Excel</div>
          </button>

          <button
            class="text-xs h-5 w-5 flex items-center justify-center rounded-full ring-0 p-1 hover:ring-2 cursor-pointer  dark:ring-red-100 ring-red-600 hover:text-red-600 transition duration-200"
            on:click|stopPropagation={() => removePlan({ id })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 6l-3 18h-12l-3-18h2.028l2.666 16h8.611l2.666-16h2.029zm-4.711-4c-.9 0-1.631-1.099-1.631-2h-5.316c0 .901-.73 2-1.631 2h-5.711v2h20v-2h-5.711z"
              />
            </svg>
          </button>
        </div>
        <span class="opacity-50 text-xs">
          {$_("最終閲覧")}
          {formatDate(lastViewed)}
        </span>
      </li>
    {/each}
  </ul>
</section>

<script>
  import _ from "/utils/intl.js";
  const { isAuthenticated } = require("/index.ellx");

  isAuthenticated.subscribe((value) => {
    if (value === false) {
      window.ellx.router.go("/");
    }
  });
</script>

<main
  class="relative block text-sm flex items-center justify-center max-w-5xl mx-auto pt-12 flex flex-col min-h-screen"
>
  <div
    class="mb-8 border border-gray-400 shadow-lg dark:border-gray-200 p-4 rounded w-full flex justify-between items-center"
  >
    <span>山田太郎様 はじめまして</span>
    <div class="flex flex-row items-center justify-center space-x-4">
      <a
        href="/tutorial"
        class="rounded-xl p-2 bg-light-blue-700 text-xs text-white hover:bg-light-blue-500 transition duration-100"
      >
        {$_("チュートリアルはここから")}
      </a>
      <!-- what is this anyway? -->
      <span class="text-lg cursor-pointer">×</span>
    </div>
  </div>

  <div class="flex-grow" />

  <div class="mb-8 w-full">
    <h2 class="text-lg font-bold mb-2">{$_("株価算定までの3ステップ")}</h2>
    <div>{$_("基本的な流れと、いかに簡単にできるかなどの説明")}</div>
  </div>

  <div
    class="w-full mx-auto relative grid grid-cols-3 grid-auto-rows gap-4 mb-8 flex-1"
  >
    <a
      href="/docs"
      class="relative cursor-pointer shadow-lg h-64 w-full p-3 font-mono rounded hover:ring-2 ring-1 transition duration-150 ring-gray-400 dark:ring-gray-200 flex flex-col justify-between items-center"
    >
      <h3 class="font-medium mb-4">{$_("資本政策")}</h3>
      <div class="px-4">
        {$_("なんのためのツールで 何ができるかグラフで視覚化できることも")}
      </div>
      <button class="button">{$_("ツールを開く")}</button>
    </a>
    <a
      href="/docs"
      class="relative cursor-pointer shadow-lg h-64 w-full p-3 font-mono rounded hover:ring-2 ring-1 transition duration-150 ring-gray-400 dark:ring-gray-200 flex flex-col justify-between items-center"
    >
      <h3 class="font-medium mb-4">{$_("事業計画")}</h3>
      <div class="px-4">{$_("なんのためのツールで何ができるか")}</div>
      <button class="button">{$_("ツールを開く")}</button>
    </a>
    <a
      href="/docs"
      class="relative cursor-pointer shadow-lg h-64 w-full p-3 font-mono rounded hover:ring-2 ring-1 transition duration-150 ring-gray-400 dark:ring-gray-200 flex flex-col justify-between items-center"
    >
      <h3 class="font-medium mb-4">{$_("株価算定")}</h3>
      <div class="px-4">{$_("なんのためのツールで 何ができるか")}</div>
      <button class="button">{$_("ツールを開く")}</button>
    </a>
  </div>
</main>

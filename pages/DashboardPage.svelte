<script context="module">
  import { writable } from "svelte/store";

  const showWelcome = writable(true);
</script>

<script>
  import LogoDash from "/icons/logo-dash.svelte";
  import { fly } from "svelte/transition";
  import _ from "/utils/intl.js";
  import Step from "/components/ui/Step.svelte";
  import { updateProfile } from "/models/profile.js";
  import Step1 from "/icons/step1.svelte";
  import Step2 from "/icons/step2.svelte";
  import Step3 from "/icons/step3.svelte";

  const { isAuthenticated, profile } = require("/index.ellx");

  isAuthenticated.subscribe((value) => {
    if (value === false) {
      window.ellx.router.go("/");
    }
  });

  let shouldHideWelcome = false;

  function closeWelcome() {
    showWelcome.set(false);
    if (shouldHideWelcome) {
      updateProfile({ hideWelcome: true });
    }
  }
</script>

<main
  class="relative block text-sm flex max-w-5xl mx-auto pt-12 flex flex-col px-4 min-h-screen mt-12"
>
  {#if ($profile && $profile.loaded && !("hideWelcome" in $profile) && $showWelcome)}
    <div
      out:fly|local
      class="mb-8 border border-gray-400 shadow-lg dark:border-gray-200 p-8 rounded-xl w-full flex flex-col justify-between space-x-4 items-center bg-white dark:bg-gray-700"
    >
      <LogoDash class="max-w-sm mx-auto px-8 my-10" />
      <p class="mb-2">登録いただきありがとうございます。</p>
      <p class="max-w-xl">
        初めてご利用いただく方や、途中で疑問を持たれた方のために「ご利用ガイド」をご用意しました。
        下のボタン、または画面右上の？マークからご確認ください。
      </p>
      <a class="button mx-auto my-8" href="/tutorial">ご利用ガイドを開く</a>
      <div class="text-xs opacity-75 mt-12 w-full flex justify-end space-x-3">
        <label class="flex items-center space-x-1">
          <input type="checkbox" bind:checked={shouldHideWelcome} />
          <span>今後このメッセージを表示しない</span>
        </label>
        <button on:click={closeWelcome} class="underline">閉じる</button>
      </div>
    </div>
  {/if}

  <div class="my-12 w-full">
    <h2 class="text-lg font-bold mb-6">{$_("株価算定までの3ステップ")}</h2>
    <div>
      {$_(
        "説得力のある株価算定をスムーズに行うためには、基本的に３つのツールを順番にご利用いただきます。"
      )}
    </div>
  </div>

  <div
    class="w-full mx-auto relative grid grid-cols-3 grid-auto-rows gap-6 mb-8 text-sm"
  >
    <a
      href="/docs"
      class="relative cursor-pointer shadow-lg h-full py-8 px-4 rounded-xl hover:ring-2 ring-1 transition duration-150 ring-gray-400 dark:ring-gray-200 flex flex-col justify-between items-center bg-white dark:bg-gray-700"
    >
      <Step />
      <h3 class="font-bold text-lg mb-4">{$_("資本政策")}</h3>
      <div class="flex-1 w-24 mb-4"><Step1 /></div>
      <div class="px-4 space-y-4">
        <p>
          「資本政策」では、EXCELより簡単かつ高速に資本政策表を作成できます。
        </p>
        <p>創業者持分やValuationの推移をチャート機能でわかりやすく可視化。</p>
        <p>「資本政策表」データを株価算定で参照します。</p>
      </div>
      <button class="button">{$_("資本政策を開く")}</button>
    </a>
    <a
      href="/plans"
      class="relative cursor-pointer shadow-lg h-full py-8 px-4 rounded-xl hover:ring-2 ring-1 transition duration-150 ring-gray-400 dark:ring-gray-200 flex flex-col justify-between items-center bg-white dark:bg-gray-700"
    >
      <Step n="2" />
      <h3 class="font-bold text-lg mb-4">{$_("事業計画")}</h3>
      <div class="flex-1 w-24 mb-4"><Step2 /></div>
      <div class="px-4 space-y-4">
        <p>
          「事業計画」では作成した「資本政策表」に整合的な事業計画数値を入力してください。
        </p>
        <p>
          「事業計画」で算出した「当期利益」の数値を「株価算定」で参照します。
        </p>
      </div>
      <button class="button">{$_("事業計画を開く")}</button>
    </a>
    <a
      href="/scenarios"
      class="relative cursor-pointer shadow-lg h-full py-8 px-4 rounded-xl hover:ring-2 ring-1 transition duration-150 ring-gray-400 dark:ring-gray-200 flex flex-col justify-between items-center bg-white dark:bg-gray-700"
    >
      <Step n="3" />
      <h3 class="font-bold text-lg mb-4">{$_("株価算定")}</h3>
      <div class="flex-1 w-24 mb-4"><Step3 /></div>
      <div class="px-4 space-y-4">
        <p>
          策定した資本政策表と事業計画、類似企業のPER等を参考にして、自社の現在の株価理論値を算出します。
        </p>
        <p>
          上場時の基準利益や、事業ステージごとの割引率が株価にも影響します。​
        </p>
      </div>
      <button class="button">{$_("株価算定を開く")}</button>
    </a>
  </div>
</main>

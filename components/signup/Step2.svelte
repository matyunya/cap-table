<script>
  import Fields from "/components/signup/Fields.svelte";
  import _ from "/utils/intl.js";
  export let onSave = () => {};
  export let data;
  export let errors;

  let scoops = 0;

  const fields = {
    companyName: {
      placeholder: "会社名",
      label: "会社名",
    },
    fiscalYearEndMonth: {
      placeholder: "",
      label: "決算を終えたのはいつですか",
      type: "month",
    },
  };
</script>

<form class="flex-auto dark:text-white">
  <h2 class="font-bold text-lg mt-6 text-center w-full">会社情報</h2>
  <Fields bind:data bind:errors {fields} />

  <label for="j" class="block uppercase font-bold flex-1 mt-4 mb-2 text-xs">
    {$_("直近決算")}
  </label>
  <div class="flex flex-row items-center max-w-xs text-xs">
    <label for="no">
      {$_("終わっていない")}
    </label>
    <input
      class="ml-1 mr-4"
      id="no"
      type="radio"
      bind:group={scoops}
      value={1}
    />

    <label for="yes">
      {$_("終わっている")}
    </label>
    <input class="ml-1" id="yes" type="radio" bind:group={scoops} value={2} />
  </div>

  <span class="block uppercase text-xs font-bold mb-2 mt-8">
    {$_("従業員数")}
  </span>
  <div class="w-48">
    <div class="flex flex-row items-center text-xs mb-2">
      <label for="j" class="block uppercase font-bold flex-1">
        {$_("正社員")}
      </label>
      <input
        class="focus:ring-2 transition duration-200 w-16 p-1 mx-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded text-sm shadow focus:outline-none focus:shadow-outline"
        id="j"
        type="number"
      />
      <span>人</span>
    </div>
    <div class="flex flex-row items-center text-xs">
      <label for="n" class="block uppercase font-bold flex-1">
        {$_("業務委託")}
      </label>
      <input
        class="focus:ring-2 transition duration-200 w-16 p-1 mx-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded text-sm shadow focus:outline-none focus:shadow-outline"
        id="n"
        type="number"
      /><span>人</span>
    </div>
  </div>

  <div class="text-center mt-6">
    <button
      on:click={() => onSave(data)}
      class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_("登録する")}
    </button>
  </div>
</form>

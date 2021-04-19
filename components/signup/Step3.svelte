<script>
  import Fields from "/components/signup/Fields.svelte";
  import Select from "/components/ui/Select.svelte";
  import _ from "/utils/intl.js";
  import route from "/utils/router.js";

  export let onSave = () => {};
  export let data;
  export let errors;

  const fields = {
    companyName: {
      placeholder: "例）20",
      label: "いくら資金調達が必要ですか？",
      required: false,
    },
    fiscalYearEndMonth: {
      label: "いつまでに必要ですか？",
      required: false,
      type: "date",
    },
  };

  let investors = [];

  const intestorTypes = [
    "VC",
    "事業会社",
    "エンジェル",
    "知人",
    "EGF",
    "その他",
  ];
</script>

<form class="flex-auto dark:text-white">
  <h2 class="font-bold text-lg mt-6 text-center w-full">資金調達計画</h2>
  <Fields bind:data bind:errors {fields} />

  <label for="j" class="block uppercase font-bold flex-1 mt-4 mb-2 text-xs">
    {$_("どんな投資家から調達予定ですか？")}
  </label>
  <div
    class="flex flex-row items-center justify-between max-w-xs text-xs flex-wrap"
  >
    {#each intestorTypes as type}
    <div class="w-1/2 flex items-center mb-2">
      <input
        bind:group={investors}
        class="mr-3 text-blue-500 transition duration-100 ease-in-out border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-light-blue-500 focus:ring-opacity-50 focus:ring-offset-0"
        id={type}
        type="checkbox"
        value={type}
      />
      <label for={type}>
        {$_(type)}
      </label>
    </div>
    {/each}
  </div>

  <Select
    options={[
      ["10", "1~10人"],
      ["50", "11~50人"],
      ["100", "51~100人"],
      ["300", "101~300人"],
      ["1000", "301~1000人"],
      ["5000", "1000人以上"],
    ]}
    value={data.numberOfEmployees}
    error={errors.numberOfEmployees}
    placeholder={$_("資金使途のうち、一番大きいものを1つ選択してください。")}
    label={$_("資金使途のうち、一番大きいものを1つ選択してください。")}
    id="number-of-employees"
    type="number"
  />
  <Select
    options={[
      ["10", "1~10人"],
      ["50", "11~50人"],
      ["100", "51~100人"],
      ["300", "101~300人"],
      ["1000", "301~1000人"],
      ["5000", "1000人以上"],
    ]}
    value={data.numberOfEmployees}
    error={errors.numberOfEmployees}
    placeholder={$_("事業ステージについて教えてください")}
    label={$_("事業ステージについて教えてください")}
    id="number-of-employees"
    type="number"
  />
  <Select
    options={[
      ["10", "1~10人"],
      ["50", "11~50人"],
      ["100", "51~100人"],
      ["300", "101~300人"],
      ["1000", "301~1000人"],
      ["5000", "1000人以上"],
    ]}
    value={data.numberOfEmployees}
    error={errors.numberOfEmployees}
    placeholder={$_("資金調達状況について教えてください")}
    label={$_("資金調達状況について教えてください")}
    id="number-of-employees"
    type="number"
  />

  <div class="text-center mt-10">
    <button
      on:click={() => onSave(data)}
      class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_("登録して始める​")}
    </button>
    <button
      on:click={() => $route = ""}
      class="mt-4 bg-gray-900 dark:bg-blue-gray-700 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_("スキップする")}
    </button>
  </div>
</form>

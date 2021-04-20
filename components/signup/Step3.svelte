<script>
  import Fields from "/components/signup/Fields.svelte";
  import _ from "/utils/intl.js";
  import route from "/utils/router.js";
  import { updateProfile } from "/models/profile.js";
  import { validate, scrollToError } from "/utils/forms.js";

  export let onSave = () => {};

  let data = {
    projectedInvestmentTypes: [],
  };
  let errors = {};

  const investorTypes = [
    "VC",
    "事業会社",
    "エンジェル",
    "知人",
    "EGF",
    "その他",
  ];

  const usesOfInvestedMoney = [
    "研究開発",
    "プロダクト開発",
    "人材採用教育",
    "マーケティング",
    "その他",
  ];

  const stages = [
    "創業前",
    "プレシード",
    "シード",
    "シリーズA",
    "シリーズB以降",
  ];

  const conditions = [
    "アイデア・構想段階",
    "資金調達計画の策定中",
    "資金調達活動中",
    "投資家からオファー受領済",
  ];

  const fields = {
    projectedInvestmentAmount: {
      placeholder: "例）20",
      label: "いくら資金調達が必要ですか？",
    },
    projectedInvestmentDate: {
      label: "いつまでに必要ですか？",
      type: "date",
    },
    projectedInvestmentTypes: {
      label: "どんな投資家から調達予定ですか？",
      type: "checkbox",
      options: investorTypes,
    },
    biggestUseOfInvestedMoney: {
      label: "資金使途のうち、一番大きいものを1つ選択してください。",
      type: "select",
      options: usesOfInvestedMoney.map(i => [i, i]),
    },
    currentStage: {
      label: "事業ステージについて教えてください",
      type: "select",
      options: stages.map(i => [i, i]),
    },
    investmentConditions: {
      label: "資金調達状況について教えてください",
      type: "select",
      options: conditions.map(i => [i, i]),
    },
  };

  function onSubmit() {
    [ok, errors] = validate(data, fields);
    if (ok) {
      updateProfile(data);
      onSave();
    } else {
      scrollToError();
    }
  }
</script>

<form class="flex-auto dark:text-white">
  <h2 class="font-bold text-lg mt-6 text-center w-full">資金調達計画</h2>
  <Fields bind:data bind:errors {fields} />

  <div class="text-center mt-10">
    <button
      on:click={onSubmit}
      class="bg-gray-900 dark:bg-blue-gray-500 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_("登録して始める​")}
    </button>
    <button
      on:click={() => ($route = "")}
      class="mt-4 bg-gray-900 dark:bg-blue-gray-700 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_("スキップする")}
    </button>
  </div>
</form>

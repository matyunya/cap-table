<script context="module">
  const investorTypes = [
    "VC",
    "事業会社",
    "エンジェル",
    "知人",
    "株式型クラウドファンディング",
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

  const fmt = new Intl.NumberFormat("en-US");

  export const fields = {
    projectedInvestmentAmount: {
      placeholder: "例）20",
      label: "調達予定金額",
      transform: (i) => (i ? fmt.format(i.replace(/\D/g, "")) : i),
    },
    projectedInvestmentDate: {
      label: "資金調達の目標時期",
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
      options: usesOfInvestedMoney.map((i) => [i, i]),
    },
    currentStage: {
      label: "事業ステージについて教えてください",
      type: "select",
      options: stages.map((i) => [i, i]),
    },
    investmentConditions: {
      label: "資金調達状況について教えてください",
      type: "select",
      options: conditions.map((i) => [i, i]),
    },
  };
</script>

<script>
  import Fields from "/components/signup/Fields.svelte";
  import _ from "/utils/intl.js";
  import { updateProfile } from "/models/profile.js";
  import { validate, scrollToError } from "/utils/forms.js";

  export let onSave = () => {};
  export let loading;

  export let data = {
    projectedInvestmentTypes: [],
  };
  let errors = {};

  async function onSubmit() {
    try {
      loading = true;
      [ok, errors] = validate(data, fields);
      if (ok) {
        updateProfile(data);
        onSave();
      } else {
        scrollToError();
      }
    } finally {
      loading = false;
    }
  }
</script>

<form class="flex-auto dark:text-white">
  <h2 class="font-bold text-lg mt-6 text-center w-full tracking-wide">
    {$_("資金調達計画")}
  </h2>
  <Fields bind:data bind:errors {fields} />

  <div class="text-center mt-6 w-full mx-auto">
    <button
      on:click={onSubmit}
      class="button w-full mt-10 mb-6 bg-light-blue-700"
      type="button"
    >
      {$_("登録して始める​")}
    </button>
    <a class="a underline" href="/signup/2">
      {$_("戻る")}
    </a>
  </div>
</form>

<script>
  import { onMount } from "svelte";
  import { fields as userFields } from "/components/signup/Step1.svelte";
  import { fields as companyFields } from "/components/signup/Step2.svelte";
  import { fields as planFields } from "/components/signup/Step3.svelte";
  import Spinner from "/components/ui/Spinner.svelte";
  import _ from "/utils/intl.js";
  import Fields from "/components/signup/Fields.svelte";
  import Wrapper from "/components/signup/Wrapper.svelte";
  import { updateProfile } from "/models/profile.js";
  import { validate, scrollToError } from "/utils/forms.js";
  import NumberOfEmployeesFields from "/components/signup/NumberOfEmployeesFields.svelte";

  const { profile, profileReady } = require("/index.ellx");

  let data = {};

  onMount(() =>
    profileReady.subscribe(
      (v) =>
        v === true &&
        (data = {
          projectedInvestmentTypes: [],
          ...$profile,
        })
    )
  );
  let errors = {};
  let ok = false;

  function onSubmit() {
    [ok, errors] = validate(data, {
      ...userFields,
      ...companyFields,
      ...planFields,
    });
    if (ok) {
      updateProfile(data);
    } else {
      scrollToError();
    }
  }
</script>

<Wrapper title="登録情報確認・変更">
  {#if $profileReady && Array.isArray(data.projectedInvestmentTypes)}
    <h2 class="font-bold text-lg mt-6 text-center w-full tracking-wide">
      {$_("ユーザー情報")}
    </h2>
    <div class="mb-8">
      <Fields bind:data bind:errors fields={userFields} />
    </div>
    <h2 class="font-bold text-lg mt-6 text-center w-full tracking-wide">
      {$_("会社情報")}
    </h2>
    <div class="mb-8">
      <Fields bind:data bind:errors fields={companyFields} />
      <NumberOfEmployeesFields bind:data bind:errors />
    </div>
    <h2 class="font-bold text-lg mt-6 text-center w-full tracking-wide">
      {$_("資金調達計画")}
    </h2>
    <div class="mb-8">
      <Fields bind:data bind:errors fields={planFields} />
    </div>
    <button on:click={onSubmit} class="button w-full">{$_("保存する")}</button>
  {:else}
    <div class="flex w-full h-full items-center justify-center">
      <Spinner />
    </div>
  {/if}
</Wrapper>

<script>
  import _ from "/utils/intl.js";
  import Select from "/components/ui/Select.svelte";
  import Label from "/components/ui/Label.svelte";
  import Input from "/components/ui/Input.svelte";
  import Wrapper from "/components/signup/Wrapper.svelte";
  import { addFeedback } from "/models/feedback.js";

  let subject = "",
    body = "",
    other = "";

  const options = [
    "プロダクトの不具合",
    "資金調達のご相談",
    "その他",
  ].map((i) => [i, i]);

  function onSubmit() {
    addFeedback({ subject, body, other });
  }
</script>

<Wrapper title="お問い合わせ">
  <div class="mb-8">
    {$_(
      "弊社サービスにご興味をお持ちいただきまして、ありがとうございます。以下よりお問い合わせください。"
    )}
  </div>
  <Select
    label="お問い合わせ内容"
    on:change={({ target }) => (subject = target.value)}
    {options}
  />
  {#if subject === "その他"}
    <Input
      required={false}
      placeholder="​その他の詳細"
      on:change={({ target }) => (other = target.value)}
    />
  {/if}
  <Label class="mt-8" label="お問い合わせ内容の詳細" />
  <textarea
    placeholder={$_("お問い合わせ内容を入力する")}
    rows="10"
    class="mb-8 focus:ring-2 transition duration-200 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
  />
  <button disabled={!body} on:click={onSubmit} class="button w-full mt-12">
    {$_("送信する")}
  </button>
</Wrapper>

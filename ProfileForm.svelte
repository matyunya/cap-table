<script>
  import Input from "./Input.svelte";
  import Select from "./Select.svelte";
  import { language } from "./store.js";
  import _ from "./intl.js";
  export let onSave = () => {};
  export let onCancel = () => {};
  export let update = field => e => data[field] = e.target.value;
  export let label = "登録する";
  export let data;
  export let errors;
  export let initial = true;
</script>

<form class="flex-auto p-5 lg:p-10">
  <Input
    on:change={update('companyName')}
    value={data.companyName}
    error={errors.companyName}
    placeholder={$_("会社名")}
    label={$_("会社名")}
    id="company-name" />
  <Input
    on:change={update('title')}
    value={data.title}
    error={errors.title}
    placeholder={$_("肩書き")}
    label={$_("肩書き")}
    id="title" />
  <div class="md:flex md:flex-row md:space-x-4">
    <Input
      on:change={update('lastName')}
      value={data.lastName}
      error={errors.lastName}
      placeholder={$_("姓")}
      label={$_("姓")}
      id="last-name" />
    <Input
      on:change={update('firstName')}
      value={data.firstName}
      error={errors.firstName}
      placeholder={$_("名")}
      label={$_("名")}
      id="first-name" />
  </div>
  {#if $language === "ja"}
    <div class="md:flex md:flex-row md:space-x-4">
      <Input
        on:change={update('lastNameKana')}
        value={data.lastNameKana}
        error={errors.lastNameKana}
        placeholder={$_("せい")}
        label={$_("せい")}
        id="last-name-kana" />
      <Input
        on:change={update('firstNameKana')}
        value={data.firstNameKana}
        error={errors.firstNameKana}
        placeholder={$_("めい")}
        label={$_("めい")}
        id="first-name-kana" />
    </div>
  {/if}
  <Input
    on:change={update('zipCode')}
    value={data.zipCode}
    error={errors.zipCode}
    placeholder={$_("郵便番号")}
    label={$_("郵便番号")}
    id="zip-code" />
  <Input
    on:change={update('address')}
    value={data.address}
    error={errors.address}
    placeholder={$_("住所")}
    label={$_("住所")}
    id="address" />
  <Input
    on:change={update('url')}
    value={data.url}
    error={errors.url}
    placeholder={$_("URL")}
    label={$_("URL")}
    id="url" />
  {#if initial}
    <Input
      on:change={update('email')}
      value={data.email}
      error={errors.email}
      placeholder={$_("email")}
      label={$_("email")}
      id="email"
      type="email" />
  {/if}
  <Input
    on:change={update('phone')}
    value={data.phone}
    error={errors.phone}
    placeholder={$_("TEL")}
    label={$_("TEL")}
    id="phone"
    type="tel" />
  {#if language === "ja"}
    <Input
      on:change={update('establishedMonth')}
      value={data.establishedMonth}
      error={errors.establishedMonth}
      placeholder={$_("設立月")}
      label={$_("設立月")}
      id="established-date"
      type="month" />
    <Input
      on:change={update('fiscalYearEndMonth')}
      value={data.fiscalYearEndMonth}
      error={errors.fiscalYearEndMonth}
      placeholder={$_("決算月")}
      label={$_("決算月")}
      id="fiscal-year-end-date"
      type="month" />
    <div class="relative w-full mb-3 mt-8">
      <Select
        on:change={update('numberOfEmployees')}
        options={[["10", "1~10人"], ["50", "11~50人"], ["100", "51~100人"], ["300", "101~300人"], ["1000", "301~1000人"], ["5000", "1000人以上"]]}
        value={data.numberOfEmployees}
        error={errors.numberOfEmployees}
        placeholder={$_("従業員数")}
        label={$_("従業員数")}
        id="number-of-employees"
        type="number" />
    </div>
  {/if}

  <div class="text-center mt-6">
    <button
      on:click={() => onSave(data)}
      class="bg-gray-900 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {$_(label)}
    </button>
    {#if !initial}
      <button
        on:click={onCancel}
        class="bg-gray-500 mt-4 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
      >
        {$_("キャンセル")}
      </button>
    {/if}
  </div>

  <slot />
</form>

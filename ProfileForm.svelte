<script>
  import Input from "./Input.svelte";
  import Select from "./Select.svelte";
  export let onSave = () => {};
  export let update = field => e => data[field] = e.target.value;
  export let label = "登録する";
  export let data;
  export let errors;
</script>

<form class="flex-auto p-5 lg:p-10">
  <Input
    on:change={update('companyName')}
    value={data.companyName}
    error={errors.companyName}
    placeholder="会社名"
    label="会社名"
    id="company-name" />
  <Input
    on:change={update('title')}
    value={data.title}
    error={errors.title}
    placeholder="肩書き"
    label="肩書き"
    id="title" />
  <div class="md:flex md:flex-row md:space-x-4">
    <Input
      on:change={update('lastName')}
      value={data.lastName}
      error={errors.lastName}
      placeholder="姓"
      label="姓"
      id="last-name" />
    <Input
      on:change={update('firstName')}
      value={data.firstName}
      error={errors.firstName}
      placeholder="名"
      label="名"
      id="first-name" />
  </div>
  <div class="md:flex md:flex-row md:space-x-4">
    <Input
      on:change={update('lastNameKana')}
      value={data.lastNameKana}
      error={errors.lastNameKana}
      placeholder="せい"
      label="せい"
      id="last-name-kana" />
    <Input
      on:change={update('firstNameKana')}
      value={data.firstNameKana}
      error={errors.firstNameKana}
      placeholder="めい"
      label="めい"
      id="first-name-kana" />
  </div>
  <Input
    on:change={update('zipCode')}
    value={data.zipCode}
    error={errors.zipCode}
    placeholder="郵便番号"
    label="郵便番号"
    id="zip-code" />
  <Input
    on:change={update('address')}
    value={data.address}
    error={errors.address}
    placeholder="住所"
    label="住所"
    id="address" />
  <Input
    on:change={update('url')}
    value={data.url}
    error={errors.url}
    placeholder="URL"
    label="URL"
    id="url" />
  <Input
    on:change={update('email')}
    value={data.email}
    error={errors.email}
    placeholder="email"
    label="email"
    id="email"
    type="email" />
  <Input
    on:change={update('phone')}
    value={data.phone}
    error={errors.phone}
    placeholder="TEL"
    label="TEL"
    id="phone"
    type="tel" />
  <Input
    on:change={update('establishedMonth')}
    value={data.establishedMonth}
    error={errors.establishedMonth}
    placeholder="設立月"
    label="設立月"
    id="established-date"
    type="month" />
  <Input
    on:change={update('fiscalYearEndMonth')}
    value={data.fiscalYearEndMonth}
    error={errors.fiscalYearEndMonth}
    placeholder="決算月"
    label="決算月"
    id="fiscal-year-end-date"
    type="month" />
  <Select
    on:change={update('numberOfEmployees')}
    options={[["10", "1~10人"], ["50", "11~50人"], ["100", "51~100人"], ["300", "101~300人"], ["1000", "301~1000人"], ["5000", "1000人以上"]]}
    value={data.numberOfEmployees}
    error={errors.numberOfEmployees}
    placeholder="従業員数"
    label="従業員数"
    id="number-of-employees"
    type="number" />

  <div class="text-center mt-6">
    <button
      on:click={() => onSave(data)}
      class="bg-gray-900 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
      type="button"
    >
      {label}
    </button>
  </div>

  <slot />
</form>

<script>
  import { createEventDispatcher } from "svelte";
  import Input from "./Input.svelte";
  import Select from "./Select.svelte";

  const dispatch = createEventDispatcher();

  const defaultState = {
    companyName: "",
    title: "",
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    zipCode: "",
    address: "",
    url: "",
    email: "",
    phone: "",
    establishedMonth: "",
    fiscalYearEndMonth: "",
    numberOfEmployees: "",
  };

  let data = { ...defaultState };

  let errors = { ...defaultState };

  let error = "";

  async function register() {
    try {
      error = false;

      Object.keys(data).forEach(key => {
        if (key === "numberOfEmployees") return;

        errors[key] = !data[key] ? "この項目が必須です。" : false;
      });

      // TODO: submit registration request

      if (!Object.keys(errors).reduce((acc, cur) => acc || Boolean(errors[cur]), false)) {
        dispatch('success');
      }
    } catch (e) {
      error = e;
    }
  }

  const update = field => value => data[field] = value;
</script>

<main>
  <section class="relative block py-24 lg:pt-0">
    <div class="container mx-auto px-4">
      <h1 class="text-center text-6xl pt-8 font-bold tracking-widest uppercase">
        Cap Table
      </h1>
      <div class="text-center mt-8 text-lg">
        資本政策表を失敗せず、簡単に作れる。
      </div>
      <div class="w-full lg:w-6/12 mx-auto my-12 px-4">
        <img class="w-full shadow rounded" loading="lazy" src="https://i.ibb.co/3SZ2QkR/ezgif-com-gif-maker.gif" alt="cap-table" border="0">
      </div>
      <div class="flex flex-wrap align-center justify-center">
        <div class="w-full lg:w-6/12 px-4">
          <div
            class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow rounded bg-gray-300 mt-8 text-gray-800 antialiased bg-gradient-to-r from-blue-gray-100 via-gray-200 to-warm-gray-200"
          >
            <div class="w-full text-center text-lg md:text-2xl text-black mt-12 px-4">
              <b>無料</b>で登録してからすぐ使えます。
            </div>
            <div class="flex-auto p-5 lg:p-10">
              <Input
                on:change={update('companyName')}
                error={errors.companyName}
                placeholder="会社名"
                label="会社名"
                id="company-name" />
              <Input
                on:change={update('title')}
                error={errors.title}
                placeholder="肩書き"
                label="肩書き"
                id="title" />
              <div class="md:flex md:flex-row md:space-x-4">
                <Input
                  on:change={update('lastName')}
                  error={errors.lastName}
                  placeholder="姓"
                  label="姓"
                  id="last-name" />
                <Input
                  on:change={update('firstName')}
                  error={errors.firstName}
                  placeholder="名"
                  label="名"
                  id="first-name" />
              </div>
              <div class="md:flex md:flex-row md:space-x-4">
                <Input
                  on:change={update('lastNameKana')}
                  error={errors.lastNameKana}
                  placeholder="せい"
                  label="せい"
                  id="last-name-kana" />
                <Input
                  on:change={update('firstNameKana')}
                  error={errors.firstNameKana}
                  placeholder="めい"
                  label="めい"
                  id="first-name-kana" />
              </div>
              <Input
                on:change={update('zipCode')}
                error={errors.zipCode}
                placeholder="郵便番号"
                label="郵便番号"
                id="zip-code" />
              <Input
                on:change={update('address')}
                error={errors.address}
                placeholder="住所"
                label="住所"
                id="address" />
              <Input
                on:change={update('url')}
                error={errors.url}
                placeholder="URL"
                label="URL"
                id="url" />
              <Input
                on:change={update('email')}
                error={errors.email}
                placeholder="email"
                label="email"
                id="email"
                type="email" />
              <Input
                on:change={update('phone')}
                error={errors.phone}
                placeholder="TEL"
                label="TEL"
                id="phone"
                type="tel" />
              <Input
                on:change={update('establishedMonth')}
                error={errors.establishedMonth}
                placeholder="設立月"
                label="設立月"
                id="established-date"
                type="month" />
              <Input
                on:change={update('fiscalYearEndMonth')}
                error={errors.fiscalYearEndMonth}
                placeholder="決算月"
                label="決算月"
                id="fiscal-year-end-date"
                type="month" />
              <Select
                on:change={update('numberOfEmployees')}
                options={[["10", "1~10人"], ["50", "11~50人"], ["100", "51~100人"], ["300", "101~300人"], ["1000", "301~1000人"], ["5000", "1000人以上"]]}
                error={errors.numberOfEmployees}
                placeholder="従業員数"
                label="従業員数"
                id="number-of-employees"
                type="number" />

              <div class="text-center mt-6">
                <button
                  on:click={() => register(data)}
                  class="bg-gray-900 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                >
                  登録する
                </button>
              </div>

              {#if error}
                <div class="text-center mt-8 text-lg text-red-500 bg-red-100 bg-opacity-10 rounded-lg p-2">
                  {error}
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

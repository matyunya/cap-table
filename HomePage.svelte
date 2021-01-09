<script>
  import Input from "./Input.svelte";

  export let register = console.log;

  let companyName;
  let title;
  let lastName;
  let firstName;
  let lastNameKana;
  let firstNameKana;
  let zipCode;
  let address;
  let url;
  let email;
  let phone;
  let establishedDate;
  let fiscalYearEndDate;
  let numberOfEmployees;

  $: data = {
    companyName,
    title,
    lastName,
    firstName,
    lastNameKana,
    firstNameKana,
    zipCode,
    address,
    url,
    email,
    phone,
    establishedDate,
    fiscalYearEndDate,
    numberOfEmployees,
  };
</script>

<main>
  <section class="relative block py-24 lg:pt-0">
    <div class="container mx-auto px-4">
      <h1 class="text-center text-6xl pt-8 font-bold tracking-widest uppercase">
        Cap Table
      </h1>
      <div class="text-center mt-8 text-lg">
        資本政策表を失敗せず、簡単に立てられる。
      </div>
      <div class="w-full lg:w-6/12 mx-auto my-12 px-4">
        <img class="w-full shadow rounded" src="https://i.ibb.co/HtGw3hm/cap-table.gif" alt="cap-table" border="0">
      </div>
      <div class="flex flex-wrap align-center justify-center">
        <div class="w-full lg:w-6/12 px-4">
          <div
            class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow rounded bg-gray-300 mt-8 text-gray-800 antialiased bg-gradient-to-r from-blue-gray-100 via-gray-200 to-warm-gray-200"
          >
            <div class="w-full text-center text-2xl text-black mt-12">
              <b>無料</b>で登録してからすぐ使えます。
            </div>
            <div class="flex-auto p-5 lg:p-10">
              <Input bind:value={companyName} placeholder="会社名" label="会社名" id="company-name" />
              <Input bind:value={title} placeholder="肩書き" label="肩書き" id="title" />
              <div class="flex md:flex-row space-x-4">
                <Input bind:value={lastName} placeholder="姓" label="姓" id="last-name" />
                <Input bind:value={firstName} placeholder="名" label="名" id="first-name" />
              </div>
              <div class="flex md:flex-row space-x-4">
                <Input bind:value={lastNameKana} placeholder="せい" label="せい" id="last-name-kana" />
                <Input bind:value={firstNameKana} placeholder="めい" label="めい" id="first-name-kana" />
              </div>
              <Input bind:value={zipCode} placeholder="郵便番号" label="郵便番号" id="zip-code" />
              <Input bind:value={address} placeholder="住所" label="住所" id="address" />
              <Input bind:value={url} placeholder="URL" label="URL" id="url" />
              <Input bind:value={email} placeholder="email" label="email" id="email" type="email" />
              <Input bind:value={phone} placeholder="TEL" label="TEL" id="phone" type="phone" />
              <Input bind:value={establishedDate} placeholder="設立月" label="設立月" id="established-date" type="date" />
              <Input bind:value={fiscalYearEndDate} placeholder="決算月" label="決算月" id="fiscal-year-end-date" type="date" />
              <Input bind:value={numberOfEmployees} placeholder="従業員数" label="従業員数" id="number-of-employees" type="number" />

              <div class="text-center mt-6">
                <button
                  on:click={() => register(data)}
                  class="bg-gray-900 tracking-widest transition duration-300 font-bold w-full text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                >
                  登録する
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

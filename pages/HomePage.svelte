<script>
  import { onMount } from "svelte";
  import _ from "/utils/intl.js";
  import Step from "/components/ui/Step.svelte";
  import Step1 from "/icons/step1.svelte";
  import Step2 from "/icons/step2.svelte";
  import Step3 from "/icons/step3.svelte";
  import Free from "/icons/free.svelte";
  import Edge from "/icons/edge.svelte";
  import LogoDrive from "/icons/logo.svelte";
  import LogoDash from "/icons/logo-dash.svelte";
  import Chrome from "/icons/chrome.svelte";
  import Firefox from "/icons/firefox.svelte";
  import Ie from "/icons/ie.svelte";
  import Excel from "/icons/excel.svelte";
  import Lock from "/icons/lock.svelte";
  import Opera from "/icons/opera.svelte";
  import Safari from "/icons/safari.svelte";
  import Time from "/icons/time.svelte";

  const { isAuthenticated, route } = require("/index.ellx");

  onMount(() =>
    isAuthenticated.subscribe(
      (v) =>
        v === true &&
        route.get() !== "/signup/2" &&
        window.ellx.router.go("/dashboard")
    )
  );
</script>

<main>
  <section class="px-4 lg:pt-0 mt-24 max-w-5xl mx-auto">
    <div class="grid grid-cols-7 gap-6">
      <div class="flex flex-col col-span-4 space-y-2 items-center">
        <div class="text-base">スタートアップ起業家向け 資金調達支援ツール</div>
        <LogoDash class="max-w-sm mx-auto" />
        <div class="font-bold text-lg">
          資本政策表の作成と株価算定を高速で簡単に
        </div>
        <a
          class="button mt-8 mb-2 w-full text-xl bg-light-blue-600 hover:bg-light-blue-500 ring-0 hover:ring-4"
          href="/signup"
        >
          {$_("会員登録して利用する")}
        </a>
        <div class="text-xs opacity-75">会員登録したらすぐにご利用可能です</div>
      </div>
      <img
        class="w-full shadow-lg rounded-xl col-span-3 flex items-center justify-center"
        loading="lazy"
        src="https://i.ibb.co/3SZ2QkR/ezgif-com-gif-maker.gif"
        alt="cap-table"
        border="0"
      />
    </div>
  </section>

  <div
    class="bg-gradient-to-l from-warm-gray-200 dark:from-gray-900 via-gray-200 dark:via-gray-800 to-blue-gray-200 dark:to-warm-gray-800 p-8 mt-12 w-full shadow-lg"
  >
    <section class="flex flex-col items-center space-y-6 max-w-xl mx-auto">
      <h2 class="font-bold text-2xl mb-6">
        資金調達支援ツール capital dashとは？
      </h2>
      <p>
        資金調達に必要な準備である<em>資本政策表の作成</em>と<em>
          株価算定
        </em>が３ステップで簡単にできます。
      </p>
      <p>
        <em>
          スタートアップ投資家の株価算定ロジックが実装されており、起業家が高速かつミスなく、自社の株価理論値
        </em>を算定することが可能です。
      </p>
      <p>
        スタートタップ起業家の方など、投資家に会う前に説得力のあるロジック構築にお役立てください。
      </p>
    </section>
  </div>

  <section
    class="px-4 mt-12 max-w-5xl mx-auto flex flex-col items-center space-y-4"
  >
    <div
      class="w-full mx-auto relative grid grid-cols-3 grid-auto-rows gap-6 mb-8 text-xs"
    >
      <div
        class="relative shadow-lg h-full py-8 px-4 rounded-xl flex flex-col justify-between items-center bg-white dark:bg-gray-700"
      >
        <Step />
        <h3 class="font-bold text-lg mb-4">{$_("資本政策表の作成")}</h3>
        <div class="w-24 mb-4"><Step1 /></div>
        <h4 class="font-bold mb-4 mt-2">作成ツールの便利な機能</h4>
        <div class="flex-1 flex flex-col justify-between px-4 space-y-1">
          <div class="flex flex-col">
            <h5 class="mt-2 font-bold">さようなら、計算ミス</h5>
            <p>
              資本政策に特化したアプリだから、投資家を追加したり、ラウンドの追加、削除も簡単！しかも数式崩れしません。複雑なJ-kissの株式数計算や株式分割も楽々。
            </p>
          </div>
          <div class="flex flex-col">
            <h5 class="mt-2 font-bold">チャート表示</h5>
            <p>
              創業者持分やValuationの推移を可視化でき、資本政策の問題点をわかりやすく表示します。
            </p>
          </div>
          <div class="flex flex-col">
            <h5 class="mt-2 font-bold">Excelで共有可能</h5>
            <p>
              本ツールで作成した「資本政策表」はExcelフォーマットでダウンロードできます。
            </p>
          </div>
          <div class="flex flex-col">
            <h5 class="mt-2 font-bold">Excelのような操作性</h5>
            <p>
              使い慣れたExcelのように数値入力ができ、演算も高速です。資本政策表を作成、修正する時間を圧倒的に短縮できます。
            </p>
          </div>
        </div>
      </div>
      <div
        class="relative shadow-lg h-full py-8 px-4 rounded-xl flex flex-col justify-between items-center bg-white dark:bg-gray-700"
      >
        <Step n="2" />
        <h3 class="font-bold text-lg mb-4">{$_("事業計画の作成")}</h3>
        <div class="w-24 mb-4"><Step2 /></div>
        <h4 class="font-bold mb-4 mt-2">作成ツールの便利な機能</h4>
        <div class="flex-1 flex flex-col justify-between px-4 space-y-1">
          <div class="flex flex-col">
            <h5 class="mt-2 font-bold">株価算定ツールとのデータ連携</h5>
            <p>
              「事業計画」で算出したデータが自動的に株価算定で参照されます。株価を引き上げたい時、事業計画を修正して、その関係性をインタラクティブに理解できます。
            </p>
          </div>
          <div class="flex flex-col">
            <h5 class="mt-2 font-bold">
              資本政策との整合性チェック（実装予定）
            </h5>
            <p>
              「事業計画」に基づいた、資本政策表での資金調達計画と整合的になっているか、自動的にシステムが検証します。
            </p>
          </div>
          <div class="flex flex-col">
            <h5 class="mt-2 font-bold">Excelのような操作性</h5>
            <p>
              使い慣れたExcelのように簡単に数値入力ができ、演算も高速です。事業計画を見直して数値を入れ替えするのもストレスありません。
            </p>
          </div>
        </div>
      </div>
      <div
        class="relative shadow-lg h-full py-8 px-4 rounded-xl flex flex-col justify-between items-center bg-white dark:bg-gray-700"
      >
        <Step n="3" />
        <h3 class="font-bold text-lg mb-4">{$_("株価算定")}</h3>
        <div class="w-24 mb-4"><Step3 /></div>
        <h4 class="font-bold mb-4 mt-2">算定ツールの便利な機能</h4>
        <div class="flex-1 flex flex-col justify-between px-4 space-y-1">
          <div class="flex flex-col">
            <h5 class="mt-2 font-bold">VCや投資家の株価算定ロジックを実装</h5>
            <p>
              スタートアップ投資の一般的な株価算定ロジックを実装しているので、投資家との面談前に、株価算定ロジックを起業家自らがチェック可能です。
            </p>
          </div>
          <div class="flex flex-col">
            <h5 class="mt-2 font-bold">自動でデータ参照</h5>
            <p>
              「資本政策表」「事業計画」で算出したデータが自動的に株価算定に参照されるので、自社の資本政策、事業計画数値にもとづいた株価算定が簡単にできます。
            </p>
          </div>
          <div class="flex flex-col">
            <h5 class="mt-2 font-bold">Excelのような操作性</h5>
            <p>使い慣れたExcelのように簡単に数値入力ができ、演算も高速です。</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="px-4 mt-16 max-w-5xl mx-auto">
    <h2 class="font-bold w-full text-center mb-12 text-3xl">
      capital dashが選ばれる理由
    </h2>

    <div class="grid grid-cols-4 gap-4">
      <div
        class="space-y-2 flex flex-col items-center px-4 py-8 rounded-xl bg-white dark:bg-gray-700 shadow-lg"
      >
        <div class="h-16 w-16">
          <Free />
        </div>
        <h5 class="font-bold mt-8 mb-2">完全無料</h5>
        <p>
          本ツールは、起業家の方は、無料で全ての機能がご利用可能です。会員登録ですぐにご利用になれます。
        </p>
        <p>
          投資家の方でご利用になりたい方はお問い合わせフォームから相談ください。
        </p>
      </div>
      <div
        class="space-y-2 flex flex-col items-center px-4 py-8 rounded-xl bg-white dark:bg-gray-700 shadow-lg"
      >
        <div class="h-16 w-16">
          <Excel />
        </div>
        <h5 class="font-bold mt-8 mb-2">直感的な操作性</h5>
        <p>使い慣れたExcelのように簡単に数値入力ができ、演算も高速です。</p>
        <p>創業者持分の維持についてもチャートで直感的に理解可能です。</p>
      </div>
      <div
        class="space-y-2 flex flex-col items-center px-4 py-8 rounded-xl bg-white dark:bg-gray-700 shadow-lg"
      >
        <div class="h-16 w-16">
          <Time />
        </div>
        <h5 class="font-bold mt-8 mb-2">時間短縮</h5>
        <p>
          資金調達前準備にかかる時間を大幅に短縮できます。よくある、資本政策表の計算間違いも防止できるので、無駄な時間を削減できます。
        </p>
      </div>
      <div
        class="space-y-2 flex flex-col items-center px-4 py-8 rounded-xl bg-white dark:bg-gray-700 shadow-lg"
      >
        <div class="h-16 w-16">
          <Lock />
        </div>
        <h5 class="font-bold mt-8 mb-2">安心のセキュリティ</h5>
        <p>
          Firebaseベースのサーバレス構成を採用しており、高い可用性・耐障害性を持っています。また、capital
          dashとの通信は全てSSL/TLSによって暗号化されています。
        </p>
      </div>
    </div>
  </section>

  <section
    class="p-4 mt-16 max-w-5xl mx-auto flex justify-between flex-row items-center rounded-xl shadow-lg bg-white dark:bg-gray-800"
  >
    <div class="font-bold text-xs">推奨ブラウザ</div>
    <div class="flex space-x-2 items-center p-4">
      <Chrome class="w-12 h-12 p-1" />
      Chrome<br />
      73+
    </div>
    <div class="flex space-x-2 items-center p-4">
      <Firefox class="w-12 h-12 p-1" />
      Firefox<br />
      63+
    </div>
    <div class="flex space-x-2 items-center p-4">
      <Edge class="w-12 h-12 p-1" />
      Edge<br />
      79+
    </div>
    <div class="flex space-x-2 items-center p-4">
      <Safari class="w-12 h-12 p-1" />
      Safari<br />
      12.1+
    </div>
    <div class="flex space-x-2 items-center p-4">
      <Opera class="w-12 h-12 p-1" />
      Opera<br />
      60+
    </div>
    <div class="flex space-x-2 items-center p-4 opacity-25">
      <Ie class="w-12 h-12 p-1" />
      IE<br />
      サポートなし
    </div>
  </section>

  <section class="px-4 mt-16 max-w-5xl mx-auto flex flex-col items-center">
    <h2 class="font-bold w-full text-center mb-12 text-3xl">
      スタートアップ起業家向け 資金調達支援ツール
    </h2>
    <a
      class="button mt-8 mb-6 w-full mx-auto max-w-xl text-xl bg-light-blue-600 hover:bg-light-blue-500 ring-0 hover:ring-4"
      href="/signup"
    >
      {$_("会員登録して利用する")}
    </a>
    <div class="text-xs opacity-75">会員登録したらすぐにご利用可能です</div>
  </section>

  <footer class="px-4 mt-16 opacity-75 max-w-5xl mx-auto text-xs text-center">
    <hr />
    <a href="https://cap-drive.jp/">
      <LogoDrive class="w-48 mx-auto pt-12 mb-4" />
    </a>
    <div class="pb-12">©Capital Dash All Rights Reserved.</div>
  </footer>
</main>

<style>
  em {
    font-weight: bold;
  }
</style>

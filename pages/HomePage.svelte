<script>
  import { onMount } from "svelte";
  import _ from "/utils/intl.js";
  import Step from "/components/ui/Step.svelte";

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
  <section class="lg:pt-0 mt-24 max-w-5xl mx-auto">
    <div class="grid grid-cols-3 gap-6">
      <div class="flex flex-col space-y-2 items-center">
        <div class="text-xs">スタートアップ起業家向け 資金調達支援ツール</div>
        <h1 class="text-4xl font-bold mb-6">capital dash</h1>
        <div class="font-bold text-base">
          資本政策表の作成と株価算定を高速で簡単に
        </div>
        <a class="button my-8 w-full text-xl" href="/signup">
          {$_("会員登録して利用する")}
        </a>
        <div class="text-xs opacity-75">会員登録したらすぐにご利用可能です</div>
      </div>
      <img
        class="w-full shadow-lg rounded-xl col-span-2"
        loading="lazy"
        src="https://i.ibb.co/3SZ2QkR/ezgif-com-gif-maker.gif"
        alt="cap-table"
        border="0"
      />
    </div>
  </section>

  <section class="mt-12 max-w-5xl mx-auto flex flex-col items-center space-y-4">
    <h2 class="font-bold text-xl mb-6">
      資金調達支援ツール capital dashとは？
    </h2>
    <p>
      資金調達に必要な準備である資本政策表の作成と株価算定が３ステップで簡単にできます。
    </p>
    <p>
      スタートアップ投資家の株価算定ロジックが実装されており、起業家が高速かつミスなく、自社の株価理論値を算定することが可能です。
    </p>
    <p>
      スタートタップ起業家の方など、投資家に会う前に説得力のあるロジック構築にお役立てください。
    </p>
    <div
      class="w-full mx-auto relative grid grid-cols-3 grid-auto-rows gap-6 mb-8 text-sm"
    >
      <div
        class="relative shadow-lg h-full py-8 px-4 rounded-xl ring-1 transition duration-150 ring-gray-400 dark:ring-gray-200 flex flex-col justify-between items-center bg-white dark:bg-gray-700"
      >
        <Step />
        <h3 class="font-bold text-lg mb-4">{$_("資本政策表の作成")}</h3>
        <div class="">icon</div>
        <h4>作成ツールの便利な機能</h4>
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
        class="relative shadow-lg h-full py-8 px-4 rounded-xl ring-1 transition duration-150 ring-gray-400 dark:ring-gray-200 flex flex-col justify-between items-center bg-white dark:bg-gray-700"
      >
        <Step n="2" />
        <h3 class="font-bold text-lg mb-4">{$_("事業計画の作成")}</h3>
        <div class="">icon</div>
        <h4>作成ツールの便利な機能</h4>
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
        class="relative shadow-lg h-full py-8 px-4 rounded-xl ring-1 transition duration-150 ring-gray-400 dark:ring-gray-200 flex flex-col justify-between items-center bg-white dark:bg-gray-700"
      >
        <Step n="3" />
        <h3 class="font-bold text-lg mb-4">{$_("株価算定")}</h3>
        <div class="">icon</div>
        <h4>算定ツールの便利な機能</h4>
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

  <section class="mt-12 max-w-5xl mx-auto">
    <h2>capital dashが選ばれる理由</h2>
    4 round points
  </section>

  <section class="mt-12 max-w-5xl mx-auto">
    スタートアップ起業家向け 資金調達支援ツール
  </section>

  <section class="mt-12 max-w-5xl mx-auto">footer</section>
</main>

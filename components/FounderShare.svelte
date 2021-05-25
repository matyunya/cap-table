<script>
  import { format } from "/utils/index.js";
  import _ from "/utils/intl.js";

  const { founderShare } = require("/index.ellx");
</script>

{#if $founderShare > 0 && $founderShare !== 1}
  <div
    class="text-xs mr-3"
    class:text-green-500={$founderShare > 0.5}
    class:text-yellow-500={$founderShare < 0.5 && $founderShare > 0.34}
    class:text-red-300={$founderShare < 0.34}
  >
    {$_("創業メンバー%")}
    {format.percent.format($founderShare)}
  </div>
{/if}

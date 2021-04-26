<script>
  import { onMount } from "svelte";
  import Wrapper from "/components/signup/Wrapper.svelte";
  import Stepper from "/components/Stepper.svelte";
  import Step1 from "/components/signup/Step1.svelte";
  import Step2 from "/components/signup/Step2.svelte";
  import Step3 from "/components/signup/Step3.svelte";

  const { regStep, isAuthenticated, route } = require("/index.ellx");

  onMount(() =>
    isAuthenticated.subscribe(
      (v) =>
        v === true &&
        route.get() === "/signup/2" &&
        route.get() === "/signup/3" &&
        window.ellx.router.go("/dashboard")
    )
  );
</script>

<Wrapper>
  <Stepper n={$regStep} />
  {#if $regStep === 1}
    <Step1 />
  {:else if $regStep === 2}
    <Step2 onSave={() => window.ellx.router.go("/signup/3")} />
  {:else if $regStep === 3}
    <Step3 onSave={() => window.ellx.router.go("/docs")} />
  {/if}
</Wrapper>

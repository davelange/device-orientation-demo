<script lang="ts">
  import { throttle, isOffLimit, transformsFromOrientation } from "../lib.ts";

  let gamma = 0;

  function handleOrientationChange(event: DeviceOrientationEvent) {
    if (event.gamma === null || isOffLimit(event.gamma)) {
      return;
    }

    gamma = event.gamma;
  }

  $: ({ translateX, rotateY } = transformsFromOrientation(gamma));
</script>

<svelte:window on:deviceorientation={throttle(handleOrientationChange, 20)} />
<div class="frame">
  <div
    class="frame__bg-wrapper"
    style:transform="translateX({translateX}%) perspective(200px) rotateY({rotateY}deg)"
  >
    <img class="frame__image" src="/bg_1.webp" alt="A very impressive bridge" />
    <div class="frame__vignette" />
  </div>
  <div class="frame__shadow" />
  <img class="frame__logo" src="/logo-full-offblack.svg" alt="Iron wallet" />
</div>

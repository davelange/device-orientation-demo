<script lang="ts">
  import {
    throttle,
    isOffLimit,
    transformsFromOrientation,
    calcMousePosToCenter,
  } from "../lib.ts";

  let gamma: number | undefined;
  let mouseX: number | undefined;

  function handleOrientationChange(event: DeviceOrientationEvent) {
    if (event.gamma === null || isOffLimit(event.gamma)) {
      return;
    }

    gamma = event.gamma;
  }

  function handleMouseMove(event: MouseEvent) {
    const xMotion = calcMousePosToCenter(window.innerWidth, event.clientX);

    if (xMotion === null) {
      return;
    }

    mouseX = xMotion;
  }

  $: ({ translateX, rotateY } = transformsFromOrientation({ gamma, mouseX }));
</script>

<svelte:window
  on:deviceorientation={throttle(handleOrientationChange, 20)}
  on:mousemove={handleMouseMove}
/>
<div class="frame">
  <div
    class="frame__bg-wrapper"
    style:transform="translateX({translateX}%) perspective(200px) rotateY({rotateY}deg)"
  >
    <img class="frame__image" src="/bg_1.webp" alt="A very impressive bridge" />
  </div>
  <img class="frame__logo" src="/logo-full-offblack.svg" alt="Iron wallet" />
</div>

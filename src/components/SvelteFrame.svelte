<script lang="ts">
  import {
    throttle,
    isOffLimit,
    transformsFromOrientation,
    calcMousePosToCenter,
    GAMMA_LIMIT,
    isMobileDevice,
  } from "../lib.ts";

  let gamma: number | undefined;
  let mouseX: number | undefined;

  $: isMobile = isMobileDevice();

  function handleOrientationChange(event: DeviceOrientationEvent) {
    if (
      event.gamma === null ||
      isOffLimit(event.gamma, GAMMA_LIMIT) ||
      !isMobile
    ) {
      return;
    }

    gamma = event.gamma;
  }

  function handleMouseMove(event: MouseEvent) {
    if (isMobile) return;

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
    style:transform="translateX({translateX}%) perspective(170px) rotateY({rotateY}deg)"
  >
    <img class="frame__image" src="/bg_1.webp" alt="A very impressive bridge" />
  </div>
  <div class="frame__text">
    <h1>Hello</h1>
    <span>world</span>
  </div>
</div>

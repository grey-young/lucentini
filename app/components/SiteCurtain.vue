<script setup lang="ts">
// Covers the screen between pages; usePageTransition drives it.
const label = useCurtainLabel()
</script>

<template>
  <div class="curtain" aria-hidden="true">
    <p class="curtain__row">
      <span>Lucentini</span>
      <span>Antiques &amp; Sculpture</span>
    </p>
    <div class="curtain__center">
      <span class="curtain__mask"><span class="curtain__line kicker">{{ label.kicker }}</span></span>
      <span class="curtain__mask"><span class="curtain__line curtain__title">{{ label.title }}</span></span>
    </div>
    <p class="curtain__row">
      <span>Est. February 1963</span>
      <span class="curtain__track"><span class="curtain__bar" /></span>
    </p>
  </div>
</template>

<style scoped>
.curtain {
  position: fixed;
  inset: 0;
  z-index: 940;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: var(--pad);
  background: #0e0d0b;
  color: #ede6da;
  clip-path: inset(100% 0% 0% 0%);
  visibility: hidden;
}

.curtain__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  color: rgba(237, 230, 218, 0.6);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.curtain__center {
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 1.25rem;
  text-align: center;
}

.curtain__mask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.08em;
}

.curtain__line {
  display: block;
}

.curtain__line.kicker {
  color: #c9a25e;
}

.curtain__title {
  max-width: 18ch;
  font-family: var(--font-serif);
  font-size: clamp(2.6rem, 6.4vw, 6.5rem);
  letter-spacing: -0.03em;
  line-height: 0.95;
  text-wrap: balance;
}

.curtain__track {
  flex: 1;
  max-width: 24rem;
  height: 1px;
  overflow: hidden;
  background: rgba(237, 230, 218, 0.15);
}

.curtain__bar {
  display: block;
  height: 100%;
  background: #c9a25e;
  transform: scaleX(0);
  transform-origin: left;
}
</style>

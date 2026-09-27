<script setup lang="ts">
import { gsap } from 'gsap'

const ready = useSiteReady()
const root = ref<HTMLElement>()
const done = ref(false)
const year = ref(1963)
const thisYear = new Date().getFullYear()

// Without JavaScript there is nothing to wait for.
useHead({ noscript: [{ innerHTML: '<style>.preloader{display:none}</style>' }] })

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function heroDecoded() {
  try {
    await document.querySelector<HTMLImageElement>('main img[fetchpriority="high"]')?.decode()
  }
  catch {}
}

onMounted(async () => {
  const el = root.value
  if (!el) return
  el.classList.add('is-js')
  const { $lenis, $reducedMotion } = useNuxtApp()

  if ($reducedMotion) {
    done.value = true
    ready.value = true
    return
  }

  $lenis?.stop()
  const counter = { value: 1963 }
  const count = gsap.timeline()
    .from(el.querySelectorAll('.preloader__fade'), { autoAlpha: 0, y: 12, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0)
    .to(counter, { value: thisYear, duration: 2.1, ease: 'power3.inOut', onUpdate: () => { year.value = Math.round(counter.value) } }, 0.1)
    .to(el.querySelector('.preloader__bar'), { scaleX: 1, duration: 2.1, ease: 'power3.inOut' }, 0.1)

  // Hold the curtain until the counter lands and the hero is ready to paint.
  await Promise.all([count.then(), Promise.race([Promise.all([document.fonts.ready, heroDecoded()]), wait(4500)])])

  gsap.timeline({ onComplete: () => { done.value = true } })
    .to(el.querySelectorAll('.preloader__fade'), { autoAlpha: 0, duration: 0.4 }, 0)
    .to(el.querySelector('.preloader__year'), { yPercent: -105, duration: 0.9, ease: 'expo.in' }, 0)
    .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.3, ease: 'expo.inOut' }, 0.6)
    .add(() => {
      ready.value = true
      $lenis?.start()
    }, 1.05)
})
</script>

<template>
  <div v-if="!done" ref="root" class="preloader" aria-hidden="true">
    <div class="preloader__row preloader__fade">
      <span>Lucentini</span>
      <span>Antiques &amp; Sculpture</span>
    </div>
    <div class="preloader__center">
      <span class="preloader__mask">
        <span class="preloader__year">{{ year }}</span>
      </span>
    </div>
    <div class="preloader__row preloader__fade">
      <span>Est. February 1963</span>
      <span class="preloader__track"><span class="preloader__bar" /></span>
      <span>Six decades, handed down</span>
    </div>
  </div>
</template>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: 950;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: var(--pad);
  background: #0e0d0b;
  color: #ede6da;
  clip-path: inset(0% 0% 0% 0%);
  animation: preloader-failsafe 0.8s ease 7s forwards;
}

.preloader.is-js {
  animation: none;
}

.preloader__row {
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

.preloader__center {
  display: grid;
  place-items: center;
}

.preloader__mask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.05em;
}

.preloader__year {
  display: block;
  font-family: var(--font-serif);
  font-size: clamp(7rem, 26vw, 24rem);
  letter-spacing: -0.04em;
  line-height: 0.9;
}

.preloader__track {
  flex: 1;
  max-width: 24rem;
  height: 1px;
  overflow: hidden;
  background: rgba(237, 230, 218, 0.15);
}

.preloader__bar {
  display: block;
  height: 100%;
  background: #c9a25e;
  transform: scaleX(0);
  transform-origin: left;
}

@keyframes preloader-failsafe {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@media (max-width: 40rem) {
  .preloader__row > span:last-child:not(.preloader__track) {
    display: none;
  }
}
</style>

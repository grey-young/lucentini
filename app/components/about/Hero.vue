<script setup lang="ts">
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { piece } from '~/data/pieces'

const root = ref<HTMLElement>()
const ready = useSiteReady()
const hero = piece('crowned-lion')
// The lens magnifies the hero, so it gets the large source too.
const heroSrcset = `${hero.srcset}, ${hero.src(2400)} 2400w`

useHead({
  link: [{ rel: 'preload', as: 'image', href: hero.src(1400), imagesrcset: heroSrcset, imagesizes: '100vw', fetchpriority: 'high' }],
})

// Keep in step with --r0 in the stylesheet.
const closedRadius = () => Math.min(innerWidth, innerHeight) * (innerWidth < innerHeight ? 0.25 : 0.17)
const openRadius = () => Math.hypot(innerWidth, innerHeight) / 2 + 40

// While the lens is small it frames the lion's head, then drifts back to the
// whole bust as it opens. `focus` is the head's position in the photograph.
const LENS_ZOOM = 1.75
const focus = { x: 0.35, y: 0.52 }
function focusOffset(axis: 'x' | 'y') {
  const box = { w: innerWidth + 96, h: innerHeight + 96 } // .hero__zoom overhangs by 3rem
  const scale = Math.max(box.w / hero.width, box.h / hero.height)
  return axis === 'x'
    ? -LENS_ZOOM * (focus.x - 0.5) * hero.width * scale
    : -LENS_ZOOM * (focus.y - 0.5) * hero.height * scale
}

useScene(root, ({ q, motion, finePointer }) => {
  if (!motion) return
  const aperture = q('.hero__aperture')[0]!
  const split = SplitText.create(q('.hero__line-text'), { type: 'chars' })

  // The eye opens once the preloader lifts.
  gsap.set(aperture, { '--open': 0 })
  gsap.set(split.chars, { yPercent: 120 })
  gsap.set(q('.hero__fade'), { autoAlpha: 0 })
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .to(aperture, { '--open': 1, duration: 2 }, 0)
    .fromTo(q('.hero__zoom')[0]!, { scale: 1.6 }, { scale: 1, duration: 2.6 }, 0)
    .to(split.chars, { yPercent: 0, duration: 1.5, stagger: 0.03 }, 0.15)
    .to(q('.hero__fade'), { autoAlpha: 1, duration: 1.4, stagger: 0.1, ease: 'power2.out' }, 0.8)
  const stopIntro = watch(ready, (isReady) => {
    if (isReady) intro.play()
  }, { immediate: true })

  // Scrolling opens the aperture to the full frame and parts the headline.
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: q('.hero__pin')[0],
      start: 'top top',
      end: '+=170%',
      pin: true,
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  })
    .fromTo(aperture, { '--r': () => `${closedRadius()}px` }, { '--r': () => `${openRadius()}px`, ease: 'power2.in', duration: 1 }, 0)
    .fromTo(q('.hero__img')[0]!, {
      scale: LENS_ZOOM,
      x: () => focusOffset('x'),
      y: () => focusOffset('y'),
    }, { scale: 1.02, x: 0, y: 0, duration: 1 }, 0)
    .to(q('.hero__line--top')[0]!, { y: () => -innerHeight * 0.62, duration: 0.6, ease: 'power1.in' }, 0)
    .to(q('.hero__line--bottom')[0]!, { y: () => innerHeight * 0.62, duration: 0.6, ease: 'power1.in' }, 0)
    .to(q('.hero__ring')[0]!, { scale: 2.4, autoAlpha: 0, duration: 0.45 }, 0)
    .to(q('.hero__meta'), { autoAlpha: 0, duration: 0.2 }, 0)
    .to(q('.hero__shade')[0]!, { autoAlpha: 1, duration: 0.3 }, 0.62)
    .fromTo(q('.hero__sub-line'), { yPercent: 115 }, { yPercent: 0, duration: 0.24, stagger: 0.06, ease: 'power3.out' }, 0.7)
    .fromTo(q('.hero__label')[0]!, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.86)

  if (!finePointer) return () => stopIntro()

  // Look around the piece through the lens.
  const look = q('.hero__look')[0]!
  const lookX = gsap.quickTo(look, 'x', { duration: 1.4, ease: 'power3' })
  const lookY = gsap.quickTo(look, 'y', { duration: 1.4, ease: 'power3' })
  const onMove = (event: PointerEvent) => {
    lookX((event.clientX / innerWidth - 0.5) * -46)
    lookY((event.clientY / innerHeight - 0.5) * -46)
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    stopIntro()
    window.removeEventListener('pointermove', onMove)
  }
})
</script>

<template>
  <section id="top" ref="root" class="hero" data-theme="ink" data-index="I" data-chapter="Prologue">
    <div class="hero__pin">
      <div class="hero__aperture">
        <div class="hero__look">
          <div class="hero__zoom">
            <img
              class="hero__img"
              :src="hero.src(1400)"
              :srcset="heroSrcset"
              sizes="100vw"
              :width="hero.width"
              :height="hero.height"
              :alt="hero.alt"
              fetchpriority="high"
            >
          </div>
        </div>
        <div class="hero__shade" />
      </div>

      <div class="hero__ring" aria-hidden="true">
        <svg class="hero__fade" viewBox="0 0 200 200">
          <defs>
            <path id="hero-ring-path" d="M100 100m-94 0a94 94 0 1 1 188 0a94 94 0 1 1-188 0" />
          </defs>
          <text>
            <textPath href="#hero-ring-path" textLength="590" lengthAdjust="spacing">
              ANTIQUES &amp; SCULPTURE ✦ EST. 1963 ✦ FINE JEWELRY ✦ SCULPTURE ✦ HISTORICAL ARTIFACTS ✦ FINE ART ✦
            </textPath>
          </text>
        </svg>
      </div>

      <h1 class="hero__title">
        <span class="hero__line hero__line--top"><span class="hero__line-mask"><span class="hero__line-text">An eye for the</span></span></span>
        <span class="hero__line hero__line--bottom"><span class="hero__line-mask"><em class="hero__line-text">extraordinary</em></span></span>
        <span class="visually-hidden">, handed down since 1963</span>
      </h1>

      <div class="hero__meta hero__meta--tl"><p class="kicker hero__fade">(Est.) February 1963</p></div>
      <div class="hero__meta hero__meta--tr"><p class="kicker hero__fade">Lucentini Antiques &amp; Sculpture</p></div>
      <div class="hero__meta hero__meta--bl"><p class="kicker hero__fade">Fine jewelry, sculpture,<br>historical artifacts &amp; fine art</p></div>
      <div class="hero__meta hero__meta--br"><p class="kicker hero__fade">Scroll to look closer <span class="hero__arrow">↓</span></p></div>

      <p class="hero__sub" aria-hidden="true">
        <span class="hero__sub-mask"><span class="hero__sub-line">Handed down</span></span>
        <span class="hero__sub-mask"><em class="hero__sub-line">since 1963</em></span>
      </p>
      <p class="kicker hero__label">
        {{ hero.title }} · {{ hero.meta }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  --r0: 17vmin;

  position: relative;
  color: #ede6da;
}

.hero__pin {
  position: relative;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
}

.hero__aperture {
  --r: var(--r0);
  --open: 1;

  position: absolute;
  inset: 0;
  clip-path: circle(calc(var(--r) * var(--open)) at 50% 50%);
  background: #050404;
}

.hero__look,
.hero__zoom {
  position: absolute;
  inset: -3rem;
}

.hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
}

.hero__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(8, 7, 6, 0.85), rgba(8, 7, 6, 0.1) 55%),
    radial-gradient(circle at 50% 40%, transparent 30%, rgba(8, 7, 6, 0.5));
  opacity: 0;
  visibility: hidden;
}

.hero__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(var(--r0) * 2 + 7vmin);
  aspect-ratio: 1;
  margin: calc((var(--r0) * 2 + 7vmin) / -2) 0 0 calc((var(--r0) * 2 + 7vmin) / -2);
  pointer-events: none;
}

.hero__ring svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  animation: spin 50s linear infinite;
}

.hero__ring text {
  fill: #c9a25e;
  font-family: var(--font-mono);
  font-size: 6.2px;
  letter-spacing: 0.4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.hero__title {
  position: absolute;
  inset: 0;
  pointer-events: none;
  font-size: clamp(3.2rem, 10.5vw, 12.5rem);
  line-height: 0.9;
  letter-spacing: -0.035em;
}

.hero__line {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.hero__line--top {
  bottom: calc(50% + var(--r0) + 2.2vmin);
}

.hero__line--bottom {
  top: calc(50% + var(--r0) + 0.6vmin);
}

.hero__line-mask {
  display: block;
  overflow: hidden;
  padding: 0.08em 0.12em 0.14em;
  margin: -0.08em -0.12em -0.14em;
}

.hero__line-text {
  display: block;
}

.hero__line--bottom em {
  color: #c9a25e;
}

.hero__meta {
  position: absolute;
  max-width: 18rem;
}

.hero__meta .kicker {
  color: rgba(237, 230, 218, 0.62);
}

.hero__meta--tl {
  top: 7rem;
  left: var(--pad);
}

.hero__meta--tr {
  top: 7rem;
  right: var(--pad);
  text-align: right;
}

.hero__meta--bl {
  bottom: 2rem;
  left: var(--pad);
}

.hero__meta--br {
  bottom: 2rem;
  right: var(--pad);
  text-align: right;
}

.hero__arrow {
  display: inline-block;
  animation: nudge 2.4s var(--ease-in-out) infinite;
}

@keyframes nudge {
  0%, 100% { transform: translateY(-2px); }
  50% { transform: translateY(3px); }
}

.hero__sub {
  position: absolute;
  left: var(--pad);
  bottom: clamp(5rem, 14vh, 9rem);
  display: grid;
  font-family: var(--font-serif);
  font-size: clamp(3rem, 9vw, 10rem);
  letter-spacing: -0.03em;
  line-height: 0.92;
}

.hero__sub-mask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.1em;
  margin-bottom: -0.1em;
}

.hero__sub-line {
  display: block;
}

.hero__sub em {
  color: #c9a25e;
}

.hero__label {
  position: absolute;
  right: var(--pad);
  bottom: 2rem;
  max-width: 24rem;
  color: rgba(237, 230, 218, 0.62);
  text-align: right;
  opacity: 0;
  visibility: hidden;
}

@media (orientation: portrait) {
  .hero {
    --r0: 25vmin;
  }

  .hero__meta--tr {
    display: none;
  }
}

@media (max-width: 40rem) {
  .hero__meta--tl {
    top: 5.5rem;
  }

  .hero__meta--bl {
    display: none;
  }

  .hero__label {
    left: var(--pad);
    text-align: left;
  }
}
</style>

<style>
/* Unscoped: Vue's :global() would drop the rest of the selector.
   Without the choreography the lens holds still on the lion's head, using the
   same framing the scroll timeline starts from (focus 35% / 52%). */
html:not(.has-motion) .hero__img {
  transform: translate(20%, -3%) scale(1.3);
}

@media (orientation: portrait) {
  html:not(.has-motion) .hero__img {
    transform: translate(56%, -3%) scale(1.3);
  }
}

html:not(.has-motion) .hero__sub,
html:not(.has-motion) .hero__label {
  display: none;
}
</style>

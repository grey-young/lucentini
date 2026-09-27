<script setup lang="ts">
import { gsap } from 'gsap'

// A jeweller's loupe: over any image marked data-loupe, the cursor becomes a
// lens showing the piece magnified from a high-resolution source.
const ZOOM = 2.5

const dot = ref<HTMLElement>()
const loupe = ref<HTMLElement>()
const lens = ref<HTMLElement>()
// Linked plates name where a click goes, in the lens or on the ring.
const hint = ref('')
let cleanup: (() => void) | undefined
let reset: (() => void) | undefined

// A click on a linked plate swaps the page out from under the lens.
const route = useRoute()
watch(() => route.path, () => reset?.())

onMounted(() => {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const d = dot.value
  const l = loupe.value
  const ln = lens.value
  if (!finePointer || reduced || !d || !l || !ln) return

  document.documentElement.classList.add('has-cursor')
  const dotX = gsap.quickTo(d, 'x', { duration: 0.16, ease: 'power3' })
  const dotY = gsap.quickTo(d, 'y', { duration: 0.16, ease: 'power3' })
  const loupeX = gsap.quickTo(l, 'x', { duration: 0.45, ease: 'power3' })
  const loupeY = gsap.quickTo(l, 'y', { duration: 0.45, ease: 'power3' })

  let pointer = { x: -100, y: -100 }
  let target: HTMLImageElement | null = null
  let geometry = { nw: 1, nh: 1, contain: false, px: 0.5, py: 0.5 }
  let magnet: HTMLElement | null = null

  function paint() {
    if (!target) return
    const r = target.getBoundingClientRect()
    const { nw, nh, contain, px, py } = geometry
    const scale = contain ? Math.min(r.width / nw, r.height / nh) : Math.max(r.width / nw, r.height / nh)
    const w = nw * scale
    const h = nh * scale
    const x = pointer.x - r.left - (r.width - w) * px
    const y = pointer.y - r.top - (r.height - h) * py
    const half = l!.offsetWidth / 2
    ln!.style.backgroundSize = `${w * ZOOM}px ${h * ZOOM}px`
    ln!.style.backgroundPosition = `${half - x * ZOOM}px ${half - y * ZOOM}px`
  }

  function enter(img: HTMLImageElement) {
    target = img
    hint.value = img.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel ?? ''
    const style = getComputedStyle(img)
    const [px = 50, py = 50] = style.objectPosition.split(' ').map(v => Number.parseFloat(v))
    geometry = { nw: img.naturalWidth || img.width, nh: img.naturalHeight || img.height, contain: style.objectFit === 'contain', px: px / 100, py: py / 100 }
    ln!.style.backgroundImage = `url("${img.currentSrc || img.src}")`
    const zoomSrc = img.dataset.loupe
    if (zoomSrc) {
      const hi = new Image()
      hi.onload = () => {
        if (target === img) ln!.style.backgroundImage = `url("${zoomSrc}")`
      }
      hi.src = zoomSrc
    }
    paint()
    gsap.to(l!, { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
    gsap.to(d!, { scale: 0, duration: 0.3, overwrite: 'auto' })
  }

  function leave() {
    target = null
    gsap.to(l!, { scale: 0.3, autoAlpha: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' })
    gsap.to(d!, { scale: 1, duration: 0.3, overwrite: 'auto' })
  }

  function detect(el: Element | null) {
    const img = el?.closest('img[data-loupe]') as HTMLImageElement | null
    if (img && img !== target) enter(img)
    else if (!img && target) leave()
    if (target) paint()
    const labelled = target ? null : el?.closest<HTMLElement>('[data-cursor-label]')
    if (labelled) hint.value = labelled.dataset.cursorLabel ?? ''
    d!.classList.toggle('is-label', !!labelled)
    d!.classList.toggle('is-hover', !target && !labelled && !!el?.closest('a, button, [data-cursor]'))
  }

  function onMove(event: PointerEvent) {
    pointer = { x: event.clientX, y: event.clientY }
    dotX(pointer.x)
    dotY(pointer.y)
    loupeX(pointer.x)
    loupeY(pointer.y)
    gsap.to(d!, { autoAlpha: 1, duration: 0.3, overwrite: false })
    const el = event.target as Element
    detect(el)

    // Magnetic controls lean toward the pointer.
    const m = el.closest?.('[data-magnetic]') as HTMLElement | null
    if (m !== magnet) {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      magnet = m
    }
    if (magnet) {
      const r = magnet.getBoundingClientRect()
      gsap.to(magnet, { x: (pointer.x - r.left - r.width / 2) * 0.3, y: (pointer.y - r.top - r.height / 2) * 0.4, duration: 0.4, ease: 'power3.out' })
    }
  }

  // Content moves under a still pointer while scrolling.
  const onScroll = () => detect(document.elementFromPoint(pointer.x, pointer.y))
  const onLeaveWindow = () => {
    if (target) leave()
    gsap.to(d!, { autoAlpha: 0, duration: 0.3 })
  }

  reset = () => {
    if (target) leave()
    d.classList.remove('is-hover', 'is-label')
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeaveWindow)

  cleanup = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('scroll', onScroll)
    document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
    document.documentElement.classList.remove('has-cursor')
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div class="cursor" aria-hidden="true">
    <div ref="dot" class="cursor__dot"><span class="cursor__hint">{{ hint }}</span></div>
    <div ref="loupe" class="cursor__loupe">
      <div ref="lens" class="cursor__lens" />
      <svg class="cursor__reticle" viewBox="0 0 100 100">
        <path d="M50 3v7M50 90v7M3 50h7M90 50h7" />
      </svg>
      <span class="cursor__zoom">×{{ ZOOM }}<template v-if="hint"> · {{ hint }} ↗</template></span>
    </div>
  </div>
</template>

<style scoped>
.cursor {
  display: contents;
}

.cursor__dot,
.cursor__loupe {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
}

.cursor__dot {
  width: 10px;
  height: 10px;
  margin: -5px 0 0 -5px;
  border: 1px solid var(--accent);
  border-radius: 50%;
  background: var(--accent);
  transition:
    width 0.45s var(--ease-out),
    height 0.45s var(--ease-out),
    margin 0.45s var(--ease-out),
    background-color 0.3s ease;
}

.cursor__dot.is-hover {
  width: 46px;
  height: 46px;
  margin: -23px 0 0 -23px;
  background: transparent;
}

.cursor__dot {
  display: grid;
  place-items: center;
}

.cursor__hint {
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.cursor__dot.is-label {
  width: 74px;
  height: 74px;
  margin: -37px 0 0 -37px;
}

.cursor__dot.is-label .cursor__hint {
  opacity: 1;
  transition-delay: 0.15s;
}

.cursor__loupe {
  width: 210px;
  height: 210px;
  margin: -105px 0 0 -105px;
  border: 1px solid rgba(255, 244, 222, 0.85);
  border-radius: 50%;
  overflow: hidden;
  box-shadow:
    0 0 0 6px rgba(14, 13, 11, 0.35),
    0 24px 60px rgba(0, 0, 0, 0.45);
  transform: scale(0.3);
}

.cursor__lens {
  position: absolute;
  inset: 0;
  background-color: #111;
  background-repeat: no-repeat;
}

.cursor__reticle {
  position: absolute;
  inset: 0;
  fill: none;
  stroke: rgba(255, 244, 222, 0.8);
  stroke-width: 0.6;
}

.cursor__zoom {
  position: absolute;
  bottom: 18px;
  left: 50%;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(14, 13, 11, 0.55);
  color: #f4ede0;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  transform: translateX(-50%);
}
</style>

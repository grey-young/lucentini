<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const chapter = useChapter()
const menuOpen = useMenuOpen()
const ready = useSiteReady()
const scrollTo = useScrollTo()
const goTo = useGoTo()
const route = useRoute()
const header = ref<HTMLElement>()

let ctx: gsap.Context | undefined
let setOffset: ((value: number) => void) | undefined

onMounted(() => {
  ctx = gsap.context(() => {
    setOffset = gsap.quickTo(header.value!, 'yPercent', { duration: 0.6, ease: 'power3.out' })
    // Tuck the header away while reading down; bring it back on the way up.
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: self => setOffset?.(!menuOpen.value && self.direction === 1 && self.scroll() > 240 ? -130 : 0),
    })
  }, header.value)
})

onBeforeUnmount(() => ctx?.revert())

watch(menuOpen, (open) => {
  if (open) setOffset?.(0)
})

// Each new page opens with the header in view.
watch(() => route.path, () => setOffset?.(0))

function home(event: MouseEvent) {
  if (route.path !== '/about') return
  event.preventDefault()
  scrollTo(0)
}

// A piece's page has its own inquiry panel; everywhere else, the About contact chapter.
function inquire() {
  if (document.querySelector('#inquire')) scrollTo('#inquire')
  else goTo('/about#contact')
}
</script>

<template>
  <header ref="header" class="site-header" :class="{ 'is-ready': ready, 'is-menu': menuOpen }">
    <NuxtLink to="/about" class="site-header__brand" @click="home">
      <span class="site-header__name">Lucentini</span>
      <span class="site-header__est">Antiques &amp; Sculpture · 1963</span>
    </NuxtLink>
    <p class="site-header__chapter" aria-hidden="true">
      <Transition name="chapter" mode="out-in">
        <span :key="chapter.title" class="site-header__chapter-text">
          <span class="site-header__num">({{ chapter.index }})</span> {{ chapter.title }}
        </span>
      </Transition>
    </p>
    <div class="site-header__actions">
      <NuxtLink to="/collection" class="site-header__cta" :class="{ 'is-current': route.path.startsWith('/collection') }" data-magnetic>Collection</NuxtLink>
      <a href="/about#contact" class="site-header__cta" data-magnetic @click.prevent="inquire">Inquire</a>
      <button
        type="button"
        class="menu-toggle"
        data-magnetic
        :aria-expanded="menuOpen"
        aria-controls="site-menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="menu-toggle__label">{{ menuOpen ? 'Close' : 'Index' }}</span>
        <span class="menu-toggle__icon" aria-hidden="true"><i /><i /></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 800;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1.35rem var(--pad);
  color: var(--fg);
  opacity: 0;
  transition: opacity 1s var(--ease-out), color 0.6s ease;
}

.site-header.is-ready {
  opacity: 1;
}

.site-header.is-menu {
  color: #1a1512;
}

.site-header__brand {
  display: grid;
  width: fit-content;
  line-height: 1;
}

.site-header__name {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  letter-spacing: -0.01em;
}

.site-header__est {
  margin-top: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  opacity: 0.7;
  text-transform: uppercase;
}

.site-header__chapter {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.site-header__chapter-text {
  display: inline-block;
}

.site-header__num {
  opacity: 0.6;
}

.chapter-enter-active,
.chapter-leave-active {
  transition: opacity 0.35s ease, transform 0.45s var(--ease-out);
}

.chapter-enter-from {
  opacity: 0;
  transform: translateY(0.8em);
}

.chapter-leave-to {
  opacity: 0;
  transform: translateY(-0.8em);
}

.site-header__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(1.25rem, 2.5vw, 2.5rem);
}

.site-header__cta,
.menu-toggle {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.site-header__cta {
  position: relative;
  padding-block: 0.4rem;
}

.site-header__cta::after {
  content: "";
  position: absolute;
  inset: auto 0 0.15rem;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.6s var(--ease-out);
}

.site-header__cta.is-current::after,
.site-header__cta:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.menu-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.4rem 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.menu-toggle__icon {
  position: relative;
  width: 1.6rem;
  height: 0.6rem;
}

.menu-toggle__icon i {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transition: transform 0.6s var(--ease-out), top 0.6s var(--ease-out);
}

.menu-toggle__icon i:first-child {
  top: 0;
}

.menu-toggle__icon i:last-child {
  top: 100%;
}

.menu-toggle[aria-expanded="true"] .menu-toggle__icon i:first-child {
  top: 50%;
  transform: rotate(45deg);
}

.menu-toggle[aria-expanded="true"] .menu-toggle__icon i:last-child {
  top: 50%;
  transform: rotate(-45deg);
}

@media (max-width: 52rem) {
  .site-header {
    grid-template-columns: 1fr auto;
  }

  .site-header__chapter,
  .site-header__cta {
    display: none;
  }
}
</style>

<style>
/* Unscoped: Vue's :global() would drop the rest of the selector. Static pages
   have no single theme to follow, so the header inverts instead. */
html:not(.has-motion) .site-header {
  color: #fff;
  mix-blend-mode: difference;
}
</style>

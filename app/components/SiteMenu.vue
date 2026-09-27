<script setup lang="ts">
import { gsap } from 'gsap'
import { piece } from '~/data/pieces'
import { chapters as aboutChapters, contact, pages } from '~/data/site'

const chapters = [...aboutChapters, ...pages]
const open = useMenuOpen()
const goTo = useGoTo()
const route = useRoute()
const panel = ref<HTMLElement>()
const visible = ref(false)
const active = ref(0)

watch(open, async (isOpen) => {
  const { $lenis } = useNuxtApp()
  const el = panel.value
  if (!el) return
  gsap.killTweensOf(el)
  if (isOpen) {
    visible.value = true
    $lenis?.stop()
    await nextTick()
    gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut' })
    el.querySelector<HTMLElement>('a')?.focus({ preventScroll: true })
  }
  else {
    $lenis?.start()
    gsap.to(el, {
      clipPath: 'inset(100% 0% 0% 0%)',
      duration: 0.9,
      ease: 'expo.inOut',
      onComplete: () => { visible.value = false },
    })
  }
})

function go(href: string) {
  open.value = false
  // Within the page, let the panel start closing first; across pages the
  // transition curtain covers everything straight away.
  if (href.split('#')[0] === route.path) setTimeout(() => goTo(href), 250)
  else goTo(href)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  open.value = false
  document.querySelector<HTMLElement>('.menu-toggle')?.focus()
}
</script>

<template>
  <nav v-show="visible" id="site-menu" ref="panel" class="menu" aria-label="Site index" @keydown="onKeydown">
    <div class="menu__list">
      <p class="kicker">Index</p>
      <ol>
        <li
          v-for="(c, i) in chapters"
          :key="c.href"
          :class="open ? 'animated fadeInUp' : ''"
          :style="{ animationDelay: `${0.4 + i * 0.06}s` }"
        >
          <a :href="c.href" @click.prevent="go(c.href)" @mouseenter="active = i" @focus="active = i">
            <span class="menu__num">{{ c.index }}</span>
            <span class="menu__title">{{ c.title }}</span>
          </a>
        </li>
      </ol>
    </div>
    <div class="menu__preview" aria-hidden="true">
      <div v-for="(c, i) in chapters" :key="c.piece" class="menu__img" :class="{ 'is-active': active === i }">
        <img v-if="visible" :src="piece(c.piece).src(720)" alt="">
      </div>
      <p class="kicker menu__caption">{{ piece(chapters[active]!.piece).title }}</p>
    </div>
    <div class="menu__foot" :class="open ? 'animated fadeInUp' : ''" style="animation-delay: 0.85s">
      <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
      <a :href="contact.whatsapp" target="_blank" rel="noopener">WhatsApp {{ contact.phone }}</a>
      <span>Family-owned since 1963</span>
    </div>
  </nav>
</template>

<style scoped>
.menu {
  position: fixed;
  inset: 0;
  z-index: 700;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  gap: 2rem var(--pad);
  padding: 7.5rem var(--pad) 2rem;
  background: #ece5d8;
  color: #1a1512;
  --muted: #6b6155;
  --line: rgba(26, 21, 18, 0.14);
  --accent: #7a5a2e;
  --animate-duration: 0.9s;
}

.menu .animated {
  animation-timing-function: var(--ease-out);
}

.menu__list ol {
  margin: 1.25rem 0 0;
  padding: 0;
  list-style: none;
}

.menu__list li {
  border-top: 1px solid var(--line);
}

.menu__list a {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  padding: 0.35rem 0;
  transition: color 0.4s ease, padding 0.6s var(--ease-out);
}

.menu__num {
  width: 2.5rem;
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--muted);
}

.menu__title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4.6vw, 4.6rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.menu__list a:hover,
.menu__list a:focus-visible {
  padding-left: 1.5rem;
  color: var(--accent);
}

.menu__list a:hover .menu__title,
.menu__list a:focus-visible .menu__title {
  font-style: italic;
}

.menu__preview {
  position: relative;
  align-self: stretch;
  min-height: 0;
}

.menu__img {
  position: absolute;
  inset: 0 0 2.25rem;
  overflow: hidden;
  opacity: 0;
  clip-path: inset(0 0 100% 0);
  transition: opacity 0.5s ease, clip-path 0.9s var(--ease-out);
}

.menu__img.is-active {
  opacity: 1;
  clip-path: inset(0 0 0% 0);
}

.menu__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.08);
  transition: transform 1.4s var(--ease-out);
}

.menu__img.is-active img {
  transform: scale(1);
}

.menu__caption {
  position: absolute;
  inset: auto 0 0;
}

.menu__foot {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.menu__foot a:hover {
  color: var(--accent);
}

@media (max-width: 52rem) {
  .menu {
    grid-template-columns: 1fr;
    padding-top: 6rem;
    overflow-y: auto;
  }

  .menu__preview {
    display: none;
  }
}
</style>

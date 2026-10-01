<script setup lang="ts">
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { allPieces, stockedDisciplines as disciplines, type Discipline } from '~/data/pieces'
import { contact } from '~/data/site'

const description = 'Fine jewelry, sculpture, historical artifacts, and fine art: the kinds of pieces Lucentini Antiques & Sculpture sources for collectors around the world.'

useSeoMeta({
  title: 'The Collection',
  description,
  ogTitle: 'The Collection | Lucentini Antiques & Sculpture',
  ogDescription: description,
  ogType: 'website',
  ogImage: '/images/pieces/egyptian-figure-1400.webp',
})

const pieces = allPieces()
const route = useRoute()
const router = useRouter()
const ready = useSiteReady()
const { $reducedMotion } = useNuxtApp()
const root = ref<HTMLElement>()
const grid = ref<HTMLElement>()

// The filter lives in the URL (?d=jewelry) so a view can be shared or returned to.
const active = computed<Discipline | 'all'>(() => {
  const d = route.query.d
  return disciplines.some(x => x.id === d) ? d as Discipline : 'all'
})
const filters = [
  { id: 'all' as const, title: 'All', count: pieces.length },
  ...disciplines.map(d => ({ id: d.id, title: d.title, count: pieces.filter(p => p.discipline.id === d.id).length })),
]
const shown = computed(() => pieces.filter(p => active.value === 'all' || p.discipline.id === active.value))
const current = computed(() => disciplines.find(d => d.id === active.value))
// Staggers the middle column on wide screens, counted among the visible cards.
const offset = (slug: string) => shown.value.findIndex(p => p.slug === slug) % 3 === 1

const pad = (n: number) => String(n).padStart(2, '0')

async function choose(id: Discipline | 'all') {
  if (id === active.value) return
  const cards = grid.value ? [...grid.value.querySelectorAll('.catalogue__item')] : []
  const state = Flip.getState(cards)
  await router.replace({ query: id === 'all' ? {} : { d: id } })
  await nextTick()
  if ($reducedMotion) return ScrollTrigger.refresh()
  Flip.from(state, {
    duration: 0.9,
    ease: 'expo.inOut',
    absolute: true,
    nested: true,
    onEnter: els => gsap.fromTo(els, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.3, stagger: 0.05, ease: 'expo.out' }),
    onLeave: els => gsap.to(els, { autoAlpha: 0, y: -30, duration: 0.45, ease: 'power2.in' }),
    onComplete: () => ScrollTrigger.refresh(),
  })
}

useThemeScroll(root)

useScene(root, ({ q, motion }) => {
  if (!motion) return
  const title = SplitText.create(q('.catalogue__title')[0]!, { type: 'lines,chars', mask: 'lines' })
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .from(title.chars, { yPercent: 115, rotate: 4, duration: 1.4, stagger: 0.03 }, 0)
    .from(q('.catalogue__fade'), { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.08 }, 0.35)

  // Cards rise into place as they arrive, but never while the curtain is down.
  const cards = q('.catalogue__item')
  gsap.set(cards, { autoAlpha: 0, y: 80 })
  const queue: Element[][] = []
  const rise = (batch: Element[]) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.09, ease: 'expo.out', overwrite: true })
  ScrollTrigger.batch(cards, {
    start: 'top 94%',
    once: true,
    onEnter: batch => ready.value ? rise(batch) : queue.push(batch),
  })

  const stop = watch(ready, (isReady) => {
    if (!isReady) return
    intro.play()
    queue.splice(0).forEach((batch, i) => gsap.delayedCall(0.35 + i * 0.1, () => rise(batch)))
  }, { immediate: true })
  return () => stop()
})
</script>

<template>
  <div ref="root">
    <section class="catalogue" data-theme="bone" data-index="✦" data-chapter="The collection">
      <header class="catalogue__head">
        <p class="kicker catalogue__fade"><b>(✦)</b> The collection</p>
        <p class="kicker catalogue__fade">{{ pad(shown.length) }} / {{ pad(pieces.length) }} pieces</p>
      </header>
      <h1 class="catalogue__title">The <em>collection</em></h1>

      <div class="catalogue__intro">
        <p class="catalogue__lede catalogue__fade">
          Pieces that reward a closer look, chosen one at a time.
        </p>
        <div class="catalogue__filters catalogue__fade" role="group" aria-label="Filter by discipline">
          <button
            v-for="f in filters"
            :key="f.id"
            type="button"
            class="catalogue__filter"
            :aria-pressed="active === f.id"
            data-magnetic
            @click="choose(f.id)"
          >
            {{ f.title }} <sup>{{ f.count }}</sup>
          </button>
        </div>
      </div>

      <Transition name="swap" mode="out-in">
        <p :key="active" class="catalogue__about catalogue__fade" aria-live="polite">
          {{ current ? current.text : 'Fine jewelry, sculpture, historical artifacts, and fine art. Open any piece to look closer.' }}
        </p>
      </Transition>

      <ul ref="grid" class="catalogue__grid">
        <li
          v-for="(p, i) in pieces"
          v-show="active === 'all' || p.discipline.id === active"
          :key="p.slug"
          class="catalogue__item"
          :class="{ 'is-offset': offset(p.slug) }"
          :data-flip-id="p.slug"
        >
          <PieceCard :piece="p" :eager="i < 3" />
        </li>
      </ul>
    </section>

    <section class="seek" data-theme="oxblood" data-index="—" data-chapter="Begin a conversation">
      <p class="kicker"><b>(—)</b> Private search</p>
      <h2 class="seek__title">Looking for something <em>in particular?</em></h2>
      <div class="seek__foot">
        <p class="seek__text">
          Much of what we handle is placed privately before it is ever shown. Tell us what you are searching for, and we will look on your behalf.
        </p>
        <div class="seek__actions">
          <a class="seek__pill" :href="`mailto:${contact.email}?subject=${encodeURIComponent('A private search')}`" data-magnetic>Write to us</a>
          <a class="seek__pill" :href="contact.whatsapp" target="_blank" rel="noopener" data-magnetic>WhatsApp</a>
          <NuxtLink class="seek__pill" to="/about" data-magnetic>About the house</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.catalogue {
  position: relative;
  padding: clamp(8rem, 14vw, 11rem) var(--pad) clamp(6rem, 12vw, 10rem);
}

.catalogue__head {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.catalogue__title {
  margin-top: clamp(1.5rem, 4vw, 3rem);
  font-size: clamp(4rem, 15vw, 17rem);
  letter-spacing: -0.05em;
  line-height: 0.84;
}

.catalogue__title em {
  color: var(--accent);
}

.catalogue__intro {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 2rem clamp(2rem, 6vw, 6rem);
  align-items: end;
  margin-top: clamp(2.5rem, 5vw, 4rem);
}

.catalogue__lede {
  max-width: 20ch;
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 3vw, 3.1rem);
  letter-spacing: -0.02em;
  line-height: 1.02;
}

.catalogue__filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.6rem;
}

.catalogue__filter {
  padding: 0.7rem 1.15rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: none;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
}

.catalogue__filter sup {
  font-size: 0.6rem;
  opacity: 0.6;
}

.catalogue__filter:hover {
  border-color: var(--fg);
}

.catalogue__filter[aria-pressed="true"] {
  border-color: var(--fg);
  background: var(--fg);
  color: var(--bg);
}

.catalogue__about {
  max-width: 36rem;
  margin: clamp(2.5rem, 5vw, 4rem) 0 0 auto;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.35s ease, transform 0.5s var(--ease-out);
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(0.6rem);
}

.swap-leave-to {
  opacity: 0;
  transform: translateY(-0.6rem);
}

.catalogue__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(3rem, 6vw, 6rem) clamp(1.25rem, 3vw, 3rem);
  align-items: start;
  margin: clamp(4rem, 8vw, 7rem) 0 0;
  padding: 0;
  list-style: none;
}

.catalogue__item.is-offset {
  padding-top: clamp(4rem, 10vw, 9rem);
}

.seek {
  padding: clamp(7rem, 14vw, 12rem) var(--pad);
}

.seek__title {
  max-width: 14ch;
  margin-top: 2rem;
  font-size: clamp(3.4rem, 9vw, 10rem);
  letter-spacing: -0.045em;
  line-height: 0.86;
}

.seek__title em {
  color: var(--accent);
}

.seek__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin-top: clamp(3rem, 6vw, 5rem);
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}

.seek__text {
  max-width: 30rem;
  font-size: clamp(1.05rem, 1rem + 0.35vw, 1.3rem);
}

.seek__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.seek__pill {
  padding: 0.8rem 1.35rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
}

.seek__pill:hover {
  border-color: var(--fg);
  background: var(--fg);
  color: var(--bg);
}

@media (max-width: 64rem) {
  .catalogue__intro {
    grid-template-columns: 1fr;
  }

  .catalogue__filters {
    justify-content: flex-start;
  }

  .catalogue__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .catalogue__item.is-offset {
    padding-top: 0;
  }
}

@media (max-width: 36rem) {
  .catalogue__grid {
    grid-template-columns: 1fr;
  }

  .catalogue__head .kicker:last-child {
    display: none;
  }
}
</style>

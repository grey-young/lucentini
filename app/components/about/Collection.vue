<script setup lang="ts">
import { gsap } from 'gsap'
import { disciplines as allDisciplines, type Discipline, type PieceSlug } from '~/data/pieces'

const root = ref<HTMLElement>()
const current = ref(0)

// Each discipline shown with a lead piece and a second, smaller one.
const plates: Record<Discipline, { main: PieceSlug, second: PieceSlug }> = {
  jewelry: { main: 'ship-pendant', second: 'bow-brooch' },
  sculpture: { main: 'houdon-bust', second: 'amphitrite-bust' },
  artifacts: { main: 'nola-amphora', second: 'irene-solidus' },
  art: { main: 'heirlooms-still-life', second: 'curtain-still-life' },
}
const disciplines = allDisciplines.map(d => ({ ...d, ...plates[d.id] }))

const pad = (n: number) => String(n).padStart(2, '0')

useScene(root, ({ q, motion, desktop }) => {
  if (!motion) return
  revealChars(q('.collection__title')[0]!)

  if (!desktop) {
    q('.collection__panel .plate__frame').forEach(frame => revealPlate(frame))
    return
  }

  // Scrolling down walks the gallery sideways.
  const track = q('.collection__track')[0]!
  const panels = q('.collection__panel')
  const distance = () => track.scrollWidth - innerWidth
  const pickCurrent = () => {
    const distances = panels.map((panel) => {
      const r = panel.getBoundingClientRect()
      return Math.abs((r.left + r.right) / 2 - innerWidth / 2)
    })
    current.value = distances.indexOf(Math.min(...distances))
  }
  const walk = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    onUpdate: pickCurrent,
    scrollTrigger: {
      trigger: q('.collection__pin')[0],
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: self => gsap.set(q('.collection__progress-bar'), { scaleX: self.progress }),
    },
  })

  panels.forEach((panel) => {
    const inView = { trigger: panel, containerAnimation: walk, start: 'left right', end: 'right left', scrub: true }
    const main = panel.querySelector('.collection__main .plate__img')
    if (main) gsap.fromTo(main, { xPercent: -7, scale: 1.16 }, { xPercent: 7, scale: 1.16, ease: 'none', scrollTrigger: inView })
    gsap.fromTo(panel.querySelector('.collection__second'), { x: 160 }, { x: -160, ease: 'none', scrollTrigger: inView })
    gsap.from(panel.querySelectorAll('.collection__info > *'), {
      autoAlpha: 0,
      x: 80,
      duration: 1.3,
      stagger: 0.08,
      ease: 'expo.out',
      scrollTrigger: { trigger: panel, containerAnimation: walk, start: 'left 65%', once: true },
    })
  })
})
</script>

<template>
  <section id="collection" ref="root" class="collection" data-theme="ink" data-index="V" data-chapter="The collection">
    <div class="collection__pin">
      <div class="collection__track">
        <div class="collection__intro">
          <p class="kicker"><b>(V)</b> The collection</p>
          <h2 class="collection__title">The <em>collection</em></h2>
          <p class="collection__lede">We deal in pieces that reward a closer look.</p>
          <p class="kicker collection__hint">Hover any piece to look closer <span aria-hidden="true">→</span></p>
          <NuxtLink to="/collection" class="collection__all" data-magnetic>View the full collection <span aria-hidden="true">↗</span></NuxtLink>
        </div>

        <article v-for="(d, i) in disciplines" :key="d.title" class="collection__panel">
          <div class="collection__main">
            <PieceImage :slug="d.main" loupe caption link ratio="4 / 5" sizes="(min-width: 64rem) 34vw, 88vw" />
          </div>
          <div class="collection__info">
            <p class="collection__num">{{ pad(i + 1) }}</p>
            <h3 class="collection__name">{{ d.title }}</h3>
            <p class="collection__text">{{ d.text }}</p>
            <NuxtLink :to="{ path: '/collection', query: { d: d.id } }" class="collection__explore">Explore {{ d.title }} <span aria-hidden="true">→</span></NuxtLink>
          </div>
          <div class="collection__second">
            <PieceImage :slug="d.second" loupe caption link ratio="1 / 1" sizes="(min-width: 64rem) 16vw, 60vw" />
          </div>
        </article>
      </div>

      <div class="collection__progress" aria-hidden="true">
        <span class="kicker">{{ pad(current + 1) }} — {{ disciplines[current]!.title }}</span>
        <span class="collection__progress-track"><span class="collection__progress-bar" /></span>
        <span class="kicker">{{ pad(disciplines.length) }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.collection {
  position: relative;
}

.collection__pin {
  position: relative;
}

.collection__track {
  display: grid;
  gap: clamp(5rem, 12vw, 8rem);
  padding: clamp(6rem, 12vw, 10rem) var(--pad);
}

.collection__intro {
  display: grid;
  align-content: center;
  gap: 1.5rem;
}

.collection__title {
  font-size: clamp(4rem, 12vw, 14rem);
  letter-spacing: -0.045em;
  line-height: 0.85;
}

.collection__title em {
  color: var(--accent);
}

.collection__lede {
  max-width: 22ch;
  font-family: var(--font-serif);
  font-size: clamp(1.7rem, 2.6vw, 2.8rem);
  line-height: 1.05;
}

.collection__hint {
  color: var(--fg);
}

.collection__all {
  width: fit-content;
  padding: 0.9rem 1.4rem;
  border: 1px solid var(--fg);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: background-color 0.4s ease, color 0.4s ease;
}

.collection__all:hover {
  background: var(--fg);
  color: var(--bg);
}

.collection__explore {
  display: inline-block;
  margin-top: 1.75rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.collection__explore:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.collection__panel {
  position: relative;
  display: grid;
  gap: 2rem;
}

.collection__num {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent);
}

.collection__name {
  margin-top: 0.75rem;
  font-size: clamp(3rem, 6.4vw, 7.5rem);
  letter-spacing: -0.035em;
  line-height: 0.88;
}

.collection__text {
  max-width: 26rem;
  margin-top: 1.5rem;
  color: var(--muted);
  font-size: clamp(1.02rem, 1rem + 0.25vw, 1.2rem);
}

.collection__second {
  width: min(60%, 16rem);
  margin-left: auto;
}

.collection__progress {
  display: none;
}

.collection__progress-track {
  flex: 1;
  height: 1px;
  overflow: hidden;
  background: var(--line);
}

.collection__progress-bar {
  display: block;
  height: 100%;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
}

@media (max-width: 63.99rem) {
  .collection__main {
    width: min(100%, 30rem);
  }
}

/* Wide screens without motion: a still, two-column catalogue. */
@media (min-width: 64rem) {
  .collection__panel {
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    column-gap: clamp(3rem, 6vw, 6rem);
    align-items: start;
  }

  .collection__main {
    grid-row: 1 / 3;
  }

  .collection__second {
    width: min(45%, 16rem);
  }
}
</style>

<style>
/* Unscoped: Vue's :global() would drop the rest of the selector.
   The sideways gallery, when there is room and motion. */
@media (min-width: 64rem) {
  html.has-motion .collection__pin {
    height: 100vh;
    height: 100svh;
    overflow: hidden;
  }

  html.has-motion .collection__track {
    display: flex;
    align-items: center;
    gap: 9vw;
    width: max-content;
    height: 100%;
    padding: 0 12vw 0 var(--pad);
  }

  html.has-motion .collection__intro {
    width: 44vw;
  }

  html.has-motion .collection__panel {
    grid-template-columns: auto 30vw;
    grid-template-rows: 1fr auto;
    column-gap: 4vw;
    align-items: center;
    height: 78vh;
  }

  html.has-motion .collection__main {
    grid-row: 1 / 3;
    width: calc(64vh * 4 / 5);
  }

  html.has-motion .collection__info {
    align-self: start;
    padding-top: 4vh;
  }

  html.has-motion .collection__second {
    width: 15vw;
    margin: 0 0 0 auto;
    align-self: end;
  }

  html.has-motion .collection__progress {
    position: absolute;
    right: var(--pad);
    bottom: 2rem;
    left: var(--pad);
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  html.has-motion .collection__progress .kicker {
    color: var(--fg);
    white-space: nowrap;
  }
}
</style>

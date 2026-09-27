<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PieceSlug } from '~/data/pieces'

const root = ref<HTMLElement>()
const active = ref(0)

const moments: { text: string, piece: PieceSlug }[] = [
  { text: 'adding to a lifelong collection,', piece: 'sevres-vases' },
  { text: 'searching for a single remarkable piece,', piece: 'baroque-pearl' },
  { text: 'or choosing a gift meant to become an heirloom.', piece: 'portrait-miniature' },
]

useScene(root, ({ q, motion }) => {
  // The highlighted moment is whichever sits nearest the reading line. Measured
  // on every update, so a fast flick past an item can't leave it stale.
  const items = q('.approach__moment')
  const pick = () => {
    const line = innerHeight * 0.6
    const distances = items.map((item) => {
      const r = item.getBoundingClientRect()
      return Math.abs((r.top + r.bottom) / 2 - line)
    })
    active.value = distances.indexOf(Math.min(...distances))
  }
  ScrollTrigger.create({ trigger: q('.approach__moments')[0], start: 'top bottom', end: 'bottom top', onUpdate: pick, onRefresh: pick })
  if (!motion) return
  revealChars(q('.approach__title')[0]!)
  q('[data-lines]').forEach(text => revealLines(text))
  gsap.fromTo(q('.approach__stage')[0]!, { clipPath: 'inset(12% 12% 12% 12%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)',
    ease: 'none',
    scrollTrigger: { trigger: q('.approach__stage')[0], start: 'top 90%', end: 'top 30%', scrub: 1 },
  })
})
</script>

<template>
  <section id="approach" ref="root" class="approach" data-theme="bone" data-index="VI" data-chapter="How we work">
    <div class="approach__aside">
      <div class="approach__stage">
        <div
          v-for="(m, i) in moments"
          :key="m.piece"
          class="approach__frame"
          :class="{ 'is-active': active === i }"
        >
          <PieceImage :slug="m.piece" loupe ratio="4 / 5" sizes="(min-width: 64rem) 36vw, 80vw" />
        </div>
        <p class="kicker approach__count">{{ String(active + 1).padStart(2, '0') }} / 03</p>
      </div>
    </div>

    <div class="approach__content">
      <p class="kicker"><b>(VI)</b> Our approach</p>
      <h2 class="approach__title">How we <em>work</em></h2>
      <p class="approach__lead" data-lines>
        Collecting at this level rests on trust, and trust is built one conversation at a time.
      </p>

      <p class="kicker approach__you">You may be</p>
      <ol class="approach__moments">
        <li
          v-for="(m, i) in moments"
          :key="m.piece"
          class="approach__moment"
          :class="{ 'is-active': active === i }"
        >
          <span class="approach__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="approach__text">{{ m.text }}</span>
          <span class="approach__thumb" aria-hidden="true">
            <PieceImage :slug="m.piece" ratio="1 / 1" sizes="30vw" />
          </span>
        </li>
      </ol>

      <div class="approach__close">
        <p class="approach__whichever" data-lines>
          Whichever it is, we take the time to understand exactly what you are looking for.
        </p>
        <p data-lines>
          Every inquiry is handled with complete discretion. And with an international network behind us, the search for the right piece never has to end with our own collection.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.approach {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(3rem, 7vw, 8rem);
  padding: clamp(7rem, 14vw, 12rem) var(--pad);
}

.approach__aside {
  position: relative;
}

.approach__stage {
  position: sticky;
  top: 12vh;
  aspect-ratio: 4 / 5;
  max-height: 76vh;
  overflow: hidden;
}

.approach__frame {
  position: absolute;
  inset: 0;
  opacity: 0;
  clip-path: inset(100% 0 0 0);
  transition: opacity 0.6s ease, clip-path 1.1s var(--ease-out);
}

.approach__frame.is-active {
  opacity: 1;
  clip-path: inset(0 0 0 0);
}

.approach__frame :deep(.plate),
.approach__frame :deep(.plate__frame) {
  height: 100%;
}

.approach__frame :deep(.plate__img) {
  transform: scale(1.12);
  transition: opacity 0.9s var(--ease-out), transform 1.6s var(--ease-out);
}

.approach__frame.is-active :deep(.plate__img) {
  transform: scale(1);
}

.approach__count {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(236, 229, 216, 0.85);
  color: #1a1512;
}

.approach__content {
  display: grid;
  align-content: start;
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.approach__title {
  font-size: clamp(3.6rem, 9vw, 11rem);
  letter-spacing: -0.045em;
  line-height: 0.85;
}

.approach__title em {
  color: var(--accent);
}

.approach__lead {
  max-width: 24ch;
  font-family: var(--font-serif);
  font-size: clamp(1.9rem, 3.3vw, 3.6rem);
  letter-spacing: -0.02em;
  line-height: 1.02;
}

.approach__you {
  margin-top: clamp(1rem, 3vw, 2.5rem);
}

.approach__moments {
  margin: -0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.approach__moment {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: 1rem;
  align-items: baseline;
  padding: clamp(1.4rem, 3vw, 2.4rem) 0;
  border-top: 1px solid var(--line);
  opacity: 0.28;
  transition: opacity 0.6s ease;
}

.approach__moment:last-child {
  border-bottom: 1px solid var(--line);
}

.approach__moment.is-active {
  opacity: 1;
}

.approach__num {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent);
}

.approach__text {
  font-family: var(--font-serif);
  font-size: clamp(1.9rem, 3.6vw, 4rem);
  letter-spacing: -0.02em;
  line-height: 1;
}

.approach__thumb {
  display: none;
}

.approach__close {
  display: grid;
  gap: 1.25rem;
  max-width: 36rem;
  margin-top: clamp(1rem, 3vw, 2rem);
}

.approach__whichever {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 2.2vw, 2.2rem);
  line-height: 1.1;
}

@media (max-width: 56rem) {
  .approach {
    grid-template-columns: 1fr;
  }

  .approach__aside {
    display: none;
  }

  .approach__moment {
    grid-template-columns: 2.5rem minmax(0, 1fr) 5rem;
    opacity: 1;
  }

  .approach__thumb {
    display: block;
    width: 5rem;
    align-self: center;
  }
}
</style>

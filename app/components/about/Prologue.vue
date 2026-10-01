<script setup lang="ts">
import { gsap } from 'gsap'
import { piece, type PieceSlug } from '~/data/pieces'

const root = ref<HTMLElement>()

const sentence = 'Some objects are made to be used. A rare few are made to outlast us: the strand of pearls that passes from one generation to the next, the sculpture that has already witnessed centuries, the ring that has lived several lives before it ever reaches your hand.'

// Small plates set into the sentence right after the word they illustrate.
const pillAfter: Record<string, { slug: PieceSlug, position: string }> = {
  objects: { slug: 'egyptian-figure', position: '50% 22%' },
  sculpture: { slug: 'old-centaur', position: '50% 30%' },
  hand: { slug: 'figural-torchere', position: '50% 20%' },
}

type Token = { word: string } | { slug: PieceSlug, position: string }
const tokens: Token[] = sentence.split(' ').flatMap((word) => {
  const pill = pillAfter[word.replace(/\W/g, '')]
  return pill ? [{ word }, pill] : [{ word }]
})

useScene(root, ({ q, motion }) => {
  if (!motion) return
  const tl = gsap.timeline({
    scrollTrigger: { trigger: q('.prologue__text')[0], start: 'top 78%', end: 'bottom 40%', scrub: 0.8 },
  })
  q('.prologue__token').forEach((el, i) => {
    if (el.classList.contains('prologue__pill')) {
      tl.fromTo(el, { scale: 0, rotate: -14 }, { scale: 1, rotate: 0, duration: 2.2, ease: 'back.out(1.8)' }, i * 0.4)
    }
    else {
      tl.fromTo(el, { opacity: 0.13 }, { opacity: 1, duration: 1, ease: 'none' }, i * 0.4)
    }
  })

  revealLines(q('.prologue__body')[0]!)
  gsap.from(q('.prologue__aside > *'), {
    autoAlpha: 0,
    y: 16,
    duration: 1.1,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: q('.prologue__aside')[0], start: 'top 85%', once: true },
  })
})
</script>

<template>
  <section id="prologue" ref="root" class="prologue" data-theme="bone" data-index="I" data-chapter="Prologue">
    <div class="prologue__aside">
      <p class="kicker"><b>(I)</b> Prologue</p>
      <p class="kicker">Six decades<br>of looking closely</p>
    </div>
    <p class="prologue__text">
      <template v-for="(t, i) in tokens" :key="i">
        <span v-if="'word' in t" class="prologue__token prologue__word">{{ t.word }}</span>
        <span v-else class="prologue__token prologue__pill" aria-hidden="true">
          <img :src="piece(t.slug).src(720)" alt="" loading="lazy" decoding="async" :style="{ objectPosition: t.position }">
        </span>
        {{ ' ' }}
      </template>
    </p>
    <div class="prologue__foot">
      <span class="prologue__rule" aria-hidden="true" />
      <p class="prologue__body">
        For more than six decades, Lucentini Antiques &amp; Sculpture has been devoted to finding such pieces, and to placing them with the people who will treasure them next.
      </p>
    </div>
  </section>
</template>

<style scoped>
.prologue {
  position: relative;
  padding: clamp(7rem, 16vw, 13rem) var(--pad) clamp(6rem, 12vw, 10rem);
}

.prologue__aside {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: clamp(2.5rem, 6vw, 5rem);
}

.prologue__aside p:last-child {
  text-align: right;
}

.prologue__text {
  max-width: 76rem;
  font-family: var(--font-serif);
  font-size: clamp(2.1rem, 5.1vw, 6rem);
  letter-spacing: -0.022em;
  line-height: 1.04;
  text-indent: clamp(0rem, 14vw, 16rem);
  text-wrap: pretty;
}

.prologue__word {
  display: inline;
}

.prologue__pill {
  display: inline-block;
  width: 1.9em;
  height: 0.8em;
  margin-inline: 0.04em;
  overflow: hidden;
  border-radius: 999px;
  background: var(--line);
  vertical-align: -0.04em;
  text-indent: 0;
}

.prologue__pill img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prologue__foot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: var(--pad);
  align-items: start;
  margin-top: clamp(3.5rem, 8vw, 7rem);
}

.prologue__rule {
  height: 1px;
  margin-top: 0.8em;
  background: var(--line);
}

.prologue__body {
  max-width: 32rem;
  font-size: clamp(1.1rem, 1rem + 0.45vw, 1.45rem);
  line-height: 1.45;
}

@media (max-width: 48rem) {
  .prologue__foot {
    grid-template-columns: 1fr;
  }

  .prologue__rule {
    display: none;
  }
}
</style>

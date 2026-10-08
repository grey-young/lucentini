<script setup lang="ts">
import { gsap } from 'gsap'

const root = ref<HTMLElement>()

// Chart coordinates (viewBox 1200 x 600). Positions are schematic, not to scale.
// San Diego sits on the far (Pacific) side of the United States.
const us = { x: 215, y: 340 }
const uk = { x: 880, y: 220 }
const atlantic = `M${us.x} ${us.y}C420 80 740 50 ${uk.x} ${uk.y}`
const network = [
  { d: `M${uk.x} ${uk.y}C960 150 1060 150 1110 205`, end: [1110, 205] },
  { d: `M${uk.x} ${uk.y}C980 250 1050 300 1065 370`, end: [1065, 370] },
  { d: `M${uk.x} ${uk.y}C930 330 960 420 945 500`, end: [945, 500] },
  { d: `M${uk.x} ${uk.y}C800 330 700 420 610 470`, end: [610, 470] },
  { d: `M${us.x} ${us.y}C240 380 200 430 170 470`, end: [170, 470] },
  { d: `M${us.x} ${us.y}C340 400 410 450 470 480`, end: [470, 480] },
]
const meridians = [120, 280, 440, 600, 760, 920, 1080].map(x => `M${x} 40Q${x + (x - 600) * 0.16} 300 ${x} 560`)
const parallels = [100, 200, 300, 400, 500]
const pct = (x: number, y: number) => ({ left: `${(x / 1200) * 100}%`, top: `${(y / 600) * 100}%` })

useScene(root, ({ el, q, motion, desktop }) => {
  if (!motion) return
  revealChars(q('.today__title')[0]!)
  q('[data-lines]').forEach(text => revealLines(text))
  gsap.from(q('.today__facts > div'), {
    autoAlpha: 0,
    y: 24,
    duration: 1.1,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: q('.today__facts')[0], start: 'top 90%', once: true },
  })

  const arcs = q('.atlantic__arc') as unknown as SVGPathElement[]
  arcs.forEach((path) => {
    const length = path.getTotalLength()
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
  })
  const [main, ...rest] = arcs
  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: q('.atlantic')[0], start: 'top 78%', end: 'bottom 50%', scrub: 1 },
  })
    .from(q('.atlantic__point'), { scale: 0, transformOrigin: '50% 50%', duration: 0.15, stagger: 0.1, ease: 'back.out(2)' })
    .from(q('.atlantic__label--place'), { autoAlpha: 0, y: 12, duration: 0.2, stagger: 0.1 }, '<')
    .to(main!, { strokeDashoffset: 0, duration: 1 })
    .to(q('.atlantic__traveller')[0]!, {
      motionPath: { path: main!, align: main!, alignOrigin: [0.5, 0.5] },
      duration: 1,
    }, '<')
    .from(q('.atlantic__label--sea'), { autoAlpha: 0, y: 12, duration: 0.25 }, '-=0.5')
    .to(rest, { strokeDashoffset: 0, duration: 0.6, stagger: 0.1 })
    .from(q('.atlantic__node'), { scale: 0, transformOrigin: '50% 50%', duration: 0.15, stagger: 0.1 }, '-=0.5')
    .from(q('.atlantic__label--net'), { autoAlpha: 0, duration: 0.25 })

  q('.today__plate').forEach((plate) => {
    revealPlate(plate.querySelector('.plate__frame')!)
    if (desktop) parallax(plate, Number(plate.dataset.drift))
  })
  parallax(q('.today__glow')[0]!, 120, el)

  revealChars(q('.maker__title')[0]!)
  revealPlate(q('.maker__frame')[0]!)
  if (desktop) parallax(q('.maker__portrait')[0]!, 40)
})
</script>

<template>
  <section id="today" ref="root" class="today" data-theme="verdigris" data-index="IV" data-chapter="An inherited eye">
    <div class="today__glow" aria-hidden="true" />
    <header class="today__head">
      <p class="kicker"><b>(IV)</b> Chapter two</p>
      <p class="kicker">The present day</p>
    </header>
    <h2 class="today__title">An inherited <em>eye</em></h2>

    <div class="today__intro">
      <p class="today__lead" data-lines>
        Today, the house is led by Hortencia’s granddaughter, Lucentini M. Casas.
      </p>
      <dl class="today__facts">
        <div>
          <dt class="kicker">Owner &amp; lead dealer</dt>
          <dd>Lucentini M. Casas</dd>
        </div>
        <div>
          <dt class="kicker">Born</dt>
          <dd>Birmingham, England</dd>
        </div>
        <div>
          <dt class="kicker">Raised</dt>
          <dd>Harborne &amp; San Diego, California</dd>
        </div>
        <div>
          <dt class="kicker">At the helm</dt>
          <dd>Eight years</dd>
        </div>
      </dl>
    </div>

    <figure class="atlantic">
      <div class="atlantic__chart">
        <svg viewBox="0 0 1200 600" aria-hidden="true">
          <g class="atlantic__grid">
            <path v-for="d in meridians" :key="d" :d="d" />
            <path v-for="y in parallels" :key="y" :d="`M40 ${y}H1160`" stroke-dasharray="2 7" />
          </g>
          <path class="atlantic__arc atlantic__arc--main" :d="atlantic" />
          <path v-for="n in network" :key="n.d" class="atlantic__arc atlantic__arc--net" :d="n.d" />
          <circle v-for="n in network" :key="`node-${n.d}`" class="atlantic__node" :cx="n.end[0]" :cy="n.end[1]" r="4" />
          <circle class="atlantic__point" :cx="us.x" :cy="us.y" r="7" />
          <circle class="atlantic__point" :cx="uk.x" :cy="uk.y" r="7" />
          <circle class="atlantic__traveller" :cx="us.x" :cy="us.y" r="5" />
        </svg>
        <p class="atlantic__label atlantic__label--place atlantic__label--us" :style="pct(us.x, us.y)">
          <span class="atlantic__place">San Diego, California</span>
          <span class="kicker">32.72° N, 117.16° W</span>
        </p>
        <p class="atlantic__label atlantic__label--place atlantic__label--uk" :style="pct(uk.x, uk.y)">
          <span class="atlantic__place">Birmingham · Harborne</span>
          <span class="kicker">52.46° N, 1.95° W</span>
        </p>
        <p class="atlantic__label atlantic__label--sea" :style="pct(585, 118)"><em>The Atlantic</em></p>
        <p class="atlantic__label atlantic__label--net" :style="pct(1075, 545)">
          <span class="kicker">Suppliers &amp; dealerships<br>across continents</span>
        </p>
      </div>
      <figcaption class="kicker atlantic__caption">A foot on each side of the Atlantic</figcaption>
    </figure>

    <div class="today__story">
      <div class="today__plate today__plate--map" data-drift="50">
        <PieceImage slug="officer-bust" caption link sizes="(min-width: 64rem) 24vw, 70vw" />
      </div>
      <div class="today__copy">
        <p class="today__body" data-lines>
          Born in Birmingham, England, and raised between Harborne and San Diego, California, Lucentini grew up with a foot on each side of the Atlantic. Inspired by her grandmother’s legacy, she stepped in as owner and lead dealer eight years ago. Her aim was to honor everything Hortencia built while carrying it into a new era.
        </p>
        <p class="today__big" data-lines>
          Under Lucentini’s direction, the house has modernized and grown into a global operation, connecting suppliers and dealerships across continents.
        </p>
      </div>
      <div class="today__plate today__plate--globe" data-drift="-60">
        <PieceImage slug="figural-torchere" caption link sizes="(min-width: 64rem) 20vw, 60vw" />
      </div>
    </div>

    <article class="maker" aria-labelledby="maker-title">
      <figure class="maker__portrait">
        <div class="maker__frame">
          <img
            src="/images/owner/lucentini-720.webp"
            srcset="/images/owner/lucentini-720.webp 720w, /images/owner/lucentini-1400.webp 768w"
            sizes="(min-width: 56rem) 34vw, 80vw"
            width="768"
            height="960"
            alt="Portrait of Lucentini M. Casas"
            loading="lazy"
            decoding="async"
          >
        </div>
        <figcaption class="maker__caption kicker">
          <span>Lucentini M. Casas</span>
          <span>Owner, dealer &amp; sculptor</span>
        </figcaption>
      </figure>

      <div class="maker__text">
        <p class="kicker">The sculptor</p>
        <h3 id="maker-title" class="maker__title">In her own <em>hand</em></h3>
        <p class="maker__lead" data-lines>
          Lucentini has been drawn to all things creative since she was a young child. Growing up surrounded by art and history, a life spent making it was never far away.
        </p>
        <div class="maker__body">
          <p data-lines>
            She earned a first-class honours degree, yet all through her studies she spent her spare hours in the foundry. There, at her grandmother’s side, she mastered the many aspects of sculpture and antiques, helping with her grandmother’s work and learning with every piece.
          </p>
          <p data-lines>
            It was her grandmother who encouraged her to find a hand of her own. Today Lucentini sculpts in a style that is entirely hers, portraying her subjects in a way that is warm, playful, and endearing.
          </p>
        </div>
        <p class="maker__quote" data-lines>
          She is part of every stage of a piece’s life, from the first form in clay to the final finish.
        </p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.today {
  position: relative;
  padding: clamp(6rem, 12vw, 10rem) var(--pad) clamp(7rem, 14vw, 12rem);
  overflow: hidden;
}

.today__glow {
  position: absolute;
  top: 10%;
  right: -20%;
  width: 70vw;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(143, 194, 168, 0.12), transparent 65%);
  pointer-events: none;
}

.today__head {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.today__title {
  margin-top: clamp(2rem, 5vw, 4rem);
  font-size: clamp(3.6rem, 12vw, 15rem);
  letter-spacing: -0.045em;
  line-height: 0.85;
}

.today__title em {
  color: var(--accent);
}

.today__intro {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: clamp(2.5rem, 6vw, 6rem);
  margin-top: clamp(3rem, 6vw, 5rem);
}

.today__lead {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 3.8vw, 4rem);
  letter-spacing: -0.02em;
  line-height: 1.02;
}

.today__facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem 1.25rem;
  margin: 0;
  align-content: start;
}

.today__facts > div {
  display: grid;
  gap: 0.4rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--line);
}

.today__facts dd {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 1.4rem;
  line-height: 1.1;
}

.atlantic {
  margin: clamp(4rem, 9vw, 8rem) 0 0;
}

.atlantic__chart {
  position: relative;
}

.atlantic__chart svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.atlantic__grid path {
  fill: none;
  stroke: var(--line);
  stroke-width: 1;
}

.atlantic__arc {
  fill: none;
  stroke-linecap: round;
}

.atlantic__arc--main {
  stroke: var(--accent);
  stroke-width: 2;
}

.atlantic__arc--net {
  stroke: var(--fg);
  stroke-width: 1;
  stroke-dasharray: 3 5;
  opacity: 0.55;
}

.atlantic__point {
  fill: var(--accent);
  stroke: var(--bg);
  stroke-width: 3;
}

.atlantic__node {
  fill: var(--fg);
}

.atlantic__traveller {
  fill: var(--fg);
  filter: drop-shadow(0 0 6px rgba(143, 194, 168, 0.9));
}

.atlantic__label {
  position: absolute;
  display: grid;
  gap: 0.15rem;
}

.atlantic__label--us {
  transform: translate(-50%, 1.4rem);
  text-align: center;
}

.atlantic__label--uk {
  transform: translate(1.2rem, -125%);
}

.atlantic__place {
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 1.8vw, 1.9rem);
  line-height: 1;
}

.atlantic__label--sea {
  transform: translate(-50%, -50%);
  font-family: var(--font-serif);
  font-size: clamp(1.2rem, 2.4vw, 2.6rem);
  color: var(--accent);
}

.atlantic__label--net {
  transform: translate(-50%, 0);
  text-align: center;
}

.atlantic__caption {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
}

.today__story {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 5fr) minmax(0, 2.6fr);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: start;
  margin-top: clamp(5rem, 10vw, 9rem);
}

.today__copy {
  display: grid;
  gap: 2.5rem;
  padding-top: clamp(0rem, 8vw, 8rem);
}

.today__body {
  max-width: 34rem;
  font-size: clamp(1.05rem, 1rem + 0.3vw, 1.25rem);
}

.today__big {
  font-family: var(--font-serif);
  font-size: clamp(1.9rem, 3.1vw, 3.3rem);
  letter-spacing: -0.02em;
  line-height: 1.04;
}

.today__plate--globe {
  margin-top: clamp(6rem, 18vw, 18rem);
}

.maker {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(2.5rem, 7vw, 7rem);
  align-items: start;
  margin-top: clamp(6rem, 12vw, 11rem);
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--line);
}

.maker__portrait {
  margin: 0;
}

/* Graded toward the house palette: a touch of warmth, cooler blues pulled
   back, and a verdigris wash in the shadows so it sits with the bronzes. */
.maker__frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: #3d4a48;
}

.maker__frame img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.82) sepia(0.14) contrast(1.04);
}

.maker__frame::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(18, 32, 29, 0.45), transparent 45%),
    rgba(143, 194, 168, 0.08);
  mix-blend-mode: multiply;
  pointer-events: none;
}

.maker__caption {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.85rem;
}

.maker__text {
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.25rem);
  padding-top: clamp(0rem, 4vw, 4rem);
}

.maker__title {
  font-size: clamp(3rem, 7vw, 8rem);
  letter-spacing: -0.04em;
  line-height: 0.88;
}

.maker__title em {
  color: var(--accent);
}

.maker__lead {
  max-width: 38rem;
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 2.6vw, 2.7rem);
  letter-spacing: -0.015em;
  line-height: 1.06;
}

.maker__body {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.25rem, 3vw, 2.5rem);
  max-width: 46rem;
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.15rem);
}

.maker__quote {
  max-width: 34rem;
  padding-left: 1.25rem;
  border-left: 1px solid var(--accent);
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 1.9vw, 1.9rem);
  font-style: italic;
  line-height: 1.15;
  color: var(--accent);
}

@media (max-width: 56rem) {
  .today__intro,
  .today__story,
  .maker,
  .maker__body {
    grid-template-columns: 1fr;
  }

  .maker__portrait {
    width: 80%;
  }

  .today__plate--map {
    width: 70%;
  }

  .today__plate--globe {
    width: 55%;
    margin: 0 0 0 auto;
  }

  .atlantic__label--us .kicker,
  .atlantic__label--uk .kicker,
  .atlantic__label--net {
    display: none;
  }
}
</style>

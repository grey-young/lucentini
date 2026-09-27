<script setup lang="ts">
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { allPieces, isPieceSlug, piece } from '~/data/pieces'
import { contact } from '~/data/site'

const route = useRoute()
const slug = route.params.slug
if (!isPieceSlug(slug)) throw createError({ statusCode: 404, statusMessage: 'Piece not found', fatal: true })

const p = piece(slug)
const pieces = allPieces()
const at = pieces.findIndex(x => x.slug === p.slug)
const prev = pieces[(at - 1 + pieces.length) % pieces.length]!
const next = pieces[(at + 1) % pieces.length]!
// Three more from the same discipline, topped up from the lots that follow.
const related = [
  ...pieces.filter(x => x.discipline.id === p.discipline.id && x.slug !== p.slug),
  ...[...pieces.slice(at + 1), ...pieces.slice(0, at)].filter(x => x.discipline.id !== p.discipline.id),
].slice(0, 3)

const url = useRequestURL()
const pageUrl = `${url.origin}${p.href}`
const description = p.note

useSeoMeta({
  title: p.title,
  description,
  ogTitle: `${p.title} | Lucentini Antiques & Sculpture`,
  ogDescription: description,
  ogType: 'website',
  ogImage: p.src(1400),
})

useHead({
  script: [{
    type: 'application/ld+json',
    textContent: {
      '@context': 'https://schema.org',
      '@type': 'VisualArtwork',
      'name': p.title,
      description,
      'image': `${url.origin}${p.src(1400)}`,
      'dateCreated': p.date.replace(/\n/g, '; '),
      'artMedium': p.medium?.replace(/\n/g, '; ') ?? undefined,
      'creator': p.artist ? { '@type': 'Person', 'name': p.artist } : undefined,
    },
  }],
})

const specs = [
  { label: 'Maker', value: p.artist },
  { label: 'Date', value: p.date },
  { label: 'Medium', value: p.medium },
  { label: 'Discipline', value: p.discipline.title },
].filter(s => s.value)

const inquiry = `Hello,\n\nI would like to ask about Lot ${p.lot}, ${p.title} (${p.meta}), or pieces like it.\n\n${pageUrl}`
const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(`Inquiry: ${p.title}`)}&body=${encodeURIComponent(inquiry)}`
const whatsapp = `${contact.whatsapp}?text=${encodeURIComponent(inquiry)}`

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined
async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href)
    copied.value = true
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => { copied.value = false }, 2200)
  }
  catch {}
}

// The arrow keys walk the catalogue.
function onKey(event: KeyboardEvent) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
  if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return
  if (event.key === 'ArrowLeft') navigateTo(prev.href)
  if (event.key === 'ArrowRight') navigateTo(next.href)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  clearTimeout(copiedTimer)
})

const root = ref<HTMLElement>()
const ready = useSiteReady()

useThemeScroll(root)

useScene(root, ({ q, motion, desktop }) => {
  if (!motion) return
  const title = SplitText.create(q('.product__title')[0]!, { type: 'lines,chars', mask: 'lines' })
  const frame = q('.product__media .plate__frame')[0]!
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' }, 0)
    .fromTo(q('.product__media .plate__img')[0]!, { scale: 1.3 }, { scale: 1, duration: 2.2 }, 0.1)
    .from(title.chars, { yPercent: 115, rotate: 4, duration: 1.3, stagger: 0.012 }, 0.3)
    .from(q('.product__fade'), { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.07 }, 0.55)
  const stop = watch(ready, (isReady) => {
    if (isReady) intro.play()
  }, { immediate: true })

  const detail = q('.detail__img')[0]
  if (detail) {
    gsap.fromTo(detail, { scale: 1.7, yPercent: -6 }, {
      scale: 1.25,
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: q('.detail')[0], start: 'top bottom', end: 'bottom top', scrub: true },
    })
    revealLines(q('.detail__text')[0]!)
  }

  revealChars(q('.more__title')[0]!)
  gsap.from(q('.more__item'), {
    autoAlpha: 0,
    y: 70,
    duration: 1.3,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: q('.more__grid')[0], start: 'top 88%', once: true },
  })
  gsap.from(q('.lots__link'), {
    autoAlpha: 0,
    y: desktop ? 40 : 20,
    duration: 1.2,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: q('.lots')[0], start: 'top 92%', once: true },
  })

  return () => stop()
})
</script>

<template>
  <div ref="root">
    <section
      class="product"
      :data-theme="p.theme"
      :data-index="`Lot ${p.lot}`"
      :data-chapter="p.discipline.title"
    >
      <nav class="product__crumbs kicker product__fade" aria-label="Breadcrumb">
        <NuxtLink to="/collection">The collection</NuxtLink>
        <span aria-hidden="true">/</span>
        <NuxtLink :to="{ path: '/collection', query: { d: p.discipline.id } }">{{ p.discipline.title }}</NuxtLink>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Lot {{ p.lot }} of {{ pieces.length }}</span>
      </nav>

      <div class="product__grid">
        <div class="product__media" :style="{ '--w': p.width, '--h': p.height }">
          <PieceImage
            :slug="p.slug"
            loupe
            eager
            fit="contain"
            sizes="(min-width: 64rem) 50vw, 92vw"
          />
          <p v-if="p.zoom" class="kicker product__hint product__fade">
            <span class="product__hint-fine">Hover the piece to look closer</span>
            <span class="product__hint-touch">Detail below</span>
          </p>
        </div>

        <div class="product__info">
          <p class="kicker product__fade"><b>Lot {{ p.lot }}</b> · {{ p.discipline.title }}</p>
          <h1 class="product__title">{{ p.title }}</h1>
          <p class="product__meta product__fade">{{ p.meta }}</p>
          <p class="product__note product__fade">{{ p.note }}</p>

          <dl class="product__specs product__fade">
            <div v-for="s in specs" :key="s.label">
              <dt class="kicker">{{ s.label }}</dt>
              <dd>{{ s.value }}</dd>
            </div>
            <div>
              <dt class="kicker">Availability</dt>
              <dd>By private inquiry</dd>
            </div>
          </dl>

          <div id="inquire" class="product__inquire product__fade">
            <p class="product__price">Price on request</p>
            <div class="product__actions">
              <a class="product__cta" :href="mailto" data-magnetic>
                Inquire about this piece <span aria-hidden="true">↗</span>
              </a>
              <a class="product__pill" :href="whatsapp" target="_blank" rel="noopener" data-magnetic>WhatsApp</a>
              <button type="button" class="product__pill" data-magnetic @click="copyLink">
                <Transition name="swap" mode="out-in">
                  <span :key="String(copied)">{{ copied ? 'Link copied' : 'Copy link' }}</span>
                </Transition>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="p.zoom" class="detail" data-theme="ink" data-index="↘" data-chapter="Look closer">
      <div class="detail__frame">
        <img
          class="detail__img"
          :src="p.src(2400)"
          :data-loupe="p.src(2400)"
          :width="p.width"
          :height="p.height"
          alt=""
          loading="lazy"
          decoding="async"
        >
      </div>
      <div class="detail__label">
        <p class="kicker"><b>(↘)</b> Detail</p>
        <p class="detail__text">Closer, the hand of the maker comes forward.</p>
      </div>
    </section>

    <section class="more" data-theme="parchment" data-index="+" data-chapter="More from the collection">
      <header class="more__head">
        <p class="kicker"><b>(+)</b> More from the collection</p>
        <NuxtLink class="more__all kicker" to="/collection">View all {{ pieces.length }} pieces →</NuxtLink>
      </header>
      <h2 class="more__title">Also in <em>{{ p.discipline.title }}</em></h2>

      <ul class="more__grid">
        <li v-for="r in related" :key="r.slug" class="more__item">
          <PieceCard :piece="r" sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 90vw" />
        </li>
      </ul>

      <nav class="lots" aria-label="Neighbouring lots">
        <NuxtLink :to="prev.href" class="lots__link lots__link--prev">
          <span class="lots__thumb" aria-hidden="true"><img :src="prev.src(720)" alt="" loading="lazy" decoding="async"></span>
          <span class="lots__text">
            <span class="kicker">← Previous · Lot {{ prev.lot }}</span>
            <span class="lots__title">{{ prev.title }}</span>
          </span>
        </NuxtLink>
        <NuxtLink :to="next.href" class="lots__link lots__link--next">
          <span class="lots__text">
            <span class="kicker">Next · Lot {{ next.lot }} →</span>
            <span class="lots__title">{{ next.title }}</span>
          </span>
          <span class="lots__thumb" aria-hidden="true"><img :src="next.src(720)" alt="" loading="lazy" decoding="async"></span>
        </NuxtLink>
      </nav>
    </section>
  </div>
</template>

<style scoped>
.product {
  position: relative;
  padding: clamp(7rem, 11vw, 9rem) var(--pad) clamp(5rem, 10vw, 8rem);
}

.product__crumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.75rem;
}

.product__crumbs a {
  transition: color 0.3s ease;
}

.product__crumbs a:hover {
  color: var(--fg);
}

.product__crumbs [aria-current] {
  color: var(--fg);
}

.product__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: clamp(2.5rem, 6vw, 7rem);
  align-items: start;
  margin-top: clamp(2rem, 4vw, 3.5rem);
}

/* The piece stays in view while its details scroll past, and never outgrows the screen. */
.product__media {
  position: sticky;
  top: 6.5rem;
  display: grid;
  justify-items: center;
  gap: 1rem;
}

.product__media :deep(.plate) {
  width: min(100%, calc(76vh * var(--w) / var(--h)));
  width: min(100%, calc(76svh * var(--w) / var(--h)));
}

.product__hint {
  display: flex;
  justify-content: center;
}

.product__hint-touch {
  display: none;
}

@media (hover: none), (pointer: coarse) {
  .product__hint-fine {
    display: none;
  }

  .product__hint-touch {
    display: inline;
  }
}

.product__info {
  display: grid;
  gap: 1.5rem;
  padding-top: clamp(0rem, 3vw, 2.5rem);
}

.product__info > .kicker b {
  color: var(--accent);
}

.product__title {
  font-size: clamp(2.6rem, 5.2vw, 6rem);
  letter-spacing: -0.035em;
  line-height: 0.92;
  text-wrap: balance;
}

.product__meta {
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 1.8vw, 1.8rem);
  font-style: italic;
  line-height: 1.15;
  color: var(--accent);
}

.product__note {
  max-width: 34rem;
  font-size: clamp(1.02rem, 1rem + 0.25vw, 1.2rem);
}

.product__specs {
  display: grid;
  margin: 0.5rem 0 0;
}

.product__specs > div {
  display: grid;
  grid-template-columns: minmax(7rem, 1fr) minmax(0, 2.4fr);
  gap: 1rem;
  padding: 0.85rem 0;
  border-top: 1px solid var(--line);
}

.product__specs > div:last-child {
  border-bottom: 1px solid var(--line);
}

.product__specs dt {
  padding-top: 0.2rem;
}

.product__specs dd {
  margin: 0;
  white-space: pre-line;
}

.product__inquire {
  display: grid;
  gap: 1.25rem;
  margin-top: 0.5rem;
  scroll-margin-top: 7rem;
}

.product__price {
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 2.6vw, 2.6rem);
  line-height: 1;
}

.product__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.product__cta,
.product__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.95rem 1.4rem;
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

.product__cta {
  border-color: var(--fg);
  background: var(--fg);
  color: var(--bg);
}

.product__cta:hover {
  border-color: var(--accent);
  background: var(--accent);
}

.product__pill:hover {
  border-color: var(--fg);
  background: var(--fg);
  color: var(--bg);
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.25s ease;
}

.swap-enter-from,
.swap-leave-to {
  opacity: 0;
}

.detail {
  position: relative;
}

.detail__frame {
  position: relative;
  height: 90vh;
  height: 90svh;
  overflow: hidden;
  background: #050404;
}

.detail__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.4);
}

.detail__label {
  position: absolute;
  right: var(--pad);
  bottom: 2rem;
  left: var(--pad);
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  color: #ede6da;
  pointer-events: none;
}

.detail__label .kicker {
  color: rgba(237, 230, 218, 0.7);
}

.detail__label .kicker b {
  color: #ede6da;
}

.detail__text {
  max-width: 14ch;
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4.4vw, 4.6rem);
  letter-spacing: -0.025em;
  line-height: 0.98;
  text-align: right;
  text-shadow: 0 2px 30px rgba(0, 0, 0, 0.45);
}

.more {
  padding: clamp(6rem, 12vw, 10rem) var(--pad) clamp(5rem, 10vw, 8rem);
}

.more__head {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.more__all {
  color: var(--fg);
  transition: color 0.3s ease;
}

.more__all:hover {
  color: var(--accent);
}

.more__title {
  margin-top: clamp(1.5rem, 4vw, 3rem);
  font-size: clamp(3rem, 9vw, 10rem);
  letter-spacing: -0.045em;
  line-height: 0.88;
}

.more__title em {
  color: var(--accent);
}

.more__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(2.5rem, 5vw, 5rem) clamp(1.25rem, 3vw, 3rem);
  margin: clamp(3rem, 7vw, 6rem) 0 0;
  padding: 0;
  list-style: none;
}

.lots {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: clamp(5rem, 10vw, 8rem);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.lots__link {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 2rem);
  padding: clamp(1.5rem, 3vw, 2.5rem) 0;
}

.lots__link--prev {
  padding-right: clamp(1rem, 2vw, 2rem);
  border-right: 1px solid var(--line);
}

.lots__link--next {
  justify-content: flex-end;
  padding-left: clamp(1rem, 2vw, 2rem);
  text-align: right;
}

.lots__thumb {
  flex: none;
  width: clamp(4.5rem, 8vw, 7.5rem);
  aspect-ratio: 4 / 5;
  overflow: hidden;
}

.lots__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s var(--ease-out);
}

.lots__link:hover .lots__thumb img,
.lots__link:focus-visible .lots__thumb img {
  transform: scale(1.1);
}

.lots__text {
  display: grid;
  gap: 0.5rem;
  min-width: 0;
}

.lots__title {
  display: -webkit-box;
  overflow: hidden;
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 2.6vw, 2.6rem);
  letter-spacing: -0.02em;
  line-height: 1;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: color 0.4s ease;
}

.lots__link:hover .lots__title,
.lots__link:focus-visible .lots__title {
  color: var(--accent);
  font-style: italic;
}

@media (max-width: 64rem) {
  .product__grid {
    grid-template-columns: 1fr;
  }

  .product__media {
    position: relative;
    top: auto;
  }

  .product__info {
    padding-top: 0;
  }

  .more__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .more__item:nth-child(3) {
    display: none;
  }
}

@media (max-width: 40rem) {
  .product__media :deep(.plate) {
    width: 100%;
  }

  .detail__frame {
    height: 70vh;
    height: 70svh;
  }

  .detail__label {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail__text {
    text-align: left;
  }

  .more__grid,
  .lots {
    grid-template-columns: 1fr;
  }

  .more__item:nth-child(3) {
    display: block;
  }

  .lots__link--prev {
    padding-right: 0;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .lots__link--next {
    padding-left: 0;
  }

  .more__head .more__all {
    display: none;
  }
}
</style>

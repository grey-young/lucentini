<script setup lang="ts">
import { gsap } from 'gsap'
import { chapters, contact, pages } from '~/data/site'

const root = ref<HTMLElement>()
const scrollTo = useScrollTo()
const goTo = useGoTo()
const year = new Date().getFullYear()

useScene(root, ({ q, motion }) => {
  if (!motion) return
  gsap.from(q('.site-footer__letter'), {
    yPercent: 105,
    duration: 1.6,
    ease: 'expo.out',
    stagger: 0.06,
    scrollTrigger: { trigger: q('.site-footer__word')[0], start: 'top 98%', once: true },
  })
  gsap.from(q('.site-footer__col'), {
    autoAlpha: 0,
    y: 24,
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: { trigger: q('.site-footer__grid')[0], start: 'top 90%', once: true },
  })
})
</script>

<template>
  <footer ref="root" class="site-footer" data-theme="ink" data-index="—" data-chapter="Colophon">
    <div class="site-footer__grid">
      <div class="site-footer__col">
        <p class="kicker">The house</p>
        <p class="site-footer__tag">Family-owned<br><em>since 1963.</em></p>
      </div>
      <nav class="site-footer__col" aria-label="Site index">
        <p class="kicker">Index</p>
        <ol class="site-footer__list">
          <li v-for="c in [...chapters, ...pages]" :key="c.href">
            <a :href="c.href" @click.prevent="goTo(c.href)"><span>{{ c.index }}</span>{{ c.title }}</a>
          </li>
        </ol>
      </nav>
      <div class="site-footer__col">
        <p class="kicker">Inquiries</p>
        <ul class="site-footer__list">
          <li><a :href="`mailto:${contact.email}`" class="site-footer__email">{{ contact.email }}</a></li>
          <li><a :href="contact.whatsapp" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a :href="contact.tel">{{ contact.phone }}</a></li>
        </ul>
      </div>
    </div>
    <p class="site-footer__word" aria-hidden="true">
      <span v-for="(letter, i) in 'Lucentini'" :key="i" class="site-footer__mask"><span class="site-footer__letter">{{ letter }}</span></span>
    </p>
    <div class="site-footer__base">
      <span>© {{ year }} Lucentini Antiques &amp; Sculpture</span>
      <a href="#main" @click.prevent="scrollTo(0)">Back to top ↑</a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  padding: clamp(5rem, 12vw, 9rem) var(--pad) 1.5rem;
  overflow: hidden;
}

.site-footer__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2.5rem var(--pad);
}

.site-footer__col {
  display: grid;
  align-content: start;
  gap: 1rem;
}

.site-footer__tag {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 3vw, 2.9rem);
  line-height: 1;
}

.site-footer__tag em {
  color: var(--accent);
}

.site-footer__list {
  display: grid;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-footer__list a {
  display: inline-flex;
  gap: 0.75rem;
  transition: color 0.3s ease;
}

.site-footer__list a span {
  width: 1.8rem;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  line-height: 1.9;
}

.site-footer__list a:hover {
  color: var(--accent);
}

.site-footer__email {
  overflow-wrap: anywhere;
}

.site-footer__word {
  display: flex;
  justify-content: space-between;
  margin: clamp(3rem, 8vw, 6rem) 0 0;
  font-family: var(--font-serif);
  font-size: 23.2vw;
  letter-spacing: -0.03em;
  line-height: 0.8;
  color: var(--fg);
}

.site-footer__mask {
  display: block;
  overflow: hidden;
  padding-bottom: 0.04em;
}

.site-footer__letter {
  display: block;
}

.site-footer__base {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
}

.site-footer__base a:hover {
  color: var(--fg);
}

@media (max-width: 64rem) {
  .site-footer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 36rem) {
  .site-footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>

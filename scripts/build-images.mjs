// Builds the site imagery from the photographs in public/images/pieces new:
// writes optimized WebP variants to public/images/pieces and records each
// piece's details in app/data/pieces.json.
//
// Run with: npm run images
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'public', 'images', 'pieces new')
const outDir = join(root, 'public', 'images', 'pieces')
const manifestPath = join(root, 'app', 'data', 'pieces.json')

const photo = n => `photo_${n}_2026-10-01_09-08-29.jpg`

// The lead photograph for each piece, any further views shown as details on
// its page, and the catalogue details.
const pieces = [
  {
    slug: 'crowned-lion',
    image: photo(4),
    title: 'Crowned Lion and Gilded Lioness',
    date: 'Contemporary',
    origin: null,
    artist: null,
    medium: 'Patinated and gilt bronze',
  },
  {
    slug: 'old-centaur',
    image: photo(1),
    title: 'Old Centaur',
    date: '2nd century',
    origin: 'Rome',
    artist: 'Aristeas and Papias of Aphrodisias',
    medium: 'Bigio morato marble',
  },
  {
    slug: 'egyptian-figure',
    image: photo(2),
    views: [photo(3), photo(6), photo(11)],
    title: 'Egyptian Figure with a Vase',
    date: 'Late 19th century',
    origin: null,
    artist: null,
    medium: 'Gilt and patinated bronze, rouge marble\nOn a stepped marble base',
  },
  {
    slug: 'orientalist-warrior',
    image: photo(13),
    title: 'Orientalist Warrior with a Censer',
    date: 'Late 19th century',
    origin: null,
    artist: null,
    medium: 'Patinated bronze',
  },
  {
    slug: 'horse-head',
    image: photo(10),
    title: 'Horse Head',
    date: 'Contemporary',
    origin: null,
    artist: null,
    medium: 'Patinated bronze, on a steel stand',
  },
  {
    slug: 'officer-bust',
    image: photo(15),
    title: 'Portrait Bust of an Officer',
    date: '20th century',
    origin: null,
    artist: null,
    medium: 'Cast, with a dark patina',
  },
  {
    slug: 'figural-torchere',
    image: photo(12),
    views: [photo(14)],
    title: 'Figural Torchère',
    date: '19th or early 20th century',
    origin: null,
    artist: null,
    medium: 'Carved, painted, and parcel-gilt wood',
  },
]

const widths = [720, 1400, 2400]
// Sources at least this wide hold up under the loupe.
const zoomMin = 1100

async function variants(file, name) {
  const source = join(srcDir, file)
  const { width, height } = await sharp(source).metadata()
  for (const w of widths) {
    await sharp(source)
      .resize({ width: Math.min(w, width) })
      .webp({ quality: w === 2400 ? 82 : 78, effort: 5 })
      .toFile(join(outDir, `${name}-${w}.webp`))
  }
  return { width, height }
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const manifest = {}
for (const { slug, image, views = [], ...details } of pieces) {
  const { width, height } = await variants(image, slug)
  const { dominant } = await sharp(join(srcDir, image)).stats()
  const detailViews = []
  for (const [i, view] of views.entries()) {
    detailViews.push(await variants(view, `${slug}-view-${i + 1}`))
  }

  manifest[slug] = {
    ...details,
    width,
    height,
    color: `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
    zoom: width >= zoomMin,
    views: detailViews,
  }
  console.log(`${slug}: ${details.title} (${width}x${height}, ${views.length} views)`)
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`\nWrote ${Object.keys(manifest).length} pieces to ${manifestPath}`)
console.log(`Sources used: ${pieces.flatMap(p => [p.image, ...(p.views ?? [])]).length} of ${readdirSync(srcDir).length}`)

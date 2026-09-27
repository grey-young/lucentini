// Downloads the editorial imagery for the site from the Art Institute of Chicago's
// open-access collection (public-domain works, CC0 images), writes optimized WebP
// variants to public/images/pieces, and records credits in app/data/pieces.json.
//
// Run with: npm run images
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'images', 'pieces')
const manifestPath = join(root, 'app', 'data', 'pieces.json')
const headers = { 'AIC-User-Agent': 'lucentini-site (image build script)' }

// slug, AIC artwork id, and whether the piece needs a large variant for the loupe.
const pieces = [
  ['lion-earring', 136514, true],
  ['pearl-brooch', 14702, false],
  ['intaglio-ring', 109602, true],
  ['tiberius-cameo', 119273, true],
  ['marlborough-snuff-box', 73184, true],
  ['sampler-map', 15132, false],
  ['globe-table', 109317, false],
  ['world-map', 152509, false],
  ['claudius-cameo', 111809, true],
  ['ship-pendant', 119274, true],
  ['bow-brooch', 119665, true],
  ['houdon-bust', 144965, true],
  ['amphitrite-bust', 99426, true],
  ['nola-amphora', 84553, true],
  ['irene-solidus', 221685, true],
  ['heirlooms-still-life', 198905, true],
  ['curtain-still-life', 66042, true],
  ['sevres-vases', 93991, true],
  ['baroque-pearl', 119245, true],
  ['portrait-miniature', 84866, true],
]

const widths = [720, 1400]
const zoomWidth = 2400

async function fetchWithRetry(url, as) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers })
      if (!res.ok) throw new Error(`${res.status} ${url}`)
      return as === 'json' ? await res.json() : Buffer.from(await res.arrayBuffer())
    }
    catch (error) {
      if (attempt === 3) throw error
      await new Promise(r => setTimeout(r, 800 * attempt))
    }
  }
}

mkdirSync(outDir, { recursive: true })
mkdirSync(dirname(manifestPath), { recursive: true })

const manifest = {}
for (const [slug, id, zoom] of pieces) {
  const fields = 'id,title,date_display,place_of_origin,artist_title,medium_display,image_id,is_public_domain,thumbnail'
  const { data } = await fetchWithRetry(`https://api.artic.edu/api/v1/artworks/${id}?fields=${fields}`, 'json')
  if (!data.is_public_domain || !data.image_id) throw new Error(`${slug} (${id}) is not a public-domain image`)

  // The IIIF server refuses to upscale, so never ask for more than the original width.
  const largest = Math.min(zoom ? zoomWidth : Math.max(...widths), data.thumbnail?.width ?? Infinity)
  const source = await fetchWithRetry(`https://www.artic.edu/iiif/2/${data.image_id}/full/${largest},/0/default.jpg`)
  const image = sharp(source)
  const { width, height } = await image.metadata()
  const { dominant } = await image.stats()

  for (const w of zoom ? [...widths, zoomWidth] : widths) {
    await sharp(source)
      .resize({ width: Math.min(w, width) })
      .webp({ quality: w === zoomWidth ? 80 : 76, effort: 5 })
      .toFile(join(outDir, `${slug}-${w}.webp`))
  }

  manifest[slug] = {
    title: data.title,
    date: data.date_display,
    origin: data.place_of_origin,
    artist: data.artist_title,
    medium: data.medium_display,
    width,
    height,
    color: `rgb(${dominant.r} ${dominant.g} ${dominant.b})`,
    zoom,
    credit: 'The Art Institute of Chicago, CC0',
    url: `https://www.artic.edu/artworks/${id}`,
  }
  console.log(`${slug}: ${data.title} (${width}x${height})`)
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`\nWrote ${Object.keys(manifest).length} pieces to ${manifestPath}`)

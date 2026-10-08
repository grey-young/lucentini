// Photographs of the house's sculpture, built by scripts/build-images.mjs from
// public/images/pieces new.
import data from './pieces.json'

export type PieceSlug = keyof typeof data

export type Discipline = 'jewelry' | 'sculpture' | 'artifacts' | 'art'

export const disciplines: { id: Discipline, title: string, text: string }[] = [
  {
    id: 'jewelry',
    title: 'Fine Jewelry',
    text: 'Necklaces and chains, pearls, diamonds, rings, earrings, and gold, each selected for its craftsmanship and character, to be worn for a lifetime and treasured long after.',
  },
  {
    id: 'sculpture',
    title: 'Sculpture',
    text: 'Works of real presence that command a room and hold their meaning for generations.',
  },
  {
    id: 'artifacts',
    title: 'Historical Artifacts',
    text: 'Survivors of earlier ages that offer a tangible connection to the lives and hands that came before us.',
  },
  {
    id: 'art',
    title: 'Fine Art',
    text: 'Pieces to live with, return to, and one day pass on.',
  },
]

// Catalogue order, which also sets each piece's lot number, with a one-line
// summary and a longer note for its page.
const catalogue: { slug: PieceSlug, discipline: Discipline, summary?: string, note: string }[] = [
  {
    slug: 'egyptian-figure',
    discipline: 'sculpture',
    summary: 'Stylized bronze figure inspired by ancient Egyptian royal imagery.',
    note: 'A figure in the Egyptian taste, cradling a vase of red marble cut with hieroglyphs. Gilt bronze picks out the headdress band, collar, belt, and sandals against a deep patina, in the manner the Paris foundries favoured when Egypt was the fashion.',
  },
  {
    slug: 'old-centaur',
    discipline: 'sculpture',
    summary: 'Classical depiction of a mythological half-human, half-horse warrior.',
    note: 'The elder of the two Furietti centaurs, found at Hadrian’s Villa at Tivoli in 1736. Carved in the dark grey marble the Romans called bigio morato and signed on the base by Aristeas and Papias of Aphrodisias.',
  },
  {
    slug: 'orientalist-warrior',
    discipline: 'sculpture',
    summary: 'Ornate sculpture of a classical warrior wearing armor and holding a weapon.',
    note: 'A warrior in turban helmet and mail, a censer swinging from his hand. Orientalist bronzes like this brought the costume and ceremony of distant courts into European rooms, and reward a close look at every rivet and link.',
  },
  {
    slug: 'horse-head',
    discipline: 'sculpture',
    note: 'A horse’s head, cast in bronze and raised on a single steel rod so it seems to turn in the air. The mane is left rough while the muzzle is smoothed, so the light finds the bone beneath.',
  },
  {
    slug: 'officer-bust',
    discipline: 'sculpture',
    summary: 'Formal bust of a Napoleonic-style military officer in uniform.',
    note: 'An officer in high collar, greatcoat, and sword belt, an order pinned at his breast. A portrait bust in the formal tradition, made to keep a face and a bearing in the room long after the sitter has left it.',
  },
  {
    slug: 'figural-torchere',
    discipline: 'artifacts',
    summary: 'Expressive sculpture portraying an African figure with traditional features and ornamentation.',
    note: 'A carved figure holding aloft a gilded acanthus branch, standing on a painted plinth hung with fruit. Torchères of this kind carried light into the grand rooms of Venice and spread across Europe as the taste for theatrical furnishing grew.',
  },
  {
    slug: 'crowned-lion',
    discipline: 'art',
    summary: 'Detailed bronze sculptures of powerful animals, symbolizing strength, nobility, and nature.',
    note: 'A crowned lion in a tailored suit and a lioness in burnished gold. Contemporary portrait busts that borrow the dignity of the formal bust and give it, with real wit, to the animals.',
  },
]

export function isPieceSlug(slug: unknown): slug is PieceSlug {
  return typeof slug === 'string' && Object.hasOwn(data, slug)
}

type Width = 720 | 1400 | 2400

export function piece(slug: PieceSlug) {
  const p = data[slug]
  const src = (width: Width) => `/images/pieces/${slug}-${width}.webp`
  const index = catalogue.findIndex(c => c.slug === slug)
  const entry = catalogue[index]!
  // The page takes a dark or light palette to match the photograph's ground.
  const shade = Number(p.color.match(/\d+/)?.[0] ?? 0)
  // Further photographs of the piece, shown as details on its page.
  const views = p.views.map((v, i) => ({ ...v, src: (width: Width) => `/images/pieces/${slug}-view-${i + 1}-${width}.webp` }))
  return {
    ...p,
    slug,
    src,
    srcset: `${src(720)} 720w, ${src(1400)} 1400w`,
    alt: p.medium ? `${p.title}, ${p.medium.split('\n')[0]!.toLowerCase()}` : p.title,
    meta: [p.artist, p.date.replace(/\n/g, ' ')].filter(Boolean).join(', '),
    href: `/collection/${slug}`,
    lot: String(index + 1).padStart(2, '0'),
    discipline: disciplines.find(d => d.id === entry.discipline)!,
    summary: entry.summary,
    note: entry.note,
    theme: shade < 100 ? 'ink' : 'bone',
    // Close-ups for the page: the further views, or else the photograph itself up close.
    details: views.length ? views : p.zoom ? [{ width: p.width, height: p.height, src }] : [],
  }
}

export type Piece = ReturnType<typeof piece>

/** Every piece, in catalogue order. */
export const allPieces = (): Piece[] => catalogue.map(c => piece(c.slug))

/** The disciplines with at least one piece in the catalogue. */
export const stockedDisciplines = disciplines.filter(d => catalogue.some(c => c.discipline === d.id))

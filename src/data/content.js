import asset from '../lib/asset'

/* Two halves of the same job. `mono` icons are single-colour brand marks
   (simple-icons) drawn through a CSS mask; the rest are the tools' own
   logos. */
export const skills = {
  build: [
    { name: 'React', note: 'Interfaces', icon: asset('/assets/skills/react.svg'), mono: true },
    { name: 'TypeScript', note: 'Language', icon: asset('/assets/skills/typescript.svg'), mono: true },
    { name: 'Node.js', note: 'Servers', icon: asset('/assets/skills/nodedotjs.svg'), mono: true },
    { name: 'Supabase', note: 'Backend', icon: asset('/assets/skills/supabase.svg'), mono: true },
    { name: 'PostgreSQL', note: 'Data', icon: asset('/assets/skills/postgresql.svg'), mono: true },
    { name: 'Stripe', note: 'Payments', icon: asset('/assets/skills/stripe.svg'), mono: true },
    { name: 'GSAP', note: 'Motion', icon: asset('/assets/skills/greensock.svg'), mono: true },
    { name: 'Three.js', note: 'WebGL', icon: asset('/assets/skills/threedotjs.svg'), mono: true },
    { name: 'Tailwind', note: 'Styling', icon: asset('/assets/skills/tailwindcss.svg'), mono: true },
  ],
  break: [
    { name: 'Burp Suite', note: 'Web proxy', icon: asset('/assets/skills/portswigger.png') },
    { name: 'Nmap', note: 'Recon', icon: asset('/assets/skills/nmap.png') },
    { name: 'Metasploit', note: 'Exploitation', icon: asset('/assets/skills/metasploit.png') },
    { name: 'Wireshark', note: 'Traffic', icon: asset('/assets/skills/wireshark.png') },
    { name: 'OWASP ZAP', note: 'Web scanner', icon: asset('/assets/skills/owaspzap.png') },
    { name: 'sqlmap', note: 'Injection', icon: asset('/assets/skills/sqlmap.png') },
    { name: 'Hashcat', note: 'Cracking', icon: asset('/assets/skills/hashcat.png') },
    { name: 'John the Ripper', note: 'Cracking', icon: asset('/assets/skills/johntheripper.png') },
    { name: 'Maltego', note: 'OSINT', icon: asset('/assets/skills/maltego.png') },
    { name: 'Nessus', note: 'Vuln scanning', icon: asset('/assets/skills/nessus.png') },
    { name: 'Kali Linux', note: 'Platform', icon: asset('/assets/skills/kali.svg') },
    { name: 'Python', note: 'Scripting', icon: asset('/assets/skills/python.svg') },
  ],
}

/* Every project carries a live URL (embedded in an iframe, pointer-events
   off until it is opened fullscreen) plus fresh desktop + mobile
   screenshots taken from the live site, shown under the iframe while it
   loads and on the Desktop / Mobile tabs. */
const shot = (slug, kind) => asset(`/assets/projects/shots/${slug}-${kind}.webp`)

export const projects = [
  {
    slug: 'skinify',
    title: 'Skinify',
    kind: 'CS2 skin marketplace',
    description:
      'A peer-to-peer marketplace for Counter-Strike 2 skins with balances, escrow, card deposits and payouts, and delivery verified against Steam inventories. React and Vite on the front, Supabase (Postgres + edge functions) behind it.',
    stack: ['React', 'TypeScript', 'Supabase', 'Stripe', 'GSAP', 'Tailwind'],
    url: 'https://skinify.gg',
  },
  {
    slug: 'pavelski',
    title: 'Pavelski',
    kind: 'Hair salon redesign concept',
    description:
      'Redesign concept for a hair salon in Letná, Prague — a scroll-driven, editorial site with smooth scrolling, layered imagery and a WebGL touch.',
    stack: ['GSAP', 'ScrollTrigger', 'Lenis', 'Three.js'],
    url: 'https://pavelski-nahled.surge.sh',
  },
  {
    slug: 'dires',
    title: 'Dires Fyzio',
    kind: 'Physiotherapy clinic & course platform',
    description:
      'Website and web app for a private physiotherapy centre in Prague: online courses with purchase and enrolment, paid workshop and event sign-ups through Stripe Checkout, customer accounts, a blog, and an admin panel the team uses to run courses, events and content.',
    stack: ['React', 'Vite', 'Supabase', 'Stripe', 'GSAP', 'Tailwind'],
    url: 'https://dires.cz',
  },
  {
    slug: 'jechart',
    title: 'JechART',
    kind: 'Streetwear e-commerce',
    description:
      'E-commerce for hand-painted designer clothing — catalogue, cart and checkout. One of the biggest projects I have built.',
    stack: ['React', 'MySQL', 'Vite'],
    url: 'https://jechart.cz',
  },
  {
    slug: 'vila-adalbert',
    title: 'Vila Adalbert',
    kind: 'Villa reservation system',
    description: 'Reservation system for a client’s villa, with availability and booking flow.',
    stack: ['React', 'Vite', 'MySQL', 'GSAP'],
    url: 'https://vila-adalbert.netlify.app',
  },
  {
    slug: 'preprava',
    title: 'Preprava.cz',
    kind: 'Transport service',
    description: 'Website for an item-transport service, built for a client.',
    stack: ['React', 'Node.js', 'Tailwind'],
    url: 'https://preprava.netlify.app',
  },
  {
    slug: 'car-rental',
    title: 'Car Rental',
    kind: 'Rental website',
    description: 'Car rental website with a fleet overview and booking enquiries.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Node.js', 'Vite'],
    url: 'https://pronajem.netlify.app',
  },
  {
    slug: 'catering',
    title: 'Gusto Catering',
    kind: 'Catering company',
    description: 'Website for a catering company — services, pricing and past events.',
    stack: ['React', 'Node.js', 'Tailwind'],
    url: 'https://ketering.netlify.app',
  },
].map((p) => ({ ...p, shots: { desktop: shot(p.slug, 'desktop'), mobile: shot(p.slug, 'mobile') } }))

export const github = {
  username: 'xx0rT',
  profile: 'https://github.com/xx0rT',
  userApi: 'https://api.github.com/users/xx0rT',
  contributionsApi: 'https://github-contributions-api.jogruber.de/v4/xx0rT?y=last',
}

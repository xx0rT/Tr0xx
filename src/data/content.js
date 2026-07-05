import asset from '../lib/asset'

export const skills = [
  { name: 'NMAP', icon: asset('/assets/skills/nmap.png') },
  { name: 'METASPLOIT', icon: asset('/assets/skills/metasploit.png') },
  { name: 'KALI LINUX', icon: asset('/assets/skills/kali.svg') },
  { name: 'BURP SUITE', icon: asset('/assets/skills/portswigger.png') },
  { name: 'WIRESHARK', icon: asset('/assets/skills/wireshark.png') },
  { name: 'PYTHON', icon: asset('/assets/skills/python.svg') },
  { name: 'OWASP ZAP', icon: asset('/assets/skills/owaspzap.png') },
  { name: 'SQLMAP', icon: asset('/assets/skills/sqlmap.png') },
  { name: 'MALTEGO', icon: asset('/assets/skills/maltego.png') },
  { name: 'JOHN THE RIPPER', icon: asset('/assets/skills/johntheripper.png') },
  { name: 'HASHCAT', icon: asset('/assets/skills/hashcat.png') },
  { name: 'NESSUS', icon: asset('/assets/skills/nessus.png') },
]

export const projects = [
  {
    slug: 'skinify',
    title: 'Skinify',
    description:
      'CS2 marketplace made with React, a MySQL database, Tailwind, GSAP, Framer and Vite. API endpoints and multiple edge functions.',
    stack: ['react', 'mysql', 'tailwind', 'gsap', 'vite'],
    image: asset('/assets/projects/skinify.png'),
    link: 'https://skinify.gg',
  },
  {
    slug: 'jechart',
    title: 'Jechart.ART',
    description:
      'E-commerce website created with React, MySQL and Vite. One of the biggest projects I’ve made.',
    stack: ['react', 'mysql', 'vite'],
    image: asset('/assets/projects/jechart.png'),
    link: 'https://jechart.art',
  },
  {
    slug: 'preprava',
    title: 'Preprava.cz',
    description:
      'Website for transferring items, built for a customer with React, Node.js and Tailwind.',
    stack: ['react', 'nodejs', 'tailwind'],
    image: asset('/assets/projects/preprava.png'),
    link: 'https://preprava.netlify.app',
  },
  {
    slug: 'catering',
    title: 'Catering',
    description:
      'Catering web made for one of my customers using React, Node.js, Tailwind and CSS.',
    stack: ['react', 'nodejs', 'tailwind'],
    image: asset('/assets/projects/catering.png'),
    link: 'https://ketering.netlify.app',
  },
  {
    slug: 'vila-adalbert',
    title: 'Vila Adalbert',
    description:
      'Reservation system for a customer’s villa, created with React, Vite, MySQL, GSAP and AOS.',
    stack: ['react', 'vite', 'mysql', 'gsap'],
    image: asset('/assets/projects/vilal.png'),
    link: 'https://vila-adalbert.netlify.app',
  },
  {
    slug: 'car-rental',
    title: 'Car Rental',
    description:
      'Car rental website developed with React, Tailwind, Node, TypeScript and Vite.',
    stack: ['react', 'tailwind', 'nodejs', 'ts', 'vite'],
    image: asset('/assets/projects/pronajem.png'),
    link: 'https://pronajem.netlify.app',
  },
]

export const github = {
  username: 'xx0rT',
  profile: 'https://github.com/xx0rT',
  userApi: 'https://api.github.com/users/xx0rT',
  contributionsApi: 'https://github-contributions-api.jogruber.de/v4/xx0rT?y=last',
}

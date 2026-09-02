import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useSeo } from '../lib/hooks';
import { Button, Icon, PageHero, Reveal, SectionHeading, Stagger, StaggerItem } from '../components/ui';
import { StatsBand } from '../sections/TrustSections';
import { CtaBanner } from '../sections/Closing';
import { team, ABOUT_CAMP_IMAGE, ABOUT_STORY_IMAGE } from '../data/content';
import { pex } from '../lib/utils';

const VALUES = [
  { icon: 'shield-check', title: 'Safety above summits', text: 'We have turned clients around hours from the top — and they thank us later. The mountain will wait; your wellbeing will not.' },
  { icon: 'users', title: 'Local, always', text: 'Every rupee is spent on local crews, family teahouses and village suppliers. Tourism should build the valleys it walks through.' },
  { icon: 'notebook-pen', title: 'Honest & personal', text: 'Realistic grades, transparent prices and itineraries tuned to your actual fitness — never the version that sells easiest.' },
  { icon: 'leaf', title: 'Leave it better', text: 'Refill-not-bottle policy, porter welfare gear, fair wages, and 5% of profits rebuilding Langtang classrooms since 2015.' },
];

const SAFETY = [
  'Oximeter & symptom checks every morning and evening above 3,000 m',
  'Conservative ascent profiles audited against ISMM altitude guidance',
  'Satellite communicator on every restricted-area and climbing departure',
  'Pre-verified helicopter evacuation procedures on file for every group',
  'Wilderness First Responder–trained guides, re-certified every two years',
];

export default function About() {
  useSeo('About Us — Our Story, Team & Safety | Ascent Himalaya', 'A Kathmandu-born team of Sherpa guides and travel designers crafting safe, personal Himalayan journeys since 2009.');

  return (
    <main>
      <PageHero
        image={ABOUT_CAMP_IMAGE.replace('w=1200', 'w=1920').replace('h=900', 'h=800')}
        overline="Our story"
        title="Born beneath the world's highest trails"
        sub="Ascent Himalaya began in 2009 with one guide, one porter's wage saved over eight seasons, and a stubborn belief: trekking companies should be run by the people who actually walk."
      />

      {/* Story */}
      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            <img src={ABOUT_STORY_IMAGE} alt="Villagers walking below the cliffs of Chhusang, Upper Mustang" loading="lazy" className="aspect-[4/5] w-full object-cover sm:aspect-[5/4]" />
          </div>
          <div className="glass absolute -bottom-6 left-6 right-6 rounded-2xl border border-white/60 p-5 shadow-lift sm:left-10 sm:right-auto sm:max-w-xs">
            <p className="font-display text-lg font-medium leading-snug text-night-900">
              “The trail gave me everything. Now my job is to give the trail a future.”
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-night-900/50">Dawa Sherpa — founder</p>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            overline="From porter to founder"
            title={
              <>
                Guiding runs in our <em className="italic text-ember-500">blood</em>
              </>
            }
          />
          <div className="mt-6 space-y-4 leading-relaxed text-night-900/70">
            <p>
              Dawa Sherpa carried his first load to Namche at sixteen. By twenty-one he was leading; by thirty he had stood
              on Everest eleven times — and watched too many travellers rushed, under-informed and over-promised by companies
              that had never felt thin air.
            </p>
            <p>
              So in 2009 he started Ascent Himalaya with a single rule: <strong className="font-semibold text-night-900">every decision is made the way a guide
              would make it on the mountain</strong>. Itineraries with room to breathe. Porters paid above industry standard.
              Small groups, family teahouses, honest briefings.
            </p>
            <p>
              Fifteen years and 2,400 travellers later, we remain deliberately small — a team of senior guides and travel
              designers in Kathmandu, Pokhara and Thimphu who answer your emails ourselves and still argue about the best
              dal bhat on the Annapurna Circuit. (For the record: Yak Kharka.)
            </p>
          </div>
          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
            <Button to="/treks" icon>Browse journeys</Button>
            <Button to="/contact" variant="outline-dark">Talk to us</Button>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-sand-100 py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            align="center"
            overline="What we stand for"
            title={
              <>
                Values that hold at <em className="italic text-ember-500">5,000 metres</em>
              </>
            }
            sub="Written on the wall of our Thamel office — and tested on every single departure."
          />
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <StaggerItem key={v.title}>
                <div className="group h-full rounded-3xl border border-night-900/8 bg-white p-7 card-hover hover:-translate-y-1.5 hover:shadow-lift">
                  <span className="grid size-13 place-items-center rounded-2xl bg-night-950 p-3.5 text-ember-400 transition-colors duration-500 group-hover:bg-ember-500 group-hover:text-white">
                    <Icon name={v.icon} className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-night-900">{v.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-night-900/55">{v.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <StatsBand />

      {/* Team */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading
          align="center"
          overline="The people"
          title={
            <>
              Meet your <em className="italic text-ember-500">mountain family</em>
            </>
          }
          sub="Senior professionals, not seasonal hires. The same names you'll message before the trip — and hug after it."
        />
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <StaggerItem key={m.name}>
              <div className="group h-full rounded-3xl border border-night-900/8 bg-white p-7 text-center card-hover hover:-translate-y-1.5 hover:shadow-lift">
                <span className="mx-auto grid size-20 place-items-center rounded-full bg-night-950 font-display text-2xl font-semibold text-ember-300 ring-4 ring-sand-100 transition-transform duration-500 group-hover:scale-105">
                  {m.initials}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-night-900">{m.name}</h3>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ember-600">{m.role}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-night-900/55">{m.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Safety + community */}
      <section className="container-x grid gap-6 pb-24 lg:grid-cols-2">
        <Reveal className="rounded-[2rem] bg-night-950 p-8 text-white sm:p-10">
          <span className="grid size-12 place-items-center rounded-2xl bg-ember-500 text-white">
            <ShieldCheck className="size-6" aria-hidden />
          </span>
          <h2 className="mt-6 font-display text-2xl font-medium tracking-tight sm:text-3xl">The safety system behind every journey</h2>
          <ul className="mt-6 space-y-3.5">
            {SAFETY.map((s) => (
              <li key={s} className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ember-400" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
          <Button to="/travel-info/about-trekking" variant="outline-light" className="mt-8" icon>
            Read our trekking guide
          </Button>
        </Reveal>

        <Reveal delay={0.12} className="overflow-hidden rounded-[2rem]">
          <div className="relative h-full min-h-[24rem]">
            <img src={pex(14158631, 1200, 900)} alt="Yaks moving through a Khumbu village where our porter families live" loading="lazy" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-night-950/95 via-night-950/40 to-transparent" aria-hidden />
            <div className="relative flex h-full flex-col justify-end p-8 sm:p-10">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-ember-300">Community, since day one</p>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
                5% of every profit rebuilds mountain classrooms
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                After the 2015 earthquake we helped rebuild four schools in the Langtang valley our founders grew up in.
                Every booking since — trek, tour or safari — has kept the fund alive.
              </p>
              <a href="mailto:hello@ascenthimalaya.com?subject=Classroom%20fund" className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-extrabold text-ember-300 hover:text-ember-200">
                Ask for the annual report <ArrowRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <CtaBanner />
    </main>
  );
}

import type { InfoArticle } from './types';

/** Evergreen traveller guide articles (editable CMS-style content). */
export const articles: InfoArticle[] = [
  {
    slug: 'nepal-general-information',
    title: 'Nepal General Information',
    icon: 'map-pin',
    readTime: '6 min read',
    excerpt: 'Geography, gateway cities, money, connectivity and how Nepal actually works — the essentials before you land.',
    sections: [
      {
        heading: 'The lay of the land',
        body: [
          'Nepal packs the deepest valleys and highest mountains on Earth into a strip just 200 km wide. The country rises from the steamy Terai plains (60 m) through the mid-hills to the high Himalaya — 8 of the world’s 14 peaks above 8,000 m stand on or within its borders.',
          'Kathmandu (1,400 m) is the international gateway, with Tribhuvan International Airport served from the Gulf, South and Southeast Asia. Pokhara (820 m) is the relaxed lakeside launchpad for Annapurna journeys, connected by a 25-minute flight or 6–7 hour drive from the capital.',
        ],
      },
      {
        heading: 'Money, connectivity & daily life',
        body: [
          'The Nepalese Rupee (NPR) is the currency; ATMs are widespread in Kathmandu and Pokhara but absent on trails — carry trek funds in cash. Tourist-area prices are modest: a good local meal runs $3–8, a Kathmandu boutique hotel $40–90.',
          '4G Ncell and NTC SIMs are sold at the airport for a few dollars (passport required) and work surprisingly well along major trekking routes. Power cuts are rare in cities now; on trails, carry a power bank as charging is a paid extra in teahouses.',
        ],
      },
      {
        heading: 'Arrival practicalities',
        body: [
          'Visa on arrival is available for most nationalities (see our visa guide). The official tourism board levy, trekking permits and national park fees are all arranged by us — you simply travel.',
          'Tap water is not drinkable; bottled or purified water is standard on all our trips. Nepal is 5h45m ahead of GMT — a quirk that means you will briefly be 15 minutes ahead of India.',
        ],
      },
    ],
  },
  {
    slug: 'climate-and-rainfall',
    title: 'Climate & Rainfall',
    icon: 'cloud-rain',
    readTime: '5 min read',
    excerpt: 'From monsoon cloudbursts to alpine winters — how Nepal’s stacked climate zones shape your trek.',
    sections: [
      {
        heading: 'A country of vertical climates',
        body: [
          'Nepal climbs through five climate zones, and on any trek you will walk through several in a single week: subtropical valleys, temperate forest, subalpine meadows, alpine tundra and, finally, the arctic world of permanent snow and ice above 5,200 m.',
          'As a rule of thumb, temperature falls ~6 °C for every 1,000 m gained. Kathmandu might be a pleasant 20 °C while Namche Bazaar dawns at −5 °C on the same morning.',
        ],
      },
      {
        heading: 'The monsoon pattern',
        body: [
          'The southwest monsoon builds in June and releases in September, delivering 80% of annual rainfall — 250–450 mm/month in the mid-hills. Trails empty, leeches appear, and cloud hides the summits, except in the trans-Himalayan rain shadow.',
          'Upper Mustang, Dolpo and Tibet’s plateau sit behind the great wall and receive barely 250 mm a year. These are our recommended journeys for June–August travel.',
        ],
      },
      {
        heading: 'Post-monsoon clarity',
        body: [
          'October and November bring the famous clarity: washed air, settled weather and daytime valley temperatures of 15–25 °C. Nights at high altitude drop to −10 °C or below by late November; December–February trekking remains superb below 4,000 m with proper kit.',
        ],
      },
    ],
  },
  {
    slug: 'flora-and-fauna',
    title: 'Flora & Fauna',
    icon: 'leaf',
    readTime: '5 min read',
    excerpt: 'Red pandas, rhododendron forests and rhinos — the living wealth of the Himalayan slopes.',
    sections: [
      {
        heading: 'A botanical staircase',
        body: [
          'Nepal holds ~6,500 flowering plant species — 2% of the world’s total in 0.1% of its land. Spring (March–May) turns the mid-hills crimson and pink as 30+ rhododendron species bloom between 1,500 and 3,600 m; the forests of the ABC and Langtang approaches are the showiest on Earth.',
          'Higher up, meadows of blue poppy (the national flower), edelweiss-relatives and potentilla take over; above 4,500 m, life contracts to mosses, lichens and the astonishing cushion plants of the alpine zone.',
        ],
      },
      {
        heading: 'Mammals of the mountains',
        body: [
          'The forests shelter red panda, Himalayan tahr, musk deer and grey langur; open slopes hold herds of blue sheep (bharal) — prime prey for the snow leopard, which lives along every high trail though seen by very few.',
          'In the lowlands, Chitwan protects 750+ greater one-horned rhinos and Bengal tigers; the Khumbu has Himalayan black bear and the improbable blood pheasant, the national bird.',
        ],
      },
      {
        heading: 'Walking gently',
        body: [
          'All our treks follow leave-no-trace principles, use treated water rather than bottles (saving ~40 plastic bottles per trekker), and support the Red Panda Network’s forest guardian programme in the eastern mid-hills.',
        ],
      },
    ],
  },
  {
    slug: 'nepali-people-and-culture',
    title: 'Nepali People & Culture',
    icon: 'users',
    readTime: '6 min read',
    excerpt: 'Sherpas, Gurungs, Tamangs and 125 languages — meeting the people who make the mountains home.',
    sections: [
      {
        heading: 'Many nations in one',
        body: [
          'Nepal recognises 142 ethnic groups and 123 living languages. The high mountains you will trek through are home to Sherpa (Khumbu), Tamang (Langtang), Gurung and Magar (Annapurna) and Thakali (Kali Gandaki) peoples — each with distinct dress, dialect and tradition.',
          'Hinduism (81%) and Buddhism (9%) interweave rather than divide: the same hilltop may hold a Shiva shrine and a Buddhist stupa, and many festivals — like the spring Buddha Jayanti or autumn’s Dashain — are celebrated by everyone.',
        ],
      },
      {
        heading: 'Greetings & good manners',
        body: [
          '“Namaste” with palms together opens every door. Use your right hand (or both) for giving and receiving; ask before photographing people; walk clockwise around mani walls, chortens and stupas; remove shoes before entering homes, monasteries and many shops.',
        ],
      },
      {
        heading: 'Teahouse culture',
        body: [
          'The extended-family teahouse is the soul of trekking. You will eat dal bhat (the trekker’s power meal — “dal bhat power, 24 hour”), share a dining room with travellers from everywhere and quite possibly learn card games from your hosts’ children. Respect the kitchen’s rhythm, order dinner early, and you will be treated as family by night two.',
        ],
      },
    ],
  },
  {
    slug: 'things-to-do-and-dont',
    title: "Things To Do & Don't",
    icon: 'clipboard-check',
    readTime: '4 min read',
    excerpt: 'The unwritten rules that turn visitors into welcome guests — cultural, environmental and trail etiquette.',
    sections: [
      {
        heading: 'Do',
        body: [],
        list: [
          'Greet with “Namaste” and accept tea when offered — refusing is mildly rude',
          'Walk clockwise around Buddhist monuments and keep mani walls on your right',
          'Dress modestly, especially at temples (covered shoulders and knees)',
          'Bargain gently in markets — smiling is part of the transaction',
          'Carry your waste down from the trail; leave campsites cleaner than found',
          'Learn a few Nepali words: dhanyabad (thank you), mitho cha (delicious)',
        ],
      },
      {
        heading: "Don't",
        body: [],
        list: [
          'Touch anyone’s head (sacred) or point your feet at people or religious objects',
          'Give money or sweets to begging children — support schools through us instead',
          'Enter temples during puja unless invited, or photograph cremations at Pashupatinath',
          'Buy wildlife products, antiques older than 100 years, or coral — all illegal to export',
          'Show soles of feet toward a monk or sit with feet on tables',
          'Trek off-trail across crop terraces — fields are livelihoods',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'These codes are not tourist theatre — they are how a dozen cultures peacefully share steep valleys. Travellers who follow them are welcomed deeper; travellers who don’t rarely realise what they missed.',
        ],
      },
    ],
  },
  {
    slug: 'about-trekking',
    title: 'About Trekking in Nepal',
    icon: 'route',
    readTime: '7 min read',
    excerpt: 'Teahouse versus camping, porters, permits and what a day on trail actually looks like.',
    sections: [
      {
        heading: 'Teahouse trekking',
        body: [
          'Nepal invented lodge-to-lodge trekking. On classic routes (Everest, Annapurna, Langtang) you sleep in family-run teahouses: simple twin rooms, shared bathrooms, warm dining rooms and menus of dal bhat, noodles, pancakes and apple pie.',
          'Rooms cost little because you dine in — the unwritten covenant. Expect to pay extra for hot showers ($2–5), Wi-Fi ($2–4) and device charging as you go higher.',
        ],
      },
      {
        heading: 'Camping & climbing trips',
        body: [
          'Remote routes (Dolpo, Kanchenjunga) and all climbing expeditions run fully supported: two-person tents, cook team, dining tent and toilet tent. You carry only a daypack; our kitchen produces three real meals daily plus morning tea in bed.',
        ],
      },
      {
        heading: 'A day on trail',
        body: [
          'Wake ~6 am to tea; breakfast 7; walk 7:30–12:30 with tea stops; lunch an hour at a trailside lodge; afternoon walk 2–3 hours to the night’s village. Evenings are for washing, journaling, cards and dinner around 6:30 under yak-wool blankets. Most days cover 10–15 km and 500–900 m of climbing.',
          'Your porter carries up to 15 kg of your duffle (we cap porter loads below industry norms and insure every member of crew). A licensed guide leads, interprets and watches your health — they are the difference between a walk and an experience.',
        ],
      },
    ],
  },
  {
    slug: 'trekking-grades',
    title: 'Trekking Grades Explained',
    icon: 'gauge',
    readTime: '4 min read',
    excerpt: 'Easy to strenuous — how we grade every journey so you can choose honestly.',
    sections: [
      {
        heading: 'Our four grades',
        body: [
          'Easy: up to 4 hours a day on good trails below 3,000 m. Cultural tours, day hikes and the Kathmandu Valley — suited to everyone, including families with young children.',
          'Moderate: 5–6 hours daily with sustained climbs, max sleeping altitudes around 3,500–4,000 m. Langtang, Mardi Himal, ABC, Upper Mustang. Reasonable fitness and enthusiasm are enough.',
        ],
      },
      {
        heading: 'The serious end',
        body: [
          'Challenging: 6–7 hour days over passes of 5,000–5,500 m, two weeks or more, real commitment to training beforehand. Everest Base Camp, Gokyo, Annapurna Circuit.',
          'Strenuous: serious altitude or isolation — 5,100 m+ passes, glacier terrain or long unsupported stretches, plus all peak-climbing expeditions to 6,500 m. Manaslu Circuit, Island Peak. Previous trekking experience required; some climbs require harness skills we teach en route.',
        ],
      },
      {
        heading: 'Choose honest, enjoy more',
        body: [
          'The single biggest predictor of trek enjoyment is realistic self-assessment. Tell us your walking history plainly and we will match you to a grade, add training guidance, or split the difference with acclimatisation days. Nobody enjoys a trek they are merely surviving.',
        ],
      },
    ],
  },
  {
    slug: 'trekking-seasons',
    title: 'Trekking Seasons',
    icon: 'calendar',
    readTime: '5 min read',
    excerpt: 'When to go where — the honest month-by-month picture.',
    sections: [
      {
        heading: 'Autumn (Oct–Nov): the classic window',
        body: [
          'Post-monsoon air is crystalline, passes are open and days are stable. It is peak season for good reason — expect busy trails on EBC and the Circuit, empty ones everywhere else. Book Lukla flights early.',
        ],
      },
      {
        heading: 'Spring (Mar–May): warmth and bloom',
        body: [
          'Rhododendrons ignite the mid-hills, days lengthen and high passes are at their most forgiving. Haze builds at lower elevations by April; climbing expeditions favour the stable May windows.',
        ],
      },
      {
        heading: 'Winter & monsoon: the secret seasons',
        body: [
          'December–February: cold nights (−20 °C up high) but empty trails, perfect visibility and superb lodge hospitality. Stick below 4,000–4,500 m: Langtang, Mardi, lower Everest.',
          'June–September: the rain shadow rules. Upper Mustang and Dolpo are at their best while the rest of the country pours; the Kathmandu Valley and Chitwan remain warm and usable year-round.',
        ],
      },
    ],
  },
  {
    slug: 'packing-information',
    title: 'Packing Information',
    icon: 'backpack',
    readTime: '6 min read',
    excerpt: 'The refined kit list we issue to every trekker — what matters, what doesn’t, what we lend you.',
    sections: [
      {
        heading: 'What we lend you',
        body: [
          'Every Ascent Himalaya trekker receives a −15 °C down jacket and sleeping bag (sanitised), a 70 L duffle carried by the porter team, and trekking poles if desired. On climbs we issue harnesses, jumars, helmets and group rope gear — inspect everything with your guide in Kathmandu.',
        ],
      },
      {
        heading: 'Your core kit (teahouse treks)',
        body: [],
        list: [
          'Broken-in waterproof boots + camp trainers',
          '4-season layering: 2 base layers, fleece, insulated mid-layer, shell jacket',
          'Trekking trousers (2), warm hat, sun hat, 2 liner + 1 insulated gloves',
          '4–5 trekking socks + 1 thick pair, sleeping mask & earplugs',
          '2 × 1 L bottles + purification (lifestraw/tablets)',
          'Head torch, sunglasses (category 3+ above snowline), SPF 50 & lip balm',
          'Personal first aid: blister kit, rehydration salts, any prescriptions (double supply)',
          'Quick-dry towel, power bank (10,000–20,000 mAh), passport copies & photos',
        ],
      },
      {
        heading: 'Leave in Kathmandu',
        body: [
          'Denim (heavy, cold, slow to dry), hard suitcases (we store them free at your hotel), excessive toiletries and “just-in-case” duplicates. Porter loads are capped at 15 kg per guest for welfare — overpacking literally weighs on someone’s shoulders.',
        ],
      },
    ],
  },
  {
    slug: 'visa-information',
    title: 'Visa Information',
    icon: 'stamp',
    readTime: '4 min read',
    excerpt: 'Visa on arrival for most nations, extensions, and the Bhutan difference.',
    sections: [
      {
        heading: 'Nepal: visa on arrival',
        body: [
          'Citizens of most countries obtain a tourist visa on arrival at Kathmandu airport: USD 30 (15 days), USD 50 (30 days) or USD 125 (90 days), payable in USD, EUR, GBP or card. Fill the online pre-arrival form (nepaliport.immigration.gov.np) within 15 days before travel to skip the kiosk queues.',
          'Indian nationals need no visa. Chinese nationals receive gratis visas. Bring one passport photo (kiosks also photograph) and ensure 6 months’ passport validity.',
        ],
      },
      {
        heading: 'Extending & re-entering',
        body: [
          'Extensions cost USD 3/day at the Kathmandu or Pokhara immigration offices (minimum 15 days), capped at 150 days per calendar year. Your visa is multiple-entry by default, so our Kathmandu–Bhutan–Kathmandu combos need only one Nepali visa.',
        ],
      },
      {
        heading: 'Bhutan & Tibet: we handle it',
        body: [
          'Bhutan requires pre-arranged visas through a licensed operator — that’s us. Send a passport scan; approval typically arrives within 5 working days, alongside payment of the Sustainable Development Fee (USD 100/night, included in our quotes).',
          'Tibet travel requires a Chinese visa plus Tibet Travel Permit arranged by our Lhasa partner; allow 3 weeks. For both, the paperwork is our headache, never yours.',
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

import type { Dictionary } from "../types";

export const en: Dictionary = {
  meta: {
    title: "Zhylyoi District Police Department - Kulsary | Atyrau Region",
    description:
      "Official information page of the Zhylyoi District Police Department, Police Department of Atyrau Region. Emergency - 102.",
  },
  theme: {
    toDark: "Dark theme",
    toLight: "Light theme",
  },
  splash: {
    title: "Zhylyoi District Police Department",
    ministry: "Police Department of Atyrau Region",
    choose: "Choose your language",
    hint: "You can change the language at any time",
  },
  header: {
    name: "Zhylyoi District Police Department",
    department: "Police Department of Atyrau Region",
    location: "Kulsary, Atyrau Region",
    official: "State institution",
  },
  emergency: {
    label: "Emergency call",
    police: "Police",
    unified: "Unified rescue service",
    duty: "Duty unit",
    dutyPhone: "+7 (712 37) 5-04-96",
    address: "Address",
    addressValue: "Kulsary, Bisenbi Bisenkulov st., 47",
  },
  stats: {
    heading: "Service in numbers",
    items: [
      { value: "954", label: "Sergek cameras in Kulsary" },
      { value: "24/7", label: "duty unit works around the clock" },
    ],
    source: "Data: gov.kz, polisia.kz and regional media",
  },
  info: {
    title: "Information",
    subtitle: "About the district",
    paragraphs: [
      "Zhylyoi District covers 29,400 km² - from the town of Kulsary to the rural districts of Akkiiztogay, Zhem, Karaton, Koschagyl and Maikomgen. More than 87,000 people live in the district, about 60,000 of them in Kulsary.",
      "Zhylyoi District is the oil heart of Atyrau Region: over 40 fields, including Tengiz.",
      "The district has 416 streets. The town of Kulsary has 14,688 houses and a railway station.",
    ],
    wikipedia: "Zhylyoi District on Wikipedia",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Zhylyoi_District",
    govPortal: "Official page of the Atyrau Region Police Department",
    govPortalUrl: "https://www.gov.kz/memleket/entities/mvd-atyrau?lang=en",
  },
  points: {
    title: "Local police posts",
    subtitle: "4 local police posts operate in the town and 6 in rural areas",
    headquarters: {
      name: "Police Department - Kulsary",
      note: "Duty unit, open 24/7",
      maps: {
        twoGis: "https://2gis.kz/atyrau/firm/70000001077001378",
        google:
          "https://www.google.com/maps/search/?api=1&query=Кульсары+Бисенби+Бисенкулова+47",
      },
    },
    open2gis: "2GIS",
    openGoogle: "Google Maps",
    openList: "View all posts",
    modalTitle: "Local police posts",
    close: "Close",
    call: "Call",
    groups: [
      {
        label: "Kulsary town - 4 posts",
        points: [
          {
            name: "Local police post No. 1",
            address: "U. Makhambetov st., 15",
            inspector: "Police Senior Lieutenant Abylay Payzov",
            photo: "/images/officers/paizov-abylai.jpg",
            phone: "+7 702 465 8745",
            phoneRaw: "+77024658745",
            twoGis:
              "https://2gis.kz/atyrau/search/46.951283%2C%2053.992302/geo/70030076608616181/53.992302%2C46.951283?m=53.992284%2C46.951267%2F20",
            google: "https://maps.app.goo.gl/D5wfJQQLcbkJnexG9",
          },
          {
            name: "Local police post No. 12",
            address: "Atyrau microdistrict, Al-Farabi st., 1, apt. 1",
            inspector: "Police Captain Dauren Saugabayev",
            photo: "/images/officers/saugabayev-dauren.jpg",
            phone: "+7 701 579 1479",
            phoneRaw: "+77015791479",
            twoGis: "https://go.2gis.com/GNLQQ",
            google: "https://maps.app.goo.gl/Szfa7QeBEM7Zz4kFA",
          },
          {
            name: "Samal microdistrict post",
            address: "Samal microdistrict",
            inspector: "Police Major Sundet Okashev",
            phone: "+7 778 854 0666",
            phoneRaw: "+77788540666",
            twoGis:
              "https://2gis.kz/atyrau/geo/70030076573578098/54.032108,46.955619",
            google:
              "https://www.google.com/maps/search/?api=1&query=46.955619,54.032108",
          },
        ],
      },
      {
        label: "Rural areas - 6 posts",
        points: [
          {
            name: "Local police post No. 10",
            address: "Maikomgen village, Ainymas st.",
            inspector: "Police Major Nurzhan Zhetenov",
            photo: "/images/officers/zhetenov-nurzhan.jpg",
            phone: "+7 778 463 6900",
            phoneRaw: "+77784636900",
            google:
              "https://www.google.com/maps/search/?api=1&query=46.522495,54.273186",
          },
          {
            name: "Zhana Karaton settlement post",
            address: "Zhana Karaton, 449a",
            inspector: "Police Major Birzhan Zinullin",
            phone: "+7 701 579 1479",
            phoneRaw: "+77015791479",
            twoGis: "https://go.2gis.com/VIklS",
            google:
              "https://www.google.com/maps/search/?api=1&query=46.924805,53.871304",
          },
          {
            name: "Akkiiztogay village post",
            inspector: "Police Captain Nurlybek Tautekin",
            photo: "/images/officers/tautekin-nurlybek.jpg",
            phone: "+7 778 854 0666",
            phoneRaw: "+77788540666",
            twoGis: "https://go.2gis.com/3nYkF",
            google:
              "https://www.google.com/maps/search/?api=1&query=47.096336,54.376663",
          },
          {
            name: "Embi village post",
            inspector: "Police Major Maksim Izbergenov",
            photo: "/images/officers/izbergenov-maksim.jpg",
            google:
              "https://www.google.com/maps/search/?api=1&query=Емби+Жылыойский+район",
          },
          {
            name: "Shokpartogay village post",
            address: "Kara-Arna district, B. Nurmaganbetov st., 374",
            inspector: "Police Major Nurgisa Zhamalbekov",
            phone: "+7 775 607 0736",
            phoneRaw: "+77756070736",
            google:
              "https://www.google.com/maps/search/?api=1&query=Шокпартогай+Атырауская+область",
          },
        ],
      },
    ],
  },
  tracking: {
    title: "Monitoring systems",
    subtitle: "Special devices guarding road safety",
    photoHint: "View photo",
    close: "Close",
    devices: [
      {
        title: "Drone",
        description:
          "The DJI Matrice 350 RTK UAV records oncoming-lane violations and dangerous manoeuvres on highways and helps search for missing people. Control range - 20 km, flight time - 55 minutes, speed - 82.8 km/h.",
        images: [
          {
            src: "/images/tracking/dji-matrice-350.jpg",
            caption: "DJI Matrice 350 RTK quadcopter",
          },
        ],
      },
      {
        title: "Cyber Sheriff",
        description:
          "An automatic system on a patrol car: 360° panoramic video recording, recognition of licence plates and pedestrians' faces checked against wanted databases, detection of speeding, solid-line crossing and parking violations, live streaming from accident scenes.",
        images: [
          {
            src: "/images/tracking/cyber-sheriff-1.jpg",
            caption: "Cyber Sheriff system on a patrol car roof",
          },
          {
            src: "/images/tracking/cyber-sheriff-2.jpg",
            caption: "Cyber Sheriff camera unit",
          },
          {
            src: "/images/tracking/cyber-sheriff-car.jpg",
            caption: "Cyber Sheriff patrol car",
          },
        ],
        link: {
          href: "https://msmax.kz/kiber_sherif/",
          label: "More about Cyber Sheriff (msmax.kz)",
        },
      },
      {
        title: "Ekin Patrol G2",
        description:
          "An AI-powered mobile photo and video enforcement system. It works around the clock, both moving and parked: 360° speed control within 100 metres (front, rear and side), plate checks against stolen-car and unpaid-fine databases, parking control, separate speed limits per lane. The officer only sets the speed threshold - the system runs autonomously.",
        images: [
          {
            src: "/images/tracking/ekin-1.jpg",
            caption: "Ekin Patrol G2 light bar",
          },
          {
            src: "/images/tracking/ekin-2.jpg",
            caption: "Ekin Patrol G2 camera module",
          },
          {
            src: "/images/tracking/ekin-3.jpg",
            caption: "Ekin Patrol G2 on a patrol car",
          },
          {
            src: "/images/tracking/ekin-patrol-bar.jpg",
            caption: "Ekin Patrol G2 system",
          },
          {
            src: "/images/tracking/ekin-patrol-car.jpg",
            caption: "Patrol car with the Ekin Patrol system",
          },
        ],
      },
      {
        title: "Oracle-Insight",
        description:
          "A compact optical-radar system for photo and video detection of traffic violations. Mounted on a patrol car, it works both in motion and stationary - in covert and open modes.",
        link: {
          href: "https://olvia.ru/product/complex/oraculinside",
          label: "Oracle-Insight on the manufacturer's site (olvia.ru)",
        },
      },
    ],
  },
  recruitment: {
    title: "Join the police",
    subtitle: "The Zhylyoi District Police Department invites you to serve",
    detailsLabel: "Full details",
    modalTitle: "Joining the service",
    close: "Close",
    noTestNote:
      "Candidates for junior command (sergeant) positions who have completed military service or a military department are accepted without testing, in accordance with the legislation of Kazakhstan.",
    benefitsTitle: "Benefits and guarantees",
    benefits: [
      "Free medical care",
      "Monetary compensation for housing rental",
      "Home ownership through a state-paid mortgage",
      "45 days of paid leave every year",
      "Marine police unit: 21 days on / 7 days off rotation, free dormitory and meals",
      "One year of service in Atyrau Region counts as one and a half years",
      "Early retirement option",
      "Free uniform",
    ],
    requirementsTitle: "Candidate requirements",
    requirements: [
      "Age 18 to 35",
      "Fit for service on health grounds",
      "Specialized secondary or higher education",
    ],
    documentsTitle: "List of documents",
    documents: [
      "Application for service",
      "National ID of a citizen of Kazakhstan",
      "Education documents",
      "Military registration documents",
      "Medical commission conclusion",
      "Declaration of income and assets",
      "Photographs of the established format",
    ],
    downloadLabel: "Recruitment instruction (adilet.zan.kz)",
    downloadUrl: "https://adilet.zan.kz/rus/docs/V2100022478",
    infoLabel: "Law “On Law Enforcement Service”",
    infoUrl: "https://adilet.zan.kz/rus/docs/Z1100000380",
    contactLabel: "Contact the HR service",
    contactAddress: "Kulsary, B. Bisenkulov st., 47",
    contactPhone: "+7 775 488 20 58",
    contactPhoneRaw: "+77754882058",
  },
  units: {
    title: "Units",
    subtitle: "Who works for your safety",
    officerLabel: "Officer in charge",
    items: [
      {
        title: "Patrol police company",
        description:
          "Round-the-clock patrolling of Kulsary streets and district villages, responding to 102 calls.",
        officer: {
          name: "Adilet Salimov",
          photo: "/images/units/adilet.jpg",
          phone: "+7 776 532 9126",
          phoneRaw: "+77765329126",
        },
      },
      {
        title: "Migration service",
        description:
          "Residence registration, documentation, registration of foreign citizens.",
        officer: {
          name: "Makhambet Tasbolatovich",
          photo: "/images/units/makhambet.jpg",
          phone: "+7 775 061 7676",
          phoneRaw: "+77750617676",
        },
      },
      {
        title: "District inspectors",
        description:
          "Crime prevention, citizen reception, community work in assigned areas.",
        officer: {
          name: "Smadiyar Sydykov",
          phone: "+7 702 524 6681",
          phoneRaw: "+77025246681",
        },
      },
      {
        title: "Republican highway patrol",
        description:
          "Monitoring the Atyrau - Kulsary - Tengiz republican highway: speed control, help for drivers in the steppe.",
        officer: {
          name: "Adilet Nuraliyev",
          phone: "+7 778 808 7809",
          phoneRaw: "+77788087809",
        },
      },
    ],
  },
  roadSafety: {
    title: "Hazardous road sections",
    subtitle: "Stay alert on the district's roads",
    body: [
      "The Atyrau - Kulsary highway (230 km) and the Tengiz road carry heavy truck traffic. Ice and snowstorms are possible in winter; sun glare and mirages in summer.",
      "Observe the speed limit: drones and special cameras operate on the highways. In case of an accident or danger, call 102 - help will be dispatched from the nearest police post.",
    ],
    infoLabel: "Information",
  },
  video: {
    title: "Video",
    subtitle: "Video about the work of the Zhylyoi district police",
    watchLabel: "Watch on Instagram",
    url: "https://www.instagram.com/p/DacNY0DN3u1/",
  },
  social: {
    title: "Follow us",
    subtitle: "News of the Zhylyoi district police - Jylyoi_police",
    instagram: "https://www.instagram.com/jylyoi_police_/",
    facebook: "https://www.facebook.com/dvdatyrau",
    tiktok: "",
    comingSoon: "soon",
  },
  footer: {
    org: "Zhylyoi District Police Department, PD of Atyrau Region, MIA RK",
    disclaimer: "Police emergency - 102, unified rescue service - 112",
    backToLang: "Change language",
  },
};

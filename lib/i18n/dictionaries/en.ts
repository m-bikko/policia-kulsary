import type { Dictionary } from "../types";

export const en: Dictionary = {
  meta: {
    title: "Zhylyoi District Police Department - Kulsary | Atyrau Region",
    description:
      "Official information page of the Zhylyoi District Police Department, Police Department of Atyrau Region. Emergency - 102.",
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
      { value: "87,863", label: "district residents under protection" },
      { value: "3,500+", label: "special cameras across Atyrau Region" },
      { value: "320+", label: "highway violations detected by drones" },
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
            phone: "+7 778 854 0666",
            phoneRaw: "+77788540666",
            twoGis: "https://go.2gis.com/3nYkF",
            google:
              "https://www.google.com/maps/search/?api=1&query=47.096336,54.376663",
          },
          {
            name: "Shokpartogay village post",
            address: "Kara-Arna district, B. Nurmaganbetov st., 374",
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
    drones: {
      title: "Drones",
      description:
        "UAVs record oncoming-lane violations and dangerous manoeuvres on highways and help search for missing people - including with thermal cameras.",
    },
    radar: {
      title: "Radars",
      description:
        "Special cameras and radars monitor the region's roads around the clock: speeding, red-light running, seat belts.",
    },
  },
  recruitment: {
    title: "Join the police",
    subtitle: "The Zhylyoi District Police Department invites you to serve",
    noTestNote:
      "Candidates for junior command (sergeant) positions who have completed military service or a military department are accepted without testing, in accordance with the legislation of Kazakhstan.",
    salaryTitle: "Stable monthly salary",
    salary: [
      { value: "220,000+ ₸", label: "command staff" },
      { value: "180,000+ ₸", label: "junior command staff" },
    ],
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
    items: [
      {
        title: "Patrol police",
        description:
          "Round-the-clock patrolling of Kulsary streets and district villages, responding to 102 calls.",
      },
      {
        title: "Migration service",
        description:
          "Residence registration, documentation, registration of foreign citizens.",
      },
      {
        title: "District inspectors",
        description:
          "Crime prevention, citizen reception, community work in assigned areas.",
      },
      {
        title: "Highway patrol",
        description:
          "Monitoring the Atyrau - Kulsary - Tengiz highways: speed control, help for drivers in the steppe.",
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
    subtitle: "Reports on the work of Kazakhstan's police",
    watchLabel: "Watch on polisia.kz",
    url: "https://polisia.kz/en/",
  },
  social: {
    title: "Follow us",
    subtitle: "News of the Atyrau Region police",
    instagram: "https://www.instagram.com/police.atyrau/",
    facebook: "https://www.facebook.com/dvdatyrau",
    telegram: "https://t.me/POLICE_of_KZ",
    tiktok: "",
    comingSoon: "soon",
  },
  footer: {
    org: "Zhylyoi District Police Department, PD of Atyrau Region, MIA RK",
    disclaimer: "Police emergency - 102, unified rescue service - 112",
    backToLang: "Change language",
  },
};

import type { Dictionary } from "../types";

export const en: Dictionary = {
  meta: {
    title: "Zhylyoi District Police - Kulsary | Atyrau Region",
    description:
      "Official information page of the Zhylyoi District Police Department, Police Department of Atyrau Region, Ministry of Internal Affairs of Kazakhstan. Emergency - 102.",
  },
  splash: {
    title: "Zhylyoi Police",
    ministry: "Ministry of Internal Affairs of the Republic of Kazakhstan",
    choose: "Choose your language",
    hint: "You can change the language at any time",
  },
  header: {
    name: "Zhylyoi District Police",
    department: "Police Department of Atyrau Region · MIA RK",
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
    addressValue: "Kulsary, Bisenbi Bisenkulov st., 46",
  },
  stats: {
    heading: "Service in numbers",
    items: [
      { value: "87,863", label: "district residents under protection" },
      { value: "3,500+", label: "Sergek cameras across Atyrau Region" },
      { value: "320+", label: "highway violations detected by drones" },
      { value: "24/7", label: "duty unit works around the clock" },
    ],
    source: "Data: gov.kz, polisia.kz and regional media",
  },
  info: {
    title: "Information",
    subtitle: "About the district and the department",
    paragraphs: [
      "The Zhylyoi District Police Department maintains public order and safety across 29,400 km² - from the town of Kulsary to the rural districts of Akkiiztogay, Zhem, Karaton, Koschagyl and Maikomgen.",
      "Zhylyoi District is the oil heart of Atyrau Region: over 40 fields, including Tengiz. More than 87,000 people live in the district, about 60,000 of them in Kulsary.",
      "During the 2024 flood, police officers together with rescuers helped evacuate more than 30,000 residents and guarded property in the flooded areas.",
    ],
    wikipedia: "Zhylyoi District on Wikipedia",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Zhylyoi_District",
    govPortal: "Official page of the Atyrau Region Police Department",
    govPortalUrl: "https://www.gov.kz/memleket/entities/mvd-atyrau?lang=en",
  },
  points: {
    title: "Police stations",
    subtitle: "Police near you - in town and villages",
    headquarters: {
      name: "Police Department - Kulsary",
      note: "Duty unit, open 24/7",
      maps: {
        twoGis: "https://2gis.kz/atyrau/firm/70000001077001378",
        google:
          "https://www.google.com/maps/search/?api=1&query=Zhylyoi+District+Police+Kulsary",
      },
    },
    items: [
      {
        name: "Shokpartogay",
        note: "Local police post",
        maps: {
          twoGis: "https://2gis.kz/search/Шокпартогай",
          google:
            "https://www.google.com/maps/search/?api=1&query=Shokpartogay+Atyrau+Region",
        },
      },
      {
        name: "Embi (Zhem)",
        note: "Local police post",
        maps: {
          twoGis: "https://2gis.kz/search/село+Емби",
          google:
            "https://www.google.com/maps/search/?api=1&query=Embi+Zhylyoi+District",
        },
      },
      {
        name: "Akkiiztogay",
        note: "Local police post",
        maps: {
          twoGis: "https://2gis.kz/search/Аккиизтогай",
          google:
            "https://www.google.com/maps/search/?api=1&query=Akkiiztogay+Atyrau+Region",
        },
      },
    ],
    open2gis: "Open in 2GIS",
    openGoogle: "Google Maps",
  },
  tracking: {
    title: "Monitoring systems",
    subtitle: "Technology guarding road safety",
    drones: {
      title: "Drones",
      description:
        "UAVs record oncoming-lane violations and dangerous manoeuvres on highways and help search for missing people - including with thermal cameras.",
      facts: ["320+ violations detected from the air", "Search operations in the steppe"],
    },
    radar: {
      title: "Radars & Sergek",
      description:
        "Over 3,500 cameras of the Sergek system monitor the region's roads around the clock: speeding, red-light running, seat belts.",
      facts: ["3,500+ cameras in the region", "Violations recorded 24/7"],
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
    contactAddress: "Kulsary, B. Bisenkulov st., 46",
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
      "Observe the speed limit: drones and Sergek cameras operate on the highways. In case of an accident or danger, call 102 - help will be dispatched from the nearest station.",
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

export type MapLinks = {
  twoGis: string;
  google: string;
};

export type SupportPoint = {
  name: string;
  note: string;
  maps: MapLinks;
};

export type Unit = {
  title: string;
  description: string;
};

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  splash: {
    title: string;
    ministry: string;
    choose: string;
    hint: string;
  };
  header: {
    name: string;
    department: string;
    location: string;
    official: string;
  };
  emergency: {
    label: string;
    police: string;
    unified: string;
    duty: string;
    dutyPhone: string;
    address: string;
    addressValue: string;
  };
  stats: {
    heading: string;
    items: { value: string; label: string }[];
    source: string;
  };
  info: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    wikipedia: string;
    wikipediaUrl: string;
    govPortal: string;
    govPortalUrl: string;
  };
  points: {
    title: string;
    subtitle: string;
    headquarters: SupportPoint;
    items: SupportPoint[];
    open2gis: string;
    openGoogle: string;
  };
  tracking: {
    title: string;
    subtitle: string;
    drones: Unit & { facts: string[] };
    radar: Unit & { facts: string[] };
  };
  recruitment: {
    title: string;
    subtitle: string;
    noTestNote: string;
    salaryTitle: string;
    salary: { value: string; label: string }[];
    benefitsTitle: string;
    benefits: string[];
    requirementsTitle: string;
    requirements: string[];
    documentsTitle: string;
    documents: string[];
    downloadLabel: string;
    downloadUrl: string;
    infoLabel: string;
    infoUrl: string;
    contactLabel: string;
    contactAddress: string;
    contactPhone: string;
    contactPhoneRaw: string;
  };
  units: {
    title: string;
    subtitle: string;
    items: Unit[];
  };
  roadSafety: {
    title: string;
    subtitle: string;
    body: string[];
    infoLabel: string;
  };
  video: {
    title: string;
    subtitle: string;
    watchLabel: string;
    url: string;
  };
  social: {
    title: string;
    subtitle: string;
    instagram: string;
    facebook: string;
    telegram: string;
    tiktok: string;
    comingSoon: string;
  };
  footer: {
    org: string;
    disclaimer: string;
    backToLang: string;
  };
};

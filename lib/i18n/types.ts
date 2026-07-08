export type MapLinks = {
  twoGis: string;
  google: string;
};

export type SupportPoint = {
  name: string;
  note: string;
  maps: MapLinks;
};

/** Участковый пункт полиции: адрес, инспектор и ссылки на карты — поля опциональны, данные частичные */
export type PolicePoint = {
  name: string;
  address?: string;
  inspector?: string;
  photo?: string;
  phone?: string;
  phoneRaw?: string;
  twoGis?: string;
  google?: string;
};

export type PointGroup = {
  label: string;
  points: PolicePoint[];
};

export type Unit = {
  title: string;
  description: string;
  /** Ответственное лицо раздела; фото опционально - данные передаются постепенно */
  officer?: { name: string; photo?: string };
};

export type DeviceImage = {
  src: string;
  caption: string;
};

export type TrackingDevice = {
  title: string;
  description: string;
  images?: DeviceImage[];
  link?: { href: string; label: string };
};

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  theme: {
    toDark: string;
    toLight: string;
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
    open2gis: string;
    openGoogle: string;
    openList: string;
    modalTitle: string;
    close: string;
    call: string;
    groups: PointGroup[];
  };
  tracking: {
    title: string;
    subtitle: string;
    photoHint: string;
    close: string;
    devices: TrackingDevice[];
  };
  recruitment: {
    title: string;
    subtitle: string;
    detailsLabel: string;
    modalTitle: string;
    close: string;
    noTestNote: string;
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
    officerLabel: string;
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
    tiktok: string;
    comingSoon: string;
  };
  footer: {
    org: string;
    disclaimer: string;
    backToLang: string;
  };
};

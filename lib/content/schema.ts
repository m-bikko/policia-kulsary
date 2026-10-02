import { image, list, loc, obj, t, text, type Infer } from "./schema-dsl";

/**
 * Схема всего контента сайта. Порядок секций = порядок вкладок в /edit.
 * `loc` - переводимый текст (kz/ru/en), `text` - одно значение для всех языков,
 * `image` - фото в Supabase Storage.
 */

/* Часто повторяющиеся подписи */
const L = {
  title: t("Тақырып", "Заголовок", "Title"),
  subtitle: t("Тақырыпша", "Подзаголовок", "Subtitle"),
  name: t("Атауы", "Название", "Name"),
  description: t("Сипаттама", "Описание", "Description"),
  phone: t("Телефон", "Телефон", "Phone"),
  photo: t("Фото", "Фото", "Photo"),
  address: t("Мекенжай", "Адрес", "Address"),
  twoGis: t("2ГИС сілтемесі", "Ссылка 2ГИС", "2GIS link"),
  google: t("Google Maps сілтемесі", "Ссылка Google Maps", "Google Maps link"),
  close: t("«Жабу» батырмасы", "Кнопка «Закрыть»", "“Close” button"),
  paragraph: t("Абзац", "Абзац", "Paragraph"),
  item: t("Тармақ", "Пункт", "Item"),
  linkText: t("Сілтеме мәтіні", "Текст ссылки", "Link text"),
  linkUrl: t("Сілтеме адресі", "Адрес ссылки", "Link URL"),
};

export const contentSchema = obj(t("Сайт", "Сайт", "Site"), {
  media: obj(t("Логотип және фон", "Логотип и фон", "Logo & background"), {
    logo: image(t("Логотип (эмблема)", "Логотип (эмблема)", "Logo (emblem)"), {
      shape: "round",
      hint: t(
        "Шапкада және браузер қойындысында көрсетіледі",
        "Показывается в шапке и во вкладке браузера",
        "Shown in the header and in the browser tab",
      ),
    }),
    heroBackground: image(
      t("Шапканың фон суреті", "Фоновое фото шапки", "Header background photo"),
      { shape: "wide" },
    ),
  }),

  meta: obj(t("Іздеу жүйелері (SEO)", "Поисковики (SEO)", "Search engines (SEO)"), {
    title: loc(t("Қойынды атауы", "Название вкладки", "Tab title")),
    description: loc(t("Іздеудегі сипаттама", "Описание в поиске", "Search description"), {
      multiline: true,
    }),
  }),

  header: obj(t("Шапка", "Шапка", "Header"), {
    name: loc(t("Басқарма атауы", "Название управления", "Department name")),
    department: loc(t("Жоғары тұрған орган", "Вышестоящий орган", "Parent body")),
    location: loc(t("Орналасуы", "Местоположение", "Location")),
    official: loc(t("Мәртебесі", "Статус", "Status")),
    logoAlt: loc(t("Логотип сипаттамасы (зағиптарға)", "Описание логотипа (для незрячих)", "Logo alt text")),
  }),

  emergency: obj(t("Жедел байланыс", "Экстренные контакты", "Emergency contacts"), {
    police: loc(t("102 батырмасының жасырын жазуы", "Скрытая подпись кнопки 102", "Hidden label of the 102 button")),
    duty: loc(t("Кезекші бөлім жазуы", "Подпись дежурной части", "Duty unit label")),
    dutyPhone: text(t("Кезекші бөлім телефоны", "Телефон дежурной части", "Duty unit phone"), {
      input: "tel",
    }),
    chief: obj(t("Басқарма бастығы", "Начальник управления", "Head of department"), {
      label: loc(t("Лауазымы", "Должность", "Position")),
      name: loc(t("Атағы және аты-жөні", "Звание и ФИО", "Rank and full name")),
      phone: text(L.phone, { input: "tel" }),
    }),
    address: loc(t("«Мекенжай» жазуы", "Подпись «Адрес»", "“Address” label")),
    addressValue: loc(L.address),
  }),

  stats: obj(t("Қызмет сандармен", "Служба в цифрах", "Service in numbers"), {
    heading: loc(L.title),
    items: list(
      t("Көрсеткіштер", "Показатели", "Figures"),
      t("Көрсеткіш", "Показатель", "Figure"),
      obj(L.item, {
        value: text(t("Мәні", "Значение", "Value")),
        label: loc(L.description),
      }),
      { titleKey: "value" },
    ),
    source: loc(t("Дереккөз", "Источник данных", "Data source")),
  }),

  info: obj(t("Ақпарат", "Информация", "Information"), {
    title: loc(L.title),
    subtitle: loc(L.subtitle),
    paragraphs: list(
      t("Мәтін", "Текст", "Text"),
      L.paragraph,
      loc(L.paragraph, { multiline: true }),
    ),
    wikipedia: loc(t("Уикипедия батырмасы", "Кнопка Википедии", "Wikipedia button")),
    wikipediaUrl: loc(t("Уикипедия сілтемесі", "Ссылка на Википедию", "Wikipedia link"), {
      input: "url",
    }),
    govPortal: loc(t("gov.kz батырмасы", "Кнопка gov.kz", "gov.kz button")),
    govPortalUrl: loc(t("gov.kz сілтемесі", "Ссылка на gov.kz", "gov.kz link"), {
      input: "url",
    }),
  }),

  points: obj(t("Полиция пункттері", "Пункты полиции", "Police posts"), {
    title: loc(L.title),
    subtitle: loc(L.subtitle),
    headquarters: obj(t("Басқарма ғимараты", "Здание управления", "Headquarters"), {
      name: loc(L.name),
      note: loc(t("Жұмыс уақыты", "Режим работы", "Working hours")),
      twoGis: text(L.twoGis, { input: "url" }),
      google: text(L.google, { input: "url" }),
    }),
    open2gis: loc(t("2ГИС батырмасы", "Кнопка 2ГИС", "2GIS button")),
    openGoogle: loc(t("Google Maps батырмасы", "Кнопка Google Maps", "Google Maps button")),
    openList: loc(t("«Барлық пункттер» батырмасы", "Кнопка «Все пункты»", "“All posts” button")),
    modalTitle: loc(t("Терезе тақырыбы", "Заголовок окна", "Dialog title")),
    close: loc(L.close),
    groups: list(
      t("Пункт топтары", "Группы пунктов", "Post groups"),
      t("Топ", "Группа", "Group"),
      obj(t("Топ", "Группа", "Group"), {
        label: loc(t("Топ атауы", "Название группы", "Group name")),
        points: list(
          t("Пункттер", "Пункты", "Posts"),
          t("Пункт", "Пункт", "Post"),
          obj(t("Пункт", "Пункт", "Post"), {
            name: loc(L.name),
            address: loc(L.address),
            inspector: loc(t("Инспектор (атағы, аты-жөні)", "Инспектор (звание, ФИО)", "Inspector (rank, name)")),
            photo: image(t("Инспектор фотосы", "Фото инспектора", "Inspector photo"), {
              shape: "round",
            }),
            phone: text(L.phone, { input: "tel" }),
            twoGis: text(L.twoGis, { input: "url" }),
            google: text(L.google, { input: "url" }),
          }),
          { titleKey: "name" },
        ),
      }),
      { titleKey: "label" },
    ),
  }),

  tracking: obj(t("Бақылау жүйелері", "Системы отслеживания", "Monitoring systems"), {
    title: loc(L.title),
    subtitle: loc(L.subtitle),
    photoHint: loc(t("«Фотоны көру» жазуы", "Надпись «Посмотреть фото»", "“View photo” label")),
    close: loc(L.close),
    devices: list(
      t("Құрылғылар", "Устройства", "Devices"),
      t("Құрылғы", "Устройство", "Device"),
      obj(t("Құрылғы", "Устройство", "Device"), {
        title: loc(L.name),
        description: loc(L.description, { multiline: true }),
        images: list(
          t("Фотолар", "Фотографии", "Photos"),
          L.photo,
          obj(L.photo, {
            src: image(L.photo, { shape: "wide" }),
            caption: loc(t("Фото жазуы", "Подпись к фото", "Photo caption")),
          }),
          { titleKey: "caption" },
        ),
        link: obj(t("Толығырақ сілтемесі", "Ссылка «Подробнее»", "“Learn more” link"), {
          href: text(L.linkUrl, { input: "url" }),
          label: loc(L.linkText),
        }),
      }),
      { titleKey: "title" },
    ),
  }),

  recruitment: obj(t("Жұмысқа қабылдау", "Приём на службу", "Recruitment"), {
    title: loc(L.title),
    subtitle: loc(L.subtitle),
    noTestNote: loc(t("Тестсіз қабылдау туралы ескерту", "Примечание о приёме без тестов", "No-test admission note"), {
      multiline: true,
    }),
    detailsLabel: loc(t("«Толық ақпарат» батырмасы", "Кнопка «Подробнее»", "“Full details” button")),
    modalTitle: loc(t("Терезе тақырыбы", "Заголовок окна", "Dialog title")),
    close: loc(L.close),
    benefitsTitle: loc(t("Жеңілдіктер тақырыбы", "Заголовок льгот", "Benefits title")),
    benefits: list(
      t("Жеңілдіктер", "Льготы", "Benefits"),
      L.item,
      loc(L.item, { multiline: true }),
    ),
    requirementsTitle: loc(t("Талаптар тақырыбы", "Заголовок требований", "Requirements title")),
    requirements: list(t("Талаптар", "Требования", "Requirements"), L.item, loc(L.item)),
    documentsTitle: loc(t("Құжаттар тақырыбы", "Заголовок документов", "Documents title")),
    documents: list(t("Құжаттар", "Документы", "Documents"), L.item, loc(L.item)),
    downloadLabel: loc(t("Нұсқаулық батырмасы", "Кнопка инструкции", "Instruction button")),
    downloadUrl: loc(t("Нұсқаулық сілтемесі", "Ссылка на инструкцию", "Instruction link"), {
      input: "url",
    }),
    infoLabel: loc(t("Заң батырмасы", "Кнопка закона", "Law button")),
    infoUrl: loc(t("Заң сілтемесі", "Ссылка на закон", "Law link"), { input: "url" }),
    contactLabel: loc(t("Байланыс тақырыбы", "Заголовок контакта", "Contact title")),
    contactAddress: loc(t("Кадр қызметінің мекенжайы", "Адрес кадровой службы", "HR office address")),
    contactPhone: text(t("Кадр қызметінің телефоны", "Телефон кадровой службы", "HR office phone"), {
      input: "tel",
    }),
  }),

  units: obj(t("Бөлімшелер", "Подразделения", "Units"), {
    title: loc(L.title),
    subtitle: loc(L.subtitle),
    officerLabel: loc(t("«Жауапты тұлға» жазуы", "Надпись «Ответственное лицо»", "“Officer in charge” label")),
    items: list(
      t("Бөлімшелер", "Подразделения", "Units"),
      t("Бөлімше", "Подразделение", "Unit"),
      obj(t("Бөлімше", "Подразделение", "Unit"), {
        title: loc(L.name),
        description: loc(L.description, { multiline: true }),
        officer: obj(t("Жауапты тұлға", "Ответственное лицо", "Officer in charge"), {
          name: loc(t("Аты-жөні", "ФИО", "Full name"), {
            hint: t(
              "Бос қалдырсаңыз, блок көрсетілмейді",
              "Если оставить пустым, блок не показывается",
              "Leave empty to hide the block",
            ),
          }),
          photo: image(L.photo, { shape: "round" }),
          phone: text(L.phone, { input: "tel" }),
        }),
      }),
      { titleKey: "title" },
    ),
  }),

  roadSafety: obj(t("Апатты учаскелер", "Аварийные участки", "Hazardous roads"), {
    title: loc(L.title),
    subtitle: loc(L.subtitle),
    infoLabel: loc(t("Блок тақырыбы", "Заголовок блока", "Block title")),
    body: list(t("Мәтін", "Текст", "Text"), L.paragraph, loc(L.paragraph, { multiline: true })),
  }),

  video: obj(t("Бейне", "Видео", "Video"), {
    title: loc(L.title),
    subtitle: loc(L.subtitle),
    watchLabel: loc(L.linkText),
    url: text(t("Бейне сілтемесі", "Ссылка на видео", "Video link"), { input: "url" }),
  }),

  social: obj(t("Әлеуметтік желілер", "Соцсети", "Social media"), {
    title: loc(L.title),
    subtitle: loc(L.subtitle),
    instagram: text(t("Instagram сілтемесі", "Ссылка Instagram", "Instagram link"), {
      input: "url",
    }),
    facebook: text(t("Facebook сілтемесі", "Ссылка Facebook", "Facebook link"), {
      input: "url",
    }),
    tiktok: text(t("TikTok сілтемесі", "Ссылка TikTok", "TikTok link"), {
      input: "url",
      hint: t(
        "Бос болса, батырма «жақында» деп көрсетіледі",
        "Если пусто, кнопка показывается как «скоро»",
        "If empty, the button is shown as “coming soon”",
      ),
    }),
    comingSoon: loc(t("«Жақында» белгісі", "Метка «скоро»", "“Coming soon” badge")),
  }),

  regionDistricts: obj(
    t("Облыстың аудандары", "Районы области", "Region districts"),
    {
      title: loc(L.title),
      subtitle: loc(L.subtitle),
      comingSoon: loc(t("«Дайындалуда» белгісі", "Метка «готовится»", "“In preparation” badge")),
    },
    {
      hint: t(
        "Облыс лендингінде ғана көрсетіледі: тізім картадан автоматты түрде жасалады",
        "Показывается только на лендинге области: список районов строится автоматически по карте",
        "Shown only on a region landing: the district list is built automatically from the map",
      ),
    },
  ),

  footer: obj(t("Сайт төменгі бөлігі", "Подвал сайта", "Footer"), {
    org: loc(t("Ұйым атауы", "Название организации", "Organization")),
    disclaimer: loc(t("Жедел нөмірлер жолы", "Строка экстренных номеров", "Emergency numbers line")),
    portalLink: loc(t("«Барлық бөлімшелер» сілтемесі", "Ссылка «Все подразделения»", "“All departments” link")),
  }),

  theme: obj(t("Интерфейс", "Интерфейс", "Interface"), {
    toDark: loc(t("Қараңғы тема батырмасы", "Кнопка тёмной темы", "Dark theme button")),
    toLight: loc(t("Жарық тема батырмасы", "Кнопка светлой темы", "Light theme button")),
  }),
});

export type Content = Infer<typeof contentSchema>;
export type ContentSectionKey = keyof typeof contentSchema.fields;

import { loc, obj, t, text, type Infer } from "./schema-dsl";

/**
 * Схема портала: главная страница (выбор языка) и каталог «Найдите полицию
 * своего района» с картой Казахстана. Логотип портала берётся из общего шаблона.
 */
export const portalSchema = obj(t("Портал", "Портал", "Portal"), {
  splash: obj(
    t("Тіл таңдау экраны", "Экран выбора языка", "Language screen"),
    {
      title: text(t("Тақырып", "Заголовок", "Title")),
      subtitle: text(t("Тақырыпша", "Подзаголовок", "Subtitle")),
      chooseLabel: text(t("«Тілді таңдаңыз» жазуы", "Надпись «Выберите язык»", "“Choose language” label")),
      footerNote: text(t("Төменгі жазу", "Нижняя надпись", "Bottom note")),
    },
    {
      hint: t(
        "Тіл таңдалғанға дейін көрсетіледі, сондықтан бір тілде толтырылады",
        "Показывается до выбора языка, поэтому заполняется одним текстом",
        "Shown before a language is chosen, so it is filled in once",
      ),
    },
  ),

  meta: obj(t("Іздеу жүйелері (SEO)", "Поисковики (SEO)", "Search engines (SEO)"), {
    title: loc(t("Қойынды атауы", "Название вкладки", "Tab title")),
    description: loc(t("Іздеудегі сипаттама", "Описание в поиске", "Search description"), {
      multiline: true,
    }),
  }),

  directory: obj(t("Карта және каталог", "Карта и каталог", "Map and directory"), {
    title: loc(t("Тақырып", "Заголовок", "Title")),
    subtitle: loc(t("Тақырыпша", "Подзаголовок", "Subtitle"), { multiline: true }),
    searchPlaceholder: loc(t("Іздеу өрісінің мәтіні", "Подсказка в поиске", "Search placeholder")),
    allRegions: loc(t("«Барлық облыстар» батырмасы", "Кнопка «Все регионы»", "“All regions” button")),
    regionDepartment: loc(t("Облыс департаменті сілтемесі", "Ссылка на департамент области", "Region department link")),
    districtsTitle: loc(t("Аудандар тізімінің тақырыбы", "Заголовок списка районов", "District list title")),
    comingSoon: loc(t("«Дайындалуда» белгісі", "Метка «готовится»", "“In preparation” badge")),
    notFound: loc(t("Ештеңе табылмады", "Ничего не найдено", "Nothing found")),
    emergencyNote: loc(t("Жедел шақыру туралы жол", "Строка об экстренном вызове", "Emergency call line")),
  }),

  theme: obj(t("Интерфейс", "Интерфейс", "Interface"), {
    toDark: loc(t("Қараңғы тема батырмасы", "Кнопка тёмной темы", "Dark theme button")),
    toLight: loc(t("Жарық тема батырмасы", "Кнопка светлой темы", "Light theme button")),
  }),
});

export type PortalContent = Infer<typeof portalSchema>;

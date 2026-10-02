import type { Locale } from "@/lib/i18n/config";
import type { AdminErrorCode } from "@/lib/admin/types";
import type { DocKind } from "@/lib/admin/documents";

/** Надписи интерфейса редактора /edit на трёх языках */
export type AdminStrings = {
  appTitle: string;
  loginTitle: string;
  loginSubtitle: string;
  pinLabel: string;
  loginButton: string;
  wrongPin: string;
  locked: (minutes: number) => string;
  adminNotConfigured: string;
  supabaseNotConfigured: string;
  notSeeded: string;
  save: string;
  saved: string;
  unsaved: string;
  allSaved: string;
  lastSaved: (time: string) => string;
  shortcutHint: string;
  logout: string;
  viewSite: string;
  interfaceLanguage: string;
  addItem: (itemLabel: string) => string;
  removeItem: string;
  removeConfirm: string;
  yes: string;
  no: string;
  moveUp: string;
  moveDown: string;
  emptyList: string;
  untitled: string;
  missingTranslation: string;
  upload: string;
  replace: string;
  removePhoto: string;
  uploading: string;
  uploaded: string;
  noPhoto: string;
  unsupportedFormat: string;
  conflictTitle: string;
  conflictText: string;
  conflictReload: string;
  conflictOverwrite: string;
  sessionExpired: string;
  draftRestoreTitle: string;
  draftRestoreText: string;
  draftRestore: string;
  draftDiscard: string;
  leaveWarning: string;
  keepAliveNever: string;
  keepAliveStale: (days: number) => string;
  keepAliveHint: string;
  dashboardTitle: string;
  mapHint: string;
  templateDescription: string;
  portalDescription: string;
  edit: string;
  open: string;
  preview: string;
  published: string;
  draft: string;
  publishedCount: (published: number, total: number) => string;
  searchPlaceholder: string;
  nothingFound: string;
  allRegions: string;
  regionLanding: string;
  districtsTitle: string;
  kinds: Record<DocKind, string>;
  statusLabel: string;
  publishedNow: string;
  unpublishedNow: string;
  draftHidden: string;
  previewBanner: string;
  backToMap: string;
  siteFieldsHint: string;
  showAllFields: string;
  showAllFieldsHint: string;
  inheritedList: (count: number) => string;
  copyFromTemplate: string;
  inheritedPhoto: string;
  templateWarning: string;
  loadFailed: string;
  errors: Record<AdminErrorCode, string>;
};

export const adminStrings: Record<Locale, AdminStrings> = {
  kz: {
    appTitle: "Сайт редакторы",
    loginTitle: "Редакторға кіру",
    loginSubtitle: "Полиция бөлімшелерінің сайттары",
    pinLabel: "PIN-код",
    loginButton: "Кіру",
    wrongPin: "PIN-код қате",
    locked: (m) => `Тым көп әрекет. ${m} минуттан кейін қайталаңыз`,
    adminNotConfigured: "ADMIN_PIN айнымалысы орнатылмаған - .env файлына қосыңыз",
    supabaseNotConfigured:
      "Supabase қосылмаған: сақтау және фото жүктеу жұмыс істемейді. .env файлын тексеріңіз",
    notSeeded:
      "Бұл құжат әлі базада жоқ - бірінші сақтау оны жасайды",
    save: "Сақтау",
    saved: "Сақталды - сайт жаңартылды",
    unsaved: "Сақталмаған өзгерістер бар",
    allSaved: "Барлық өзгерістер сақталған",
    lastSaved: (time) => `Соңғы сақтау: ${time}`,
    shortcutHint: "Ctrl/⌘ + S - сақтау",
    logout: "Шығу",
    viewSite: "Сайтты ашу",
    interfaceLanguage: "Интерфейс тілі",
    addItem: (label) => `Қосу: ${label}`,
    removeItem: "Жою",
    removeConfirm: "Бұл элементті жою керек пе?",
    yes: "Иә",
    no: "Жоқ",
    moveUp: "Жоғары",
    moveDown: "Төмен",
    emptyList: "Әзірге бос",
    untitled: "Атаусыз",
    missingTranslation: "Аударма жоқ - сайтта басқа тілдегі мәтін көрсетіледі",
    upload: "Фото жүктеу",
    replace: "Ауыстыру",
    removePhoto: "Фотоны алып тастау",
    uploading: "Жүктелуде…",
    uploaded: "Фото жүктелді. Сайтқа шығару үшін «Сақтау» басыңыз",
    noPhoto: "Фото жоқ",
    unsupportedFormat: "Формат қолдау көрсетілмейді - JPG, PNG немесе WebP таңдаңыз",
    conflictTitle: "Деректер басқа жерде өзгертілді",
    conflictText:
      "Сіз редакторды ашқаннан кейін біреу сайтты сақтап үлгерді. Беттің жаңартылуы сіздің өзгерістеріңізді жояды, ал қайта жазу - олардың өзгерістерін.",
    conflictReload: "Бетті жаңарту",
    conflictOverwrite: "Менікімен қайта жазу",
    sessionExpired: "Сессия аяқталды - қайта кіріңіз. Өзгерістер сақталып қалады",
    draftRestoreTitle: "Сақталмаған өзгерістер табылды",
    draftRestoreText: "Сессия аяқталғанға дейін енгізілген өзгерістерді қалпына келтіру керек пе?",
    draftRestore: "Қалпына келтіру",
    draftDiscard: "Қажет емес",
    leaveWarning: "Сақталмаған өзгерістер жоғалады",
    keepAliveNever: "Дерекқорды автоматты пингтеу әлі бір рет те іске қосылмаған",
    keepAliveStale: (d) => `Дерекқорды автоматты пингтеу ${d} күннен бері жұмыс істемейді`,
    keepAliveHint:
      "Тегін Supabase 7 күн белсенділік болмаса, дерекқорды тоқтатады. Vercel Cron (/api/keep-alive) және GitHub Actions «Supabase keep-alive» жұмысын тексеріңіз.",
    dashboardTitle: "Картадағы бөлімшелер",
    mapHint: "Аудандарын көру үшін облысты басыңыз. Жарияланған лендингтер алтын түспен белгіленген",
    templateDescription: "Барлық лендингтерге ортақ жазулар, мәтіндер мен фото",
    portalDescription: "Басты бет: тіл таңдау және Қазақстан картасы",
    edit: "Өңдеу",
    open: "Сайтта ашу",
    preview: "Алдын ала қарау",
    published: "Жарияланған",
    draft: "Жоба",
    publishedCount: (p, t) => `Жарияланған: ${p} / ${t}`,
    searchPlaceholder: "Облысты немесе ауданды іздеу",
    nothingFound: "Ештеңе табылмады",
    allRegions: "Барлық облыстар",
    regionLanding: "Облыс департаментінің лендингі",
    districtsTitle: "Аудандар мен қалалар",
    kinds: { template: "Ортақ үлгі", portal: "Портал", region: "Облыс", district: "Аудан" },
    statusLabel: "Сайтта жарияланған",
    publishedNow: "Лендинг жарияланды",
    unpublishedNow: "Лендинг сайттан жасырылды",
    draftHidden: "Жоба сайтқа келушілерге көрінбейді",
    previewBanner: "Сақталған нұсқаны алдын ала қарау. Жоба келушілерге көрінбейді",
    backToMap: "Картаға",
    siteFieldsHint:
      "Бос өрістер ортақ үлгіден алынады - оның мәтіні сұр түспен көрсетілген. Тек осы бөлімшеге қатысты мәліметтерді толтырыңыз",
    showAllFields: "Барлық өрістер",
    showAllFieldsHint: "Тек осы лендинг үшін жазулар мен ортақ мәтіндерді ауыстыру",
    inheritedList: (n) => `Ортақ үлгідегі тізім қолданылады (${n})`,
    copyFromTemplate: "Үлгіден көшіріп өзгерту",
    inheritedPhoto: "Үлгіден",
    templateWarning: "Ортақ үлгідегі өзгерістер барлық лендингтерге бірден қолданылады",
    loadFailed: "Supabase-тен деректерді жүктеу мүмкін болмады - бетті кейінірек жаңартыңыз",
    errors: {
      unauthorized: "Сессия аяқталды - қайта кіріңіз",
      not_configured: "Supabase қосылмаған",
      conflict: "Деректер басқа жерде өзгертілді",
      invalid_file: "Бұл файл сурет емес немесе форматы қолдау көрсетілмейді",
      file_too_large: "Файл тым үлкен (ең көбі 5 МБ)",
      not_found: "Мұндай құжат жоқ",
      server: "Сервер қатесі - кейінірек қайталаңыз",
    },
  },
  ru: {
    appTitle: "Редактор сайта",
    loginTitle: "Вход в редактор",
    loginSubtitle: "Сайты подразделений полиции",
    pinLabel: "PIN-код",
    loginButton: "Войти",
    wrongPin: "Неверный PIN-код",
    locked: (m) => `Слишком много попыток. Повторите через ${m} мин.`,
    adminNotConfigured: "Не задана переменная ADMIN_PIN - добавьте её в .env",
    supabaseNotConfigured:
      "Supabase не подключён: сохранение и загрузка фото не будут работать. Проверьте .env",
    notSeeded:
      "Этого документа ещё нет в базе - первое сохранение создаст его",
    save: "Сохранить",
    saved: "Сохранено - сайт обновлён",
    unsaved: "Есть несохранённые изменения",
    allSaved: "Все изменения сохранены",
    lastSaved: (time) => `Последнее сохранение: ${time}`,
    shortcutHint: "Ctrl/⌘ + S - сохранить",
    logout: "Выйти",
    viewSite: "Открыть сайт",
    interfaceLanguage: "Язык интерфейса",
    addItem: (label) => `Добавить: ${label}`,
    removeItem: "Удалить",
    removeConfirm: "Удалить этот элемент?",
    yes: "Да",
    no: "Нет",
    moveUp: "Выше",
    moveDown: "Ниже",
    emptyList: "Пока пусто",
    untitled: "Без названия",
    missingTranslation: "Нет перевода - на сайте будет показан текст на другом языке",
    upload: "Загрузить фото",
    replace: "Заменить",
    removePhoto: "Убрать фото",
    uploading: "Загрузка…",
    uploaded: "Фото загружено. Нажмите «Сохранить», чтобы оно появилось на сайте",
    noPhoto: "Нет фото",
    unsupportedFormat: "Формат не поддерживается - выберите JPG, PNG или WebP",
    conflictTitle: "Данные изменились в другом месте",
    conflictText:
      "После того как вы открыли редактор, кто-то уже сохранил сайт. Обновление страницы отменит ваши изменения, а перезапись - изменения другого человека.",
    conflictReload: "Обновить страницу",
    conflictOverwrite: "Перезаписать моими",
    sessionExpired: "Сессия истекла - войдите снова. Изменения сохранятся",
    draftRestoreTitle: "Найдены несохранённые изменения",
    draftRestoreText: "Восстановить изменения, сделанные до окончания сессии?",
    draftRestore: "Восстановить",
    draftDiscard: "Не нужно",
    leaveWarning: "Несохранённые изменения будут потеряны",
    keepAliveNever: "Автопинг базы данных ещё ни разу не срабатывал",
    keepAliveStale: (d) => `Автопинг базы данных не срабатывает уже ${d} дн.`,
    keepAliveHint:
      "Бесплатный Supabase останавливает базу после 7 дней без активности. Проверьте Vercel Cron (/api/keep-alive) и GitHub Actions «Supabase keep-alive».",
    dashboardTitle: "Подразделения на карте",
    mapHint: "Нажмите на область, чтобы увидеть её районы. Золотым отмечены опубликованные лендинги",
    templateDescription: "Общие для всех лендингов подписи, тексты и фото",
    portalDescription: "Главная страница: выбор языка и карта Казахстана",
    edit: "Редактировать",
    open: "Открыть на сайте",
    preview: "Предпросмотр",
    published: "Опубликован",
    draft: "Черновик",
    publishedCount: (p, t) => `Опубликовано: ${p} из ${t}`,
    searchPlaceholder: "Поиск области или района",
    nothingFound: "Ничего не найдено",
    allRegions: "Все регионы",
    regionLanding: "Лендинг департамента области",
    districtsTitle: "Районы и города",
    kinds: { template: "Общий шаблон", portal: "Портал", region: "Область", district: "Район" },
    statusLabel: "Опубликован на сайте",
    publishedNow: "Лендинг опубликован",
    unpublishedNow: "Лендинг скрыт с сайта",
    draftHidden: "Черновик не виден посетителям сайта",
    previewBanner: "Предпросмотр сохранённой версии. Черновик не виден посетителям",
    backToMap: "К карте",
    siteFieldsHint:
      "Пустые поля берутся из общего шаблона - его текст показан серым. Заполняйте только то, что относится к этому подразделению",
    showAllFields: "Все поля",
    showAllFieldsHint: "Заменить подписи и общие тексты только для этого лендинга",
    inheritedList: (n) => `Используется общий список из шаблона (${n})`,
    copyFromTemplate: "Скопировать из шаблона и изменить",
    inheritedPhoto: "Из шаблона",
    templateWarning: "Изменения общего шаблона сразу применяются ко всем лендингам",
    loadFailed: "Не удалось загрузить данные из Supabase - обновите страницу позже",
    errors: {
      unauthorized: "Сессия истекла - войдите снова",
      not_configured: "Supabase не подключён",
      conflict: "Данные изменились в другом месте",
      invalid_file: "Файл не является изображением или формат не поддерживается",
      file_too_large: "Файл слишком большой (максимум 5 МБ)",
      not_found: "Такого документа нет",
      server: "Ошибка сервера - попробуйте позже",
    },
  },
  en: {
    appTitle: "Site editor",
    loginTitle: "Sign in to the editor",
    loginSubtitle: "Police department websites",
    pinLabel: "PIN code",
    loginButton: "Sign in",
    wrongPin: "Wrong PIN code",
    locked: (m) => `Too many attempts. Try again in ${m} min.`,
    adminNotConfigured: "ADMIN_PIN is not set - add it to .env",
    supabaseNotConfigured:
      "Supabase is not connected: saving and photo uploads won't work. Check .env",
    notSeeded:
      "This document is not in the database yet - the first save will create it",
    save: "Save",
    saved: "Saved - the site is updated",
    unsaved: "You have unsaved changes",
    allSaved: "All changes are saved",
    lastSaved: (time) => `Last saved: ${time}`,
    shortcutHint: "Ctrl/⌘ + S to save",
    logout: "Sign out",
    viewSite: "Open site",
    interfaceLanguage: "Interface language",
    addItem: (label) => `Add: ${label}`,
    removeItem: "Delete",
    removeConfirm: "Delete this item?",
    yes: "Yes",
    no: "No",
    moveUp: "Move up",
    moveDown: "Move down",
    emptyList: "Empty for now",
    untitled: "Untitled",
    missingTranslation: "Missing translation - the site will show another language",
    upload: "Upload photo",
    replace: "Replace",
    removePhoto: "Remove photo",
    uploading: "Uploading…",
    uploaded: "Photo uploaded. Press “Save” to publish it",
    noPhoto: "No photo",
    unsupportedFormat: "Unsupported format - choose JPG, PNG or WebP",
    conflictTitle: "The data was changed elsewhere",
    conflictText:
      "Someone saved the site after you opened the editor. Reloading discards your changes; overwriting discards theirs.",
    conflictReload: "Reload page",
    conflictOverwrite: "Overwrite with mine",
    sessionExpired: "Session expired - sign in again. Your changes are kept",
    draftRestoreTitle: "Unsaved changes found",
    draftRestoreText: "Restore the changes made before the session expired?",
    draftRestore: "Restore",
    draftDiscard: "Discard",
    leaveWarning: "Unsaved changes will be lost",
    keepAliveNever: "The database keep-alive ping has never run yet",
    keepAliveStale: (d) => `The database keep-alive ping hasn't run for ${d} days`,
    keepAliveHint:
      "Free Supabase pauses the database after 7 days without activity. Check Vercel Cron (/api/keep-alive) and the “Supabase keep-alive” GitHub Action.",
    dashboardTitle: "Departments on the map",
    mapHint: "Click a region to see its districts. Published landings are highlighted in gold",
    templateDescription: "Labels, texts and photos shared by all landings",
    portalDescription: "Home page: language choice and the map of Kazakhstan",
    edit: "Edit",
    open: "Open on site",
    preview: "Preview",
    published: "Published",
    draft: "Draft",
    publishedCount: (p, t) => `Published: ${p} of ${t}`,
    searchPlaceholder: "Search a region or district",
    nothingFound: "Nothing found",
    allRegions: "All regions",
    regionLanding: "Regional department landing",
    districtsTitle: "Districts and cities",
    kinds: { template: "Shared template", portal: "Portal", region: "Region", district: "District" },
    statusLabel: "Published on the site",
    publishedNow: "The landing is published",
    unpublishedNow: "The landing is hidden from the site",
    draftHidden: "Drafts are not visible to site visitors",
    previewBanner: "Preview of the saved version. Drafts are not visible to visitors",
    backToMap: "Back to map",
    siteFieldsHint:
      "Empty fields come from the shared template - its text is shown in grey. Fill in only what belongs to this department",
    showAllFields: "All fields",
    showAllFieldsHint: "Override labels and shared texts for this landing only",
    inheritedList: (n) => `Using the shared list from the template (${n})`,
    copyFromTemplate: "Copy from template to edit",
    inheritedPhoto: "From template",
    templateWarning: "Changes to the shared template apply to all landings at once",
    loadFailed: "Could not load data from Supabase - reload the page later",
    errors: {
      unauthorized: "Session expired - sign in again",
      not_configured: "Supabase is not connected",
      conflict: "The data was changed elsewhere",
      invalid_file: "The file is not an image or its format is not supported",
      file_too_large: "The file is too large (5 MB max)",
      not_found: "No such document",
      server: "Server error - try again later",
    },
  },
};

export const ADMIN_LANG_COOKIE = "jp_admin_lang";
export const DRAFT_STORAGE_KEY = "jp-admin-draft";

import type { Locale } from "@/lib/i18n/config";
import type { AdminErrorCode } from "@/lib/admin/types";

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
  errors: Record<AdminErrorCode, string>;
};

export const adminStrings: Record<Locale, AdminStrings> = {
  kz: {
    appTitle: "Сайт редакторы",
    loginTitle: "Редакторға кіру",
    loginSubtitle: "Жылыой ауданы полиция басқармасының сайты",
    pinLabel: "PIN-код",
    loginButton: "Кіру",
    wrongPin: "PIN-код қате",
    locked: (m) => `Тым көп әрекет. ${m} минуттан кейін қайталаңыз`,
    adminNotConfigured: "ADMIN_PIN айнымалысы орнатылмаған - .env файлына қосыңыз",
    supabaseNotConfigured:
      "Supabase қосылмаған: сақтау және фото жүктеу жұмыс істемейді. .env файлын тексеріңіз",
    notSeeded:
      "Supabase-те әлі деректер жоқ - эталондық контент көрсетілді. Бірінші сақтау оны базаға жазады",
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
    errors: {
      unauthorized: "Сессия аяқталды - қайта кіріңіз",
      not_configured: "Supabase қосылмаған",
      conflict: "Деректер басқа жерде өзгертілді",
      invalid_file: "Бұл файл сурет емес немесе форматы қолдау көрсетілмейді",
      file_too_large: "Файл тым үлкен (ең көбі 5 МБ)",
      server: "Сервер қатесі - кейінірек қайталаңыз",
    },
  },
  ru: {
    appTitle: "Редактор сайта",
    loginTitle: "Вход в редактор",
    loginSubtitle: "Сайт Управления полиции Жылыойского района",
    pinLabel: "PIN-код",
    loginButton: "Войти",
    wrongPin: "Неверный PIN-код",
    locked: (m) => `Слишком много попыток. Повторите через ${m} мин.`,
    adminNotConfigured: "Не задана переменная ADMIN_PIN - добавьте её в .env",
    supabaseNotConfigured:
      "Supabase не подключён: сохранение и загрузка фото не будут работать. Проверьте .env",
    notSeeded:
      "В Supabase ещё нет данных - показан эталонный контент. Первое сохранение запишет его в базу",
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
    errors: {
      unauthorized: "Сессия истекла - войдите снова",
      not_configured: "Supabase не подключён",
      conflict: "Данные изменились в другом месте",
      invalid_file: "Файл не является изображением или формат не поддерживается",
      file_too_large: "Файл слишком большой (максимум 5 МБ)",
      server: "Ошибка сервера - попробуйте позже",
    },
  },
  en: {
    appTitle: "Site editor",
    loginTitle: "Sign in to the editor",
    loginSubtitle: "Zhylyoi District Police Department website",
    pinLabel: "PIN code",
    loginButton: "Sign in",
    wrongPin: "Wrong PIN code",
    locked: (m) => `Too many attempts. Try again in ${m} min.`,
    adminNotConfigured: "ADMIN_PIN is not set - add it to .env",
    supabaseNotConfigured:
      "Supabase is not connected: saving and photo uploads won't work. Check .env",
    notSeeded:
      "Supabase has no data yet - showing the default content. The first save will store it",
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
    errors: {
      unauthorized: "Session expired - sign in again",
      not_configured: "Supabase is not connected",
      conflict: "The data was changed elsewhere",
      invalid_file: "The file is not an image or its format is not supported",
      file_too_large: "The file is too large (5 MB max)",
      server: "Server error - try again later",
    },
  },
};

export const ADMIN_LANG_COOKIE = "jp_admin_lang";
export const DRAFT_STORAGE_KEY = "jp-admin-draft";

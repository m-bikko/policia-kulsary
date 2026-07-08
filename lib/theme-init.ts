/**
 * Инлайн-скрипт для <body>: включает тёмную тему до первой отрисовки,
 * если она сохранена в localStorage. Светлая тема - по умолчанию.
 */
export const themeInitScript = `try{if(localStorage.getItem("jylyoi-theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

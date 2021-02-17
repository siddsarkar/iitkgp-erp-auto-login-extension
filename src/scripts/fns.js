//! use current theme colors if exist to set theme.
function setTheme(colors) {
  if (!colors) {
    //default theme case: else lookfor media queries
    var preferDarkQuery = "(prefers-color-scheme: dark)";
    var mql = window.matchMedia(preferDarkQuery);
    var supportsColorSchemeQuery = mql.media === preferDarkQuery;
    if (supportsColorSchemeQuery && mql.matches) {
      // prefers dark


    } else {
      // prefers light

    }
  } else {
    //custom theme case: use theme colors
    
}

// Toggle dark state of stored settings
function toggleDark(isdark) {

  // get current theme and set it's inverse to storage
  browser.storage.local.set({
    authCredentials: {
      ...isdark,
      dark: !isdark.dark
    },
  });
  // update the theme
  // theme(!isdark.dark);
}

// const gettingThemeColors = browser.theme.getCurrent();
// gettingThemeColors.then((theme) => {
//   if (theme && theme.colors) {
//     const colors = [
//       `--color-bg: ${theme.colors.frame}`,
//       `--color-card-bg: ${theme.colors.popup}`,
//       `--color-text-primary: ${theme.colors.popup_text}`,
//       `--color-text-secondary: ${theme.colors.toolbar_field_separator}`,
//       `--color-input-bg: ${theme.colors.toolbar_field}`,
//       `--color-input-border: ${theme.colors.toolbar_field_border}`,
//       `--primary-icon: ${theme.colors.icons}`,
//       `--secondary-icon: ${theme.colors.icons}`,
//     ];
//     document.body.setAttribute("style", colors.join(";"));
//   }
// }, onError);

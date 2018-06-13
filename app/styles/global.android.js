export default {
  primaryColor: "#5A6F82", // Navigation bar, bottom tabbar
  secondaryColor: "#1DADDA", // Buttons, active stuff
  primaryBackgroundColor: "#EEEEEE", // App backgroound
  secondaryBackgroundColor: "#FFFFFF", // Cards background
  primaryTextColor: "#000000",
  secondaryTextColor: "#95989A",
  invertedTextColor: "#FFFFFF", // Texts in navbar/tabbar etc
  lineColor: "#CCCCCC", // Textfield underline, cards separator

  orange: "#F8A356",
  green: "#52CC91",
  red: "#BA003F",

  biggestTextSize: 20,
  biggerTextSize: 16,
  normalTextSize: 14,
  smallerTextSize: 13,
  smallestTextSize: 12,

  space: 8,
  iconSize: 24,
  disabled: 0.3,

  /* New jobs label */
  newJobsLabelBackgroundColor: "#58B2D3",
  newJobsLabelTextColor: "#FFFFFF",

  /* Text field */
  textFieldFontColor: "#FFFFFF",
  textFieldBorderWidth: 2,
  textFieldBorderColor: "rgba(255,255,255,0.7)",
  textFieldFocusedColor: "#282B2E",
  textFieldErrorColor: "#E66B61",

  /* Navigation bar */
  navigationBarBackgroundColor: "#5A6F82",
  navigationBarTextColor: "#FFFFFF",
  navigationBarActionColor: "#FFFFFF",

  /* Tabbar */
  tabBarBackgroundColor: "#5A6F82",
  tabBarItemColor: "rgba(255,255,255,0.5)",
  tabBarActiveItemColor: "#FFFFFF",

  /* Route card */
  routeCardBackgroundColor: "#FFFFFF",
  routeCardFieldsBackgroundColor: "#F4F4F4",
  routeCardIconColor: "#000000",

  /* Checkbox */
  checkboxColor: "#1DADDA",

  /* Offline label */
  offlineBackgroundColor: "rgba(153, 153, 153, 0.85)",
  offlineFontColor: "#FFFFFF",

  convertHex: (hex, opacity) => {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
  }
};

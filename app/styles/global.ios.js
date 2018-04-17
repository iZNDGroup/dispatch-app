export default {
  primaryColor: "#F5F5F5", // Navigation bar, bottom tabbar
  secondaryColor: "#1DADDA", // Buttons, active stuff
  primaryBackgroundColor: "#FFFFFF", // App backgroound
  secondaryBackgroundColor: "#FFFFFF", // Cards background
  primaryTextColor: "#000000",
  secondaryTextColor: "#95989A",
  invertedTextColor: "#000000", // Texts in navbar/tabbar etc
  lineColor: "#DDDDDD", // Textfield underline, cards separator

  orange: "#F8A356",
  green: "#52CC91",

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
  textFieldBorderWidth: 1,
  textFieldBorderColor: "#FFFFFF",
  textFieldFocusedColor: null,
  textFieldErrorColor: "#E66b61",

  /* Navigation bar */
  navigationBarBackgroundColor: "#F5F5F5",
  navigationBarTextColor: "#000000",
  navigationBarActionColor: "#1DADDA",

  /* Tabbar */
  tabBarBackgroundColor: "#F5F5F5",
  tabBarItemColor: "rgba(0,0,0,0.5)",
  tabBarActiveItemColor: "#1DADDA",

  /* Route card */
  routeCardBackgroundColor: "#F5F5F5",
  routeCardFieldsBackgroundColor: "#F5F5F5",
  routeCardIconColor: "#1DADDA",

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

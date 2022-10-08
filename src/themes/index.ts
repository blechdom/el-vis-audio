export default interface Theme {
  name: string;
  colors: {
    mainBg: Color;
    mainText: Color;
    secondaryText: Color;
    inactiveBg: Color;
    inactiveText: Color;
    activeBg: Color;
    activeText: Color;
    placeholder: Color;
    border: Color;
    underline: Color;
    separator: Color;
    shadow: Color;
    barBg: Color;
    barDarkBg: Color;
    barInfo: Color;
    barText: Color;
    inputBg: Color;
    inputHover: Color;
    inputText: Color;
    inputIcon: Color;
    disabledBg: Color;
    disabledText: Color;
    menuBg: Color;
    menuSeparator: Color;
    menuText: Color;
    menuTextHover: Color;
    menuTitle: Color;
    menuHover: Color;
    menuInactive: Color;
    menuSubBg: Color;
    link: Color;
    outline: Color;
    selectionBg: Color;
    selectionText: Color;
    fileText: Color;
    fileHover: Color;
    scrollbarThumb: Color;
    scrollbarLightThumb: Color;
    default: Color;
    defaultHover: Color;
    defaultSecondary: Color;
    defaultBlend: Color;
    success: Color;
    successHover: Color;
    successSecondary: Color;
    warning: Color;
    warningHover: Color;
    warningSecondary: Color;
    error: Color;
    errorHover: Color;
    errorSecondary: Color;
    info: Color;
    infoHover: Color;
    infoSecondary: Color;
    hint: Color;
    badgeBg: Color;
    badgeText: Color;
    progressBarBg: Color;
  };
}

type Color = `#${string}`;

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}

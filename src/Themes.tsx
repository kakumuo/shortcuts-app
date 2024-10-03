import Color from 'colorjs.io'

export enum FontFamily {
    Arial = "Arial",
    TimesNewRoman = "Times New Roman",
    Helvetica = "Helvetica",
    Verdana = "Verdana",
    Calibri = "Calibri",
    Georgia = "Georgia",
    Garamond = "Garamond",
    CourierNew = "Courier New",
    Palatino = "Palatino",
    BookAntiqua = "Book Antiqua", 
    Roboto = "Roboto",
    Courier = "Courier",
    Tahoma = "Tahoma",
    Consolas = "Consolas",
}

export enum ColorScheme {
    Monokai = "Monokai",
    Solarized = 'Solarized',
    NordTheme = 'NordTheme',
    Dracula = 'Dracula',
    GruvboxDark = 'GruvboxDark',
    OneDark = 'OneDark',
    TokyoNight = 'TokyoNight',
}
  

export interface ColorSchemeData {
    primary:Color, 
    secondary:Color, 
    fontPrimary:Color,
    fontSecondary:Color,
    accent:Color,
    nameFont:FontFamily
}


export const colorSchemes: { [key in ColorScheme]: ColorSchemeData } = {
    [ColorScheme.Monokai]: {
        primary: new Color('#272822'),
        secondary: new Color('#3E3D32'),
        fontPrimary: new Color('#F8F8F2'),
        fontSecondary: new Color('#A6E22E'),
        accent: new Color('#66D9EF'),
        nameFont: FontFamily.Consolas
    },
    [ColorScheme.Solarized]: {
        primary: new Color('#002b36'),
        secondary: new Color('#073642'),
        fontPrimary: new Color('#839496'),
        fontSecondary: new Color('#93a1a1'),
        accent: new Color('#2aa198'),
        nameFont: FontFamily.Helvetica
    },
    [ColorScheme.NordTheme]: {
        primary: new Color('#2E3440'),
        secondary: new Color('#3B4252'),
        fontPrimary: new Color('#D8DEE9'),
        fontSecondary: new Color('#E5E9F0'),
        accent: new Color('#88C0D0'),
        nameFont: FontFamily.Roboto
    },
    [ColorScheme.Dracula]: {
        primary: new Color('#282a36'),
        secondary: new Color('#44475a'),
        fontPrimary: new Color('#f8f8f2'),
        fontSecondary: new Color('#6272a4'),
        accent: new Color('#bd93f9'),
        nameFont: FontFamily.Courier
    },
    [ColorScheme.GruvboxDark]: {
        primary: new Color('#282828'),
        secondary: new Color('#3c3836'),
        fontPrimary: new Color('#ebdbb2'),
        fontSecondary: new Color('#a89984'),
        accent: new Color('#b8bb26'),
        nameFont: FontFamily.Georgia
    },
    [ColorScheme.OneDark]: {
        primary: new Color('#282c34'),
        secondary: new Color('#3e4451'),
        fontPrimary: new Color('#abb2bf'),
        fontSecondary: new Color('#5c6370'),
        accent: new Color('#61afef'),
        nameFont: FontFamily.Verdana
    },
    [ColorScheme.TokyoNight]: {
        primary: new Color('#1a1b26'),
        secondary: new Color('#24283b'),
        fontPrimary: new Color('#a9b1d6'),
        fontSecondary: new Color('#565f89'),
        accent: new Color('#7aa2f7'),
        nameFont: FontFamily.Tahoma
    }
}



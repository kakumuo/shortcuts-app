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
    Impact = 'Impact',
}

export enum ColorScheme {
    Forest = "Forest",
    Lagoon = 'Lagoon',
    Ocean = "Ocean",
    Sunset = "Sunset",
    Lavender = "Lavender",
    Mint = "Mint",
    Berry = "Berry",
    Autumn = "Autumn",
    Arctic = "Arctic",
    Tropical = "Tropical",
    Vintage = "Vintage",
    Neon = "Neon",
}
  

export interface ColorSchemeData {
    primary:Color, 
    secondary:Color, 
    font:Color,
    accent:Color,
    nameFont:FontFamily
}

// ffb2e6-d972ff-8447ff-8cffda-ffffe8
export const colorSchemes: { [key in ColorScheme]: ColorSchemeData } = {
    [ColorScheme.Forest]: {
        primary: new Color('#8B9474'),
        secondary: new Color('#6CAE75'),
        font: new Color('#C1CC99'),
        accent: new Color('#F5A65B'),
        nameFont: FontFamily.Consolas
    },
    [ColorScheme.Lagoon]: {
        primary: new Color('#ffb2e6'),
        secondary: new Color('#ba72ff'),
        font: new Color('#8447ff'),
        accent: new Color('#8cffda'),
        nameFont: FontFamily.Georgia
    },[ColorScheme.Ocean]: {
        primary: new Color('#1A5F7A'),
        secondary: new Color('#57C5B6'),
        font: new Color('#159895'),
        accent: new Color('#FFE194'),
        nameFont: FontFamily.Helvetica
    },
    
    [ColorScheme.Sunset]: {
        primary: new Color('#FF7B54'),
        secondary: new Color('#FFB26B'),
        font: new Color('#FFD56F'),
        accent: new Color('#939B62'),
        nameFont: FontFamily.Georgia
    },
    
    [ColorScheme.Lavender]: {
        primary: new Color('#8E7AB5'),
        secondary: new Color('#B784B7'),
        font: new Color('#E493B3'),
        accent: new Color('#F7CACA'),
        nameFont: FontFamily.Verdana
    },
    
    [ColorScheme.Mint]: {
        primary: new Color('#4CAF50'),
        secondary: new Color('#81C784'),
        font: new Color('#C8E6C9'),
        accent: new Color('#FFC107'),
        nameFont: FontFamily.Arial
    },
    
    [ColorScheme.Berry]: {
        primary: new Color('#9C27B0'),
        secondary: new Color('#E91E63'),
        font: new Color('#F48FB1'),
        accent: new Color('#FF9800'),
        nameFont: FontFamily.Courier
    },
    
    [ColorScheme.Autumn]: {
        primary: new Color('#D35400'),
        secondary: new Color('#E67E22'),
        font: new Color('#F39C12'),
        accent: new Color('#27AE60'),
        nameFont: FontFamily.TimesNewRoman
    },
    
    [ColorScheme.Arctic]: {
        primary: new Color('#34495E'),
        secondary: new Color('#5D6D7E'),
        font: new Color('#85929E'),
        accent: new Color('#3498DB'),
        nameFont: FontFamily.Calibri
    },
    
    [ColorScheme.Tropical]: {
        primary: new Color('#16A085'),
        secondary: new Color('#1ABC9C'),
        font: new Color('#48C9B0'),
        accent: new Color('#F1C40F'),
        nameFont: FontFamily.Tahoma
    },
    
    [ColorScheme.Vintage]: {
        primary: new Color('#7E5109'),
        secondary: new Color('#B87333'),
        font: new Color('#D4AF37'),
        accent: new Color('#614051'),
        nameFont: FontFamily.Garamond
    },
    
    [ColorScheme.Neon]: {
        primary: new Color('#FF00FF'),
        secondary: new Color('#00FFFF'),
        font: new Color('#FFFF00'),
        accent: new Color('#FF1493'),
        nameFont: FontFamily.Impact
    }    
}



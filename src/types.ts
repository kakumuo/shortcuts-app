export interface IApplication {
    id:string,
    name:string
}

export interface IShortcutGroup{
    id:string,
    applicationId:string,
    name:string, 
}

export interface IShortcut {
    id:string,
    applicationId:string,
    shortcutGroupId:string,
    name:string, 
    keyCombination: string[], 
    ctrlMod: boolean, 
    shiftMod: boolean, 
    altMod: boolean
}

export interface ISession {
    id:string, 
    theme: string, 
    osType: 'windows'|'mac', 
    initialLogin: Date, 
    lastLogin: Date,
}
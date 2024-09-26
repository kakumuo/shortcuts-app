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
    keySequence: IShortcutKey[]
    altSequence: IShortcutKey[] //alternate sequence
}

export interface IShortcutKey {
    keys:string[], 
    ctrlMod: boolean, 
    shiftMod: boolean, 
    altMod: boolean,
    winMod:boolean
}

export interface ISession {
    id:string, 
    theme: string, 
    osType: 'windows'|'mac', 
    initialLogin: Date, 
    lastLogin: Date,
}


/*
ctrl + a
ctrl + a => z
ctrl + a || f1
*/
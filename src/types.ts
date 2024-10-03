
export interface ISession {
    id:string, 
    theme: string, 
    osType: 'windows'|'mac', 
    initialLogin: Date, 
    lastLogin: Date,
}

export interface IApplication {
    _id:string, 
    name:string, 
    fav:boolean,
    groups: IShortcutGroup[]
}

export interface IShortcutGroup{
    name:string, 
    shortcuts: IShortcut[]
}

export interface IShortcut {
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




/*
ctrl + a
ctrl + a => z
ctrl + a || f1
*/
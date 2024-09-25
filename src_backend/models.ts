import {Schema, model} from "mongoose";
import {IApplication, IShortcut, IShortcutGroup, ISession} from '../src/types'

// APP DATA
const ShortcutSchema = new Schema<IShortcut>({
    shortcutGroupId: {type: String},
    applicationId: {type: String}, 
    name: {type: String}, 
    keyCombination: [String], 
    ctrlMod: {type: Boolean}, 
    shiftMod: {type: Boolean}, 
    altMod: {type: Boolean},
    winMod: {type: Boolean}
})

const ShortcutGroupSchema = new Schema<IShortcutGroup>({
    name: {type: String}, 
})

const ApplicationSchema = new Schema<IApplication>({
    name: {type: String}
})


// SESSION
const SessionSchema = new Schema<ISession>({
    osType: {type: String}, 
    theme: {type: String}, 
    initialLogin: {type: Date},
    lastLogin: {type: Date},
})


const ApplicationModel = model('Application', ApplicationSchema)
const ShortcutGroupModel = model('ShortcutGroup', ShortcutGroupSchema)
const ShortcutModel = model('Shortcut', ShortcutSchema)
const SessionModel = model('Session', SessionSchema)

export {ApplicationModel, ShortcutGroupModel, ShortcutModel, SessionModel}
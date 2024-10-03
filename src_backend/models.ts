import {Schema, model} from "mongoose";
import {IApplication, ISession} from '../src/types'

// APP DATA
const ApplicationSchema = new Schema<IApplication>({
    name:String, 
    fav: {type: Boolean, default: false},
    groups: [{
        name: String, 
        shortcuts:[{
            name:String, 
            keySequence:[{
                keys:[String], 
                ctrlMod: Boolean, 
                shiftMod: Boolean, 
                altMod: Boolean,
                winMod:Boolean
            }], 
            altSequence:[{
                keys:[String], 
                ctrlMod: Boolean, 
                shiftMod: Boolean, 
                altMod: Boolean,
                winMod:Boolean
            }], 
        }]
    }]
})

// SESSION
const SessionSchema = new Schema<ISession>({
    osType: {type: String}, 
    theme: {type: String}, 
    initialLogin: {type: Date},
    lastLogin: {type: Date},
})

const ApplicationModel = model('Application', ApplicationSchema)
const SessionModel = model('Session', SessionSchema)

export {ApplicationModel, SessionModel}
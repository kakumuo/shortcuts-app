import express, { application } from 'express';
import cors from 'cors';
import config from './config.json';

import * as mongoose from 'mongoose';
import {ApplicationModel, ShortcutGroupModel, ShortcutModel, SessionModel} from './models';
import { IApplication, ISession, IShortcut, IShortcutGroup } from '../src/types';

const app = express();
app.use(express.json());
app.use(cors({origin: '*'}))

mongoose.connect(config.connString); 

/*
 * SESSION 
 */

// get session
app.get("/session", async(req, res) => {
    const {id} = req.query; 

    const sessionInfo = await SessionModel.findOne({_id: id});
    const message:string = sessionInfo ? `Retreived session '${id}'` : `Session '${id}' not found`;
    console.log(message)
    return res.json(formatMessage(0, message, sessionInfo));
})

// upsert session
app.post("/session", async(req, res) => {
    const {id} = req.query
    const {initialLogin, lastLogin, osType, theme}:ISession = req.body 

    const updateResp = await SessionModel.updateOne({_id: id}, 
        {
            initialLogin: initialLogin, 
            lastLogin: lastLogin, 
            osType: osType, 
            theme: theme
        }, {upsert: true}
    )

    return res.json(formatMessage(0, "Updated record"));
})

/*
 * APPLICATION 
 */

// get application
app.get("/application", async(req, res) => {
    const {id} = req.query; 

    let applicationInfo; 
    if(id && id != 'undefined') applicationInfo = await ApplicationModel.find({id: id});
    else applicationInfo = await ApplicationModel.find({});

    const message:string = applicationInfo ? `Retreived application '${id}'` : `Application '${id}' not found`;
    return res.json(formatMessage(0, message, applicationInfo));
})

// upsert application
app.post("/application", async(req, res) => {
    const {id, name}:IApplication = req.body

    const applicationObj = await ApplicationModel.updateOne({id: id}, 
        {
            name: name, 
        }, {upsert: true}
    )
    return res.json(formatMessage(0, "Updated record"));
})

// delete application
app.delete("/application", async(req, res) => {
    const {id} = req.query

    const resp = await ApplicationModel.deleteOne({id: id});
    if(resp){
        await ShortcutGroupModel.deleteMany({applicationId: id})
        await ShortcutModel.deleteMany({applicationId: id})
    }
    return res.json(formatMessage(0, resp.deletedCount > 0 ? "Deleted record" : `Record '${id} not found'`));
})


/*
 * SHORTCUT 
 */
// get shortcut
app.get("/shortcut", async(req, res) => {
    const {id, applicationId, shortcutGroupId} = req.query; 

    let targetQuery = {};
    
    if(id && id != 'undefined') targetQuery["_id"] = id; 
    if(applicationId && applicationId != 'undefined') targetQuery["applicationId"] = applicationId; 
    if(shortcutGroupId && shortcutGroupId != 'undefined') targetQuery["shortcutGroupId"] = shortcutGroupId; 

    const shortcutResp = await ShortcutModel.find(targetQuery)
    return res.json(formatMessage(0, "Retrieving records", shortcutResp));
})

// upsert shortcut
app.post("/shortcut", async(req, res) => {
    const {altMod, applicationId, ctrlMod, id, keyCombination, name, shiftMod, shortcutGroupId}:IShortcut = req.body; 

    if(!applicationId)
        return res.json(formatMessage(ERR_FIELD_NOT_FOUND, 'applicationId'))

    if(!shortcutGroupId)
        return res.json(formatMessage(ERR_FIELD_NOT_FOUND, 'shortcutGroupId'))

    const applicationObj = await ShortcutModel.updateOne({_id: id}, 
        {
            altMod: altMod,
            applicationId: applicationId,
            ctrlMod: ctrlMod,
            id: id,
            keyCombination: keyCombination,
            name: name,
            shiftMod: shiftMod,
            shortcutGroupId: shortcutGroupId            
        }, {upsert: true}
    )

    return res.json(formatMessage(0, "Updated shortcut"));
})

// delete shortcut
app.delete("/shortcut", async(req, res) => {
    const {id} = req.query

    const resp = await ApplicationModel.deleteOne({_id: id});
    return res.json(formatMessage(0, resp.deletedCount > 0 ? "Deleted record" : `Record '${id} not found'`));
})



/*
 * SHORTCUT GROUP 
 */
// get shortcut group
app.get("/shortcutGroup", async(req, res) => {
    const {id, applicationId} = req.query; 

    let targetQuery = {};
    
    if(id && id != 'undefined') targetQuery["_id"] = id; 
    if(applicationId  && applicationId != 'undefined') targetQuery["applicationId"] = applicationId; 

    console.log(targetQuery)

    const shortcutResp = await ShortcutGroupModel.find(targetQuery)
    return res.json(formatMessage(0, "Retrieving records", shortcutResp));
})

// upsert shortcut group
app.post("/shortcutGroup", async(req, res) => {
    const {id, name, applicationId}:IShortcutGroup = req.body; 

    if(!applicationId)
        return res.json(formatMessage(ERR_FIELD_NOT_FOUND, 'applicationId'))

    const shortcutGroupObj = await ShortcutGroupModel.updateOne({_id: id}, 
        {
            applicationId: applicationId,
            id: id,
            name: name          
        }, {upsert: true}
    )

    return res.json(formatMessage(0, "Updated shortcut"));
})

// delete shortcut group
app.delete("/shortcutGroup", async(req, res) => {
    const {id} = req.query

    const resp = await ShortcutGroupModel.deleteOne({_id: id});
    if(resp)
        await ShortcutModel.deleteMany({shortcutGroupId: id})

    return res.json(formatMessage(0, resp.deletedCount > 0 ? "Deleted record" : `Record '${id} not found'`));
})


app.listen(config.port, () => {
    console.log(`Server started on http://localhost:${config.port}`);
});


// **********************************
// UTILS
// **********************************
const ERR_FIELD_NOT_FOUND = 1; 

const formatMessage = (code:number, message:string, data?:any) => {
    let errorMessage:string;
    switch(code){
        case ERR_FIELD_NOT_FOUND: errorMessage = `Required field '${message}' not found.`; break;
        default: errorMessage = "Unhandled exception";
    }

    if(code == 0) return {code, message, data}
    else return {code, message: errorMessage}
}


import express from 'express';
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
    const {id, searchFilter} = req.query; 

    let targetQuery = {}
    if(id && id != 'undefined') targetQuery['id'] = id;
    if(searchFilter && searchFilter != 'undefined') targetQuery['name'] = {$regex: searchFilter, $options: "i"};

    const applicationInfo = await ApplicationModel.find(targetQuery);
    return res.json(formatMessage(0, "Retreived applciation", applicationInfo));
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
    const {id, applicationId, shortcutGroupId, searchFilter} = req.query; 

    let targetQuery = {};
    
    if(id && id != 'undefined') targetQuery["_id"] = id; 
    if(applicationId && applicationId != 'undefined') targetQuery["applicationId"] = applicationId; 
    if(shortcutGroupId && shortcutGroupId != 'undefined') targetQuery["shortcutGroupId"] = shortcutGroupId;

    if(!searchFilter || searchFilter == 'undefined'){
        const shortcutResp = await ShortcutModel.find(targetQuery)
        return res.json(formatMessage(0, "Retrieving records", shortcutResp));
    }else {
        /*
            select * from shortcuts s
            inner join shortcutgroups sg
            on s.shortcutId = sg.id
            where s.applicationId = <applicationId>
            and (
                sg.name like <searchFilter>
                or s.name like <searchFilter>
                or <searchFilter> in s.keyCombination
            )
        */

        const shortcutResp = await ShortcutModel.aggregate([
            {$lookup: {from: "shortcutgroups", localField: "shortcutGroupId", foreignField: "id", as: "group"}}, 
            {
                $match: {
                    $and: [
                        {applicationId: applicationId},
                        {$or: [
                            {name: {$regex: searchFilter, $options: "i"}},
                            {keyCombnation: {$regex: searchFilter, $options: "i"}},
                            {"group.name": {$regex: searchFilter, $options: "i"}}
                        ]}
                    ]
                }
            }, 
            {$project: {group: 0}}
        ])

        return res.json(formatMessage(0, "Retrieving records", shortcutResp));
    }

})

// upsert shortcut
app.post("/shortcut", async(req, res) => {
    const {applicationId, id, name, shortcutGroupId, altSequence, keySequence}:IShortcut = req.body; 

    if(!applicationId)
        return res.json(formatMessage(ERR_FIELD_NOT_FOUND, 'applicationId'))

    if(!shortcutGroupId)
        return res.json(formatMessage(ERR_FIELD_NOT_FOUND, 'shortcutGroupId'))

    console.log(id)

    const applicationObj = await ShortcutModel.updateOne({id: id}, 
        {
            applicationId: applicationId,
            id: id,
            name: name,
            shortcutGroupId: shortcutGroupId, 
            altSequence: altSequence, 
            keySequence: keySequence            
        }, {upsert: true}
    )

    return res.json(formatMessage(0, "Updated shortcut"));
})

// delete shortcut
app.delete("/shortcut", async(req, res) => {
    const {id} = req.query

    const resp = await ApplicationModel.deleteOne({id: id});
    return res.json(formatMessage(0, resp.deletedCount > 0 ? "Deleted record" : `Record '${id} not found'`));
})



/*
 * SHORTCUT GROUP 
 */
// get shortcut group
app.get("/shortcutGroup", async(req, res) => {
    const {id, applicationId, searchFilter} = req.query; 

    let targetQuery = {};
    
    if(id && id != 'undefined') targetQuery["_id"] = id; 
    if(applicationId  && applicationId != 'undefined') targetQuery["applicationId"] = applicationId; 
    if(searchFilter && searchFilter != 'undefined') targetQuery['name'] = {$regex: searchFilter, $options:  "i"}

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


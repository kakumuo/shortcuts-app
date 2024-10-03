import express from 'express';
import cors from 'cors';
import config from './config.json';

import * as mongoose from 'mongoose';
import {ApplicationModel, SessionModel} from './models';
import { IApplication, ISession } from '../src/types';

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
    if(id && id != 'undefined') targetQuery['_id'] = id;
    if(searchFilter && searchFilter != 'undefined') targetQuery['name'] = {$regex: searchFilter, $options: "i"};

    const applicationInfo = await ApplicationModel.find(targetQuery);
    return res.json(formatMessage(0, "Retreived applciation", applicationInfo));
})

// upsert application
app.post("/application", async(req, res) => {
    const body:IApplication = req.body

    if(body._id == ''){
        const applicationObj = await ApplicationModel.create({
            fav: body.fav, 
            groups: body.groups, 
            name: body.name
        })

        return res.json(formatMessage(0, "Created record", applicationObj));
    }else {
        const applicationObj = await ApplicationModel.updateOne({_id: body._id}, body, {upsert: true})
        return res.json(formatMessage(0, "Updated record", applicationObj));
    }
})

// delete application
app.delete("/application", async(req, res) => {
    const {id} = req.query

    const resp = await ApplicationModel.deleteOne({_id: id});
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


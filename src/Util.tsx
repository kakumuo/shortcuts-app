import Color from "colorjs.io";
import { ColorScheme, ColorSchemeData, colorSchemes } from "./Themes";
import { IApplication, IShortcutKey } from "./types";

const BASE_URI = "http://localhost:8001"

export interface APIResponse<T> {
    code:number, 
    message:string, 
    data?:T[]
}


// application
export const getApplication = async (params: {id?:string, searchFilter?:string}):Promise<APIResponse<IApplication>> => {

    const resp = await fetch(`${BASE_URI}/application?` + new URLSearchParams(params), {
        headers: {'Content-Type': 'application/json'}
    })

    const jsonResp = await resp.json(); 
    return jsonResp;
}

export const upsertApplication = async (body:IApplication):Promise<APIResponse<IApplication>> => {
    const resp = await fetch(`${BASE_URI}/application`, {
        body: JSON.stringify(body), 
        method: 'post', 
        headers: {
            "Content-Type": "application/json"
        }
    })

    const jsonResp = await resp.json(); 
    return jsonResp;
}

export const deleteApplication = async (id:string):Promise<APIResponse<IApplication>> => {
    const resp = await fetch(`${BASE_URI}/application?id=${id}`, {
        method: 'delete', 
    })

    const jsonResp = await resp.json(); 
    console.log(jsonResp)
    return jsonResp;
}



/*
General
*/

export const shortcutKeyToString = (record:IShortcutKey):string => {
    let keyList:string[] = []
    if(record.winMod) keyList.push("Win")
    if(record.ctrlMod) keyList.push("Ctrl")
    if(record.altMod) keyList.push("Alt")
    if(record.shiftMod) keyList.push("Shift")
    keyList = [...keyList, ...record.keys]
    return keyList.join(" + ")
}

export const generateUUID = () => {
    const timestamp = new Date().getTime();
    const hexTimestamp = timestamp.toString(16);
    
    const randomPart = Math.random().toString(16).substr(2, 8);
    
    const uuid = (hexTimestamp + randomPart).substr(0, 16).padEnd(16, '0');
    
    return uuid;
}

export const getColor = (props:{scheme:ColorScheme, colorField:keyof ColorSchemeData, scale?:number, isDark:boolean}):string => {
    if(props.isDark){
        return colorSchemes[props.scheme][props.colorField].toString()
    }else {
        const tmp = new Color(colorSchemes[props.scheme][props.colorField].toString())
        tmp.lighten(2)
        return tmp.toString()
    }
}
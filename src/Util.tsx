import Color from "colorjs.io";
import { ColorScheme, ColorSchemeData, colorSchemes } from "./Themes";
import { IApplication, IShortcutKey } from "./types";
import SpaceAccessors from "colorjs.io/types/src/space-coord-accessors";

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

export const getColor = (props:{scheme:ColorScheme, colorField:keyof ColorSchemeData, scale?:number}):string => {
    const tmp = new Color(colorSchemes[props.scheme][props.colorField].toString())
    if(props.scale) {
        tmp.r *= props.scale;
        tmp.g *= props.scale;
        tmp.b *= props.scale;
    }
    // if(props.scale && props.scale > 0){
        
    // }else if(props.scale && props.scale < 0) {
    //     tmp.darken(Math.abs(props.scale))
    // } 
    return tmp.toString()
}
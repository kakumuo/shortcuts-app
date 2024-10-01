import { IApplication, IShortcut, IShortcutGroup, IShortcutKey } from "./types";

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
    return jsonResp;
}



// shortcut groups
export const getShortcutGroups = async (params: {applicationId?:string, id?:string, searchFilter?:string}):Promise<APIResponse<IShortcutGroup>> => {
    const resp = await fetch(`${BASE_URI}/shortcutGroup?` + new URLSearchParams(params), {
        headers: {'Content-Type': 'application/json'}
    })

    const jsonResp = await resp.json(); 
    return jsonResp;
}

export const upsertShortcutGroups = async (groups:IShortcutGroup[]) => {
    for(let group of groups){
        const resp = await fetch(`${BASE_URI}/shortcutGroup`, {
            body: JSON.stringify(group), 
            method: 'post', 
            headers: {
                "Content-Type": "application/json"
            }
        })
    
        const jsonResp = await resp.json(); 
    }
}

// shortcuts
export const getShortcuts = async (params:{applicationId?:string, shortcutGroupId?:string, id?:string, searchFilter?:string}):Promise<APIResponse<IShortcut>> => {
    const resp = await fetch(`${BASE_URI}/shortcut?` + new URLSearchParams(params), {
        headers: {'Content-Type': 'application/json'}
    })

    const jsonResp = await resp.json(); 
    return jsonResp;
}


export const upsertShortcuts = async (shortcuts:IShortcut[]) => {
    for(let shortcut of shortcuts){
        const resp = await fetch(`${BASE_URI}/shortcut`, {
            body: JSON.stringify(shortcut), 
            method: 'post', 
            headers: {
                "Content-Type": "application/json"
            }
        })
    
        const jsonResp = await resp.json(); 
    }
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
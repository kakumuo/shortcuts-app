import { IApplication, IShortcut, IShortcutGroup } from "./types";

const BASE_URI = "http://localhost:8001"

export interface APIResponse<T> {
    code:number, 
    message:string, 
    data?:T[]
}


// application
export const getApplication = async (id?:string):Promise<APIResponse<IApplication>> => {

    const resp = await fetch(`${BASE_URI}/application${id ? `?id=${id}` : ""}`, {
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
export const getShortcutGroups = async (applicationId?:string, id?:string):Promise<APIResponse<IShortcutGroup>> => {
    const targetParams:Record<string, string> = {}
    if(applicationId)
        targetParams['applicationId'] = applicationId;

    if(id)
        targetParams['id'] = id;

    const resp = await fetch(`${BASE_URI}/shortcutGroup?` + new URLSearchParams(targetParams), {
        headers: {'Content-Type': 'application/json'}
    })

    const jsonResp = await resp.json(); 
    return jsonResp;
}

// shortcuts
export const getShortcuts = async (applicationId?:string, shortcutGroupId?:string, id?:string):Promise<APIResponse<IShortcut>> => {
    const targetParams:Record<string, string> = {}
    if(applicationId)
        targetParams['applicationId'] = applicationId;

    if(shortcutGroupId)
        targetParams['shortcutGroupId'] = shortcutGroupId;

    if(id)
        targetParams['id'] = id;

    const resp = await fetch(`${BASE_URI}/shortcut${id ? `?id=${id}` : ""}`, {
        headers: {'Content-Type': 'application/json'}
    })

    const jsonResp = await resp.json(); 
    return jsonResp;
}

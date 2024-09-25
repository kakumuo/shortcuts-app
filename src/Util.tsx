import { IApplication, IShortcut, IShortcutGroup } from "./types";

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

// shortcuts
export const getShortcuts = async (params:{applicationId?:string, shortcutGroupId?:string, id?:string, searchFilter?:string}):Promise<APIResponse<IShortcut>> => {
    const resp = await fetch(`${BASE_URI}/shortcut?` + new URLSearchParams(params), {
        headers: {'Content-Type': 'application/json'}
    })

    const jsonResp = await resp.json(); 
    return jsonResp;
}

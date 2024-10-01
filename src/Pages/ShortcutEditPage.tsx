import React from 'react'
import { useLocation, useParams } from 'react-router'
import { generateUUID, getApplication, getShortcutGroups, getShortcuts, shortcutKeyToString, upsertApplication, upsertShortcutGroups, upsertShortcuts } from '../Util';
import { IApplication, IShortcut, IShortcutGroup, IShortcutKey } from '../types';
import { Box, Button, Chip, ChipDelete, Divider, IconButton, Input, Tab, Table, TabList, TabPanel, Tabs, Textarea, Typography } from '@mui/joy';
import { AddCircleOutlineOutlined, AddOutlined, ArrowLeftOutlined, CloseOutlined, DeleteOutline, DeleteOutlined, Shortcut } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';


interface IShortcutEditData {
    application:{data:IApplication|undefined, setData:(target:IApplication)=>void},
    groups:{data:IShortcutGroup[], setData:(target:IShortcutGroup[])=>void},
    shortcuts:{data:IShortcut[], setData:(target:IShortcut[])=>void},
}
const ShortcutEditPageContext = React.createContext<IShortcutEditData>({} as IShortcutEditData)

export const ShortcutEditPage = () => {
    const location = useLocation(); 
    const {applicationId} = useParams(); 
    const appContext = React.useContext(AppContext)

    const [appData, setAppData] = React.useState<IApplication>(); 
    const [shortcutGroups, setShortcutGroups] = React.useState<IShortcutGroup[]>([]); 
    const [shortcuts, setShortcuts] = React.useState<IShortcut[]>([]);    

    React.useEffect(() => {
        ;(async() => {
            const targetApp = await getApplication({id: applicationId})
            if(targetApp.data)
                setAppData(targetApp.data[0])
    
            const targetShortcutGroups = await getShortcutGroups({applicationId: applicationId})
            if(targetShortcutGroups.data)
                setShortcutGroups(targetShortcutGroups.data)
    
            const targetShortcuts = await getShortcuts({applicationId: applicationId})
            if(targetShortcuts.data)
                setShortcuts(targetShortcuts.data); 
        })(); 
    }, [applicationId])

    const handleSaveData = () => {
        appContext.handleFireAlert("Saving Data...", 'primary')
        
        ;(async () => {
            if(appData)
                await upsertApplication(appData); 
            await upsertShortcutGroups(shortcutGroups); 
            await upsertShortcuts(shortcuts); 

            appContext.dataLastUpdated = new Date(); 

            appContext.handleFireAlert("Update successful...", 'success')
        })(); 
        
    }
    
    const handleApplicationRename = (newName:string) => {
        const tmp = Object.assign({}, appData)
        tmp.name = newName
        setAppData(tmp); 
    }

    return <ShortcutEditPageContext.Provider value={{
        application: {data: appData, setData: setAppData}, 
        groups: {data: shortcutGroups, setData: setShortcutGroups}, 
        shortcuts: {data: shortcuts, setData: setShortcuts}
    }}>
        <Box display={'grid'} gridTemplateRows={'auto 1fr auto'} overflow={'hidden'} gap={2}>
            
            {/* header */}
            <Box display={'grid'} gridTemplateColumns={'auto 1fr'} gap={2}>
                <IconButton><Link to={location.pathname.substring(0,location.pathname.lastIndexOf('/'))}><ArrowLeftOutlined /></Link></IconButton>
                {appData && <Input onBlur={(ev) => handleApplicationRename(ev.currentTarget.value)} defaultValue={appData.name} />}
            </Box>

            {/* main content */}
            <ValueEditPanel/>

            {/* Footer */}
            <Box display={'flex'} justifyContent={'end'} gap={2}>
                <Button variant='soft' onClick={handleSaveData}>Save</Button>
                <Button variant='soft'>Apply</Button>
                <Button variant='soft' color='danger'>Cancel</Button>
            </Box>
        </Box>
    </ShortcutEditPageContext.Provider>
}


/*
VALUE EDIT PANEL
*/
const ValueEditPanel = () => {
    const shortcutEditData:IShortcutEditData = React.useContext(ShortcutEditPageContext)
    const groups = shortcutEditData.groups.data
    const shortcuts = shortcutEditData.shortcuts.data

    const handleGroupAdd = () => {
        if(!shortcutEditData.application.data) return;

        const tmp = [...groups, {
            applicationId: shortcutEditData.application.data.id, 
            id: generateUUID(), 
            name: ""
        } as IShortcutGroup]

        shortcutEditData.groups.setData(tmp)
    }

    return <Box display={'grid'} gridTemplateRows={'1fr auto'} overflow={'auto'} gap={2}>
        <Box display={'grid'} gap={5} overflow={'auto'} height={'100%'} padding={2}>
            {groups.map(curGroup => {
                return <ValueEditSection key={curGroup.id} shortcutGroup={curGroup} 
                    shortcuts={shortcuts.filter(curShortcut => curShortcut.shortcutGroupId == curGroup.id)} />
            })}
        </Box>
        <Button startDecorator={<AddCircleOutlineOutlined />} onClick={handleGroupAdd}>Add Group</Button>
    </Box>
}

const ValueEditSection = ({shortcutGroup, shortcuts}:{shortcutGroup:IShortcutGroup, shortcuts:IShortcut[]}) => {
    const shortcutEditData:IShortcutEditData = React.useContext(ShortcutEditPageContext)
    const [hoveredRowI, setHoveredRowI] = React.useState(-1)

    const handleKeyUpdate = (shortcutId:string, updatedSequence:IShortcutKey[], isAlternate:boolean) => {
        const data = [...shortcutEditData.shortcuts.data]
        const targetIndex = data.findIndex(shortcut => shortcut.id == shortcutId && shortcut.shortcutGroupId == shortcutGroup.id)
        if(targetIndex != -1)
            if(isAlternate) data[targetIndex].altSequence = updatedSequence
            else data[targetIndex].keySequence = updatedSequence
        shortcutEditData.shortcuts.setData(data)

        console.log(updatedSequence.map(item => shortcutKeyToString(item)).join(" => "))
    }

    const handleDeleteShortcut = (shortcutId:string) => {
        const data = [...shortcutEditData.shortcuts.data]
        shortcutEditData.shortcuts.setData(data.filter(shortcut => shortcutId != shortcut.id))
    }

    const handleAddShortcut = () => {
        if(!shortcutEditData.application.data) return

        const data = [...shortcutEditData.shortcuts.data]
        data.push({
            id: generateUUID(), 
            shortcutGroupId: shortcutGroup.id, 
            applicationId: shortcutEditData.application.data.id, 
            altSequence: [], 
            keySequence: [],
            name: ""
        } as IShortcut)

        shortcutEditData.shortcuts.setData(data)
    }

    const handleShortcutRename = (shortcutId:string, shortcutName:string) => {
        if(shortcutName.trim() == "") return;

        const data = [...shortcutEditData.shortcuts.data]
        const targetIndex = data.findIndex(shortcut => shortcut.id == shortcutId && shortcut.shortcutGroupId == shortcutGroup.id)
        if(targetIndex != -1 && data[targetIndex].name !== shortcutName ){
            data[targetIndex].name = shortcutName
            shortcutEditData.shortcuts.setData(data)
        }
    }

    const handleGroupDelete = () => {
        const groupData = [...shortcutEditData.groups.data.filter(group => group.id != shortcutGroup.id)]
        const shortcutData = [...shortcutEditData.shortcuts.data.filter(shortcut => shortcut.shortcutGroupId != shortcutGroup.id)]
        shortcutEditData.groups.setData(groupData)
        shortcutEditData.shortcuts.setData(shortcutData)
    }

    const handleGroupRename = (newName:string) => {
        const groupData = [...shortcutEditData.groups.data]; 
        const targetIndex = groupData.findIndex(group => group.id == shortcutGroup.id)
        if(targetIndex != -1)
            groupData[targetIndex].name = newName;
    
        shortcutEditData.groups.setData(groupData)
    }

    return <Box>
        <Divider sx={{gap:2, height: '1px', alignSelf :'center', '--Divider-childPosition': '5%', marginTop: 2, marginBottom: 2}}>
            <IconButton onClick={handleGroupDelete} color='danger'><DeleteOutlined/></IconButton>
            <Input onBlur={(ev) => handleGroupRename(ev.currentTarget.value)} defaultValue={shortcutGroup.name} fullWidth />
            <IconButton onClick={() => handleAddShortcut()} ><AddOutlined /></IconButton>
        </Divider>
        
        <Table sx={{width: "100%"}}>
            <thead>
                <tr style={{fontWeight: 'bold'}} >
                    <th style={{fontWeight: 'inherit'}}>Shortcut Name</th>
                    <th style={{fontWeight: 'inherit'}}>Primary Key Binding</th>
                    <th style={{fontWeight: 'inherit'}}>Alternate Key Binding</th>
                </tr>
            </thead>
            {shortcuts.map((shortcut, shortcutI) => {
                return <tr key={shortcut.id}
                    onMouseEnter={() => setHoveredRowI(shortcutI)}
                    onMouseLeave={() => setHoveredRowI(-1)}
                >
                    <td style={{display: 'flex'}}>
                        {hoveredRowI == shortcutI && <IconButton onClick={() => handleDeleteShortcut(shortcut.id)} color='danger'><DeleteOutline /></IconButton> }
                        <Input 
                            onBlur={(ev) => handleShortcutRename(shortcut.id, ev.currentTarget.value)} 
                            sx={{flex: '1 1 auto'}} defaultValue={shortcut.name}
                        />
                    </td>
                    <td><ValueEditInput shortcutKeys={shortcut.keySequence} onUpdateKeys={(updated) => handleKeyUpdate(shortcut.id, updated, false)} /></td>
                    <td><ValueEditInput shortcutKeys={shortcut.altSequence} onUpdateKeys={(updated) => handleKeyUpdate(shortcut.id, updated, true)}/></td>
                </tr>
            })}
        </Table>
    </Box>
}

const ValueEditInput = ({shortcutKeys, onUpdateKeys}:{shortcutKeys:IShortcutKey[], onUpdateKeys:(shortcutKeys:IShortcutKey[])=>void}) => {
    const [isHovered, setIsHovered] = React.useState(false)

    const handleUpdateKey = (updateIndex:number, updatedKey:IShortcutKey) => {
        const tmp = [...shortcutKeys]
        tmp[updateIndex] = updatedKey; 
        onUpdateKeys(tmp); 
    }

    const handleAddNewKey = () => {
        const addedKey = {
            altMod: false, 
            ctrlMod: false, 
            keys: [], 
            shiftMod: false, 
            winMod: false
        } as IShortcutKey
        onUpdateKeys([...shortcutKeys, addedKey]); 
    }

    const handleDeleteKey = (deleteIndex:number) => {
        const tmp = shortcutKeys.filter((_, i) => i!= deleteIndex); 
        onUpdateKeys(tmp); 
    }

    return <Box display={'flex'} width={'100%'} height={'100%'} gap={1} 
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    >
        {shortcutKeys.map((curKey, curKeyI) => 
            <ValueEditChip key={curKeyI} shortcutKey={curKey} 
                onUpdateKey={(updatedKey) => handleUpdateKey(curKeyI, updatedKey)} 
                onDeleteKey={() => handleDeleteKey(curKeyI)}
            />
        )}
        {isHovered && <IconButton sx={{marginLeft: 'auto'}}><AddOutlined onClick={handleAddNewKey} /></IconButton>}
    </Box>
}

const ValueEditChip = ({shortcutKey, onUpdateKey, onDeleteKey}:{shortcutKey:IShortcutKey, onUpdateKey:(shortcutKey:IShortcutKey)=>void, onDeleteKey:()=>void}) => {
    const [isHovered, setIsHovered] = React.useState(false); 
    const [isEditing, setIsEditing] = React.useState(false); 
    const [curKey, setCurKey] = React.useState(shortcutKey); 
    const ref = React.useRef<HTMLDivElement>(); 

    return <Box tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        display={'grid'} gridTemplateColumns={'1fr auto'} gridAutoRows={'100%'} alignItems={'center'}
        padding={1}
        bgcolor={isEditing ? 'lightgreen' : isHovered ? 'lightblue' : 'lightgray'} 
        borderRadius={'10px'}
        onKeyUp={(ev) => {
            ev.stopPropagation();
            ev.preventDefault();

            const tmpKey = Object.assign({}, curKey);
            switch(ev.key){
                case 'Alt': tmpKey.altMod = !tmpKey.altMod; break;
                case 'Control': tmpKey.ctrlMod = !tmpKey.ctrlMod; break;
                case 'Shift': tmpKey.shiftMod = !tmpKey.shiftMod; break;
                case 'Meta': tmpKey.winMod = !tmpKey.winMod; break;
                default: 
                    const target = ev.key.toUpperCase()
                    if(tmpKey.keys.includes(target)) tmpKey.keys = tmpKey.keys.filter(cur => cur != target)
                    else tmpKey.keys.push(target); 
            }

            setCurKey(tmpKey); 
        }}
        onFocus={() => setIsEditing(true)}
        onBlur={() => {
            setIsEditing(false)
            if(curKey.altMod == curKey.ctrlMod == curKey.shiftMod == curKey.winMod == false && curKey.keys.length == 0)
                onDeleteKey()
            else 
                onUpdateKey(shortcutKey)
        }}
        color={isEditing ? 'success' : isHovered ? 'primary' : 'neutral'}
    >
        <Typography level='body-lg'>{shortcutKeyToString(curKey)}</Typography> 
        <IconButton onClick={onDeleteKey}><CloseOutlined /></IconButton>
    </Box>
}
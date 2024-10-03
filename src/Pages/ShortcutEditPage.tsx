import React from 'react'
import { useLocation, useParams } from 'react-router'
import { getApplication, shortcutKeyToString, upsertApplication } from '../Util';
import { IApplication, IShortcut, IShortcutKey } from '../types';
import { Box, Button, Chip, ChipDelete, Divider, IconButton, Input, Table } from '@mui/joy';
import { AddCircleOutlineOutlined, AddOutlined, ArrowLeftOutlined, DeleteOutline, DeleteOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';


interface IShortcutEditData {
    appData:IApplication|undefined, 
    setAppData:(target:IApplication)=>void
}

const ShortcutEditPageContext = React.createContext<IShortcutEditData>({} as IShortcutEditData)

export const ShortcutEditPage = () => {
    const location = useLocation(); 
    const {applicationId} = useParams(); 
    const appContext = React.useContext(AppContext)
    const prevPath = location.pathname.substring(0,location.pathname.lastIndexOf('/'))

    const [appData, setAppData] = React.useState<IApplication>(); 

    React.useEffect(() => {
        ;(async() => {
            const targetApp = await getApplication({id: applicationId})
            console.log(targetApp.data)
            if(targetApp.data)
                setAppData(targetApp.data[0])
        })(); 
    }, [applicationId])

    const handleSaveData = () => {
        appContext.handleFireAlert("Saving Data...", 'primary')
        
        ;(async () => {
            if(appData) await upsertApplication(appData); 
            appContext.setLastUpdated(new Date())

            appContext.handleFireAlert("Update successful...", 'success')
        })(); 
    }
    
    const handleApplicationRename = (newName:string) => {
        const tmp = Object.assign({}, appData)
        tmp.name = newName
        setAppData(tmp); 
    }

    return <ShortcutEditPageContext.Provider value={{appData, setAppData}}>
        <Box display={'grid'} gridTemplateRows={'auto 1fr auto'} overflow={'hidden'} gap={2} bgcolor={'background.level2'} >
            
            {/* header */}
            <Box display={'grid'} gridTemplateColumns={'auto 1fr'} gap={2}>
                <IconButton><Link to={prevPath}><ArrowLeftOutlined /></Link></IconButton>
                {appData && <Input onBlur={(ev) => handleApplicationRename(ev.currentTarget.value)} defaultValue={appData.name} />}
            </Box>

            {/* main content */}
            <ValueEditPanel/>

            {/* Footer */}
            <Box display={'flex'} justifyContent={'end'} gap={2}>
                <Button variant='solid' onClick={handleSaveData}>Save</Button>
                <Button variant='solid' onClick={() => {
                    handleSaveData()
                    setTimeout(() => {
                        document.location.href = prevPath
                    }, .5 * 1000)
                }}>Apply</Button>
                <Button variant='solid' color='danger'><Link style={{textDecorationLine: 'none'}} to={prevPath}>Cancel</Link></Button>
            </Box>
        </Box>
    </ShortcutEditPageContext.Provider>
}


/*
VALUE EDIT PANEL
*/
const ValueEditPanel = () => {
    const shortcutEditData:IShortcutEditData = React.useContext(ShortcutEditPageContext)
    const groups = shortcutEditData.appData?.groups

    const handleGroupAdd = () => {
        if(!shortcutEditData.appData) return;
        const tmpData = Object.assign({}, shortcutEditData.appData)
        
        tmpData.groups.push({name: '', shortcuts: []})
        shortcutEditData.setAppData(tmpData)
    }

    return <Box display={'grid'} gridTemplateRows={'1fr auto'} overflow={'auto'} gap={2}>
        <Box display={'flex'} flexDirection={'column'} gap={4} overflow={'auto'} padding={2}>
            {groups && groups.map((curGroup, curGroupI) => {
                return <GroupEditSection key={curGroup.name + curGroupI} shortcutGroupI={curGroupI} shortcuts={curGroup.shortcuts} />
            })}
        </Box>
        <Button startDecorator={<AddCircleOutlineOutlined />} onClick={handleGroupAdd}>Add Group</Button>
    </Box>
}

const GroupEditSection = ({shortcutGroupI, shortcuts}:{shortcutGroupI:number, shortcuts:IShortcut[]}) => {
    const shortcutEditData:IShortcutEditData = React.useContext(ShortcutEditPageContext)
    const [hoveredRowI, setHoveredRowI] = React.useState(-1)
    const [group, setGroup] = React.useState(shortcutEditData.appData?.groups[shortcutGroupI])

    const handleDeleteShortcut = (shortcutI:number) => {
        const tmpData = Object.assign({}, shortcutEditData.appData)
        tmpData.groups[shortcutGroupI].shortcuts = tmpData.groups[shortcutGroupI].shortcuts.filter((_, i) => i != shortcutI)
        shortcutEditData.setAppData(tmpData)
    }

    const handleAddShortcut = () => {
        if(!shortcutEditData.appData) return

        const tmpData = Object.assign({}, shortcutEditData.appData)
        tmpData.groups[shortcutGroupI].shortcuts.push({
            altSequence: [], 
            keySequence: [],
            name: ""
        } as IShortcut)

        shortcutEditData.setAppData(tmpData)
    }

    const handleShortcutRename = (shortcutI:number, newName:string) => {
        if(newName.trim() == "") return;

        const tmpData = Object.assign({}, shortcutEditData.appData)
        
        if(tmpData.groups[shortcutGroupI].shortcuts[shortcutI].name !== newName ){
            tmpData.groups[shortcutGroupI].shortcuts[shortcutI].name = newName
            shortcutEditData.setAppData(tmpData)
        }
    }

    const handleGroupDelete = () => {
        const tmpData = Object.assign({}, shortcutEditData.appData)

        tmpData.groups = tmpData.groups.filter((_, i) => i != shortcutGroupI)
        shortcutEditData.setAppData(tmpData)
    }

    const handleGroupRename = (newName:string) => {
        const tmpData = Object.assign({}, shortcutEditData.appData)

        tmpData.groups[shortcutGroupI].name = newName
        shortcutEditData.setAppData(tmpData)
    }

    return <Box>
        <Divider sx={{gap:2, height: '1px', alignSelf :'center', '--Divider-childPosition': '5%', marginTop: 2, marginBottom: 2}}>
            <IconButton onClick={handleGroupDelete} color='danger'><DeleteOutlined/></IconButton>
            <Input onBlur={(ev) => handleGroupRename(ev.currentTarget.value)} defaultValue={group?.name} fullWidth />
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
            <tbody>
                {shortcuts.map((shortcut, shortcutI) => {
                    return <tr key={shortcut.name + shortcutI}
                        onMouseEnter={() => setHoveredRowI(shortcutI)}
                        onMouseLeave={() => setHoveredRowI(-1)}
                    >
                        <td style={{display: 'flex'}}>
                            {hoveredRowI == shortcutI && <IconButton onClick={() => handleDeleteShortcut(shortcutI)} color='danger'><DeleteOutline /></IconButton> }
                            <Input 
                                onBlur={(ev) => handleShortcutRename(shortcutI, ev.currentTarget.value)} 
                                sx={{flex: '1 1 auto'}} defaultValue={shortcut.name}
                            />
                        </td>
                        <td><ShortcutEditInput shortcutKeys={shortcut.keySequence} groupI={shortcutGroupI} shortcutI={shortcutI} /></td>
                        <td><ShortcutEditInput shortcutKeys={shortcut.altSequence} groupI={shortcutGroupI} shortcutI={shortcutI} isAltSequence={true}/></td>
                    </tr>
                })}
            </tbody>
        </Table>
    </Box>
}

const ShortcutEditInput = ({shortcutKeys, groupI, shortcutI, isAltSequence=false}:{shortcutKeys:IShortcutKey[], groupI:number, shortcutI:number, isAltSequence?:boolean}) => {
    const shortcutEditData:IShortcutEditData = React.useContext(ShortcutEditPageContext)
    const [isHovered, setIsHovered] = React.useState(false)

    const handleUpdateKey = (updateIndex:number, updatedKey:IShortcutKey) => {
        console.log(updatedKey)
        
        const tmpData = Object.assign({}, shortcutEditData.appData); 
        tmpData.groups[groupI].shortcuts[shortcutI][isAltSequence ? 'altSequence' : 'keySequence'][updateIndex] = updatedKey
        shortcutEditData.setAppData(tmpData)
    }

    const handleAddNewKey = () => {
        const tmpData = Object.assign({}, shortcutEditData.appData); 
        tmpData.groups[groupI].shortcuts[shortcutI][isAltSequence ? 'altSequence' : 'keySequence'].push({
            altMod: false, 
            ctrlMod: false, 
            keys: [], 
            shiftMod: false, 
            winMod: false
        })
        shortcutEditData.setAppData(tmpData)
    }

    const handleDeleteKey = (deleteIndex:number) => {
        const tmpData = Object.assign({}, shortcutEditData.appData); 
        let targetSequence = []
        if(isAltSequence)
            targetSequence = tmpData.groups[groupI].shortcuts[shortcutI].altSequence
        else
            targetSequence = tmpData.groups[groupI].shortcuts[shortcutI].keySequence

        targetSequence = targetSequence.filter((_, i) => i != deleteIndex)
        tmpData.groups[groupI].shortcuts[shortcutI][isAltSequence ? 'altSequence' : 'keySequence'] = targetSequence
        shortcutEditData.setAppData(tmpData)
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

    return <Chip tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{fontSize: 'larger', minWidth: "100px", textAlign: 'end'}}
        variant='solid'
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
                onUpdateKey(curKey)
        }}
        color={isEditing ? 'success' : isHovered ? 'neutral' : 'primary'}
    >
        {shortcutKeyToString(curKey)}
        <ChipDelete onDelete={onDeleteKey} />
    </Chip>
}
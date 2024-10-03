import React from 'react'
import { useLocation, useParams } from 'react-router'
import { IApplication, IShortcut, IShortcutGroup, IShortcutKey } from '../types';
import { Box, Chip, Dropdown, IconButton, Input, Menu, MenuButton, MenuItem, Option, Select, Typography } from '@mui/joy';
import { deleteApplication, getApplication, shortcutKeyToString, upsertApplication } from '../Util';
import { ArrowRight, CloseOutlined, FavoriteOutlined, MoreHorizOutlined, StarBorderOutlined, StarOutline, StarOutlined, StarsOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';


const highlightColors = [
    "lightblue",
    "lightcoral",
    "lightgreen",
    "lightgrey",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow"
];


  
export const ShortcutPage = () => {
    const {applicationId} = useParams();
    const appContext = React.useContext(AppContext); 

    const [appData, setAppData] = React.useState<IApplication>(); 
    const [targetAppData, setTargetAppData] = React.useState<IApplication>(); 
    const [targetShortcut, setTargetShortcut] = React.useState<IShortcutKey>(); 
    const [targetLayout, setTargetLayout] = React.useState<EKeyboardLayout>(EKeyboardLayout.QUERTY); 
    const [targetPlatform, setTargetPlatform] = React.useState<EKeyboardPlatform>(EKeyboardPlatform.WINDOWS); 
    const [searchFilter, setSearchFilter] = React.useState<string|undefined>(undefined); 
    const [highlightSeqI, setHighlightSeqI] = React.useState<number>(-1)

    React.useEffect(() => {
        ;(async() => {
            const targetApp = await getApplication({id: applicationId})
            if(targetApp.data) {
                setAppData(targetApp.data[0])
                setTargetAppData(targetApp.data[0])
            }
        })(); 
    }, [applicationId])

    const handleDelete = () => {
        if(applicationId)
            deleteApplication(applicationId).then(() => {
                document.location.href = 'http://localhost:3000'
            })
    }

    const handleFav = (isFav:boolean) => {
        let tmpData = Object.assign({}, targetAppData); 
        tmpData.fav = isFav; 
        setTargetAppData(tmpData); 
        
        tmpData = Object.assign({}, appData); 
        tmpData.fav = isFav; 
        setAppData(tmpData); 

        upsertApplication(tmpData); 
        appContext.setLastUpdated(new Date()); 
    }

    const handleExportData = () => {
        if(appData){
            const file = new File([JSON.stringify(appData, null, "\t")], `${appData.name}.json`,{
                type: 'applicaiton/json'
            })

            document.location.href = window.URL.createObjectURL(file)
        }
    }

    const handleSearch = (searchFilter:string|undefined) => {
        if(searchFilter == undefined){
            console.log(appData)
            setTargetAppData(appData)
        } else{
            const tmpData = JSON.parse(JSON.stringify(appData)); 
            const tmpGroups:IShortcutGroup[] = []
            for(let i = 0; i < tmpData.groups.length; i++){
                let group = tmpData.groups[i]
                if(group.name.includes(searchFilter)){
                    tmpGroups.push(group); continue; 
                }
    
                const tmpShortcuts:IShortcut[] = []
                for(let sc of group.shortcuts){
                    if(sc.name.includes(searchFilter)) tmpShortcuts.push(sc)
                }
                if(tmpShortcuts.length > 0){
                    group.shortcuts = tmpShortcuts
                    tmpGroups.push(group)
                }
            }
            tmpData.groups = tmpGroups; 
            setTargetAppData(tmpData)
        }
        setSearchFilter(searchFilter)
    }
    

    return <Box display={'flex'} flexDirection={'column'} width={'100%'} height={'100%'} gap={2}>
        <Box display={'grid'} gridTemplateColumns={'auto 1fr auto'} role='header'> 
            <IconButton onClick={() => handleFav(!targetAppData?.fav)}>{targetAppData?.fav ? <StarOutlined sx={{color: 'success.500'}} /> : <StarBorderOutlined sx={{color: 'primary.900'}}/>}</IconButton>
            <Typography level='h2'>{appData?.name}</Typography>
            <Dropdown>
                <MenuButton color='primary' slots={{root: IconButton}}><MoreHorizOutlined /></MenuButton>
                <Menu sx={{bgcolor: 'background.level3'}} color='primary'>
                    <MenuItem color='primary' sx={{color: 'text.primary'}}><Link to="./edit" style={{textDecoration: 'none', width: '100%'}}>Edit</Link></MenuItem>
                    <MenuItem color='primary' sx={{color: 'text.primary'}} onClick={handleExportData}>Export to Json</MenuItem>
                    <MenuItem color='danger' onClick={handleDelete}>Delete</MenuItem>
                </Menu>
            </Dropdown>
        </Box>

        <Box position={'relative'} display={'flex'} height={'100%'} border={'dotted gray'}>
            <Select defaultValue={targetPlatform} sx={{height: '10px'}} onChange={(_, newVal) => newVal && setTargetPlatform(newVal)}>
                {Object.keys(EKeyboardPlatform).map((platform, platformI) => <Option key={platformI} value={platform}>{platform}</Option>)}
            </Select>
            <Select defaultValue={targetLayout} sx={{height: '10px'}} onChange={(_, newValue) => newValue && setTargetLayout(newValue)}>
                {Object.keys(EKeyboardLayout).map((layout, layoutI) => <Option key={layoutI} value={layout}>{layout}</Option>)}
            </Select>

            <DisplayKeyboard targetPlatform={targetPlatform} targetLayout={targetLayout} shortcutKey={targetShortcut} seqI={highlightSeqI}
            />
        </Box>

        <Input placeholder='Search...' onKeyDown={(ev) => {
            if(ev.key == 'Enter' && ev.currentTarget.value.trim() != ''){
                handleSearch(ev.currentTarget.value.trim())
                ev.currentTarget.value = "";
            }
        }} />

        {searchFilter && <Box display={'inline-grid'} gridTemplateColumns={'auto 1fr'} alignItems={'center'} gap={2}>
            <IconButton onClick={() => handleSearch(undefined)}><CloseOutlined /></IconButton>
            <Typography>{`Showing results for ${searchFilter}...`}</Typography>
        </Box>}
    
        <Box maxWidth={'100%'} height={'100%'} display={'flex'} flexDirection={'row'} flexWrap={'wrap'} sx={{overflowY: 'scroll'}} alignContent={'stretch'} gap={2}>
            {targetAppData && targetAppData.groups.map((sGroup, sGroupI) => 
                <ShortcutGroupList key={sGroupI} shortcutGroup={sGroup} style={{backgroundColor: 'background.backdrop', border: 'solid', borderColor: 'primary.500', borderRadius: '10px', flex: '1 1 auto', padding: 3}}>
                    {sGroup.shortcuts.map((sCut, sCutI) => <ShortcutItem key={`${sGroupI}-${sCutI}`} shortcut={sCut} 
                    setSelectedShortcut={(sc, highlightI) => {
                        setTargetShortcut(sc)
                        setHighlightSeqI(highlightI)
                    }}/>)
                    }
                </ShortcutGroupList>
            )}
        </Box>
    </Box>
}

const functionRow = [
    'ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
]
const QUERTY_LAYOUT = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'], 
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'], 
    ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'], 
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'RShift'], 
    ['Ctrl', 'Win', 'Alt', 'Space', 'RAlt', 'RWin', 'CSM', 'RCtrl']
]

const AZERTY_LAYOUT = [
    ['²', '&', 'é', '"', "'", '(', '-', 'è', '_', 'ç', 'à', ')', '=', 'Backspace'],
    ['Tab', 'a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '^', '$', 'Enter'],
    ['Caps Lock', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'ù', '*'],
    ['Shift', '<', 'w', 'x', 'c', 'v', 'b', 'n', ',', ';', ':', '!', 'RShift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'RAlt', 'RWin', 'CSM', 'RCtrl']
]

const QWERTZ_LAYOUT = [
    ['^', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß', '´', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', '+', '#'],
    ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä', 'Enter'],
    ['Shift', '<', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-', 'RShift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'RAlt', 'RWin', 'CSM', 'RCtrl']
]

const DVORAK_LAYOUT = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '[', ']', 'Backspace'],
    ['Tab', "'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '=', '\\'],
    ['Caps Lock', 'a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-', 'Enter'],
    ['Shift', ';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z', 'RShift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'RAlt', 'RWin', 'CSM', 'RCtrl']
]


enum EKeyboardLayout {
    QUERTY = 'QUERTY',
    AZERTY = 'AZERTY',
    QWERTZ = 'QWERTZ',
    DVORAK = 'DVORAK',
}

const layoutMap:{[key in EKeyboardLayout]: string[][]} = {
    [EKeyboardLayout.QUERTY]: QUERTY_LAYOUT,
    [EKeyboardLayout.AZERTY]: AZERTY_LAYOUT,
    [EKeyboardLayout.DVORAK]: DVORAK_LAYOUT,
    [EKeyboardLayout.QWERTZ]: QWERTZ_LAYOUT,
}

enum EKeyboardPlatform {
    MAC = 'MAC',
    WINDOWS = 'WINDOWS',
}
const DisplayKeyboard = (
        {targetPlatform=EKeyboardPlatform.WINDOWS, targetLayout=EKeyboardLayout.QUERTY, shortcutKey=undefined, seqI}
        :{targetPlatform:EKeyboardPlatform, targetLayout:EKeyboardLayout, shortcutKey:IShortcutKey|undefined, seqI:number}
    ) => {


    return (
        <Box display={'inline-grid'} width={'90%'} height={'60%'} position={'absolute'} top={'50%'} left={'50%'} sx={{transform: 'translate(-50%, -50%)'}}>
            {
                [functionRow, ...layoutMap[targetLayout]].map((layoutRow, layoutRowI) => {
                    return <Box key={layoutRowI} display={'flex'}>{layoutRow.map((targetKey, targetKeyI) => {
                        let targetFlex = '1 1 auto'
                        let doHighlight = false; 
                        
                        if(targetKey == 'Backspace')        targetFlex = '1.25 1 auto'
                        else if (targetKey == '\\')         targetFlex = '1.25 1 auto'
                        else if (targetKey == 'Tab')        targetFlex = '1.25 1 auto'
                        else if (targetKey == 'Caps Lock')  targetFlex = '1.05 1 auto'
                        else if (targetKey == 'Enter')      targetFlex = '1.75 1 auto'
                        else if (targetKey == 'Shift')      targetFlex = '2 1 auto'
                        else if (targetKey == 'Shift')      targetFlex = '2 1 auto'
                        else if (targetKey == 'Space')      targetFlex = '7 1 auto'
                        
                        if(shortcutKey) {
                            if(
                                (shortcutKey.altMod && targetKey == 'Alt')
                                || (shortcutKey.ctrlMod && targetKey == 'Ctrl')
                                || (shortcutKey.shiftMod && targetKey == 'Shift')
                                || (shortcutKey.keys.includes(targetKey.toUpperCase()))
                            ) {
                                doHighlight = true; 
                            }
                        }

                        return (
                            <Box bgcolor={doHighlight ? `success.${(seqI+1) * 100}` : 'background.level3'} fontSize={'x-large'} textAlign={'center'} flex={targetFlex} 
                                border={'solid'} borderColor={'primary.500'} color={'text.secondary'}
                                key={`${targetKey}-${targetKeyI}`}
                            >
                                {(targetKey == 'Win' || targetKey == 'RWin') && targetPlatform == EKeyboardPlatform.MAC ? (targetKey == 'Win' ? 'Cmd' : 'RCmd') : targetKey}
                            </Box>
                        )
                    })}</Box>
                })
            }
        </Box>
    )
}

const ShortcutGroupList = ({shortcutGroup, style={}, children}:{shortcutGroup:IShortcutGroup ,style?:React.CSSProperties, children:any}) => {
    return <Box sx={{...style, display: 'inline-block'}}>
        <Typography level='h4'>{shortcutGroup.name}</Typography>
        {children}
    </Box>
}

const ShortcutItem = ({shortcut, setSelectedShortcut}:{shortcut:IShortcut, setSelectedShortcut:(target:IShortcutKey|undefined, sequenceI:number)=>void}) => {
    const [isHovered, setIsHovered] = React.useState(false); 

    return <Box display={'flex'} width={'100%'} padding={1}>
        <Typography level='body-lg' sx={{marginRight: 'auto'}}>{shortcut.name}</Typography>
        {shortcut.keySequence.map((seq, seqI) => {
            return <>
                <Chip  key={seqI}
                    sx={{bgcolor: `success.${(seqI+1) * 100}`}}
                    onMouseEnter={() => {setSelectedShortcut(seq, seqI); setIsHovered(true);}}
                    onMouseLeave={() => {setSelectedShortcut(undefined, -1); setIsHovered(false);}}
               >{shortcutKeyToString(seq)}</Chip>
                {seqI != shortcut.keySequence.length - 1 && <ArrowRight />}
            </>
        })}
    </Box>
}
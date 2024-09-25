import React from 'react'
import { useParams } from 'react-router'
import { IApplication, IShortcut, IShortcutGroup } from '../types';
import { Box, Dropdown, IconButton, Input, Menu, MenuButton, MenuItem, Option, Select, Skeleton, Typography, TypographyClasses, TypographyClassKey, TypographyProps, TypographySystem, TypographyTypeMap } from '@mui/joy';
import { getApplication, getShortcutGroups, getShortcuts } from '../Util';
import { CloseOutlined, MoreHorizOutlined } from '@mui/icons-material';


export const ShortcutPage = () => {
    const {applicationId} = useParams();
    const [appData, setAppData] = React.useState<IApplication>(); 
    const [shortcutGroups, setShortcutGroups] = React.useState<IShortcutGroup[]>(); 
    const [shortcuts, setShortcuts] = React.useState<IShortcut[]>(); 
    const [targetShortcut, setTargetShortcut] = React.useState<IShortcut>(); 
    const [targetLayout, setTargetLayout] = React.useState<EKeyboardLayout>(EKeyboardLayout.QUERTY); 
    const [targetPlatform, setTargetPlatform] = React.useState<EKeyboardPlatform>(EKeyboardPlatform.WINDOWS); 
    const [searchFilter, setSearchFilter] = React.useState<string|undefined>(undefined); 

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

    const handleSearch = async (searchFilter:string|undefined) => {
        setSearchFilter(searchFilter)

        let targetShortcuts; 

        targetShortcuts = await getShortcuts({applicationId: applicationId, searchFilter: searchFilter})
        if(targetShortcuts.data)
            setShortcuts(targetShortcuts.data); 
    }
    
    return <Box display={'flex'} flexDirection={'column'} width={'100%'} height={'100%'} gap={2}>
        <Box display={'grid'} gridTemplateColumns={'1fr auto'} role='header'> 
            <Typography level='h2'>{appData?.name}</Typography>
            <MoreOptionsButton shortcut={targetShortcut} />
        </Box>

        <Box position={'relative'} display={'flex'} height={'100%'} border={'dotted gray'}>
            <Select defaultValue={targetPlatform} sx={{height: '10px'}} onChange={(_, newVal) => newVal && setTargetPlatform(newVal)}>
                {Object.keys(EKeyboardPlatform).map((platform, platformI) => <Option key={platformI} value={platform}>{platform}</Option>)}
            </Select>
            <Select defaultValue={targetLayout} sx={{height: '10px'}} onChange={(_, newValue) => newValue && setTargetLayout(newValue)}>
                {Object.keys(EKeyboardLayout).map((layout, layoutI) => <Option key={layoutI} value={layout}>{layout}</Option>)}
            </Select>

            <DisplayKeyboard targetPlatform={targetPlatform} targetLayout={targetLayout} highlightedShortcut={targetShortcut}/>
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
    
        <Box width={'100%'} height={'100%'} display={'flex'} flexDirection={'row'} flexWrap={'wrap'} gap={2} sx={{overflowY: 'scroll'}}>
            {shortcutGroups?.filter((group) => shortcuts?.findIndex(shortcut => shortcut.shortcutGroupId == group.id) != -1)
                .map((sGroup, sGroupI) => 
                <ShortcutGroupList shortcutGroup={sGroup} style={{border: 'solid', borderRadius: '10px', width: '100%', flex: '1 1 0', padding: 10}}>
                    {shortcuts?.filter((sCut, sCutI) => sCut.shortcutGroupId == sGroup.id)
                        .map((sCut, sCutI) => <ShortcutItem key={sCutI} shortcut={sCut} setSelectedShortcut={(sc) => setTargetShortcut(sc) }/>)
                    }
                </ShortcutGroupList>
            )}
        </Box>
    </Box>
}


/*
MORE OPTIONS BUTTON
*/

const MoreOptionsButton = (props:{shortcut:IShortcut|undefined}) => {

    return (<Dropdown>
        <MenuButton slots={{root: IconButton}}><MoreHorizOutlined /></MenuButton>
        <Menu>
            <MenuItem>Rename</MenuItem>
            <MenuItem>Edit</MenuItem>
            <MenuItem>Export to Json</MenuItem>
            <MenuItem color='danger'>Delete</MenuItem>
        </Menu>
    </Dropdown>)
}

const QUERTY_LAYOUT = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'], 
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'], 
    ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'], 
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'], 
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'CSM', 'Ctrl']
]

const AZERTY_LAYOUT = [
    ['²', '&', 'é', '"', "'", '(', '-', 'è', '_', 'ç', 'à', ')', '=', 'Backspace'],
    ['Tab', 'a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '^', '$', 'Enter'],
    ['Caps Lock', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'ù', '*'],
    ['Shift', '<', 'w', 'x', 'c', 'v', 'b', 'n', ',', ';', ':', '!', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt Gr', 'Win', 'CSM', 'Ctrl']
]

const QWERTZ_LAYOUT = [
    ['^', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß', '´', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü', '+', '#'],
    ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä', 'Enter'],
    ['Shift', '<', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt Gr', 'Win', 'CSM', 'Ctrl']
]

const DVORAK_LAYOUT = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '[', ']', 'Backspace'],
    ['Tab', "'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '=', '\\'],
    ['Caps Lock', 'a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-', 'Enter'],
    ['Shift', ';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z', 'Shift'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'CSM', 'Ctrl']
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
        {targetPlatform=EKeyboardPlatform.WINDOWS, targetLayout=EKeyboardLayout.QUERTY, highlightedShortcut=undefined}
        :{targetPlatform:EKeyboardPlatform, targetLayout:EKeyboardLayout, highlightedShortcut:IShortcut|undefined}
    ) => {

    return (
        <Box display={'inline-grid'} width={'90%'} height={'60%'} position={'absolute'} top={'50%'} left={'50%'} border={'solid'} sx={{transform: 'translate(-50%, -50%)'}}>
            {
                layoutMap[targetLayout].map((layoutRow, layoutRowI) => {
                    return <Box key={layoutRowI} display={'flex'}>{layoutRow.map((targetKey, targetKeyI) => {
                        let targetFlex = '1 1 auto'
                        
                        if(targetKey == 'Backspace')        targetFlex = '1.25 1 auto'
                        else if (targetKey == '\\')         targetFlex = '1.25 1 auto'
                        else if (targetKey == 'Tab')        targetFlex = '1.25 1 auto'
                        else if (targetKey == 'Caps Lock')  targetFlex = '1.05 1 auto'
                        else if (targetKey == 'Enter')      targetFlex = '1.75 1 auto'
                        else if (targetKey == 'Shift')      targetFlex = '2 1 auto'
                        else if (targetKey == 'Shift')      targetFlex = '2 1 auto'
                        else if (targetKey == 'Space')      targetFlex = '7 1 auto'
                        
                        let highlightColor = 'white'
                        if(highlightedShortcut) {
                            
                            if(
                                (highlightedShortcut.altMod && targetKey == 'Alt')
                                || (highlightedShortcut.ctrlMod && targetKey == 'Ctrl')
                                || (highlightedShortcut.shiftMod && targetKey == 'Shift')
                                || (highlightedShortcut.keyCombination.includes(targetKey.toUpperCase()))
                            ) highlightColor = 'lightblue'
                        }
                            
                        return (
                            <Box bgcolor={highlightColor} fontSize={'x-large'} textAlign={'center'} flex={targetFlex} border={'solid'} 
                                key={`${targetKey}-${targetKeyI}`}
                            >
                                {targetKey == 'Win' && targetPlatform == EKeyboardPlatform.MAC ? 'Cmd' : targetKey}
                            </Box>
                        )
                    })}</Box>
                })
            }
        </Box>
    )
}

const ShortcutGroupList = ({shortcutGroup, style={}, children}:{shortcutGroup:IShortcutGroup ,style?:React.CSSProperties, children:any}) => {
    return <Box style={{...style, display: 'inline-block'}}>
        <Typography level='h4'>{shortcutGroup.name}</Typography>
        {children}
    </Box>
}

const ShortcutItem = ({shortcut, setSelectedShortcut}:{shortcut:IShortcut, setSelectedShortcut:(target:IShortcut|undefined)=>void}) => {
    const [isHovered, setIsHovered] = React.useState(false); 
    
    let input:string[] = []; 

    if(shortcut.ctrlMod) input.push('Ctrl')
    if(shortcut.altMod) input.push("Alt")
    if(shortcut.shiftMod) input.push("Shift")
    input = [...input, ...shortcut.keyCombination];

    return <Box bgcolor={isHovered ? 'lightblue' : 'white'} display={'inline-grid'} 
        gridTemplateColumns={'1fr auto'} width={'100%'} 
        padding={1}
        onMouseEnter={() => {setSelectedShortcut(shortcut); setIsHovered(true);}}
        onMouseLeave={() => {setSelectedShortcut(undefined); setIsHovered(false);}}
    >
        <Typography level='body-lg'>{shortcut.name}</Typography>
        <Typography level='body-lg'>{input.join(" + ")}</Typography>
    </Box>
}
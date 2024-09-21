import React from 'react'
import { useParams } from 'react-router'
import { IApplication, IShortcut, IShortcutGroup } from '../types';
import { Box, IconButton, Input, Option, Select, Typography } from '@mui/joy';
import { getApplication, getShortcutGroups, getShortcuts } from '../Util';
import { MoreHorizOutlined } from '@mui/icons-material';


const KBD_LAYOUTS = ['QWERTY', 'Dvorak', 'Colemak', 'QWERTZ', 'AZERTY', 'Workman', 'Maltron', 'JCUKEN', 'BÉPO', 'Halmak']
const PLATFORMS = ['Windows', 'Mac']
export const ShortcutPage = () => {
    const {applicationId} = useParams();
    const [appData, setAppData] = React.useState<IApplication>(); 
    const [shortcutGroups, setShortcutGroups] = React.useState<IShortcutGroup[]>(); 
    const [shortcuts, setShortcuts] = React.useState<IShortcut[]>(); 

    React.useEffect(() => {
        ;(async() => {
            const targetApp = await getApplication(applicationId)
            if(targetApp.data)
                setAppData(targetApp.data[0])

            const targetShortcutGroups = await getShortcutGroups(applicationId)
            if(targetShortcutGroups.data)
                setShortcutGroups(targetShortcutGroups.data)

            const targetShortcuts = await getShortcuts(applicationId)
            if(targetShortcuts.data)
                setShortcuts(targetShortcuts.data); 
        })(); 
    }, [applicationId])
    
    return <Box display={'inline-block'} width={'100%'} height={'100%'}>
        <Typography level='h2'>{appData?.name}</Typography>
        <IconButton><MoreHorizOutlined /></IconButton>
        <Box>
            <Select defaultValue={PLATFORMS[0]}>
                {PLATFORMS.map((platform, platformI) => <Option key={platformI} value={platform}>{platform}</Option>)}
            </Select>
            <Select defaultValue={KBD_LAYOUTS[0]}>
                {KBD_LAYOUTS.map((layout, layoutI) => <Option key={layoutI} value={layout}>{layout}</Option>)}
            </Select>
            <Box width={'50%'} height={'20%'} border={'solid'}>
                Keyboard
            </Box>
        </Box>

        <Input placeholder='Search...' />
    
        {shortcutGroups?.map((sGroup, sGroupI) => 
            <ShortcutGroupElement shortcutGroup={sGroup} style={{border: 'solid'}}>
                {shortcuts?.filter((sCut, sCutI) => sCut.shortcutGroupId == sGroup.id)
                    .map((sCut, sCutI) => <ShortcutItem key={sCutI} shortcut={sCut} />)
                }
            </ShortcutGroupElement>
        )}

    </Box>
}


const ShortcutGroupElement = ({shortcutGroup, style={}, children}:{shortcutGroup:IShortcutGroup ,style?:React.CSSProperties, children:any}) => {
    return <Box style={style}>
        <Typography level='title-lg'>{shortcutGroup.name}</Typography>
        {children}
    </Box>
}


const ShortcutItem = ({shortcut}:{shortcut:IShortcut}) => {
    const shortcutString = "";
    
    return <Box>{shortcut.name}{shortcutString}</Box>
}
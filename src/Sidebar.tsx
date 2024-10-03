import { Box, Button, Dropdown, IconButton, Input, Menu, MenuButton, MenuItem, Typography, useColorScheme } from '@mui/joy'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { APIResponse, getApplication, upsertApplication } from './Util';
import { AddOutlined, CloseOutlined, DarkModeOutlined, LightModeOutlined, PaletteOutlined } from '@mui/icons-material';
import { AppContext } from './App';
import { IApplication } from './types';
import { ColorScheme, ColorSchemeData, colorSchemes } from './Themes';
import Color from 'colorjs.io/types';


export interface SidebarItem { 
    label:string, 
    path:string, 
    id:string,
    iconPath:string, 
    fav:boolean,
}

export const Sidebar = () => {
    const [searchFilter, setSearchFilter] = React.useState<string|undefined>(undefined)
    const [sidebarItems, setSidebarItems] = React.useState<SidebarItem[]>([]); 
    const [isAdding, setIsAdding] = React.useState(false); 
    const {mode, setMode} = useColorScheme()

    const appContext = React.useContext(AppContext)
    const favorites = sidebarItems.filter(item => item.fav)

    const updateSidebarItemsFromResponse = (resp: APIResponse<IApplication>) => {
        if(resp.data)
            setSidebarItems(resp.data.map(item => {
                return {iconPath: "", label: item.name, path: `/application/${item._id}`, fav: item.fav, id: item._id}
            }))
    }

    React.useEffect(()=>{
        getApplication({}).then(updateSidebarItemsFromResponse)
      }, [appContext.lastUpdated])

    const handleSearch = (searchString:string|undefined) => {
        setSearchFilter(searchString)
        getApplication({searchFilter: searchString}).then(updateSidebarItemsFromResponse)
    }

    const handleAddApplication = (appName:string) => {
        const newApplication:IApplication = {
            _id: '',
            fav: false, 
            groups: [], 
            name: appName
        }

        upsertApplication(newApplication).then(resp => {
            if(resp.data){
                console.log(resp.data)
                appContext.setLastUpdated(new Date())
            }
        })
    }

    return <Box display={'flex'} flexDirection={'column'}> 
        <Link to={'/'} style={{display: 'flex', flexDirection: 'column'}}>
            <img src='https://cdn.icon-icons.com/icons2/1875/PNG/512/shortcut_120284.png' role='button' />
        </Link>
        <Input onKeyUp={(ev) => {
            if(ev.key == 'Enter' && ev.currentTarget.value.trim() != ''){
                handleSearch(ev.currentTarget.value.trim()); 
                ev.currentTarget.value = ""; 
            }}
        } />


        {searchFilter && <Box display={'grid'} gridTemplateColumns={'auto 1fr'}> 
            <IconButton onClick={() => handleSearch(undefined)}><CloseOutlined /></IconButton>
            <Typography>{`Showing results for "${searchFilter}"...`}</Typography>    
        </Box>}

        
        {favorites.length > 0 && <>
            <Typography marginTop={2} marginBottom={1} level='h3'>Favorites</Typography>
            <Box display={'grid'} gridAutoRows={'auto'} sx={{overflowY: 'scroll'}}>
                {favorites.map((item, itemI) => <SidebarItemElement item={item} key={`fav-${item.id}`}/> )}
            </Box>
        </>}
        
        <Box marginTop={2} marginBottom={1} display={'grid'} gridTemplateColumns={'1fr auto'}>
            <Typography level='h3'>All Shortcuts</Typography>
            <Button color='primary' onClick={() => setIsAdding(true)}><AddOutlined/></Button>
        </Box>
        {isAdding && <Input sx={{marginTop: 2, marginBottom: 2}} autoFocus placeholder='Add application name here' onBlur={() => setIsAdding(false)} onKeyDown={(ev) => {
            if(ev.key == 'Enter'){
                handleAddApplication(ev.currentTarget.value)
                setIsAdding(false)
            }
        }}/>}
        <Box display={'grid'} gridAutoRows={'auto'} gap={1} sx={{overflowY: 'scroll'}}>
            {sidebarItems.map(item => <SidebarItemElement item={item} key={`all-${item.id}`}/> )}
        </Box>

        <Box sx={{marginTop: 'auto'}} display={'grid'} gridTemplateColumns={'auto 1fr'} gap={1}>
            <Button color='primary' onClick={() => {appContext.setThemeIsDark(!appContext.themeIsDark); setMode(mode === 'dark' ? 'light' : 'dark')}}>
                {!appContext.themeIsDark ? <DarkModeOutlined /> : <LightModeOutlined/> }    
            </Button>
            <ThemePicker />
        </Box>
    </Box>
}


const ThemePicker = () => {
    const appContext = React.useContext(AppContext)

    const createColorChip = (color:Color) => {
        const size:string = '15px'
        const border:string = '4px'
        return <Box width={size} height={size} borderRadius={border} bgcolor={color.toString()}/>
    }

    const handleColorSelect = (targetScheme:ColorScheme) => {
        const targetData = colorSchemes[targetScheme]
        appContext.setCurTheme(targetScheme)
    }

    return (
        <Dropdown>
            <MenuButton slots={{root: Button}} startDecorator={<PaletteOutlined />} color='primary' />
            <Menu color='primary' sx={{bgcolor: 'background.level2'}}>
                {Object.entries(colorSchemes).map(([scheme, data], schemeI) => 
                        <MenuItem color='primary' onClick={(ev) => handleColorSelect(scheme as ColorScheme)} key={schemeI}>
                            <Typography fontFamily={data.nameFont} marginRight={'auto'}>{scheme}</Typography>
                            {Object.values(data).map(val => createColorChip(val))}
                        </MenuItem>
                )}
            </Menu>
        </Dropdown>
    )
}

const SidebarItemElement = ({item}:{item:SidebarItem}) => {
    const curPage = useLocation().pathname;   

    return  <Link to={item.path} role='button' style={{display: 'grid', textDecoration: 'none'}}>   
        <Button sx={{borderRadius: 0}} color={curPage.includes(item.path) ? 'success' : 'primary'}>
            {item.iconPath}{item.label}
        </Button>
    </Link>
}
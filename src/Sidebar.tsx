import { Box, Dropdown, IconButton, Input, Menu, MenuButton, MenuItem, Typography } from '@mui/joy'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { APIResponse, getApplication, getColor, upsertApplication } from './Util';
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

    const appContext = React.useContext(AppContext)

    const favorites = sidebarItems.filter(item => item.fav)
    const buttonStyle:React.CSSProperties = {
        color: getColor({scheme: appContext.curTheme, colorField:'fontSecondary', isDark:appContext.themeIsDark}), 
        borderColor: getColor({scheme: appContext.curTheme, colorField:'secondary', isDark:appContext.themeIsDark})
    }

    const fontStyle:React.CSSProperties = {
        color: getColor({scheme: appContext.curTheme, colorField:'fontPrimary', isDark:appContext.themeIsDark})
    }

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
        <img src='https://cdn.icon-icons.com/icons2/1875/PNG/512/shortcut_120284.png' role='button' />
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
            <Typography textColor={fontStyle.color} marginTop={2} marginBottom={1} level='h3'>Favorites</Typography>
            <Box display={'grid'} gridAutoRows={'auto'} sx={{overflowY: 'scroll'}}>
                {favorites.map((item, itemI) => <SidebarItemElement item={item} key={`fav-${item.id}`}/> )}
            </Box>
        </>}
        
        <Box marginTop={2} marginBottom={1} display={'grid'} gridTemplateColumns={'1fr auto'}>
            <Typography textColor={fontStyle.color} level='h3'>All Shortcuts</Typography>
            <IconButton sx={fontStyle} onClick={() => setIsAdding(true)}><AddOutlined style={buttonStyle} /></IconButton>
        </Box>
        {isAdding && <Input autoFocus placeholder='Add application name here' onBlur={() => setIsAdding(false)} onKeyDown={(ev) => {
            if(ev.key == 'Enter'){
                handleAddApplication(ev.currentTarget.value)
                setIsAdding(false)
            }
        }}/>}
        <Box display={'grid'} gridAutoRows={'auto'} sx={{overflowY: 'scroll'}}>
            {sidebarItems.map((item, itemI) => <SidebarItemElement item={item} key={`all-${item.id}`}/> )}
        </Box>

        <Box sx={{marginTop: 'auto'}} display={'grid'} gridTemplateColumns={'auto 1fr'} gap={1}>
            <IconButton onClick={() => appContext.setThemeIsDark(!appContext.themeIsDark)}>
                {appContext.themeIsDark ? <DarkModeOutlined style={buttonStyle} /> : <LightModeOutlined style={buttonStyle}/> }    
            </IconButton>
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

    const fontStyle:React.CSSProperties = {
        color: getColor({scheme: appContext.curTheme, colorField:'fontPrimary', isDark:appContext.themeIsDark})
    }

    return (
        <Dropdown>
            <MenuButton startDecorator={<PaletteOutlined style={{
                color: getColor({scheme: appContext.curTheme, colorField:'fontSecondary', isDark:appContext.themeIsDark}),
                borderColor: getColor({scheme: appContext.curTheme, colorField:'secondary', isDark:appContext.themeIsDark})
            }} />} />
            <Menu>
                    {Object.entries(colorSchemes).map(([scheme, data], schemeI) => 
                            <MenuItem onClick={(ev) => handleColorSelect(scheme as ColorScheme)} key={schemeI}>
                                <Typography fontFamily={data.nameFont} marginRight={'auto'}>{scheme}</Typography>
                                {Object.values(data).map(val => createColorChip(val))}
                            </MenuItem>
                    )}
                </Menu>
        </Dropdown>
    )
}

const SidebarItemElement = ({item}:{item:SidebarItem}) => {
    const [isHovered, setIsHovered] = React.useState(false); 
    const curPage = useLocation().pathname;
    const appContext = React.useContext(AppContext);

    
    const hoverColor:string =  getColor({scheme: appContext.curTheme, colorField:'secondary', isDark:appContext.themeIsDark})
    const defaultColor:string =  getColor({scheme: appContext.curTheme, colorField:'primary', isDark:appContext.themeIsDark})
    const selectColor:string =  getColor({scheme: appContext.curTheme, colorField:'accent', isDark:appContext.themeIsDark})
    
    const sidebarButtonStyle:React.CSSProperties = {
        padding: 10, 
        color: getColor({scheme: appContext.curTheme, colorField:'fontPrimary', isDark:appContext.themeIsDark}),
        fontWeight: "bold",
        textDecorationLine: 'none',
        textDecoration: "none"
    }

    return  <Link to={item.path} role='button' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    style={{
        ...sidebarButtonStyle
        , backgroundColor: curPage.includes(item.path) ? selectColor : isHovered ? hoverColor : defaultColor
    }} 
>
    {item.iconPath}{item.label}
</Link>
}
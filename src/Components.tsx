import { Box, IconButton, Input, Typography } from '@mui/joy'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { APIResponse, getApplication } from './Util';
import { CloseOutlined } from '@mui/icons-material';
import { AppContext } from './App';


export interface SidebarItem { 
    label:string, 
    path:string, 
    iconPath:string, 
}

export const Sidebar = () => {
    const curPage = useLocation().pathname;
    const [hoverI, setHoverI] = React.useState(-1); 
    const [searchFilter, setSearchFilter] = React.useState<string|undefined>(undefined)
    const [sidebarItems, setSidebarItems] = React.useState<SidebarItem[]>([]); 

    const appContext = React.useContext(AppContext)

    React.useEffect(()=>{
        getApplication({}).then(resp => {
            if(resp.data)
                setSidebarItems(resp.data.map(item => {
                    return {iconPath: "", label: item.name, path: `/application/${item.id}`}})
                )
        })
      }, [appContext.dataLastUpdated])

    const hoverColor:string = "lightgray"; 
    const defaultColor:string = "white"; 
    const selectColor:string = "teal"; 

    const sidebarButtonStyle:React.CSSProperties = {
        padding: 10, 
        color: 'black',
        fontWeight: "bold",
        textDecorationLine: 'none',
        textDecoration: "none"
    }

    const handleSearch = async(searchString:string|undefined) => {
        setSearchFilter(searchString)

        const resp = await getApplication({searchFilter: searchString})
        if(resp.data)
            setSidebarItems(resp.data.map(item => {
                return {iconPath: "", label: item.name, path: `/application/${item.id}`}})
            )
    }

    return <Box display={'flex'} flexDirection={'column'}> 
        <img src='https://cdn.icon-icons.com/icons2/1875/PNG/512/shortcut_120284.png' role='button' />
        <Input onKeyUp={(ev) => {
            if(ev.key == 'Enter' && ev.currentTarget.value.trim() != ''){
                handleSearch(ev.currentTarget.value.trim()); 
                ev.currentTarget.value = ""; 
            }}
        } />

        {searchFilter && <Box> 
            <IconButton onClick={() => handleSearch(undefined)}><CloseOutlined /></IconButton>
            <Typography>{`Showing results for "${searchFilter}"...`}</Typography>    
        </Box>}

        {sidebarItems.map((item, itemI) => 
            // <IconButton key={itemI} onClick={() => document.location.href = item.path}>{item.iconPath}{item.label}</IconButton>
            <Link key={itemI} to={item.path} role='button' onMouseEnter={() => setHoverI(itemI)} onMouseLeave={() => setHoverI(-1)}
                style={{
                    ...sidebarButtonStyle
                    , backgroundColor: curPage.includes(item.path) ? selectColor : hoverI == itemI ? hoverColor : defaultColor
                }} 
            >
                {item.iconPath}{item.label}
            </Link>
        )}
    </Box>
}
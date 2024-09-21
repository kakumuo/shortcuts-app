import { Box, IconButton, Input, Typography } from '@mui/joy'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'


export interface SidebarItem { 
    label:string, 
    path:string, 
    iconPath:string, 
}

export const Sidebar = ({sidebarItems}:{sidebarItems:SidebarItem[]}) => {
    const curPage = useLocation().pathname;
    const [hoverI, setHoverI] = React.useState(-1); 

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

    return <Box display={'flex'} flexDirection={'column'}>
        <img src='https://cdn.icon-icons.com/icons2/1875/PNG/512/shortcut_120284.png' />
        <Input />
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
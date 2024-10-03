import { Box, Typography, Sheet,
    Button,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Input } from '@mui/joy'
import React from 'react'
import { AppContext } from '../App';
import { IApplication } from '../types';
import { getApplication } from '../Util';
import { AddOutlined, DeleteOutline, EditOutlined } from '@mui/icons-material';

export const HomePage = () => {
    const appContext = React.useContext(AppContext); 
    const [appDataList, setAppDataList] = React.useState<IApplication[]>([]); 

    React.useEffect(() => {
        ;(async() => {
            const targetApp = await getApplication({})
            if(targetApp.data) {
                setAppDataList(targetApp.data)
            }
        })(); 
    }, [])


  return (<Typography level='h1'>Shortcuts.io</Typography>);
};

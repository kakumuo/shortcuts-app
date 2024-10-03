import React from 'react';
import {Box, CssVarsProvider, extendTheme, Snackbar, Theme} from '@mui/joy'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Sidebar } from './Sidebar';

import { HomePage } from './Pages/Home';
import { ShortcutPage } from './Pages/ShortcutPage';
import { ShortcutEditPage } from './Pages/ShortcutEditPage';
import { ColorScheme, colorSchemes } from './Themes';
import { createTheme } from '@mui/material';
import { getColor } from './Util';


export const AppContext = React.createContext({} as {
  isAlertVisible:boolean, 
  handleFireAlert:(message:string, level:'primary'|'warning'|'danger'|'success') => void
  lastUpdated:Date, 
  setLastUpdated:(newDate:Date)=>void
  curTheme:ColorScheme, 
  setCurTheme:(curTheme:ColorScheme)=>void,
  themeIsDark:boolean, 
  setThemeIsDark:(themeIsDark:boolean)=>void
}); 


function App() {
  const [isAlertVisible, setIsAlertVisible] = React.useState(false)
  const [alertDetails, setAlertDetails] = React.useState<{message:string, level:'primary'|'warning'|'danger'|'success'}>({level: 'primary', message: ""}); 
  const [alertTimeout, setAlertTimeout] = React.useState<NodeJS.Timeout>()

  const [lastUpdated, setLastUpdated] = React.useState(new Date);
  const [curTheme, setCurTheme] = React.useState(ColorScheme.Forest)
  const [themeIsDark, setThemeIsDark] = React.useState(false)
  const [extendedTheme, setExtendedTheme] = React.useState<Theme>(); 

  const handleFireAlert = (message:string, level:'primary'|'warning'|'danger'|'success') => {
    if(alertTimeout)
      clearTimeout(alertTimeout)

    setIsAlertVisible(true); 
    setAlertDetails({message, level})

    setAlertTimeout(setTimeout(() => {
      setIsAlertVisible(false)
    }, 2 * 1000))
  }

  React.useEffect(() => {
    setExtendedTheme(extendTheme({
      colorSchemes: {
        light: {
          palette: {
            success: {
              50:  getColor({colorField: 'accent', scheme: curTheme, scale: .75}),
              100: getColor({colorField: 'accent', scheme: curTheme, scale: .8}),
              200: getColor({colorField: 'accent', scheme: curTheme, scale: .85}),
              300: getColor({colorField: 'accent', scheme: curTheme, scale: .9}),
              400: getColor({colorField: 'accent', scheme: curTheme, scale: .95}),
              500: getColor({colorField: 'accent', scheme: curTheme, scale: 1}),
              600: getColor({colorField: 'accent', scheme: curTheme, scale: 1.1}),
              700: getColor({colorField: 'accent', scheme: curTheme, scale: 1.2}),
              800: getColor({colorField: 'accent', scheme: curTheme, scale: 1.3}),
              900: getColor({colorField: 'accent', scheme: curTheme, scale: 1.4}),
              solidColor: getColor({colorField: 'font', scheme: curTheme, scale: .2})
            },
            text: {
              primary: getColor({colorField: 'font', scheme: curTheme, scale: .2}),
              secondary: getColor({colorField: 'font', scheme: curTheme, scale: .3}),
              tertiary: getColor({colorField: 'font', scheme: curTheme, scale: .4}),
            },
            primary: {
              50:   getColor({colorField: 'primary', scheme: curTheme, scale: .5}),
              100:   getColor({colorField: 'primary', scheme: curTheme, scale: .6}),
              200:   getColor({colorField: 'primary', scheme: curTheme, scale: .7}),
              300:   getColor({colorField: 'primary', scheme: curTheme, scale: .8}),
              400:   getColor({colorField: 'primary', scheme: curTheme, scale: .9}),
              500:  getColor({colorField: 'primary', scheme: curTheme, scale: 1}),
              600:  getColor({colorField: 'primary', scheme: curTheme, scale: 1.1}),
              700:  getColor({colorField: 'primary', scheme: curTheme, scale: 1.4}),
              solidColor: getColor({colorField: 'font', scheme: curTheme, scale: .2})
            },
            background: {
              surface:  getColor({colorField: 'primary', scheme: curTheme, scale: 1.5}),
              level1:   getColor({colorField: 'primary', scheme: curTheme, scale: 1.3}), 
              level2:   getColor({colorField: 'primary', scheme: curTheme, scale: 1.4}), 
              level3:   getColor({colorField: 'primary', scheme: curTheme, scale: 1.5}), 
              backdrop:   getColor({colorField: 'primary', scheme: curTheme, scale: 1.45}), 
            },
          },
        },
      dark: {
          palette: {
            success: {
              50:  getColor({colorField: 'accent', scheme: curTheme, scale: .0}),
              100: getColor({colorField: 'accent', scheme: curTheme, scale: .1}),
              200: getColor({colorField: 'accent', scheme: curTheme, scale: .2}),
              300: getColor({colorField: 'accent', scheme: curTheme, scale: .3}),
              400: getColor({colorField: 'accent', scheme: curTheme, scale: .4}),
              500: getColor({colorField: 'accent', scheme: curTheme, scale: .5}),
              600: getColor({colorField: 'accent', scheme: curTheme, scale: .6}),
              700: getColor({colorField: 'accent', scheme: curTheme, scale: .7}),
              800: getColor({colorField: 'accent', scheme: curTheme, scale: .7}),
              900: getColor({colorField: 'accent', scheme: curTheme, scale: .8}),
            },
            text: {
              primary: getColor({colorField: 'font', scheme: curTheme, scale: 1.2}),
              secondary: getColor({colorField: 'font', scheme: curTheme, scale: 1.3}),
              tertiary: getColor({colorField: 'font', scheme: curTheme, scale: 1.4}),
            },
            primary: {
              50:   getColor({colorField: 'primary', scheme: curTheme, scale: .3}),
              100:   getColor({colorField: 'primary', scheme: curTheme, scale: .325}),
              200:   getColor({colorField: 'primary', scheme: curTheme, scale: .35}),
              300:   getColor({colorField: 'primary', scheme: curTheme, scale: .4}),
              400:   getColor({colorField: 'primary', scheme: curTheme, scale: .45}),
              500:  getColor({colorField: 'primary', scheme: curTheme, scale: .5}),
              600:  getColor({colorField: 'primary', scheme: curTheme, scale: .6}),
              700:  getColor({colorField: 'primary', scheme: curTheme, scale: .7}),
              800:  getColor({colorField: 'primary', scheme: curTheme, scale: .8}),
              900:  getColor({colorField: 'primary', scheme: curTheme, scale: .9}),
            },
            background: {
              surface:  getColor({colorField: 'primary', scheme: curTheme, scale: .5}),
              level1:   getColor({colorField: 'primary', scheme: curTheme, scale: .2}), 
              level2:   getColor({colorField: 'primary', scheme: curTheme, scale: .3}), 
              level3:   getColor({colorField: 'primary', scheme: curTheme, scale: .4}), 
              backdrop:   getColor({colorField: 'primary', scheme: curTheme, scale: .35}), 
            },
          },
        },
      },
    }))
  }, [curTheme])

  return <AppContext.Provider value={{isAlertVisible, handleFireAlert, lastUpdated, setLastUpdated, curTheme, setCurTheme, themeIsDark, setThemeIsDark}}>
    <CssVarsProvider theme={extendedTheme} colorSchemeSelector='' >
      <Box className='App' display={'grid'} gridTemplateColumns={'10% auto'} gridTemplateRows={'100%'} width={'100vw'} height={'100vh'} maxHeight={'100vh'} padding={3} gap={2}
        bgcolor={'background.level1'} 
      >
        <BrowserRouter>
          <Sidebar/>
          <Snackbar open={isAlertVisible} anchorOrigin={{horizontal: 'right', vertical: 'top'}} color={alertDetails.level}>
            {alertDetails.message}
          </Snackbar>
          <Box display={'inline-grid'} width={'100%'} height={'100%'} borderRadius={10} padding={4} bgcolor={'background.level2'}>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/application/:applicationId' element={<ShortcutPage />} />
              <Route path='/application/:applicationId/edit' element={<ShortcutEditPage />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </Box>
  </CssVarsProvider>
  </AppContext.Provider>
    
}

export default App;

import React from 'react';
import {Box, Snackbar} from '@mui/joy'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Sidebar, SidebarItem } from './Sidebar';

import { HomePage } from './Pages/Home';
import { ShortcutPage } from './Pages/ShortcutPage';
import { ShortcutEditPage } from './Pages/ShortcutEditPage';
import { ColorScheme, ColorSchemeData, colorSchemes } from './Themes';
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
  const [curTheme, setCurTheme] = React.useState(ColorScheme.Monokai)
  const [themeIsDark, setThemeIsDark] = React.useState(false)

  const handleFireAlert = (message:string, level:'primary'|'warning'|'danger'|'success') => {
    if(alertTimeout)
      clearTimeout(alertTimeout)

    setIsAlertVisible(true); 
    setAlertDetails({message, level})

    setAlertTimeout(setTimeout(() => {
      setIsAlertVisible(false)
    }, 2 * 1000))
  }

  return <AppContext.Provider value={{isAlertVisible, handleFireAlert, lastUpdated, setLastUpdated, curTheme, setCurTheme, themeIsDark, setThemeIsDark}}>
    <Box className='App' display={'grid'} gridTemplateColumns={'10% auto'} gridTemplateRows={'100%'} width={'100vw'} height={'100vh'} maxHeight={'100vh'} padding={3} gap={2}
      bgcolor={getColor({scheme: curTheme, colorField:'primary', isDark:themeIsDark})}
    >
      <BrowserRouter>
        <Sidebar/>
        <Snackbar open={isAlertVisible} anchorOrigin={{horizontal: 'right', vertical: 'top'}} color={alertDetails.level}>
          {alertDetails.message}
        </Snackbar>
        <Box display={'inline-grid'} width={'100%'} height={'100%'} bgcolor={getColor({scheme: curTheme, colorField:'secondary', isDark:themeIsDark})}
          borderRadius={10} padding={4}
        >
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/application/:applicationId' element={<ShortcutPage />} />
            <Route path='/application/:applicationId/edit' element={<ShortcutEditPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </Box>
  </AppContext.Provider>
    
}

export default App;

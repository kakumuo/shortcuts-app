import React from 'react';
import {Box, Snackbar} from '@mui/joy'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Sidebar, SidebarItem } from './Components';

import { HomePage } from './Pages/Home';
import { ShortcutPage } from './Pages/ShortcutPage';
import { ShortcutEditPage } from './Pages/ShortcutEditPage';


export const AppContext = React.createContext({} as {
  isAlertVisible:boolean, 
  handleFireAlert:(message:string, level:'primary'|'warning'|'danger'|'success') => void
  dataLastUpdated:Date, 
}); 

function App() {
  const [isAlertVisible, setIsAlertVisible] = React.useState(false)
  const [alertDetails, setAlertDetails] = React.useState<{message:string, level:'primary'|'warning'|'danger'|'success'}>({level: 'primary', message: ""}); 
  const [alertTimeout, setAlertTimeout] = React.useState<NodeJS.Timeout>()

  const handleFireAlert = (message:string, level:'primary'|'warning'|'danger'|'success') => {
    if(alertTimeout)
      clearTimeout(alertTimeout)

    setIsAlertVisible(true); 
    setAlertDetails({message, level})

    setAlertTimeout(setTimeout(() => {
      setIsAlertVisible(false)
    }, 2 * 1000))
  }

  return <AppContext.Provider value={{isAlertVisible, handleFireAlert, dataLastUpdated: new Date()}}>
    <Box className='App' display={'grid'} gridTemplateColumns={'10% auto'} gridTemplateRows={'100%'} width={'100vw'} height={'100vh'} maxHeight={'100vh'} border={'solid'} padding={3} gap={2}
      bgcolor={'lightgray'}
    >
      <BrowserRouter>
        <Sidebar/>
        <Snackbar open={isAlertVisible} anchorOrigin={{horizontal: 'right', vertical: 'top'}} color={alertDetails.level}>
          {alertDetails.message}
        </Snackbar>
        <Box display={'inline-grid'} width={'100%'} height={'100%'} bgcolor={'white'}
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

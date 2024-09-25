import React from 'react';
import {Box} from '@mui/joy'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Sidebar, SidebarItem } from './Components';

import { HomePage } from './Pages/Home';
import { ShortcutPage } from './Pages/ShortcutPage';

function App() {
  const [sidebarItems, setSidebarItems] = React.useState<SidebarItem[]>([])

  return <Box className='App' display={'grid'} gridTemplateColumns={'10% auto'} width={'100vw'} height={'100vh'} border={'solid'} padding={3} gap={2}
    bgcolor={'lightgray'}
  >
    <BrowserRouter>
      <Sidebar/>
      <Box display={'inline-grid'} width={'100%'} height={'100%'} bgcolor={'white'}
        borderRadius={10} padding={4}
      >
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/application/:applicationId' element={<ShortcutPage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  </Box>
}

export default App;

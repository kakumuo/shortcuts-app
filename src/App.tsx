import React from 'react';
import {Box} from '@mui/joy'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Sidebar, SidebarItem } from './Components';
import { APIResponse, getApplication } from './Util';
import { HomePage } from './Pages/Home';
import { ShortcutPage } from './Pages/ShortcutPage';

function App() {
  const [sidebarItems, setSidebarItems] = React.useState<SidebarItem[]>([])

  React.useEffect(()=>{
	getApplication().then(resp => {
		if(resp.data)
			setSidebarItems(resp.data.map(item => {
			return {iconPath: "", label: item.name, path: `/application/${item.id}`}
		}))
	})
  }, [])

  return <Box className='App' display={'grid'} gridTemplateColumns={'10% auto'} width={'100vw'} height={'100vh'} border={'solid'} padding={2} gap={2}>
    <BrowserRouter>
      <Sidebar sidebarItems={sidebarItems} />
      <Routes>
        <Route path='/' element={<HomePage />} />
		<Route path='/application/:applicationId' element={<ShortcutPage />} />
      </Routes>
    </BrowserRouter>
  </Box>
}

export default App;

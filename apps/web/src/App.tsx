import { AnimatePresence } from 'framer-motion'
import Apps_ from './components/Apps/Apps_'
import Auth from './components/Auth/Auth'
import MenuBar from './components/Bar/MenuBar'
import Desktop from './components/Desktop/Desktop'
import Dock from './components/Dock/Dock'
import DraggingItem from './components/DraggingItem'
import './index.css'
import { useGetSessionQuery } from './redux/APISlice'
import { useAppSelector } from './redux/hooks'
import cn from './utils'

function App() {

  const { data, error, isLoading } = useGetSessionQuery('')
  const handleContext = (e: any) => {
    // e.preventDefault()
    // console.log(e.target)
  }

  const token = useAppSelector((state) => state.auth.accessToken);

  if (isLoading) return <div>Loading...</div>

  return (
    <main className='h-screen pb-4' onContextMenu={handleContext}>
      {/* <CheckDevice /> */}
      <div className={cn('flex flex-col items-center h-full', !token ? 'justify-center' : 'justify-between')}>
        <AnimatePresence>
          {!token && (
            <Auth />
          )}
        </AnimatePresence>
        {token &&
          (<>
            <div className='w-full'>
              <MenuBar />
            </div>
            <Desktop>
              {/* <Folders /> */}
              <Apps_ />
            </Desktop>
            <div className='justify-self-end'>
              <Dock />
            </div>
            {<DraggingItem />}
          </>)
        }
      </div>
    </main>
  )
}

export default App

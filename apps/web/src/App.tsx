
import { AnimatePresence } from 'framer-motion'
import Apps_ from './components/Apps/Apps_'
import Auth from './components/Auth/Auth'
import MenuBar from './components/Bar/MenuBar'
import Dock from './components/Dock/Dock'
import './index.css'
import { useGetSessionQuery } from './redux/APISlice'
import { useAppSelector } from './redux/hooks'
import cn from './utils'
function App() {

  const { data, error, isLoading } = useGetSessionQuery('')
  const handleContext = (e: any) => {
    // e.preventDefault()
    console.log(e.target)
  }

  const user: any = useAppSelector((state) => state.auth.user)

  if (isLoading) return <div>Loading...</div>


  return (
    <main className=' h-screen pb-4' onContextMenu={handleContext}>
      {/* <CheckDevice /> */}
      <div className={cn(' flex flex-col items-center  h-full', !user?.username ? 'justify-center' : 'justify-between')}>
        <AnimatePresence>
          {!user?.username && (
            <Auth />
          )}
        </AnimatePresence>
        {user?.username &&
          (<>
            <div className=' w-full'>
              <MenuBar />
            </div>
            <div className='flex-1 w-full'>
              {/* <Folders /> */}
              <Apps_ />
            </div>
            <div className=' justify-self-end'>
              <Dock />
            </div>
          </>)
        }
      </div>

    </main>
  )
}

export default App

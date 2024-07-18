
import Apps_ from "./components/Apps/Apps_"
import MenuBar from "./components/Bar/MenuBar"
import { Folders } from "./components/Demo/Folder"
import Dock from "./components/Dock/Dock"
import './index.css'
function App() {
  const handleContext = (e: any) => {
    // e.preventDefault()
    console.log(e.target)
  }
  return (
    <main className=' h-screen pb-4' onContextMenu={handleContext}>
      {/* <CheckDevice /> */}
      {/* <div className=" flex h-full w-full items-center justify-center">
        <Signin />
      </div> */}

      <div className=' flex flex-col items-center justify-between h-full'>
        <div className=' w-full'>
          <MenuBar />
        </div>
        <div className='flex-1 w-full'>
          <Folders />
          <Apps_ />
        </div>
        <div className=' justify-self-end'>
          <Dock />
        </div>
      </div>
    </main>
  )
}

export default App

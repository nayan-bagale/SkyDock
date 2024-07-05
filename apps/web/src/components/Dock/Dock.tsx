import { DockButton, Dock as DockPanel } from '@repo/ui'
import { Icons } from '@repo/ui/icons'

const Dock = () => {
    const { Menu, React, Terminal, Docker, Folder, VSCode, Vite } = Icons;

  return (
      <DockPanel className='' intent={'primary'} size={'medium'}>
          {[Menu, React, Terminal, Docker, Folder, VSCode, Vite].map((Icon, index) => (
              <DockButton key={index} intent={'primary'} title={Icon.name}>
                  <Icon className="h-10" />
              </DockButton>
          ))}
      </DockPanel>
  )
}

export default Dock
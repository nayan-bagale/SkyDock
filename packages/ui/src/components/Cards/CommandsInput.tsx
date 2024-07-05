import React, { useRef, useState } from 'react'

const CommandsInput = () => {

    const scrollref = useRef<HTMLDivElement>(null);

    const [commands, setCommands] = useState<string[]>([]);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const command = e.currentTarget.value;
            setCommands([...commands, command]);
            e.currentTarget.value = '';
            scrollref.current?.scrollTo({
                top: scrollref.current?.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
  return (
      <div className=" flex flex-col p-2 text-xs h-full w-full gap-1">
          <div ref={scrollref} className=" overflow-y-scroll h-[17rem]">
              <div>Welcome to Nex-Cloud! - Type <span className="text-blue-500">help</span> for a list supported commands.</div>
              {commands.map((command, index) => (<div key={index}>-&#62; ~ {command}</div>))}
              <div className=" flex gap-1 -mb-2">
                  <div className=""> -&#62; ~ </div>
                  <input type="text" onKeyDown={handleKeyDown} className=" flex-1 bg-transparent outline-none text-wrap" />
              </div>
          </div>
      </div>
  )
}

export default CommandsInput
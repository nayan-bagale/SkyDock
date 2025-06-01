// "use client"

import * as SeparatorPrimitive from "@radix-ui/react-separator"
import * as React from "react"
import cn from "../utils"


function Separator({
    className,
    orientation = "horizontal",
    decorative = true,
    ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
    return (
        <SeparatorPrimitive.Root
            data-slot="separator"
            decorative={decorative}
            orientation={orientation}
            className={cn(
                "bg-white shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full  ",
                className
            )}
            {...props}
        />
    )
}

export { Separator }

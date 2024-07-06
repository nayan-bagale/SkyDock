import { cva, VariantProps } from "class-variance-authority";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { cn } from "../../utils";
import { useState } from "react";


const dockButtonStyles = cva(["font-semibold", "border", "rounded-2xl", "shadow", "p-1", "w-fit", "backdrop-blur-md", "z-10"], {
  variants: {
    intent: {
      primary: [
        "bg-white/80",
        "text-white",
        "border-transparent",
        "hover:bg-white/80",
      ],
      // **or**
      // primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
      secondary: [
        "bg-white",
        "text-gray-800",
        "border-gray-400",
        "hover:bg-gray-100",
      ],
    },

  },
  compoundVariants: [
    {
      intent: "primary",
      class: "uppercase",
      // **or** if you're a React.js user, `className` may feel more consistent:
      // className: "uppercase"
    },
  ],
  defaultVariants: {
    intent: "primary",
  },
});

type DockButtonProps = HTMLMotionProps<"button"> & VariantProps<typeof dockButtonStyles>



const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export const DockButton = ({
  onClick,
  children,
  intent,
  className,
  title,
  ...props
}: DockButtonProps) => {

  const [hover, setHover] = useState(false);


  return (
    <div className=" flex flex-col items-center">
      <motion.button onClick={onClick}
        type="button"
        className={cn(dockButtonStyles({ intent, className }))}
        whileHover={{ scale: 1.1, y: "-15px" }}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        whileTap={{ scale: 1.1, y: "-25px" }}
        transition={{
          ease: "linear",
          y: { duration: 0.2 }
        }}
        variants={item}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {children}
      </motion.button>
      <AnimatePresence>
        {hover &&
          <motion.p className=" transition-all px-1 py-0.5 backdrop-blur bg-white/60 rounded-xl rounded-bl-xl text-gray-600 absolute bottom-0 text-xs"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              ease: "linear",
              y: { duration: 0.2 }
            }}
          >
            {title}
          </motion.p>}
      </AnimatePresence>
    </div>

  );
};

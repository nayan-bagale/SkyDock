import { cn } from "@/utils/index";
import { cva, VariantProps } from "class-variance-authority";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import Spinner from "../Spinner";


const dockButtonStyles = cva(["font-semibold", "border", "outline-sky-400", "rounded-2xl", "shadow", "p-1", "w-fit", "backdrop-blur-md", "z-10"], {
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

type DockButtonProps = HTMLMotionProps<"button"> & VariantProps<typeof dockButtonStyles> & {
  isActive?: boolean;
  isLoading?: boolean;
}





export const DockButton = ({
  onClick,
  children,
  intent,
  className,
  title,
  isActive,
  isLoading,
  ...props
}: DockButtonProps) => {

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: isActive || isLoading ? -10 : 0,
      opacity: 1
    }
  }

  return (
    <motion.div className=" flex flex-col items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <motion.button onClick={(event) => onClick && onClick(event)}
        type="button"
        className={cn(dockButtonStyles({ intent, className }))}
        whileHover={{ scale: 1.1, y: "-15px" }}
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
        {isLoading ?
          (<motion.div
            className="absolute -bottom-1.5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: -2 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              ease: "linear",
              y: { duration: 0.2 }
            }}
          >
            <Spinner className="h-6 w-6" />
          </motion.div>) : (isActive && <motion.p
            className=" transition-all p-1.5 backdrop-blur shadow bg-white/60 rounded-full text-gray-600 absolute bottom-0"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: -2 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              ease: "linear",
              y: { duration: 0.2 }
            }}
          >
          </motion.p>)}
      </AnimatePresence>
    </motion.div>

  );
};

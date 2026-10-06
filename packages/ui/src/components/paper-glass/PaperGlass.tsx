import styles from "./styles.module.css";
import cn from "../../utils";
import { FC } from "react";

interface PaperGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const PaperGlass: FC<PaperGlassProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        styles['glass-panel'],
        "w-full min-w-[420px] rounded-3xl p-8 sm:p-10 text-center text-white",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default PaperGlass;

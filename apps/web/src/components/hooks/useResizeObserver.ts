import { useEffect, useRef, useState } from "react";

// const useResizeObserver = (draggableRef: any) => {
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [windowHeight, setWindowHeight] = useState(window.innerHeight);
//   const [elementHeight, setElementHeight] = useState(100); // Default height for the context menu
//   const [elementWidth, setElementWidth] = useState(0); // Default width for the context menu

//   //   const throttleWidth = useThrottle(elementWidth, 500);
//   //   const throttleHeight = useThrottle(elementHeight, 100);

//   //   console.log(throttleWidth, elementWidth);

//   useEffect(() => {
//     if (!draggableRef.current) {
//       return () => {};
//     }
//     let timer: NodeJS.Timeout | null = null;
//     const observe = new ResizeObserver((entries) => {
//       for (const entry of entries) {
//         if (entry.target === draggableRef.current) {
//           const { height, width } = entry.contentRect;
//           timer = setTimeout(() => {
//             setElementHeight(height);
//             setElementWidth(width);
//           }, 500);
//         }
//       }
//     });
//     observe.observe(draggableRef.current);
//     return () => {
//       if (timer) {
//         clearTimeout(timer);
//       }
//       observe.disconnect();
//     };
//   }, []);

//   return {
//     windowWidth,
//     windowHeight,
//     // elementHeight,
//     // elementWidth,
//     elementHeight,
//     elementWidth,
//     // observer
//   };
// };

function useResizeObserver(
  targetRef: React.RefObject<HTMLElement>,
  delay = 500
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }, delay);
    });

    observer.observe(node);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      observer.disconnect();
    };
  }, [targetRef, delay]);

  return { width, height };
}

export default useResizeObserver;

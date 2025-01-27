import { useEffect } from "react";

import { MutableRefObject } from "react";

export default function useOnClickOutside(
  ref: MutableRefObject<HTMLElement | null>,
  callback: (ref: MutableRefObject<HTMLElement | null>) => void
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(ref);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

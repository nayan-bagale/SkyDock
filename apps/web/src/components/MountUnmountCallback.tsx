import { useEffect } from "react";

const MountUnmountCallback = ({ onMount, onUnmount }: {
    onMount: () => void,
    onUnmount: () => void
}) => {
    useEffect(() => {
        onMount()
        return () => {
            onUnmount()
        }
    }, [])
    return null
}

export default MountUnmountCallback
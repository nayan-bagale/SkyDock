import { useEffect, useState } from "react"

const getDate = () => {
    const date = new Date().toString().split(" ").slice(0, 5);
    return `${date[0]} ${date[2]} ${date[1]} ${date[4].split(":").slice(0, 2).join(":")}`
}

export const useDate = () => {
    const [date, setDate] = useState<string>(getDate());

    useEffect(() => {
        const interval = setInterval(() => {
            setDate(getDate());
        }, 60000);
        return () => clearInterval(interval)
    },[])

  return date
}
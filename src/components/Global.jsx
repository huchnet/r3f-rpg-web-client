
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
export const cameraFixAtom = atom(null);
export const Global = () => {

    const [_cameraFix, setCameraFix] = useAtom(cameraFixAtom);
    useEffect(() => {
        setCameraFix(true)

    }, [])

}

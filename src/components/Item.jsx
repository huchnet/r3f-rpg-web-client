import { useGLTF } from "@react-three/drei";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useGrid } from '../hooks/useGrid'
import { userAtom, socket } from "./SocketManager";
import { useThree } from '@react-three/fiber'


export const Item = ({ item, ...props }) => {
    const [user] = useAtom(userAtom)
    const { name, gridPosition, size, rotation } = item;
    const mainScene = useThree((state) => state.scene)
    const { scene } = useGLTF(`/models/items/${name}.glb`);

    //const { scene } = useGLTF(`/models/items/Crypt.glb`);

    //const [onObject, setOnObject] = useState(false);
    const { vector3ToGrid3DV3, grid3DToVector3V3 } = useGrid();

    // Skinned meshes cannot be re-used in threejs without cloning them
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
    const height = rotation === 1 || rotation === 3 ? size[0] : size[1];


    const onSelect = (e) => {
        if (e.stopPropagation) {
            e.stopPropagation();   // W3C model
        } else {
            e.cancelBubble = true; // IE model
        }
        if (item.walkable) onCharacterMove(e)
    }

    const onCharacterMove = (e) => {
        const characterScene = mainScene.getObjectByName(`character-${user}`)
        if (!characterScene) return
        socket.emit("move3DPath", vector3ToGrid3DV3(characterScene.position), vector3ToGrid3DV3(e.point))
    }

    return (
        <primitive
            key={props.key}
            object={clone}
            onClick={onSelect}
            position={grid3DToVector3V3(gridPosition, width, height)}
            rotation-y={((rotation || 0) * Math.PI) / 2}
        />

    );
};

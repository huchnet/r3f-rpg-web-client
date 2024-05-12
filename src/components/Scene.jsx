import { Environment, OrbitControls, CameraControls } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from "@react-three/fiber";
import { Character } from './Character'
import { Item } from "./Item";
import { useAtom } from "jotai";
import { mapAtom, charactersAtom, userAtom } from "./SocketManager";
import { useGrid } from '../hooks/useGrid'
import { cameraFixAtom } from './Global'



export const Scene = () => {

    const [cameraFix, setCameraFix] = useAtom(cameraFixAtom);

    const { vector3ToGrid3DV3, grid3DToVector3V3 } = useGrid();
    const cameraControls = useRef();
    const [map] = useAtom(mapAtom);
    const [characters] = useAtom(charactersAtom);
    const [user] = useAtom(userAtom)
    const scene = useThree((state) => state.scene)
    const character = scene.getObjectByName(`character-${user}`);

    useFrame((_state, delta) => {


        if (character != undefined && cameraFix) {
            cameraControls.current.setPosition(
                character.position.x + 3,
                character.position.y + 4,
                character.position.z + 3,
                true
            );
        }



    })

    useEffect(() => {
        const character = scene.getObjectByName(`character-${user}`);
        if (character != undefined) {
            cameraControls.current.setPosition(
                character.position.x + 3,
                character.position.y + 4,
                character.position.z + 3,
                true
            );
        }
    }, [])


    return (
        <>

            <Environment preset="sunset" />
            <ambientLight intensity={0.3} />
            {/* <Floor /> */}
            < fog attach="fog" color="black" near={1} far={20} />
            <CameraControls
                infinityDolly={false}
                maxDistance={7}
                minDistance={7}
                maxPolarAngle={Math.PI / 4}
                minPolarAngle={Math.PI / 4}
                // minAzimuthAngle={Math.PI}
                // azimuthAngle={Math.PI * 4}
                ref={cameraControls}

                // disable all mouse buttons
                mouseButtons={{
                    left: 0,
                    middle: 0,
                    right: 1,
                    wheel: 0,
                }}
                // disable all touch gestures
                touches={{
                    one: 0,
                    two: 0,
                    three: 0,
                }}
            />

            {
                map?.items.map((item, idx) => (
                    <Item key={`${item.name}-${idx}`} item={item} />
                ))
            }

            {
                characters.map((character) => (

                    <Character
                        id={character.id}
                        charName={character.id.substring(0, 8)}
                        glbUrl="/models/Knight.glb"
                        key={`char-${character.id}`}
                        path={character.path}
                        position={grid3DToVector3V3(character.position)}
                    />

                ))
            }
            <OrbitControls enableZoom={true} ></OrbitControls>
        </>

    )
}

export default Scene
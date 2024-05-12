import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { SkeletonUtils } from "three-stdlib";

import { Vector3 } from "three";
import { useGrid } from '../hooks/useGrid'

const MOVEMENT_SPEED = 2;

const WEAPONS = [
    "1H_Sword",
    "2H_Sword",
    "1H_Sword_Offhand",
    "Spike_Shield",
    "Badge_Shield",
    "Round_Shield",
    "Rectangle_Shield"
];

export function Character({
    id,
    glbUrl = "/models/Knight.glb",
    weapon = "1H_Sword",
    ...props
}) {
    const { vector3ToGrid3DV3, grid3DToVector3V3 } = useGrid();
    const [path, setPath] = useState();
    const group = useRef();

    const position = useMemo(() => props.position, []);

    //console.log(position)


    const { scene, materials, animations } = useGLTF(glbUrl);
    // Skinned meshes cannot be re-used in threejs without cloning them
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    // useGraph creates two flat object collections for nodes and materials
    const { nodes } = useGraph(clone);
    const { actions } = useAnimations(animations, group);
    const [animation, setAnimation] = useState("Idle");

    useEffect(() => {
        // HIDING NON-SELECTED WEAPONS
        WEAPONS.forEach((wp) => {
            const isCurrentWeapon = wp === weapon;
            nodes[wp].visible = isCurrentWeapon;
            nodes["Knight_Cape"].visible = false;
            nodes["Knight_Helmet"].visible = false;
        })
    }, [nodes, clone]);
    useEffect(() => {
        actions[animation].reset().fadeIn(0.32).play();
        return () => actions[animation]?.fadeOut(0.32);
    }, [animation]);
    //Set the model preferences
    //This is just a conversion from grid to Vector

    useFrame((state, delta) => {

        if (path?.length && group.current.position.distanceTo(path[0]) > 0.1) {
            const direction = group.current.position
                .clone()
                .sub(path[0])
                .normalize()
                .multiplyScalar(MOVEMENT_SPEED * delta);
            group.current.position.sub(direction);
            group.current.lookAt(new Vector3(path[0].x, group.current.position.y, path[0].z));
            setAnimation("Walking_A");
        } else if (path?.length && path.length > 1) {
            group.current.position.z = path[0].z
            group.current.position.x = path[0].x
            group.current.position.y = path[0].y
            path.shift();
        } else {
            setAnimation("Idle");
        }
    });
    const onSelect = (e) => {
        //console.log("OnCharacterSelected")
        if (e.stopPropagation) {
            e.stopPropagation();   // W3C model
        } else {
            e.cancelBubble = true; // IE model
        }
        //Doing nothing yet
    }
    useEffect(() => {
        const vectorPath = [];
        props.path?.forEach((gridPosition, index) => {

            if (props.pathY?.length) {
                vectorPath.push(grid3DToVector3V3(gridPosition));
            } else {
                vectorPath.push(grid3DToVector3V3(gridPosition));
            }
        });
        //console.log(vectorPath)
        setPath(vectorPath);
    }, [props.path]);

    return (

        <group
            onClick={onSelect}
            ref={group}
            {...props}
            position={position}
            name={`character-${id}`}
            scale={[1 / 2, 1 / 2, 1 / 2]}
        >
            <Html position-y={2.5}>
                <div className="w-60 max-w-full">
                    <p className="absolute font-bold max-w-full text-center break-words -translate-y-full p-2 px-4 -translate-x-1/2 rounded-lg text-gray-500 whitespace-pre-line dark:text-gray-400">
                        {props.charName}
                    </p>
                </div>
            </Html>
            <group name="Scene">
                <group name="Rig">
                    <primitive object={nodes.root} />
                    <skinnedMesh name="Knight_ArmLeft" geometry={nodes.Knight_ArmLeft.geometry} material={materials.knight_texture} skeleton={nodes.Knight_ArmLeft.skeleton} />
                    <skinnedMesh name="Knight_ArmRight" geometry={nodes.Knight_ArmRight.geometry} material={materials.knight_texture} skeleton={nodes.Knight_ArmRight.skeleton} />
                    <skinnedMesh name="Knight_Body" geometry={nodes.Knight_Body.geometry} material={materials.knight_texture} skeleton={nodes.Knight_Body.skeleton} />
                    <skinnedMesh name="Knight_Head" geometry={nodes.Knight_Head.geometry} material={materials.knight_texture} skeleton={nodes.Knight_Head.skeleton} />
                    <skinnedMesh name="Knight_LegLeft" geometry={nodes.Knight_LegLeft.geometry} material={materials.knight_texture} skeleton={nodes.Knight_LegLeft.skeleton} />
                    <skinnedMesh name="Knight_LegRight" geometry={nodes.Knight_LegRight.geometry} material={materials.knight_texture} skeleton={nodes.Knight_LegRight.skeleton} />
                </group>
            </group>
        </group >

    );
}

useGLTF.preload('/models/Knight.glb')
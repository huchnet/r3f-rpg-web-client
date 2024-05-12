import { useAtom } from "jotai";
import { mapAtom } from "../components/SocketManager";
import * as THREE from "three";


export const useGrid = () => {

    const [map] = useAtom(mapAtom);

    const grid3DToVector3V3 = (gridPosition, width = 1, height = 1) => {

        return new THREE.Vector3(
            width / map.gridDivision / 2 + (gridPosition[0]) / map.gridDivision,
            map.initPosition[1] + (gridPosition[2]) / map.gridDivision,
            height / map.gridDivision / 2 + (gridPosition[1]) / map.gridDivision,
        )

    }
    const vector3ToGrid3DV3 = (vector3, x = 0, z = 0,) => {

        return [
            (Math.floor(vector3.x * map.gridDivision) + x) - map.initPosition[0] * map.gridDivision,
            (Math.floor(vector3.z * map.gridDivision) + z) - map.initPosition[2] * map.gridDivision,
            (Math.round(vector3.y * map.gridDivision))];
    };
    return {
        grid3DToVector3V3,
        vector3ToGrid3DV3
    }
}

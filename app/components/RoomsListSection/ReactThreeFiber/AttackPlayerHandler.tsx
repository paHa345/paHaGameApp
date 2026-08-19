import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { useThree } from "@react-three/fiber";
import { useRapier, vec3 } from "@react-three/rapier";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import * as rapier from "@dimforge/rapier3d-compat"; // или '@rapier3d', зависит от версии

const AttackPlayerHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const playerAttackStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerAttackStatus,
  );

  const player = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerBodyRef,
  );

  const { world } = useRapier();

  useEffect(() => {
    if (!player) return;
    if (playerAttackStatus) {
      const playerCenterBody = vec3(player.translation());
      const playerRotation = player.rotation();

      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(playerRotation);
      const ray = new rapier.Ray(playerCenterBody, direction);

      const hit = world.castRay(ray, 0.15, true);
      console.log(hit);

      setTimeout(() => {
        dispatch(ReactThreeFiberGameActions.setPlayerEndAttack());
      }, 500);
    }
  }, [playerAttackStatus]);

  return <></>;
};

export default AttackPlayerHandler;

import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { castRayFromUser } from "@/app/utils/castRay";
import { useRapier } from "@react-three/rapier";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const SetPlayerPickUpObjectStatus = () => {
  const dispatch = useDispatch<AppDispatch>();

  const player = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerBodyRef,
  );
  const { world } = useRapier();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!player) return;
      const playerPosition = player.translation();
      const playerRotation = player.rotation();

      const ray = castRayFromUser({
        playerPosition: { x: playerPosition.x, y: playerPosition.y, z: playerPosition.z },
        playerRotation: {
          x: playerRotation.x,
          y: playerRotation.y,
          z: playerRotation.z,
          w: playerRotation.w,
        },
        moveUpRay: 0.2,
        moveForwardRay: 0.4,
      });
      // Запускаем этот луч с установленной длинной
      const hit = world.castRay(ray, 1, true);
      if (hit === null) {
        dispatch(
          ReactThreeFiberGameActions.setPlayerPickUpStatus({
            barrelID: undefined,
            canPickUpStatus: false,
          }),
        );
        return;
      }
      if (hit !== null) {
        // Определяем в какой объект попал луч
        const collider = hit.collider;
        if (!collider) {
          dispatch(
            ReactThreeFiberGameActions.setPlayerPickUpStatus({
              barrelID: undefined,
              canPickUpStatus: false,
            }),
          );
          return;
        }
        const barrelData = collider.parent()?.userData as {
          id: string;
          type: string;
        };
        if (!barrelData) {
          dispatch(
            ReactThreeFiberGameActions.setPlayerPickUpStatus({
              barrelID: undefined,
              canPickUpStatus: false,
            }),
          );
          return;
        }
        if (barrelData.type === "barrel") {
          dispatch(
            ReactThreeFiberGameActions.setPlayerPickUpStatus({
              barrelID: barrelData.id,
              canPickUpStatus: true,
            }),
          );
        } else {
          dispatch(
            ReactThreeFiberGameActions.setPlayerPickUpStatus({
              barrelID: undefined,
              canPickUpStatus: false,
            }),
          );
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  return <></>;
};

export default SetPlayerPickUpObjectStatus;

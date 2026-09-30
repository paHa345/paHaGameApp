import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
  setStartBlockAction,
  stopPlayerThrowBarrelAndCalculateImpact,
  throwBarrelAction,
} from "@/app/store/ReactThreeFiberGameSlice";
import { useFrame } from "@react-three/fiber";
import { CollisionTarget, useRapier } from "@react-three/rapier";
import { Dispatch } from "@reduxjs/toolkit";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import { AppDispatch } from "@/app/store";

interface ICollisionHandler {
  target: CollisionTarget;
  other: CollisionTarget;
}

export const collisionHandler = (dispatch: AppDispatch) => {
  return ({ target, other }: ICollisionHandler) => {
    const targetData = target.rigidBody?.userData as {
      id: string;
      type: string;
    };

    const enemyObject = other.rigidBody?.userData as
      | {
          id: string;
          type: string;
        }
      | undefined;

    dispatch(
      stopPlayerThrowBarrelAndCalculateImpact({
        barrelID: targetData.id,
        enemyObjectData: {
          id: enemyObject?.id,
          type: enemyObject?.type,
        },
      }),
    );
  };
};

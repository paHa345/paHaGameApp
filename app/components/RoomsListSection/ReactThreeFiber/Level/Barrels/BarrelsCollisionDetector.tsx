import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { useFrame } from "@react-three/fiber";
import { CollisionTarget, useRapier } from "@react-three/rapier";
import { Dispatch } from "@reduxjs/toolkit";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

interface ICollisionHandler {
  target: CollisionTarget;
  other: CollisionTarget;
}

export const collisionHandler = (dispatch: Dispatch) => {
  return ({ target, other }: ICollisionHandler) => {
    const targetData = target.rigidBody?.userData as {
      id: string;
      type: string;
    };
    dispatch(ReactThreeFiberGameActions.stopPlayerThrowBarrel(targetData.id));
  };
};

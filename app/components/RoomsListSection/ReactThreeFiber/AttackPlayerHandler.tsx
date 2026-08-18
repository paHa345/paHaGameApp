import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AttackPlayerHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const playerAttackStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerAttackStatus,
  );

  useEffect(() => {
    if (playerAttackStatus) {
      setTimeout(() => {
        dispatch(ReactThreeFiberGameActions.setPlayerEndAttack());
      }, 500);
    }
  }, [playerAttackStatus]);

  return <></>;
};

export default AttackPlayerHandler;

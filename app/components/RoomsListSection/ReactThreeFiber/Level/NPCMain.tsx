import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AncientOrc from "../AncientOrcEnemy/AncientOrcEnemy";

const NPCMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const NPCArr = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.NPCArr,
  );

  const [orcs, setOrcs] = useState<any>(null);

  useEffect(() => {
    const orcs = NPCArr.map((enemyData) => {
      dispatch(
        ReactThreeFiberGameActions.setCurrentEnemyObjData({
          id: enemyData.name,
          rotationTimer: enemyData.rotationTimer,
          conditionPatternStatus: enemyData.conditionPatternStatus,
          animationName: enemyData.animation,
        }),
        dispatch(
          ReactThreeFiberGameActions.setNPCStat({
            id: enemyData.name,
            baseHP: 300,
            currentHP: 300,
          }),
        ),
      );

      return (
        <AncientOrc
          key={enemyData.name}
          position={enemyData.position}
          id={enemyData.name}
          rotationTimer={enemyData.rotationTimer}
        ></AncientOrc>
      );
    });
    setOrcs(orcs);
  }, [NPCArr]);

  return <>{orcs}</>;
};

export default NPCMain;

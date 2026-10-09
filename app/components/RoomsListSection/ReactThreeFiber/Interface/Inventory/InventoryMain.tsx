import { AppDispatch } from "@/app/store";
import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import { useKeyboardControls, useTexture } from "@react-three/drei";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InventoryMenuMain from "./InventoryMenuMain";

const InventoryMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const showInventory = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.showInventory,
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const unsubscribeThrowObject = subscribeKeys(
      (state) => {
        return state.showInventoryButton;
      },
      (value) => {
        if (value) {
          dispatch(ReactThreeFiberGameActions.setShowHideInventory(!showInventory));

          // showInventory ? console.log("HideInventory") : console.log("ShowInventory");
        }
      },
    );

    return () => {
      unsubscribeThrowObject();
    };
  }, [showInventory]);
  return <>{showInventory && <InventoryMenuMain isMobile={isMobile}></InventoryMenuMain>}</>;
};

export default InventoryMain;

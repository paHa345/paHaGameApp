import { AppDispatch } from "@/app/store";
import { useKeyboardControls } from "@react-three/drei";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const InventoryMain = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useEffect(() => {
    const unsubscribeThrowObject = subscribeKeys(
      (state) => {
        return state.showInventoryButton;
      },
      (value) => {
        if (value) {
          //   dispatch(throwBarrelAction());
          console.log("ShowInventory");
        }
      },
    );

    return () => {
      unsubscribeThrowObject();
    };
  }, []);
  return <></>;
};

export default InventoryMain;

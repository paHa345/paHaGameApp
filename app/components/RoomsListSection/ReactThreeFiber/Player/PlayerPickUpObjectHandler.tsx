import { AppDispatch } from "@/app/store";
import { ReactThreeFiberGameActions } from "@/app/store/ReactThreeFiberGameSlice";
import { useKeyboardControls } from "@react-three/drei";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const PlayerPickUpObjectHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useEffect(() => {
    const unsubscribeAction = subscribeKeys(
      (state) => {
        return state.actionButton;
      },
      (value) => {
        if (value) {
          console.log("Action button");
          dispatch(ReactThreeFiberGameActions.setPlayerPickedUpBarrelID());
        }
      },
    );

    return () => {
      unsubscribeAction();
    };
  }, []);

  return <></>;
};

export default PlayerPickUpObjectHandler;

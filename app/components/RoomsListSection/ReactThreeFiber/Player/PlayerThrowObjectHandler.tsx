import { AppDispatch } from "@/app/store";
import { ReactThreeFiberGameActions } from "@/app/store/ReactThreeFiberGameSlice";
import { useKeyboardControls } from "@react-three/drei";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const PlayerThrowObjectHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useEffect(() => {
    const unsubscribeThrowObject = subscribeKeys(
      (state) => {
        return state.throwObjectButton;
      },
      (value) => {
        if (value) {
          console.log("throw object button");
        }
      },
    );

    return () => {
      unsubscribeThrowObject();
    };
  }, []);

  return <></>;
};

export default PlayerThrowObjectHandler;

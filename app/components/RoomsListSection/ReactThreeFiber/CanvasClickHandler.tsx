import { AppDispatch } from "@/app/store";
import {
  getPointerCoords,
  IReactThreeFiberGameSlice,
  setStartAttackStatus,
  setStartBlockAction,
} from "@/app/store/ReactThreeFiberGameSlice";
import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CanvasClickHandler = () => {
  const { gl } = useThree();
  const dispatch = useDispatch<AppDispatch>();

  const showInventoryMenuStatus = useSelector(
    (state: IReactThreeFiberGameSlice) =>
      state.ReactThreeFiberGameState.showInventory,
  );

  useEffect(() => {
    const canvas = gl.domElement;

    const handleClick = async (e: MouseEvent) => {
      e.preventDefault();
      console.log("click");

      if (e.button === 0) {
        if (showInventoryMenuStatus) {
          console.log("Menu left click");
          //   const stack = document.elementsFromPoint(pointerCoords.x, pointerCoords.y).find((el) => {
          //   return el.classList.contains("equipmentContainer");
          // });
          // console.log(stack?.getAttribute("data-equipmenttype"));
          const result = await dispatch(getPointerCoords());
          console.log(result.payload);

          // const stack = document.elementsFromPoint(pointerCoords.x, pointerCoords.y).find((el) => {
          //   return el.classList.contains("equipmentContainer");
          // });
          // console.log(stack?.getAttribute("data-equipmenttype"));
        } else {
          dispatch(setStartAttackStatus({ page: 1, gameType: "werwer" }));
        }
      }
      if (e.button === 2) {
        if (showInventoryMenuStatus) {
          console.log("Menu right click");
        } else {
          dispatch(setStartBlockAction({ id: "player" }));
        }
      }
    };
    canvas.addEventListener("pointerdown", handleClick);

    // Обязательно снимаем слушатель при размонтировании
    return () => {
      canvas.removeEventListener("pointerdown", handleClick);
    };
  }, [gl, showInventoryMenuStatus]);
  return null;
};

export default CanvasClickHandler;

// import { AppDispatch } from "@/app/store";
// import {
//   IReactThreeFiberGameSlice,
//   setStartAttackStatus,
//   setStartBlockAction,
// } from "@/app/store/ReactThreeFiberGameSlice";
// import { useCallback, useRef } from "react";
// import type { PointerEvent } from "react";
// import { useDispatch, useSelector } from "react-redux";

// export function useCanvasClick() {
//   const dispatch = useDispatch<AppDispatch>();
//   const showInventoryMenuStatus = useSelector(
//     (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.showInventory,
//   );

//   const showInventoryRef = useRef(showInventoryMenuStatus);
//   showInventoryRef.current = showInventoryMenuStatus;

//   return useCallback(
//     (e: PointerEvent<HTMLDivElement>) => {
//       e.preventDefault();

//       if (e.button === 0) {
//         if (showInventoryRef.current) {
//           console.log("Menu right click");
//         } else {
//           dispatch(setStartAttackStatus({ page: 1, gameType: "werwer" }));
//         }
//       }
//       if (e.button === 2) {
//         dispatch(setStartBlockAction({ id: "player" }));
//       }
//     },
//     [dispatch],
//   );
// }

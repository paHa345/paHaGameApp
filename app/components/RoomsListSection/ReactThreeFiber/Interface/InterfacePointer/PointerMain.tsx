import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Pointer from "./Pointer";
import PointerDragContainer from "./PointerDragContainer";

const PointerMain = () => {
  const showInventory = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.showInventory,
  );
  const canvasHeight = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.canvasHeight,
  );
  const canvasWidht = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.canvasWidth,
  );

  const windowHeightWidth = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.windowHeightWidth,
  );

  const coordsRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (showInventory) {
        if (document.pointerLockElement && document) {
          const mouseVector = {
            x: (e.movementX / canvasHeight) * 2,
            y: (e.movementY / canvasWidht) * 2,
          };

          if (coordsRef.current.x + mouseVector.x * 100 > windowHeightWidth.width) {
            coordsRef.current.x = windowHeightWidth.width;
          } else {
            coordsRef.current.x =
              coordsRef.current.x + mouseVector.x * 100 < 0
                ? 0
                : coordsRef.current.x + mouseVector.x * 100;
          }
          if (coordsRef.current.y + mouseVector.y * 100 > windowHeightWidth.height) {
            coordsRef.current.y = windowHeightWidth.height;
          } else {
            coordsRef.current.y =
              coordsRef.current.y + mouseVector.y * 100 < 0
                ? 0
                : coordsRef.current.y + mouseVector.y * 100;
          }
          if (pointerRef.current) {
            pointerRef.current.style.transform = `translate3d(${coordsRef.current.x}px, ${coordsRef.current.y}px, 0)`;
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [showInventory]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (showInventory) {
  //       const stack = document.elementsFromPoint(pointerCoords.x, pointerCoords.y).find((el) => {
  //         return el.classList.contains("equipmentContainer");
  //       });
  //       console.log(stack?.getAttribute("data-equipmenttype"));
  //     }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [showInventory, pointerCoords]);

  return (
    <>
      {showInventory && (
        <div
          ref={pointerRef}
          // style={{ top: `${coordsRef.current.y}px`, left: `${coordsRef.current.x}px` }}
          className=" absolute "
        >
          <Pointer></Pointer>
          <PointerDragContainer></PointerDragContainer>
        </div>
      )}
    </>
  );
};

export default PointerMain;

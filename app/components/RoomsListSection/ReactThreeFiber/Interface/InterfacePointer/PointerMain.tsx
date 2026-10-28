import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pointer from "./Pointer";
import PointerDragContainer from "./PointerDragContainer";
import { AppDispatch } from "@/app/store";
import { inventoryItemTypes } from "@/app/types";

const PointerMain = () => {
  const dispatch = useDispatch<AppDispatch>();
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

  useEffect(() => {
    if (!window) return;

    const pointerdownHandler = (e: MouseEvent) => {
      if (!showInventory) return;
      e.preventDefault();
      console.log("Inventory click");
      const inventoryContainer = document
        .elementsFromPoint(coordsRef.current.x, coordsRef.current.y)
        .find((el) => {
          return el.classList.contains("inventoryContainer");
        });
      const equipmentContainer = document
        .elementsFromPoint(coordsRef.current.x, coordsRef.current.y)
        .find((el) => {
          return el.classList.contains("equipmentContainer");
        });

      if (inventoryContainer?.classList.contains("inventoryContainer")) {
        if (!inventoryContainer?.getAttribute("data-index")) return;
        dispatch(
          ReactThreeFiberGameActions.addInventoryItemToDragContainer({
            dragItemIndex: Number(inventoryContainer?.getAttribute("data-index")),
          }),
        );
      }

      if (equipmentContainer?.classList.contains("equipmentContainer")) {
        console.log("Equip right page down");
        dispatch(
          ReactThreeFiberGameActions.addEquipmentItemToDragContainer({
            equipmentItemType: equipmentContainer?.getAttribute(
              "data-equipmenttype",
            ) as inventoryItemTypes,
          }),
        );
        // addEquipmentItemToDragContainer
        // console.log(stack?.getAttribute("data-index"));
        // if (!stack?.getAttribute("data-index")) return;
        // dispatch(
        //   ReactThreeFiberGameActions.addInventoryItemToDragContainer({
        //     dragItemIndex: Number(stack?.getAttribute("data-index")),
        //   }),
        // );
      }

      // if(stack?.getAttribute("data-index")){
      //   dispatch(ReactThreeFiberGameActions.addInventoryItemToDragContainer(Number(stack?.getAttribute("data-index"))))
      // }
    };

    const pointerUpHandler = (e: MouseEvent) => {
      if (!showInventory) return;
      const pointerUpEquipmentElement = document
        .elementsFromPoint(coordsRef.current.x, coordsRef.current.y)
        .find((el) => {
          return el.classList.contains("equipmentContainer");
        });
      const inventoryContainer = document
        .elementsFromPoint(coordsRef.current.x, coordsRef.current.y)
        .find((el) => {
          return el.classList.contains("inventoryContainer");
        });
      console.log(inventoryContainer);
      if (inventoryContainer) {
        dispatch(ReactThreeFiberGameActions.addDragItemToInventory());
      }
      if (!pointerUpEquipmentElement?.getAttribute("data-equipmenttype")) {
        dispatch(ReactThreeFiberGameActions.clearDragItemContainer());
      }
      if (pointerUpEquipmentElement?.getAttribute("data-equipmenttype")) {
        dispatch(
          ReactThreeFiberGameActions.addDragItemToEquipment({
            addedEquipmentType: pointerUpEquipmentElement?.getAttribute(
              "data-equipmenttype",
            ) as inventoryItemTypes,
          }),
        );
      }
    };

    window.addEventListener("pointerdown", pointerdownHandler);
    window.addEventListener("pointerup", pointerUpHandler);
    return () => {
      window.removeEventListener("pointerdown", pointerdownHandler);
      window.removeEventListener("pointerup", pointerUpHandler);
    };
  }, [showInventory]);

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

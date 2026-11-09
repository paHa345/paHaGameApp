import {
  IReactThreeFiberGameSlice,
  ReactThreeFiberGameActions,
} from "@/app/store/ReactThreeFiberGameSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pointer from "./Pointer";
import PointerDragContainer from "./PointerDragContainer";
import { AppDispatch } from "@/app/store";
import { inventoryItemTypes } from "@/app/types";

const PointerMain = () => {
  // const [movePointerStatus, setMovePointerStatus] = useState(false);
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

  const pointerClickCoords = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.pointerClickCoords,
  );

  const movePointerStatus = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.movePointerStatus,
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

          if (
            pointerClickCoords.x !== 0 &&
            pointerClickCoords.y !== 0 &&
            (Math.abs(Math.abs(coordsRef.current.x) - Math.abs(pointerClickCoords.x)) > 20 ||
              Math.abs(Math.abs(coordsRef.current.y) - Math.abs(pointerClickCoords.y)) > 20)
          ) {
            if (!movePointerStatus) {
              // setMovePointerStatus(true);
              dispatch(ReactThreeFiberGameActions.setMovePointerStatus(true));
            }
          }

          if (pointerRef.current) {
            pointerRef.current.style.transform = `translate3d(${coordsRef.current.x}px, ${coordsRef.current.y}px, 0)`;
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [showInventory, pointerClickCoords]);

  useEffect(() => {
    if (!window) return;

    const pointerDownHandler = (e: MouseEvent) => {
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
          ReactThreeFiberGameActions.setPointerClickCoords({
            x: coordsRef.current.x,
            y: coordsRef.current.y,
          }),
        );
        dispatch(
          ReactThreeFiberGameActions.setSelectedItem({
            position: "inventory",
            index: Number(inventoryContainer?.getAttribute("data-index")),
          }),
        );
        dispatch(
          ReactThreeFiberGameActions.addInventoryItemToDragContainer({
            dragItemIndex: Number(inventoryContainer?.getAttribute("data-index")),
          }),
        );
      }

      if (equipmentContainer?.classList.contains("equipmentContainer")) {
        dispatch(
          ReactThreeFiberGameActions.setPointerClickCoords({
            x: coordsRef.current.x,
            y: coordsRef.current.y,
          }),
        );

        dispatch(
          ReactThreeFiberGameActions.setSelectedItem({
            position: "equipment",
            type: equipmentContainer?.getAttribute("data-equipmenttype") as inventoryItemTypes,
          }),
        );

        dispatch(
          ReactThreeFiberGameActions.addEquipmentItemToDragContainer({
            equipmentItemType: equipmentContainer?.getAttribute(
              "data-equipmenttype",
            ) as inventoryItemTypes,
          }),
        );
      }
    };

    const pointerUpHandler = (e: MouseEvent) => {
      // setMovePointerStatus(false);
      dispatch(ReactThreeFiberGameActions.setMovePointerStatus(false));

      dispatch(ReactThreeFiberGameActions.setPointerClickCoords({ x: 0, y: 0 }));
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
      if (inventoryContainer) {
        dispatch(ReactThreeFiberGameActions.addDragItemToInventory());
      }
      if (!pointerUpEquipmentElement?.getAttribute("data-equipmenttype")) {
        dispatch(ReactThreeFiberGameActions.clearDragItemContainer());
      }
      if (pointerUpEquipmentElement?.getAttribute("data-equipmenttype")) {
        dispatch(
          ReactThreeFiberGameActions.clearSelectedItem({
            action: "pointerUpButton",
            type: pointerUpEquipmentElement?.getAttribute(
              "data-equipmenttype",
            ) as inventoryItemTypes,
          }),
        );

        dispatch(
          ReactThreeFiberGameActions.addDragItemToEquipment({
            addedEquipmentType: pointerUpEquipmentElement?.getAttribute(
              "data-equipmenttype",
            ) as inventoryItemTypes,
          }),
        );

        // dispatch(
        //   ReactThreeFiberGameActions.setSelectedItem({
        //     position: "inventory",
        //     index: -1,
        //   }),
        // );
      }
    };

    const pointerClickHandler = (e: MouseEvent) => {
      e.preventDefault();
      const closeSelectedElMenuButton = document
        .elementsFromPoint(coordsRef.current.x, coordsRef.current.y)
        .find((el) => {
          return el.classList.contains("closeSelectedElMenu");
        });

      if (closeSelectedElMenuButton) {
        dispatch(ReactThreeFiberGameActions.clearSelectedItem({ action: "closeButton" }));
      }
    };

    window.addEventListener("click", pointerClickHandler);
    window.addEventListener("pointerdown", pointerDownHandler);
    window.addEventListener("pointerup", pointerUpHandler);
    return () => {
      window.removeEventListener("click", pointerClickHandler);
      window.removeEventListener("pointerdown", pointerDownHandler);
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
          {movePointerStatus && <PointerDragContainer></PointerDragContainer>}
        </div>
      )}
    </>
  );
};

export default PointerMain;

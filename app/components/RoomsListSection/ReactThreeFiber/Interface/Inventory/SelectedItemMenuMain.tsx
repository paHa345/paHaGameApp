import { IReactThreeFiberGameSlice } from "@/app/store/ReactThreeFiberGameSlice";
import { ReactThreeFiber } from "@react-three/fiber";
import React from "react";
import { useSelector } from "react-redux";

const SelectedItemMenuMain = () => {
  const selectedEl = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerItems.selectedItem,
  );

  const playerInventoryItems = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerItems.inventory,
  );

  const playerEquipmentItems = useSelector(
    (state: IReactThreeFiberGameSlice) => state.ReactThreeFiberGameState.playerItems.equipment,
  );

  return (
    <>
      {selectedEl.position === "inventory" && selectedEl.index !== -1 && (
        <div className=" w-[250px] h-[230px]  lg:w-[500px] lg:h-[412px] xl:w-[400px] xl:h-[400px] overflow-hidden absolute top-[40px] right-[348px] lg:top-[56px] lg:right-[505px] ">
          <div className=" closeSelectedElMenu h-[24px] w-[24px] top-[0px] right-[72px] lg:h-[34px] lg:w-[34px] lg:top-[5px] lg:right-[135px] absolute"></div>
          <img
            className=" absolute top-[-18px] left-[-35px] lg:top-[-25px] lg:left-[-73px]"
            src="/RPGUI/SelectedItemMenu.png"
            alt="selectedInventoryItemMenu"
          />
          <div className=" absolute top-[5%] left-[20px] w-[55%] ">
            <p className=" text-center text-slate-100 text-xs lg:text-xl ">
              {playerInventoryItems[selectedEl.index].name}
            </p>
          </div>
          {playerInventoryItems[selectedEl.index].damage && (
            <div className=" absolute top-[25%] left-[10%] w-[60%] ">
              <p className=" text-start text-slate-100 text-xs lg:text-xl ">
                Урон: +{playerInventoryItems[selectedEl.index].damage}
              </p>
            </div>
          )}
          {playerInventoryItems[selectedEl.index].defense && (
            <div className=" absolute top-[35%] left-[10%] w-[60%] ">
              <p className=" text-start text-slate-100 text-xs lg:text-xl ">
                Защита: +{playerInventoryItems[selectedEl.index].defense}
              </p>
            </div>
          )}
          <div className=" absolute top-[60%] left-[20px] w-[60%] ">
            <p className=" text-center text-slate-100 text-[10px] lg:text-[16px]  ">
              {playerInventoryItems[selectedEl.index].description}
            </p>
          </div>
        </div>
      )}
      {selectedEl.position === "equipment" && (
        <div className=" w-[250px] h-[230px]  lg:w-[500px] lg:h-[412px] xl:w-[400px] xl:h-[400px] overflow-hidden absolute top-[40px] right-[348px] lg:top-[56px] lg:right-[505px] ">
          <div className=" closeSelectedElMenu h-[24px] w-[24px] top-[0px] right-[72px] lg:h-[34px] lg:w-[34px] lg:top-[5px] lg:right-[135px] absolute"></div>
          <img
            className=" absolute top-[-18px] left-[-35px] lg:top-[-25px] lg:left-[-73px]"
            src="/RPGUI/SelectedItemMenu.png"
            alt="selectedInventoryItemMenu"
          />
          <div className=" absolute top-[5%] left-[20px] w-[55%] ">
            <p className=" text-center text-slate-100 text-xs lg:text-xl ">
              {playerEquipmentItems[selectedEl.type].name}
            </p>
          </div>
          {playerEquipmentItems[selectedEl.type].damage && (
            <div className=" absolute top-[25%] left-[10%] w-[60%] ">
              <p className=" text-start text-slate-100 text-xs lg:text-xl ">
                Урон: +{playerEquipmentItems[selectedEl.type].damage}
              </p>
            </div>
          )}
          {playerEquipmentItems[selectedEl.type].defense && (
            <div className=" absolute top-[35%] left-[10%] w-[60%] ">
              <p className=" text-start text-slate-100 text-xs lg:text-xl ">
                Защита: +{playerEquipmentItems[selectedEl.type].defense}
              </p>
            </div>
          )}
          <div className=" absolute top-[60%] left-[20px] w-[60%] ">
            <p className=" text-center text-slate-100 text-[10px] lg:text-[16px]  ">
              {playerEquipmentItems[selectedEl.type].description}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectedItemMenuMain;

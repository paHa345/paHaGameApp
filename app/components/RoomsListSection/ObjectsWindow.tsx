import { ICoopGamesSlice, UserMoveDirections } from "@/app/store/CoopGamesSlice";
import { coopGameSpritesData } from "@/app/types";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const ObjectsWindow = () => {
  const gameData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.squareCoordinates);
  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);
  const currentResolution = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.currentResolution
  );
  const frameObj = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.frameObj);
  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);
  const statObj = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.statObj);
  const attackDataObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.attackStatusObj
  );

  const currentMapSize = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.currentMapSize
  );
  const objectsCanvasRef = useRef(null) as any;

  const imgCompareObj = {
    orc3AttackImage: imgResources.orcImgAttackImg,
    orc3WalkImage: imgResources.orcImgWalkImg,
    orc3GetDamageImage: imgResources.orcImgGetDamageImg,
    orc3DeathImage: imgResources.orcImgDeathImg,
    gamerAttackImage: imgResources.userImgAttack,
    gamerWalkImage: imgResources.userImgWalk,
    gamerGetDamageImage: imgResources.userImgGetDamageImg,
    NPCHPImg: imgResources.NPCHPImg,
    rocksAndStones: imgResources.rocksAndStones,
    prepareAttackArea: imgResources.prepareAttackArea,
    roadTile: imgResources.roadTile,
    trees: imgResources.trees,
    exterior: imgResources.exterior,
    characterPannel: imgResources.characterPannel,
    levelUserWindow: imgResources.levelUserWindow,
    equipment: imgResources.equipment,
    userActionButtons: imgResources.userActionButtons,
  };

  useEffect(() => {
    if (!socket?.id) return;
    if (!gameData) return;
    if (gameData && gameData[socket.id]) {
      var ctx = objectsCanvasRef.current.getContext("2d");
      ctx.clearRect(
        gameData[socket.id].square.currentCoord.topLeft.x - currentResolution.height,
        gameData[socket.id].square.currentCoord.topLeft.y - 200,
        currentResolution.height * 2,
        currentResolution.width + 200
      );
      for (let userData in gameData) {
        if (!frameObj.objects[userData]) return;

        let NPCViewDirection;
        const setObjectViewDirection = () => {
          if (!gameData[userData].NPCViewDirection) {
            return;
          }
          if (
            gameData[userData].NPCViewDirection === UserMoveDirections.up ||
            gameData[userData].NPCViewDirection === UserMoveDirections.stop
          ) {
            NPCViewDirection = coopGameSpritesData[gameData[userData].objectType].up;
          }
          if (gameData[userData].NPCViewDirection === UserMoveDirections.down) {
            NPCViewDirection = coopGameSpritesData[gameData[userData].objectType].down;
          }
          if (gameData[userData].NPCViewDirection === UserMoveDirections.left) {
            NPCViewDirection = coopGameSpritesData[gameData[userData].objectType].left;
          }
          if (gameData[userData].NPCViewDirection === UserMoveDirections.right) {
            NPCViewDirection = coopGameSpritesData[gameData[userData].objectType].right;
          }
        };

        setObjectViewDirection();

        if (
          gameData[userData].moveDirection === UserMoveDirections.stop ||
          gameData[userData].moveDirection === UserMoveDirections.up
        ) {
          ctx.drawImage(
            imgCompareObj[gameData[userData].imgName],
            frameObj.objects[userData].idFrame === 0
              ? 12
              : frameObj.objects[userData].idFrame * 64 + 12,
            NPCViewDirection
              ? NPCViewDirection
              : coopGameSpritesData[gameData[userData].objectType].up,
            48,
            48,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            48,
            48
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.left) {
          ctx.drawImage(
            imgCompareObj[gameData[userData].imgName],
            frameObj.objects[userData].idFrame === 0
              ? 12
              : frameObj.objects[userData].idFrame * 64 + 12,
            NPCViewDirection
              ? NPCViewDirection
              : coopGameSpritesData[gameData[userData].objectType].left,
            48,
            48,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            48,
            48
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.right) {
          ctx.drawImage(
            imgCompareObj[gameData[userData].imgName],
            frameObj.objects[userData].idFrame === 0
              ? 12
              : frameObj.objects[userData].idFrame * 64 + 12,
            NPCViewDirection
              ? NPCViewDirection
              : coopGameSpritesData[gameData[userData].objectType].right,
            48,
            48,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            48,
            48
          );
        }
        if (gameData[userData].moveDirection === UserMoveDirections.down) {
          ctx.drawImage(
            imgCompareObj[gameData[userData].imgName],
            frameObj.objects[userData].idFrame === 0
              ? 12
              : frameObj.objects[userData].idFrame * 64 + 12,
            NPCViewDirection
              ? NPCViewDirection
              : coopGameSpritesData[gameData[userData].objectType].down,
            48,
            48,
            gameData[userData].square.currentCoord.topLeft.x,
            gameData[userData].square.currentCoord.topLeft.y,
            48,
            48
          );
        }
        if (gameData[userData].type === "NPC") {
          if (!statObj.NPC[userData]) return;
          ctx.globalAlpha = 0.5;

          if (statObj.NPC[userData].percentHP < 25) {
            ctx.drawImage(
              imgResources.NPCHPImg,
              155,
              5,
              50,
              50,
              gameData[userData].square.currentCoord.topLeft.x,
              gameData[userData].square.currentCoord.topLeft.y,
              24,
              24
            );
          } else if (statObj.NPC[userData].percentHP < 50) {
            ctx.drawImage(
              imgResources.NPCHPImg,
              105,
              5,
              50,
              50,
              gameData[userData].square.currentCoord.topLeft.x,
              gameData[userData].square.currentCoord.topLeft.y,
              24,
              24
            );
          } else if (statObj.NPC[userData].percentHP < 75) {
            ctx.drawImage(
              imgResources.NPCHPImg,
              55,
              5,
              50,
              50,
              gameData[userData].square.currentCoord.topLeft.x,
              gameData[userData].square.currentCoord.topLeft.y,
              24,
              24
            );
          } else if (statObj.NPC[userData].percentHP <= 100) {
            ctx.drawImage(
              imgResources.NPCHPImg,
              5,
              5,
              50,
              50,
              gameData[userData].square.currentCoord.topLeft.x,
              gameData[userData].square.currentCoord.topLeft.y,
              24,
              24
            );
          }
          ctx.globalAlpha = 1;
        }
      }
    }
  }, [gameData, frameObj, attackDataObj]);

  return (
    <div className=" absolute">
      <canvas
        className=" absolute top-px z-20"
        id="canvas"
        width={currentMapSize * 8}
        height={currentMapSize * 8}
        ref={objectsCanvasRef}
      ></canvas>
    </div>
  );
};

export default ObjectsWindow;

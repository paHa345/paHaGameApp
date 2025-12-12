import { AppDispatch } from "@/app/store";
import { CoopGamesActions, ICoopGamesSlice, UserMoveDirections } from "@/app/store/CoopGamesSlice";
import { coopGameSpritesData, ImageNames } from "@/app/types";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RoomGameField = () => {
  const objectsCanvasRef = useRef(null) as any;
  const dispatch = useDispatch<AppDispatch>();
  const backgroundCanvasRef = useRef(null) as any;
  const UserStatCanvasRef = useRef(null) as any;
  const NPCUnderAttackAreaCAnvasRef = useRef(null) as any;
  const treesCanvasRef = useRef(null) as any;

  const socket = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.socket);

  const currentMapSize = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.currentMapSize
  );
  const imgResources = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.imgResources);

  const attackDataObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.attackStatusObj
  );

  const statObj = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.statObj);
  const frameObj = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.frameObj);
  const gameData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.squareCoordinates);
  const gameFieldData = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.gameFieldData);

  const basePosition = useSelector((state: ICoopGamesSlice) => state.CoopGamesState.basePosition);

  const NPCUnderAttackChanksObj = useSelector(
    (state: ICoopGamesSlice) => state.CoopGamesState.NPCUnderAttackChanksObj
  );
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
  };
  useEffect(() => {
    let time: number;
    let timerID: any;

    function step(timestamp: number) {
      if (!time) {
        time = timestamp;
      }

      if (timestamp - time > 150) {
        time = timestamp;
        dispatch(CoopGamesActions.increaseFrameNumber());
      }
      timerID = requestAnimationFrame(step);
    }

    timerID = requestAnimationFrame(step);
    return () => cancelAnimationFrame(timerID);
  }, []);

  useEffect(() => {
    var treesCanvasContext = treesCanvasRef.current.getContext("2d");

    for (const i in gameFieldData) {
      for (const j in gameFieldData[i]) {
        if (!Object.hasOwn(gameFieldData[i], j)) continue;

        if (gameFieldData[i][j].textureObj && gameFieldData[i][j].type === "tree") {
          treesCanvasContext.drawImage(
            imgCompareObj[gameFieldData[i][j].textureObj.imageName],

            gameFieldData[i][j].textureObj.XSpriteCoord,
            gameFieldData[i][j].textureObj.YSpriteCoord,
            gameFieldData[i][j].textureObj.sourceX,
            gameFieldData[i][j].textureObj.sourceY,
            Number(j) * 8,
            Number(i) * 8,
            gameFieldData[i][j].textureObj.heigthChanks
              ? gameFieldData[i][j].textureObj.heigthChanks * 8
              : 32,
            gameFieldData[i][j].textureObj.widthChanks
              ? gameFieldData[i][j].textureObj.widthChanks * 8
              : 32
          );
        }
        if (gameFieldData[i][j].textureObj && gameFieldData[i][j].type === "playersHouse") {
          treesCanvasContext.drawImage(
            imgCompareObj[gameFieldData[i][j].textureObj.imageName],

            gameFieldData[i][j].textureObj.XSpriteCoord,
            gameFieldData[i][j].textureObj.YSpriteCoord,
            gameFieldData[i][j].textureObj.sourceX,
            gameFieldData[i][j].textureObj.sourceY,
            Number(j) * 8,
            Number(i) * 8,
            gameFieldData[i][j].textureObj.heigthChanks
              ? gameFieldData[i][j].textureObj.heigthChanks * 8
              : 32,
            gameFieldData[i][j].textureObj.widthChanks
              ? gameFieldData[i][j].textureObj.widthChanks * 8
              : 32
          );
        }
      }
    }
  }, [gameFieldData, currentMapSize]);

  useEffect(() => {
    if (!socket?.id) return;
    if (!gameData) return;
    if (gameData && gameData[socket.id]) {
      var ctx = objectsCanvasRef.current.getContext("2d");
      ctx.clearRect(
        gameData[socket.id].square.currentCoord.topLeft.x - 350,
        gameData[socket.id].square.currentCoord.topLeft.y - 200,
        650,
        650
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

  useEffect(() => {
    var underAttackAreaCtx = NPCUnderAttackAreaCAnvasRef.current.getContext("2d");

    underAttackAreaCtx.clearRect(0, 0, currentMapSize * 8, currentMapSize * 8);

    for (const NPCID in NPCUnderAttackChanksObj) {
      underAttackAreaCtx.globalAlpha = 0.9;
      // underAttackAreaCtx.fillStyle = "red";
      underAttackAreaCtx.drawImage(
        imgResources.prepareAttackArea,
        250 * frameObj.mainFrame,
        0,
        250,
        300,
        NPCUnderAttackChanksObj[NPCID].underAttackArea.baseChankX * 8,
        NPCUnderAttackChanksObj[NPCID].underAttackArea.baseChankY * 8,
        NPCUnderAttackChanksObj[NPCID].underAttackArea.widthChanksNum * 8,
        NPCUnderAttackChanksObj[NPCID].underAttackArea.heightChanksNum * 8
      );
    }
  }, [NPCUnderAttackChanksObj, frameObj]);

  useEffect(() => {
    var ctx2 = backgroundCanvasRef.current.getContext("2d");
    // backgroundCanvasRef.current.requestFullscreen();

    if (imgResources.grassTextureImg) {
      const pattern = ctx2.createPattern(imgResources.grassTextureImg, "repeat");
      ctx2.fillStyle = pattern;
      ctx2.fillRect(0, 0, currentMapSize * 8, currentMapSize * 8);
    }

    for (const i in gameFieldData) {
      for (const j in gameFieldData[i]) {
        if (!Object.hasOwn(gameFieldData[i], j)) continue;

        if (gameFieldData[i][j].textureObj) {
          ctx2.drawImage(
            imgCompareObj[gameFieldData[i][j].textureObj.imageName],

            gameFieldData[i][j].textureObj.XSpriteCoord,
            gameFieldData[i][j].textureObj.YSpriteCoord,
            gameFieldData[i][j].textureObj.sourceX,
            gameFieldData[i][j].textureObj.sourceY,
            Number(j) * 8,
            Number(i) * 8,
            gameFieldData[i][j].textureObj.heigthChanks
              ? gameFieldData[i][j].textureObj.heigthChanks * 8
              : 32,
            gameFieldData[i][j].textureObj.widthChanks
              ? gameFieldData[i][j].textureObj.widthChanks * 8
              : 32
          );
        }

        // if (Number(i) === 16 && Number(j) === 10) {
        //   ctx2.fillStyle = "red";
        //   ctx2.fillRect(Number(j) * 8, Number(i) * 8, 8, 8);
        // }
        // if (Number(i) === 10 && Number(j) === 10) {
        //   ctx2.fillStyle = "red";
        //   ctx2.fillRect(Number(j) * 8, Number(i) * 8, 8, 8);
        // }
        // if (Number(i) === 10 && Number(j) === 14) {
        //   ctx2.fillStyle = "red";
        //   ctx2.fillRect(Number(j) * 8, Number(i) * 8, 8, 8);
        // }

        if (gameFieldData[i][j].objectDataChank.isObjectChank) {
          ctx2.globalAlpha = 0.4;
          ctx2.fillRect(Number(j) * 8, Number(i) * 8, 8, 8);

          ctx2.globalAlpha = 1;
        }

        if (gameFieldData[i][j].chankUnderAttack) {
          ctx2.globalAlpha = 0.4;
          ctx2.fillStyle = "red";
          ctx2.fillRect(Number(j) * 8, Number(i) * 8, 8, 8);

          ctx2.globalAlpha = 1;
        }
      }
    }

    var ctxUserStata = UserStatCanvasRef.current.getContext("2d");
    ctxUserStata.clearRect(0, 0, 300, 50);

    ctxUserStata.globalAlpha = 0.1;
    ctxUserStata.fillStyle = "e3dae0";
    ctxUserStata.fillRect(0, 0, 300, 50);

    ctxUserStata.globalAlpha = 1;

    if (imgResources.userStatsIcon) {
      ctxUserStata.drawImage(imgResources.userStatsIcon, 10, 10, 90, 90, 10, 5, 20, 20);
      ctxUserStata.drawImage(imgResources.userStatsIcon, 150, 10, 90, 90, 58, 5, 20, 20);
      ctxUserStata.drawImage(imgResources.userStatsIcon, 300, 10, 90, 90, 30, 28, 20, 20);
      ctxUserStata.drawImage(imgResources.userStatsIcon, 450, 10, 90, 90, 120, 5, 40, 40);
    }
  }, [gameFieldData, currentMapSize]);

  useEffect(() => {
    const questionStatusContainer = document.querySelector(".gameContainer");
    if (!gameData) return;
    if (!socket?.id) return;
    if (!gameData[socket.id]) return;

    questionStatusContainer?.scrollTo({
      left: gameData[socket.id].square.currentCoord.topLeft.x - 150,
      top: gameData[socket.id].square.currentCoord.topLeft.y - 150,
    });
  }, [gameData, basePosition]);

  useEffect(() => {
    console.log(statObj);
  }, [statObj]);

  return (
    <div>
      <div className=" relative ">
        <canvas id="canvas" width={300} height={350}></canvas>
        <div className=" gameContainer absolute top-px  h-80 w-80 overflow-hidden   ">
          <canvas
            className=" absolute z-30 top-px"
            ref={treesCanvasRef}
            width={currentMapSize * 8}
            height={currentMapSize * 8}
          ></canvas>
          <canvas
            className=" absolute top-px z-20"
            id="canvas"
            width={currentMapSize * 8}
            height={currentMapSize * 8}
            ref={objectsCanvasRef}
          ></canvas>
          <canvas
            className=" absolute top-px z-20"
            id="canvas"
            width={currentMapSize * 8}
            height={currentMapSize * 8}
            ref={NPCUnderAttackAreaCAnvasRef}
          ></canvas>
          <canvas
            className=" absolute z-10 top-px"
            ref={backgroundCanvasRef}
            width={currentMapSize * 8}
            height={currentMapSize * 8}
          ></canvas>
        </div>
        <canvas
          className=" absolute z-10 bottom-0"
          ref={UserStatCanvasRef}
          width={300}
          height={50}
        ></canvas>
        {socket?.id !== undefined && statObj.gamers[socket.id] && (
          <div className=" relative">
            <div className=" absolute z-10 bottom-8 left-9">
              <p className=" font-light text-center">
                {socket?.id !== undefined ? Number(statObj.gamers[socket.id].currentHP) : 10}
              </p>
            </div>
            <div className=" absolute z-10 bottom-8 left-24">
              <p className=" font-light text-center">
                {socket?.id !== undefined ? Number(statObj.gamers[socket.id].currentArmour) : 10}
              </p>
            </div>
            <div className=" absolute z-10 bottom-1 left-16 ">
              <p className=" font-light text-center">
                {socket?.id !== undefined ? Number(statObj.gamers[socket.id].currentDamage) : 10}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomGameField;

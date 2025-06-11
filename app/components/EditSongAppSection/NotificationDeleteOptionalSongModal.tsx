import React from "react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { EditSongAppStateActions, IEditSongAppSlice } from "@/app/store/EditSongAppSlice";

interface INotificationDeleteOptionalSongProps {
  value: number;
}

const NotificationDeleteOptionalSongModal = ({ value }: INotificationDeleteOptionalSongProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const showDeleteOptionalSongNotificationModal = useSelector(
    (state: IEditSongAppSlice) => state.EditSongAppState.showDeleteOptionalSongNotificationModal
  );

  // console.log(status);

  const hideDeleteSongNotificationHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(EditSongAppStateActions.setShowDeleteOptionalSongNotificationModal(false));
  };

  const dleteOptionalSongHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(EditSongAppStateActions.deleteOptionalSong(value));
    dispatch(EditSongAppStateActions.setShowDeleteOptionalSongNotificationModal(false));
  };

  const backdropVariant = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        delayChildren: 0.3,
      },
    },
  };

  const modalVariant = {
    hidden: {
      y: "-100vh",
    },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
      },
    },
  };
  return (
    <AnimatePresence>
      {showDeleteOptionalSongNotificationModal && (
        <motion.div
          //   onClick={hideLoadCrosswordGameModalHandler}
          className=" modal-overlay "
          variants={backdropVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col bg-modalMainColor rounded-lg"
            variants={modalVariant}
            // initial="hidden"
            // animate="visible"
            // exit="exit"
          >
            <div className=" w-full modal-header flex flex-col sm:flex-row justify-cennter items-center gap-3">
              <div
                onClick={dleteOptionalSongHandler}
                className=" buttonStandart cursor-pointer w-full flex justify-center items-center "
              >
                <div>
                  <h1 className=" font-light text-2xl text-center grow pl-1 py-2 px-2 my-2">
                    Удалить песню
                  </h1>
                </div>
              </div>

              <div
                className="  cursor-pointer w-full flex flex-row justify-center items-center h-full rounded-md bg-red-300 hover:bg-red-400"
                onClick={hideDeleteSongNotificationHandler}
              >
                <div className=" sm:px-3 flex flex-row justify-center items-center">
                  <div className=" flex justify-center items-center">
                    <FontAwesomeIcon className="fa-fw fa-2x" icon={faClose} />
                  </div>
                  <h1 className=" text-2xl text-center grow font-bold pl-1 py-2 my-2 ">Назад</h1>
                </div>
              </div>
            </div>

            {/* <div className=" w-full rounded-lg my-3 flex flex-col justify-center items-center">
                  <div className=" w-full flex flex-col justify-center items-center">
                    <div className="   w-full  flex  justify-around items-center"></div>
                  </div>
                </div> */}
          </motion.div>{" "}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDeleteOptionalSongModal;

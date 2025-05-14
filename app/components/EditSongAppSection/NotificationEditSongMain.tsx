import React from "react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";

interface INotificationProps {
  showNotificationModal: boolean;
}
const NotificationEditSongMain = ({ showNotificationModal }: INotificationProps) => {
  const backdropVariant = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
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
      {showNotificationModal && (
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
            className=" w-11/12 h-5/6 flex flex-col bg-modalMainColor rounded-lg"
            variants={modalVariant}
            // initial="hidden"
            // animate="visible"
            // exit="exit"
          >
            <div className="modal-header flex justify-start items-center w-full ">
              <div className=" w-full flex justify-around items-center">
                <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
              </div>
            </div>

            <div className=" w-full rounded-lg my-3 flex flex-col justify-center items-center">
              <div className=" w-full flex flex-col justify-center items-center">
                <div className="   w-full  flex  justify-around items-center"></div>
              </div>
            </div>
          </motion.div>{" "}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationEditSongMain;

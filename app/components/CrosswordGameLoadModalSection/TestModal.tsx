import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

const backdropVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      delayChildren: 0.2,
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

const Modal: FC<Props> = ({ isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          variants={backdropVariant}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div className="modal-container" variants={modalVariant}>
            <h1>Modal Header</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro reprehenderit dolores
              iure facilis libero repellendus pariatur, totam voluptate magnam dolorem assumenda
              soluta. Repellendus praesentium, ducimus corporis ab odio dignissimos quam?
            </p>
            <motion.div className="close" onClick={() => setIsOpen(false)}>
              <div></div>
              <div>X</div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { ICrosswordSlice } from "../store/crosswordSlice";
import ReduxProvider from "../ReduxProvider";

const Footer = () => {
  const currentCrosswordSize = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.crosswordSize
  );
  return (
    <ReduxProvider>
      <footer
        style={{
          minWidth: `${currentCrosswordSize > 10 ? `${currentCrosswordSize * 45}px` : `${5 * 45}px`}`,
        }}
        className={` bg-gradient-to-tl from-lime-50 to-headerFooterSecoundaryColor min-w-[${currentCrosswordSize * 45}px]`}
      >
        <div className=" footerMainContainer">
          <div className=" flex justify-center items-center">
            <Link className=" h-12" href="/">
              <div className=" h-12 w-24 mx-auto my-auto">
                <Image
                  className=" w-full h-full"
                  src="/logo.jpg"
                  alt="mainLogo"
                  height={100}
                  width={100}
                  // layout="respomsive"
                ></Image>
              </div>
            </Link>
          </div>

          <div className=" footerLinksContainer">
            {/* <Link href="/" className=" footerLinks">
              Войти в личный кабинет
            </Link>
            <Link href="/" className=" footerLinks">
              Каталог
            </Link>
            <Link href="/" className=" footerLinks">
              Написать письмо
            </Link> */}
          </div>
        </div>
      </footer>
    </ReduxProvider>
  );
};

export default Footer;

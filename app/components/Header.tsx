import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faIdCard,
  faDumbbell,
  faUserPlus,
  faPuzzlePiece,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
// import HeaderSerchButton from "./SearchSection/HeaderSerchButton";
import { useDispatch, useSelector } from "react-redux";
import ReduxProvider from "../ReduxProvider";
import { ICrosswordSlice } from "../store/crosswordSlice";
import { usePathname } from "next/navigation";

// import CountRequestsAddToCoach from "./HeaderSection/CountRequestsAddToCoach";

function HeaderSearchButtonFallback() {
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
}

const Header = () => {
  const currentCrosswordSize = useSelector(
    (state: ICrosswordSlice) => state.crosswordState.crosswordSize
  );
  const session = useSession();

  const path = usePathname();

  return (
    <ReduxProvider>
      <header
        style={{
          minWidth: `${currentCrosswordSize >= 10 ? `${currentCrosswordSize * 45}px` : `${5 * 45}px`}`,
        }}
        // className={`bg-gradient-to-br from-headerFooterMainColor to-lime-50`}
      >
        {/* <div className=" min-h-20"></div> */}
        <Link rel="icon" href="./../favicon.ico"></Link>
        <nav className=" pl-10 sm:pl-0 border-t-2 border-solid border-lime-100 sm:border-0  rounded-t-3xl sm:rounded-none py-3 sm:py-1 pt-20 ml-0 bg-gradient-to-tr from-headerFooterMainColor to-lime-50 w-full sticky bottom-0 sm:relative flex flex-row items-center justify-start sm:justify-center mx-6 gap-5">
          <Link className=" hidden sm:block mt-2 mb-2 h-12 mr-12" href="/">
            <div className=" hidden sm:block h-12 w-24 ">
              <Image
                className=" w-full h-full"
                src="/logo.jpg"
                alt="mainLogo"
                height={50}
                width={100}
                // layout="responsive"
              ></Image>
            </div>
          </Link>
          <Suspense fallback={<HeaderSearchButtonFallback></HeaderSearchButtonFallback>}>
            {/* <HeaderSerchButton></HeaderSerchButton> */}
          </Suspense>
          <div></div>
          <div className="pr-0 flex justify-start md:pr-10 md:justify-end gap-10 sm:gap-10 basis-1/2">
            {/* {session.data?.user.userType === "coach" && (
              <div className=" relative">
                <div className="absolute top-0 right-0">
                  <CountRequestsAddToCoach></CountRequestsAddToCoach>
                </div>

                <Link
                  href="/requstsAddToCoach"
                  className=" text-2xl text-headerButtonColor hover:text-headerButtonHoverColor transition duration-800 ease-out "
                >
                  {" "}
                  <FontAwesomeIcon icon={faUserPlus} />
                  <p className=" text-xs">Requests</p>
                </Link>
              </div>
            )} */}
            <div className=" flex justify-center items-center flex-col">
              {" "}
              <Link
                href="/game"
                className="  hover:text-slate-500 text-2xl text-headerButtonColor transition duration-800 ease-out "
              >
                {" "}
                <FontAwesomeIcon
                  className={` ${path === "/game" || path === "/crosswordGame" || path === "/crosswordGame/game" ? "text-slate-500 scale-125" : ""} transition-all hover:text-slate-500 hover:scale-110 duration-500 fa-2x`}
                  icon={faPuzzlePiece}
                />
                <p
                  className={` ${path === "/game" || path === "/crosswordGame" || path === "/crosswordGame/game" ? " hidden" : ""} text-center text-sm font-semibold`}
                >
                  Игры
                </p>
              </Link>
            </div>
            <div className="">
              {" "}
              <Link
                href="/results"
                className=" hover:text-slate-500 text-2xl text-headerButtonColor transition duration-800 ease-out "
              >
                {" "}
                <FontAwesomeIcon
                  className={` ${path === "/results" ? "text-slate-500 scale-125" : ""} transition-all hover:scale-110 hover:text-slate-500 duration-500 fa-2x`}
                  icon={faGraduationCap}
                />
                <p
                  className={`  ${path === "/results" ? "hidden" : ""} text-center text-sm font-semibold`}
                >
                  Лидеры
                </p>
              </Link>
            </div>
            {session.data && (
              <div>
                <Link
                  href="/my"
                  className="  hover:text-slate-500 text-2xl text-headerButtonColor transition duration-800 ease-out "
                >
                  <FontAwesomeIcon
                    className={` ${path === "/login" || path === "/my" ? "text-slate-500 scale-125" : ""} transition-all hover:scale-110 hover:text-slate-500 duration-500 fa-2x`}
                    icon={faIdCard}
                  />
                  <p
                    className={`  ${path === "/login" || path === "/my" ? "hidden" : ""} text-center text-sm font-semibold`}
                  >
                    ЛК
                  </p>{" "}
                </Link>
              </div>
            )}

            {!session.data && (
              <div>
                {" "}
                <Link
                  href="/login"
                  className="  hover:text-slate-500 text-2xl text-headerButtonColor transition duration-800 ease-out "
                >
                  <FontAwesomeIcon
                    className={` ${path === "/login" || path === "/my" ? "text-slate-500 scale-125" : ""} transition-all hover:scale-110 hover:text-slate-500 duration-500 fa-2x`}
                    icon={faUser}
                  />
                  <p
                    className={`  ${path === "/login" || path === "/my" ? "hidden" : ""} text-center text-sm font-semibold`}
                  >
                    ЛК
                  </p>{" "}
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>
    </ReduxProvider>
  );
};

export default Header;

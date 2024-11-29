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
          minWidth: `${currentCrosswordSize > 10 ? `${currentCrosswordSize * 45}px` : `${5 * 45}px`}`,
        }}
        className={`bg-gradient-to-tr from-headerFooterMainColor to-lime-50`}
      >
        <Link rel="icon" href="./../favicon.ico"></Link>
        <nav className=" relative flex flex-row items-center justify-center mx-6 gap-5">
          <Link className=" mt-2 mb-2 h-12 mr-12" href="/">
            <div className=" h-12 w-24 ">
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
          <div className="pr-0 flex justify-start md:pr-10 md:justify-end gap-3 sm:gap-10 basis-1/2">
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
            <div className="">
              {" "}
              <Link
                href="/game"
                className=" text-2xl text-headerButtonColor hover:text-headerButtonHoverColor transition duration-800 ease-out "
              >
                {" "}
                <FontAwesomeIcon
                  className={` ${path === "/game" || path === "/crosswordGame" || path === "/crosswordGame/game" ? "text-slate-500" : ""} transition-all hover:text-slate-500 duration-500 fa-2x`}
                  icon={faPuzzlePiece}
                />
                {/* <p className=" text-xs">Game</p> */}
              </Link>
            </div>
            <div className="">
              {" "}
              <Link
                href="/results"
                className=" text-2xl text-headerButtonColor hover:text-headerButtonHoverColor transition duration-800 ease-out "
              >
                {" "}
                <FontAwesomeIcon
                  className={` ${path === "/results" ? "text-slate-500" : ""} transition-all hover:text-slate-500 duration-500 fa-2x`}
                  icon={faGraduationCap}
                />
                {/* <p className=" text-xs">Game</p> */}
              </Link>
            </div>
            {session.data && (
              <div>
                <Link
                  href="/my"
                  className=" text-2xl text-headerButtonColor hover:text-headerButtonHoverColor transition duration-800 ease-out "
                >
                  <FontAwesomeIcon
                    className={` ${path === "/login" || path === "/my" ? "text-slate-500" : ""} transition-all hover:text-slate-500 duration-500 fa-2x`}
                    icon={faIdCard}
                  />
                  {/* <p className=" text-xs">User</p> */}
                </Link>
              </div>
            )}

            {!session.data && (
              <div>
                {" "}
                <Link
                  href="/login"
                  className=" text-2xl text-headerButtonColor hover:text-headerButtonHoverColor transition duration-800 ease-out "
                >
                  <FontAwesomeIcon
                    className={` ${path === "/login" || path === "/my" ? "text-slate-500" : ""} transition-all hover:text-slate-500 duration-500 fa-2x`}
                    icon={faUser}
                  />
                  {/* <p className=" text-xs">Login</p> */}
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

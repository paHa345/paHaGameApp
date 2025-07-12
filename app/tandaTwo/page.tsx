"use client";

import Image from "next/image";
import React, { useState } from "react";

const pages = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showStatsStatus, setShowStatsStatus] = useState(false);

  const setIsVisibleStatus = () => {
    setIsVisible((prev) => {
      return !prev;
    });
  };

  const showStars = () => {
    setShowStatsStatus((prev) => {
      return !prev;
    });
  };
  return (
    <div>
      {isVisible && (
        <div className=" hover:bg-stone-400 bg-stone-200 rounded-2xl">
          <h1
            className=" hover:text-violet-500 hover:underline text-5xl font-bold md:text-9xl text-center pt-11 pb-11 text-pink-400
         "
          >
            Tanda2
          </h1>
        </div>
      )}
      <div>
        {isVisible && (
          <h1
            className=" animate-pulse hover:text-violet-500 text-5xl font-bold   md:text-9xl text-center pt-11 pb-11 text-violet-600
         "
          >
            {" "}
            AK__
            <span>9000</span>
          </h1>
        )}
      </div>

      <div>
        {isVisible && (
          <div
            onClick={showStars}
            className=" flex flex-row justify-center items-center gap-20 hover:gap-0 transition-all
 delay-50 duration-1000 ease-in-out"
          >
            <img
              className="rounded-lg"
              src="https://avatars.mds.yandex.net/i?id=f16de7b9d390408b510c8d8f578d13ba_l-5659646-images-thumbs&n=13"
              alt=""
              width={100}
              height={100}
            />

            {showStatsStatus && (
              <div>
                <img
                  className="rounded-lg animate-ping"
                  src="https://avatars.mds.yandex.net/i?id=83e0a9c797dc95ae6ec99935d3500b1884637f66-5231720-images-thumbs&n=13
"
                  alt=""
                  width={30}
                  height={30}
                />

                <img
                  className="rounded-lg animate-spin"
                  src="https://avatars.mds.yandex.net/i?id=83e0a9c797dc95ae6ec99935d3500b1884637f66-5231720-images-thumbs&n=13
"
                  alt=""
                  width={30}
                  height={30}
                />

                <img
                  className="rounded-lg animate-bounce"
                  src="https://avatars.mds.yandex.net/i?id=83e0a9c797dc95ae6ec99935d3500b1884637f66-5231720-images-thumbs&n=13
"
                  alt=""
                  width={30}
                  height={30}
                />
              </div>
            )}

            {showStatsStatus && (
              <div>
                <img
                  className="rounded-lg animate-pulse"
                  src="https://avatars.mds.yandex.net/i?id=83e0a9c797dc95ae6ec99935d3500b1884637f66-5231720-images-thumbs&n=13
"
                  alt=""
                  width={30}
                  height={30}
                />

                <img
                  className="rounded-lg animate-bounce"
                  src="https://avatars.mds.yandex.net/i?id=83e0a9c797dc95ae6ec99935d3500b1884637f66-5231720-images-thumbs&n=13
"
                  alt=""
                  width={30}
                  height={30}
                />

                <img
                  className="rounded-lg animate-ping"
                  src="https://avatars.mds.yandex.net/i?id=83e0a9c797dc95ae6ec99935d3500b1884637f66-5231720-images-thumbs&n=13
"
                  alt=""
                  width={30}
                  height={30}
                />
              </div>
            )}

            <img
              className="rounded-lg -scale-x-100"
              src="https://avatars.mds.yandex.net/i?id=f16de7b9d390408b510c8d8f578d13ba_l-5659646-images-thumbs&n=13"
              alt=""
              width={100}
              height={100}
            />
          </div>
        )}
      </div>
      <div className=" my-10  flex flex-col md:flex-row gap-3 justify-center items-center animate-pulse cursor-crosshair">
        <img
          className="rounded-full animate-bounce"
          src="https://i.pinimg.com/736x/21/b1/ad/21b1adea8aa7c78eb34bf76b5610052b.jpg"
          alt=""
          width={300}
          height={300}
        />
        <img
          onClick={setIsVisibleStatus}
          className="rounded-full animate-bounce"
          src="https://i.pinimg.com/originals/f1/5f/46/f15f462d4c0ce9a7283a4e9beb5a50a0.jpg"
          alt=""
          width={300}
          height={300}
        />
        <img
          className="rounded-full animate-bounce"
          src="https://avatars.mds.yandex.net/i?id=f4312d0ac87120a197ecb446d858f100_l-4236582-images-thumbs&n=13"
          alt=""
          width={300}
          height={300}
        />
        {/* <Image
          src={
            "https://i.pinimg.com/originals/f1/5f/46/f15f462d4c0ce9a7283a4e9beb5a50a0.jpg"
          }
          alt="dragon"
          width={600}
          height={600}
        ></Image> */}
      </div>
    </div>
  );
};

export default pages;

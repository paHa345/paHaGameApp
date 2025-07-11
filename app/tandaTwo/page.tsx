"use client";

import Image from "next/image";
import React, { useState } from "react";

const pages = () => {
  const [isVisible, setIsVisible] = useState(false);

  const setIsVisibleStatus = () => {
    setIsVisible((prev) => {
      return !prev;
    });
  };
  return (
    <div>
      {isVisible && (
        <div className=" hover:bg-stone-400 bg-stone-200 rounded-2xl">
          <h1
            className=" hover:text-violet-500 hover:underline text-9xl text-center pt-11 pb-11 text-pink-400
         "
          >
            Tanda2
          </h1>
        </div>
      )}
      <div>
        {isVisible && (
          <h1
            className=" animate-pulse hover:text-violet-500 text-9xl text-center pt-11 pb-11 text-violet-600
         "
          >
            {" "}
            AK__9000
          </h1>
        )}
      </div>
      <div className=" flex justify-center items-center animate-pulse cursor-crosshair">
        <img
          className="rounded-full animate-bounce"
          src="https://i.pinimg.com/736x/21/b1/ad/21b1adea8aa7c78eb34bf76b5610052b.jpg"
          alt=""
          width={400}
          height={400}
        />
        <img
          onClick={setIsVisibleStatus}
          className="rounded-full animate-bounce"
          src="https://i.pinimg.com/originals/f1/5f/46/f15f462d4c0ce9a7283a4e9beb5a50a0.jpg"
          alt=""
          width={400}
          height={400}
        />
        <img
          className="rounded-full animate-bounce"
          src="https://avatars.mds.yandex.net/i?id=f4312d0ac87120a197ecb446d858f100_l-4236582-images-thumbs&n=13"
          alt=""
          width={400}
          height={400}
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

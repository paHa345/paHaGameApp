import ConfirmEmailMain from "@/app/components/ConfirmEmail/ConfirmEmailMain";
import { AppDispatch } from "../../../store/index";
import { IAuthSlice, registerNewUser } from "../../../store/authSlice";
import jwt, { JsonWebTokenError, decode } from "jsonwebtoken";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ConfirmUserSignIn = () => {
  return (
    <>
      <ConfirmEmailMain></ConfirmEmailMain>
    </>
  );
};

export default ConfirmUserSignIn;

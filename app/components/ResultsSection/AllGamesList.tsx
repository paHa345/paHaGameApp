import { AppDispatch } from "@/app/store";
import { getAllGamesList } from "@/app/store/attemptsSlice";
import { useTelegram } from "@/app/telegramProvider";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const AllGamesList = () => {
  const { user } = useTelegram();
  const dispatch = useDispatch<AppDispatch>();

  console.log(user);
  useEffect(() => {
    if (!user?.id) {
      dispatch(getAllGamesList(777777));
    } else {
      dispatch(getAllGamesList(user?.id));
    }
  }, []);

  return <div>AllGamesList</div>;
};

export default AllGamesList;

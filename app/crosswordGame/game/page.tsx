import CrosswordGameTableMain from "@/app/components/CrosswordGameTableSection/CrosswordGameTableMain";
import { ICrosswordGameSlice } from "@/app/store/crosswordGameSlice";
import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  return <CrosswordGameTableMain></CrosswordGameTableMain>;
};

export default page;

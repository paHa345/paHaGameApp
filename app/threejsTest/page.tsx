import React from "react";
import WebGLTestMain from "../components/RoomsListSection/WebGLTestMain";
import ReactThreeFiberTestMain from "../components/RoomsListSection/ReactThreeFiberTestMain";

const page = () => {
  return (
    <div>
      {/* <WebGLTestMain></WebGLTestMain> */}
      <ReactThreeFiberTestMain></ReactThreeFiberTestMain>
    </div>
  );
};

export default page;

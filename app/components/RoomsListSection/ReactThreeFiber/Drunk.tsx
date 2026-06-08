import { forwardRef } from "react";
import DrunkEffect from "./DrunkEffect";
import { useControls } from "leva";
import { BlendFunction } from "postprocessing";

export default forwardRef(function Drunk(
  props: {
    frequency?: number;
    amplitude?: number;
    blendFunction?: BlendFunction;
  },
  ref,
) {
  const effect = new DrunkEffect(props);
  return <primitive ref={ref} object={effect}></primitive>;
});

import { Effect } from "postprocessing";
import React from "react";

const fragmentShader = /* glsl */ `
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 color = inputColor;
        color.rgb *= vec3(0.7, 1.0, 0.5);
        outputColor = color;
    }
`;

export default class DrunkEffect extends Effect {
  constructor(props: { frequency: number; amplitude: number }) {
    super("DrunkEffect", fragmentShader, {});
  }
}

varying vec3 vColor;

void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if(dist > 0.5)
        discard;
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    gl_FragColor = vec4(vColor, 0.8 * alpha);
}

// void main() {
//     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Красный цвет
// }
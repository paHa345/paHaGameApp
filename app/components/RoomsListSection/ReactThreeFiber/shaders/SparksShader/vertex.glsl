attribute float size;
varying vec3 vColor;
uniform float uTime;

void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position[0] * uTime, position[1] * uTime, position[2] * uTime, 1.0);
    gl_PointSize = size * (100.0 / -mvPosition.z) * 0.5;
    gl_Position = projectionMatrix * mvPosition;
}

// void main() {
//     gl_PointSize = 10.0;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;

float random2D(vec2 value) {
    return fract(sin(dot(value.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {

    // Position

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Glitch
    float glichTime = uTime - modelPosition.y;
    float glitchStrength = sin(glichTime) + sin(glichTime * 3.45) + sin(glichTime * 8.76);
    glitchStrength /= 3.0;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength);
    glitchStrength *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

// Final position

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal

    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Varyings

    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;

}
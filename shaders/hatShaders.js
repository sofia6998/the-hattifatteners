// language=glsl
const hat_fs = `
    precision mediump float;
    uniform highp vec2 u_resolution;
    uniform vec4 u_color;

    void main() {
        gl_FragColor = u_color;
        float distance = length(2.0 * gl_PointCoord - 1.0);
        if (distance > 1.0) {
            discard;
        }
    }
`;

// language=glsl
const hat_vs = `
    attribute vec2 coordinates;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform bool u_worry;
    uniform float u_size;


    void main() {
        vec2 clipSpace = coordinates * 2.0 / u_resolution - 1.0;
        float shift = pow((clipSpace.y + 1.0) / 6.0, 2.0) * sin(u_time) / 0.5;
        float x = clipSpace.x + (u_worry ? 0.0 : shift);
        gl_Position = vec4(x, clipSpace.y, 0.0, 1.0);
        gl_PointSize = u_size;
    }
`;


// language=glsl
const eye_fs = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(1.0,1.0,1.0,1.0);

        float distance = length(2.0 * gl_PointCoord - 1.0);
        if (distance > 1.0) {
            discard;
        }

        if (distance < 0.3 || distance >= 0.9) {
            gl_FragColor = vec4(0.09, 0.28, 0.47,1.0);
        }
    }
`;

// language=glsl
const eye_vs = `
    attribute vec2 coordinates;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform bool u_worry;
    uniform float u_worry_time;

    void main() {
        vec2 clipSpace = coordinates * 2.0 / u_resolution - 1.0;
        float shift = pow((clipSpace.y + 1.0) / 6.0, 2.0) * sin(u_time) / 0.5;
        float x = clipSpace.x + (u_worry ? 0.0 : shift);
        gl_Position = vec4(x, clipSpace.y, 0.0, 1.0);
        gl_PointSize = 40.0 + u_worry_time;
    }
`;


// language=glsl
const light_fs = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0,1.0,1.0,1.0);
        gl_FragColor = vec4(0.96, 0.86, 0.4, 1.0);
//        float distance = length(2.0 * gl_PointCoord - 1.0);
//        if (distance > 1.0) {
//            discard;
//        }
//        if (distance > 1.0) {
//            gl_FragColor = vec4(0.8,0.8,1.0,0.5);
//        }
    }
`;

// language=glsl
const light_vs = `
    attribute vec2 coordinates;
    uniform vec2 u_resolution;
    uniform float u_time;
    void main() {
        vec2 clipSpace = coordinates * 2.0 / u_resolution - 1.0;
        float x = clipSpace.x + sin(u_time * (clipSpace.x + 0.01) * 1000.0) / 20.0;
        gl_Position = vec4(x, clipSpace.y, 0.0, 1.0);
        gl_PointSize = 30.0;
    }
`;

// language=glsl
const light_back_fs = `
    precision mediump float;
    uniform highp vec2 u_resolution;
    void main() {
        vec2 st = gl_FragCoord.xy/u_resolution;
        float dist = distance(st, vec2(0.5, 1));
        vec4 white = vec4(1.0, 1.0, 1.0, 0.5);
        vec4 black = vec4(0.0, 0.0, 0.0, 0.0);
        gl_FragColor = mix(white, black, dist);
//        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0 - distance);
//
//        if (distance > 1.0) {
//            discard;
//        }
//        if (distance > 1.0) {
//            gl_FragColor = vec4(0.8,0.8,1.0,0.5);
//        }
    }
`;

// language=glsl
const light_back_vs = `
    attribute vec2 coordinates;
    uniform vec2 u_resolution;
    uniform float u_time;
    void main() {
        vec2 clipSpace = coordinates * 2.0 / u_resolution - 1.0;
        gl_Position = vec4(clipSpace.x, clipSpace.y, 0.0, 1.0);
        gl_PointSize = 400.0;
    }
`;

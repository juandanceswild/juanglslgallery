// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}



void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
	st.x *= 3.;
    
    vec3 color = vec3(0.);

    color = vec3(fract(st.x));
    
    vec2 f = fract(st);
    vec2 i = ceil(st);
    
    vec2 lb  = vec2(1.0);
    vec2 tr = vec2(1.0);

    float moveNoise = 10.6*noise(vec2(u_time*0.1, i.x * 0.05 * u_time));

    if (i.x == 1.) {
        
        lb  = smoothstep(0.02*noise(vec2(f.x*30.0, f.y*60.0)) * moveNoise, 0.1*noise(vec2(f.x*30.0, f.y*60.0)) * moveNoise, f);
        tr  = smoothstep(0.02*noise(vec2(f.x*30.0, f.y*60.0)) * moveNoise, 0.1*noise(vec2(f.x*30.0, f.y*60.0)) * moveNoise, 1.0 - f);
    }
    
    if (i.x == 2.) {
        lb  = smoothstep(0.02*noise(vec2(f.x*10.0, f.y*60.0)) + 0.1, 0.1 + 0.1*noise(vec2(f.x*10.0, f.y*60.0)), f);
        tr  = smoothstep(0.02*noise(vec2(f.x*30.0, f.y*60.0)), 0.1*noise(vec2(f.x*30.0, f.y*60.0)), 1.0 - f);        
    }
    
    if (i.x == 3.) {
        lb  = smoothstep(0.02*noise(vec2(f.x*10.0, f.y*80.0)), 0.1*noise(vec2(f.x*10.0, f.y*80.0)), f);
        tr  = smoothstep(0.02*noise(vec2(f.x*5.0, f.y*40.0)) * moveNoise, 0.1*noise(vec2(f.x*5.0, f.y*40.0)) * moveNoise, 1.0 - f);        
    }

	
    vec3 rect =  vec3(lb.x * lb.y * tr.x * tr.y);
    
    color = rect;
    
    float n = noise(vec2(st)*9.);
    
    
    if(i.x == 1.0) {
		// color *= vec3(0.6, 0.0, 0.0);  
    }

    // color += n;

    gl_FragColor = vec4(color, 1.0);
}
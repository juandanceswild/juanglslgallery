// Author Juan Cortes

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define blue1 vec3(0.500,0.881,0.985)

uniform vec2 u_resolution;
uniform float u_time;

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}


float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}

float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) + 
            box(_st, vec2(_size/4.,_size));
}

float circle(in float width, float radius, vec2 center, vec2 point) {
    float circleOuter = smoothstep(radius, radius+2., length(point - center));
    float circleInner = 1. - smoothstep(radius-width, radius-width+2., length(point-center));
    return 1. - (circleOuter + circleInner);
}

void main(){
    vec2 uv = gl_FragCoord.xy;
    vec2 st = uv.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    
    //center point
    vec2 center = u_resolution/2.0;
    
    //CIRCLE 1
    //width of the circle outline in pixels
    float width = 1.0;
    
    //radius of the circle we want in pixels
    float radius = 100.;
    
    float circle1 = circle(width, radius, center, uv);
    
    color += circle1*blue1;
    
    //CIRCLE 2
    //width of the circle outline in pixels
    width = 1.0;
    //radius of the circle we want in pixels
    radius = 190.;
    float circle2 = circle(width, radius, center, uv);
    color += circle2*blue1;
    
    //CIRCLE 3
    //width of the circle outline in pixels
    width = 1.0;
    //radius of the circle we want in pixels
    radius = 280.;
    float circle3 = circle(width, radius, center, uv);
    //making it blink a bit
    color += circle3 * (0.5*cos(PI*u_time)+1.);
    
    //the BG cross
    //rotation
    uv = uv - center;
    mat2 rot = rotate2d((u_time*0.5));
    uv = rot*uv;
    uv = uv + center;
    //cross line width
    float crossLine = .1;
    //the vertical line
    float verticalLine = 1. - smoothstep(crossLine, crossLine+1., abs(length(uv.x-center.x)));
    float horizontalLine =  1. - smoothstep(crossLine, crossLine+1., abs(length(uv.y-center.y)));
    float horizontalGradient =1.-smoothstep(0., 100.*(0.5*cos(2.*u_time)+0.5), length(center.y-uv.y));
    float verticalGradient =1.-smoothstep(0., 100.*(0.5*cos(2.*u_time)+0.5), length(center.x-uv.x));

    float targetCross = horizontalLine+verticalLine+0.5*(horizontalGradient+verticalGradient) - smoothstep(radius,radius+1.,length(uv-center));

    color += targetCross*(0.2);
    
    
    
    // st -= vec2(0.5);
    // mat2 rotscale = scale( vec2(0.5*sin(2.*u_time)+1.0) ) * rotate2d(sin(u_time)*PI);
    // st = rotscale * st;
    // st += vec2(0.5);

    // Show the coordinates of the space on the background
     //color = vec3(st.x,st.y,0.0);

    // Add the shape on the foreground
    // color += vec3(cross(st,0.2));

    gl_FragColor = vec4(color,1.0);
}
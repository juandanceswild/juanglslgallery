// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015
// Title: IChing series

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;

float shape(vec2 st, float N){
    //normalize space from -1 -> 1 (if st is 0->1)
    //note that if st is any other range than 0->1, then this is going to return a modified space -1 -> st.max-1.
    //
    st = st*2.-1.;
    //calculate the angle of the point in the 4 quadrants. the fact that we are calcultaing atan(st.x/st.y) (instead of y/x) and also adding a PI, means simply that we are rotating the space. For whatever reason. 
    float a = atan(st.x,st.y)+PI;
    float r = TWO_PI/N;
    //this returns a distance field corresponding to the length of a point along a polygon of N sides to the origin (0,0) of the space.
    return abs(cos(floor(.5+a/r)*r-a)*length(st));
}

float box(vec2 st, vec2 size){
    return shape(st*size,4.);
}

float rect(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

float hex(vec2 st, float a, float b, float c, float d, float e, float f){
    //multiply the space by 2 on x and 6 on y.
    st = st*vec2(2.,6.);

    vec2 fpos = fract(st);
    vec2 ipos = floor(st);

    // for the second half of the x-space, invert the fractional x-space -- for simmetry?
    // if (ipos.x == 1.0) fpos.x = 1.-fpos.x;
    if (ipos.y < 1.0){ //for the first integer group on y
        //for each fractional space, there's a mix of a box that is 0.84x and 1y of the space with another box that is
        //full size (1x and 1y) but moved 3% to the left. When the mix variable (a,b,c,etc.) is 0, 
        return mix(box(fpos, vec2(0.14,1.)),box(fpos-vec2(0.03,0.),vec2(1.)),0.);
    } else if (ipos.y < 2.0){
        return mix(box(fpos, vec2(0.84,1.)),box(fpos-vec2(0.03,0.),vec2(1.)),0.);
    } else if (ipos.y < 3.0){
        return mix(box(fpos, vec2(5.,1.)),box(fpos-vec2(0.03,0.),vec2(1.)),0.);
    } else if (ipos.y < 4.0){
        return mix(box(fpos, vec2(0.84,1.)),box(fpos-vec2(0.03,0.),vec2(1.)),d);
    } else if (ipos.y < 5.0){
        return mix(box(fpos, vec2(0.84,1.)),box(fpos-vec2(0.03,0.),vec2(1.)),e);
    } else if (ipos.y < 6.0){
        return mix(box(fpos, vec2(0.84,1.)),box(fpos-vec2(0.03,0.),vec2(1.)),f);
    }
    return 0.0;
}

float hex(vec2 st, float N){
    //create an array of 6 positions
    float b[6];
    //calculate the remainder of the division over 64. This effectively will always return a number from 0-64.
    float remain = floor(mod(N,64.));
    for(int i = 0; i < 6; i++){
        b[i] = 0.0;
        //store 0 or 1 in each one of the positions of the 6-n array. Depending if the remain is odd or even.
        b[i] = step(1.0,mod(remain,2.));
        //recalculate the remain. Ceiling the result of half the remain will produce an even or an odd number always.
        remain = ceil(remain/2.);
    } //at the end of this for loop, we will have an array of 6 positions with a 1 or a 0 in it.
    return hex(st,b[0],b[1],b[2],b[3],b[4],b[5]);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.y *= u_resolution.y/u_resolution.x;

    st *= 1.0;
    vec2 fpos = fract(st);
    vec2 ipos = floor(st);
    
    // float t = u_time*5.0;
	float t = 1.0;
    float df = 1.0;
    //st = fpos, N = ipos.x+ipos.y+t = 1
    df = hex(fpos,ipos.x+ipos.y+t)+(1.0-rect(fpos,vec2(1.0)));

    // gl_FragColor = vec4(mix( vec3(0.),vec3(1.),step(0.7,df)),1.0);
    gl_FragColor = vec4(mix( vec3(0.),vec3(1.),(df)),1.0);

}
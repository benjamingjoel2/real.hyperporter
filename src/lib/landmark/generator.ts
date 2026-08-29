/**
 * Ported verbatim from hyperporter-3.html's inline landmark-illustration
 * generator (~50 hand-built scenes, one archetype per destination family).
 * Logic is unchanged; only module syntax and type annotations were added
 * to satisfy `astro check` (browsers never type-checked the original).
 * Exception: A.stupa and A.mosque each carried a `${...}` that was never
 * interpolated, patched over with a `.replace()` that only fixed one token.
 * A.stupa's left `-150*s` survived into the `d` attribute as literal text,
 * so browsers rejected the whole path and the two flanking stupas never
 * drew (Thailand, Myanmar, Sri Lanka). Both are now interpolated properly;
 * A.mosque's dome-cap rise is scaled by `s` to match every other value.
 */
import { LM } from './lookup';

export type RNG = () => number;

export interface Palette {
  sky: string;
  mid2: string;
  far: string;
  mid: string;
  near: string;
  wat: string;
  acc: string;
}

export type SceneBuilder = (r: RNG, C: Palette) => string;

export function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rngFrom(seed: number): RNG {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const G = 572, W = 1200, H = 760;

const P = (pts: string, f: string, o?: number) => `<polygon points="${pts}" fill="${f}"${o?` opacity="${o}"`:''}/>`;
const R = (x: number, y: number, w: number, h: number, f: string, o?: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o?` opacity="${o}"`:''}/>`;
const C_ = (x: number|string, y: number|string, r: number|string, f: string, o?: number|string) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${o?` opacity="${o}"`:''}/>`;
const D = (d: string, f: string, o?: number) => `<path d="${d}" fill="${f}"${o?` opacity="${o}"`:''}/>`;
const L = (d: string, st: string, w?: number, o?: number) => `<path d="${d}" fill="none" stroke="${st}" stroke-width="${w||1.4}"${o?` opacity="${o}"`:''}/>`;

/* shared pieces */
const hills = (C: Palette, y: number, amp: number, n: number, f: string) => {let d=`M0 ${H} L0 ${y}`;for(let i=1;i<=n;i++){const x=W/n*i;d+=` Q${x-W/n/2} ${y-amp} ${x} ${y}`;}return D(d+` L${W} ${H} Z`,f);};
const water = (C: Palette, y: number) => R(0,y,W,H-y,C.wat)+L(`M0 ${y+26} H${W}`,C.far,1,.5)+L(`M0 ${y+52} H${W}`,C.far,1,.32);
const palm = (x: number, y: number, s: number, f: string) => {let o=D(`M${x} ${y} q${-3*s} ${-26*s} ${2*s} ${-52*s} l${4*s} 0 q${-3*s} ${26*s} ${1*s} ${52*s} Z`,f);
  for(let k=0;k<6;k++){const a=-Math.PI+k*Math.PI/5;o+=D(`M${x+2*s} ${y-52*s} q${Math.cos(a)*22*s} ${Math.sin(a)*11*s-9*s} ${Math.cos(a)*40*s} ${-3*s} q${-Math.cos(a)*20*s} ${-2*s} ${-Math.cos(a)*40*s} ${6*s} Z`,f);}return o;};
const pine = (x: number, y: number, s: number, f: string) => {let o='';for(let k=0;k<3;k++)o+=P(`${x},${y-40*s-k*20*s} ${x-16*s+k*3*s},${y-8*s-k*20*s} ${x+16*s-k*3*s},${y-8*s-k*20*s}`,f);return o+R(x-2*s,y-12*s,4*s,12*s,f);};
const acacia = (x: number, y: number, s: number, f: string) => {
  let o=D(`M${x-3*s} ${y} l${1*s} ${-38*s} l${-17*s} ${-13*s} l${2*s} ${-5*s} l${18*s} ${9*s} l${1*s} ${-9*s} l${16*s} ${-11*s} l${3*s} ${5*s} l${-15*s} ${12*s} l${1*s} ${12*s} l${2*s} ${38*s} Z`,f);
  o+=D(`M${x-56*s} ${y-52*s} q${56*s} ${-34*s} ${112*s} 0 q${-22*s} ${15*s} ${-56*s} ${15*s} q${-34*s} 0 ${-56*s} ${-15*s} Z`,f);
  return o;};

/** Soft ink for highlights that were near-white on the dark theme. */
const INK_SOFT = '#33414E';

export const A: Record<string, SceneBuilder> = {};

/* --- named landmarks --- */
A.flame=(r,C)=>{                                     /* Azerbaijan — Flame Towers */
  let o=hills(C,G-10,44,4,C.far);
  for(let i=0;i<20;i++)o+=R(i*64,G-46-((i*53)%86),50,100,C.mid);
  [[470,330,1],[600,430,0],[730,330,1]].forEach(([x,h,side])=>{
    o+=D(`M${x-58} ${G} q6 ${-h*.58} 46 ${-h} q40 ${h*.42} 46 ${h} Z`,side?C.mid:C.near);
    o+=D(`M${x-40} ${G} q6 ${-h*.55} 34 ${-h*.9} q28 ${h*.35} 34 ${h*.9} Z`,C.acc,.14);
    for(let k=1;k<9;k++)o+=R(x-38+k*2,G-h*.94+k*(h*.1),72-k*4,3,C.acc,.1);});
  return o+R(0,G,W,H-G,C.near);};
A.cliffmonastery=(r,C)=>{                            /* Bhutan — Tiger's Nest */
  let o=P(`-60,${G} 180,140 420,${G}`,C.far)+P(`820,${G} 1060,120 1300,${G}`,C.far);
  o+=P(`180,140 250,250 216,242 180,286 142,238 110,246`,C.acc,.5);
  o+=D(`M300 ${G} L390 260 L450 168 L560 120 L700 190 L790 300 L860 ${G} Z`,C.mid);
  o+=D(`M420 ${G} L470 300 L560 250 L660 300 L700 ${G} Z`,C.near,.55);
  const bx=575;
  o+=R(bx-118,300,96,150,C.near)+R(bx-14,238,104,212,C.near)+R(bx+96,286,74,164,C.near);
  o+=P(`${bx-132},300 ${bx-70},254 ${bx-8},300`,C.acc,.9);
  o+=P(`${bx-28},238 ${bx+38},180 ${bx+104},238`,C.acc,.9);
  o+=P(`${bx+84},286 ${bx+133},246 ${bx+182},286`,C.acc,.9);
  o+=R(bx-96,340,26,34,C.mid)+R(bx+12,290,30,40,C.mid)+R(bx+118,330,24,32,C.mid);
  o+=L(`M${bx+38} 180 v-34`,C.acc,4,.9);
  return o+L(`M300 ${G} L390 260 L450 168`,C.acc,1.4,.28);};
A.savanna=(r,C)=>{                                   /* Kenya — Kilimanjaro & acacia */
  let o=P(`80,${G} 400,300 545,255 690,255 830,300 1120,${G}`,C.far);
  o+=P(`545,255 690,255 742,282 700,290 656,272 610,288 566,274 520,286`,C.acc,.85);
  o+=hills(C,G-6,30,3,C.mid);
  o+=acacia(600,G,3.1,C.near);
  o+=acacia(215,G,1.8,C.near)+acacia(1010,G,1.5,C.mid)+acacia(1130,G,1.1,C.mid);
  o+=D(`M415 ${G} l0 -92 l-20 -66 l13 -7 l16 48 l30 -26 l35 9 l13 57 l9 77 Z`,C.near);
  o+=D(`M800 ${G} l-9 -66 l-35 -13 l4 -18 l44 9 l22 26 l31 62 Z`,C.near);
  return o+R(0,G,W,H-G,C.near);};
A.monolith=(r,C)=>{                                  /* Nigeria — Zuma Rock */
  let o=hills(C,G-8,34,5,C.far);
  o+=D(`M372 ${G} q26 -348 228 -368 q202 20 228 368 Z`,C.mid);
  o+=D(`M600 ${G} q0 -368 0 -368 q202 20 228 368 Z`,C.near,.28);
  o+=L(`M492 ${G-40} q34 -212 108 -290`,C.near,2,.4)+L(`M700 ${G-50} q-18 -206 -84 -280`,C.near,2,.3);
  o+=acacia(180,G,1.6,C.near)+acacia(1010,G,1.8,C.near)+acacia(1120,G,1.1,C.mid);
  return o+R(0,G,W,H-G,C.near);};
A.towerfort=(r,C)=>{                                 /* Portugal — Belém Tower */
  let o=hills(C,G-108,26,3,C.far)+water(C,G-40);
  const x=600,b=G-40;
  o+=R(x-92,b-230,184,230,C.mid)+R(x-52,b-390,110,164,C.mid);
  for(let i=0;i<9;i++)o+=R(x-98+i*23,b-246,15,16,C.mid);
  for(let i=0;i<5;i++)o+=R(x-48+i*23,b-408,15,16,C.mid);
  [[x-96,b-320],[x+96,b-320]].forEach(([tx,ty])=>{
    o+=R(tx-16,ty,32,86,C.mid)+D(`M${tx-22} ${ty} q22 -36 44 0 Z`,C.acc,.85)+L(`M${tx} ${ty-40} v-14`,C.acc,3,.9);});
  o+=D(`M${x-52} ${b-390} q52 -44 110 0 Z`,C.acc,.6)+L(`M${x+3} ${b-436} v-20`,C.acc,3,.9);
  for(let i=0;i<3;i++)o+=R(x-30+i*32,b-150,20,48,C.near,.85);
  o+=R(x-24,b-64,48,64,C.near);
  o+=R(x-124,b-26,248,26,C.near);
  return o;};
A.borobudur=(r,C)=>{                                 /* Indonesia — Borobudur */
  let o=hills(C,G-40,54,3,C.far);
  for(let i=0;i<5;i++){const w=560-i*92,y=G-40-i*46;o+=R(600-w/2,y,w,46,i%2?C.mid:C.near);}
  for(let i=0;i<7;i++){const x=380+i*74;o+=D(`M${x} ${G-176} q14 -30 28 0 Z`,C.mid)+R(x+12,G-196,4,20,C.mid);}
  o+=D(`M566 ${G-226} q34 -66 68 0 Z`,C.near)+R(596,G-262,8,36,C.near);
  o+=palm(120,G,1.1,C.near)+palm(1090,G,1,C.near);
  return o;};
A.liberty=(r,C)=>{                                   /* United States */
  let o='';
  for(let i=0;i<9;i++){const bh=110+((i*97)%230);o+=R(772+i*48,G-bh,40,bh,i%3?C.mid:C.far);}
  for(let i=0;i<7;i++){const bh=95+((i*67)%200);o+=R(20+i*48,G-bh,38,bh,i%2?C.mid:C.far);}
  o+=water(C,G-30);
  const x=590,b=G-30;
  o+=P(`${x-100},${b} ${x+100},${b} ${x+66},${b-64} ${x-66},${b-64}`,C.near);
  o+=P(`${x-58},${b-64} ${x+58},${b-64} ${x+40},${b-146} ${x-40},${b-146}`,C.near);
  o+=P(`${x-44},${b-146} ${x+44},${b-146} ${x+34},${b-250} ${x-30},${b-320} ${x-40},${b-300}`,C.near);
  o+=P(`${x-30},${b-320} ${x+34},${b-250} ${x+30},${b-318} ${x+6},${b-338}`,C.near);
  o+=C_(x-2,b-360,24,C.near);
  for(let k=0;k<7;k++){const a=-Math.PI*.96+k*Math.PI*.32,cx=x-2,cy=b-360;
    o+=P(`${(cx+Math.cos(a-.07)*24).toFixed(0)},${(cy+Math.sin(a-.07)*24).toFixed(0)} ${(cx+Math.cos(a)*54).toFixed(0)},${(cy+Math.sin(a)*54).toFixed(0)} ${(cx+Math.cos(a+.07)*24).toFixed(0)},${(cy+Math.sin(a+.07)*24).toFixed(0)}`,C.near);}
  o+=P(`${x+22},${b-316} ${x+44},${b-330} ${x+68},${b-424} ${x+46},${b-428}`,C.near);
  o+=P(`${x+44},${b-424} ${x+72},${b-430} ${x+66},${b-456} ${x+48},${b-452}`,C.near);
  o+=C_(x+58,b-470,15,C.acc,.95)+C_(x+58,b-470,46,C.acc,.17);
  o+=P(`${x-40},${b-300} ${x-64},${b-262} ${x-52},${b-224} ${x-34},${b-230} ${x-44},${b-262} ${x-26},${b-286}`,C.near);
  return o;}
A.pyramids=(r,C)=>{                                  /* Egypt */
  let o=hills(C,G-4,18,4,C.far);
  o+=P(`430,${G} 640,240 850,${G}`,C.mid)+P(`640,240 850,${G} 700,${G}`,C.near,.55);
  o+=P(`760,${G} 900,330 1040,${G}`,C.mid)+P(`210,${G} 330,376 450,${G}`,C.mid);
  o+=palm(140,G,.9,C.near)+palm(1120,G,.8,C.near);
  return o;};
A.mosque=(r,C)=>{                                    /* Islamic-world archetype */
  let o=hills(C,G-10,24,5,C.far);
  const x=600,b=G;
  o+=R(x-190,b-120,380,120,C.mid);
  for(let i=0;i<7;i++)o+=D(`M${x-176+i*52} ${b-120} q22 -34 44 0 Z`,C.near,.55);
  o+=D(`M${x-96} ${b-120} q96 -166 192 0 Z`,C.near)+R(x-4,b-296,8,42,C.near)+C_(x,b-300,10,C.acc,.9);
  [[x-230,.9],[x+230,.9],[x-300,.7],[x+300,.7]].forEach(([mx,s])=>{
    o+=R(mx-11*s,b-250*s,22*s,250*s,C.mid)+D(`M${mx-16*s} ${b-250*s} q${16*s} ${-40*s} ${32*s} 0 Z`,C.near)+R(mx-2*s,b-286*s,4*s,36*s,C.near);});
  return o;};
A.petra=(r,C)=>{                                     /* Jordan — Al-Khazneh */
  let o=R(0,0,W,H,C.far,.001);
  o+=D(`M0 ${H} L0 0 L300 0 L360 200 L330 ${H} Z`,C.mid)+D(`M${W} ${H} L${W} 0 L840 0 L790 240 L830 ${H} Z`,C.mid);
  const x=580,b=G;
  o+=R(x-140,b-260,280,260,C.near);
  for(let i=0;i<6;i++)o+=R(x-124+i*46,b-190,20,190,C.mid,.8);
  o+=P(`${x-150},${b-260} ${x},${b-330} ${x+150},${b-260}`,C.near);
  o+=R(x-40,b-166,80,60,C.mid)+C_(x,b-300,20,C.near)+R(x-24,b-100,48,100,C.mid,.9);
  return o;};
A.needle=(r,C)=>{                                    /* UAE / Gulf towers */
  let o='';for(let i=0;i<14;i++){const bh=70+((i*83)%200);o+=R(40+i*84,G-bh,58,bh,i%3?C.far:C.mid);}
  const x=600;
  o+=D(`M${x-64} ${G} L${x-20} 250 L${x} 130 L${x+20} 250 L${x+64} ${G} Z`,C.near);
  o+=D(`M${x-30} ${G} L${x-10} 300 L${x} 220 L${x+10} 300 L${x+30} ${G} Z`,C.acc,.12);
  return o+R(0,G,W,H-G,C.near);};
A.taj=(r,C)=>{                                       /* India — Taj Mahal */
  let o=hills(C,G-60,24,4,C.far);
  const x=600,b=G-60;
  o+=R(x-210,b-170,420,170,C.mid);
  o+=D(`M${x-118} ${b-170} q118 -206 236 0 Z`,C.near);
  o+=R(x-9,b-408,18,36,C.near)+C_(x,b-418,11,C.acc,.9);
  o+=D(`M${x-74} ${b-170} q74 -46 148 0 Z`,C.mid,.55);
  o+=D(`M${x-40} ${b-100} q40 -76 80 0 Z`,C.mid,.9);
  [[x-150,.62],[x+150,.62]].forEach(([dx,s])=>{o+=D(`M${dx-40} ${b-170} q40 -110 80 0 Z`,C.near)+L(`M${dx} ${b-262} v-18`,C.near,3);});
  [[x-268],[x+268]].forEach(([mx])=>{
    o+=R(mx-16,b-330,32,330,C.mid)+D(`M${mx-22} ${b-330} q22 -46 44 0 Z`,C.near)+L(`M${mx} ${b-380} v-24`,C.near,4)
      +R(mx-20,b-226,40,9,C.near)+R(mx-20,b-124,40,9,C.near);});
  o+=R(0,b,W,34,C.wat)+R(x-210,b+34,420,10,C.near,.45);
  return o;};
A.himalaya=(r,C)=>{                                  /* Nepal / high ranges */
  let o=P(`-40,${G} 240,150 470,${G}`,C.mid)+P(`300,${G} 620,90 940,${G}`,C.near)+P(`820,${G} 1060,190 1260,${G}`,C.mid);
  o+=P(`620,90 700,180 660,178 620,206 578,176 540,180`,C.acc,.9);
  o+=P(`240,150 300,224 268,218 240,240 210,216 180,222`,C.acc,.75);
  let f='';for(let i=0;i<9;i++)f+=P(`${180+i*70},${300+i*4} ${210+i*70},${296+i*4} ${196+i*70},${330+i*4}`,C.acc,.5);
  return o+L(`M180 300 Q600 268 1000 320`,C.acc,1,.4)+f;};
A.fujipagoda=(r,C)=>{                                /* Japan — Fuji & pagoda */
  let o=D(`M40 ${G} Q600 60 1160 ${G} Z`,C.mid);
  o+=D(`M436 232 Q600 128 764 232 Q700 208 660 222 Q630 200 600 200 Q570 200 540 222 Q500 208 436 232 Z`,C.acc,.92);
  const x=600,b=G;
  o+=R(x-11,b-300,22,300,C.near);
  for(let i=0;i<5;i++){const w=196-i*30,y=b-70-i*58;
    o+=D(`M${x-w/2-16} ${y} q${w/2+16} -26 ${w+32} 0 l-20 -16 l${-w+8} 0 Z`,C.near)+R(x-w/2+22,y-52,w-44,52,C.near);}
  o+=R(x-5,b-372,10,50,C.near)+C_(x,b-380,8,C.acc,.9);
  o+=pine(210,G,1.6,C.near)+pine(300,G,1.1,C.near)+pine(980,G,1.4,C.near);
  return o+R(0,G,W,H-G,C.near);};
A.greatwall=(r,C)=>{                                 /* China */
  let o=hills(C,G-30,90,3,C.far)+hills(C,G+10,120,2,C.mid);
  const wy=(x: number)=>G-58-Math.sin(x/W*3.1)*88;
  let d=`M0 ${wy(0)}`;for(let x=0;x<=W;x+=24)d+=` L${x} ${wy(x)}`;
  o+=D(d+` L${W} ${H} L0 ${H} Z`,C.near);
  for(let x=0;x<=W;x+=34)o+=R(x,wy(x)-16,18,16,C.near);
  [200,560,900].forEach(x=>{o+=R(x-26,wy(x)-70,52,70,C.near);for(let i=0;i<4;i++)o+=R(x-26+i*14,wy(x)-84,9,14,C.near);});
  return o;};
A.angkor=(r,C)=>{                                    /* Cambodia */
  let o=hills(C,G-46,20,4,C.far)+R(0,G-46,W,46,C.wat);
  const b=G-46;
  o+=R(300,b-90,600,90,C.mid);
  [[420,150],[600,230],[780,150],[330,110],[870,110]].forEach(([x,h])=>{
    o+=D(`M${x-38} ${b-90} q10 ${-h*.72} 38 ${-h} q28 ${h*.28} 38 ${h} Z`,C.near);
    o+=L(`M${x} ${b-90-h} v-14`,C.near,4);});
  o+=R(0,b+46,W,H,C.near,.001);
  return o;};
A.karst=(r,C)=>{                                     /* Vietnam / Thailand — limestone bay */
  let o=R(0,0,W,H,C.far,.001)+water(C,G-70);
  const put=(x: number,h: number,w: number,f: string)=>D(`M${x-w/2} ${G-70} q${w*.06} ${-h*.82} ${w*.34} ${-h} q${w*.3} ${h*.14} ${w*.66} ${h} Z`,f);
  o=put(180,190,120,C.far)+put(980,160,110,C.far)+o;
  o+=put(360,250,150,C.mid)+put(760,300,180,C.mid)+put(1090,210,130,C.mid);
  o+=put(560,360,200,C.near)+put(240,200,120,C.near);
  o+=D(`M840 ${G-70} l0 -74 l64 74 Z`,C.near)+L(`M840 ${G-96} v26`,C.near,3);
  return o;};
A.stupa=(r,C)=>{                                     /* Myanmar / Sri Lanka */
  let o=hills(C,G-8,26,4,C.far);
  const x=600,b=G;
  o+=R(x-170,b-40,340,40,C.mid);
  o+=D(`M${x-120} ${b-40} q0 -180 120 -230 q120 50 120 230 Z`,C.near);
  o+=D(`M${x-30} ${b-238} q30 -60 60 0 Z`,C.near)+L(`M${x} ${b-286} v-40`,C.near,5)+C_(x,b-332,9,C.acc,.9);
  [[x-210,.7],[x+210,.7]].forEach(([sx,s])=>{o+=D(`M${sx-40*s} ${b} q0 ${-120*s} ${40*s} ${-150*s} q${40*s} ${30*s} ${40*s} ${150*s} Z`,C.mid)+L(`M${sx} ${b-150*s} v${-26*s}`,C.mid,3);});
  return o;};
A.eiffel=(r,C)=>{                                    /* France */
  let o='';for(let i=0;i<14;i++)o+=R(i*92,G-40-((i*61)%54),80,94,C.far);
  const x=600,b=G;
  o+=D(`M${x-130} ${b} q60 -190 108 -300 l-6 -84 l12 -46 l12 46 l-6 84 q48 110 108 300 Z`,C.near);
  o+=D(`M${x-96} ${b-96} q96 -34 192 0 l0 18 q-96 -34 -192 0 Z`,C.mid,.85);
  o+=D(`M${x-52} ${b-210} q52 -20 104 0 l0 14 q-52 -20 -104 0 Z`,C.mid,.85);
  o+=P(`${x-130},${b} ${x-84},${b-96} ${x-56},${b-96} ${x-96},${b}`,C.mid,.5);
  return o+R(0,G,W,H-G,C.near);};
A.colosseum=(r,C)=>{                                 /* Italy */
  let o=hills(C,G-10,22,5,C.far);
  const x=600,b=G;
  o+=D(`M${x-260} ${b} q0 -270 260 -270 q260 0 260 270 Z`,C.mid);
  for(let row=0;row<3;row++)for(let i=0;i<15;i++){const ax=x-238+i*34,ay=b-58-row*66;
    if(row===2&&i>10)continue;
    o+=D(`M${ax} ${ay} l0 -30 q9 -14 18 0 l0 30 Z`,C.near,.85);}
  o+=P(`${x+150},${b} ${x+150},${b-232} ${x+262},${b-150} ${x+262},${b}`,C.near,.3);
  return o+R(0,G,W,H-G,C.near);};
A.clocktower=(r,C)=>{                                /* United Kingdom */
  let o=water(C,G-10);
  o+=R(0,G-96,W,20,C.mid);
  for(let i=0;i<7;i++)o+=D(`M${20+i*180} ${G-76} q78 -66 156 0 Z`,C.mid);
  const x=380,b=G-96;
  o+=R(x-34,b-300,68,300,C.near)+R(x-40,b-330,80,34,C.near);
  o+=C_(x,b-350,26,C.near)+C_(x,b-350,17,C.acc,.85);
  o+=P(`${x-40},${b-330} ${x},${b-410} ${x+40},${b-330}`,C.near);
  for(let i=0;i<9;i++)o+=R(700+i*46,b-120-((i*53)%80),36,220,C.mid);
  return o;};
A.windmill=(r,C)=>{                                  /* Netherlands */
  let o=hills(C,G-6,14,6,C.far)+R(0,G,W,H-G,C.near);
  const mill=(x: number,s: number,f: string)=>{let m=P(`${x-30*s},${G} ${x+30*s},${G} ${x+20*s},${G-96*s} ${x-20*s},${G-96*s}`,f)
    +D(`M${x-26*s} ${G-96*s} q${26*s} ${-30*s} ${52*s} 0 Z`,f)+C_(x,G-104*s,5*s,f);
    for(let k=0;k<4;k++){const a=k*Math.PI/2+.5;m+=D(`M${x} ${G-104*s} l${Math.cos(a)*70*s} ${Math.sin(a)*70*s} l${Math.cos(a+1.5)*10*s} ${Math.sin(a+1.5)*10*s} Z`,f);}return m;};
  o+=mill(300,1.15,C.near)+mill(760,.85,C.mid)+mill(1000,.6,C.far);
  return o+L(`M0 ${G+40} H${W}`,C.mid,1,.5);};
A.spires=(r,C)=>{                                    /* Spain — Sagrada Família */
  let o='';for(let i=0;i<13;i++)o+=R(i*98,G-50-((i*71)%60),86,110,C.far);
  const x=600;
  [[-150,250],[-90,320],[-30,390],[30,430],[90,350],[150,270],[-210,200],[210,210]].forEach(([dx,h])=>{
    o+=D(`M${x+dx-26} ${G} q6 ${-h*.7} 26 ${-h} q20 ${h*.3} 26 ${h} Z`,C.near)+C_(x+dx,G-h-10,7,C.acc,.8);});
  return o+R(0,G,W,H-G,C.near);};
A.matterhorn=(r,C)=>{                                /* Switzerland / Alps */
  let o=P(`-60,${G} 250,220 520,${G}`,C.mid);
  o+=P(`320,${G} 640,110 700,300 980,${G}`,C.near);
  o+=P(`640,110 700,300 660,286 640,320 600,278 560,290`,C.acc,.92);
  o+=P(`250,220 300,300 274,292 250,314 224,290 200,296`,C.acc,.7);
  o+=P(`860,${G} 1080,260 1260,${G}`,C.mid);
  const ch=(x: number,s: number)=>P(`${x-34*s},${G} ${x+34*s},${G} ${x+34*s},${G-30*s} ${x},${G-58*s} ${x-34*s},${G-30*s}`,C.near);
  return o+ch(180,1)+ch(1010,.8)+pine(300,G,1,C.near)+pine(880,G,.9,C.near);};
A.fjord=(r,C)=>{                                     /* Norway / Iceland */
  let o=R(0,0,W,H,C.far,.001);
  for(let k=0;k<4;k++)o+=L(`M${-40+k*30} ${120+k*26} Q400 ${40+k*30} ${W+40} ${150+k*24}`,C.acc,10,.16-k*.03);
  o+=P(`0,${G} 0,150 300,240 420,${G}`,C.mid)+P(`${W},${G} ${W},130 880,220 760,${G}`,C.mid);
  o+=P(`0,${G} 0,300 220,360 330,${G}`,C.near)+P(`${W},${G} ${W},280 940,350 840,${G}`,C.near);
  o+=water(C,G-30);
  return o+P(`540,${G-30} 600,${G-52} 660,${G-30}`,C.near);};
A.parthenon=(r,C)=>{                                 /* Greece */
  let o=hills(C,G-10,30,4,C.far);
  const x=600,b=G-70;
  o+=P(`260,${G} 340,${b} 860,${b} 940,${G}`,C.mid);
  o+=R(x-190,b-14,380,14,C.near);
  for(let i=0;i<11;i++)o+=R(x-176+i*35,b-140,20,126,C.near);
  o+=R(x-196,b-158,392,20,C.near)+P(`${x-196},${b-158} ${x},${b-214} ${x+196},${b-158}`,C.near);
  return o;};
A.onion=(r,C)=>{                                     /* Orthodox / Central Asia */
  let o=hills(C,G-8,22,5,C.far);
  const x=600,b=G;
  o+=R(x-160,b-140,320,140,C.mid);
  const dome=(dx: number,s: number)=>D(`M${x+dx-34*s} ${b-140-60*s} q${-14*s} ${-56*s} ${34*s} ${-84*s} q${48*s} ${28*s} ${34*s} ${84*s} Z`,C.near)
    +R(x+dx-14*s,b-200-60*s,28*s,64*s,C.mid)+L(`M${x+dx} ${b-232-60*s} v${-26*s}`,C.acc,3,.9);
  o+=dome(0,1.35)+dome(-110,.85)+dome(110,.85)+dome(-190,.6)+dome(190,.6);
  return o;};
A.castle=(r,C)=>{                                    /* Central Europe */
  let o=hills(C,G-20,40,3,C.far);
  o+=P(`180,${G} 420,300 820,300 1040,${G}`,C.mid);
  const b=300,x=600;
  o+=R(x-160,b-90,320,90,C.near);
  for(let i=0;i<12;i++)o+=R(x-158+i*28,b-104,16,14,C.near);
  [[x-180,120],[x+180,120],[x-60,160],[x+70,140]].forEach(([tx,th])=>{
    o+=R(tx-24,b-th,48,th,C.near)+P(`${tx-32},${b-th} ${tx},${b-th-52} ${tx+32},${b-th}`,C.near);});
  o+=R(x-20,b-46,40,46,C.mid);
  return o+pine(240,G,1.1,C.near)+pine(980,G,1,C.near)+pine(1080,G,.8,C.near);};
A.moai=(r,C)=>{                                      /* Chile — Rapa Nui */
  let o=hills(C,G-6,20,4,C.far)+R(0,G,W,H-G,C.near);
  const head=(x: number,s: number,f: string)=>D(`M${x-40*s} ${G} l${6*s} ${-120*s} q${-8*s} ${-56*s} ${34*s} ${-70*s} q${42*s} ${14*s} ${34*s} ${70*s} l${6*s} ${120*s} Z`,f)
    +R(x-30*s,G-208*s,60*s,18*s,f);
  return o+head(320,1.25,C.near)+head(600,1,C.near)+head(830,.8,C.mid);};
A.machu=(r,C)=>{                                     /* Peru / Andes */
  let o=P(`-40,${G} 260,240 520,${G}`,C.far);
  o+=P(`620,${G} 830,120 1010,${G}`,C.mid)+P(`830,120 880,210 856,206 830,236 800,206 776,212`,C.acc,.7);
  o+=P(`300,${G} 520,260 760,300 900,${G}`,C.near);
  for(let i=0;i<7;i++)o+=R(430+i*10,330+i*22,300-i*16,10,C.mid,.9);
  for(let i=0;i<6;i++)o+=R(470+i*46,300,30,26,C.mid);
  return o;};
A.christ=(r,C)=>{                                    /* Brazil */
  let o=water(C,G-40);
  o+=D(`M700 ${G-40} q80 -220 200 -230 q120 10 200 230 Z`,C.mid);
  o+=D(`M-40 ${G-40} q160 -300 330 -310 q170 10 300 310 Z`,C.near);
  const x=290,b=250;
  o+=R(x-9,b-96,18,96,C.acc,.92)+R(x-56,b-80,112,11,C.acc,.92)+C_(x,b-104,10,C.acc,.92);
  return o+P(`0,${G} ${W},${G} ${W},${H} 0,${H}`,C.near);};
A.stepPyramid=(r,C)=>{                               /* Mesoamerica */
  let o=hills(C,G-10,26,5,C.far);
  const x=600,b=G;
  for(let i=0;i<7;i++){const w=440-i*54,y=b-i*40;o+=R(x-w/2,y-40,w,40,i%2?C.mid:C.near);}
  o+=R(x-46,b-320,92,40,C.near)+R(x-16,b-280,32,280,C.mid,.8);
  for(let i=0;i<7;i++)o+=R(x-14,b-8-i*40,28,6,C.near);
  return o+palm(140,G,1,C.near)+palm(1080,G,.9,C.near);};
A.opera=(r,C)=>{                                     /* Australia */
  let o='';for(let i=0;i<10;i++)o+=R(760+i*46,G-120-((i*67)%110),38,240,C.far);
  o+=D(`M120 ${G-96} q380 -190 760 0`,C.mid,0)+L(`M120 ${G-96} q380 -200 760 0`,C.mid,10,.9);
  o+=R(380,G-96,240,10,C.mid);
  o+=water(C,G-40);
  [[300,140,1],[400,180,1],[500,120,1]].forEach(([x,h])=>{
    o+=D(`M${x-90} ${G-40} q10 ${-h} 90 ${-h} q-30 ${h*.55} -30 ${h} Z`,C.near);});
  return o;};
A.overwater=(r,C)=>{                                 /* Island / atoll */
  let o=C_(880,190,58,C.acc,.9)+C_(880,190,150,C.acc,.12)+water(C,G-90);
  o+=D(`M0 ${G-90} q120 -30 260 -8 q140 22 260 8 L520 ${G-90} Z`,C.mid);
  const hut=(x: number,s: number)=>R(x-26*s,G-118*s,52*s,30*s,C.near)+P(`${x-40*s},${G-118*s} ${x},${G-160*s} ${x+40*s},${G-118*s}`,C.near)
    +R(x-22*s,G-88*s,4*s,44*s,C.near)+R(x+18*s,G-88*s,4*s,44*s,C.near);
  o+=hut(640,1)+hut(790,.85)+hut(930,.7);
  return o+palm(150,G-90,1.3,C.near)+palm(250,G-90,1,C.near)+palm(330,G-90,.8,C.mid);};
A.baobab=(r,C)=>{                                    /* Madagascar / Sahel */
  let o=hills(C,G-6,20,4,C.far)+R(0,G,W,H-G,C.near);
  const bb=(x: number,s: number,f: string)=>{let m=D(`M${x-34*s} ${G} q${10*s} ${-140*s} ${2*s} ${-190*s} l${64*s} 0 q${-8*s} ${50*s} ${2*s} ${190*s} Z`,f);
    for(let k=0;k<7;k++){const a=-Math.PI+k*Math.PI/6;m+=L(`M${x} ${G-190*s} q${Math.cos(a)*30*s} ${Math.sin(a)*24*s-16*s} ${Math.cos(a)*54*s} ${-14*s}`,f,4*s);}return m;};
  return o+bb(250,1.15,C.near)+bb(520,.85,C.near)+bb(760,1,C.mid)+bb(980,.65,C.mid);};
A.dunes=(r,C)=>{                                     /* Sahara / desert */
  let o=C_(300,200,52,C.acc,.92)+C_(300,200,140,C.acc,.12);
  o+=D(`M0 ${G-60} q300 -120 600 -20 q300 100 600 -10 L${W} ${H} L0 ${H} Z`,C.far);
  o+=D(`M0 ${G+10} q260 -90 520 -6 q340 110 680 -30 L${W} ${H} L0 ${H} Z`,C.mid);
  o+=D(`M0 ${G+90} q320 -110 640 -10 q280 90 560 -40 L${W} ${H} L0 ${H} Z`,C.near);
  const cam=(x: number,s: number)=>D(`M${x} ${G+52} l0 ${-22*s} q${-4*s} ${-14*s} ${10*s} ${-14*s} q${8*s} ${-12*s} ${16*s} 0 l${18*s} 0 q${10*s} ${-14*s} ${16*s} ${2*s} l${4*s} ${12*s} q${8*s} ${4*s} ${6*s} ${20*s} l0 ${2*s}`,'none')
    +D(`M${x-2*s} ${G+52} l${2*s} ${-26*s} q${6*s} ${-16*s} ${20*s} ${-16*s} l${26*s} 0 q${14*s} 0 ${18*s} ${14*s} l${4*s} ${28*s} l${-6*s} 0 l${-4*s} ${-20*s} l${-30*s} 0 l${-4*s} ${20*s} Z`,C.near);
  return o+cam(700,1.1)+cam(800,.9)+cam(880,.75);};
A.rainforest=(r,C)=>{                                /* Amazon / Congo basin */
  let o=R(0,0,W,H,C.far,.001);
  for(let k=0;k<3;k++)o+=L(`M0 ${180+k*44} Q600 ${140+k*40} ${W} ${190+k*42}`,INK_SOFT,18,.05);
  const canopy=(y: number,f: string,n: number)=>{let d=`M0 ${H} L0 ${y}`;for(let i=1;i<=n;i++){const x=W/n*i;d+=` Q${x-W/n/2} ${y-70} ${x} ${y-10}`;}return D(d+` L${W} ${H} Z`,f);};
  o+=canopy(340,C.far,5)+canopy(430,C.mid,7);
  o+=water(C,G+40);
  o+=canopy(G-40,C.near,9);
  for(let i=0;i<5;i++){const x=140+i*230;o+=R(x-4,G-160,8,120,C.near)+D(`M${x-56} ${G-160} q56 -40 112 0 q-56 14 -112 0 Z`,C.near);}
  return o;};
A.patagonia=(r,C)=>{                                 /* Southern Andes */
  let o=P(`-40,${G} 200,300 420,${G}`,C.far);
  o+=P(`260,${G-60} 380,180 430,${G-60}`,C.mid)+P(`400,${G-60} 560,110 640,${G-60}`,C.near)+P(`600,${G-60} 730,190 800,${G-60}`,C.mid);
  o+=P(`560,110 610,190 585,184 560,206 536,182 512,188`,C.acc,.85);
  o+=P(`820,${G} 1040,280 1260,${G}`,C.far);
  o+=water(C,G-60);
  return o+pine(150,G,1,C.near)+pine(1050,G,.9,C.near);};
A.rockies=(r,C)=>{                                   /* Canada / northern ranges */
  let o=P(`-40,${G} 180,200 420,${G}`,C.mid)+P(`300,${G} 560,130 820,${G}`,C.near)+P(`700,${G} 980,220 1260,${G}`,C.mid);
  o+=P(`560,130 620,215 592,208 560,240 528,206 500,212`,C.acc,.9);
  o+=P(`180,200 226,268 204,262 180,286 156,260 134,266`,C.acc,.7);
  o+=water(C,G-24);
  let f='';for(let i=0;i<9;i++)f+=pine(70+i*145,G-24,.9+((i*37)%40)/100,C.near);
  return o+f;};
A.marina=(r,C)=>{                                    /* Singapore */
  let o='';for(let i=0;i<12;i++)o+=R(60+i*96,G-90-((i*73)%140),70,260,C.far);
  const x=560;
  [0,110,220].forEach(dx=>o+=R(x+dx-32,G-320,64,320,C.mid));
  o+=D(`M${x-70} ${G-320} q160 -46 370 -10 l0 22 q-210 -34 -370 12 Z`,C.near);
  o+=water(C,G-20);
  return o;};
A.lighthouse=(r,C)=>{                                /* Atlantic coasts */
  let o=water(C,G-40);
  o+=P(`0,${G-40} 0,300 260,360 420,${G-40}`,C.mid);
  const x=170,b=300;
  o+=P(`${x-22},${b} ${x+22},${b} ${x+13},${b-150} ${x-13},${b-150}`,C.near);
  o+=R(x-19,b-176,38,26,C.near)+C_(x,b-163,9,C.acc,.95);
  o+=P(`${x-19},${b-176} ${x},${b-208} ${x+19},${b-176}`,C.near);
  o+=D(`M${x+18} ${b-166} l190 -46 l0 92 Z`,C.acc,.13);
  o+=P(`${W},${G-40} ${W},340 940,390 800,${G-40}`,C.near);
  return o;};
A.terraces=(r,C)=>{                                  /* rice terraces */
  let o=hills(C,G-120,60,3,C.far);
  for(let i=0;i<9;i++){const y=G-140+i*22;
    o+=D(`M0 ${y} q300 ${-30-i*3} 600 0 q300 ${30+i*3} 600 0 L${W} ${y+22} q-300 ${30+i*3} -600 0 q-300 ${-30-i*3} -600 0 Z`,i%2?C.mid:C.near);}
  o+=palm(120,G-40,.9,C.near)+palm(1090,G-50,.8,C.near);
  return o;};
A.volcano=(r,C)=>{                                   /* volcanic islands */
  let o=hills(C,G-30,30,4,C.far);
  o+=P(`260,${G} 580,150 900,${G}`,C.mid)+P(`520,166 580,150 640,166 600,178 560,178`,C.acc,.5);
  for(let k=0;k<3;k++)o+=D(`M${570+k*8} ${140-k*10} q-30 -40 ${10+k*6} -70 q40 26 20 70 Z`,INK_SOFT,.09);
  o+=P(`820,${G} 1030,300 1240,${G}`,C.far);
  return o+palm(160,G,1,C.near)+palm(1060,G,.85,C.near);};
A.saltflat=(r,C)=>{                                  /* Bolivia */
  let o=C_(860,200,50,C.acc,.9);
  o+=P(`0,${G-90} 240,290 460,${G-90}`,C.far)+P(`620,${G-90} 880,320 1140,${G-90}`,C.far);
  o+=R(0,G-90,W,H,C.wat);
  o+=P(`0,${G-90} 240,${G+110} 460,${G-90}`,C.far,.35)+P(`620,${G-90} 880,${G+80} 1140,${G-90}`,C.far,.3);
  o+=C_(860,G+60,42,C.acc,.22);
  for(let i=0;i<7;i++)o+=L(`M${60+i*170} ${G-40+i*22} h120`,INK_SOFT,1,.09);
  return o;};
A.falls=(r,C)=>{                                     /* Victoria / Iguazu */
  let o=hills(C,G-140,40,4,C.far);
  o+=R(0,G-140,W,26,C.mid);
  for(let i=0;i<16;i++){const x=90+i*66,w=30+((i*29)%26);o+=R(x,G-114,w,150,INK_SOFT,.13+((i*17)%20)/160);}
  o+=R(0,G-114,90,150,C.near)+R(1130,G-114,70,150,C.near);
  o+=D(`M0 ${G+36} q300 -46 600 0 q300 46 600 0 L${W} ${H} L0 ${H} Z`,C.near);
  for(let k=0;k<4;k++)o+=D(`M${140+k*220} ${G+30} q60 -50 130 -6 q-70 26 -130 6 Z`,INK_SOFT,.07);
  return o;};
A.steppe=(r,C)=>{                                    /* Mongolia / Central Asia */
  let o=hills(C,G-70,50,3,C.far)+hills(C,G-10,26,4,C.mid)+R(0,G,W,H-G,C.near);
  const yurt=(x: number,s: number,f: string)=>R(x-46*s,G-52*s,92*s,52*s,f)+D(`M${x-56*s} ${G-52*s} q${56*s} ${-46*s} ${112*s} 0 Z`,f)+R(x-6*s,G-104*s,12*s,10*s,f);
  o+=yurt(320,1.1,C.near)+yurt(520,.75,C.near)+yurt(660,.55,C.mid);
  o+=D(`M900 ${G} l4 -38 l-14 -20 l8 -6 l16 16 l30 0 l14 -14 l8 6 l-10 22 l6 34 l-8 0 l-6 -28 l-30 0 l-6 28 Z`,C.near);
  return o;};
A.mesa=(r,C)=>{                                      /* Wadi Rum / AlUla / canyon */
  let o=C_(950,210,48,C.acc,.9);
  const butte=(x: number,w: number,h: number,f: string)=>D(`M${x-w/2} ${G} l${w*.08} ${-h} l${w*.84} 0 l${w*.08} ${h} Z`,f);
  o+=butte(220,300,190,C.far)+butte(900,260,150,C.far);
  o+=butte(480,340,260,C.mid)+butte(1080,300,200,C.mid);
  o+=butte(700,240,320,C.near)+butte(170,220,150,C.near);
  o+=D(`M0 ${G} q300 -30 600 0 q300 30 600 0 L${W} ${H} L0 ${H} Z`,C.near);
  return o;};
A.cityscape=(r,C)=>{                                 /* modern city fallback */
  let o='';
  for(let i=0;i<18;i++)o+=R(i*70,G-60-((i*97)%150),58,220,C.far);
  for(let i=0;i<12;i++)o+=R(30+i*100,G-90-((i*137)%210),78,300,C.mid);
  for(let i=0;i<7;i++){const bh=180+((i*191)%230);o+=R(120+i*150,G-bh,96,bh,C.near);
    for(let k=0;k<5;k++)o+=R(132+i*150,G-bh+18+k*30,72,8,C.acc,.09);}
  return o+R(0,G,W,H-G,C.near);};
A.sail=(r,C)=>{                                      /* dhow / coastal trade */
  let o=C_(310,200,52,C.acc,.9)+C_(310,200,140,C.acc,.12)+water(C,G-60);
  const boat=(x: number,s: number,f: string)=>D(`M${x-70*s} ${G-60} q${70*s} ${26*s} ${140*s} 0 Z`,f)+L(`M${x} ${G-60} v${-120*s}`,f,3*s)
    +D(`M${x+4*s} ${G-176*s-4} l${86*s} ${112*s} l${-86*s} 0 Z`,f)+D(`M${x-6*s} ${G-140*s} l${-52*s} ${76*s} l${52*s} 0 Z`,f);
  o+=boat(760,1.2,C.near)+boat(980,.8,C.mid);
  return o+palm(120,G-60,1.2,C.near)+palm(210,G-60,.9,C.near);};
A.cliffs=(r,C)=>{                                    /* Ireland / Atlantic cliffs */
  let o=water(C,G-20);
  o+=P(`0,${G-20} 0,220 180,250 300,300 420,${G-20}`,C.mid);
  o+=P(`0,${G-20} 0,320 150,340 260,390 340,${G-20}`,C.near);
  o+=P(`${W},${G-20} ${W},260 1020,300 900,${G-20}`,C.mid);
  o+=P(`760,${G-20} 800,360 860,${G-20}`,C.near);
  for(let i=0;i<9;i++)o+=C_(500+i*60,300+((i*53)%90),2.6,INK_SOFT,.4);
  return o;};

export type ArtTheme = 'light' | 'dark';

export function destArt(name: string, uid: string, theme: ArtTheme = 'light'): string {
  const h = hash32(name), r = rngFrom(h);
  const spec = LM[name] || ["cityscape", 215] as [string, number];
  const hue = (spec[1] + (h % 31) - 15 + 360) % 360;

  /**
   * Light-theme palette. The scene builders layer far -> mid -> near, so
   * that ordering still has to read as depth; what changes is the whole
   * lightness ramp. Instead of pale shapes emerging from a near-black sky,
   * the sky is now pale and the landmark silhouettes get progressively
   * darker and more saturated toward the foreground.
   *
   * `acc` (sun, snow caps, lit windows) was a near-white highlight against
   * darkness. On a pale sky a light accent is invisible, so it inverts to a
   * saturated mid-tone that reads as a warm light source instead.
   */
  const dark = theme === 'dark';
  /**
   * The dark ramp is the original prototype relationship restored: a
   * near-black sky with silhouettes getting *paler* toward the foreground,
   * and `acc` back to a near-white highlight for sun, snow caps and lit
   * windows. The light ramp above is the inverse.
   */
  const C: Palette = dark
    ? {
        sky: `hsl(${hue},30%,8%)`, mid2: `hsl(${(hue+22)%360},26%,13%)`,
        far: `hsl(${hue},16%,23%)`, mid: `hsl(${(hue+8)%360},15%,35%)`,
        near: `hsl(${(hue+14)%360},17%,50%)`, wat: `hsl(${hue},20%,16%)`,
        acc: `hsl(${(hue+42)%360},32%,80%)`
      }
    : {
        sky: `hsl(${hue},58%,91%)`, mid2: `hsl(${(hue+22)%360},48%,84%)`,
        far: `hsl(${hue},26%,74%)`, mid: `hsl(${(hue+8)%360},24%,58%)`,
        near: `hsl(${(hue+14)%360},26%,38%)`, wat: `hsl(${hue},34%,79%)`,
        acc: `hsl(${(hue+42)%360},46%,70%)`
      };
  const sunX=(160+r()*880).toFixed(0), sunY=(120+r()*130).toFixed(0), sunR=(30+r()*26).toFixed(0);
  const scene=(A[spec[0]]||A.cityscape)(r,C);
  // The star field consumes four draws per star either way, so both themes
  // land on identical geometry -- consuming a different amount of
  // randomness here would reshuffle all 137 scenes. Light simply discards
  // them: faint white dots are invisible against a pale sky.
  let stars = '';
  for (let i = 0; i < 38; i++) {
    const sx = (r() * W).toFixed(0), sy = (r() * G * 0.62).toFixed(0);
    const sr = (0.6 + r() * 1.15).toFixed(2), so = (0.25 + r() * 0.5).toFixed(2);
    if (dark) stars += `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="#FFF" opacity="${so}"/>`;
  }
  const foot = dark ? '#07080A' : '#FBFCFD';
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
   <defs><linearGradient id="sk${uid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${C.sky}"/><stop offset=".54" stop-color="${C.mid2}"/><stop offset="1" stop-color="${foot}"/></linearGradient>
   <radialGradient id="su${uid}"><stop offset="0" stop-color="${C.acc}" stop-opacity=".38"/><stop offset="1" stop-color="${C.acc}" stop-opacity="0"/></radialGradient></defs>
   <rect width="${W}" height="${H}" fill="url(#sk${uid})"/>
   ${stars}
   <circle cx="${sunX}" cy="${sunY}" r="${Number(sunR)*3.4}" fill="url(#su${uid})"/>
   <circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${C.acc}" opacity=".55"/>
   ${scene}</svg>`;
}

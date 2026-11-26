# Navy-on-kraft halftone duotone, same maths as the direction-3 SVG filter, rendered ahead of time.
import sys, math, os
from PIL import Image
NAVY=(0x1F,0x2A,0x44); KRAFT=(0xC9,0xA7,0x7C); GAMMA=.5
PAL=Image.new('P',(1,1)); PAL.putpalette(list(NAVY)+list(KRAFT)+[0]*762)
def halftone(src, dst, width, pitch, darken=1.0):
    im = Image.open(src).convert('RGB')
    h = round(im.height * width / im.width)
    im = im.resize((width, h), Image.LANCZOS)
    px = im.load()
    out = Image.new('RGB', (width, h)); op = out.load()
    c = math.cos(math.pi/4); s = math.sin(math.pi/4)
    for y in range(h):
        for x in range(width):
            r,g,b = px[x,y]
            lum = (.30*r + .55*g + .15*b) / 255 * darken
            lum = min(1.0, lum ** GAMMA)
            # rotate 45deg, position inside the cell, distance from cell centre
            u = (x*c + y*s) / pitch; v = (-x*s + y*c) / pitch
            du = (u - math.floor(u)) - .5; dv = (v - math.floor(v)) - .5
            d = min(1.0, math.hypot(du, dv) / .707)
            t = 7*(lum + d - .5) - 3
            op[x,y] = KRAFT if t >= .5 else NAVY
    out = out.quantize(palette=PAL, dither=Image.Dither.NONE)
    out.save(dst, 'PNG', optimize=True, bits=1)
    return os.path.getsize(dst)
if __name__ == '__main__':
    src, dst, w, p = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4])
    dk = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
    print(dst, halftone(src, dst, w, p, dk))

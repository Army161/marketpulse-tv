"""Generate Roku channel focus icons + splash screens for MarketPulse TV.

Brand: Midnight palette (deep navy bg #070B12 + gold accent #F7C948 + emerald up #34D399).
Composition: dark gradient bg, gold wordmark, candle-chart accent row,
communicates 'live finance'.

Generates at EXACT Roku required dimensions and saves over existing placeholders.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, "..", "apps", "roku", "images"))

BG_TOP = (7, 11, 18)
BG_MID = (12, 18, 30)
BG_BOT = (5, 8, 14)
GOLD = (247, 201, 72)
EMERALD = (52, 211, 153)
ROSE = (244, 63, 94)
WHITE = (240, 246, 255)

ICONS = [
    ("icon_focus_sd.png", 248, 140),
    ("icon_focus_hd.png", 290, 218),
    ("icon_focus_fhd.png", 540, 405),
]
SPLASHES = [
    ("splash_sd.png", 720, 480),
    ("splash_hd.png", 1280, 720),
    ("splash_fhd.png", 1920, 1080),
]


def vgrad(w, h, top, mid, bot):
    img = Image.new("RGB", (w, h), top)
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        if t < 0.5:
            k = t / 0.5
            r = int(top[0] + (mid[0] - top[0]) * k)
            g = int(top[1] + (mid[1] - top[1]) * k)
            b = int(top[2] + (mid[2] - top[2]) * k)
        else:
            k = (t - 0.5) / 0.5
            r = int(mid[0] + (bot[0] - mid[0]) * k)
            g = int(mid[1] + (bot[1] - mid[1]) * k)
            b = int(mid[2] + (bot[2] - mid[2]) * k)
        for x in range(w):
            px[x, y] = (r, g, b)
    return img


def radial_glow(size, color, intensity=80, radius_pct=0.55):
    w, h = size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = w // 2, int(h * 0.35)
    R = int(min(w, h) * radius_pct)
    for r in range(R, 0, -2):
        a = int(intensity * (1 - r / R) ** 2)
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (a,))
    return layer.filter(ImageFilter.GaussianBlur(R * 0.18))


def try_font(size):
    for p in [
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\seguibl.ttf",
        r"C:\Windows\Fonts\impact.ttf",
    ]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def candle(draw, x, y_open, y_close, y_high, y_low, w, color):
    draw.line(
        [(x + w // 2, y_high), (x + w // 2, y_low)],
        fill=color,
        width=max(1, w // 6),
    )
    top = min(y_open, y_close)
    bot = max(y_open, y_close)
    if bot - top < 2:
        bot = top + 2
    draw.rectangle([x, top, x + w, bot], fill=color)


PAT = [
    (0.35, 0.55, 0.30, 0.62, EMERALD),
    (0.50, 0.40, 0.32, 0.60, ROSE),
    (0.30, 0.20, 0.15, 0.45, EMERALD),
    (0.25, 0.42, 0.20, 0.50, ROSE),
    (0.40, 0.18, 0.15, 0.55, EMERALD),
    (0.18, 0.30, 0.15, 0.48, ROSE),
    (0.32, 0.10, 0.08, 0.40, EMERALD),
    (0.12, 0.28, 0.10, 0.38, EMERALD),
]


def draw_icon(w, h):
    img = vgrad(w, h, BG_TOP, BG_MID, BG_BOT).convert("RGBA")
    img = Image.alpha_composite(img, radial_glow((w, h), GOLD, intensity=70))
    d = ImageDraw.Draw(img)

    pad = max(2, w // 60)
    bw = max(1, h // 80)
    d.line([(pad, pad), (pad + w // 5, pad)], fill=GOLD, width=bw)
    d.line([(pad, pad), (pad, pad + h // 5)], fill=GOLD, width=bw)
    d.line([(w - pad - w // 5, h - pad), (w - pad, h - pad)], fill=GOLD, width=bw)
    d.line([(w - pad, h - pad - h // 5), (w - pad, h - pad)], fill=GOLD, width=bw)

    chart_h = int(h * 0.32)
    chart_top = int(h * 0.55)
    cwid = max(2, w // 28)
    gap = max(1, cwid // 2)
    n = (w - 2 * pad) // (cwid + gap)
    x = pad + (w - 2 * pad - n * (cwid + gap)) // 2
    for i in range(n):
        po, pc, ph, pl, color = PAT[i % len(PAT)]
        yo = chart_top + int(chart_h * po)
        yc = chart_top + int(chart_h * pc)
        yh = chart_top + int(chart_h * ph)
        yl = chart_top + int(chart_h * pl)
        candle(d, x, yo, yc, yh, yl, cwid, color)
        x += cwid + gap

    if w >= 380:
        title = "MARKETPULSE"
        sub = "TV"
        f1 = try_font(int(h * 0.16))
        f2 = try_font(int(h * 0.10))
        bbox = d.textbbox((0, 0), title, font=f1)
        d.text(((w - (bbox[2] - bbox[0])) // 2, int(h * 0.18)), title, font=f1, fill=GOLD)
        b2 = d.textbbox((0, 0), sub, font=f2)
        d.text(((w - (b2[2] - b2[0])) // 2, int(h * 0.36)), sub, font=f2, fill=WHITE)
    else:
        f1 = try_font(int(h * 0.50))
        f2 = try_font(int(h * 0.16))
        title = "MP"
        bbox = d.textbbox((0, 0), title, font=f1)
        d.text(((w - (bbox[2] - bbox[0])) // 2, int(h * 0.05)), title, font=f1, fill=GOLD)
        sub = "TV"
        b2 = d.textbbox((0, 0), sub, font=f2)
        d.text(((w - (b2[2] - b2[0])) // 2, int(h * 0.50)), sub, font=f2, fill=WHITE)

    return img.convert("RGB")


def draw_splash(w, h):
    img = vgrad(w, h, BG_TOP, BG_MID, BG_BOT).convert("RGBA")
    img = Image.alpha_composite(img, radial_glow((w, h), GOLD, intensity=90, radius_pct=0.5))
    d = ImageDraw.Draw(img)

    pad = max(20, w // 50)
    arm = max(40, w // 14)
    bw = max(2, h // 200)
    d.line([(pad, pad), (pad + arm, pad)], fill=GOLD, width=bw)
    d.line([(pad, pad), (pad, pad + arm)], fill=GOLD, width=bw)
    d.line([(w - pad - arm, h - pad), (w - pad, h - pad)], fill=GOLD, width=bw)
    d.line([(w - pad, h - pad - arm), (w - pad, h - pad)], fill=GOLD, width=bw)

    chart_h = int(h * 0.18)
    chart_top = int(h * 0.62)
    cwid = max(6, w // 55)
    gap = max(2, cwid // 2)
    n = int(w * 0.7) // (cwid + gap)
    x = (w - n * (cwid + gap)) // 2
    for i in range(n):
        po, pc, ph, pl, color = PAT[i % len(PAT)]
        yo = chart_top + int(chart_h * po)
        yc = chart_top + int(chart_h * pc)
        yh = chart_top + int(chart_h * ph)
        yl = chart_top + int(chart_h * pl)
        candle(d, x, yo, yc, yh, yl, cwid, color)
        x += cwid + gap

    title = "MARKETPULSE"
    sub = "TV  -  Live Markets"
    f1 = try_font(int(h * 0.13))
    f2 = try_font(int(h * 0.045))
    bbox = d.textbbox((0, 0), title, font=f1)
    d.text(((w - (bbox[2] - bbox[0])) // 2, int(h * 0.30)), title, font=f1, fill=GOLD)
    b2 = d.textbbox((0, 0), sub, font=f2)
    d.text(((w - (b2[2] - b2[0])) // 2, int(h * 0.46)), sub, font=f2, fill=WHITE)

    return img.convert("RGB")


def main():
    for name, w, h in ICONS:
        img = draw_icon(w, h)
        path = os.path.join(OUT, name)
        img.save(path, "PNG", optimize=True)
        print("WROTE " + name + "  " + str(w) + "x" + str(h))
    for name, w, h in SPLASHES:
        img = draw_splash(w, h)
        path = os.path.join(OUT, name)
        img.save(path, "PNG", optimize=True)
        print("WROTE " + name + "  " + str(w) + "x" + str(h))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Generate the raster UI skin used by Chess Chess Revolution.

The values in the CONFIG section intentionally read like CSS declarations.  All
measurements are expressed in the 1024 x 1536 reference coordinate system and
are rasterized at OUTPUT_SCALE (2x by default). Polygon masks and transformed
lettering are supersampled at ANTIALIAS_SCALE and downsampled once with Lanczos.
The generated PNGs are ordinary RGBA images; the two reusable frames are
designed to be consumed as 9-slices using the insets printed by this script.

Requires Pillow:  python3 -m pip install Pillow
"""

from __future__ import annotations

import argparse
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Sequence

try:
    from PIL import Image, ImageChops, ImageColor, ImageDraw, ImageFilter, ImageFont
except ImportError as exc:  # pragma: no cover - useful message on a clean machine
    raise SystemExit("Pillow is required: python3 -m pip install Pillow") from exc


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = ROOT / "public" / "generated-ui"
FONT_FILE = ROOT / "public" / "fonts" / "barlow-condensed-800-italic.ttf"


# ---------------------------------------------------------------------------
# CONFIG — edit these declarations, then rerun this file.
# ---------------------------------------------------------------------------

OUTPUT_SCALE = 2
ANTIALIAS_SCALE = 2


@dataclass(frozen=True)
class LinearGradient:
    angle: float
    stops: tuple[tuple[float, str], ...]


@dataclass(frozen=True)
class DropShadow:
    x: float
    y: float
    blur: float
    color: str


@dataclass(frozen=True)
class FrameStyle:
    width: int
    height: int
    outer_clip: tuple[tuple[float, float], ...]
    inner_clip: tuple[tuple[float, float], ...]
    border_width: float
    border: LinearGradient
    interior: LinearGradient
    inner_shadow: float
    glow: tuple[DropShadow, ...]
    slice_insets: tuple[int, int, int, int] | None = None  # top, right, bottom, left


# Equivalent to app/components/styles.ts::frameClipPoints.
ARCADE_FRAME_CLIP = (
    (4.5, 0), (14.7, 0), (17, 1.9), (83, 1.9), (85.3, 0), (95.5, 0),
    (100, 3.2), (100, 18.7), (98.1, 20), (98.1, 98.6), (96.5, 100),
    (3.5, 100), (1.9, 98.6), (1.9, 20), (0, 18.7), (0, 3.2),
)

ARCADE_SCREEN_CSS = {
    "width": 1024,
    "height": 1536,
    "inset": 21,
    "bottom": 111,
    "border-width": 8,
    "clip-path": ARCADE_FRAME_CLIP,
    "background": LinearGradient(110, (
        (0, "#f4ffff"), (4, "#53dcff"), (12, "#0874ef"),
        (18, "#09234c"), (32, "#19ddff"), (50, "#e9fbff"),
        (64, "#806cff"), (83, "#ff39c9"), (96, "#ffd4f4"),
        (100, "#ff5ec2"),
    )),
    "filter": (
        DropShadow(0, 0, 10, "#368dffb3"),
        DropShadow(0, 0, 9, "#ff2ac061"),
    ),
}

LOGO_CSS = {
    "canvas": (900, 360),
    "font-family": FONT_FILE,
    "font-size": 160,
    "font-weight": 800,
    "font-style": "italic",
    "line-height": 0.74,
    "letter-spacing": -4,
    "transform": {"scale-x": 1.02, "scale-y": 0.90, "skew-x": -5},
    "background": LinearGradient(174, (
        (2, "#ffffff"), (20, "#e5f5ff"), (38, "#74c9ff"),
        (51, "#f8fbff"), (70, "#8d72ff"), (94, "#ff68d9"),
    )),
    "-webkit-text-stroke": (1.4, "#f9ffff"),
    "filter": (
        DropShadow(4, 6, 0, "#092463"),
        DropShadow(-3, -2, 0, "#61096a"),
        DropShadow(0, 12, 8, "#000000"),
    ),
    "lines": ("CHESS CHESS", "REVOLUTION"),
}

ACTION_BUTTON_CSS = FrameStyle(
    width=760,
    height=140,
    outer_clip=((18, 0), (742, 0), (760, 17), (760, 123),
                (742, 140), (18, 140), (0, 123), (0, 17)),
    inner_clip=((14, 0), (734, 0), (748, 13), (748, 115),
                (734, 128), (14, 128), (0, 115), (0, 13)),
    border_width=6,
    border=LinearGradient(110, ((0, "#b9fbff"), (22, "#3bb9ff"),
                                (56, "#a49cff"), (90, "#ff4bd1"))),
    interior=LinearGradient(180, ((0, "#071027"), (100, "#020613"))),
    inner_shadow=27,
    glow=(DropShadow(0, 0, 10, "#3a9affa6"),),
    slice_insets=(24, 26, 24, 26),
)

SETTINGS_PANEL_CSS = FrameStyle(
    width=887,
    height=1021,
    outer_clip=((0, 0), (887, 0), (887, 1005.685), (872.808, 1021),
                (13.305, 1021), (0, 1005.685)),
    inner_clip=((0, 0), (883, 0), (883, 1001.99), (867.548, 1017),
                (11.921, 1017), (0, 1000.728)),
    border_width=2,
    border=LinearGradient(110, ((0, "#446690"), (54, "#2c456f"), (100, "#875984"))),
    interior=LinearGradient(180, ((0, "#041126"), (100, "#020b1b"))),
    inner_shadow=45,
    glow=(DropShadow(0, 0, 5, "#1c59b447"),),
)

SMALL_CONTROL_CSS = FrameStyle(
    width=396,
    height=106,
    outer_clip=((10, 0), (386, 0), (396, 10), (396, 96),
                (386, 106), (10, 106), (0, 96), (0, 10)),
    inner_clip=((7, 0), (383, 0), (390, 7), (390, 93),
                (383, 100), (7, 100), (0, 93), (0, 7)),
    border_width=3,
    border=LinearGradient(106, ((0, "#5df5ff"), (48, "#a5cbff"), (100, "#ff4bc9"))),
    interior=LinearGradient(180, ((0, "#050b1c"), (100, "#020611"))),
    inner_shadow=24,
    glow=(DropShadow(0, 0, 6, "#2a67ff61"),),
    slice_insets=(15, 15, 15, 15),
)


# ---------------------------------------------------------------------------
# Raster helpers
# ---------------------------------------------------------------------------

RGBA = tuple[int, int, int, int]


def rgba(value: str) -> RGBA:
    color = ImageColor.getcolor(value, "RGBA")
    return color[0], color[1], color[2], color[3]


def mix(a: RGBA, b: RGBA, amount: float) -> RGBA:
    return tuple(round(a[i] + (b[i] - a[i]) * amount) for i in range(4))  # type: ignore[return-value]


def gradient_lut(stops: Sequence[tuple[float, str]], length: int) -> list[RGBA]:
    normalized = sorted((position / 100, rgba(color)) for position, color in stops)
    result: list[RGBA] = []
    cursor = 0
    for index in range(length):
        t = index / max(1, length - 1)
        while cursor + 1 < len(normalized) and t > normalized[cursor + 1][0]:
            cursor += 1
        left = normalized[cursor]
        right = normalized[min(cursor + 1, len(normalized) - 1)]
        local = 0 if right[0] == left[0] else (t - left[0]) / (right[0] - left[0])
        result.append(mix(left[1], right[1], max(0, min(1, local))))
    return result


def linear_gradient(size: tuple[int, int], declaration: LinearGradient) -> Image.Image:
    """Fast multi-stop gradient, rotated and center-cropped like CSS."""
    width, height = size
    radians = math.radians(declaration.angle - 90)
    span = max(2, math.ceil(abs(width * math.cos(radians)) + abs(height * math.sin(radians))))
    # The square must contain the target after rotation.  Keep the CSS gradient's
    # active span centered within that larger square so narrow vertical gradients
    # do not accidentally acquire transparent side bands when cropped.
    diameter = max(span, math.ceil(math.hypot(width, height)))
    active = gradient_lut(declaration.stops, span)
    pad = (diameter - span) // 2
    pixels = [active[0]] * pad + active + [active[-1]] * (diameter - pad - span)
    line = Image.new("RGBA", (diameter, 1))
    line.putdata(pixels)
    square = line.resize((diameter, diameter))
    rotated = square.rotate(-radians * 180 / math.pi, resample=Image.Resampling.BICUBIC,
                            expand=True, fillcolor=rgba(declaration.stops[0][1]))
    left = (rotated.width - width) // 2
    top = (rotated.height - height) // 2
    return rotated.crop((left, top, left + width, top + height))


def scaled_points(points: Iterable[tuple[float, float]], scale: int) -> list[tuple[int, int]]:
    return [(round(x * scale), round(y * scale)) for x, y in points]


def percent_polygon(points: Iterable[tuple[float, float]], box: tuple[float, float, float, float],
                    scale: int) -> list[tuple[int, int]]:
    x, y, width, height = box
    return [(round((x + px / 100 * width) * scale), round((y + py / 100 * height) * scale))
            for px, py in points]


def polygon_mask(
    size: tuple[int, int],
    points: Iterable[tuple[float, float]],
    scale: int,
    antialias_scale: int = 1,
) -> Image.Image:
    render_scale = scale * antialias_scale
    mask = Image.new("L", (size[0] * render_scale, size[1] * render_scale), 0)
    ImageDraw.Draw(mask).polygon(scaled_points(points, render_scale), fill=255)
    if antialias_scale > 1:
        mask = mask.resize((size[0] * scale, size[1] * scale), Image.Resampling.LANCZOS)
    return mask


def percent_polygon_mask(
    size: tuple[int, int],
    points: Iterable[tuple[float, float]],
    box: tuple[float, float, float, float],
    scale: int,
    antialias_scale: int,
) -> Image.Image:
    render_scale = scale * antialias_scale
    mask = Image.new("L", (size[0] * render_scale, size[1] * render_scale), 0)
    ImageDraw.Draw(mask).polygon(percent_polygon(points, box, render_scale), fill=255)
    if antialias_scale > 1:
        mask = mask.resize((size[0] * scale, size[1] * scale), Image.Resampling.LANCZOS)
    return mask


def apply_mask(paint: Image.Image, mask: Image.Image) -> Image.Image:
    layer = paint.copy()
    layer.putalpha(ImageChops.multiply(paint.getchannel("A"), mask))
    return layer


def colored_shadow(mask: Image.Image, declaration: DropShadow, scale: int) -> Image.Image:
    blurred = mask.filter(ImageFilter.GaussianBlur(declaration.blur * scale)) if declaration.blur else mask
    color = rgba(declaration.color)
    alpha = blurred.point(lambda value: round(value * color[3] / 255))
    layer = Image.new("RGBA", mask.size, color[:3] + (0,))
    layer.putalpha(alpha)
    shifted = Image.new("RGBA", mask.size)
    shifted.alpha_composite(layer, (round(declaration.x * scale), round(declaration.y * scale)))
    return shifted


def add_inner_shadow(image: Image.Image, interior_mask: Image.Image, blur: float, scale: int) -> None:
    if blur <= 0:
        return
    edge = ImageChops.subtract(interior_mask, interior_mask.filter(ImageFilter.GaussianBlur(blur * scale)))
    # A broad low-opacity black veil gives the same restrained CSS inset shading.
    edge = edge.point(lambda value: min(175, value * 2))
    black = Image.new("RGBA", image.size, (0, 0, 0, 0))
    black.putalpha(edge)
    image.alpha_composite(black)


def render_frame(style: FrameStyle, scale: int, antialias_scale: int) -> Image.Image:
    size = (style.width * scale, style.height * scale)
    outer = polygon_mask(
        (style.width, style.height), style.outer_clip, scale, antialias_scale
    )

    inset = style.border_width
    inner_points = [(x + inset, y + inset) for x, y in style.inner_clip]
    inner = polygon_mask(
        (style.width, style.height), inner_points, scale, antialias_scale
    )

    result = Image.new("RGBA", size)
    for shadow in style.glow:
        result.alpha_composite(colored_shadow(outer, shadow, scale))

    border = apply_mask(linear_gradient(size, style.border), outer)
    result.alpha_composite(border)
    interior = apply_mask(linear_gradient(size, style.interior), inner)
    result.alpha_composite(interior)
    add_inner_shadow(result, inner, style.inner_shadow, scale)
    return result


def render_arcade_frame(scale: int, antialias_scale: int) -> Image.Image:
    css = ARCADE_SCREEN_CSS
    width, height = css["width"], css["height"]
    size = (width * scale, height * scale)
    inset = css["inset"]
    bottom = css["bottom"]
    border_width = css["border-width"]
    box = (inset, inset, width - inset * 2, height - inset - bottom)
    inner_box = (inset + border_width, inset + border_width,
                 box[2] - border_width * 2, box[3] - border_width * 2)

    outer = percent_polygon_mask(
        (width, height), css["clip-path"], box, scale, antialias_scale
    )
    inner = percent_polygon_mask(
        (width, height), css["clip-path"], inner_box, scale, antialias_scale
    )
    rail = ImageChops.subtract(outer, inner)

    result = Image.new("RGBA", size)
    for shadow in css["filter"]:
        result.alpha_composite(colored_shadow(rail, shadow, scale))
    result.alpha_composite(apply_mask(linear_gradient(size, css["background"]), rail))

    # Fine white specular edge on the top/left and dark bevel on the inner edge.
    highlight = ImageChops.subtract(rail, rail.filter(ImageFilter.GaussianBlur(0.75 * scale)))
    highlight_layer = Image.new("RGBA", size, (235, 255, 255, 0))
    highlight_layer.putalpha(highlight.point(lambda value: round(value * 0.50)))
    result.alpha_composite(highlight_layer)
    return result


def letterspaced_mask(text: str, font: ImageFont.FreeTypeFont, spacing: float,
                      stroke_width: int = 0) -> Image.Image:
    widths = [font.getlength(char) for char in text]
    bbox = font.getbbox(text, stroke_width=stroke_width)
    width = math.ceil(sum(widths) + spacing * max(0, len(text) - 1) + stroke_width * 4)
    height = math.ceil(bbox[3] - bbox[1] + stroke_width * 4)
    mask = Image.new("L", (max(1, width), max(1, height)), 0)
    draw = ImageDraw.Draw(mask)
    x = stroke_width * 2
    y = stroke_width * 2 - bbox[1]
    for char, advance in zip(text, widths):
        draw.text((x, y), char, font=font, fill=255, stroke_width=stroke_width, stroke_fill=255)
        x += advance + spacing
    return mask


def affine_logo(mask: Image.Image, scale_x: float, scale_y: float, skew_x: float) -> Image.Image:
    transformed = mask.resize((round(mask.width * scale_x), round(mask.height * scale_y)),
                              Image.Resampling.LANCZOS)
    shear = math.tan(math.radians(skew_x))
    extra = math.ceil(abs(shear) * transformed.height)
    return transformed.transform((transformed.width + extra, transformed.height), Image.Transform.AFFINE,
                                 (1, -shear, min(0, shear) * transformed.height, 0, 1, 0),
                                 Image.Resampling.BICUBIC)


def render_logo(scale: int) -> Image.Image:
    css = LOGO_CSS
    canvas = tuple(dimension * scale for dimension in css["canvas"])
    font = ImageFont.truetype(str(css["font-family"]), css["font-size"] * scale)
    spacing = css["letter-spacing"] * scale
    line_gap = round(css["font-size"] * css["line-height"] * scale)

    masks = [letterspaced_mask(line, font, spacing) for line in css["lines"]]
    raw_width = max(mask.width for mask in masks)
    raw_height = line_gap * (len(masks) - 1) + max(mask.height for mask in masks)
    raw = Image.new("L", (raw_width + 32 * scale, raw_height + 24 * scale), 0)
    for index, mask in enumerate(masks):
        raw.paste(mask, ((raw.width - mask.width) // 2, index * line_gap), mask)

    transform = css["transform"]
    fill_mask = affine_logo(raw, transform["scale-x"], transform["scale-y"], transform["skew-x"])
    stroke_px = max(1, round(css["-webkit-text-stroke"][0] * scale))
    stroke_mask = fill_mask.filter(ImageFilter.MaxFilter(stroke_px * 2 + 1))

    result = Image.new("RGBA", canvas)
    x = (canvas[0] - fill_mask.width) // 2
    y = (canvas[1] - fill_mask.height) // 2
    placed_fill = Image.new("L", canvas, 0)
    placed_stroke = Image.new("L", canvas, 0)
    placed_fill.paste(fill_mask, (x, y))
    placed_stroke.paste(stroke_mask, (x, y))

    # CSS drop-shadow stack, rendered back-to-front.
    for shadow in reversed(css["filter"]):
        result.alpha_composite(colored_shadow(placed_stroke, shadow, scale))

    stroke_color = rgba(css["-webkit-text-stroke"][1])
    stroke_layer = Image.new("RGBA", canvas, stroke_color)
    stroke_layer.putalpha(placed_stroke)
    result.alpha_composite(stroke_layer)

    fill = apply_mask(linear_gradient(canvas, css["background"]), placed_fill)
    result.alpha_composite(fill)
    return result


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=True, compress_level=9, dpi=(144, 144))


def downsample(image: Image.Image, factor: int) -> Image.Image:
    if factor == 1:
        return image
    return image.resize(
        (image.width // factor, image.height // factor), Image.Resampling.LANCZOS
    )


def generate(output_dir: Path, scale: int, antialias_scale: int) -> list[Path]:
    # Large panels only need supersampled masks; their gradients remain perfectly
    # smooth at output resolution. The smaller transformed wordmark is rendered
    # completely supersampled so its stroke, skew, and extrusion share one filter.
    assets = {
        "arcade-screen-frame.png": render_arcade_frame(scale, antialias_scale),
        "game-logo.png": downsample(
            render_logo(scale * antialias_scale), antialias_scale
        ),
        "action-button-frame.png": render_frame(
            ACTION_BUTTON_CSS, scale, antialias_scale
        ),
        "settings-panel-frame.png": render_frame(
            SETTINGS_PANEL_CSS, scale, antialias_scale
        ),
        "small-control-frame.png": render_frame(
            SMALL_CONTROL_CSS, scale, antialias_scale
        ),
    }
    paths: list[Path] = []
    for filename, image in assets.items():
        path = output_dir / filename
        save_png(image, path)
        paths.append(path)
    return paths


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--scale", type=int, default=OUTPUT_SCALE)
    parser.add_argument(
        "--antialias-scale",
        type=int,
        default=ANTIALIAS_SCALE,
        help="geometry/text supersampling multiplier (default: %(default)s)",
    )
    args = parser.parse_args()
    if args.scale < 1:
        parser.error("--scale must be at least 1")
    if args.antialias_scale < 1:
        parser.error("--antialias-scale must be at least 1")

    paths = generate(args.output_dir.resolve(), args.scale, args.antialias_scale)
    for path in paths:
        with Image.open(path) as image:
            print(f"{path.relative_to(ROOT)}  {image.width}x{image.height}  RGBA")
    print(f"action-button-frame.png 9-slice: {ACTION_BUTTON_CSS.slice_insets} CSS px")
    print(f"small-control-frame.png 9-slice: {SMALL_CONTROL_CSS.slice_insets} CSS px")


if __name__ == "__main__":
    main()

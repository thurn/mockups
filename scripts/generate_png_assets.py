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
        DropShadow(0, 0, 10, "#368dff24"),
        DropShadow(0, 0, 9, "#ff2ac018"),
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

SETTINGS_TAB_CSS = {
    "sprite-size": (288, 154),
    "frame-box": (12, 12, 264, 130),
    "border-width": 4,
    "corner-cut": 18,
    "background": LinearGradient(112, (
        (0, "#72f5ff"), (44, "#53afff"), (68, "#9a83ff"), (100, "#ff4ed3"),
    )),
    "active-background": LinearGradient(112, (
        (0, "#72f5ff"), (44, "#53afff"), (68, "#9a83ff"), (100, "#ff4ed3"),
    )),
    "interior": LinearGradient(180, ((0, "#071328"), (100, "#020817"))),
    "active-interior": LinearGradient(180, ((0, "#071831"), (100, "#030b1d"))),
    "inner-edge": "#123b78a8",
    "active-bottom-edge": "#f14dd7",
    "glow": DropShadow(0, 0, 10, "#2385ff44"),
    # Source pixels at 2x are printed below. Only the center band stretches.
    "slice-insets": (30, 42, 18, 42),
}

CHECKBOX_CSS = {
    "sprite-size": (101, 101),
    "frame-box": (12, 12, 77, 77),
    "border-width": 4,
    "border-radius": 11,
    "border-color": "#4ba3ff",
    "interior": LinearGradient(180, ((0, "#06142b"), (100, "#02091a"))),
    "glow": (DropShadow(0, 0, 10, "#166cff80"), DropShadow(0, 0, 5, "#6af6ff70")),
    "check-size": (50, 44),
    "check-color": "#61f1ff",
    "check-glow": DropShadow(0, 0, 7, "#128dffb0"),
}

VOLUME_SLIDER_CSS = {
    "sprite-size": (308, 88),
    "track-box": (12, 31, 284, 26),
    "track-border-width": 3,
    "track-radius": 8,
    "track-border": LinearGradient(90, (
        (0, "#13e7ff"), (47, "#735cff"), (76, "#ff43c7"), (100, "#ff326e"),
    )),
    "track-interior": "#061125",
    "fill": LinearGradient(90, (
        (0, "#17e9ff"), (35, "#286fff"), (62, "#8f5dff"),
        (86, "#ff3abe"), (100, "#ff326d"),
    )),
    "handle-box": (132.5, 12, 43, 64),
    "handle-border": LinearGradient(135, ((0, "#c8ffff"), (55, "#599cff"), (100, "#875fff"))),
    "handle-interior": LinearGradient(180, ((0, "#07142b"), (100, "#02091b"))),
    "tick-color": "#465ccb",
    "slice-insets": (18, 18),
}

ACTION_LABEL_CSS = {
    "canvas": (480, 146),
    "content-offset": (-3, 28),
    "font-family": FONT_FILE,
    "font-size": 91,
    "letter-spacing": -2,
    "skew-x": -5,
    "background": LinearGradient(174, (
        (5, "#ffffff"), (31, "#dff8ff"), (49, "#52baff"),
        (57, "#f8faff"), (77, "#806eff"), (100, "#ff6dda"),
    )),
    "stroke": (1, "#f7ffff"),
    "shadows": (DropShadow(3, 5, 0, "#122964"), DropShadow(0, 7, 5, "#000000")),
    "labels": ("PLAY", "SETTINGS", "ABOUT", "QUIT", "RETURN"),
}

MAIN_MENU_BACKGROUND_CSS = {
    "canvas": (1024, 1536),
    "interior-insets": (29, 29, 119, 29),  # top, right, bottom, left
    "radial-center": (50, 68),
    "star-count": 48,
    "grid-color": "#5ed4ff",
    "grid-accent": "#d274ff",
    "vignette": 0.70,
}


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


def render_settings_panel(scale: int, antialias_scale: int) -> Image.Image:
    """Render the panel's three CSS background layers in their original order."""
    style = SETTINGS_PANEL_CSS
    size = (style.width * scale, style.height * scale)
    outer = polygon_mask((style.width, style.height), style.outer_clip, scale, antialias_scale)
    inset = style.border_width
    inner_points = [(x + inset, y + inset) for x, y in style.inner_clip]
    inner = polygon_mask((style.width, style.height), inner_points, scale, antialias_scale)
    result = Image.new("RGBA", size)
    for shadow in style.glow:
        result.alpha_composite(colored_shadow(outer, shadow, scale))
    result.alpha_composite(apply_mask(linear_gradient(size, style.border), outer))
    result.alpha_composite(apply_mask(linear_gradient(size, style.interior), inner))

    edge_tint = Image.new("RGBA", size)
    edge_draw = ImageDraw.Draw(edge_tint)
    for x in range(size[0]):
        amount = x / max(1, size[0] - 1)
        if amount < 0.25:
            alpha = round(18 * (1 - amount / 0.25))
            color = (0, 83, 190, alpha)
        elif amount > 0.75:
            alpha = round(14 * ((amount - 0.75) / 0.25))
            color = (126, 0, 145, alpha)
        else:
            color = (0, 0, 0, 0)
        edge_draw.line((x, 0, x, size[1]), fill=color)
    result.alpha_composite(apply_mask(edge_tint, inner))

    radial = Image.new("RGBA", size)
    radial_draw = ImageDraw.Draw(radial)
    center_x, center_y = size[0] * 0.07, size[1] * 0.46
    radius_x, radius_y = size[0] * 0.36, size[1] * 0.36
    for step in range(60, -1, -1):
        ratio = step / 60
        alpha = round(38 * (1 - ratio))
        radial_draw.ellipse(
            (
                center_x - radius_x * ratio,
                center_y - radius_y * ratio,
                center_x + radius_x * ratio,
                center_y + radius_y * ratio,
            ),
            fill=(5, 83, 184, alpha),
        )
    result.alpha_composite(apply_mask(radial, inner))
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


def affine_logo(layer: Image.Image, scale_x: float, scale_y: float, skew_x: float) -> Image.Image:
    """Apply the heading transform to an already-painted local text layer."""
    transformed = layer.resize((round(layer.width * scale_x), round(layer.height * scale_y)),
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
    padding_top, padding_right, padding_bottom, padding_left = (18, 24, 34, 4)
    local_size = (
        raw_width + (padding_left + padding_right) * scale,
        raw_height + (padding_top + padding_bottom) * scale,
    )
    raw = Image.new("L", local_size, 0)
    for index, mask in enumerate(masks):
        raw.paste(
            mask,
            (
                padding_left * scale + (raw_width - mask.width) // 2,
                padding_top * scale + index * line_gap,
            ),
            mask,
        )

    # CSS paints the text gradient and stroke in the heading's local padding box.
    # Only then is the complete colored element scaled and skewed.
    stroke_px = max(1, round(css["-webkit-text-stroke"][0] * scale))
    stroke_mask = raw.filter(ImageFilter.MaxFilter(stroke_px * 2 + 1))
    local = Image.new("RGBA", local_size)
    stroke_color = rgba(css["-webkit-text-stroke"][1])
    stroke_layer = Image.new("RGBA", local_size, stroke_color)
    stroke_layer.putalpha(stroke_mask)
    local.alpha_composite(stroke_layer)
    local.alpha_composite(apply_mask(linear_gradient(local_size, css["background"]), raw))

    transform = css["transform"]
    transformed = affine_logo(
        local, transform["scale-x"], transform["scale-y"], transform["skew-x"]
    )

    result = Image.new("RGBA", canvas)
    x = (canvas[0] - transformed.width) // 2
    y = (canvas[1] - transformed.height) // 2
    placed_alpha = Image.new("L", canvas, 0)
    placed_alpha.paste(transformed.getchannel("A"), (x, y))

    # CSS drop-shadow stack, rendered back-to-front.
    for shadow in reversed(css["filter"]):
        result.alpha_composite(colored_shadow(placed_alpha, shadow, scale))

    result.alpha_composite(transformed, (x, y))
    return result


def rounded_rectangle_mask(
    canvas_size: tuple[int, int], box: tuple[float, float, float, float], radius: float,
    scale: int, antialias_scale: int,
) -> Image.Image:
    render_scale = scale * antialias_scale
    mask = Image.new("L", (canvas_size[0] * render_scale, canvas_size[1] * render_scale), 0)
    x, y, width, height = box
    ImageDraw.Draw(mask).rounded_rectangle(
        (round(x * render_scale), round(y * render_scale),
         round((x + width) * render_scale), round((y + height) * render_scale)),
        radius=round(radius * render_scale), fill=255,
    )
    if antialias_scale > 1:
        mask = mask.resize((canvas_size[0] * scale, canvas_size[1] * scale), Image.Resampling.LANCZOS)
    return mask


def render_settings_tab(active: bool, scale: int, antialias_scale: int) -> Image.Image:
    css = SETTINGS_TAB_CSS
    width, height = css["sprite-size"]
    x, y, frame_width, frame_height = css["frame-box"]
    cut = css["corner-cut"]
    outer_points = (
        (x, y + cut), (x + cut, y), (x + frame_width - cut, y),
        (x + frame_width, y + cut), (x + frame_width, y + frame_height),
        (x, y + frame_height),
    )
    inset = css["border-width"]
    inner_points = (
        (x + inset, y + cut + 1), (x + cut + 1, y + inset),
        (x + frame_width - cut - 1, y + inset),
        (x + frame_width - inset, y + cut + 1),
        (x + frame_width - inset, y + frame_height), (x + inset, y + frame_height),
    )
    size = (width * scale, height * scale)
    outer = polygon_mask((width, height), outer_points, scale, antialias_scale)
    inner = polygon_mask((width, height), inner_points, scale, antialias_scale)
    result = Image.new("RGBA", size)
    if active:
        result.alpha_composite(colored_shadow(outer, css["glow"], scale))
    result.alpha_composite(apply_mask(linear_gradient(size, css["active-background"] if active else css["background"]), outer))
    result.alpha_composite(apply_mask(linear_gradient(size, css["active-interior"] if active else css["interior"]), inner))
    add_inner_shadow(result, inner, 24 if not active else 34, scale)

    edge = inner.filter(ImageFilter.MaxFilter(max(3, 3 * scale | 1)))
    edge = ImageChops.subtract(edge, inner)
    edge_layer = Image.new("RGBA", size, rgba(css["inner-edge"]))
    edge_layer.putalpha(ImageChops.multiply(edge_layer.getchannel("A"), edge))
    result.alpha_composite(edge_layer)
    if active:
        draw = ImageDraw.Draw(result)
        draw.line(
            ((x + inset) * scale, (y + frame_height - 2) * scale,
             (x + frame_width - inset) * scale, (y + frame_height - 2) * scale),
            fill=rgba(css["active-bottom-edge"]), width=3 * scale,
        )
    return result


def render_checkbox_parts(scale: int, antialias_scale: int) -> tuple[Image.Image, list[Image.Image]]:
    css = CHECKBOX_CSS
    width, height = css["sprite-size"]
    x, y, frame_width, frame_height = css["frame-box"]
    outer = rounded_rectangle_mask((width, height), css["frame-box"], css["border-radius"], scale, antialias_scale)
    border = css["border-width"]
    inner_box = (x + border, y + border, frame_width - border * 2, frame_height - border * 2)
    inner = rounded_rectangle_mask((width, height), inner_box, css["border-radius"] - border, scale, antialias_scale)

    frame = Image.new("RGBA", (width * scale, height * scale))
    for shadow in css["glow"]:
        frame.alpha_composite(colored_shadow(outer, shadow, scale))
    frame.alpha_composite(apply_mask(Image.new("RGBA", frame.size, rgba(css["border-color"])), outer))
    frame.alpha_composite(apply_mask(linear_gradient(frame.size, css["interior"]), inner))
    add_inner_shadow(frame, inner, 14, scale)

    check = Image.new("RGBA", frame.size)
    check_width, check_height = css["check-size"]
    check_x = x + (frame_width - check_width) / 2
    check_y = y + (frame_height - check_height) / 2
    check_points = ((0, 47), (14, 32), (35, 58), (85, 0), (100, 14), (35, 100))
    check_mask = percent_polygon_mask(
        (width, height), check_points, (check_x, check_y, check_width, check_height),
        scale, antialias_scale,
    )
    check.alpha_composite(colored_shadow(check_mask, css["check-glow"], scale))
    check.alpha_composite(apply_mask(Image.new("RGBA", check.size, rgba(css["check-color"])), check_mask))
    # The checked frame remains a frame-only state. The mark is intentionally a
    # third independent sprite so toggling never replaces the whole control.
    checked = frame.copy()
    sheet = Image.new("RGBA", (width * scale * 3, height * scale))
    for index, image in enumerate((frame, checked, check)):
        sheet.alpha_composite(image, (index * width * scale, 0))
    return sheet, [frame, checked, check]


def render_volume_slider_parts(scale: int, antialias_scale: int) -> tuple[Image.Image, list[Image.Image]]:
    css = VOLUME_SLIDER_CSS
    width, height = css["sprite-size"]
    size = (width * scale, height * scale)
    track_box = css["track-box"]
    track_outer = rounded_rectangle_mask((width, height), track_box, css["track-radius"], scale, antialias_scale)
    bx, by, bw, bh = track_box
    border = css["track-border-width"]
    track_inner = rounded_rectangle_mask(
        (width, height), (bx + border, by + border, bw - border * 2, bh - border * 2),
        css["track-radius"] - border, scale, antialias_scale,
    )
    track = Image.new("RGBA", size)
    track.alpha_composite(colored_shadow(track_outer, DropShadow(0, 0, 9, "#1868ffb8"), scale))
    track.alpha_composite(apply_mask(linear_gradient(size, css["track-border"]), track_outer))
    track.alpha_composite(apply_mask(Image.new("RGBA", size, rgba(css["track-interior"])), track_inner))
    add_inner_shadow(track, track_inner, 8, scale)

    fill = Image.new("RGBA", size)
    fill_box = (bx + border, by + border, bw - border * 2, bh - border * 2)
    fill_mask = rounded_rectangle_mask((width, height), fill_box, 4, scale, antialias_scale)
    fill.alpha_composite(colored_shadow(fill_mask, DropShadow(0, 0, 8, "#2d84ffcc"), scale))
    fill.alpha_composite(apply_mask(linear_gradient(size, css["fill"]), fill_mask))

    handle = Image.new("RGBA", size)
    hx, hy, hw, hh = css["handle-box"]
    handle_points = ((23, 0), (77, 0), (100, 17), (100, 83), (77, 100), (23, 100), (0, 83), (0, 17))
    handle_outer = percent_polygon_mask((width, height), handle_points, (hx, hy, hw, hh), scale, antialias_scale)
    handle_inner = percent_polygon_mask((width, height), handle_points, (hx + 4, hy + 4, hw - 8, hh - 8), scale, antialias_scale)
    handle.alpha_composite(colored_shadow(handle_outer, DropShadow(0, 0, 7, "#1479ff"), scale))
    handle.alpha_composite(apply_mask(linear_gradient(size, css["handle-border"]), handle_outer))
    handle.alpha_composite(apply_mask(linear_gradient(size, css["handle-interior"]), handle_inner))
    add_inner_shadow(handle, handle_inner, 12, scale)

    ticks = Image.new("RGBA", size)
    draw = ImageDraw.Draw(ticks)
    tick_y = 60 * scale
    for tick_x in (74, 138, 202, 266):
        draw.rectangle((tick_x * scale, tick_y, (tick_x + 2) * scale, (tick_y + 10) * scale), fill=rgba(css["tick-color"]))

    parts = [track, fill, handle, ticks]
    sheet = Image.new("RGBA", (width * scale * len(parts), height * scale))
    for index, image in enumerate(parts):
        sheet.alpha_composite(image, (index * width * scale, 0))
    return sheet, parts


def render_action_label(text: str, scale: int, antialias_scale: int) -> Image.Image:
    css = ACTION_LABEL_CSS
    render_scale = scale * antialias_scale
    canvas = tuple(value * render_scale for value in css["canvas"])
    font = ImageFont.truetype(str(css["font-family"]), css["font-size"] * render_scale)
    raw = letterspaced_mask(text, font, css["letter-spacing"] * render_scale)
    padding = 16 * render_scale
    local = Image.new("L", (raw.width + padding * 2, raw.height + padding * 2), 0)
    local.paste(raw, (padding, padding), raw)
    stroke_width = max(1, round(css["stroke"][0] * render_scale))
    stroke_mask = local.filter(ImageFilter.MaxFilter(stroke_width * 2 + 1))
    painted = Image.new("RGBA", local.size)
    stroke_layer = Image.new("RGBA", local.size, rgba(css["stroke"][1]))
    stroke_layer.putalpha(stroke_mask)
    painted.alpha_composite(stroke_layer)
    painted.alpha_composite(apply_mask(linear_gradient(local.size, css["background"]), local))
    transformed = affine_logo(painted, 1, 1, css["skew-x"])
    result = Image.new("RGBA", canvas)
    x = (canvas[0] - transformed.width) // 2 + css["content-offset"][0] * render_scale
    # Fixed cap-height and baseline: every source uses the same font metrics and vertical origin.
    y = round(css["content-offset"][1] * render_scale)
    placed = Image.new("L", canvas, 0)
    placed.paste(transformed.getchannel("A"), (x, y))
    for shadow in reversed(css["shadows"]):
        result.alpha_composite(colored_shadow(placed, shadow, render_scale))
    result.alpha_composite(transformed, (x, y))
    return downsample(result, antialias_scale)


def render_main_menu_background(scale: int) -> Image.Image:
    css = MAIN_MENU_BACKGROUND_CSS
    width, height = css["canvas"]
    result = Image.new("RGBA", (width * scale, height * scale), (0, 0, 0, 255))
    top, right, bottom, left = css["interior-insets"]
    ix, iy = left * scale, top * scale
    iw, ih = (width - left - right) * scale, (height - top - bottom) * scale
    interior = Image.new("RGBA", (iw, ih), (0, 0, 0, 255))

    # Render CSS-like radial gradients at quarter resolution and upscale. Keeping
    # the overlay alpha separate avoids punching a translucent ellipse through
    # the otherwise opaque background.
    def radial_layer(
        center: tuple[float, float], color: RGBA, inner_stop: float, outer_stop: float
    ) -> Image.Image:
        sample_width = max(2, iw // 4)
        sample_height = max(2, ih // 4)
        cx, cy = center[0] * sample_width, center[1] * sample_height
        pixels: list[RGBA] = []
        for sample_y in range(sample_height):
            for sample_x in range(sample_width):
                distance = math.hypot(
                    (sample_x - cx) / (sample_width * 0.5),
                    (sample_y - cy) / (sample_height * 0.5),
                )
                if distance <= inner_stop:
                    alpha = color[3]
                elif distance >= outer_stop:
                    alpha = 0
                else:
                    alpha = round(color[3] * (outer_stop - distance) / (outer_stop - inner_stop))
                pixels.append(color[:3] + (alpha,))
        layer = Image.new("RGBA", (sample_width, sample_height))
        layer.putdata(pixels)
        return layer.resize((iw, ih), Image.Resampling.BICUBIC)

    # First ArcadeAttractMode background layer.
    interior.alpha_composite(radial_layer((0.50, 0.68), (18, 76, 144, 46), 0, 0.49))
    vertical = Image.new("RGBA", (iw, ih))
    vertical_draw = ImageDraw.Draw(vertical)
    for y in range(ih):
        amount = y / max(1, ih - 1)
        color = mix((3, 9, 26, 5), (1, 5, 18, 61), amount)
        vertical_draw.line((0, y, iw, y), fill=color)
    interior.alpha_composite(vertical)

    # Deterministic LCG mirrors ArcadeAttractMode.tsx.
    seed = 0xA77AC7
    def random_value() -> float:
        nonlocal seed
        seed = (seed * 1664525 + 1013904223) & 0xFFFFFFFF
        return seed / 0x100000000

    colors = ("#bff8ff", "#59cfff", "#ffffff", "#cf9cff", "#ff69d7")
    grid = Image.new("RGBA", interior.size)
    grid_draw = ImageDraw.Draw(grid, "RGBA")
    gx0, gy0 = iw * 0.04, ih * 0.20
    gw, gh = iw * 0.92, ih * 0.75
    vanishing = (gx0 + gw / 2, gy0 + gh * 0.21)
    ray_length = gh * 0.76
    for angle in (-22, -16.5, -11, -5.5, 0, 5.5, 11, 16.5, 22):
        radians = math.radians(angle)
        end = (
            vanishing[0] - math.sin(radians) * ray_length,
            vanishing[1] + math.cos(radians) * ray_length,
        )
        segments = 80
        for segment in range(segments):
            start_amount = segment / segments
            end_amount = (segment + 1) / segments
            alpha = round((20 + (199 - 20) * start_amount) * 0.26)
            grid_draw.line(
                (
                    vanishing[0] + (end[0] - vanishing[0]) * start_amount,
                    vanishing[1] + (end[1] - vanishing[1]) * start_amount,
                    vanishing[0] + (end[0] - vanishing[0]) * end_amount,
                    vanishing[1] + (end[1] - vanishing[1]) * end_amount,
                ),
                fill=(94, 212, 255, alpha),
                width=2 * scale,
            )
    for line_top, line_width in ((23, 10), (28, 18), (34, 29), (42, 42), (52, 57), (65, 75), (82, 96)):
        y = gy0 + gh * line_top / 100
        half = gw * line_width / 200
        start_x = vanishing[0] - half
        line_pixels = max(2, round(half * 2))
        for pixel in range(line_pixels):
            amount = pixel / max(1, line_pixels - 1)
            edge = min(1, amount / 0.12, (1 - amount) / 0.12)
            color = mix((94, 212, 255, 45), (210, 116, 255, 41), amount)
            grid_draw.rectangle(
                (start_x + pixel, y, start_x + pixel + 1, y + 2 * scale),
                fill=color[:3] + (round(color[3] * edge),),
            )
    grid_mask = Image.new("L", interior.size, 0)
    grid_mask_pixels = grid_mask.load()
    for y in range(max(0, round(gy0)), min(ih, round(gy0 + gh))):
        amount = (y - gy0) / gh
        opacity = min(1, amount / 0.17, (1 - amount) / 0.14)
        ImageDraw.Draw(grid_mask).line((round(gx0), y, round(gx0 + gw), y), fill=round(255 * opacity))
    grid.putalpha(ImageChops.multiply(grid.getchannel("A"), grid_mask))
    interior.alpha_composite(grid)

    # The z-index 3 vignette sits over the grid but below particles.
    interior.alpha_composite(radial_layer((0.50, 0.44), (1, 4, 16, 179), 0.26, 0.60))
    edge_layer = Image.new("RGBA", interior.size)
    edge_draw = ImageDraw.Draw(edge_layer)
    for x in range(iw):
        amount = x / max(1, iw - 1)
        edge_alpha = 0
        if amount < 0.17:
            edge_alpha = round(56 * (1 - amount / 0.17))
        elif amount > 0.83:
            edge_alpha = round(56 * ((amount - 0.83) / 0.17))
        edge_draw.line((x, 0, x, ih), fill=(1, 3, 12, edge_alpha))
    interior.alpha_composite(edge_layer)

    # Deterministic reduced-motion starfield, above the vignette exactly as in CSS.
    star_layer = Image.new("RGBA", interior.size)
    for index in range(css["star-count"]):
        random_value(); random_value(); random_value(); random_value()
        original_size = (3 + random_value() * 4.5) * scale
        x = (0.03 + random_value() * 0.94) * iw + original_size * 0.075
        y = (0.12 + random_value() * 0.86) * ih + original_size * 0.075
        size = original_size * 0.85
        color = rgba(colors[index % len(colors)])
        largest_blur = original_size * (6 if index % 9 == 0 else 3.5) * 0.24
        pad = max(4, math.ceil(largest_blur * 3))
        patch_size = max(2, math.ceil(size + pad * 2))
        source = Image.new("L", (patch_size, patch_size), 0)
        source_draw = ImageDraw.Draw(source)
        source_draw.ellipse((pad, pad, pad + size, pad + size), fill=158)
        star_patch = Image.new("RGBA", source.size)
        white_blur = source.filter(ImageFilter.GaussianBlur((3 if index % 9 == 0 else 2) * scale * 0.5))
        white = Image.new("RGBA", source.size, (255, 255, 255, 0))
        white.putalpha(white_blur)
        star_patch.alpha_composite(white)
        blur_sizes = (original_size * 3, original_size * 6) if index % 9 == 0 else (original_size * 3.5,)
        for blur_size in blur_sizes:
            glow_mask = source.filter(ImageFilter.GaussianBlur(max(1, blur_size * 0.24)))
            glow = Image.new("RGBA", source.size, color[:3] + (0,))
            glow.putalpha(glow_mask.point(lambda value: round(value * 0.62)))
            star_patch.alpha_composite(glow)
        ImageDraw.Draw(star_patch).ellipse((pad, pad, pad + size, pad + size), fill=color[:3] + (158,))
        star_layer.alpha_composite(star_patch, (round(x - pad), round(y - pad)))
    interior.alpha_composite(star_layer)
    result.alpha_composite(interior, (ix, iy))
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
    checkbox_sheet, checkbox_parts = render_checkbox_parts(scale, antialias_scale)
    slider_sheet, slider_parts = render_volume_slider_parts(scale, antialias_scale)
    tab_inactive = render_settings_tab(False, scale, antialias_scale)
    tab_active = render_settings_tab(True, scale, antialias_scale)
    tab_sheet = Image.new("RGBA", (tab_active.width * 2, tab_active.height))
    tab_sheet.alpha_composite(tab_inactive, (0, 0))
    tab_sheet.alpha_composite(tab_active, (tab_active.width, 0))

    slider_scale = scale
    slider_fill_crop = slider_parts[1].crop((15 * slider_scale, 34 * slider_scale, 293 * slider_scale, 54 * slider_scale))
    slider_handle_crop = slider_parts[2].crop((120 * slider_scale, 0, 188 * slider_scale, 88 * slider_scale))
    slider_ticks_crop = slider_parts[3].crop((12 * slider_scale, 60 * slider_scale, 296 * slider_scale, 70 * slider_scale))
    assets = {
        "arcade-screen-frame.png": render_arcade_frame(scale, antialias_scale),
        "game-logo.png": downsample(
            render_logo(scale * antialias_scale), antialias_scale
        ),
        "action-button-frame.png": render_frame(
            ACTION_BUTTON_CSS, scale, antialias_scale
        ),
        "settings-panel-frame.png": render_settings_panel(scale, antialias_scale),
        "small-control-frame.png": render_frame(
            SMALL_CONTROL_CSS, scale, antialias_scale
        ),
        "settings-tab-frames.png": tab_sheet,
        "settings-tab-inactive.png": tab_inactive,
        "settings-tab-active.png": tab_active,
        "checkbox-parts.png": checkbox_sheet,
        "checkbox-unchecked.png": checkbox_parts[0],
        "checkbox-checked.png": checkbox_parts[1],
        "checkbox-check.png": checkbox_parts[2],
        "volume-slider-parts.png": slider_sheet,
        "volume-slider-track.png": slider_parts[0],
        "volume-slider-fill.png": slider_fill_crop,
        "volume-slider-handle.png": slider_handle_crop,
        "volume-slider-ticks.png": slider_ticks_crop,
        "main-menu-background.png": render_main_menu_background(scale),
    }
    for label in ACTION_LABEL_CSS["labels"]:
        assets[f"action-label-{label.lower()}.png"] = render_action_label(
            label, scale, antialias_scale
        )
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
    print(f"settings tabs horizontal 9-slice: {SETTINGS_TAB_CSS['slice-insets']} CSS px")
    print(f"volume track horizontal 9-slice: {VOLUME_SLIDER_CSS['slice-insets']} CSS px")


if __name__ == "__main__":
    main()

export const DESIGN_SIZE = 900;
export const SETTINGS_STAGE_HEIGHT = 1120;
export const SETTINGS_CANVAS_TOP = 100;

export const squareSize = "var(--prototype-square-size, 900px)";
export const squareScale = "var(--prototype-square-scale, 1)";
export const settingsSquareSize = "var(--prototype-settings-square-size, 900px)";
export const settingsScale = "var(--prototype-settings-scale, 1)";
export const settingsStageHeight = "var(--prototype-settings-stage-height, 1120px)";
export const settingsCanvasTop = "var(--prototype-settings-canvas-top, 100px)";

export const squareScaleScript = `
  (() => {
    const root = document.documentElement;
    const designSize = ${DESIGN_SIZE};
    const settingsStageHeight = ${SETTINGS_STAGE_HEIGHT};
    const settingsCanvasTop = ${SETTINGS_CANVAS_TOP};
    const gutter = 28;

    const updateSquareScale = () => {
      const viewportHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      const availableWidth = Math.max(0, root.clientWidth - gutter);
      const availableHeight = Math.max(0, viewportHeight - gutter);
      const renderedSize = Math.min(designSize, availableWidth, availableHeight);
      const renderedSettingsScale = Math.min(
        1,
        availableWidth / designSize,
        availableHeight / settingsStageHeight,
      );

      root.style.setProperty("--prototype-square-size", renderedSize + "px");
      root.style.setProperty("--prototype-square-scale", String(renderedSize / designSize));
      root.style.setProperty(
        "--prototype-settings-square-size",
        designSize * renderedSettingsScale + "px",
      );
      root.style.setProperty("--prototype-settings-scale", String(renderedSettingsScale));
      root.style.setProperty(
        "--prototype-settings-stage-height",
        settingsStageHeight * renderedSettingsScale + "px",
      );
      root.style.setProperty(
        "--prototype-settings-canvas-top",
        settingsCanvasTop * renderedSettingsScale + "px",
      );
    };

    updateSquareScale();
    window.addEventListener("resize", updateSquareScale);
    window.addEventListener("pageshow", updateSquareScale);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateSquareScale);
    }
  })();
`;

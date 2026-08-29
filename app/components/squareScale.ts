export const DESIGN_SIZE = 900;
export const PORTRAIT_DESIGN_HEIGHT = 1120;

export const squareSize = "var(--prototype-square-size, 900px)";
export const squareScale = "var(--prototype-square-scale, 1)";
export const portraitWidth = "var(--prototype-portrait-width, 900px)";
export const portraitHeight = "var(--prototype-portrait-height, 1120px)";
export const portraitScale = "var(--prototype-portrait-scale, 1)";

export const squareScaleScript = `
  (() => {
    const root = document.documentElement;
    const designSize = ${DESIGN_SIZE};
    const portraitDesignHeight = ${PORTRAIT_DESIGN_HEIGHT};
    const gutter = 28;

    const updateSquareScale = () => {
      const viewportHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      const availableWidth = Math.max(0, root.clientWidth - gutter);
      const availableHeight = Math.max(0, viewportHeight - gutter);
      const renderedSize = Math.min(designSize, availableWidth, availableHeight);
      const scale = renderedSize / designSize;
      const portraitScale = Math.min(
        1,
        availableWidth / designSize,
        availableHeight / portraitDesignHeight,
      );

      root.style.setProperty("--prototype-square-size", renderedSize + "px");
      root.style.setProperty("--prototype-square-scale", String(scale));
      root.style.setProperty("--prototype-portrait-width", designSize * portraitScale + "px");
      root.style.setProperty(
        "--prototype-portrait-height",
        portraitDesignHeight * portraitScale + "px",
      );
      root.style.setProperty("--prototype-portrait-scale", String(portraitScale));
    };

    updateSquareScale();
    window.addEventListener("resize", updateSquareScale);
    window.addEventListener("pageshow", updateSquareScale);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateSquareScale);
    }
  })();
`;

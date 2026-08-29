export const DESIGN_SIZE = 900;

export const squareSize = "var(--prototype-square-size, 900px)";
export const squareScale = "var(--prototype-square-scale, 1)";

export const squareScaleScript = `
  (() => {
    const root = document.documentElement;
    const designSize = ${DESIGN_SIZE};
    const gutter = 28;

    const updateSquareScale = () => {
      const viewportHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      const availableSize = Math.min(root.clientWidth, viewportHeight) - gutter;
      const renderedSize = Math.max(0, Math.min(designSize, availableSize));

      root.style.setProperty("--prototype-square-size", renderedSize + "px");
      root.style.setProperty("--prototype-square-scale", String(renderedSize / designSize));
    };

    updateSquareScale();
    window.addEventListener("resize", updateSquareScale);
    window.addEventListener("pageshow", updateSquareScale);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateSquareScale);
    }
  })();
`;


import { useEffect, useRef } from "react";
import GeoTIFF, { fromArrayBuffer } from "geotiff";

function GeotiffViewer({ src, width = 300, height = 300 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const renderTiff = async () => {
      try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();

        const tiff = await fromArrayBuffer(arrayBuffer);
        const image = await tiff.getImage();  // get first image
        const raster = await image.readRasters({ interleave: true });
        const imgWidth = image.getWidth();
        const imgHeight = image.getHeight();

        // Create a canvas
        const canvas = document.createElement("canvas");
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        const ctx = canvas.getContext("2d");

        const imageData = ctx.createImageData(imgWidth, imgHeight);
        imageData.data.set(raster);  // raster is RGBA interleaved

        ctx.putImageData(imageData, 0, 0);

        // Append it (or scale it) to your container
        const container = containerRef.current;
        if (container) {
          container.innerHTML = "";
          container.appendChild(canvas);
          // Optionally scale the canvas to fit a box:
          canvas.style.maxWidth = `${width}px`;
          canvas.style.maxHeight = `${height}px`;
        }
      } catch (error) {
        console.error("Error rendering TIFF with geotiff.js:", error);
      }
    };

    renderTiff();
  }, [src, width, height]);

  return (
    <div
      ref={containerRef}
      style={{ width: `${width}px`, height: `${height}px`, overflow: "hidden" }}
    />
  );
}

export default GeotiffViewer;

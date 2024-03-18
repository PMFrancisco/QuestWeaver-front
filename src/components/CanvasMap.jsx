import React, { useRef, useEffect } from "react";
import { MapCanvas, MapInteractionManager, MapDrawingManager } from "../test";
import io from "socket.io-client";
import { saveMapStatus } from "../service/map";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const socket = io("http://localhost:3000");

export const CanvasMap = ({ mapData }) => {
  const mapContainerRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const mapDrawingManagerRef = useRef(null);
  const { gameId } = useParams();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  useEffect(() => {

/*     if (mapContainerRef.current && !mapCanvasRef.current) {
 */      const onMapLoaded = () => {
        if (mapData.drawnElements) {
          mapDrawingManagerRef.current.initializeDrawnElements(
            mapData.drawnElements
          );
        }
      };

      const mapCanvas = new MapCanvas(
        "mapContainer",
        {
          mapUrl: mapData.mapUrl,
          maxWidth: window.innerWidth,
          maxHeight: window.innerHeight,
        },
        onMapLoaded
      );

      const mapDrawingManager = new MapDrawingManager(mapCanvas);
      mapDrawingManagerRef.current = mapDrawingManager;

      const mapInteractionManager = new MapInteractionManager(
        mapCanvas,
        mapDrawingManager
      );

      mapCanvasRef.current = mapCanvas;
   /*  } */
  }, [mapData]);

  const toggleDrawingMode = () => {
    const mapCanvas = mapCanvasRef.current;
    if (mapCanvas) {
      mapCanvas.mode =
        mapCanvas.mode === "interaction" ? "drawing" : "interaction";
    }
  };

  const setBrushSettings = (color, size) => {
    const mapDrawingManager = mapDrawingManagerRef.current;
    if (mapDrawingManager && mapCanvasRef.current.mode === "drawing") {
      mapDrawingManager.updateSettings({ brushColor: color, brushSize: size });
    }
  };

  const clearDrawings = () => {
    const mapDrawingManager = mapDrawingManagerRef.current;
    if (mapDrawingManager) {
      mapDrawingManager.clear();
    }
  };

  const { mutate: saveMap, isPending } = useMutation({
    mutationKey: ["saveMap"],
    mutationFn: (data) => saveMapStatus(data),
    onSuccess: () => {
      console.log("Map saved successfully");
    },
    onError: (error) => {
      console.error("Failed to save map:", error);
    },
  });

  const handleSaveMap = () => {
    const mapCanvas = mapCanvasRef.current;
    const mapDrawingManager = mapDrawingManagerRef.current;

    if (mapCanvas && mapDrawingManager) {
      const mapState = {
        backgroundImageUrl: mapCanvas.mapUrl,
        drawnElements: mapDrawingManager.drawnElements,
      };
      saveMap({ gameId, mapData: mapState });
    }
  };

  return (
    <div>
      <div className="absolute z-50 gap-2">
        <button onClick={toggleDrawingMode}>Toggle Mode</button>
        <button onClick={() => setBrushSettings("red", 5)}>Red Brush</button>
        <button onClick={() => setBrushSettings("blue", 10)}>Blue Brush</button>
        <button onClick={() => setBrushSettings("green", 15)}>
          Green Brush
        </button>
        <button onClick={clearDrawings}>Clear Drawings</button>
        <button onClick={handleSaveMap}>Save Map</button>
      </div>
      <div
        ref={mapContainerRef}
        id="mapContainer"
        className="w-screen h-screen fixed top-0 left-0 z-40 bg-gray-400"
      ></div>
    </div>
  );
};

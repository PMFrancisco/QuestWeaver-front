import React, { useRef, useEffect, useState } from "react";
import {
  MapCanvas,
  MapInteractionManager,
  MapDrawingManager,
} from "virtual-tabletop-library";
import io from "socket.io-client";
import { saveMapStatus } from "../service/map";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@nextui-org/react";


const socket = io(import.meta.env.VITE_SOCKET_URL);

export const CanvasMap = ({ mapData }) => {
  const mapContainerRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const mapDrawingManagerRef = useRef(null);
  const { gameId } = useParams();

  useEffect(() => {
    socket.on("connect", () => {});

    socket.on("mapUpdated", (updatedMapData) => {
      updateCanvas(updatedMapData.mapData);
    });

    return () => {
      socket.off("connect");
      socket.off("mapUpdated");
      socket.close();
    };
  }, [gameId]);

  const updateCanvas = (mapData) => {
    if (mapDrawingManagerRef.current) {
      mapDrawingManagerRef.current.initializeDrawnElements(
        mapData.drawnElements
      );
    }
  };

  useEffect(() => {
    const onMapLoaded = () => {
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

  const { mutate: saveMap } = useMutation({
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
        gameId,
        mapData: {
          backgroundImageUrl: mapCanvas.mapUrl,
          drawnElements: mapDrawingManager.drawnElements,
        },
      };
      socket.emit("saveMap", mapState);
      saveMap(mapState);
    }
  };

  return (
    <div>
      <div className="absolute z-50 gap-2">
        <Button onClick={toggleDrawingMode}>Toggle Mode</Button>
        <Button onClick={() => setBrushSettings("red", 5)}>Red Brush</Button>
        <Button onClick={() => setBrushSettings("blue", 10)}>Blue Brush</Button>
        <Button onClick={() => setBrushSettings("green", 15)}>
          Green Brush
        </Button>
        <Button onClick={clearDrawings}>Clear Drawings</Button>
        <Button onClick={handleSaveMap}>Save Map</Button>
      </div>
      <div
        ref={mapContainerRef}
        id="mapContainer"
        className="w-screen h-screen fixed top-0 left-0 z-40 bg-gray-400"
      ></div>
    </div>
  );
};

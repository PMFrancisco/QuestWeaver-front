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
import { Button, ButtonGroup } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush, faPalette } from "@fortawesome/free-solid-svg-icons";

const socket = io(import.meta.env.VITE_SOCKET_URL);

export const CanvasMap = ({ mapData }) => {
  const mapContainerRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const mapDrawingManagerRef = useRef(null);
  const { gameId } = useParams();
  const [drawingMode, setDrawingMode] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {});

    socket.on("mapUpdated", (updatedMapData) => {
      updateCanvas(updatedMapData.mapData);
    });

    return () => {
      console.log("test");
      socket.off("connect");
      socket.off("mapUpdated");
    };
  }, []);

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
      setDrawingMode(!drawingMode);
    }
  };

  const setBrushColor = (color) => {
    const mapDrawingManager = mapDrawingManagerRef.current;
    if (mapDrawingManager && mapCanvasRef.current.mode === "drawing") {
      mapDrawingManager.updateSettings({ brushColor: color });
    }
  };

  const setBrushSize = (size) => {
    const mapDrawingManager = mapDrawingManagerRef.current;
    if (mapDrawingManager && mapCanvasRef.current.mode === "drawing") {
      mapDrawingManager.updateSettings({ brushSize: size });
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
      <div className="absolute z-50 flex ">
        <ButtonGroup>
          <Button onPress={toggleDrawingMode}>
            {drawingMode ? "Move" : "Draw"}
          </Button>
          {drawingMode ? (
            <ButtonGroup radius="none">
              <Button onPress={() => setBrushColor("black")}>
                <FontAwesomeIcon icon={faPalette} className="text-black" />
              </Button>
              <Button onPress={() => setBrushColor("red")}>
                <FontAwesomeIcon icon={faPalette} className="text-red-600" />
              </Button>
              <Button onPress={() => setBrushColor("blue")}>
                <FontAwesomeIcon icon={faPalette} className="text-blue-600" />
              </Button>
              <Button onPress={() => setBrushColor("green")}>
                <FontAwesomeIcon icon={faPalette} className="text-green-600" />
              </Button>
              <Button onPress={() => setBrushSize(5)}>
                <FontAwesomeIcon icon={faPaintBrush} className="text-xs" />
              </Button>
              <Button onPress={() => setBrushSize(10)}>
                <FontAwesomeIcon icon={faPaintBrush} className="text-base" />
              </Button>
              <Button onPress={() => setBrushSize(15)}>
                <FontAwesomeIcon icon={faPaintBrush} className="text-lg" />
              </Button>
              <Button onPress={clearDrawings}>Clear Drawings</Button>
            </ButtonGroup>
          ) : null}
          <Button onPress={handleSaveMap}>Save Map</Button>
        </ButtonGroup>
      </div>
      <div
        ref={mapContainerRef}
        id="mapContainer"
        className="w-screen h-screen fixed top-0 left-0 z-40 bg-gray-400"
      ></div>
    </div>
  );
};

import React, { useState, useEffect, useRef} from "react";
import { Stage, Layer, Image, Transformer, Text } from "react-konva";
import image1 from '../assets/image.webp'
import { useHistory } from "../Hooks/useHistory";
import CanvasControl from "./CanvasControl";


// Main component
const EditorWithVideo = () => {
  // State structure for the editor
  const initialState = {
    elements: [],
    selectedId: null,
  };

  const [editorState, updateState, undo, redo] = useHistory(initialState);
  const [inputText, setInputText] = useState("");
  const elementsRef = useRef({});
  const transformerRef = useRef();
  const stageRef = useRef();
  const imageRefs = useRef({});
  const videoElementsRef = useRef({});

  // Video playback state
  const [videoPlaying, setVideoPlaying] = useState({});

  // Get the elements array from the editor state
  const elements = editorState.elements;
  const selectedId = editorState.selectedId;

  // Add a sample image on mount
  useEffect(() => {
    const img = new window.Image();
    img.src = image1;
    img.onload = () => {
      const imageElement = {
        id: "image1",
        type: "image",
        x: 100,
        y: 100,
        width: 200,
        height: 120,
        rotation: 0,
        imgUrl: image1,
        zIndex: 1,
      };

      imageRefs.current["image1"] = img;

      updateState({
        ...editorState,
        elements: [...elements, imageElement],
      });
    };
  }, []);

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const selectedNode = elementsRef.current[selectedId];
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  // Handler for selection
  const handleSelect = (id) => {
    updateState({
      ...editorState,
      selectedId: id,
    });
  };

  // Check for deselection
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      updateState({
        ...editorState,
        selectedId: null,
      });
    }
  };

  // Handler for element change
  const handleElementChange = (updatedProps) => {
    const updatedElements = elements.map((el) => {
      if (el.id === updatedProps.id) {
        return {
          ...el,
          ...updatedProps,
        };
      }
      return el;
    });

    updateState({
      ...editorState,
      elements: updatedElements,
    });
  };

  // Store refs to elements
  const storeRef = (id, node) => {
    if (node) {
      elementsRef.current[id] = node;
    }
  };

  // Add a new text element
  const addTextNode = () => {
    if (inputText.trim() === "") return;

    const id = `text${Date.now()}`;
    const zIndex = Math.max(0, ...elements.map((el) => el.zIndex || 0)) + 1;

    const newText = {
      id,
      type: "text",
      text: inputText,
      x: 100,
      y: 100,
      fontSize: 24,
      width: 200,
      rotation: 0,
      fill: "#333333",
      zIndex,
    };

    updateState({
      ...editorState,
      elements: [...elements, newText],
      selectedId: id,
    });

    setInputText("");
  };

  // Add a video element
  const addVideoElement = () => {
    const id = `video${Date.now()}`;
    const zIndex = Math.max(0, ...elements.map((el) => el.zIndex || 0)) + 1;

    // Create a video element
    const videoEl = document.createElement("video");
    videoEl.src = "https://www.youtube.com/watch?v=novnyCaa7To"; // This would be a video URL in reality
    videoEl.crossOrigin = "Anonymous";
    videoEl.muted = true;
    videoEl.width = 320;
    videoEl.height = 240;

    // Store the video element
    videoElementsRef.current[id] = videoEl;

    const videoElement = {
      id,
      type: "video",
      x: 150,
      y: 150,
      width: 320,
      height: 240,
      rotation: 0,
      zIndex,
    };

    updateState({
      ...editorState,
      elements: [...elements, videoElement],
      selectedId: id,
    });

    setVideoPlaying({
      ...videoPlaying,
      [id]: false,
    });
  };

  // Toggle video playback
  const toggleVideoPlayback = (id) => {
    if (!id) return;

    const element = elements.find((el) => el.id === id);
    if (element?.type !== "video") return;

    const videoEl = videoElementsRef.current[id];
    if (!videoEl) return;

    if (videoPlaying[id]) {
      videoEl.pause();
    } else {
      videoEl.play();
    }

    setVideoPlaying({
      ...videoPlaying,
      [id]: !videoPlaying[id],
    });
  };

  // Stop video playback
  const stopVideo = (id) => {
    if (!id) return;

    const element = elements.find((el) => el.id === id);
    if (element?.type !== "video") return;

    const videoEl = videoElementsRef.current[id];
    if (!videoEl) return;

    videoEl.pause();
    videoEl.currentTime = 0;

    setVideoPlaying({
      ...videoPlaying,
      [id]: false,
    });
  };

  // Move an element
  const moveElement = (direction) => {
    if (!selectedId) return;

    const selectedElement = elements.find((el) => el.id === selectedId);
    if (!selectedElement) return;

    const moveDistance = 10; // pixels to move
    let newX = selectedElement.x;
    let newY = selectedElement.y;

    switch (direction) {
      case "up":
        newY -= moveDistance;
        break;
      case "down":
        newY += moveDistance;
        break;
      case "left":
        newX -= moveDistance;
        break;
      case "right":
        newX += moveDistance;
        break;
      default:
        return;
    }

    const updatedElements = elements.map((el) => {
      if (el.id === selectedId) {
        return {
          ...el,
          x: newX,
          y: newY,
        };
      }
      return el;
    });

    updateState({
      ...editorState,
      elements: updatedElements,
    });
  };

  // Change element layer order
  const changeLayerOrder = (direction) => {
    if (!selectedId) return;

    // Sort by z-index
    const sortedElements = [...elements].sort(
      (a, b) => (a.zIndex || 0) - (b.zIndex || 0)
    );
    const selectedIndex = sortedElements.findIndex(
      (el) => el.id === selectedId
    );

    if (selectedIndex === -1) return;

    // Cannot move the bottom element backward or top element forward
    if (
      (direction === "backward" && selectedIndex === 0) ||
      (direction === "forward" && selectedIndex === sortedElements.length - 1)
    ) {
      return;
    }

    // Find the element to swap with
    const targetIndex =
      direction === "forward" ? selectedIndex + 1 : selectedIndex - 1;
    const selectedElement = sortedElements[selectedIndex];
    const targetElement = sortedElements[targetIndex];

    // Swap z-indices
    const selectedZIndex = selectedElement.zIndex || 0;
    const targetZIndex = targetElement.zIndex || 0;

    const updatedElements = elements.map((el) => {
      if (el.id === selectedId) {
        return { ...el, zIndex: targetZIndex };
      }
      if (el.id === targetElement.id) {
        return { ...el, zIndex: selectedZIndex };
      }
      return el;
    });

    updateState({
      ...editorState,
      elements: updatedElements,
    });
  };

  // Animation frame for videos
  useEffect(() => {
    const videos = Object.keys(videoPlaying).filter((id) => videoPlaying[id]);
    if (videos.length === 0) return;

    let animationFrameId;

    const updateCanvas = () => {
      const layer = stageRef.current?.getStage()?.findOne("Layer");
      if (layer) {
        layer.batchDraw();
      }

      animationFrameId = requestAnimationFrame(updateCanvas);
    };

    animationFrameId = requestAnimationFrame(updateCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoPlaying]);

  // Render methods for different elements
  const renderElement = (element) => {
    if (element.type === "image") {
      return (
        <Image
          key={element.id}
          id={element.id}
          image={imageRefs.current[element.id]}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          rotation={element.rotation || 0}
          draggable
          onClick={() => handleSelect(element.id)}
          onTap={() => handleSelect(element.id)}
          onDragEnd={(e) => {
            handleElementChange({
              ...element,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = e.target;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            handleElementChange({
              ...element,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation(),
            });
          }}
          ref={(node) => storeRef(element.id, node)}
        />
      );
    }

    if (element.type === "text") {
      return (
        <Text
          key={element.id}
          id={element.id}
          text={element.text}
          x={element.x}
          y={element.y}
          fontSize={element.fontSize}
          width={element.width}
          fill={element.fill}
          rotation={element.rotation || 0}
          draggable
          onClick={() => handleSelect(element.id)}
          onTap={() => handleSelect(element.id)}
          onDragEnd={(e) => {
            handleElementChange({
              ...element,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = e.target;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            handleElementChange({
              ...element,
              x: node.x(),
              y: node.y(),
              fontSize: Math.max(12, element.fontSize * scaleY),
              width: Math.max(20, node.width() * scaleX),
              rotation: node.rotation(),
            });
          }}
          ref={(node) => storeRef(element.id, node)}
        />
      );
    }

    if (element.type === "video") {
      return (
        <Image
          key={element.id}
          id={element.id}
          image={videoElementsRef.current[element.id]}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          rotation={element.rotation || 0}
          draggable
          onClick={() => handleSelect(element.id)}
          onTap={() => handleSelect(element.id)}
          onDragEnd={(e) => {
            handleElementChange({
              ...element,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            const node = e.target;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            handleElementChange({
              ...element,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation(),
            });
          }}
          ref={(node) => storeRef(element.id, node)}
        />
      );
    }

    return null;
  };

  return (
    <CanvasControl
    inputText={inputText}
    setInputText={setInputText}
    addTextNode={addTextNode}
    addVideoElement={addVideoElement}
    undo={undo}
    redo={redo}
    changeLayerOrder={changeLayerOrder}
    selectedId={selectedId}
    moveElement={moveElement}
    elements={elements}
    videoPlaying={videoPlaying}
    toggleVideoPlayback={toggleVideoPlayback}
    stopVideo={stopVideo}
    transformerRef={transformerRef}
    renderElement={renderElement}
    checkDeselect={checkDeselect}
    stageRef={stageRef}
    />
  );
};

export default EditorWithVideo;

import React, { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from "react-konva";

import image1 from '../assets/image.webp'

const URL = "https://konvajs.org/assets/lion.png"; // example image
const VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4"; // sample video

const CanvasApp = () => {
  const [videoEl] = useState(() => document.createElement("video"));
  const [text, setText] = useState("Editable Text");
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const trRef = useRef();
  const stageRef = useRef();
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Initialize video
  videoEl.src = VIDEO_URL;
  videoEl.crossOrigin = "anonymous";

  const addImage = () => {
    const newItem = {
      id: `image-${Date.now()}`,
      type: "image",
      x: 50,
      y: 60,
      width: 200,
      height: 150,
      rotation: 0,
    };
    updateHistory([...elements, newItem]);
    setElements((prev) => [...prev, newItem]);
  };

  const addText = () => {
    const newItem = {
      id: `text-${Date.now()}`,
      type: "text",
      text,
      x: 100,
      y: 100,
      fontSize: 24,
      width: 200,
      draggable: true,
    };
    updateHistory([...elements, newItem]);
    setElements((prev) => [...prev, newItem]);
  };

  const addVideo = () => {
    const newItem = {
      id: `video-${Date.now()}`,
      type: "video",
      x: 150,
      y: 150,
      width: 320,
      height: 240,
    };
    updateHistory([...elements, newItem]);
    setElements((prev) => [...prev, newItem]);
  };

  const updateHistory = (newElements) => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]);
  };

  const handleTransform = (node, id) => {
    const updated = elements.map((el) =>
      el.id === id
        ? {
            ...el,
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
            rotation: node.rotation(),
          }
        : el
    );
    updateHistory(updated);
    setElements(updated);
  };

  const moveSelected = (dx, dy) => {
    const updated = elements.map((el) =>
      el.id === selectedId ? { ...el, x: el.x + dx, y: el.y + dy } : el
    );
    updateHistory(updated);
    setElements(updated);
  };

  const undo = () => {
    const last = history.pop();
    if (last) {
      setRedoStack((prev) => [...prev, elements]);
      setElements(last);
      setHistory([...history]);
    }
  };

  const redo = () => {
    const last = redoStack.pop();
    if (last) {
      setHistory((prev) => [...prev, elements]);
      setElements(last);
      setRedoStack([...redoStack]);
    }
  };

  const changeLayer = (direction) => {
    const index = elements.findIndex((el) => el.id === selectedId);
    if (index === -1) return;
    const newElements = [...elements];
    const swapIndex = direction === "up" ? index + 1 : index - 1;
    if (swapIndex >= 0 && swapIndex < elements.length) {
      const temp = newElements[index];
      newElements[index] = newElements[swapIndex];
      newElements[swapIndex] = temp;
      updateHistory(newElements);
      setElements(newElements);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={addImage}>Add Image</button>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={addText}>Add Text</button>
        <button onClick={addVideo}>Add Video</button>
        <button onClick={() => videoEl.paused ? videoEl.play() : videoEl.pause()}>
          Play/Pause Video
        </button>
        <button onClick={() => (videoEl.currentTime = 0)}>Stop Video</button>
        <button onClick={() => moveSelected(0, -10)}>Move Up</button>
        <button onClick={() => moveSelected(0, 10)}>Move Down</button>
        <button onClick={() => moveSelected(-10, 0)}>Move Left</button>
        <button onClick={() => moveSelected(10, 0)}>Move Right</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={() => changeLayer("up")}>Bring Forward</button>
        <button onClick={() => changeLayer("down")}>Send Backward</button>
      </div>

      <Stage width={window.innerWidth} height={500} ref={stageRef}>
        <Layer>
          {elements.map((el, i) => {
            const commonProps = {
              key: el.id,
              x: el.x,
              y: el.y,
              draggable: true,
              rotation: el.rotation || 0,
              onClick: () => setSelectedId(el.id),
              onDragEnd: (e) => {
                const updated = elements.map((item) =>
                  item.id === el.id
                    ? { ...item, x: e.target.x(), y: e.target.y() }
                    : item
                );
                updateHistory(updated);
                setElements(updated);
              },
              onTransformEnd: (e) => handleTransform(e.target, el.id),
            };

            if (el.type === "image") {
              return (
                <KonvaImage
                  {...commonProps}
                  image={image1}
                  width={el.width}
                  height={el.height}
                  ref={selectedId === el.id ? trRef : null}
                />
              );
            } else if (el.type === "text") {
              return (
                <Text
                  {...commonProps}
                  text={el.text}
                  fontSize={el.fontSize}
                  width={el.width}
                  height={el.height}
                />
              );
            } else if (el.type === "video") {
              return (
                <KonvaImage
                  {...commonProps}
                  image={videoEl}
                  width={el.width}
                  height={el.height}
                />
              );
            }
            return null;
          })}

          {selectedId && (
            <Transformer
              ref={trRef}
              nodes={[stageRef.current.findOne((node) => node._id === selectedId)]}
              rotateEnabled
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasApp;
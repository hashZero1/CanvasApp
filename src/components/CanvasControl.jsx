import React from 'react'
import { Stage, Layer, Image, Transformer, Text } from "react-konva";

const CanvasControl = ({
    inputText,
    setInputText,
    addTextNode,
    addVideoElement,
    undo,
    redo,
    changeLayerOrder,
    selectedId,
    moveElement,
    elements,
    videoPlaying,
    toggleVideoPlayback,
    stopVideo,
    transformerRef,
    renderElement,
    checkDeselect,
    stageRef,
}) => {
  return (
    <>
     <div className="w-full border border-gray-300 rounded p-4">
          {/* Text input and buttons */}
          <div className="mb-4 flex flex-wrap gap-2">
            <div className="flex flex-grow">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text..."
                className="border border-gray-300 rounded p-2 flex-grow mr-2"
              />
              <button
                onClick={addTextNode}
                className="bg-blue-500 text-white rounded px-4 py-2"
              >
                Add Text
              </button>
            </div>
    
            <button
              onClick={addVideoElement}
              className="bg-purple-500 text-white rounded px-4 py-2"
            >
              Add Video
            </button>
          </div>
    
          {/* Control buttons */}
          <div className="mb-4 flex flex-wrap gap-2">
            {/* Undo/Redo buttons */}
            <button
              onClick={undo}
              className="bg-gray-500 text-white rounded px-4 py-2"
            >
              Undo
            </button>
            <button
              onClick={redo}
              className="bg-gray-500 text-white rounded px-4 py-2"
            >
              Redo
            </button>
    
            {/* Layer controls */}
            <button
              onClick={() => changeLayerOrder("forward")}
              className="bg-green-500 text-white rounded px-4 py-2"
              disabled={!selectedId}
            >
              Bring Forward
            </button>
            <button
              onClick={() => changeLayerOrder("backward")}
              className="bg-green-500 text-white rounded px-4 py-2"
              disabled={!selectedId}
            >
              Send Backward
            </button>
          </div>
    
          {/* Direction controls */}
          <div className="mb-4 grid grid-cols-3 gap-2 max-w-xs">
            <div></div>
            <button
              onClick={() => moveElement("up")}
              className="bg-yellow-500 text-white rounded px-4 py-2"
              disabled={!selectedId}
            >
              ↑
            </button>
            <div></div>
            <button
              onClick={() => moveElement("left")}
              className="bg-yellow-500 text-white rounded px-4 py-2"
              disabled={!selectedId}
            >
              ←
            </button>
            <div></div>
            <button
              onClick={() => moveElement("right")}
              className="bg-yellow-500 text-white rounded px-4 py-2"
              disabled={!selectedId}
            >
              →
            </button>
            <div></div>
            <button
              onClick={() => moveElement("down")}
              className="bg-yellow-500 text-white rounded px-4 py-2"
              disabled={!selectedId}
            >
              ↓
            </button>
            <div></div>
          </div>
    
          {/* Video playback controls */}
          {selectedId &&
            elements.find((el) => el.id === selectedId)?.type === "video" && (
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => toggleVideoPlayback(selectedId)}
                  className="bg-red-500 text-white rounded px-4 py-2"
                >
                  {videoPlaying[selectedId] ? "Pause" : "Play"}
                </button>
                <button
                  onClick={() => stopVideo(selectedId)}
                  className="bg-red-500 text-white rounded px-4 py-2"
                >
                  Stop
                </button>
              </div>
            )}
    
          {/* Canvas */}
          <Stage
            ref={stageRef}
            width={window.innerWidth * 0.8}
            height={400}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            className="bg-gray-100"
          >
            <Layer>
              {elements
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map(renderElement)}
    
              {selectedId && (
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    // Limit resize
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                  rotateEnabled={true}
                  enabledAnchors={[
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                  ]}
                />
              )}
            </Layer>
          </Stage>
          <div className="mt-4 max-w-6xl mx-auto text-center h-[60vh] text-gray-700">
            <h1> Transformer App</h1>
             <h2 className='text-2xl mt-5 tracking-wider'>
                 Instructions
               </h2>
             <ul className="flex justify-evenly text-left pl-8 mt-5">
               <li className='bg-gray-200 px-7 py-4 rounded-4xl cursor-pointer hover:bg-gray-800 hover:text-gray-50 transition-all'>Drag to move</li>
               <li className='bg-gray-200 px-7 py-4 rounded-4xl cursor-pointer hover:bg-gray-800 hover:text-gray-50 transition-all'>Use corner handles to resize</li>
               <li className='bg-gray-200 px-7 py-4 rounded-4xl cursor-pointer hover:bg-gray-800 hover:text-gray-50 transition-all'>Use the edge handle to rotate</li>
               <li className='bg-gray-200 px-7 py-4 rounded-4xl cursor-pointer hover:bg-gray-800 hover:text-gray-50 transition-all'>Click elsewhere to deselect</li>
             </ul>
           </div>
        </div>
    </>
  )
}

export default CanvasControl



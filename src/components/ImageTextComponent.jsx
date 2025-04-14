import { useEffect, useRef, useState } from "react";
import TextResizer from "./TextResizer";
import { Layer, Stage, Transformer, Image as KonvaImage } from "react-konva";
import image1 from '../assets/image.webp'; // Your image path

const ImageTextManipulator = () => {
    const [image, setImage] = useState(null);
    const [textNodes, setTextNodes] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [inputText, setInputText] = useState('');
    const transformerRef = useRef();
    const elementsRef = useRef({});
    const [imageObj, setImageObj] = useState(null);  // Store image object for Konva
  
    // Load image when component mounts
    useEffect(() => {
        const img = new window.Image();
        img.src = image1;  // Image path
        img.onload = () => {
            setImageObj(img);  // Set the image when it loads
            setImage({
                img: img,
                x: 100,
                y: 100,
                width: 200,
                height: 120,
                rotation: 0,
                id: 'image1'
            });
        };
    }, []);
  
    useEffect(() => {
        if (selectedId && transformerRef.current) {
            const selectedNode = elementsRef.current[selectedId];
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
                transformerRef.current.getLayer().batchDraw();
            }
        }
    }, [selectedId]);

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const checkDeselect = (e) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(null);
        }
    };

    const handleImageChange = (newProps) => {
        setImage({
            ...image,
            ...newProps
        });
    };

    const handleTextChange = (newProps) => {
        setTextNodes(textNodes.map(textNode => {
            if (textNode.id === newProps.id) {
                return {
                    ...textNode,
                    ...newProps
                };
            }
            return textNode;
        }));
    };

    const addTextNode = () => {
        if (inputText.trim() === '') return;
        
        const id = `text${Date.now()}`;
        const newText = {
            id,
            text: inputText,
            x: 100,
            y: 100,
            fontSize: 24,
            width: 200,
            rotation: 0,
            fill: '#333333',
        };
        
        setTextNodes([...textNodes, newText]);
        setInputText('');
        // Select the new text node
        setTimeout(() => setSelectedId(id), 10);
    };

    const storeRef = (id, node) => {
        if (node) {
            elementsRef.current[id] = node;
        }
    };

    return (
        <div className="w-full border border-gray-300 rounded p-4">
            <div className="mb-4 flex">
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

            <Stage
                width={window.innerWidth * 0.8} 
                height={400} 
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
                className="bg-gray-100"
            >
                <Layer>
                    {imageObj && (  // Ensure image object is loaded
                        <KonvaImage
                            image={imageObj}
                            x={image.x}
                            y={image.y}
                            width={image.width}
                            height={image.height}
                            rotation={image.rotation}
                            onClick={() => handleSelect('image1')}
                            draggable
                            ref={(node) => storeRef('image1', node)}
                            onTransformEnd={(e) => {
                                handleImageChange({
                                    x: e.target.x(),
                                    y: e.target.y(),
                                    width: e.target.width(),
                                    height: e.target.height(),
                                    rotation: e.target.rotation()
                                });
                            }}
                        />
                    )}
                    
                    {textNodes.map((textNode) => (
                        <TextResizer
                            key={textNode.id}
                            text={textNode}
                            isSelected={selectedId === textNode.id}
                            onSelect={() => handleSelect(textNode.id)}
                            onChange={handleTextChange}
                            ref={(node) => storeRef(textNode.id, node)}
                        />
                    ))}
                    
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
                            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                        />
                    )}
                </Layer>
            </Stage>
            
            <div className="mt-4 max-w-6xl mx-auto text-center text-gray-700">
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
    );
};

export default ImageTextManipulator;

// import React, { useState, useEffect } from 'react';
// import { Stage, Layer, Image, Transformer } from 'react-konva';
// import image1 from '../assets/image.webp'

// const ImageResizer = () => {
//   const [image, setImage] = useState(null);
//   const [selectedId, setSelectedId] = useState(null);
//   const imageRef = React.useRef();
//   const transformerRef = React.useRef();

//   useEffect(() => {
//     const img = new window.Image();
//     img.src = image1; 
//     img.onload = () => {
//       setImage({
//         img: img,
//         x: 100,
//         y: 100,
//         width: 200,
//         height: 120,
//         rotation: 0,
//         id: 'image1'
//       });
//     };
//   }, []);


//   useEffect(() => {
//     if (selectedId) {
 
//       transformerRef.current.nodes([imageRef.current]);
//       transformerRef.current.getLayer().batchDraw();
//     }
//   }, [selectedId]);

//   const handleSelect = () => {
//     setSelectedId('image1');
//   };

//   const checkDeselect = (e) => {

//     const clickedOnEmpty = e.target === e.target.getStage();
//     if (clickedOnEmpty) {
//       setSelectedId(null);
//     }
//   };

//   const handleTransform = () => {
//     const node = imageRef.current;
//     const scaleX = node.scaleX();
//     const scaleY = node.scaleY();

//     node.scaleX(1);
//     node.scaleY(1);

//     setImage({
//       ...image,
//       x: node.x(),
//       y: node.y(),
//       width: Math.max(5, node.width() * scaleX),
//       height: Math.max(5, node.height() * scaleY),
//       rotation: node.rotation()
//     });
//   };

//   return (
//     <div className="w-full h-96 border border-gray-300 rounded">
//       <Stage 
//         width={window.innerWidth * 0.8} 
//         height={400} 
//         onMouseDown={checkDeselect}
//         onTouchStart={checkDeselect}
//         className="bg-gray-100"
//       >
//         <Layer>
//           {image && (
//             <Image
//               ref={imageRef}
//               image={image.img}
//               x={image.x}
//               y={image.y}
//               width={image.width}
//               height={image.height}
//               rotation={image.rotation}
//               draggable
//               onClick={handleSelect}
//               onTap={handleSelect}
//               onDragEnd={handleTransform}
//               onTransformEnd={handleTransform}
//               id={image.id}
//             />
//           )}
//           {selectedId && (
//             <Transformer
//               ref={transformerRef}
//               boundBoxFunc={(oldBox, newBox) => {
//                 // Limit resize
//                 if (newBox.width < 5 || newBox.height < 5) {
//                   return oldBox;
//                 }
//                 return newBox;
//               }}
//               rotateEnabled={true}
//               enabledAnchors={[
//                 'top-left',
//                 'top-right',
//                 'bottom-left',
//                 'bottom-right'
//               ]}
//             />
//           )}
//         </Layer>
//       </Stage>
//       <div className="mt-4 max-w-6xl mx-auto text-center text-gray-700">
//        <h1> Select Image to drag and resize</h1>
//         <h2 className='text-2xl mt-5 tracking-wider'>
//             Instructions
//           </h2>
//         <ul className="flex justify-evenly text-left pl-8 mt-5">
//           <li className='bg-gray-200 px-7 py-4 rounded-4xl cursor-pointer hover:bg-gray-800 hover:text-gray-50 transition-all'>Drag to move</li>
//           <li className='bg-gray-200 px-7 py-4 rounded-4xl cursor-pointer hover:bg-gray-800 hover:text-gray-50 transition-all'>Use corner handles to resize</li>
//           <li className='bg-gray-200 px-7 py-4 rounded-4xl cursor-pointer hover:bg-gray-800 hover:text-gray-50 transition-all'>Use the edge handle to rotate</li>
//           <li className='bg-gray-200 px-7 py-4 rounded-4xl cursor-pointer hover:bg-gray-800 hover:text-gray-50 transition-all'>Click elsewhere to deselect</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ImageResizer;
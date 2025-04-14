import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Image, Transformer, Text } from 'react-konva';

// Reusable Transformable element component
const TransformableElement = ({ 
  elementProps, 
  isSelected, 
  onSelect, 
  onChange, 
  elementType
}) => {
  const elementRef = useRef();
  
  useEffect(() => {
    if (isSelected && elementRef.current) {
      // This effect is for transformer setup in parent component
    }
  }, [isSelected]);
  
  const handleTransformEnd = () => {
    const node = elementRef.current;
    if (!node) return;
    
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Reset scale to avoid accumulating
    node.scaleX(1);
    node.scaleY(1);
    
    // Calculate new properties
    const newProps = {
      ...elementProps,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation()
    };
    
    // Different properties for different element types
    if (elementType === 'image') {
      newProps.width = Math.max(5, node.width() * scaleX);
      newProps.height = Math.max(5, node.height() * scaleY);
    } else if (elementType === 'text') {
      newProps.fontSize = Math.max(12, elementProps.fontSize * scaleY);
      newProps.width = Math.max(20, node.width() * scaleX);
    }
    
    onChange(newProps);
  };

  // Render different elements based on type
  if (elementType === 'image') {
    return (
      <Image
        ref={elementRef}
        onClick={onSelect}
        onTap={onSelect}
        onTransformEnd={handleTransformEnd}
        onDragEnd={handleTransformEnd}
        draggable
        {...elementProps}
      />
    );
  } else if (elementType === 'text') {
    return (
      <Text
        ref={elementRef}
        onClick={onSelect}
        onTap={onSelect}
        onTransformEnd={handleTransformEnd}
        onDragEnd={handleTransformEnd}
        draggable
        {...elementProps}
      />
    );
  }
  
  return null;
};

export default TransformableElement
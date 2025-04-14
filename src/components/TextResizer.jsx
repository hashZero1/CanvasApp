import TransformableElement from "./TransformComponent";

// Separate TextResizer component
const TextResizer = ({ 
    text, 
    isSelected, 
    onSelect, 
    onChange 
  }) => {
    const textProps = {
      id: text.id,
      text: text.text,
      x: text.x,
      y: text.y,
      fontSize: text.fontSize,
      width: text.width,
      rotation: text.rotation,
      fill: text.fill
    };
    
    return (
      <TransformableElement
        elementProps={textProps}
        isSelected={isSelected}
        onSelect={onSelect}
        onChange={onChange}
        elementType="text"
      />
    );
  };

export default TextResizer;
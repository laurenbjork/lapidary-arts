import React, { useState } from 'react';

const ProductImageZoom = ({ imageUrl, altText }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <img src={imageUrl} alt={altText} className="w-full h-full object-cover" />
      {showZoom && (
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '200%',
            transform: 'scale(1.5)',
            transition: 'transform 0.2s ease-out',
          }}
        />
      )}
    </div>
  );
};

export default ProductImageZoom;

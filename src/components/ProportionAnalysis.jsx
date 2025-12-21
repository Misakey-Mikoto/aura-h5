import { useRef, useEffect, useState } from 'react';

function ProportionAnalysis({ analyse, partData }) {
  const threeCourtPoints = JSON.parse(analyse.three_courts_points || '[]');
  const fiveEyesPoints = JSON.parse(analyse.five_eyes_points || '[]');
  
  const facePartData = partData.find(part => part.part === 1);
  const originalWidth = analyse.width || facePartData?.width || 888;
  const originalHeight = analyse.height || facePartData?.height || 1155;

  const imageRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        setImageSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    const img = imageRef.current;
    if (img && img.complete) {
      updateSize();
    } else if (img) {
      img.addEventListener('load', updateSize);
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      if (img) {
        img.removeEventListener('load', updateSize);
      }
    };
  }, [analyse.image]);

  const scaleRatio = imageSize.width / originalWidth;

  return (
    <>
      <div className="proportion-card">
        <div className="proportion-labels">
          <div className="proportion-label">
            <div className="proportion-dot" style={{ backgroundColor: '#22a7b3' }}></div>
            <span className="proportion-label-text">三庭比例</span>
          </div>
          <div className="proportion-label">
            <div className="proportion-dot" style={{ backgroundColor: '#ff727b' }}></div>
            <span className="proportion-label-text">五眼比例</span>
          </div>
        </div>
        <img src="/imgs/bz_girl.png" className="reference-image" alt="参考比例" />
      </div>

      <div style={{ height: '10px' }}></div>

      <div className="proportion-card">
        <div className="user-proportion-header">
          <div className="decorative-line"></div>
          <span className="user-proportion-title">您的比例</span>
          <div className="decorative-line"></div>
        </div>
        <div className="user-image-container">
          <img ref={imageRef} src={analyse.image} className="user-proportion-image" alt="用户照片" />
          <div className="proportion-overlay" style={{ width: `${imageSize.width}px`, height: `${imageSize.height}px` }}>
            {threeCourtPoints.map((point, index) => {
              if (index === 0 || !point || point.length < 2) return null;
              const yCoord = point[1] || 0;
              if (yCoord < 0) return null;
              const topPx = yCoord * scaleRatio;
              return <div key={`h-${index}`} className="proportion-line" style={{ top: `${topPx}px`, backgroundColor: '#22a7b3' }}></div>;
            })}
            {fiveEyesPoints.map((point, index) => {
              if (!point || point.length < 2) return null;
              const xCoord = point[0] || 0;
              if (xCoord < 0 || xCoord > originalWidth) return null;
              const leftPx = xCoord * scaleRatio;
              return <div key={`v-${index}`} className="vertical-proportion-line" style={{ left: `${leftPx}px`, backgroundColor: '#ff727b' }}></div>;
            })}
          </div>
        </div>
      </div>

      <div className="divider"></div>
      <div className="advice-container">
        <div className="advice-text">三庭五眼是面部美学的黄金比例参考。了解自己的比例特点，可以通过化妆技巧进行调整和优化，打造更加协调的面部轮廓。</div>
      </div>
    </>
  );
}

export default ProportionAnalysis;

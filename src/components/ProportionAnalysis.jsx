function ProportionAnalysis({ analyse, partData }) {
  const threeCourtPoints = JSON.parse(analyse.three_courts_points || '[]');
  const fiveEyesPoints = JSON.parse(analyse.five_eyes_points || '[]');
  
  const facePartData = partData.find(part => part.part === 1);
  const originalWidth = facePartData?.width || 800;
  const originalHeight = facePartData?.height || 1200;

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
          <img src={analyse.image} className="user-proportion-image" alt="用户照片" />
          <div className="proportion-overlay">
            {threeCourtPoints.map((point, index) => {
              if (index === 0 || !point || point.length < 2) return null;
              const yCoord = point[1] || 0;
              if (yCoord < 0) return null;
              const topPercent = (yCoord / originalHeight) * 100;
              return <div key={`h-${index}`} className="proportion-line" style={{ top: `${topPercent}%`, backgroundColor: '#22a7b3' }}></div>;
            })}
            {fiveEyesPoints.map((point, index) => {
              if (!point || point.length < 2) return null;
              const xCoord = point[0] || 0;
              if (xCoord < 0 || xCoord > originalWidth) return null;
              const leftPercent = (xCoord / originalWidth) * 100;
              return <div key={`v-${index}`} className="vertical-proportion-line" style={{ left: `${leftPercent}%`, backgroundColor: '#ff727b' }}></div>;
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

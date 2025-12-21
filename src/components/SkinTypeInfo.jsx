function SkinTypeInfo({ skinType, skinColor, skinColorDescription, skinTypeAdvice, careTips }) {
  const colorTypes = ['透白', '白皙', '自然', '小麦', '暗沉', '黝黑'];
  const colorGradients = [
    ['#FAE6D9', '#FAE6D9'],
    ['#F6D3C1', '#F6D3C1'],
    ['#EDC4A6', '#D9B89A'],
    ['#C09B89', '#A8826F'],
    ['#9A715F', '#7D5A4A'],
    ['#684A42', '#4A3530']
  ];

  return (
    <div className="skin-info-section">
      <div className="skin-info-row">
        <div className="skin-info-item">
          <div className="decorative-line"></div>
          <span className="skin-info-label">肤质 <span className="skin-info-value">{skinType}</span></span>
          <div className="decorative-line"></div>
        </div>
        <div className="skin-info-item">
          <div className="decorative-line"></div>
          <span className="skin-info-label">肤色 <span className="skin-info-value">{skinColor}</span></span>
          <div className="decorative-line"></div>
        </div>
      </div>

      <div className="color-block-container">
        {colorTypes.map((type, index) => (
          <div key={type} className={`color-block-wrapper ${type === skinColor ? 'selected' : ''}`}>
            <div 
              className="color-block" 
              style={{ background: `linear-gradient(to right, ${colorGradients[index][0]}, ${colorGradients[index][1]})` }}
            ></div>
          </div>
        ))}
      </div>
      <div className="color-labels">
        {colorTypes.map(type => (
          <span key={type} className={`color-label-text ${type === skinColor ? 'active' : ''}`}>{type}</span>
        ))}
      </div>

      <div className="skin-color-description-box">
        <div className="skin-color-description">{skinColorDescription}</div>
      </div>

      <div className="divider"></div>
      <div className="advice-container">
        <div className="advice-header">
          <div className="title-dot"></div>
          <div className="advice-title">肤质说明</div>
        </div>
        <div className="advice-text">{skinTypeAdvice}</div>
      </div>

      {careTips && careTips.length > 0 && (
        <>
          <div className="divider"></div>
          <div className="advice-container">
            <div className="advice-header">
              <div className="title-dot"></div>
              <div className="advice-title">护理建议</div>
            </div>
            <div className="advice-text">
              {careTips.map((tip, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>{tip}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SkinTypeInfo;

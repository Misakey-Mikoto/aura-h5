function SkinIssues({ skinData, onImageClick }) {
  const skinTypeMap = {
    1: '毛孔', 2: '皱纹', 3: '色斑', 4: '痤疮',
    5: '黑眼圈', 8: '敏感', 9: '黑头'
  };

  const summaryItems = skinData
    .filter(item => skinTypeMap[item.skin])
    .map(item => {
      const name = skinTypeMap[item.skin];
      const color = item.score >= 80 ? '#4CAF50' : item.score >= 60 ? '#FF9800' : item.score >= 40 ? '#FF5722' : '#F44336';
      return { ...item, name, color };
    });

  const detailItems = skinData.filter(item => ![6, 7, 10, 11].includes(item.skin));

  return (
    <>
      <div className="skin-score-summary">
        <div className="summary-title">肌肤问题评分</div>
        <div className="scores-container">
          {summaryItems.map(item => (
            <div key={item.skin} className="score-item-row">
              <div className="score-header">
                <span className="score-name">{item.name}</span>
                <span className="score-value-text" style={{ color: item.color }}>{item.score}分</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${item.score}%`, backgroundColor: item.color }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {detailItems.map(item => {
        const name = skinTypeMap[item.skin] || '其他';
        const color = item.score >= 80 ? '#4CAF50' : item.score >= 60 ? '#FF9800' : item.score >= 40 ? '#FF5722' : '#F44336';

        if (item.score === 100) {
          return (
            <div key={item.skin} className="issue-container">
              <div className="issue-header">
                <span className="issue-name">{name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4CAF50' }}>
                  <span>✓</span>
                  <span>优秀</span>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#666666' }}>无明显{name}问题，肌肤状态良好，请继续保持。</div>
            </div>
          );
        }

        return (
          <div key={item.skin} className="issue-container">
            <div className="issue-header">
              <div className="decorator-line"></div>
              <span className="issue-name">{name}</span>
              <div className="decorator-line"></div>
            </div>
            
            <div className="score-bar-container">
              <div className="score-bar-left">
                <span className="score-bar-value" style={{ color }}>{item.score}</span>
              </div>
              <div className="score-bar-right">
                <div className="score-bar">
                  <div className="score-indicator" style={{ left: `${100 - item.score}%` }}></div>
                  <div className="score-scale">
                    <div className="scale-segment" style={{ backgroundColor: '#4CAF50' }}></div>
                    <div className="scale-segment" style={{ backgroundColor: '#FF9800' }}></div>
                    <div className="scale-segment" style={{ backgroundColor: '#FF5722' }}></div>
                  </div>
                </div>
                <div className="scale-labels">
                  <span className="scale-label">轻度</span>
                  <span className="scale-label">中度</span>
                  <span className="scale-label">重度</span>
                </div>
              </div>
            </div>
            
            {item.label_img && (
              <div className="issue-image-container">
                <img 
                  src={item.label_img} 
                  className="issue-label-image" 
                  alt={`${name}标注图`}
                  onClick={() => onImageClick(item.label_img)}
                />
              </div>
            )}
            
            {item.careAdvice && (
              <>
                <div className="divider"></div>
                <div className="advice-container">
                  <div className="advice-header">
                    <div className="title-dot"></div>
                    <div className="advice-title">护理建议</div>
                  </div>
                  <div className="advice-text">{item.careAdvice}</div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}

export default SkinIssues;

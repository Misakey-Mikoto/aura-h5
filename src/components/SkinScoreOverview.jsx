import './SkinScoreOverview.css';

const skinTypeConfig = {
  1: { name: '毛孔', icon: '/imgs/icons/maokong 4.png' },
  2: { name: '皱纹', icon: '/imgs/icons/zhouwen 5.png' },
  3: { name: '色斑', icon: '/imgs/icons/seban 1.png' },
  4: { name: '痤疮', icon: '/imgs/icons/cuochuang 1.png' },
  5: { name: '黑眼圈', icon: '/imgs/icons/heiyanquantu 1.png' },
  8: { name: '敏感肌', icon: '/imgs/icons/minganji 1.png' },
  9: { name: '黑头', icon: '/imgs/icons/heitoutu 1.png' }
};

function SkinScoreOverview({ skinData }) {
  const issueOrder = [1, 2, 3, 4, 5, 8, 9];
  
  const orderedIssues = issueOrder
    .map(skinType => {
      const item = skinData.find(d => d.skin === skinType);
      if (!item) return null;
      return {
        ...item,
        config: skinTypeConfig[skinType]
      };
    })
    .filter(item => item);

  const getScorePosition = (score) => {
    return `${score}%`;
  };

  const getBarColor = (score) => {
    if (score >= 70) return '#D5B48C';
    if (score >= 30) return '#E5C9A8';
    return '#F9E9D0';
  };

  return (
    <div className="skin-score-overview">
      <div className="score-background-left"></div>
      <div className="score-background-middle"></div>
      <div className="score-background-right"></div>
      <div className="score-items">
        {orderedIssues.map((item) => (
          <div key={item.skin} className="score-item">
            <div className="score-item-label">
              <img src={item.config.icon} alt={item.config.name} className="score-item-icon" />
              <span className="score-item-name">{item.config.name}</span>
            </div>
            <div className="score-item-bar-wrapper">
              <div className="score-item-bar">
                <div 
                  className="score-item-bar-fill" 
                  style={{ 
                    width: getScorePosition(item.score)
                  }}
                />
                <div 
                  className="score-item-dot" 
                  style={{ left: getScorePosition(item.score) }}
                />
              </div>
            </div>
            <div className="score-item-value">{item.score}分</div>
          </div>
        ))}
      </div>
      <div className="score-scale">
        <span>0</span>
        <span>30</span>
        <span>70</span>
        <span>100</span>
      </div>
    </div>
  );
}

export default SkinScoreOverview;

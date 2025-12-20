function ConclusionCard({ skinScore, overallScore, skinAge, onShowModal }) {
  return (
    <div className="report-card">
      <div className="card-gradient-header"></div>
      <div className="card-title-container">
        <div className="card-title-left">
          <div className="title-decorator"></div>
          <div className="card-title">测肤结论</div>
        </div>
        <button className="conclusion-button" onClick={onShowModal}>
          <span className="conclusion-button-text">查看详情</span>
          <span className="conclusion-button-arrow">&gt;&gt;</span>
        </button>
      </div>
      <div className="card-content">
        <div className="score-container">
          <div className="score-item">
            <div className="score-value">{skinScore || overallScore}</div>
            <div className="score-label">综合评分</div>
          </div>
          <div className="score-divider"></div>
          <div className="score-item">
            <div className="score-value">{skinAge}</div>
            <div className="score-label">肌肤年龄</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConclusionCard;

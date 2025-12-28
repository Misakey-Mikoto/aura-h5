import { useState } from 'react';
import './IssueCard.css';

function IssueCard({ 
  title,
  scoreLabel,
  scoreValue,
  solutionContent,
  backgroundImage,
  children
}) {
  const [showSolutionModal, setShowSolutionModal] = useState(false);

  return (
    <div className="issue-card">
      {backgroundImage && (
        <div className="issue-card-background">
          <img src={backgroundImage} alt="" />
        </div>
      )}
      
      <div className="issue-card-header">
        <div className="issue-header-line"></div>
        <span className="issue-title">{title}</span>
        <div className="issue-header-line"></div>
      </div>

      <div className="issue-card-content">
        {scoreLabel && scoreValue !== undefined && (
          <div className="issue-score-row">
            <div className="issue-score-label">
              <div className="issue-score-dot"></div>
              <span className="issue-score-text">{scoreLabel}</span>
            </div>
            <div className="issue-score-value">{scoreValue}</div>
          </div>
        )}

        {children}

        {solutionContent && (
          <button className="issue-solution-button" onClick={() => setShowSolutionModal(true)}>
            <img className="solution-icon" src="/imgs/adviceIcon.png" alt="" />
            <span>改善方案</span>
          </button>
        )}
      </div>

      {showSolutionModal && (
        <div className="issue-modal-overlay" onClick={() => setShowSolutionModal(false)}>
          <div className="issue-modal-content" onClick={e => e.stopPropagation()}>
            <div className="issue-modal-header">
              <div className="issue-modal-title">
                <div className="title-decorator"></div>
                <span>改善方案</span>
              </div>
              <button className="issue-modal-close" onClick={() => setShowSolutionModal(false)}>×</button>
            </div>
            <div className="issue-modal-body">
              <div className="issue-modal-text">{solutionContent}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IssueCard;

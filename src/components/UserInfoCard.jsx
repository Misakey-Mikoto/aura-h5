function UserInfoCard({ imageUrl, createdAt }) {
  const date = new Date(createdAt);
  const dateStr = date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }) + ' ' + date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="user-info-card">
      <div className="avatar-container">
        <img src={imageUrl || '/imgs/girl.png'} alt="用户头像" />
      </div>
      <div className="user-details">
        <div className="user-name">用户</div>
        <div className="analysis-date">{dateStr}</div>
      </div>
      <div className="history-button">历史报告</div>
    </div>
  );
}

export default UserInfoCard;

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import UserInfoCard from '../../components/UserInfoCard';
import ConclusionCard from '../../components/ConclusionCard';
import RadarChart from '../../components/RadarChart';
import SkinTypeInfo from '../../components/SkinTypeInfo';
import FacialFeatures from '../../components/FacialFeatures';
import ProportionAnalysis from '../../components/ProportionAnalysis';
import SkinIssues from '../../components/SkinIssues';
import References from '../../components/References';
import FacialAnalysisAnimation from '../../components/FacialAnalysisAnimation';
import './ReportPage.css';

function ReportPage() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConclusionModal, setShowConclusionModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [showFacialAnimation, setShowFacialAnimation] = useState(false);
  const [hasPlayedAnimation, setHasPlayedAnimation] = useState(false);
  const facialFeaturesRef = useRef(null);

  useEffect(() => {
    const id = searchParams.get('id') || 'cmg3x4qpi0002sqt1sj46yvhs';
    
    axios.get(`/api/skin-analysis/public/${id}`)
      .then(res => {
        if (res.data && res.data.success && res.data.data) {
          setData(res.data.data);
          setLoading(false);
        } else {
          throw new Error('数据格式异常');
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [searchParams]);

  useEffect(() => {
    if (!data || hasPlayedAnimation) return;

    const playParam = searchParams.get('play');
    const shouldAutoPlay = playParam === 'true';

    if (shouldAutoPlay) {
      setTimeout(() => {
        setShowFacialAnimation(true);
        setHasPlayedAnimation(true);
      }, 100);
    }
  }, [data, hasPlayedAnimation, searchParams]);

  const getSkinType = () => {
    const tZoneOil = data.analysisData.skin_data.find(item => item.skin === 7);
    const uZoneOil = data.analysisData.skin_data.find(item => item.skin === 6);
    let skinType = '混合性';
    if (tZoneOil && uZoneOil) {
      const tLevel = parseFloat(tZoneOil.level);
      const uLevel = parseFloat(uZoneOil.level);
      if (tLevel > 0.5 && uLevel < 0.3) skinType = '混合性';
      else if (tLevel > 0.5 && uLevel > 0.5) skinType = '油性';
      else if (tLevel < 0.3 && uLevel < 0.3) skinType = '干性';
      else skinType = '中性';
    }
    return skinType;
  };

  const getSkinTypeAdvice = (skinType) => {
    const skinTypeAdviceMap = {
      '干性': '建议使用滋润型护肤品深层保湿，选择温和型产品呵护屏障，全年坚持防晒，每天喝足八杯水。',
      '油性': '建议调节水油平衡控制油脂分泌，选择质地清爽的产品，适度清理老废角质，全年坚持防晒。',
      '中性': '建议温和清洁不损伤皮脂膜，做好基础保湿工作，全年坚持防晒，保持充足睡眠和均衡饮食。',
      '混合性': '建议T区侧重控油与清洁，U区着重补水保湿，每天喝足八杯水，全年坚持防晒。'
    };
    return skinTypeAdviceMap[skinType] || skinTypeAdviceMap['混合性'];
  };

  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">加载失败: {error}</div>;
  }

  if (!data) {
    return <div className="error">暂无数据</div>;
  }

  const skinType = getSkinType();
  const skinColor = data.analysisData.skinColorInfo?.name || '自然';
  const skinColorDescription = data.analysisData.skinColorInfo?.description || '保持良好的护肤习惯，注意防晒和保湿。';

  return (
    <div className="report-container">
      <UserInfoCard 
        imageUrl={data.imageUrl}
        createdAt={data.createdAt}
      />

      <ConclusionCard
        skinScore={data.analysisData.skin_score}
        overallScore={data.overallScore}
        skinAge={data.analysisData.skin_age}
        onShowModal={() => setShowConclusionModal(true)}
      />

      <div className="report-card">
        <div className="card-gradient-header"></div>
        <div className="card-title-container">
          <div className="card-title-left">
            <div className="title-decorator"></div>
            <div className="card-title">肌肤五维</div>
          </div>
        </div>
        <div className="card-content">
          <RadarChart conclusion={data.analysisData.conclusion} />
          <SkinTypeInfo
            skinType={skinType}
            skinColor={skinColor}
            skinColorDescription={skinColorDescription}
            skinTypeAdvice={getSkinTypeAdvice(skinType)}
          />
        </div>
      </div>

      <div className="report-card" ref={facialFeaturesRef}>
        <div className="card-gradient-header"></div>
        <div className="card-title-container">
          <div className="card-title-left">
            <div className="title-decorator"></div>
            <div className="card-title">脸部特征</div>
          </div>
          {import.meta.env.DEV && (
            <button 
              className="play-animation-btn"
              onClick={() => setShowFacialAnimation(true)}
              style={{ marginLeft: 'auto' }}
            >
              查看分析动画
            </button>
          )}
        </div>
        <div className="card-content">
          <FacialFeatures partData={data.analysisData.part_data || []} />
        </div>
      </div>

      <div className="report-card">
        <div className="card-gradient-header"></div>
        <div className="card-title-container">
          <div className="card-title-left">
            <div className="title-decorator"></div>
            <div className="card-title">五官比例</div>
          </div>
        </div>
        <div className="card-content">
          <ProportionAnalysis
            analyse={data.analysisData.analyse}
            partData={data.analysisData.part_data || []}
          />
        </div>
      </div>

      <div className="report-card">
        <div className="card-gradient-header"></div>
        <div className="card-title-container">
          <div className="card-title-left">
            <div className="title-decorator"></div>
            <div className="card-title">肌肤问题</div>
          </div>
        </div>
        <div className="card-content">
          <SkinIssues
            skinData={data.analysisData.skin_data}
            onImageClick={handleImageClick}
          />
        </div>
      </div>

      <References />

      {showConclusionModal && (
        <div className="modal-overlay" onClick={() => setShowConclusionModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-decorator"></div>
              <div className="modal-title">测肤结论</div>
            </div>
            <div className="modal-text">{data.analysisData.skin_content}</div>
            <button className="modal-close-button" onClick={() => setShowConclusionModal(false)}>知道了</button>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            <img src={modalImageUrl} alt="放大图片" />
            <button className="image-close-button" onClick={() => setShowImageModal(false)}>✕</button>
          </div>
        </div>
      )}

      {showFacialAnimation && data?.analysisData?.analyse && data?.analysisData?.part_data && (
        <FacialAnalysisAnimation
          analyse={data.analysisData.analyse}
          partData={data.analysisData.part_data}
          onComplete={() => setShowFacialAnimation(false)}
        />
      )}
    </div>
  );
}

export default ReportPage;

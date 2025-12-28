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
import { fuzhiData } from '../../utils/issueCopy';
import './ReportPage.css';

function ReportPage() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConclusionModal, setShowConclusionModal] = useState(false);
  const [showCareAdviceModal, setShowCareAdviceModal] = useState(false);
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
    let skinType = '混合性肤质';
    if (tZoneOil && uZoneOil) {
      const tLevel = parseFloat(tZoneOil.level);
      const uLevel = parseFloat(uZoneOil.level);
      if (tLevel > 0.5 && uLevel < 0.3) skinType = '混合性肤质';
      else if (tLevel > 0.5 && uLevel > 0.5) skinType = '油性肤质';
      else if (tLevel < 0.3 && uLevel < 0.3) skinType = '干性肤质';
      else skinType = '中性肤质';
    }
    return skinType;
  };

  const getSkinTypeData = (skinType) => {
    const data = fuzhiData['肤质']?.[skinType];
    if (!data) {
      console.warn(`未找到肤质数据: ${skinType}，使用默认值`);
      return fuzhiData['肤质']['混合性肤质'] || { name: '混合性肤质', description: '', care_tips: [] };
    }
    return data;
  };

  const getSkinColorData = (skinColor) => {
    const data = fuzhiData['肤色']?.[skinColor];
    if (!data) {
      console.warn(`未找到肤色数据: ${skinColor}，使用默认值`);
      return { description: '保持良好的护肤习惯，注意防晒和保湿。' };
    }
    return data;
  };

  const handleImageClick = (imageData) => {
    if (typeof imageData === 'object' && imageData.base && imageData.overlay) {
      // 人像 + 标注图重叠
      setModalImageUrl({ base: imageData.base, overlay: imageData.overlay });
    } else {
      // 单张图片
      setModalImageUrl(imageData);
    }
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
  const skinTypeData = getSkinTypeData(skinType);
  const skinColor = data.analysisData.skinColorInfo?.name || '自然';
  const skinColorData = getSkinColorData(skinColor);

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
          <button className="conclusion-button" onClick={() => setShowCareAdviceModal(true)}>
            <span className="conclusion-button-text">护理建议</span>
            <span className="conclusion-button-arrow">&gt;&gt;</span>
          </button>
        </div>
        <div className="card-content">
          <RadarChart conclusion={data.analysisData.conclusion} />
          <SkinTypeInfo
            skinType={skinTypeData.name}
            skinColor={skinColor}
            skinColorDescription={skinColorData.description}
            skinTypeAdvice={skinTypeData.description}
            careTips={skinTypeData.care_tips}
          />
        </div>
      </div>

      <div className="report-card-main" ref={facialFeaturesRef}>
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
          <FacialFeatures 
            partData={data.analysisData.part_data || []} 
            analyse={data.analysisData.analyse || {}}
          />
        </div>
      </div>

      <div className="report-car-main">
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

      <SkinIssues
        skinData={data.analysisData.skin_data}
        analyse={data.analysisData.analyse}
        onImageClick={handleImageClick}
      />

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

      {showCareAdviceModal && (
        <div className="modal-overlay" onClick={() => setShowCareAdviceModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-decorator"></div>
              <div className="modal-title">护理建议</div>
            </div>
            <div className="modal-text">
              <div className="modal-section">
                {/* <div className="modal-section-title">说明</div> */}
                <div className="modal-section-content">{skinTypeData.description}</div>
              </div>
              {skinTypeData.care_tips && skinTypeData.care_tips.length > 0 && (
                <div className="modal-section">
                  {/* <div className="modal-section-title">建议</div> */}
                  <div className="modal-section-content">
                    {skinTypeData.care_tips.map((tip, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>{tip}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="modal-close-button" onClick={() => setShowCareAdviceModal(false)}>知道了</button>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            {typeof modalImageUrl === 'object' && modalImageUrl.base && modalImageUrl.overlay ? (
              <div className="overlay-image-container">
                <img src={modalImageUrl.base} alt="人像" className="base-image" />
                <img src={modalImageUrl.overlay} alt="标注" className="overlay-image" />
              </div>
            ) : (
              <img src={modalImageUrl} alt="放大图片" />
            )}
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

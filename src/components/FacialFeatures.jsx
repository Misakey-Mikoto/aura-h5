import { useState } from 'react';
import './FacialFeatures.css';
import FeatureCanvas from './FeatureCanvas';
import { face_shapes, eye_shapes, eyebrow_shapes, lip_shapes, nose_shapes, chin_shapes } from '../utils/partAdvice';

function FacialFeatures({ partData, analyse }) {
  const selectedFeatures = {};
  partData.forEach(part => {
    switch (part.part) {
      case 1: selectedFeatures.face = part.type; break;
      case 2: selectedFeatures.eyebrow = part.type; break;
      case 3: selectedFeatures.eye = part.type; break;
      case 4: selectedFeatures.lip = part.type; break;
      case 5: selectedFeatures.chin = part.type; break;
      case 6: selectedFeatures.nose = part.type; break;
    }
  });

  // 五官类型与 part 编号的映射
  const featurePartMap = {
    'face': 1,
    'eyebrow': 2,
    'eye': 3,
    'lip': 4,
    'chin': 5,
    'nose': 6
  };

  const featureTypes = [
    {
      id: 'face',
      name: '脸型',
      options: [
        { id: 1, name: '瓜子脸', image: '/imgs/face/f1.png' },
        { id: 2, name: '圆脸', image: '/imgs/face/f2.png' },
        { id: 3, name: '心形脸', image: '/imgs/face/f3.png' },
        { id: 4, name: '长脸', image: '/imgs/face/f4.png' },
        { id: 5, name: '菱形脸', image: '/imgs/face/f5.png' },
        { id: 6, name: '鹅蛋脸', image: '/imgs/face/f6.png' },
        { id: 7, name: '方脸', image: '/imgs/face/f7.png' }
      ]
    },
    {
      id: 'eye',
      name: '眼型',
      options: [
        { id: 1, name: '凤眼', image: '/imgs/eye/e1.png' },
        { id: 2, name: '月牙眼', image: '/imgs/eye/e2.png' },
        { id: 3, name: '吊眼', image: '/imgs/eye/e3.png' },
        { id: 4, name: '铜铃眼', image: '/imgs/eye/e4.png' },
        { id: 5, name: '桃花眼', image: '/imgs/eye/e5.png' },
        { id: 6, name: '小鹿眼', image: '/imgs/eye/e6.png' },
        { id: 7, name: '杏眼', image: '/imgs/eye/e7.png' }
      ]
    },
    {
      id: 'eyebrow',
      name: '眉型',
      options: [
        { id: 1, name: '八字眉', image: '/imgs/brow/b1.png' },
        { id: 2, name: '秋波眉', image: '/imgs/brow/b2.png' },
        { id: 3, name: '野生眉', image: '/imgs/brow/b3.png' },
        { id: 4, name: '新月眉', image: '/imgs/brow/b4.png' },
        { id: 5, name: '一字眉', image: '/imgs/brow/b5.png' },
        { id: 6, name: '英气眉', image: '/imgs/brow/b6.png' },
        { id: 7, name: '柳叶眉', image: '/imgs/brow/b7.png' }
      ]
    },
    {
      id: 'lip',
      name: '唇型',
      options: [
        { id: 1, name: 'M唇', image: '/imgs/mouth/m1.png' },
        { id: 2, name: '厚唇', image: '/imgs/mouth/m2.png' },
        { id: 3, name: '薄唇', image: '/imgs/mouth/m3.png' },
        { id: 4, name: '上薄下厚唇', image: '/imgs/mouth/m4.png' },
        { id: 5, name: '上厚下薄唇', image: '/imgs/mouth/m5.png' }
      ]
    },
    {
      id: 'nose',
      name: '鼻子',
      options: [
        { id: 1, name: '窄鼻', image: '/imgs/nose/nose.png' },
        { id: 2, name: '标准鼻', image: '/imgs/nose/nose.png' },
        { id: 3, name: '宽鼻', image: '/imgs/nose/nose.png' }
      ]
    },
    {
      id: 'chin',
      name: '下巴',
      options: [
        { id: 1, name: '长下巴', image: '/imgs/jaw/j1.png' },
        { id: 2, name: '短下巴', image: '/imgs/jaw/j2.png' },
        { id: 3, name: '方下巴', image: '/imgs/jaw/j3.png' },
        { id: 4, name: '尖下巴', image: '/imgs/jaw/j4.png' },
        { id: 5, name: '圆下巴', image: '/imgs/jaw/j5.png' },
        { id: 6, name: 'W下巴', image: '/imgs/jaw/j6.png' }
      ]
    }
  ];

  const [adviceModal, setAdviceModal] = useState({ show: false, title: '', content: '' });

  const openAdviceModal = (title, content) => {
    setAdviceModal({ show: true, title, content });
  };

  const closeAdviceModal = () => {
    setAdviceModal({ show: false, title: '', content: '' });
  };

  const getAdviceContent = (featureName, selectedName) => {
    const dataMap = {
      '脸型': face_shapes,
      '眼型': eye_shapes,
      '眉型': eyebrow_shapes,
      '唇型': lip_shapes,
      '鼻子': nose_shapes,
      '下巴': chin_shapes
    };

    const data = dataMap[featureName];
    if (!data) return '建议根据个人肤质选择合适的护肤产品，保持良好的护肤习惯，定期进行专业护理。';

    const feature = data.find(item => item.name === selectedName);
    if (!feature) return '建议根据个人肤质选择合适的护肤产品，保持良好的护肤习惯，定期进行专业护理。';

    return `${feature.traits}\n\n${feature.skincare_focus}`;
  };


  return (
    <>
      {featureTypes.map(featureType => {
        const selectedId = selectedFeatures[featureType.id];
        const selectedOption = featureType.options.find(opt => opt.id === selectedId);

        return (
          <div key={featureType.id} className="part-container">
            <div className="part-container-title">
              <div className="part-title-line"></div>
              <span className="part-title-main">{featureType.name}</span>
              {selectedOption && <span className="part-title-sub">{selectedOption.name}</span>}
              <div className="part-title-line"></div>
            </div>
            <div className="part-contain-content">
              {selectedOption && analyse && analyse.image && (
                <div className="part-main-image">
                  <FeatureCanvas 
                    imageUrl={analyse.image}
                    partData={partData}
                    partType={featurePartMap[featureType.id]}
                  />
                </div>
              )}
              <div className="part-other-types">
                {[...featureType.options].sort((a, b) => {
                  if (a.id === selectedId) return -1;
                  if (b.id === selectedId) return 1;
                  return 0;
                }).map(option => (
                  <div key={option.id} className={`part-type-item ${option.id === selectedId ? 'active' : ''}`}>
                    <img src={option.image} alt={option.name} />
                    <div className="part-type-item-name">{option.name}</div>
                  </div>
                ))}
              </div>
              <div 
                className="skin-advice"
                onClick={() => openAdviceModal(
                  `${featureType.name}护肤建议`,
                  getAdviceContent(featureType.name, selectedOption?.name)
                )}
              >
                护肤建议
              </div>
            </div>
          </div>
        );
      })}
      <div className="advice-container">
        <div className="advice-text">每个人的脸部特征都是独一无二的美。了解自己的特征，可以帮助你选择更适合的妆容和发型，展现最佳状态。</div>
      </div>

      <div className="divider"></div>


      {adviceModal.show && (
        <div className="advice_modal_overlay" onClick={closeAdviceModal}>
          <div className="advice_modal_content" onClick={e => e.stopPropagation()}>
            <div className="advice_modal_header">
              <div className="advice_modal_title">{adviceModal.title}</div>
              <button className="advice_modal_close_btn" onClick={closeAdviceModal}>×</button>
            </div>
            <div className="advice_modal_body">
              <div className="advice_modal_paragraph">{adviceModal.content}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FacialFeatures;

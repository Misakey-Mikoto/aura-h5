import { useState } from 'react';
import './FacialFeatures.css';
import FeatureCanvas from './FeatureCanvas';

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
    const adviceMap = {
      '脸型': {
        '瓜子脸': '瓜子脸线条流畅，建议使用保湿类护肤品，保持肌肤水润光泽。注意防晒，避免紫外线伤害。',
        '圆脸': '圆脸可爱亲和，建议使用清爽型护肤品，避免过于油腻。可以通过按摩促进面部血液循环。',
        '心形脸': '心形脸精致优雅，建议使用温和型护肤品，重点护理额头和下巴区域，保持肌肤平衡。',
        '长脸': '长脸气质出众，建议使用滋润型护肤品，注意面部保湿，可以适当使用面膜进行深层护理。',
        '菱形脸': '菱形脸立体感强，建议使用抗氧化护肤品，重点护理颧骨区域，保持肌肤紧致。',
        '鹅蛋脸': '鹅蛋脸比例完美，建议使用均衡型护肤品，保持肌肤健康状态，注意日常防护。',
        '方脸': '方脸轮廓分明，建议使用舒缓型护肤品，重点护理下颌线，可以通过按摩放松面部肌肉。'
      },
      '眼型': {
        '凤眼': '凤眼妩媚动人，建议使用眼部精华，重点护理眼周肌肤，预防细纹产生。',
        '月牙眼': '月牙眼温柔可爱，建议使用保湿眼霜，保持眼周水润，避免干纹出现。',
        '吊眼': '吊眼个性鲜明，建议使用抗衰老眼部产品，重点提拉眼角，保持眼部紧致。',
        '铜铃眼': '铜铃眼明亮有神，建议使用舒缓眼部产品，缓解眼部疲劳，保护眼周肌肤。',
        '桃花眼': '桃花眼魅力十足，建议使用滋养眼霜，深层滋润眼周，保持眼部光彩。',
        '小鹿眼': '小鹿眼清澈纯净，建议使用温和眼部产品，轻柔护理眼周，保持肌肤细腻。',
        '杏眼': '杏眼端庄大方，建议使用全效眼霜，全面护理眼周，预防多种眼部问题。'
      },
      '眉型': {
        '八字眉': '八字眉温柔亲切，建议使用眉部精华，保持眉毛健康生长，定期修整眉形。',
        '秋波眉': '秋波眉优雅动人，建议使用滋养眉部产品，保持眉毛浓密有型。',
        '野生眉': '野生眉自然率性，建议使用眉部护理油，保持眉毛柔顺，适度修整。',
        '新月眉': '新月眉柔美婉约，建议使用眉部精华液，促进眉毛生长，保持眉形完美。',
        '一字眉': '一字眉干练利落，建议使用眉部滋养产品，保持眉毛健康，定期护理。',
        '英气眉': '英气眉飒爽英姿，建议使用眉部强化精华，保持眉毛浓密，展现气质。',
        '柳叶眉': '柳叶眉温婉秀气，建议使用温和眉部产品，细心呵护，保持眉形优美。'
      },
      '唇型': {
        'M唇': 'M唇性感迷人，建议使用滋润唇膏，保持唇部水润，定期去角质护理。',
        '厚唇': '厚唇饱满性感，建议使用保湿唇部产品，防止唇部干裂，保持柔软。',
        '薄唇': '薄唇精致优雅，建议使用滋养唇膜，深层滋润唇部，预防唇纹产生。',
        '上薄下厚唇': '上薄下厚唇个性鲜明，建议使用均衡唇部护理产品，保持唇部健康状态。',
        '上厚下薄唇': '上厚下薄唇独特魅力，建议使用全效唇部精华，全面护理唇部肌肤。'
      },
      '鼻子': {
        '窄鼻': '窄鼻精致立体，建议使用温和洁面产品，重点清洁鼻翼两侧，预防黑头产生。',
        '标准鼻': '标准鼻比例协调，建议使用均衡护肤品，保持鼻部肌肤健康，定期深层清洁。',
        '宽鼻': '宽鼻自然大方，建议使用控油清洁产品，重点护理鼻部T区，保持毛孔清爽。'
      },
      '下巴': {
        '长下巴': '长下巴气质优雅，建议使用紧致提拉产品，重点护理下巴线条，保持轮廓清晰。',
        '短下巴': '短下巴可爱俏皮，建议使用滋润护肤品，保持下巴肌肤柔软，定期按摩促进循环。',
        '方下巴': '方下巴轮廓分明，建议使用舒缓型产品，放松下颌肌肉，保持肌肤舒适。',
        '尖下巴': '尖下巴精致小巧，建议使用保湿产品，重点护理下巴尖端，保持肌肤水润。',
        '圆下巴': '圆下巴温柔可爱，建议使用均衡护肤品，保持下巴肌肤健康，定期护理。',
        'W下巴': 'W下巴独特个性，建议使用全效护肤产品，全面护理下巴区域，保持肌肤状态。'
      }
    };

    return adviceMap[featureName]?.[selectedName] || '建议根据个人肤质选择合适的护肤产品，保持良好的护肤习惯，定期进行专业护理。';
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
              <button className="advice_modal_close" onClick={closeAdviceModal}>×</button>
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

function FacialFeatures({ partData }) {
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

  return (
    <>
      {featureTypes.map(featureType => {
        const selectedId = selectedFeatures[featureType.id];
        const selectedOption = featureType.options.find(opt => opt.id === selectedId);

        return (
          <div key={featureType.id} className="feature-container">
            <div className="selected-feature-display">
              <div className="feature-header">
                <div className="decorative-line"></div>
                <span className="feature-name">{featureType.name}</span>
                {selectedOption && <span className="feature-sub-name selected">{selectedOption.name}</span>}
                <div className="decorative-line"></div>
              </div>
              {selectedOption && <img src={selectedOption.image} className="selected-feature-image" alt={selectedOption.name} />}
            </div>
            <div className="feature-scroll">
              {featureType.options.map(option => (
                <div key={option.id} className={`feature-option ${option.id === selectedId ? 'selected' : ''}`}>
                  <img src={option.image} className="feature-image" alt={option.name} />
                  <div className="feature-option-text">{option.name}</div>
                  {option.id === selectedId && (
                    <>
                      <div className="check-triangle"></div>
                      <span className="check-icon">✓</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <div className="divider"></div>
      <div className="advice-container">
        <div className="advice-text">每个人的脸部特征都是独一无二的美。了解自己的特征，可以帮助你选择更适合的妆容和发型，展现最佳状态。</div>
      </div>
    </>
  );
}

export default FacialFeatures;

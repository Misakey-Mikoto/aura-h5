import React, { useEffect, useRef, useState } from 'react';
import './FacialAnalysisAnimation.css';

const FacialAnalysisAnimation = ({ analyse, partData, onComplete }) => {
  const canvasRef = useRef(null);
  const timeoutsRef = useRef([]);
  const [isVisible, setIsVisible] = useState(true);
  const hasStartedRef = useRef(false);
  
  // 使用 ref 来直接操作 DOM，模拟原始 jQuery 实现
  const titleRefs = useRef({});
  const wordRefs = useRef({});

  // 特征类型映射数据
  const faceTypes = ["瓜子脸", "圆脸", "心形脸", "长脸", "菱形脸", "鹅蛋脸", "方脸"];
  const eyeTypes = ["凤眼", "月牙眼", "吊眼", "铜铃眼", "桃花眼", "小鹿眼", "杏眼"];
  const browTypes = ["八字眉", "秋波眉", "野生眉", "新月眉", "一字眉", "英气眉", "柳叶眉"];
  const mouthTypes = ["M唇", "厚唇", "薄唇", "上薄下厚唇", "上厚下薄唇"];
  const noseTypes = ["窄鼻", "标准鼻", "宽鼻"];
  const jawTypes = ["长下巴", "短下巴", "方下巴", "尖下巴", "圆下巴", "W下巴"];

  useEffect(() => {
    if (!analyse || !partData || partData.length === 0) return;
    if (hasStartedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas 元素未找到');
      return;
    }

    // 从 partData 中获取图片尺寸（使用脸型数据）
    const facePartData = partData.find(part => part.part === 1);
    if (!facePartData) {
      console.error('未找到脸型数据');
      return;
    }

    const imageUrl = analyse.image;
    if (!imageUrl) {
      console.error('未找到图片 URL');
      return;
    }

    const ctx = canvas.getContext('2d');
    
    // 加载并绘制背景图片
    const bgImage = new Image();
    // 移除 crossOrigin 以避免 CORS 问题
    let imageLoaded = false;
    let ratio, aniWidth, aniHeight, imageWidth, imageHeight;
    
    const drawBackground = () => {
      if (imageLoaded) {
        ctx.drawImage(bgImage, 0, 0, aniWidth, aniHeight);
      }
    };
    
    bgImage.onload = () => {
      // 使用图片的实际尺寸
      imageWidth = bgImage.naturalWidth;
      imageHeight = bgImage.naturalHeight;
      
      const windowWidth = canvas.parentElement.offsetWidth;
      ratio = windowWidth / imageWidth;
      aniWidth = imageWidth * ratio;
      aniHeight = imageHeight * ratio;
      
      console.log('图片加载成功，尺寸计算:', {
        naturalWidth: imageWidth,
        naturalHeight: imageHeight,
        windowWidth,
        ratio,
        aniWidth,
        aniHeight
      });

      const rv = window.devicePixelRatio || 1;
      canvas.height = aniHeight * rv;
      canvas.width = aniWidth * rv;
      canvas.style.width = `${aniWidth}px`;
      canvas.style.height = `${aniHeight}px`;
      canvas.style.backgroundImage = `url(${imageUrl})`;
      canvas.style.backgroundRepeat = 'no-repeat';
      canvas.style.backgroundSize = '100% 100%';
      canvas.style.backgroundPosition = 'center';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(rv, rv);
      
      console.log('Canvas 设置完成:', {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        styleWidth: canvas.style.width,
        styleHeight: canvas.style.height
      });
      
      imageLoaded = true;
      ctx.drawImage(bgImage, 0, 0, aniWidth, aniHeight);
      
      // 图片加载完成后开始动画
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        startAnimation();
      }
    };
    
    bgImage.onerror = (e) => {
      console.error('背景图片加载失败', imageUrl, e);
    };
    
    bgImage.src = imageUrl;
    console.log('开始加载图片:', imageUrl);

    let countTime = 0;

    const clearAllTimeouts = () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    };

    const addTimeout = (callback, delay) => {
      const timeout = setTimeout(callback, delay);
      timeoutsRef.current.push(timeout);
      return timeout;
    };

    const showWord = (el) => {
      if (!el) return;
      el.classList.remove('hideWord');
      el.style.display = 'block';
      el.classList.add('showWord');
    };

    const hideWord = (el) => {
      if (!el) return;
      el.classList.remove('showWord');
      el.classList.add('hideWord');
    };

    const safeParsePoints = (points) => {
      if (!points) return null;
      if (Array.isArray(points)) return points;
      if (typeof points === 'string') {
        try {
          const parsed = JSON.parse(points);
          return Array.isArray(parsed) ? parsed : null;
        } catch {
          return null;
        }
      }
      return null;
    };

    const getMaxData = (part) => {
      if (!part) return null;

      if (part.max) {
        if (typeof part.max === 'string') {
          try {
            const parsed = JSON.parse(part.max);
            if (parsed && typeof parsed === 'object') return parsed;
          } catch {
            // ignore
          }
        } else if (typeof part.max === 'object') {
          return part.max;
        }
      }

      const pts = safeParsePoints(part.points);
      if (!pts || pts.length === 0) return null;

      let min_x = Infinity;
      let min_y = Infinity;
      let max_x = -Infinity;
      let max_y = -Infinity;

      for (const p of pts) {
        if (!p || p.length < 2) continue;
        const x = Number(p[0]);
        const y = Number(p[1]);
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        if (x < min_x) min_x = x;
        if (y < min_y) min_y = y;
        if (x > max_x) max_x = x;
        if (y > max_y) max_y = y;
      }

      if (!Number.isFinite(min_x) || !Number.isFinite(min_y) || !Number.isFinite(max_x) || !Number.isFinite(max_y)) {
        return null;
      }

      return { min_x, min_y, max_x, max_y };
    };

    const getPartDisplayName = (part, partIndex) => {
      if (part && part.name) return part.name;

      switch (partIndex) {
        case 2:
          return '眼睛';
        case 3:
          return '眉毛';
        case 4:
          return '嘴巴';
        default:
          return '';
      }
    };

    const drawLine = (points, startIndex, endIndex, area, callback) => {
      if (startIndex >= endIndex) {
        if (callback) callback();
        return;
      }

      const currentIndex = startIndex + 1;
      
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.5;

      const beginX = points[currentIndex - 1][0] * ratio;
      const beginY = points[currentIndex - 1][1] * ratio;
      const closeX = points[currentIndex][0] * ratio;
      const closeY = points[currentIndex][1] * ratio;

      ctx.moveTo(beginX, beginY);
      ctx.lineTo(closeX, closeY);

      if (currentIndex === endIndex) {
        if (area === 2 || area === 4 || area === 1) {
          ctx.moveTo(points[currentIndex][0] * ratio, points[currentIndex][1] * ratio);
          ctx.lineTo(points[0][0] * ratio, points[0][1] * ratio);
        }
      }

      ctx.stroke();

      addTimeout(() => {
        drawLine(points, currentIndex, endIndex, area, callback);
      }, 300);
    };

    const drawBoundingBox = (part, partIndex) => {
      const maxData = getMaxData(part);
      if (!part || !maxData) return;

      const partName = getPartDisplayName(part, partIndex);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;

      ctx.moveTo(maxData.min_x * ratio - 6, maxData.min_y * ratio);
      ctx.lineTo(maxData.max_x * ratio + 6, maxData.min_y * ratio);
      ctx.moveTo(maxData.min_x * ratio - 6, maxData.max_y * ratio);
      ctx.lineTo(maxData.max_x * ratio + 6, maxData.max_y * ratio);

      ctx.moveTo(maxData.min_x * ratio, maxData.min_y * ratio - 6);
      ctx.lineTo(maxData.min_x * ratio, maxData.max_y * ratio + 6);
      ctx.moveTo(maxData.max_x * ratio, maxData.min_y * ratio - 6);
      ctx.lineTo(maxData.max_x * ratio, maxData.max_y * ratio + 6);

      ctx.stroke();

      const word1 = wordRefs.current[`word${partIndex}_w1`];
      const word2 = wordRefs.current[`word${partIndex}_w2`];

      if (word1) {
        word1.innerHTML = `${partName}宽度 ${part.width ?? 0}`;
        word1.style.top = `${maxData.max_y * ratio + 5}px`;
        word1.style.left = `${maxData.min_x * ratio + 10}px`;
        showWord(word1);
      }

      if (word2) {
        word2.innerHTML = `${partName}高度 ${part.height ?? 0}`;
        word2.style.top = `${maxData.max_y * ratio - 26}px`;
        word2.style.left = `${(maxData.max_x + 5) * ratio}px`;
        showWord(word2);
      }

      addTimeout(() => {
        hideWord(word1);
        hideWord(word2);
      }, 850);

      addTimeout(() => {
        ctx.clearRect(0, 0, aniWidth, aniHeight);
        if (word1) {
          word1.classList.remove('hideWord');
          word1.style.display = 'none';
        }
        if (word2) {
          word2.classList.remove('hideWord');
          word2.style.display = 'none';
        }
      }, 1200);
    };

    const drawNoseLine = (part, partIndex) => {
      const maxData = getMaxData(part);
      if (!part || !maxData) return;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;

      ctx.moveTo(maxData.min_x * ratio, (maxData.max_y - 30) * ratio);
      ctx.lineTo(maxData.max_x * ratio, (maxData.max_y - 30) * ratio);

      ctx.moveTo(maxData.min_x * ratio, maxData.max_y * ratio - 6);
      ctx.lineTo(maxData.min_x * ratio, (maxData.max_y - 60) * ratio + 6);
      ctx.moveTo(maxData.max_x * ratio, maxData.max_y * ratio - 6);
      ctx.lineTo(maxData.max_x * ratio, (maxData.max_y - 60) * ratio + 6);

      ctx.stroke();

      const word1 = wordRefs.current[`word${partIndex}_w1`];
      if (word1) {
        word1.innerHTML = `鼻翼宽度 ${part.width ?? 0}`;
        word1.style.top = `${(maxData.max_y - 20) * ratio}px`;
        word1.style.left = `${(maxData.max_x - 40) * ratio}px`;
        showWord(word1);
      }

      addTimeout(() => {
        hideWord(word1);
      }, 850);

      addTimeout(() => {
        ctx.clearRect(0, 0, aniWidth, aniHeight);
        if (word1) {
          word1.classList.remove('hideWord');
          word1.style.display = 'none';
        }
      }, 1200);
    };

    const drawTriangleLine = (goldPoints) => {
      const yTrig = (goldPoints[2][1] - goldPoints[0][1]) / 2 + goldPoints[0][1];
      const xTrig = (goldPoints[2][0] - goldPoints[0][0]) / 2 + goldPoints[0][0] + 30;

      const word1 = wordRefs.current.word1_w1;
      const word2 = wordRefs.current.word1_w2;
      if (word1) {
        word1.innerHTML = '黄金三角';
        word1.style.top = `${(yTrig - 10) * ratio}px`;
        word1.style.left = `${(xTrig - 5) * ratio}px`;
        showWord(word1);
      }

      if (word2) {
        word2.innerHTML = `${analyse.scale_gold}`;
        word2.style.top = `${(yTrig + 15) * ratio}px`;
        word2.style.left = `${xTrig * ratio}px`;
        showWord(word2);
      }

      addTimeout(() => {
        hideWord(word1);
        hideWord(word2);
      }, 850);

      addTimeout(() => {
        ctx.clearRect(0, 0, aniWidth, aniHeight);
        if (word1) {
          word1.classList.remove('hideWord');
          word1.style.display = 'none';
        }
        if (word2) {
          word2.classList.remove('hideWord');
          word2.style.display = 'none';
        }
      }, 1200);
    };

    const drawJawLine = (part, partIndex) => {
      const maxData = getMaxData(part);
      const finalHoldMs = 1000;
      if (!part || !maxData) {
        addTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 1200 + finalHoldMs);
        return;
      }

      const word1 = wordRefs.current[`word${partIndex}_w1`];
      if (word1) {
        word1.innerHTML = `下巴角度 ${part.ratio ?? 0}`;
        word1.style.top = `${(maxData.max_y - 40) * ratio}px`;
        word1.style.left = `${(maxData.max_x / 2 - 20) * ratio}px`;
        showWord(word1);
      }

      addTimeout(() => {
        hideWord(word1);
      }, 850 + finalHoldMs);

      addTimeout(() => {
        if (word1) {
          word1.classList.remove('hideWord');
          word1.style.display = 'none';
        }
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 1200 + finalHoldMs);
    };

    const updateTitles = (titles) => {
      // 先移除所有fadeWord类
      for (let i = 0; i < 7; i++) {
        if (titleRefs.current[`title${i}`]) {
          titleRefs.current[`title${i}`].classList.remove('fadeWord');
        }
      }
      
      // 更新内容
      Object.keys(titles).forEach(key => {
        if (titleRefs.current[key]) {
          titleRefs.current[key].innerHTML = titles[key];
        }
      });
      
      // 添加fadeWord类触发动画
      setTimeout(() => {
        for (let i = 0; i < 7; i++) {
          if (titleRefs.current[`title${i}`]) {
            titleRefs.current[`title${i}`].classList.add('fadeWord');
          }
        }
      }, 50);
    };

    const getEyeRatioText = (ratio) => {
      const r = parseInt(ratio);
      if (r < 48) return "偏小";
      if (r > 55) return "偏大";
      return "标准";
    };

    const getGoldTriangleText = (scale) => {
      const s = parseInt(scale);
      if (s < 64) return "偏小";
      if (s >= 64 && s < 66) return "中等偏小";
      if (s >= 66 && s < 68) return "完美";
      if (s >= 68 && s < 70) return "中等偏大";
      return "偏大";
    };

    const getPartByType = (type) => {
      return partData.find(p => p.part === type);
    };

    const startAnimation = () => {
      countTime = 300;

      // 1. 先画眼睛 (part 2) - 按照原始逻辑
      const eyePart = getPartByType(3);
      const browPart = getPartByType(2);
      
      if (eyePart && eyePart.points) {
        const eyePoints = JSON.parse(eyePart.points);
        addTimeout(() => {
          // 更新眉眼分析文案
          const eyeTypeName = eyePart.type && eyeTypes[eyePart.type - 1] ? eyeTypes[eyePart.type - 1] : eyePart.name;
          const browTypeName = browPart && browPart.type && browTypes[browPart.type - 1] ? browTypes[browPart.type - 1] : (browPart ? browPart.name : '');
          const ratioText = getEyeRatioText(eyePart.ratio || 0);
          
          updateTitles({
            title0: '眉眼分析',
            title1: 'Brow&Eye Analysis',
            title2: eyeTypeName,
            title3: browTypeName,
            title4: `内眼角度数 : ${eyePart.ratio || 0}°`,
            title5: ratioText,
            title6: ''
          });
          
          drawLine(eyePoints, 0, eyePoints.length - 1, 2, () => {
            drawBoundingBox(eyePart, 2);
          });
        }, countTime);
        countTime += eyePoints.length * 300 + 1000;
      }

      // 2. 再画眉毛 (part 3)
      if (browPart && browPart.points) {
        const browPoints = JSON.parse(browPart.points);
        addTimeout(() => {
          drawLine(browPoints, 0, browPoints.length - 1, 3, () => {
            drawBoundingBox(browPart, 3);
          });
        }, countTime);
        countTime += browPoints.length * 300 + 1000;
      }

      // 3. 画嘴巴 (part 4)
      const mouthPart = getPartByType(4);
      const nosePart = getPartByType(6);
      
      if (mouthPart && mouthPart.points) {
        const mouthPoints = JSON.parse(mouthPart.points);
        addTimeout(() => {
          // 更新鼻唇分析文案
          const mouthTypeName = mouthPart.type && mouthTypes[mouthPart.type - 1] ? mouthTypes[mouthPart.type - 1] : mouthPart.name;
          const noseTypeName = nosePart && nosePart.type && noseTypes[nosePart.type - 1] ? noseTypes[nosePart.type - 1] : (nosePart ? nosePart.name : '');
          
          updateTitles({
            title0: '鼻唇分析',
            title1: 'Nasolabial Analysis',
            title2: mouthTypeName,
            title3: noseTypeName,
            title4: `鼻翼宽度 : ${nosePart ? nosePart.width || 0 : 0}`,
            title5: '',
            title6: ''
          });
          
          drawLine(mouthPoints, 0, mouthPoints.length - 1, 4, () => {
            drawBoundingBox(mouthPart, 4);
          });
        }, countTime);
        countTime += mouthPoints.length * 300 + 1000;
      }

      // 4. 画鼻子 (part 5)
      if (nosePart && nosePart.points) {
        const nosePoints = JSON.parse(nosePart.points);
        addTimeout(() => {
          drawLine(nosePoints, 0, nosePoints.length - 1, 5, () => {
            drawNoseLine(nosePart, 5);
          });
        }, countTime);
        countTime += nosePoints.length * 300 + 1000;
      }

      // 5. 画黄金三角
      const facePart = getPartByType(1);
      const jawPart = getPartByType(5);
      
      if (analyse.gold_points) {
        const goldPoints = JSON.parse(analyse.gold_points);
        if (goldPoints && goldPoints.length > 0) {
          addTimeout(() => {
            // 更新面部分析文案
            const jawTypeName = jawPart && jawPart.type && jawTypes[jawPart.type - 1] ? jawTypes[jawPart.type - 1] : (jawPart ? jawPart.name : '');
            const faceTypeName = facePart && facePart.type && faceTypes[facePart.type - 1] ? faceTypes[facePart.type - 1] : (facePart ? facePart.name : '');
            const goldText = getGoldTriangleText(analyse.scale_gold || 0);
            
            updateTitles({
              title0: '面部分析',
              title1: 'Face Analysis',
              title2: jawTypeName,
              title3: faceTypeName,
              title4: '黄金三角',
              title5: `度数 : ${analyse.scale_gold}°`,
              title6: goldText
            });
            
            drawLine(goldPoints, 0, goldPoints.length - 1, 1, () => {
              drawTriangleLine(goldPoints);
            });
          }, countTime);
          countTime += goldPoints.length * 300 + 1000;
        }
      }

      // 6. 画下巴 (part 6)
      if (jawPart && jawPart.points) {
        const jawPoints = JSON.parse(jawPart.points);
        addTimeout(() => {
          drawLine(jawPoints, 0, jawPoints.length - 1, 6, () => {
            drawJawLine(jawPart, 6);
          });
        }, countTime);
      }
    };

    // startAnimation 现在在图片加载完成后调用，不在这里调用

    return () => {
      clearAllTimeouts();
      hasStartedRef.current = false;
    };
  }, [analyse, partData, onComplete]);

  const handleSkip = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  if (!isVisible) return null;

  return (
    <div className="layer_modal layer_No4" style={{ display: 'block' }}>
      <div className="wholeCanvas" style={{ opacity: 1 }}>
        <canvas ref={canvasRef} id="aniCanvas"></canvas>
        
        <div className="skipThis" onClick={handleSkip}>跳过</div>
        
        <div className="animation-class eTitle0" ref={el => titleRefs.current.title0 = el}></div>
        <div className="animation-class eTitle1" ref={el => titleRefs.current.title1 = el}></div>
        <div className="animation-class eTitle2" ref={el => titleRefs.current.title2 = el}></div>
        <div className="animation-class eTitle3" ref={el => titleRefs.current.title3 = el}></div>
        <div className="animation-class eTitle4" ref={el => titleRefs.current.title4 = el}></div>
        <div className="animation-class eTitle5" ref={el => titleRefs.current.title5 = el}></div>
        <div className="animation-class eTitle6" ref={el => titleRefs.current.title6 = el}></div>

        <div className="animation-class min-text word2_w1" ref={el => wordRefs.current.word2_w1 = el}>
          眼睛宽度 <span>000</span>
        </div>
        <div className="animation-class min-text word2_w2" ref={el => wordRefs.current.word2_w2 = el}>
          眼睛高度 <span>000</span>
        </div>

        <div className="animation-class min-text word3_w1" ref={el => wordRefs.current.word3_w1 = el}>
          眉毛宽度 <span>000</span>
        </div>
        <div className="animation-class min-text word3_w2" ref={el => wordRefs.current.word3_w2 = el}>
          眉毛高度 <span>000</span>
        </div>

        <div className="animation-class min-text word4_w1" ref={el => wordRefs.current.word4_w1 = el}>
          嘴巴宽度 <span>000</span>
        </div>
        <div className="animation-class min-text word4_w2" ref={el => wordRefs.current.word4_w2 = el}>
          嘴巴高度 <span>000</span>
        </div>

        <div className="animation-class min-text word5_w1" ref={el => wordRefs.current.word5_w1 = el}>
          鼻翼宽度 <span>000</span>
        </div>

        <div className="animation-class min-text word6_w1" ref={el => wordRefs.current.word6_w1 = el}>
          下巴角度 <span>000</span>
        </div>

        <div className="animation-class min-text word1_w1" ref={el => wordRefs.current.word1_w1 = el}>
          黄金三角
        </div>
        <div className="animation-class min-text word1_w2" ref={el => wordRefs.current.word1_w2 = el}>
          <span>000</span>
        </div>
      </div>
    </div>
  );
};

export default FacialAnalysisAnimation;

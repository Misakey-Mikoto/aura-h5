import { useRef, useEffect } from 'react';

function FeatureCanvas({ imageUrl, partData, partType }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!imageUrl || !partData) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const bgImage = new Image();
    // 不设置 crossOrigin 以避免 CORS 问题

    bgImage.onload = () => {
      const imageWidth = bgImage.naturalWidth;
      const imageHeight = bgImage.naturalHeight;
      
      // 查找对应部位的数据
      const part = partData.find(p => p.part === partType);
      if (!part || !part.points) return;
      
      let points;
      try {
        points = typeof part.points === 'string' ? JSON.parse(part.points) : part.points;
      } catch {
        return;
      }
      
      if (!Array.isArray(points) || points.length === 0) return;
      
      // 计算部位的边界框
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      points.forEach(point => {
        if (!point || point.length < 2) return;
        const x = point[0];
        const y = point[1];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      });
      
      // 添加padding,鼻子部位特殊处理
      let padding = 50;
      let paddingX = padding;
      let paddingY = padding;
      
      if (partType === 6) {
        // 鼻子:增加左右padding,减少上下padding
        paddingX = 120;
        paddingY = 20;
      }
      
      minX = Math.max(0, minX - paddingX);
      minY = Math.max(0, minY - paddingY);
      maxX = Math.min(imageWidth, maxX + paddingX);
      maxY = Math.min(imageHeight, maxY + paddingY);
      
      const cropWidth = maxX - minX;
      const cropHeight = maxY - minY;
      
      // 计算显示尺寸
      const containerWidth = container.offsetWidth;
      const ratio = containerWidth / cropWidth;
      const aniWidth = cropWidth * ratio;
      const aniHeight = cropHeight * ratio;

      const rv = window.devicePixelRatio || 1;
      canvas.width = aniWidth * rv;
      canvas.height = aniHeight * rv;
      canvas.style.width = `${aniWidth}px`;
      canvas.style.height = `${aniHeight}px`;
      
      // 使用 CSS backgroundImage 显示裁剪后的部位
      const bgPosX = -(minX * ratio);
      const bgPosY = -(minY * ratio);
      const bgWidth = imageWidth * ratio;
      const bgHeight = imageHeight * ratio;
      
      canvas.style.backgroundImage = `url(${imageUrl})`;
      canvas.style.backgroundRepeat = 'no-repeat';
      canvas.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
      canvas.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(rv, rv);
      
      // 绘制标注点(坐标相对于裁剪区域)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      points.forEach(point => {
        if (!point || point.length < 2) return;
        const x = (point[0] - minX) * ratio;
        const y = (point[1] - minY) * ratio;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // 绘制连线
      if (points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.5;
        
        // 脸型(part 1)只绘制前17个点的轮廓,避免交叉
        const drawPoints = partType === 1 ? points.slice(0, 17) : points;
        
        ctx.moveTo((drawPoints[0][0] - minX) * ratio, (drawPoints[0][1] - minY) * ratio);
        for (let i = 1; i < drawPoints.length; i++) {
          ctx.lineTo((drawPoints[i][0] - minX) * ratio, (drawPoints[i][1] - minY) * ratio);
        }
        
        // 某些部位需要闭合路径
        if (partType === 3 || partType === 4) {
          ctx.closePath();
        }
        
        ctx.stroke();
      }
    };

    bgImage.onerror = (e) => {
      console.error('图片加载失败', imageUrl, e);
    };

    bgImage.src = imageUrl;
  }, [imageUrl, partData, partType]);

  return (
    <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', height: 'auto' }}></canvas>
    </div>
  );
}

export default FeatureCanvas;

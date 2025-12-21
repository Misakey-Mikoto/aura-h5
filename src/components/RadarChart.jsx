import { useMemo } from 'react';

function RadarChart({ conclusion }) {
  const radarData = useMemo(() => {
    if (!conclusion) return [];
    return [
      { name: '细腻度', value: conclusion.find(c => c.cid === 1)?.score || 0 },
      { name: '匀净度', value: conclusion.find(c => c.cid === 2)?.score || 0 },
      { name: '紧致度', value: conclusion.find(c => c.cid === 3)?.score || 0 },
      { name: '耐受度', value: conclusion.find(c => c.cid === 4)?.score || 0 },
      { name: '水油平衡', value: conclusion.find(c => c.cid === 5)?.score || 0 }
    ];
  }, [conclusion]);

  const centerX = 160;
  const centerY = 160;
  const maxRadius = 110;
  const angleStep = (Math.PI * 2) / radarData.length;

  const getPoint = (index, value) => {
    const angle = index * angleStep - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const getEndPoint = (index) => {
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: centerX + maxRadius * Math.cos(angle),
      y: centerY + maxRadius * Math.sin(angle)
    };
  };

  const getLabelPoint = (index) => {
    const angle = index * angleStep - Math.PI / 2;
    const labelRadius = maxRadius + 25;
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle)
    };
  };

  const dataPoints = radarData.map((item, index) => getPoint(index, item.value));
  const pathData = dataPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  if (!conclusion || radarData.length === 0) return null;

  return (
    <div className="radar-container">
      <img src="/imgs/radarbg.png" className="radar-bg" alt="雷达背景" />
      <svg width="320" height="320" style={{ position: 'absolute' }}>
        <path
          d={pathData}
          fill="rgba(253, 237, 217, 0.5)"
          stroke="#D3B288"
          strokeWidth="2"
        />

        {dataPoints.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#D3B288"
          />
        ))}

        {radarData.map((item, index) => {
          const labelPos = getLabelPoint(index);
          return (
            <g key={`label-${index}`}>
              <text
                x={labelPos.x}
                y={labelPos.y - 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#333333"
                fontSize="12"
                fontWeight="500"
                fontFamily="-apple-system, sans-serif"
              >
                {item.name}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#000000"
                fontSize="11"
                fontWeight="600"
                fontFamily="-apple-system, sans-serif"
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default RadarChart;

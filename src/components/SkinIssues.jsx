import { useEffect, useState } from 'react';
import { getSkinResult } from '../utils/issueCopy';
import IssueCard from './IssueCard';
import './SkinIssues.css';

function SkinIssues({ skinData, analyse, onImageClick }) {
  const [descModal, setDescModal] = useState({ show: false, title: '', content: '' });
  const [expandedAdviceBySkin, setExpandedAdviceBySkin] = useState({});
  
  const handleZoomClick = (labelImg) => {
    if (analyse?.image && labelImg) {
      onImageClick({ base: analyse.image, overlay: labelImg });
    } else if (labelImg) {
      onImageClick(labelImg);
    }
  };

  const skinTypeMap = {
    1: '毛孔', 2: '皱纹', 3: '色斑', 4: '痤疮',
    5: '黑眼圈', 8: '敏感', 9: '黑头'
  };

  const getSeverityLevel = (score) => {
    if (typeof score !== 'number') return 1;
    if (score >= 67) return 1;
    if (score >= 34) return 2;
    return 3;
  };

  const getSeverityName = (score) => {
    const level = getSeverityLevel(score);
    if (level === 1) return '轻度';
    if (level === 2) return '中度';
    return '重度';
  };

  const getIssueText = (item) => {
    const raw = item?.description || item?.desc || item?.content || item?.reason;
    if (typeof raw === 'string' && raw.trim()) return raw;

    const name = skinTypeMap?.[item?.skin] || '肌肤问题';
    const scoreText = typeof item?.score === 'number' ? `得分${item.score}` : '';
    const severityText = typeof item?.score === 'number' ? `（${getSeverityName(item.score)}）` : '';
    const numberText = typeof item?.number === 'number' ? `，数量${item.number}个` : '';
    const percentText = item?.percent != null && item?.percent !== ''
      ? `，面积占比${(parseFloat(item.percent) * 100).toFixed(0)}%`
      : '';

    const parts = [`${name}${scoreText}${severityText}${numberText}${percentText}`].filter(Boolean);
    return parts.join('');
  };

  const getScore10 = (score) => {
    const n = Number(score);
    if (!Number.isFinite(n)) return 0;
    const s = Math.round(n / 10);
    return Math.max(0, Math.min(10, s));
  };

  const getSkinCopy = (item) => {
    const name = skinTypeMap?.[item?.skin];
    if (!name) return null;
    try {
      return getSkinResult(name, getScore10(item?.score));
    } catch (_) {
      return null;
    }
  };

  const getDescriptionText = (item) => {
    const copy = getSkinCopy(item);
    return copy?.description || getIssueText(item);
  };

  const getAdviceText = (item) => {
    const copy = getSkinCopy(item);
    return copy?.advice || '';
  };

  const isLongText = (text) => {
    if (typeof text !== 'string') return false;
    if (text.includes('\n')) return true;
    return text.replace(/\s/g, '').length > 60;
  };

  const openDescModal = (title, content) => {
    setDescModal({ show: true, title, content });
  };

  const closeDescModal = () => {
    setDescModal({ show: false, title: '', content: '' });
  };

  const toggleAdvice = (skin) => {
    setExpandedAdviceBySkin((prev) => ({
      ...prev,
      [skin]: !prev?.[skin]
    }));
  };

  useEffect(() => {
    try {
      console.groupCollapsed('[SkinIssues] copy debug');
      console.log('skinData length:', Array.isArray(skinData) ? skinData.length : skinData);
      (skinData || []).forEach((it) => {
        const name = skinTypeMap?.[it?.skin];
        const score10 = getScore10(it?.score);
        let copy;
        let error;
        try {
          copy = name ? getSkinResult(name, score10) : null;
        } catch (e) {
          error = e;
        }

        console.log({
          skin: it?.skin,
          name,
          score: it?.score,
          score10,
          hasCopy: !!copy,
          descPreview: (copy?.description || '').slice(0, 60),
          advicePreview: (copy?.advice || '').slice(0, 60),
          error
        });
      });
      console.groupEnd();
    } catch (_) {
      // ignore
    }
  }, [skinData]);

  const getScorePosition = (score) => {
    return `${(100 - score) / 100 * 100}%`;
  };

  const getScoreColor = (score) => {
    if (score >= 67) return '#fbbc45';
    if (score >= 34) return '#ff7e4d';
    return '#fe4376';
  };

  const renderBlackheadIssue = (item) => {
    if (item.score === 100) {
      return (
        <div key={item.skin} className="childnode">
          <div className="none_data" style={{ display: 'block' }}>
            <div className="none_data_title">黑头</div>
            <div className="none_data_desc">无明显黑头问题，肌肤状态良好，请继续保持。</div>
          </div>
        </div>
      );
    }

    const adviceText = getAdviceText(item);

    return (
      <div key={item.skin} className="childnode">
        <IssueCard
          title="黑头"
          scoreLabel="黑头得分"
          scoreValue={item.score}
          solutionContent={adviceText}
        >
          <div className="issue-score-bar">
            <div className={`score-bar-segment score-bar-light ${item.score >= 67 ? 'score-bar-active' : ''}`}>
              <span>轻度</span>
            </div>
            <div className={`score-bar-segment score-bar-medium ${item.score >= 34 && item.score < 67 ? 'score-bar-active' : ''}`}>
              <span>中度</span>
            </div>
            <div className={`score-bar-segment score-bar-severe ${item.score < 34 ? 'score-bar-active' : ''}`}>
              <span>重度</span>
            </div>
          </div>
          <div className="issue-status-row">
            <div className="issue-status-dot"></div>
            <span className="issue-status-text">黑头状况</span>
          </div>
          <div className="status_pic">
            <div className="status_pic_v">
              <img className="pic_v" src="/imgs/女孩-黑头.png" alt="黑头" />
              {item.label_img && analyse?.image && (
                <div className="status_zoom" onClick={() => handleZoomClick(item.label_img)} style={{ backgroundImage: `url(${analyse.image})` }}>
                  <img className="zoom_pic" src="/imgs/icon_magnifier.png" alt="放大" />
                </div>
              )}
            </div>
            <div className="status_pic_n">数量：<span>{item.number || 0}</span>个</div>
          </div>
        </IssueCard>
      </div>
    );
  };

  const renderPoreIssue = (item) => {
    if (item.score === 100) {
      return (
        <div key={item.skin} className="childnode">
          <div className="none_data" style={{ display: 'block' }}>
            <div className="none_data_title">毛孔</div>
            <div className="none_data_desc">无明显毛孔问题，肌肤状态良好，请继续保持。</div>
          </div>
        </div>
      );
    }

    const poreImg = '/imgs/毛孔.png';
    const adviceText = getAdviceText(item);

    return (
      <div key={item.skin} className="childnode">
        <IssueCard
          title="毛孔"
          scoreLabel="毛孔得分"
          scoreValue={item.score}
          solutionContent={adviceText}
        >
          <div className="issue-score-bar">
            <div className={`score-bar-segment score-bar-light ${item.score >= 67 ? 'score-bar-active' : ''}`}>
              <span>轻度</span>
            </div>
            <div className={`score-bar-segment score-bar-medium ${item.score >= 34 && item.score < 67 ? 'score-bar-active' : ''}`}>
              <span>中度</span>
            </div>
            <div className={`score-bar-segment score-bar-severe ${item.score < 34 ? 'score-bar-active' : ''}`}>
              <span>重度</span>
            </div>
          </div>
          <div className="issue-status-row">
            <div className="issue-status-dot"></div>
            <span className="issue-status-text">毛孔状况</span>
          </div>
          <div className="status_pic2">
            <div className="sPic_area">
              <img src={poreImg} alt="毛孔" />
            </div>
            <div className="sPic_num">
              <div className="sPic_percent"><span>{Math.round(parseFloat(item.percent || 0) * 100)}</span>%</div>
              <div className="sPic_per">面积占比</div>
            </div>
          </div>
        </IssueCard>
      </div>
    );
  };

  const renderAcneIssue = (item) => {
    if (item.score === 100) {
      return (
        <div key={item.skin} className="childnode">
          <div className="none_data" style={{ display: 'block' }}>
            <div className="none_data_title">痤疮</div>
            <div className="none_data_desc">无明显痤疮问题，肌肤状态良好，请继续保持。</div>
          </div>
        </div>
      );
    }

    const adviceText = getAdviceText(item);

    return (
      <div key={item.skin} className="childnode">
        <IssueCard
          title="痤疮"
          scoreLabel="痤疮得分"
          scoreValue={item.score}
          solutionContent={adviceText}
        >
          <div className="issue-score-bar">
            <div className={`score-bar-segment score-bar-light ${item.score >= 67 ? 'score-bar-active' : ''}`}>
              <span>轻度</span>
            </div>
            <div className={`score-bar-segment score-bar-medium ${item.score >= 34 && item.score < 67 ? 'score-bar-active' : ''}`}>
              <span>中度</span>
            </div>
            <div className={`score-bar-segment score-bar-severe ${item.score < 34 ? 'score-bar-active' : ''}`}>
              <span>重度</span>
            </div>
          </div>
          <div className="issue-status-row">
            <div className="issue-status-dot"></div>
            <span className="issue-status-text">痤疮状况</span>
          </div>
          <div className="status_pic">
            <div className="status_pic_v">
              <img className="pic_v" src="/imgs/女孩-痤疮.png" alt="痤疮" />
              {item.label_img && analyse?.image && (
                <div className="status_zoom" onClick={() => handleZoomClick(item.label_img)} style={{ backgroundImage: `url(${analyse.image})` }}>
                  <img className="zoom_pic" src="/imgs/icon_magnifier.png" alt="放大" />
                </div>
              )}
            </div>
            <div className="status_pic_n">数量：<span>{item.number || 0}</span>个</div>
          </div>
        </IssueCard>
      </div>
    );
  };

  const renderWrinkleIssue = (item) => {
    if (item.score === 100) {
      return (
        <div key={item.skin} className="childnode">
          <div className="none_data" style={{ display: 'block' }}>
            <div className="none_data_title">皱纹</div>
            <div className="none_data_desc">无明显皱纹问题，肌肤状态良好，请继续保持。</div>
          </div>
        </div>
      );
    }

    let wrinkleTypes = [];
    try {
      const special = JSON.parse(item.special || '[]');
      wrinkleTypes = Array.isArray(special) ? special : [];
    } catch (e) {
      wrinkleTypes = [];
    }

    const adviceText = getAdviceText(item);

    return (
      <div key={item.skin} className="childnode">
        <IssueCard
          title="皱纹"
          scoreLabel="皱纹得分"
          scoreValue={item.score}
          solutionContent={adviceText}
        >
          <div className="issue-score-bar">
            <div className={`score-bar-segment score-bar-light ${item.score >= 67 ? 'score-bar-active' : ''}`}>
              <span>轻度</span>
            </div>
            <div className={`score-bar-segment score-bar-medium ${item.score >= 34 && item.score < 67 ? 'score-bar-active' : ''}`}>
              <span>中度</span>
            </div>
            <div className={`score-bar-segment score-bar-severe ${item.score < 34 ? 'score-bar-active' : ''}`}>
              <span>重度</span>
            </div>
          </div>
          <div className="issue-status-row">
            <div className="issue-status-dot"></div>
            <span className="issue-status-text">皱纹状况</span>
          </div>
          <div className="status_pic3">
            <div className={`wrinkle_type ${wrinkleTypes.includes(1) ? 'wrinkle_light' : ''}`}>
              <img src="/imgs/抬头纹.png" alt="抬头纹" />
              <span>抬头纹</span>
            </div>
            <div className={`wrinkle_type ${wrinkleTypes.includes(2) ? 'wrinkle_light' : ''}`}>
              <img src="/imgs/法令纹.png" alt="法令纹" />
              <span>法令纹</span>
            </div>
            <div className={`wrinkle_type ${wrinkleTypes.includes(3) ? 'wrinkle_light' : ''}`}>
              <img src="/imgs/眼角纹.png" alt="眼角纹" />
              <span>眼角纹</span>
            </div>
            <div className={`wrinkle_type ${wrinkleTypes.includes(4) ? 'wrinkle_light' : ''}`}>
              <img src="/imgs/脸颊纹.png" alt="脸颊细纹" />
              <span>脸颊细纹</span>
            </div>
          </div>
        </IssueCard>
      </div>
    );
  };

  const renderPigmentIssue = (item) => {
    if (item.score === 100) {
      return (
        <div key={item.skin} className="childnode">
          <div className="none_data" style={{ display: 'block' }}>
            <div className="none_data_title">色斑</div>
            <div className="none_data_desc">无明显色斑问题，肌肤状态良好，请继续保持。</div>
          </div>
        </div>
      );
    }

    const adviceText = getAdviceText(item);

    return (
      <div key={item.skin} className="childnode">
        <IssueCard
          title="色斑"
          scoreLabel="色斑得分"
          scoreValue={item.score}
          solutionContent={adviceText}
        >
          <div className="issue-score-bar">
            <div className={`score-bar-segment score-bar-light ${item.score >= 67 ? 'score-bar-active' : ''}`}>
              <span>轻度</span>
            </div>
            <div className={`score-bar-segment score-bar-medium ${item.score >= 34 && item.score < 67 ? 'score-bar-active' : ''}`}>
              <span>中度</span>
            </div>
            <div className={`score-bar-segment score-bar-severe ${item.score < 34 ? 'score-bar-active' : ''}`}>
              <span>重度</span>
            </div>
          </div>
          <div className="issue-status-row">
            <div className="issue-status-dot"></div>
            <span className="issue-status-text">色斑状况</span>
          </div>
          <div className="status_pic">
            <div className="status_pic_v">
              <img className="pic_v" src="/imgs/女孩-色斑.png" alt="色斑" />
              {item.label_img && analyse?.image && (
                <div className="status_zoom" onClick={() => handleZoomClick(item.label_img)} style={{ backgroundImage: `url(${analyse.image})` }}>
                  <img className="zoom_pic" src="/imgs/icon_magnifier.png" alt="放大" />
                </div>
              )}
            </div>
            <div className="status_pic_n">数量：<span>{item.number || 0}</span>个</div>
          </div>
        </IssueCard>
      </div>
    );
  };

  const renderSensitiveIssue = (item) => {
    if (item.score === 100) {
      return (
        <div key={item.skin} className="childnode">
          <div className="none_data" style={{ display: 'block' }}>
            <div className="none_data_title">敏感</div>
            <div className="none_data_desc">无明显敏感问题，肌肤状态良好，请继续保持。</div>
          </div>
        </div>
      );
    }

    const level = getSeverityLevel(item.score);
    const sensitiveImg = level === 1 ? '/imgs/mingan01.png' : level === 2 ? '/imgs/mingan02.png' : '/imgs/mingan03.png';
    const adviceText = getAdviceText(item);

    return (
      <div key={item.skin} className="childnode">
        <IssueCard
          title="敏感"
          scoreLabel="敏感得分"
          scoreValue={item.score}
          solutionContent={adviceText}
        >
          <div className="issue-score-bar">
            <div className={`score-bar-segment score-bar-light ${item.score >= 67 ? 'score-bar-active' : ''}`}>
              <span>轻度</span>
            </div>
            <div className={`score-bar-segment score-bar-medium ${item.score >= 34 && item.score < 67 ? 'score-bar-active' : ''}`}>
              <span>中度</span>
            </div>
            <div className={`score-bar-segment score-bar-severe ${item.score < 34 ? 'score-bar-active' : ''}`}>
              <span>重度</span>
            </div>
          </div>
          <div className="issue-status-row">
            <div className="issue-status-dot"></div>
            <span className="issue-status-text">敏感状况</span>
          </div>
          <div className="status_pic2">
            <div className="sPic_area">
              <img src={sensitiveImg} alt="敏感" />
            </div>
            <div className="sPic_num">
              <div className="sPic_percent"><span>{Math.round(parseFloat(item.percent || 0) * 100)}</span>%</div>
              <div className="sPic_per">面积占比</div>
            </div>
          </div>
        </IssueCard>
      </div>
    );
  };

  const renderDarkCircleIssue = (item) => {
    if (item.score === 100) {
      return (
        <div key={item.skin} className="childnode">
          <div className="none_data" style={{ display: 'block' }}>
            <div className="none_data_title">黑眼圈</div>
            <div className="none_data_desc">无明显黑眼圈问题，肌肤状态良好，请继续保持。</div>
          </div>
        </div>
      );
    }

    let eyeTypes = { left: [], right: [] };
    try {
      const special = JSON.parse(item.special || '[{"left":[]},{"right":[]}]');
      if (Array.isArray(special) && special.length >= 2) {
        eyeTypes.left = special[0].left || [];
        eyeTypes.right = special[1].right || [];
      }
    } catch (e) {
      eyeTypes = { left: [], right: [] };
    }

    const renderEyeOverlays = (sideTypes, side) => {
      const map = {
        1: `/imgs/hei_sesu_${side}.png`,
        2: `/imgs/hei_xueguan_${side}.png`,
        3: `/imgs/hei_jiegou_${side}.png`
      };
      return (sideTypes || [])
        .filter((t) => map[t])
        .map((t) => (
          <img key={`${side}-${t}`} className={`rim rimT${t}`} src={map[t]} alt="" />
        ));
    };

    const adviceText = getAdviceText(item);

    return (
      <div key={item.skin} className="childnode">
        <IssueCard
          title="黑眼圈"
          scoreLabel="黑眼圈得分"
          scoreValue={item.score}
          solutionContent={adviceText}
        >
          <div className="issue-score-bar">
            <div className={`score-bar-segment score-bar-light ${item.score >= 67 ? 'score-bar-active' : ''}`}>
              <span>轻度</span>
            </div>
            <div className={`score-bar-segment score-bar-medium ${item.score >= 34 && item.score < 67 ? 'score-bar-active' : ''}`}>
              <span>中度</span>
            </div>
            <div className={`score-bar-segment score-bar-severe ${item.score < 34 ? 'score-bar-active' : ''}`}>
              <span>重度</span>
            </div>
          </div>
          <div className="issue-status-row">
            <div className="issue-status-dot"></div>
            <span className="issue-status-text">黑眼圈状况</span>
          </div>
          <div className="status_pic3">
            <div className="eyes_title"><span>左眼</span> <span>右眼</span></div>
            <div className="eyes_tag">
              <div className="rimEye">
                <img className="rimBg" src="/imgs/hei_lian.png" alt="眼部" />
                <img className="rim rimT0" src="/imgs/hei_yan.png" alt="" />
                {renderEyeOverlays(eyeTypes.left, 'left')}
                {renderEyeOverlays(eyeTypes.right, 'right')}
              </div>
              <div className="rimType">
                <div className="rtDesc">
                  <div className="rtPic1"></div><span>色素型</span>
                </div>
                <div className="rtDesc">
                  <div className="rtPic2"></div><span>血管型</span>
                </div>
                <div className="rtDesc">
                  <img className="rtPic3" src="/imgs/cpoint.png" alt="" /><span>结构型</span>
                </div>
              </div>
            </div>
          </div>
        </IssueCard>
      </div>
    );
  };

  const renderIssue = (item) => {
    switch (item.skin) {
      case 9:
        return renderBlackheadIssue(item);
      case 1:
        return renderPoreIssue(item);
      case 4:
        return renderAcneIssue(item);
      case 2:
        return renderWrinkleIssue(item);
      case 3:
        return renderPigmentIssue(item);
      case 8:
        return renderSensitiveIssue(item);
      case 5:
        return renderDarkCircleIssue(item);
      default:
        return null;
    }
  };

  const issueOrder = [9, 1, 4, 2, 3, 8, 5];
  const orderedIssues = issueOrder
    .map(skinType => skinData.find(item => item.skin === skinType))
    .filter(item => item);

  return (
    <div className="mainContent">
      {orderedIssues.map(item => renderIssue(item))}
      
      {descModal.show && (
        <div className="issue_modal_overlay" onClick={closeDescModal}>
          <div className="issue_modal_content" onClick={e => e.stopPropagation()}>
            <div className="issue_modal_header">
              <div className="issue_modal_title">{descModal.title}</div>
              <button className="issue_modal_close" onClick={closeDescModal}>×</button>
            </div>
            <div className="issue_modal_body">
              <div className="issue_modal_paragraph">{descModal.content}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkinIssues;

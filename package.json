"use client";
import { useState, useEffect, useRef } from "react";

const SCAN_LINES = 16;
const SCAN_PHASES = ["表層スキャン中...", "感情パターン解析中...", "深層心理読み解き中...", "本音抽出中..."];
const MAX_IMAGE_MB = 4;

export default function Home() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // { base64, type, preview }
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [scanPhase, setScanPhase] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const typeRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let phase = 0;
    let interval;
    if (loading) {
      setScanPhase(0);
      interval = setInterval(() => {
        phase = (phase + 1) % SCAN_PHASES.length;
        setScanPhase(phase);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (result?.directMessage && !loading) {
      setTypedMessage("");
      let i = 0;
      const msg = result.directMessage;
      clearInterval(typeRef.current);
      typeRef.current = setInterval(() => {
        i++;
        setTypedMessage(msg.slice(0, i));
        if (i >= msg.length) clearInterval(typeRef.current);
      }, 40);
      return () => clearInterval(typeRef.current);
    }
  }, [result, loading]);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("画像ファイル（JPG・PNG・WEBP）を選択してください");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`画像サイズは${MAX_IMAGE_MB}MB以内にしてください`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImage({ base64: dataUrl.split(",")[1], type: file.type, preview: dataUrl });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!text.trim() && !image) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setTypedMessage("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim() || "",
          ...(image && { image: image.base64, imageType: image.type }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラーが発生しました");
      setResult(data);
    } catch (e) {
      setError(e.message || "分析に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const levelColor = (l) => {
    if (l < 30) return "#64748b";
    if (l < 60) return "#c084fc";
    if (l < 80) return "#f97316";
    return "#ef4444";
  };

  const canAnalyze = (text.trim().length > 0 || !!image) && !loading;

  const btnLabel = () => {
    if (loading) return null;
    if (image && !text.trim()) return "🖼️ 画像から深層心理を読み解く";
    if (image) return "🔮 テキスト＋画像から深層心理を読み解く";
    return "🔮 深層心理を読み解く";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", fontFamily: "'Noto Sans JP', sans-serif", color: "#e2e8f0", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700;900&family=Zen+Antique+Soft&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px #c084fc22} 50%{box-shadow:0 0 50px #c084fc44} }
        .fade-up   { animation: fadeUp 0.6s ease 0s   forwards; opacity:0; }
        .fade-up-1 { animation: fadeUp 0.6s ease 0.1s forwards; opacity:0; }
        .fade-up-2 { animation: fadeUp 0.6s ease 0.2s forwards; opacity:0; }
        .fade-up-3 { animation: fadeUp 0.6s ease 0.3s forwards; opacity:0; }
        .fade-up-5 { animation: fadeUp 0.6s ease 0.5s forwards; opacity:0; }
        .glow-card { animation: glowPulse 3s ease-in-out infinite; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #c084fc33; border-radius: 2px; }
      `}</style>

      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #c084fc08 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #818cf808 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(192,132,252,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(192,132,252,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {loading && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none", background: "linear-gradient(180deg, transparent 0%, rgba(192,132,252,0.06) 50%, transparent 100%)", animation: "scanLine 1.4s linear infinite" }} />
      )}

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "40px 16px 80px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "'Zen Antique Soft', serif", fontSize: "clamp(22px, 5vw, 38px)", fontWeight: 400, color: "#c084fc", letterSpacing: "0.2em", textShadow: "0 0 30px #c084fc66, 0 0 80px #c084fc22", animation: "pulse 4s ease-in-out infinite", marginBottom: 8 }}>
            深層心理スキャナー
          </div>
          <div style={{ fontSize: 11, color: "#c084fc44", letterSpacing: "0.3em" }}>DEEP PSYCHOLOGY ANALYSIS SYSTEM</div>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #c084fc44, transparent)", margin: "16px auto 0" }} />
        </div>

        {/* Text input */}
        <div style={{ border: "1px solid #c084fc22", background: "rgba(192,132,252,0.03)", borderRadius: 8, marginBottom: 12 }}>
          <div style={{ padding: "10px 16px", borderBottom: "1px solid #c084fc15", fontSize: 11, color: "#c084fc66", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#c084fc", fontSize: 8 }}>◆</span>
            分析したいテキストを入力（画像のみの場合は空欄でもOK）
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"例：「別に気にしてないし、全然平気なんだけど」\n「みんなは理解してくれないと思うけど…」\n「どうせ私なんて」"}
            rows={5}
            style={{ width: "100%", background: "transparent", border: "none", color: "#e2e8f0", fontFamily: "'Noto Sans JP', sans-serif", fontSize: 14, lineHeight: 1.9, padding: "16px", resize: "vertical", boxSizing: "border-box", display: "block" }}
          />
          <div style={{ padding: "6px 16px", borderTop: "1px solid #c084fc0a", fontSize: 10, color: "#ffffff1a", textAlign: "right" }}>{text.length} 文字</div>
        </div>

        {/* Image upload */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => !image && fileInputRef.current?.click()}
          style={{ border: `1px dashed ${dragOver ? "#c084fc" : image ? "#c084fc55" : "#c084fc22"}`, background: dragOver ? "rgba(192,132,252,0.08)" : image ? "rgba(192,132,252,0.04)" : "rgba(192,132,252,0.01)", borderRadius: 8, marginBottom: 14, cursor: image ? "default" : "pointer", transition: "all 0.2s", overflow: "hidden" }}
        >
          {image ? (
            <div style={{ position: "relative" }}>
              <img src={image.preview} alt="preview" style={{ width: "100%", maxHeight: 260, objectFit: "contain", display: "block", background: "#000" }} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "8px 12px", background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#c084fc" }}>🖼️ 画像をスキャン予定</span>
                <button onClick={(e) => { e.stopPropagation(); setImage(null); }} style={{ background: "rgba(239,68,68,0.3)", border: "1px solid #ef444466", color: "#ef4444", fontSize: 11, padding: "3px 10px", borderRadius: 3, cursor: "pointer" }}>✕ 削除</button>
              </div>
            </div>
          ) : (
            <div style={{ padding: "28px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📸</div>
              <div style={{ fontSize: 13, color: "#c084fc55", marginBottom: 4 }}>スクリーンショットをドラッグ＆ドロップ</div>
              <div style={{ fontSize: 11, color: "#ffffff22" }}>またはクリックしてファイルを選択　JPG / PNG / WEBP・最大{MAX_IMAGE_MB}MB</div>
              <div style={{ fontSize: 11, color: "#c084fc33", marginTop: 8 }}>Instagram・X・LINEなどのスクリーンショットに対応</div>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />

        {/* Disclaimer */}
        <div style={{ border: "1px solid #fbbf2422", background: "rgba(251,191,36,0.03)", borderRadius: 4, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 12, flexShrink: 0 }}>⚠️</span>
          <div style={{ fontSize: 10, color: "#fbbf2477", lineHeight: 1.7 }}>
            本ツールはエンターテインメント・自己理解目的のAI分析です。AIによる推測であり、実際の心理診断ではありません。他者への使用・誹謗中傷にはご使用にならないようお願いします。
          </div>
        </div>

        {/* Analyze button */}
        <button
          onClick={analyze}
          disabled={!canAnalyze}
          style={{ width: "100%", padding: "15px", background: canAnalyze ? "rgba(192,132,252,0.08)" : "transparent", border: `1px solid ${canAnalyze ? "#c084fc66" : "#c084fc22"}`, color: canAnalyze ? "#c084fc" : "#c084fc33", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.2em", cursor: canAnalyze ? "pointer" : "not-allowed", borderRadius: 4, transition: "all 0.3s", marginBottom: 32, textShadow: canAnalyze ? "0 0 10px #c084fc44" : "none" }}
        >
          {loading
            ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{ fontSize: 12, animation: "pulse 1s infinite" }}>◆</span>
                {SCAN_PHASES[scanPhase]}
              </span>
            : btnLabel()
          }
        </button>

        {/* Error */}
        {error && <div style={{ border: "1px solid #ef444444", background: "rgba(239,68,68,0.05)", padding: "12px 16px", color: "#ef4444", fontSize: 13, marginBottom: 24, borderRadius: 4 }}>⚠ {error}</div>}

        {/* Loading */}
        {loading && (
          <div style={{ padding: "32px 0", textAlign: "center" }}>
            {Array.from({ length: SCAN_LINES }).map((_, i) => (
              <div key={i} style={{ height: 1, background: `rgba(192,132,252,${0.03 + (i % 4) * 0.03})`, margin: "5px auto", borderRadius: 1, width: `${40 + (i * 3.7) % 55}%`, animation: `pulse ${1 + (i % 3) * 0.4}s infinite`, animationDelay: `${i * 0.06}s` }} />
            ))}
            <div style={{ marginTop: 20, fontSize: 12, color: "#c084fc44" }}>
              {image ? "画像の深層を読み解き中..." : "テキストの深層を読み解き中..."}
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div>
            {/* Emotion core */}
            <div className="fade-up" style={{ textAlign: "center", padding: "36px 24px", marginBottom: 16, border: "1px solid #c084fc22", borderRadius: 8, background: "rgba(0,0,0,0.4)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, #c084fc08 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "#c084fc44", marginBottom: 16 }}>感情の核心</div>
              <div style={{ fontFamily: "'Zen Antique Soft', serif", fontSize: "clamp(36px, 10vw, 64px)", color: "#c084fc", textShadow: "0 0 40px #c084fc88", marginBottom: 8, letterSpacing: "0.1em" }}>
                {result.emotionTone}
              </div>
              <div style={{ fontSize: 12, color: "#ffffff44", letterSpacing: "0.2em" }}>{result.emotionColor}</div>

              {/* 画像から読み取ったテキスト */}
              {result.extractedText && (
                <div style={{ marginTop: 16, padding: "10px 14px", border: "1px solid #c084fc15", borderRadius: 6, background: "rgba(192,132,252,0.05)", textAlign: "left" }}>
                  <div style={{ fontSize: 10, color: "#c084fc44", marginBottom: 4 }}>🖼️ 画像から読み取った情報</div>
                  <div style={{ fontSize: 12, color: "#c084fc88", lineHeight: 1.7 }}>{result.extractedText}</div>
                </div>
              )}
            </div>

            {/* Surface vs Real */}
            <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div style={{ border: "1px solid #64748b33", background: "rgba(100,116,139,0.06)", borderRadius: 6, padding: "16px" }}>
                <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.2em", marginBottom: 10 }}>表面上の言葉</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{result.surfaceMessage}</div>
              </div>
              <div style={{ border: "1px solid #c084fc33", background: "rgba(192,132,252,0.06)", borderRadius: 6, padding: "16px" }}>
                <div style={{ fontSize: 10, color: "#c084fc88", letterSpacing: "0.2em", marginBottom: 10 }}>本当に言いたいこと</div>
                <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.7, fontWeight: 700 }}>{result.realIntent}</div>
              </div>
            </div>

            {/* Want to hear */}
            <div className="fade-up-2" style={{ border: "1px solid #818cf833", background: "rgba(129,140,248,0.05)", borderRadius: 6, padding: "18px 20px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#818cf877", letterSpacing: "0.2em", marginBottom: 10 }}>💜 本当に言われたいこと</div>
              <div style={{ fontSize: 15, color: "#c7d2fe", lineHeight: 1.8, fontWeight: 700 }}>「{result.wantToHear}」</div>
            </div>

            {/* Psychology patterns */}
            <div className="fade-up-3" style={{ border: "1px solid #ffffff0a", background: "rgba(0,0,0,0.3)", borderRadius: 6, padding: "20px", marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#ffffff33", letterSpacing: "0.2em", marginBottom: 20 }}>🧠 心理パターン分析</div>
              {result.psychAnalysis?.map((p, i) => (
                <div key={i} style={{ marginBottom: 18, opacity: 0, animation: `fadeUp 0.4s ease ${0.4 + i * 0.12}s forwards` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: levelColor(p.level), fontWeight: 700 }}>{p.label}</span>
                    <span style={{ fontSize: 12, color: levelColor(p.level) }}>{p.level}%</span>
                  </div>
                  <div style={{ height: 4, background: "#ffffff07", borderRadius: 2, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ height: "100%", width: `${p.level}%`, background: `linear-gradient(90deg, ${levelColor(p.level)}55, ${levelColor(p.level)})`, borderRadius: 2, boxShadow: `0 0 8px ${levelColor(p.level)}44`, transition: "width 1.2s ease" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "#ffffff33" }}>{p.detail}</div>
                </div>
              ))}
            </div>

            {/* Direct message - typewriter */}
            <div className="fade-up-5 glow-card" style={{ border: "1px solid #c084fc44", background: "rgba(192,132,252,0.05)", borderRadius: 8, padding: "24px 22px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #c084fc66, transparent)" }} />
              <div style={{ fontSize: 10, color: "#c084fc66", letterSpacing: "0.25em", marginBottom: 14 }}>◆ AIからあなたへ</div>
              <div style={{ fontSize: 15, color: "#e2e8f0", lineHeight: 2, fontWeight: 300, letterSpacing: "0.05em" }}>
                {typedMessage}
                <span style={{ animation: "blink 0.8s step-end infinite", color: "#c084fc" }}>|</span>
              </div>
            </div>

            {/* Share */}
            <button
              onClick={() => {
                const tweet = `【深層心理スキャナー】\n\n感情の核心：「${result.emotionTone}」\n本当に言いたいこと：${result.realIntent}\n本当に言われたいこと：「${result.wantToHear}」\n\n#深層心理スキャナー #AI心理分析`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");
              }}
              style={{ width: "100%", padding: "13px", background: "rgba(29,161,242,0.07)", border: "1px solid rgba(29,161,242,0.4)", color: "#1DA1F2", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", borderRadius: 4, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.851L1.254 2.25H8.08l4.265 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
              Xに結果を共有する
            </button>
          </div>
        )}

        <div style={{ marginTop: 60, textAlign: "center", fontSize: 9, color: "#ffffff0e", letterSpacing: "0.2em" }}>
          Groq AI powered · エンターテインメント目的のみ
        </div>
      </div>
    </div>
  );
}

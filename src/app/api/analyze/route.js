import Groq from "groq-sdk";

const TEXT_PROMPT = `あなたは鋭い洞察力を持つ深層心理分析の専門家です。以下のテキストを分析し、書いた人が「本当に言いたいこと・言われたいこと」を読み解いてください。

テキスト:
"""
{TEXT}
"""

鋭く、容赦なく、しかし的確に本質を突いてください。
以下のJSON形式のみで返してください。前後の説明文は不要です。

{
  "surfaceMessage": "表面上の言葉の意味（30字以内）",
  "realIntent": "本当に言いたいこと・隠れた本音（40字以内、ズバリ言い切る）",
  "wantToHear": "本当に言われたい言葉・求めているもの（40字以内）",
  "psychAnalysis": [
    {
      "label": "心理パターン名（例：承認欲求、防衛機制、投影など）",
      "level": (0〜100の整数。そのパターンの強さ),
      "detail": "その心理が表れている根拠（30字以内）"
    }
  ],
  "directMessage": "AIから本人への直球メッセージ（60〜100字。「あなたは〜」で始める。鋭く、でも核心を突く言葉で。説教ではなく、見抜いた上での言葉として）",
  "emotionTone": "この投稿の感情の核心を一言で（例：孤独、怒り、不安、渇望、プライドなど）",
  "emotionColor": "感情を色で表すと（例：くすんだ青、燃えるような赤、霧がかった白など）"
}

psychAnalysisは3〜4個生成すること。
重要: JSONのみ返すこと。`;

const IMAGE_PROMPT = `あなたは鋭い洞察力を持つ深層心理分析の専門家です。
添付された画像はSNS投稿・メッセージ・日記などのスクリーンショットです。

【手順】
1. 画像内のテキスト・表情・構図・色調・演出などをすべて読み取る
2. 投稿した人が「本当に言いたいこと・言われたいこと」を深層心理から読み解く
3. 視覚的な演出（フィルター・構図・表情・物の配置など）も心理の手がかりとして使う

鋭く、容赦なく、しかし的確に本質を突いてください。
以下のJSON形式のみで返してください。前後の説明文は不要です。

{
  "surfaceMessage": "画像・テキストの表面上の意味（30字以内）",
  "realIntent": "本当に言いたいこと・隠れた本音（40字以内、ズバリ言い切る）",
  "wantToHear": "本当に言われたい言葉・求めているもの（40字以内）",
  "extractedText": "画像から読み取ったテキスト・状況の要約（60字以内）",
  "psychAnalysis": [
    {
      "label": "心理パターン名（例：承認欲求、防衛機制、投影など）",
      "level": (0〜100の整数。そのパターンの強さ),
      "detail": "その心理が表れている根拠（30字以内）"
    }
  ],
  "directMessage": "AIから本人への直球メッセージ（60〜100字。「あなたは〜」で始める。鋭く、でも核心を突く言葉で。説教ではなく、見抜いた上での言葉として）",
  "emotionTone": "この投稿の感情の核心を一言で（例：孤独、怒り、不安、渇望、プライドなど）",
  "emotionColor": "感情を色で表すと（例：くすんだ青、燃えるような赤、霧がかった白など）"
}

psychAnalysisは3〜4個生成すること。
重要: JSONのみ返すこと。`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, image, imageType } = body;

    const hasImage = image && imageType;
    const hasText = text && typeof text === "string" && text.trim().length > 0;

    if (!hasImage && !hasText) {
      return Response.json({ error: "テキストまたは画像を入力してください" }, { status: 400 });
    }

    if (hasText && text.length > 1000) {
      return Response.json({ error: "テキストが長すぎます（1000文字以内）" }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    let messages;

    if (hasImage) {
      // 画像分析モード：vision対応モデル
      const contentParts = [
        {
          type: "image_url",
          image_url: { url: `data:${imageType};base64,${image}` },
        },
        {
          type: "text",
          text: hasText
            ? IMAGE_PROMPT + `\n\nなお、ユーザーが以下のテキストも補足として入力しています：\n"""\n${text}\n"""`
            : IMAGE_PROMPT,
        },
      ];
      messages = [{ role: "user", content: contentParts }];
    } else {
      messages = [{ role: "user", content: TEXT_PROMPT.replace("{TEXT}", text) }];
    }

    const completion = await groq.chat.completions.create({
      model: hasImage ? "meta-llama/llama-4-scout-17b-16e-instruct" : "llama-3.3-70b-versatile",
      messages,
      max_tokens: 1200,
      temperature: 0.5,
    });

    const raw = completion.choices[0]?.message?.content || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return Response.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "分析に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}

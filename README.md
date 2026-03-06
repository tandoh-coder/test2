# 深層心理スキャナー - デプロイ手順

## 構成図
```
ユーザーのブラウザ → Vercelサーバー（APIキーを保管）→ Groq API
                        ↑ APIキーはここにしか存在しない
```

---

## STEP 1: Groq APIキーを取得する

1. https://console.groq.com にアクセス
2. 「Sign Up」でアカウント作成（Googleアカウントでも可）
3. 左メニューの「API Keys」→「Create API Key」
4. 表示された `gsk_` から始まるキーをコピー（一度しか表示されません！）

---

## STEP 2: GitHubにコードをアップロードする

1. https://github.com でリポジトリ作成（名前：psychology-scanner）
2. このフォルダの中身をアップロード
   ⚠️ `.env.local` は絶対にアップロードしないでください

---

## STEP 3: Vercelにデプロイする

1. https://vercel.com → GitHubでログイン
2. 「Add New Project」→ `psychology-scanner` を選択してImport
3. **Environment Variables** に以下を追加：
   - Name: `GROQ_API_KEY`
   - Value: STEP 1 でコピーしたAPIキー
4. 「Deploy」を押す

---

## STEP 4: 完成！

`https://psychology-scanner-xxxx.vercel.app` のURLが発行されます。

---

## ローカルで動かす場合

```bash
npm install

# .env.local を編集してAPIキーを設定
# GROQ_API_KEY=gsk_xxxxxxxxxx

npm run dev
# → http://localhost:3000
```

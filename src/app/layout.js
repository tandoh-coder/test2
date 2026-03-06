export const metadata = {
  title: "深層心理スキャナー",
  description: "SNS投稿・メッセージの深層心理をAIが読み解きます",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}

# Node.js 18 の公式イメージを使用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# 必要なファイルをコンテナにコピー
COPY package.json package-lock.json* ./
RUN npm install

# アプリのコードをコピー
COPY . .

# Remix をビルド
RUN npm run build

# ポートを開放
EXPOSE 5173

# Remix のサーバーを起動
CMD ["npm", "run", "start"]
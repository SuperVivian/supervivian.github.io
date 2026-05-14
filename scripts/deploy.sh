#!/bin/bash
set -e

echo "🚀 构建中..."
npx astro build

echo "📦 同步构建产物到 master 分支..."
rsync -av --delete --exclude='.git' --exclude='.gitignore' dist/ ../supervivian.github.io-master/

echo "📝 提交 master..."
cd ../supervivian.github.io-master
touch .nojekyll
git add -A
git commit -m "deploy: 更新构建产物" 2>/dev/null || echo "ℹ️  无变更，跳过提交"
git push origin master

echo "✅ 部署完成！"

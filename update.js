const fs = require('fs');
const axios = require('axios');

async function main() {
  try {
    console.log('开始拉取今日热榜...');

    // 免费热榜 API 示例（2026年可用，可自行替换）
   const response = await axios.get('https://v.api.aa1.cn/api/douyin-hot/index.php?aa1=hot');
    const hotData = response.data.data || []; // 假设返回格式 {data: [{title, hot, ...}]}

    // 只取前 10 条作为今日素材
    const todayMaterials = hotData.slice(0, 10).map((item, index) => ({
      id: index + 1,
      title: item.title || `热搜第${index + 1}：未知标题`,
      // 你可以在这里加更多字段，或调用其他 API 生成口播/文章
      oral: `今日爆款热搜：${item.title}！热度爆表，快来围观～（示例口播，可扩展成1200字）`,
      article: `详细分析：${item.title}\n热度：${item.hot || '未知'}\n\n（这里可以写1500字长文模板）`,
      images: [
        `https://picsum.photos/seed/${index + 1}/800/600`,
        `https://picsum.photos/seed/${index + 11}/800/600`,
        `https://picsum.photos/seed/${index + 21}/800/600`
      ]
    }));

    // 读取原有 index.html
    let htmlContent = fs.readFileSync('index.html', 'utf8');

    // 用正则替换 materials 数组部分（注意：你的 index.html 里必须有 const materials = [...] 这行）
    const newArrayStr = `const materials = ${JSON.stringify(todayMaterials, null, 2)};`;
    htmlContent = htmlContent.replace(/const materials = \[[\s\S]*?\];/, newArrayStr);

    // 写回文件
    fs.writeFileSync('index.html', htmlContent);

    console.log('index.html 已更新为今日热榜素材！');
  } catch (error) {
    console.error('更新失败:', error.message);
    process.exit(1); // 让 workflow 标记失败，便于排查
  }
}

main();

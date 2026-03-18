const fs = require('fs');
const axios = require('axios');

// 示例：拉取免费热榜 API（可替换成你喜欢的）
async function main() {
  try {
    // 推荐免费聚合热榜 API（2026年可用）
    const res = await axios.get('https://hot.imsyy.top/api'); // 或 https://v.api.aa1.cn/api/douyin-hot/index.php?aa1=hot
    const hotList = res.data.data.slice(0, 20); // 取前20条

    // 生成新的素材（你可以扩展成生成 10 条口播+文章）
    const newContent = hotList.map((item, i) => ({
      id: i+1,
      title: item.title,
      // 这里可以调用 AI API 生成口播和文章，或用模板填充
      oral: `今日热搜：${item.title}！${item.hot}热度爆表，快来看看是怎么回事～`,
      article: `详细解读：${item.title}...（1500字内容模板）`
    }));

    // 更新 index.html 中的 materials 数组（简单字符串替换方式）
    let html = fs.readFileSync('index.html', 'utf8');
    const newArray = `const materials = ${JSON.stringify(newContent, null, 2)};`;
    html = html.replace(/const materials = \[.*?\];/s, newArray);
    fs.writeFileSync('index.html', html);

    console.log('更新完成');
  } catch (err) {
    console.error('更新失败:', err);
  }
}

main();

export async function loadQuestions(type) {
  // 正式环境使用GitHub数据源
  if (process.env.NODE_ENV === 'production') {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/kepano/40-questions/main/zh-CN/questions/${type}.md`,
        { 
          next: { revalidate: 3600 },
          headers: {
            'Accept': 'text/markdown',
            'Cache-Control': 'public, max-age=3600'
          }
        }
      );
      
      if (!response.ok) {
        console.error(`GitHub请求失败: ${response.status} ${response.statusText}`);
        throw new Error('从GitHub加载问题失败');
      }
      
      const text = await response.text();
      const questions = text.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(question => question.length > 0);

      console.log(`成功从GitHub加载${type}问题，共${questions.length}条`);
      return questions;
      
    } catch (error) {
      console.error('GitHub数据源加载失败，尝试本地备用:', error);
    }
  }

  // 开发环境或备用方案使用本地数据
  try {
    const response = await fetch(`/zh-hans/${type}.md`);
    if (!response.ok) throw new Error('本地备用加载失败');
    
    const text = await response.text();
    const questions = text.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(question => question.length > 0);

    console.log(`使用本地${type}问题数据，共${questions.length}条`);
    return questions;
    
  } catch (error) {
    console.error('所有数据源均失败:', error);
    return [];
  }
}
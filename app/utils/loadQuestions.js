export async function loadQuestions(type) {
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

    console.log(`从GitHub加载${type}问题成功，共${questions.length}条`);
    return questions;
    
  } catch (error) {
    console.error('数据加载失败:', error);
    throw error;
  }
}

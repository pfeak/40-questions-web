export async function loadQuestions(type) {
  try {
    const testPrefix = process.env.NODE_ENV === 'test' ? '' : '/'
    const response = await fetch(
      `${testPrefix}data/questions/${type}.md`,
      { 
        headers: {
          'Accept': 'text/markdown'
        }
      }
    );
    
    if (!response.ok) {
      console.error(`数据请求失败: ${response.status} ${response.statusText}`);
      throw new Error('加载问题失败');
    }
    
    const text = await response.text();
    const questions = text.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(question => question.length > 0);

    console.log(`加载${type}问题成功，共${questions.length}条`);
    return questions;
    
  } catch (error) {
    console.error('数据加载失败:', error);
    throw error;
  }
}

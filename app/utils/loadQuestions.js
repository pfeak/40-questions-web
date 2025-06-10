export async function loadQuestions(type) {
  try {
    const response = await fetch(`/zh-hans/${type}.md`);
    if (!response.ok) {
      throw new Error(`Failed to load questions: ${response.status}`);
    }
    const text = await response.text();
    
    // 解析markdown文件，提取问题
    const lines = text.split('\n').filter(line => line.trim());
    const questions = lines.map(line => {
      // 移除行首的数字和点号
      return line.replace(/^\d+\.\s*/, '').trim();
    }).filter(question => question.length > 0);
    
    return questions;
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}
'use client';

import { useState, useEffect } from 'react';

export default function QuestionnaireForm({ questions, title, storageKey }) {
  const [answers, setAnswers] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // 从localStorage加载数据
  useEffect(() => {
    const savedAnswers = localStorage.getItem(storageKey);
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (error) {
        console.error('Error parsing saved answers:', error);
      }
    }
    setIsLoaded(true);
  }, [storageKey]);

  // 保存到localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(answers));
    }
  }, [answers, storageKey, isLoaded]);

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const generateMarkdown = () => {
    const date = new Date().toLocaleDateString('zh-CN');
    let markdown = `# ${title}\n\n**填写日期：** ${date}\n\n`;
    
    questions.forEach((question, index) => {
      const answer = answers[index] || '';
      markdown += `## ${index + 1}. ${question}\n\n${answer}\n\n---\n\n`;
    });
    
    return markdown;
  };

  const downloadMarkdown = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAllAnswers = () => {
    if (confirm('确定要清空所有答案吗？此操作不可撤销。')) {
      setAnswers({});
      localStorage.removeItem(storageKey);
    }
  };

  const getProgress = () => {
    const answeredCount = Object.values(answers).filter(answer => answer && answer.trim()).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        
        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">完成进度</span>
            <span className="text-sm text-gray-600">{getProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={downloadMarkdown}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            下载为 Markdown
          </button>
          <button
            onClick={clearAllAnswers}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            清空所有答案
          </button>
        </div>
      </div>

      {/* 问题列表 */}
      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <label className="block mb-4">
              <span className="text-lg font-medium text-gray-800 mb-3 block">
                {index + 1}. {question}
              </span>
              <textarea
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="在这里写下你的答案..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[120px] text-gray-700"
                rows={4}
              />
            </label>
            {answers[index] && answers[index].trim() && (
              <div className="mt-2 text-sm text-green-600">
                ✓ 已回答
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 底部操作栏 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-600">
            已完成 {Object.values(answers).filter(answer => answer && answer.trim()).length} / {questions.length} 个问题
          </div>
          <div className="flex gap-4">
            <button
              onClick={downloadMarkdown}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              下载答案
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
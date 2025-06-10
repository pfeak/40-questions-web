'use client';

import { useState, useEffect } from 'react';

export default function QuestionnaireForm({ questions, title, storageKey }) {
  const [answers, setAnswers] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // 从localStorage加载数据
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem(storageKey);
      if (savedAnswers) {
        const parsedAnswers = JSON.parse(savedAnswers);
        setAnswers(parsedAnswers);
      }
    } catch (error) {
      console.error('Error parsing saved answers:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // 计算进度
  useEffect(() => {
    const answeredCount = Object.values(answers).filter(answer => answer && answer.trim() !== '').length;
    const progressPercentage = Math.round((answeredCount / questions.length) * 100);
    setProgress(progressPercentage);
  }, [answers, questions.length]);

  // 保存答案到localStorage
  const saveAnswer = (questionIndex, answer) => {
    try {
      const newAnswers = { ...answers, [questionIndex]: answer };
      setAnswers(newAnswers);
      localStorage.setItem(storageKey, JSON.stringify(newAnswers));
    } catch (error) {
      console.error('Failed to save answer:', error);
    }
  };

  // 导出为Markdown
  const exportToMarkdown = () => {
    try {
      const date = new Date().toLocaleDateString('zh-CN');
      const answeredCount = Object.values(answers).filter(answer => answer && answer.trim() !== '').length;
      
      let markdown = `# ${title}\n\n`;
      markdown += `**填写日期：** ${date}\n\n`;
      markdown += `**完成情况：** ${answeredCount}/${questions.length} 题 (${Math.round((answeredCount / questions.length) * 100)}%)\n\n`;
      markdown += `---\n\n`;
      
      questions.forEach((question, index) => {
        const answer = answers[index] || '';
        markdown += `## ${index + 1}. ${question}\n\n`;
        
        if (answer.trim()) {
          // 确保答案格式正确，去除多余空行
          const cleanAnswer = answer.trim().replace(/\n\s*\n\s*\n/g, '\n\n');
          markdown += `${cleanAnswer}\n\n`;
        } else {
          markdown += `*（未回答）*\n\n`;
        }
        
        if (index < questions.length - 1) {
          markdown += `---\n\n`;
        }
      });
      
      // 添加结尾统计
      markdown += `\n---\n\n`;
      markdown += `## 📊 完成统计\n\n`;
      markdown += `- **总问题数：** ${questions.length}\n`;
      markdown += `- **已回答：** ${answeredCount}\n`;
      markdown += `- **未回答：** ${questions.length - answeredCount}\n`;
      markdown += `- **完成度：** ${Math.round((answeredCount / questions.length) * 100)}%\n\n`;
      markdown += `*生成时间：${new Date().toLocaleString('zh-CN')}*\n`;
      
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 生成更友好的文件名
      const safeTitle = title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      const dateStr = date.replace(/\//g, '-');
      link.download = `${safeTitle}-${dateStr}.md`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export markdown:', error);
      alert('导出失败，请重试');
    }
  };

  // 清空所有答案
  const clearAllAnswers = () => {
    if (confirm('确定要清空所有答案吗？此操作不可撤销。')) {
      try {
        setAnswers({});
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error('Failed to clear answers:', error);
      }
    }
  };

  const answeredCount = Object.values(answers).filter(answer => answer && answer.trim() !== '').length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* 头部导航 */}
        <div className="mb-8">
          <a 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium group"
          >
            <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </a>
        </div>
        
        {/* 主标题卡片 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 backdrop-blur-sm bg-white/90">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {title}
            </h1>
            <p className="text-gray-600 text-lg">深度思考，记录成长，探索内心的真实想法</p>
          </div>
          
          {/* 进度显示 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">完成进度</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {answeredCount} / {questions.length} 题
                </span>
                <span className="text-xl font-bold text-blue-600">{progress}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 h-4 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={exportToMarkdown}
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              下载为 Markdown
            </button>
            <button
              onClick={clearAllAnswers}
              className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清空所有答案
            </button>
          </div>
        </div>

        {/* 问题列表 */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const isAnswered = answers[index] && answers[index].trim() !== '';
            
            return (
              <div 
                key={index} 
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                  isAnswered 
                    ? 'border-green-200 bg-gradient-to-br from-green-50/50 to-white' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="p-6">
                  <label className="block">
                    <div className="flex items-start mb-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-4 transition-all duration-200 ${
                        isAnswered 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                          : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700'
                      }`}>
                        {isAnswered ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                          {index + 1}. {question}
                        </h3>
                      </div>
                    </div>
                    <div className="ml-14">
                      <textarea
                        value={answers[index] || ''}
                        onChange={(e) => saveAnswer(index, e.target.value)}
                        placeholder="请在这里写下你的深度思考和真实感受..."
                        className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none text-gray-800 placeholder-gray-400 ${
                          isAnswered 
                            ? 'border-green-300 bg-green-50/30 focus:bg-white' 
                            : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                        }`}
                        rows="5"
                      />
                      {isAnswered && (
                        <div className="mt-3 flex items-center text-green-600 text-sm font-medium">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          已完成回答
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部总结卡片 */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl shadow-2xl text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">完成情况总览</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <div className="text-4xl font-bold mb-2">{questions.length}</div>
                  <div className="text-sm opacity-90">总问题数</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <div className="text-4xl font-bold mb-2">{answeredCount}</div>
                  <div className="text-sm opacity-90">已回答</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <div className="text-4xl font-bold mb-2">{progress}%</div>
                  <div className="text-sm opacity-90">完成度</div>
                </div>
              </div>
              <button
                onClick={exportToMarkdown}
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 text-lg"
              >
                🚀 导出我的深度思考
              </button>
            </div>
          </div>
        </div>

        {/* 底部间距 */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
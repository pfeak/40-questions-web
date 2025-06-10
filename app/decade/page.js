'use client';

import { useState, useEffect } from 'react';
import QuestionnaireForm from '../components/QuestionnaireForm';
import { loadQuestions } from '../utils/loadQuestions';
import Link from 'next/link';

export default function Page() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const questionList = await loadQuestions('decade');
                setQuestions(questionList);
            } catch (err) {
                setError('加载问题失败，请刷新页面重试');
                console.error('Error loading questions:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchQuestions();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">加载问题中...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-lg text-red-600 mb-4">{error}</div>
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                    返回首页
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto p-4">
                    <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                        ← 返回首页
                    </Link>
                </div>
            </div>
            <QuestionnaireForm 
                questions={questions}
                title="每 10 年问自己的 40 个问题"
                storageKey="decade-questions-answers"
            />
        </div>
    );
}

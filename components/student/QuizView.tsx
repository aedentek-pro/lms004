import React, { useState } from 'react';
import { Quiz, Question } from '../../types';
import { CheckCircleIcon } from '../icons/Icons';

interface QuizViewProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswerIndex) {
        correctAnswers++;
      }
    });
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setIsCompleted(true);
    onComplete(finalScore);
  };

  if (isCompleted) {
    return (
      <div className="text-center">
        <CheckCircleIcon className="w-16 h-16 text-teal-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2 text-slate-800">Quiz Completed!</h3>
        <p className="text-lg text-slate-600">Your Score:</p>
        <p className={`text-5xl font-bold ${score >= 70 ? 'text-teal-500' : 'text-amber-500'}`}>{score}%</p>
        <p className="mt-4 text-sm text-slate-500">You can now close this window.</p>
      </div>
    );
  }

  const currentQuestion: Question = quiz.questions[currentQuestionIndex];

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
        <h3 className="text-xl font-semibold text-slate-800 mt-1">{currentQuestion.text}</h3>
      </div>
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnswers[currentQuestionIndex] === index
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-100 border-slate-200 hover:bg-slate-200 hover:border-indigo-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button onClick={handleNext} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={selectedAnswers[currentQuestionIndex] === null}>
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={selectedAnswers[currentQuestionIndex] === null}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};
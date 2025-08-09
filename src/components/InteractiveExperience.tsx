import React, { useState, useEffect } from 'react';
import { Button } from './ui/button'; // Adjusted import path
import { Input } from './ui/input';
import { Card } from './ui/card';

// ======== Types ========
type Stage = 'landing' | 'auth' | 'questions' | 'countdown' | 'final';

interface User {
  username: string;
  password: string;
}

interface Answer {
  question: string;
  answer: string;
}

// ======== Constants ========
const QUESTIONS = [
  "What makes you feel most alive?",
  "If you could have dinner with anyone, who would it be?",
  "What's the most spontaneous thing you've ever done?",
  // Add more questions...
];

// ======== Main Component ========
export const InteractiveExperience = () => {
  // ======== State ========
  const [stage, setStage] = useState<Stage>('landing');
  const [user, setUser] = useState<User>({ username: '', password: '' });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ======== Effects ========
  useEffect(() => {
    if (stage === 'countdown') {
      const timer = countdown > 0 
        ? setTimeout(() => setCountdown(countdown - 1), 1000)
        : setTimeout(() => setStage('final'), 1000);
      
      return () => clearTimeout(timer);
    }
  }, [stage, countdown]);

  // ======== Handlers ========
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user.username.trim() || !user.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setStage('questions');
  };

  const handleNextQuestion = async () => {
    if (!currentAnswer.trim()) {
      setError('Please enter your answer');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setAnswers([...answers, {
      question: QUESTIONS[currentQuestionIndex],
      answer: currentAnswer
    }]);
    
    setCurrentAnswer('');
    setError(null);
    
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStage('countdown');
    }
    
    setIsLoading(false);
  };

  // ======== Render Methods ========
  const renderLanding = () => (
    <div className="text-center animate-fade-in">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-primary">
        Are you free?
      </h1>
      <Button 
        onClick={() => setStage('auth')}
        size="lg"
        className="animate-pulse"
      >
        I am free
      </Button>
    </div>
  );

  const renderAuth = () => (
    <Card className="w-full max-w-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleAuth} className="space-y-4">
        <Input
          placeholder="Username"
          value={user.username}
          onChange={(e) => setUser({...user, username: e.target.value})}
        />
        <Input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({...user, password: e.target.value})}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Continue'}
        </Button>
      </form>
    </Card>
  );

  // ... (similar render methods for other stages)

  // ======== Main Render ========
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-2xl">
        {stage === 'landing' && renderLanding()}
        {stage === 'auth' && renderAuth()}
        {/* Add other stage renders */}
      </div>
    </div>
  );
};

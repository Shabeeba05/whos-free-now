import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

type Stage = 'landing' | 'auth' | 'questions' | 'countdown' | 'final';

interface User {
  username: string;
  password: string;
}

interface Answer {
  question: string;
  answer: string;
}

const questions = [
  "What makes you feel most alive?",
  "If you could have dinner with anyone, dead or alive, who would it be?",
  "What's the most spontaneous thing you've ever done?",
  "What's your biggest fear and your biggest dream?",
  "If you had to describe yourself in three words, what would they be?",
  "What song always makes you dance, no matter where you are?",
  "What's the kindest thing someone has ever done for you?"
];

export const InteractiveExperience: React.FC = () => {
  const [stage, setStage] = useState<Stage>('landing');
  const [user, setUser] = useState<User>({ username: '', password: '' });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [isSignUp, setIsSignUp] = useState(false);

  // Countdown effect
  useEffect(() => {
    if (stage === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && countdown === 0) {
      setTimeout(() => setStage('final'), 1000);
    }
  }, [stage, countdown]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.username && user.password) {
      setStage('questions');
    }
  };

  const handleNextQuestion = () => {
    if (currentAnswer.trim()) {
      const newAnswer: Answer = {
        question: questions[currentQuestionIndex],
        answer: currentAnswer
      };
      setAnswers([...answers, newAnswer]);
      setCurrentAnswer('');
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setStage('countdown');
      }
    }
  };

  const renderLanding = () => (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
        Are you free?
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
        Ready for an adventure that might just change everything?
      </p>
      <Button 
        variant="hero" 
        size="xl"
        onClick={() => setStage('auth')}
        className="animate-bounce-gentle hover:scale-105 transition-transform duration-300"
      >
        I am free
      </Button>
    </div>
  );

  const renderAuth = () => (
    <Card className="w-full max-w-md mx-auto p-8 animate-slide-in-right shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-primary bg-clip-text text-transparent">
        {isSignUp ? 'Join the Adventure' : 'Welcome Back'}
      </h2>
      <form onSubmit={handleAuth} className="space-y-6">
        <div>
          <Input
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="text-lg p-4 rounded-xl border-2 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="text-lg p-4 rounded-xl border-2 focus:border-primary transition-colors"
          />
        </div>
        <Button 
          type="submit" 
          variant="hero" 
          className="w-full text-lg py-4 rounded-xl"
          disabled={!user.username || !user.password}
        >
          {isSignUp ? 'Start My Journey' : 'Continue'}
        </Button>
      </form>
      <p className="text-center mt-6 text-muted-foreground">
        {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:text-primary-glow font-semibold transition-colors"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </Card>
  );

  const renderQuestions = () => (
    <Card className="w-full max-w-2xl mx-auto p-8 animate-fade-in-up shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="w-32 bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          {questions[currentQuestionIndex]}
        </h2>
      </div>
      
      <div className="space-y-6">
        <Input
          type="text"
          placeholder="Share your thoughts..."
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          className="text-lg p-4 rounded-xl border-2 focus:border-primary transition-colors"
          onKeyPress={(e) => e.key === 'Enter' && currentAnswer.trim() && handleNextQuestion()}
        />
        <Button 
          onClick={handleNextQuestion}
          variant="hero"
          className="w-full text-lg py-4 rounded-xl"
          disabled={!currentAnswer.trim()}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
        </Button>
      </div>
    </Card>
  );

  const renderCountdown = () => (
    <div className="text-center animate-fade-in-up">
      <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent">
        Finding you based on your answers...
      </h2>
      <div className="text-8xl md:text-9xl font-bold mb-8 animate-bounce-gentle">
        {countdown}
      </div>
      <div className="w-32 h-32 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const renderFinal = () => (
    <div className="text-center animate-fade-in-up">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-secondary bg-clip-text text-transparent">
        Adipolli Nalle oru ithaan ath.
      </h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
        {answers.map((answer, index) => (
          <Card key={index} className="p-6 animate-fade-in-up shadow-lg" style={{ animationDelay: `${index * 0.1}s` }}>
            <h3 className="font-semibold text-primary mb-2">{answer.question}</h3>
            <p className="text-muted-foreground">{answer.answer}</p>
          </Card>
        ))}
      </div>
      <Button 
        variant="secondary" 
        onClick={() => {
          setStage('landing');
          setCurrentQuestionIndex(0);
          setAnswers([]);
          setCurrentAnswer('');
          setCountdown(5);
          setUser({ username: '', password: '' });
        }}
        className="mt-12 text-lg py-4 px-8 rounded-xl"
      >
        Start Over
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {stage === 'landing' && renderLanding()}
        {stage === 'auth' && renderAuth()}
        {stage === 'questions' && renderQuestions()}
        {stage === 'countdown' && renderCountdown()}
        {stage === 'final' && renderFinal()}
      </div>
    </div>
  );
};
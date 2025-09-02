import React, { useState, useEffect } from 'react';
import SorobanAbacus from './components/SorobanAbacus';
import InfoModal from './components/InfoModal';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'free' | 'challenge' | 'quick';

const difficultySettings = {
  easy: { columns: 2, min: 1, max: 99, label: 'Fácil' },
  medium: { columns: 3, min: 100, max: 999, label: 'Médio' },
  hard: { columns: 5, min: 1000, max: 99999, label: 'Difícil' },
};

const gameModeSettings: Record<GameMode, { label: string }> = {
  free: { label: 'Prática Livre' },
  challenge: { label: 'Desafio' },
  quick: { label: 'Desafio Rápido' },
};

const quickChallengeTimes: Record<Difficulty, number> = {
  easy: 15,
  medium: 20,
  hard: 30,
};

const challengeTimes: Record<Difficulty, number> = {
  easy: 60,
  medium: 90,
  hard: 120,
};

const App: React.FC = () => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [challengeNumber, setChallengeNumber] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [resetAbacus, setResetAbacus] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('challenge');
  const [isInfoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isChallengeActive, setIsChallengeActive] = useState(true);

  const currentDifficulty = difficultySettings[difficulty];

  const triggerReset = () => {
    setResetAbacus(true);
    setTimeout(() => setResetAbacus(false), 50);
  };

  const startNewChallenge = (level: Difficulty = difficulty, mode: GameMode = gameMode) => {
    if (mode === 'free') {
      setChallengeNumber(null);
      setFeedback('');
      setIsCorrect(false);
      setIsChallengeActive(true); 
      setTimeLeft(0);
      triggerReset();
      return;
    }

    const { min, max } = difficultySettings[level];
    const newChallenge = Math.floor(Math.random() * (max - min + 1)) + min;
    setChallengeNumber(newChallenge);
    setFeedback('');
    setIsCorrect(false);
    setIsChallengeActive(true);
    
    if (mode === 'quick') {
      setTimeLeft(quickChallengeTimes[level]);
    } else if (mode === 'challenge') {
      setTimeLeft(challengeTimes[level]);
    }
    triggerReset();
  };
  
  useEffect(() => {
    startNewChallenge('easy', 'challenge');
  }, []);

  useEffect(() => {
    if (!isChallengeActive || gameMode === 'free') return;

    if (timeLeft > 0) {
      const timerId = window.setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (challengeNumber !== null) {
      setFeedback('Tempo esgotado! ⌛');
      setIsChallengeActive(false);
    }
  }, [timeLeft, isChallengeActive, gameMode, challengeNumber]);
  
  const handleModeChange = (newMode: GameMode) => {
    setGameMode(newMode);
    startNewChallenge(difficulty, newMode);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    if (gameMode !== 'free') {
      startNewChallenge(newDifficulty, gameMode);
    }
  };

  const handleResetClick = () => {
    triggerReset();
    if (gameMode !== 'free' && isChallengeActive) {
        setFeedback('');
        setIsCorrect(false);
    }
  };

  useEffect(() => {
    if (gameMode !== 'free' && isChallengeActive && challengeNumber !== null && currentValue === challengeNumber) {
      setFeedback('Correto! 🎉');
      setIsCorrect(true);
      setIsChallengeActive(false);
    }
  }, [currentValue, challengeNumber, isChallengeActive, gameMode]);
  
  const isAbacusDisabled = gameMode !== 'free' && !isChallengeActive;

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center p-4 relative">
        <button
            onClick={() => setInfoModalOpen(true)}
            className="absolute top-5 right-5 w-12 h-12 bg-amber-600 text-white font-bold text-2xl rounded-full shadow-lg hover:bg-amber-700 flex items-center justify-center font-patrick-hand z-20"
            aria-label="Informações do Jogo"
        >
            i
        </button>

      <header className="text-center">
        <h1 className="font-patrick-hand text-8xl font-bold text-amber-800" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}>
          SOROBAN
        </h1>
        <p className="text-amber-700 text-lg mt-2">Pratique com o ábaco japonês virtual</p>
      </header>

      <main className="flex flex-col items-center w-full gap-8 mt-8">
        <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Número Representado</h2>
            <p className="text-6xl font-bold text-gray-900 tracking-wider">{currentValue.toLocaleString('pt-BR')}</p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center space-x-2 md:space-x-4 bg-amber-200/50 p-2 rounded-full">
                {(Object.keys(gameModeSettings) as GameMode[]).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => handleModeChange(mode)}
                        className={`px-4 py-2 md:px-6 md:py-2 text-base md:text-lg font-bold rounded-full transition-colors duration-300 ${
                            gameMode === mode
                            ? 'bg-amber-700 text-white shadow-md'
                            : 'bg-transparent text-amber-800 hover:bg-amber-300/70'
                        }`}
                    >
                        {gameModeSettings[mode].label}
                    </button>
                ))}
            </div>
            <div className="flex justify-center space-x-2 md:space-x-4 bg-amber-200/50 p-2 rounded-full">
                {(Object.keys(difficultySettings) as Difficulty[]).map((level) => (
                    <button
                        key={level}
                        onClick={() => handleDifficultyChange(level)}
                        className={`px-4 py-2 md:px-6 md:py-2 text-base md:text-lg font-bold rounded-full transition-colors duration-300 ${
                            difficulty === level
                            ? 'bg-amber-700 text-white shadow-md'
                            : 'bg-transparent text-amber-800 hover:bg-amber-300/70'
                        }`}
                    >
                        {difficultySettings[level].label}
                    </button>
                ))}
            </div>
        </div>

        <SorobanAbacus 
          onValueChange={setCurrentValue} 
          reset={resetAbacus} 
          numColumns={currentDifficulty.columns}
          className={isCorrect ? 'animate-correct' : ''}
          disabled={isAbacusDisabled}
        />
        
        <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-lg text-center border border-amber-200 min-h-[280px] flex flex-col justify-center">
            {gameMode === 'free' ? (
                 <div>
                    <h2 className="text-2xl font-semibold text-gray-700">Modo de Prática Livre</h2>
                    <p className="text-gray-600 mt-2">Use o ábaco livremente para aprender e explorar. Mude a dificuldade acima para alterar o número de colunas.</p>
                    <div className="mt-8">
                         <button 
                            onClick={handleResetClick}
                            className="px-8 py-3 bg-transparent border-2 border-amber-600 text-amber-700 font-bold text-xl rounded-lg shadow-sm hover:bg-amber-600 hover:text-white active:bg-amber-700 transition-all transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                            >
                            Resetar Ábaco
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-baseline mb-2">
                      <h2 className="text-xl font-semibold text-gray-700">Represente o número:</h2>
                      {(gameMode === 'quick' || gameMode === 'challenge') && (
                        <div className="text-lg font-semibold text-gray-700">
                            <span>Tempo: </span>
                             <span className={`font-bold text-2xl ${
                                gameMode === 'quick' && timeLeft <= 10 && timeLeft > 0
                                ? 'text-red-500 animate-time-pulse'
                                : 'text-gray-900'
                            }`}>
                                {timeLeft}s
                            </span>
                        </div>
                      )}
                    </div>
                    
                    <p className={`text-6xl font-bold mb-4 transition-colors duration-300 ${isCorrect ? 'text-green-500 animate-correct' : 'text-blue-600'}`}>
                      {challengeNumber?.toLocaleString('pt-BR')}
                    </p>
                    {feedback && (
                      <p className={`text-2xl font-semibold mt-2 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                        {feedback}
                      </p>
                    )}
                  
                    <div className="mt-8 flex justify-center items-center space-x-4">
                       <button 
                          onClick={() => startNewChallenge(difficulty, gameMode)} 
                          className="px-8 py-3 bg-amber-600 text-white font-bold text-xl rounded-lg shadow-md hover:bg-amber-700 active:bg-amber-800 transition-all transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                        >
                          {isCorrect || !isChallengeActive ? 'Próximo Desafio' : 'Novo Desafio'}
                        </button>
                         <button 
                          onClick={handleResetClick}
                          className="px-8 py-3 bg-transparent border-2 border-amber-600 text-amber-700 font-bold text-xl rounded-lg shadow-sm hover:bg-amber-600 hover:text-white active:bg-amber-700 transition-all transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                        >
                          Resetar Ábaco
                        </button>
                    </div>
                </>
            )}
        </div>
      </main>
      <footer className="text-center text-amber-700 mt-8">
        <p>Mova as bolas para formar números. A bola superior vale 5, as inferiores valem 1.</p>
      </footer>
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setInfoModalOpen(false)} />
    </div>
  );
};

export default App;

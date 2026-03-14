import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import '@/styles/baraban.css';

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  prompt: string;
  correct_index: number;
  difficulty: string;
  options: Option[];
}

interface NameData {
  name: string;
  questions: Question[];
}

export const Baraban = () => {
  const [nameData, setNameData] = useState<NameData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'finished'>('loading');
  const [loading, setLoading] = useState(true);
  const [showAddTest, setShowAddTest] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState('');
  const [newTestQuestion, setNewTestQuestion] = useState('');
  const [newTestOptions, setNewTestOptions] = useState(['', '', '', '']);
  const [newTestCorrectIndex, setNewTestCorrectIndex] = useState(0);
  const [addedTestCount, setAddedTestCount] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    try {
      setLoading(true);
      setGameState('loading');
      
      // Backend dan random isim va uning testlarini olish
      const response = await fetch('http://localhost:8000/api/baraban/random-person');
      if (!response.ok) throw new Error('Xatolik: Ma\'lumotlarni yuklash vaqtida');
      
      const data = await response.json();
      console.log('✓ BARABAN data:', data);
      setNameData(data);
      setCurrentQuestionIndex(0);
      setScore(0);
      setGameState('playing');
      
      // Minimal spin animation
      const newRotation = Math.random() * 360;
      setRotation(newRotation);
    } catch (error) {
      console.error('❌ BARABAN Xatolik:', error);
      setGameState('finished');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(optionIndex);
    setShowResult(true);

    const currentQuestion = nameData?.questions[currentQuestionIndex];
    if (currentQuestion && optionIndex === currentQuestion.correct_index) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (!nameData) return;

    if (currentQuestionIndex < nameData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      finishGame();
    }
  };

  const finishGame = async () => {
    setGameState('finished');
    
    // Natijalani Databasega saqlash
    if (nameData) {
      try {
        await fetch('http://localhost:8000/api/baraban/save-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameData.name,
            score: score,
            total_questions: nameData.questions.length,
            timestamp: new Date().toISOString(),
          }),
        });
        console.log('✓ Natija saqlandi');
      } catch (error) {
        console.error('Natijalani saqlash vaqtida xatolik:', error);
      }
    }
  };

  const handleAddTest = async () => {
    console.clear();
    console.log('=== 🎯 TEST QO\'SHISH BOSHLANDI ===');
    console.log('nameData:', nameData);
    console.log('title:', newTestTitle);
    console.log('question:', newTestQuestion);
    console.log('options:', newTestOptions);
    console.log('correct_index:', newTestCorrectIndex);

    // Validation
    if (!nameData) {
      console.error('❌ nameData yoq!');
      alert('❌ Isim tanlanmadi!');
      return;
    }

    if (!newTestTitle.trim()) {
      console.error('❌ title bo\'sh!');
      alert('❌ Test nomini kiriting!');
      return;
    }

    if (!newTestQuestion.trim()) {
      console.error('❌ question bo\'sh!');
      alert('❌ Savol nomini kiriting!');
      return;
    }

    const filledOptions = newTestOptions.filter(opt => opt.trim());
    if (filledOptions.length < 2) {
      console.error('❌ Kamida 2 ta variant kerak!');
      alert('❌ Kamida 2 ta javob variantini to\'ldiring!');
      return;
    }

    console.log('✅ Validation passed!');

    try {
      const filledOpts = newTestOptions.filter(opt => opt.trim());
      const payload = {
        title: newTestTitle,
        questions_data: [
          {
            text: newTestQuestion,
            correct_index: Math.min(newTestCorrectIndex, filledOpts.length - 1),
            options: filledOpts
          }
        ]
      };

      const url = `http://localhost:8000/api/baraban/add-test/${encodeURIComponent(nameData.name)}`;
      console.log('📤 Request URL:', url);
      console.log('📤 Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('📥 Status:', response.status);
      
      const responseData = await response.json();
      console.log('📥 Response:', responseData);

      if (response.ok) {
        console.log('✅ SUCCESS!', responseData);
        setAddedTestCount(addedTestCount + 1);
        alert('✓ Test muvaffaqiyatli qo\'shildi!\n📊 Jami: ' + (addedTestCount + 1));
        
        // Reset form
        setShowAddTest(false);
        setNewTestTitle('');
        setNewTestQuestion('');
        setNewTestOptions(['', '', '', '']);
        setNewTestCorrectIndex(0);
        
        // Reload game with new test
        console.log('🔄 Game reloading...');
        setTimeout(() => startNewGame(), 500);
      } else {
        console.error('❌ Server error:', responseData);
        alert('❌ Xatolik: ' + (responseData.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Exception:', error);
      alert('❌ Xatolik: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="baraban-container flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⭐</div>
          <p className="text-xl font-semibold">Isim tanlanmoqda...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="baraban-container flex flex-col items-center justify-center gap-6">
        <Card className="p-8 text-center bg-gradient-to-b from-purple-600 to-cyan-600">
          <h1 className="text-4xl font-bold text-white mb-4">🎉 O'yin Tugadi!</h1>
          <div className="text-6xl font-bold text-yellow-300 mb-4">
            {score} / {nameData?.questions.length}
          </div>
          <p className="text-xl text-white mb-6">
            Javob berilgan testlar soni: {nameData?.questions.length}
          </p>
          {addedTestCount > 0 && (
            <p className="text-lg text-green-300 mb-6 font-bold">
              ✅ Qo'shilgan testlar: {addedTestCount}
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={startNewGame}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 text-lg"
            >
              Qayta O'yna
            </Button>
            <Button
              onClick={() => setShowAddTest(!showAddTest)}
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-3 text-lg"
            >
              ➕ Test Qo'shish
            </Button>
          </div>
        </Card>

        {showAddTest && (
          <Card className="p-6 bg-gradient-to-b from-gray-900 to-gray-800 border-2 border-green-400 max-w-3xl w-full">
            <h2 className="text-3xl font-bold text-green-300 mb-6">➕ Test Qo'shish - {nameData?.name}</h2>
            
            {/* Test nomini */}
            <div className="mb-5">
              <label className="text-green-300 font-semibold mb-2 block">📝 Test nomi:</label>
              <input
                type="text"
                placeholder="Masalan: Matematika, Tarix, Biology..."
                value={newTestTitle}
                onChange={(e) => setNewTestTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-green-400 rounded text-lg focus:border-green-300 outline-none"
              />
            </div>

            {/* Savol */}
            <div className="mb-5">
              <label className="text-green-300 font-semibold mb-2 block">❓ Savol:</label>
              <input
                type="text"
                placeholder="Masalan: O'zbekiston qaysi yilda mustaqil bo'ldi?"
                value={newTestQuestion}
                onChange={(e) => setNewTestQuestion(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white border-2 border-green-400 rounded text-lg focus:border-green-300 outline-none"
              />
            </div>

            {/* Javob variantlari */}
            <div className="mb-5 bg-gray-700 p-4 rounded border-2 border-green-400">
              <label className="text-green-300 font-semibold mb-3 block">🎯 Javob variantlari (to'g'ri javobni tanlang):</label>
              <div className="space-y-3">
                {newTestOptions.map((option, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-gray-800 p-3 rounded border border-gray-600">
                    <span className="text-white font-bold text-lg bg-green-500 rounded-full w-8 h-8 flex items-center justify-center">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <input
                      type="text"
                      placeholder={`Javob ${idx + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newTestOptions];
                        newOptions[idx] = e.target.value;
                        setNewTestOptions(newOptions);
                      }}
                      className="flex-1 px-3 py-2 bg-gray-600 text-white border border-gray-500 rounded focus:border-green-400 outline-none"
                    />
                    <input
                      type="radio"
                      name="correct"
                      checked={newTestCorrectIndex === idx}
                      onChange={() => setNewTestCorrectIndex(idx)}
                      className="w-5 h-5 cursor-pointer accent-green-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddTest}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 text-lg rounded"
              >
                ✅ TEST QO'SHISH
              </Button>
              <Button
                onClick={() => {
                  setShowAddTest(false);
                  setNewTestTitle('');
                  setNewTestQuestion('');
                  setNewTestOptions(['', '', '', '']);
                  setNewTestCorrectIndex(0);
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 text-lg rounded"
              >
                ❌ BEKOR QILISH
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  const currentQuestion = nameData?.questions[currentQuestionIndex];
  const isCorrect =
    selectedAnswer !== null &&
    currentQuestion &&
    selectedAnswer === currentQuestion.correct_index;

  return (
    <div className="baraban-container min-h-screen bg-gradient-to-b from-black via-purple-900 to-black p-4">
      {/* Baraban */}
      <div className="flex justify-center mb-8">
        <div
          className="baraban-wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <svg viewBox="0 0 400 400" className="w-64 h-64">
            {/* Baraban aylanasining 12 bo'ligi */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 360) / 12;
              const isActive = i === 0;
              return (
                <g key={i} transform={`rotate(${angle} 200 200)`}>
                  <path
                    d="M 200 50 A 150 150 0 0 1 329.9 70.1 L 286.6 143.4 A 75 75 0 0 0 200 125 Z"
                    fill={isActive ? '#FF1493' : '#00CED1'}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x="200"
                    y="100"
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    transform={`rotate(${-angle} 200 100)`}
                  >
                    🎯
                  </text>
                </g>
              );
            })}
            <circle cx="200" cy="200" r="30" fill="#FFD700" stroke="white" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Isim va Test Malumot */}
      <div className="max-w-2xl mx-auto mb-8">
        <Card className="p-6 bg-gradient-to-r from-purple-600 to-cyan-600">
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            👤 {nameData?.name}
          </h1>
          <div className="flex justify-center gap-4">
            <Badge className="bg-yellow-400 text-black text-lg px-4 py-2">
              ✅ {score}/{nameData?.questions.length}
            </Badge>
            <Badge className="bg-cyan-400 text-black text-lg px-4 py-2">
              📝 Savol {currentQuestionIndex + 1}/{nameData?.questions.length}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Savol va Variantlar */}
      {currentQuestion && (
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 bg-gray-900 border-2 border-cyan-400 mb-6">
            <h2 className="text-2xl font-bold text-cyan-300 mb-6 text-center">
              {currentQuestion.prompt}
            </h2>

            <div className="grid grid-cols-1 gap-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={option.id}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`p-4 text-left h-auto font-semibold transition-all ${
                    selectedAnswer === index
                      ? isCorrect
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                      : index === currentQuestion.correct_index && showResult
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-cyan-300'
                  }`}
                >
                  <span className="text-lg">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option.text}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="text-center mb-6">
                {isCorrect ? (
                  <p className="text-green-400 text-lg font-bold">✅ To'g'ri javob!</p>
                ) : (
                  <p className="text-red-400 text-lg font-bold">❌ Noto'g'ri javob</p>
                )}
              </div>
            )}

            {showResult && (
              <Button
                onClick={nextQuestion}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 text-lg"
              >
                {currentQuestionIndex < (nameData?.questions.length || 0) - 1
                  ? 'Keyingi Savol'
                  : 'Tugallash'}
              </Button>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Baraban;

import { useState } from 'react'
import { useSectionStore } from '../store'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Teacher, TestSection, Question } from '../types'

interface TestManagementPageProps {
  teacher: Teacher
  onBack: () => void
}

export default function TestManagementPage({
  teacher,
  onBack,
}: TestManagementPageProps) {
  const { sections, addSection, removeSection, addQuestionToSection } = useSectionStore()
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [showNewSection, setShowNewSection] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [newSectionDifficulty, setNewSectionDifficulty] = useState<'oson' | 'orta' | 'qiyin'>('oson')
  const [showNewQuestion, setShowNewQuestion] = useState<string | null>(null)

  const createdSectionCount = sections.filter((s) => s.teacherId === teacher.id).length
  const canAddMore = createdSectionCount < 3

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSectionName.trim()) return

    const newSection: TestSection = {
      id: `sec_${Date.now()}`,
      name: newSectionName,
      description: '',
      questions: [],
      difficulty: newSectionDifficulty,
      createdAt: Date.now(),
      teacherId: teacher.id,
    }

    addSection(newSection)
    setNewSectionName('')
    setShowNewSection(false)
  }

  const handleAddQuestion = (sectionId: string, questionData: any) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      prompt: questionData.prompt,
      options: questionData.options,
      correctIndex: questionData.correctIndex,
      difficulty: questionData.difficulty,
      sectionId,
    }
    addQuestionToSection(sectionId, newQuestion)
    setShowNewQuestion(null)
  }

  const userSections = sections.filter((s) => s.teacherId === teacher.id)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold neon-text mb-2">
              Test Boshqaruvi
            </h1>
            <p className="text-gray-400">
              Salom, {teacher.username}! O'z testlarni boshqaring
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-dark-border hover:bg-dark-border/80 text-white font-bold rounded-lg transition"
          >
            Oyiniga qaytish
          </button>
        </div>

        {/* Create Section Button */}
        {canAddMore && !showNewSection && (
          <button
            onClick={() => setShowNewSection(true)}
            className="mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-primary hover:opacity-90 text-white font-bold rounded-lg transition"
          >
            <Plus size={20} />
            Bo'lim Qo'shish
          </button>
        )}

        {/* New Section Form */}
        {showNewSection && (
          <div className="mb-6 bg-gradient-card border border-brand-primary/50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Yangi Bo'lim</h3>
            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Bo'lim nomi
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Masalan: Matematika asoslari"
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Darajasi
                </label>
                <select
                  value={newSectionDifficulty}
                  onChange={(e) => setNewSectionDifficulty(e.target.value as any)}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-brand-primary"
                >
                  <option value="oson">Oson</option>
                  <option value="orta">O'rta</option>
                  <option value="qiyin">Qiyin</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-success hover:opacity-90 text-white font-bold rounded-lg transition"
                >
                  Yaratish
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewSection(false)
                    setNewSectionName('')
                  }}
                  className="flex-1 py-2 bg-dark-border hover:bg-dark-border/80 text-white font-bold rounded-lg transition"
                >
                  Bekor
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sections List */}
        <div className="space-y-3">
          {userSections.length === 0 ? (
            <div className="text-center py-12 bg-gradient-card border border-dark-border rounded-lg">
              <p className="text-gray-400">Hali bo'lim yo'q. Bo'lim qo'shishni boshlang!</p>
            </div>
          ) : (
            userSections.map((section) => (
              <div
                key={section.id}
                className="bg-gradient-card border border-dark-border rounded-lg overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-dark-border/50 transition"
                >
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-white">{section.name}</h3>
                    <p className="text-sm text-gray-400">
                      {section.questions.length} / 20 testlar • {section.difficulty === 'oson' ? '🟢 Oson' : section.difficulty === 'orta' ? '🟡 O\'rta' : '🔴 Qiyin'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {expandedSection === section.id ? (
                      <ChevronUp className="text-brand-primary" />
                    ) : (
                      <ChevronDown className="text-gray-500" />
                    )}
                  </div>
                </button>

                {/* Section Content */}
                {expandedSection === section.id && (
                  <div className="border-t border-dark-border p-4 space-y-4">
                    {/* Questions List */}
                    {section.questions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-gray-400">Testlar:</p>
                        {section.questions.map((q, idx) => (
                          <div
                            key={q.id}
                            className="flex items-start gap-3 p-3 bg-dark-bg rounded-lg"
                          >
                            <span className="text-sm font-bold text-brand-primary flex-shrink-0">
                              {idx + 1}.
                            </span>
                            <span className="text-sm text-gray-300 flex-1">
                              {q.prompt}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Question Button */}
                    {section.questions.length < 20 && (
                      <button
                        onClick={() => setShowNewQuestion(section.id)}
                        className="w-full py-2 px-4 flex items-center justify-center gap-2 border-2 border-dashed border-brand-primary/50 hover:border-brand-primary text-brand-primary font-bold rounded-lg transition"
                      >
                        <Plus size={18} />
                        Test Qo'shish
                      </button>
                    )}

                    {/* Delete Section Button */}
                    <button
                      onClick={() => {
                        if (confirm(`"${section.name}" bo'limini o'chirilsinmi?`)) {
                          removeSection(section.id)
                          setExpandedSection(null)
                        }
                      }}
                      className="w-full py-2 px-4 flex items-center justify-center gap-2 bg-error/20 hover:bg-error/30 text-error font-bold rounded-lg transition"
                    >
                      <Trash2 size={18} />
                      Bo'limni O'chirish
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Section Count Info */}
        <div className="mt-8 p-4 bg-dark-card border border-dark-border rounded-lg text-center">
          <p className="text-sm text-gray-400">
            Siz {createdSectionCount} / 3 bepul bo'lim foydalanmoqdasiz
          </p>
          {!canAddMore && (
            <p className="text-xs text-warning mt-2">
              Qo'shimcha bo'limlar uchun obunani yangilang
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

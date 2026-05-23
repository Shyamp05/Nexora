import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Brain,
  RotateCcw,
  Clock,
  File,
  Image,
  Presentation,
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';

/* ─── Mock document data ────────────────────────────────────── */
const mockDocument = {
  title: 'Database Management Systems — Chapter 3',
  uploadedAt: '2 hours ago',
  pages: 24,
  summary: [
    'This chapter covers the Relational Data Model, which is the most widely used data model in modern database systems. It introduces the concept of relations (tables), tuples (rows), and attributes (columns) as the building blocks of relational databases.',
    'The chapter explains various types of keys including Super Key, Candidate Key, Primary Key, Foreign Key, and Composite Key. These keys establish relationships between tables and enforce data integrity through constraints.',
    'Normalization theory is introduced as a formal technique for organizing data to reduce redundancy and improve data integrity. The chapter covers functional dependencies, which form the basis for normal forms from 1NF through BCNF.',
    'Relational algebra operations such as Selection (σ), Projection (π), Union (∪), Set Difference (−), Cartesian Product (×), and Join (⋈) are presented as the mathematical foundation for SQL queries.',
  ],
  keyPoints: [
    'A relation is a set of tuples, each having the same attributes. Relations are represented as tables in a database.',
    'A Primary Key uniquely identifies each record in a table and cannot contain NULL values.',
    'Foreign Keys create links between tables by referencing the Primary Key of another table.',
    'Normalization reduces data redundancy: 1NF eliminates repeating groups, 2NF removes partial dependencies, 3NF removes transitive dependencies.',
    'BCNF (Boyce-Codd Normal Form) is a stricter version of 3NF where every determinant must be a candidate key.',
    'Relational Algebra is a procedural query language that operates on relations and produces relations as output.',
    'The JOIN operation combines rows from two tables based on a related column between them.',
    'Referential integrity ensures that a foreign key value must match an existing primary key value or be NULL.',
  ],
  flashcards: [
    { front: 'What is a Primary Key?', back: 'A Primary Key is a column (or set of columns) that uniquely identifies each row in a table. It must contain unique, non-NULL values.' },
    { front: 'Define Normalization', back: 'Normalization is the process of organizing data in a database to reduce redundancy and eliminate undesirable characteristics like insertion, update, and deletion anomalies.' },
    { front: 'What is a Foreign Key?', back: 'A Foreign Key is a column that creates a link between two tables by referencing the Primary Key of another table, enforcing referential integrity.' },
    { front: 'Explain 3NF', back: 'Third Normal Form (3NF) requires that a table is in 2NF and has no transitive dependencies — i.e., non-key attributes must depend only on the primary key.' },
    { front: 'What is Relational Algebra?', back: 'Relational Algebra is a procedural query language that uses operators like Selection (σ), Projection (π), Join (⋈), Union (∪), and Set Difference (−) to manipulate relations.' },
  ],
  mindMapNodes: {
    center: 'Relational Model',
    branches: [
      { label: 'Keys', children: ['Primary Key', 'Foreign Key', 'Candidate Key'] },
      { label: 'Normalization', children: ['1NF', '2NF', '3NF', 'BCNF'] },
      { label: 'Algebra', children: ['Selection', 'Projection', 'Join'] },
      { label: 'Constraints', children: ['NOT NULL', 'UNIQUE', 'CHECK'] },
    ],
  },
};

const recentDocuments = [
  { name: 'Linear Algebra Notes.pdf', type: 'pdf' as const, time: '1 day ago' },
  { name: 'Physics Lab Report.ppt', type: 'ppt' as const, time: '3 days ago' },
  { name: 'Data Structures Summary.pdf', type: 'pdf' as const, time: '1 week ago' },
];

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="w-4 h-4 text-red-400" />,
  ppt: <Presentation className="w-4 h-4 text-orange-400" />,
  image: <Image className="w-4 h-4 text-cyan-400" />,
  text: <File className="w-4 h-4 text-gray-400" />,
};

/* ─── Framer Motion Variants ───────────────────────────────── */
const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DocumentAIPage() {
  const [view, setView] = useState<'upload' | 'view'>('upload');
  const [activeTab, setActiveTab] = useState('summary');
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) =>
      prev < mockDocument.flashcards.length - 1 ? prev + 1 : 0
    );
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) =>
      prev > 0 ? prev - 1 : mockDocument.flashcards.length - 1
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ─── UPLOAD STATE ──────────────────────────────── */}
          {view === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Title */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <FileSearch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Document AI</h1>
                  <p className="text-gray-400 text-sm">Upload documents for AI analysis</p>
                </div>
              </div>

              {/* Upload zone */}
              <motion.div
                whileHover={{ scale: 1.005 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  setView('view');
                }}
                onClick={() => setView('view')}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 md:p-16 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-indigo-500/30 hover:bg-white/[0.04]'
                }`}
              >
                <motion.div
                  animate={isDragging ? { scale: 1.1, y: -8 } : { scale: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white mb-1">
                      {isDragging ? 'Drop your file here' : 'Drop your files here'}
                    </p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {['PDF', 'PPT', 'Images', 'Text'].map((format) => (
                      <span
                        key={format}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Browse button */}
                <div className="mt-6">
                  <span className="btn-secondary px-6 py-2.5 rounded-xl text-sm inline-block">
                    Browse Files
                  </span>
                </div>
              </motion.div>

              {/* Recent documents */}
              <div className="mt-10">
                <h2 className="text-lg font-semibold text-white mb-4">Recent Documents</h2>
                <div className="space-y-2">
                  {recentDocuments.map((doc, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setView('view')}
                      className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                        {fileIcons[doc.type]}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {doc.time}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── VIEW STATE ───────────────────────────────── */}
          {view === 'view' && (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setView('upload')}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">
                    {mockDocument.title}
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {mockDocument.pages} pages • Uploaded {mockDocument.uploadedAt}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                <Tabs.List className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6 overflow-x-auto no-scrollbar">
                  {['summary', 'keypoints', 'flashcards', 'mindmap'].map((tab) => (
                    <Tabs.Trigger
                      key={tab}
                      value={tab}
                      className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeTab === tab
                          ? 'gradient-primary text-white shadow-lg shadow-indigo-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab === 'summary' && 'Summary'}
                      {tab === 'keypoints' && 'Key Points'}
                      {tab === 'flashcards' && 'Flashcards'}
                      {tab === 'mindmap' && 'Mind Map'}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>

                {/* Summary Tab */}
                <Tabs.Content value="summary">
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-4">
                    {mockDocument.summary.map((para, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-gray-300 leading-relaxed text-sm md:text-base card-premium p-5 rounded-xl"
                      >
                        {para}
                      </motion.p>
                    ))}
                  </motion.div>
                </Tabs.Content>

                {/* Key Points Tab */}
                <Tabs.Content value="keypoints">
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" className="space-y-3">
                    {mockDocument.keyPoints.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex gap-4 card-premium p-4 rounded-xl"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-white">
                          {i + 1}
                        </div>
                        <div className="flex items-center">
                          <Lightbulb className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0 mt-0.5 hidden sm:block" />
                          <p className="text-sm text-gray-300">{point}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </Tabs.Content>

                {/* Flashcards Tab */}
                <Tabs.Content value="flashcards">
                  <motion.div variants={fadeIn} initial="hidden" animate="visible" className="flex flex-col items-center">
                    {/* Card counter */}
                    <p className="text-sm text-gray-400 mb-4">
                      {currentCard + 1}/{mockDocument.flashcards.length}
                    </p>

                    {/* Flashcard with flip animation */}
                    <div
                      className="relative w-full max-w-lg h-64 md:h-72 cursor-pointer"
                      style={{ perspective: '1000px' }}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="relative w-full h-full"
                      >
                        {/* Front */}
                        <div
                          className="absolute inset-0 card-premium rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center glow-blue"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          <span className="text-xs font-semibold text-indigo-400 mb-3 uppercase tracking-wider">
                            Question
                          </span>
                          <p className="text-lg md:text-xl text-white text-center font-medium">
                            {mockDocument.flashcards[currentCard].front}
                          </p>
                          <p className="text-xs text-gray-500 mt-4">Click to flip</p>
                        </div>

                        {/* Back */}
                        <div
                          className="absolute inset-0 card-premium rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center border-emerald-500/20"
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          <span className="text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
                            Answer
                          </span>
                          <p className="text-sm md:text-base text-gray-300 text-center leading-relaxed">
                            {mockDocument.flashcards[currentCard].back}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-4 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); prevCard(); }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFlipped(false);
                        }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        title="Reset flip"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); nextCard(); }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                </Tabs.Content>

                {/* Mind Map Tab */}
                <Tabs.Content value="mindmap">
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="card-premium rounded-2xl p-6 md:p-10 overflow-x-auto"
                  >
                    <div className="min-w-[600px] flex flex-col items-center">
                      {/* Center node */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="px-6 py-3 rounded-2xl gradient-primary text-white font-bold text-lg shadow-lg shadow-indigo-500/30 mb-8"
                      >
                        <Brain className="w-5 h-5 inline mr-2" />
                        {mockDocument.mindMapNodes.center}
                      </motion.div>

                      {/* Branches */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                        {mockDocument.mindMapNodes.branches.map((branch, bIdx) => (
                          <motion.div
                            key={bIdx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + bIdx * 0.15 }}
                            className="flex flex-col items-center"
                          >
                            {/* Connector line */}
                            <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500/60 to-transparent" />

                            {/* Branch node */}
                            <div className="px-4 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 font-semibold text-sm mb-3 text-center">
                              {branch.label}
                            </div>

                            {/* Child nodes */}
                            <div className="space-y-2 w-full">
                              {branch.children.map((child, cIdx) => (
                                <motion.div
                                  key={cIdx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.4 + bIdx * 0.1 + cIdx * 0.08 }}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-1.5 h-0.5 bg-white/10" />
                                  <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300 text-center w-full hover:bg-white/10 hover:border-white/10 transition-all cursor-default">
                                    {child}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Tabs.Content>
              </Tabs.Root>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

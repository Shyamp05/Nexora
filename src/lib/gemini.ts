// ============================================
// Nexora AI — Gemini AI Client
// ============================================

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

const systemPrompts: Record<string, string> = {
  beginner: `You are Nexora AI, a friendly and patient AI tutor for beginners. Explain concepts in simple terms with lots of examples. Use analogies and avoid jargon. Format your responses with markdown: use ## for headers, **bold** for key terms, \`code\` for code snippets, and bullet points for lists. Keep explanations concise but thorough. Add emojis sparingly for engagement.`,
  
  school: `You are Nexora AI, an expert tutor for school students (grades 8-12). Explain concepts at a school level with proper terminology. Include formulas, diagrams descriptions, and practice examples. Format with markdown: ## headers, **bold** terms, code blocks with \`\`\`, numbered steps, and bullet points. Reference NCERT/textbook concepts when relevant.`,
  
  college: `You are Nexora AI, an advanced AI tutor for college students. Provide in-depth explanations with theoretical foundations, mathematical proofs when needed, code examples, and real-world applications. Use markdown formatting: ## headers, **bold**, \`\`\`code blocks\`\`\`, LaTeX-style math notation, tables, and structured explanations. Be thorough and precise.`,
  
  interview: `You are Nexora AI, an interview preparation expert. Help students prepare for technical interviews at top companies. Provide: problem-solving approaches, time/space complexity analysis, code solutions with explanations, common follow-up questions, and tips. Format with markdown: ## headers, **bold**, \`\`\`code blocks\`\`\` with language tags, bullet points. Focus on clarity and interview-readiness.`,
};

export async function generateAIResponse(
  message: string,
  mode: string = 'college',
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  if (!GEMINI_API_KEY) {
    // Fallback to mock response if no API key
    return getMockResponse(message);
  }

  try {
    const systemPrompt = systemPrompts[mode] || systemPrompts.college;
    
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood! I am Nexora AI, ready to help you learn. How can I assist you today?' }],
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status);
      return getMockResponse(message);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getMockResponse(message);
  } catch (error) {
    console.error('AI generation error:', error);
    return getMockResponse(message);
  }
}

export async function generateQuizQuestions(
  subject: string,
  difficulty: string,
  count: number = 5
): Promise<string> {
  const prompt = `Generate ${count} multiple-choice quiz questions about ${subject} at ${difficulty} difficulty level.

Return ONLY a valid JSON array with this exact format (no markdown, no code blocks, just pure JSON):
[
  {
    "id": "1",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Explanation of the correct answer."
  }
]

Make questions challenging but fair. Ensure only one correct answer per question.`;

  return generateAIResponse(prompt, 'college');
}

export async function generateRoadmap(topic: string, days: number = 7): Promise<string> {
  const prompt = `Create a ${days}-day learning roadmap for: "${topic}"

Return ONLY a valid JSON array with this exact format (no markdown, no code blocks, just pure JSON):
[
  {
    "day": 1,
    "title": "Day title",
    "topics": ["Topic 1", "Topic 2", "Topic 3"],
    "resources": ["Resource 1", "Resource 2"],
    "quiz": false,
    "completed": false
  }
]

Make it practical and progressive. Include a quiz on the last day.`;

  return generateAIResponse(prompt, 'college');
}

export async function generateDocumentSummary(text: string): Promise<string> {
  const prompt = `Analyze this document and provide:

## Summary
A comprehensive summary in 3-4 paragraphs.

## Key Points
- List the 5-7 most important points

## Flashcards
Create 5 flashcard Q&A pairs in this format:
**Q:** Question here
**A:** Answer here

Document text:
${text.substring(0, 3000)}`;

  return generateAIResponse(prompt, 'college');
}

function getMockResponse(message: string): string {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('binary search') || lowerMsg.includes('search algorithm')) {
    return `## Binary Search Algorithm 🔍

Binary Search is an efficient algorithm for finding a target value within a **sorted array**. It works by repeatedly dividing the search interval in half.

### How It Works

1. **Compare** the target with the middle element
2. If target **equals** middle → found! ✅
3. If target is **less** → search the left half
4. If target is **greater** → search the right half
5. **Repeat** until found or interval is empty

### Time Complexity

| Case | Complexity |
|------|-----------|
| Best | O(1) |
| Average | O(log n) |
| Worst | O(log n) |
| Space | O(1) |

### Implementation

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found

# Example
numbers = [1, 3, 5, 7, 9, 11, 13, 15]
result = binary_search(numbers, 7)
print(f"Found at index: {result}")  # Output: 3
\`\`\`

### Key Requirements
- Array **must be sorted** ⚠️
- Works on any sorted sequence
- Much faster than linear search for large datasets

> 💡 **Pro Tip**: Binary search reduces the search space by half each step. For 1 million elements, it needs at most ~20 comparisons!

Would you like me to explain variations like **lower bound** or **upper bound** binary search? 🎯`;
  }

  return `## Great Question! 🎯

Let me break down **"${message}"** for you.

### Key Concepts

This is an important topic that covers several fundamental principles:

1. **Core Theory**: Understanding the foundational concepts is crucial for building a strong knowledge base.

2. **Practical Applications**: This concept has wide-ranging applications in:
   - Academic studies
   - Real-world problem solving
   - Technical interviews

3. **Common Patterns**: Look for these recurring patterns when studying:
   - Pattern recognition
   - Problem decomposition
   - Systematic analysis

### Step-by-Step Approach

**Step 1:** Start with the basics
- Review fundamental definitions
- Understand prerequisites

**Step 2:** Build understanding
- Work through examples
- Identify edge cases

**Step 3:** Practice and apply
\`\`\`
// Practice makes perfect!
function learn(topic) {
  const understanding = study(topic);
  const mastery = practice(understanding);
  return mastery;
}
\`\`\`

### Summary
- ✅ Understand the core concepts
- ✅ Practice with real examples  
- ✅ Test yourself with quizzes
- ✅ Review and revise regularly

> 💡 **Remember**: The best way to learn is by doing. Try explaining this concept to someone else!

Would you like me to:
- Generate a **quiz** to test your understanding?
- Create a **roadmap** for deeper learning?
- Provide more **code examples**? 🚀`;
}

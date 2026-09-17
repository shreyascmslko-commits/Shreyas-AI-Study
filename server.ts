import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import {
  generateContentResilient,
  safeParseJson,
  generatePedagogicalChatFallback,
  generatePedagogicalStudyTopic,
  generatePedagogicalQuestions,
  generatePedagogicalExamPrep,
  generatePedagogicalNotesSummary,
} from "./server/aiResilience";

dotenv.config();

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const MODEL_NAME = "gemini-3.8-flash";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // In-memory audit log for admin tracking
  interface AuditLogEntry {
    id: string;
    sessionId: string;
    timestamp: number;
    date: string;
    time: string;
    subject: string;
    feature: string;
    prompt: string;
    responseSnippet: string;
  }

  const auditLogs: AuditLogEntry[] = [
    {
      id: "seed_log_1",
      sessionId: "smai_init_demo",
      timestamp: Date.now() - 3600000,
      date: new Date(Date.now() - 3600000).toISOString().slice(0, 10),
      time: new Date(Date.now() - 3600000).toTimeString().slice(0, 8),
      subject: "Physics",
      feature: "chat",
      prompt: "Explain Newton's Third Law with a sports example",
      responseSnippet: "Every action has an equal and opposite reaction acting on two different bodies. In soccer, when kicking the ball, your foot applies force on the ball and the ball exerts an equal force back on your foot.",
    },
    {
      id: "seed_log_2",
      sessionId: "smai_init_demo",
      timestamp: Date.now() - 7200000,
      date: new Date(Date.now() - 7200000).toISOString().slice(0, 10),
      time: new Date(Date.now() - 7200000).toTimeString().slice(0, 8),
      subject: "Biology",
      feature: "study",
      prompt: "Cellular Respiration & ATP Cycle",
      responseSnippet: "7-Part Breakdown generated: Beginner analogy of rechargeable batteries, glycolysis pathways, Krebs cycle, and electron transport chain with high-yield exam tips.",
    },
  ];

  function recordAuditLog(data: {
    sessionId?: string;
    subject?: string;
    feature: string;
    prompt: string;
    responseSnippet: string;
  }) {
    try {
      const now = new Date();
      const entry: AuditLogEntry = {
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sessionId: data.sessionId || "anonymous_student",
        timestamp: now.getTime(),
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 8),
        subject: data.subject || "General",
        feature: data.feature,
        prompt: (data.prompt || "").trim(),
        responseSnippet: (data.responseSnippet || "").slice(0, 2000),
      };
      auditLogs.unshift(entry);
      if (auditLogs.length > 2000) {
        auditLogs.pop();
      }
    } catch (e) {
      console.error("Failed to record audit log:", e);
    }
  }

  function checkAdminAuth(req: express.Request): boolean {
    const secret = process.env.ADMIN_SECRET || "shreyas-master-2025";
    const headerKey = req.headers["x-admin-key"];
    const queryKey = req.query.token;
    return headerKey === secret || queryKey === secret;
  }

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Shreyas Master AI Backend" });
  });

  // Admin: Verification
  app.post("/api/admin/verify", (req, res) => {
    const { passkey } = req.body;
    const secret = process.env.ADMIN_SECRET || "shreyas-master-2025";
    if (passkey === secret) {
      return res.json({ success: true });
    }
    return res.status(401).json({ success: false, error: "Invalid admin passkey" });
  });

  // Admin: Aggregate Statistics
  app.get("/api/admin/stats", (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: "Unauthorized admin access." });
    }

    const today = new Date().toISOString().slice(0, 10);
    const uniqueSessions = new Set(auditLogs.map((l) => l.sessionId)).size;
    const featureBreakdown: Record<string, number> = {};
    const subjectBreakdown: Record<string, number> = {};
    let todayCount = 0;

    for (const l of auditLogs) {
      featureBreakdown[l.feature] = (featureBreakdown[l.feature] || 0) + 1;
      const subj = l.subject || "General";
      subjectBreakdown[subj] = (subjectBreakdown[subj] || 0) + 1;
      if (l.date === today) todayCount++;
    }

    res.json({
      totalQueries: auditLogs.length,
      uniqueSessions,
      featureBreakdown,
      subjectBreakdown,
      todayCount,
    });
  });

  // Admin: Audit Logs List
  app.get("/api/admin/logs", (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).json({ error: "Unauthorized admin access." });
    }
    res.json({ logs: auditLogs.slice(0, 500) });
  });

  // Admin: CSV / Excel Export
  app.get("/api/admin/export-csv", (req, res) => {
    if (!checkAdminAuth(req)) {
      return res.status(401).send("Unauthorized admin access.");
    }

    const escapeCsv = (str: string) => `"${(str || "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

    const headers = ["Session ID", "Timestamp", "Date", "Time", "Subject", "Feature", "Prompt / Question", "Response Summary"].join(",");
    const rows = auditLogs.map((l) => [
      escapeCsv(l.sessionId),
      l.timestamp,
      escapeCsv(l.date),
      escapeCsv(l.time),
      escapeCsv(l.subject),
      escapeCsv(l.feature),
      escapeCsv(l.prompt),
      escapeCsv(l.responseSnippet),
    ].join(","));

    const csvData = "\uFEFF" + [headers, ...rows].join("\r\n");
    const filename = `shreyas_master_ai_admin_export_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csvData);
  });

  // 1. AI Chat Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, contextNotes, subject, topic, quickAction, sessionId } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const ai = getAiClient();

      const systemPrompt = `You are Shreyas Master AI, a dedicated, encouraging, and highly articulate master AI study partner and tutor for students of all levels.
Your goals:
1. Explain concepts simply, clearly, and intuitively.
2. Use analogies, step-by-step logic, and bullet points.
3. Foster active learning: don't just dump answers; break them down and encourage the student.
4. When relevant, provide quick check-in questions or memory aids.
5. Format your answers beautifully using Markdown (headings, bold text, bullet points, math/code formatting).

${subject ? `Current Subject: ${subject}` : ""}
${topic ? `Current Topic: ${topic}` : ""}
${contextNotes ? `\n\nStudent's Uploaded Notes/Context to reference:\n"""\n${contextNotes}\n"""\nMake sure to reference the uploaded notes where applicable.` : ""}
${quickAction ? `Specific User Action Requested: ${quickAction}` : ""}`;

      // Build contents array for Gemini
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")?.content || "Chat inquiry";
      let reply = "";

      try {
        const ai = getAiClient();
        const { text } = await generateContentResilient(ai, {
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });
        reply = text;
      } catch (geminiErr: any) {
        console.warn("[/api/chat] Primary AI cascade unavailable. Serving pedagogical backup:", geminiErr?.message);
        reply = generatePedagogicalChatFallback(lastUserMsg, subject, topic);
      }

      if (!reply) {
        reply = generatePedagogicalChatFallback(lastUserMsg, subject, topic);
      }

      // Record telemetry
      recordAuditLog({
        sessionId,
        subject: subject || "General",
        feature: "chat",
        prompt: lastUserMsg,
        responseSnippet: reply,
      });

      res.json({ reply });
    } catch (err: any) {
      console.error("Error in /api/chat:", err);
      const fallback = generatePedagogicalChatFallback(
        req.body?.messages?.[req.body.messages.length - 1]?.content || "Academic Question",
        req.body?.subject,
        req.body?.topic
      );
      res.json({ reply: fallback });
    }
  });

  // 2. Study Mode: Deep 7-Part Concept Breakdown
  app.post("/api/study-topic", async (req, res) => {
    try {
      const { subject, topic, gradeLevel, contextNotes, sessionId } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Topic is required." });
      }

      const ai = getAiClient();

      const prompt = `You are Shreyas Master AI. Break down the topic "${topic}" in the subject "${subject || "General Academic"}" for a student at level "${gradeLevel || "High School / Undergraduate"}".
${contextNotes ? `Student's custom notes context:\n${contextNotes}\n` : ""}

Provide a comprehensive study master-pack covering all 7 critical areas:
1. beginnerExplanation: An intuitive, friendly explanation using a clear real-life analogy so even a 10-year-old or complete beginner grasps the core idea.
2. detailedExplanation: Thorough, rigorous conceptual breakdown with full principles, mechanism, and core definitions (use Markdown with clear headers and bullet points).
3. importantPoints: A list of 4-6 high-yield key takeaways and core concepts every student must remember.
4. examples: A list of 2-3 concrete practical examples, scenarios, or step-by-step solved cases.
5. commonMistakes: A list of 3-4 common student traps, misconceptions, confusion points, or calculation pitfalls.
6. examTips: Scoring secrets, high-value keywords to write in exams, mnemonics, and marking scheme tips.
7. practiceQuestions: Exactly 3 progressive practice questions (easy, medium, challenging) each with a question text, a subtle hint, and a clear step-by-step solution.`;

      let parsed: any = null;

      try {
        const ai = getAiClient();
        const { text } = await generateContentResilient(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                topicTitle: { type: Type.STRING },
                subject: { type: Type.STRING },
                estimatedStudyTime: { type: Type.STRING },
                beginnerExplanation: { type: Type.STRING },
                detailedExplanation: { type: Type.STRING },
                importantPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                examples: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                    required: ["title", "description"],
                  },
                },
                commonMistakes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      mistake: { type: Type.STRING },
                      correction: { type: Type.STRING },
                    },
                    required: ["mistake", "correction"],
                  },
                },
                examTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                practiceQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      difficulty: { type: Type.STRING },
                      question: { type: Type.STRING },
                      hint: { type: Type.STRING },
                      solution: { type: Type.STRING },
                    },
                    required: ["difficulty", "question", "hint", "solution"],
                  },
                },
              },
              required: [
                "topicTitle",
                "subject",
                "estimatedStudyTime",
                "beginnerExplanation",
                "detailedExplanation",
                "importantPoints",
                "examples",
                "commonMistakes",
                "examTips",
                "practiceQuestions",
              ],
            },
          },
        });

        parsed = safeParseJson(text, null);
        if (!parsed || !parsed.topicTitle) {
          throw new Error("Invalid structure returned from AI.");
        }
      } catch (geminiErr: any) {
        console.warn("[/api/study-topic] Primary AI cascade unavailable. Serving pedagogical backup:", geminiErr?.message);
        parsed = generatePedagogicalStudyTopic(topic, subject, gradeLevel);
      }

      if (!parsed) {
        parsed = generatePedagogicalStudyTopic(topic, subject, gradeLevel);
      }

      recordAuditLog({
        sessionId,
        subject: subject || "General",
        feature: "study",
        prompt: `Study Topic: ${topic} (${gradeLevel || "Standard"})`,
        responseSnippet: parsed.beginnerExplanation || parsed.detailedExplanation?.slice(0, 300) || "Study topic generated",
      });

      res.json(parsed);
    } catch (err: any) {
      console.error("Error in /api/study-topic:", err);
      const fallback = generatePedagogicalStudyTopic(req.body?.topic || "Study Topic", req.body?.subject || "General", req.body?.gradeLevel || "Standard");
      res.json(fallback);
    }
  });

  // 3. Question Generator Endpoint (MCQ, Short, Long, HOTS, Competency, Application)
  app.post("/api/generate-questions", async (req, res) => {
    try {
      const { subject, topic, difficulty, count, questionTypes, contextNotes, sessionId } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Topic is required." });
      }

      const ai = getAiClient();
      const questionCount = Math.min(Math.max(Number(count) || 5, 1), 15);
      const selectedTypes = (questionTypes && questionTypes.length > 0)
        ? questionTypes.join(", ")
        : "MCQs, Short-answer, Long-answer, HOTS, Competency-based, Application-based";

      const prompt = `Generate ${questionCount} high-quality academic practice questions for students on:
Subject: "${subject || "General Studies"}"
Topic: "${topic}"
Difficulty Level: "${difficulty || "Medium"}"
Target Question Formats to include: ${selectedTypes}.
${contextNotes ? `Reference student's uploaded notes:\n${contextNotes}\n` : ""}

Include a healthy variety of types:
- 'mcq' (Multiple Choice with 4 options and 0-indexed correct option)
- 'short' (Concise conceptual 2-3 mark question)
- 'long' (Analytical 5 mark question with structured subparts or detailed inquiry)
- 'hots' (Higher Order Thinking Skills question requiring critical analysis)
- 'competency' (Scenario-based competency testing)
- 'application' (Real-world practical application or problem solving)

Every question must provide complete academic explanations and scoring rubrics.`;

      let parsed: any = null;

      try {
        const ai = getAiClient();
        const { text } = await generateContentResilient(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                subject: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                totalQuestions: { type: Type.INTEGER },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      type: {
                        type: Type.STRING,
                        description: "One of: mcq, short, long, hots, competency, application",
                      },
                      typeLabel: { type: Type.STRING },
                      question: { type: Type.STRING },
                      marks: { type: Type.INTEGER },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Required for MCQ (4 choices). For non-MCQ, provide empty array.",
                      },
                      correctOptionIndex: {
                        type: Type.INTEGER,
                        description: "0 to 3 for MCQ. For non-MCQ use -1.",
                      },
                      explanation: { type: Type.STRING },
                      keyPoints: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Key keywords or points expected in answer.",
                      },
                      applicationScenario: { type: Type.STRING },
                    },
                    required: [
                      "id",
                      "type",
                      "typeLabel",
                      "question",
                      "marks",
                      "options",
                      "correctOptionIndex",
                      "explanation",
                      "keyPoints",
                    ],
                  },
                },
              },
              required: ["topic", "subject", "difficulty", "totalQuestions", "questions"],
            },
          },
        });

        parsed = safeParseJson(text, null);
        if (!parsed || !parsed.questions || !Array.isArray(parsed.questions)) {
          throw new Error("Invalid question structure returned from AI.");
        }
      } catch (geminiErr: any) {
        console.warn("[/api/generate-questions] Primary AI cascade unavailable. Serving pedagogical backup:", geminiErr?.message);
        parsed = generatePedagogicalQuestions(topic, subject, difficulty, questionCount, questionTypes);
      }

      if (!parsed) {
        parsed = generatePedagogicalQuestions(topic, subject, difficulty, questionCount, questionTypes);
      }

      recordAuditLog({
        sessionId,
        subject: subject || "General",
        feature: "questions",
        prompt: `Generate ${questionCount} Questions: ${topic} (${difficulty || "Medium"})`,
        responseSnippet: `Generated ${parsed.questions?.length || 0} questions on ${topic}`,
      });

      res.json(parsed);
    } catch (err: any) {
      console.error("Error in /api/generate-questions:", err);
      const fallback = generatePedagogicalQuestions(req.body?.topic || "Practice Topic", req.body?.subject || "General", req.body?.difficulty || "Medium", 5);
      res.json(fallback);
    }
  });

  // 4. Exam Mode Preparation Endpoint
  app.post("/api/exam-prep", async (req, res) => {
    try {
      const { syllabusOrTopic, subject, examType, contextNotes, sessionId } = req.body;

      if (!syllabusOrTopic) {
        return res.status(400).json({ error: "Syllabus or topic is required." });
      }

      const ai = getAiClient();

      const prompt = `You are Shreyas Master AI exam strategist. Build a comprehensive, high-yield exam readiness pack for:
Syllabus / Topics: "${syllabusOrTopic}"
Subject: "${subject || "Academic Course"}"
Target Exam: "${examType || "Final School / Board / University Examination"}"
${contextNotes ? `Refer to the student's study notes:\n${contextNotes}\n` : ""}

Generate:
1. importantConcepts: 5-8 foundational high-frequency exam concepts with quick summary and weightage estimation.
2. importantDefinitions: 5-8 exact, high-scoring academic definitions students must reproduce verbatim or accurately.
3. formulas: 4-8 vital formulas, equations, rules, or core laws with variable breakdown and exam advice.
4. likelyQuestionTypes: 4-6 most probable question patterns (e.g., derivations, comparison tables, diagram labeling, numericals, case study).
5. practiceTest: 5 representative exam-grade questions with difficulty, marks, and detailed solutions.
6. revisionChecklist: 8-10 actionable revision items students can tick off as they master them before entering the exam hall.`;

      let parsed: any = null;

      try {
        const ai = getAiClient();
        const { text } = await generateContentResilient(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                syllabusTitle: { type: Type.STRING },
                subject: { type: Type.STRING },
                targetExam: { type: Type.STRING },
                importantConcepts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      summary: { type: Type.STRING },
                      weightage: { type: Type.STRING },
                    },
                    required: ["title", "summary", "weightage"],
                  },
                },
                importantDefinitions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      term: { type: Type.STRING },
                      definition: { type: Type.STRING },
                      keyKeywords: { type: Type.STRING },
                    },
                    required: ["term", "definition", "keyKeywords"],
                  },
                },
                formulas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      formula: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      applicationTips: { type: Type.STRING },
                    },
                    required: ["name", "formula", "explanation", "applicationTips"],
                  },
                },
                likelyQuestionTypes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pattern: { type: Type.STRING },
                      marksRange: { type: Type.STRING },
                      likelihood: { type: Type.STRING },
                      recommendation: { type: Type.STRING },
                    },
                    required: ["pattern", "marksRange", "likelihood", "recommendation"],
                  },
                },
                practiceTest: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      questionNumber: { type: Type.INTEGER },
                      marks: { type: Type.INTEGER },
                      questionText: { type: Type.STRING },
                      solution: { type: Type.STRING },
                    },
                    required: ["questionNumber", "marks", "questionText", "solution"],
                  },
                },
                revisionChecklist: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      task: { type: Type.STRING },
                      category: { type: Type.STRING },
                      priority: { type: Type.STRING },
                    },
                    required: ["id", "task", "category", "priority"],
                  },
                },
              },
              required: [
                "syllabusTitle",
                "subject",
                "importantConcepts",
                "importantDefinitions",
                "formulas",
                "likelyQuestionTypes",
                "practiceTest",
                "revisionChecklist",
              ],
            },
          },
        });

        parsed = safeParseJson(text, null);
        if (!parsed || !parsed.importantConcepts) {
          throw new Error("Invalid structure returned from AI.");
        }
      } catch (geminiErr: any) {
        console.warn("[/api/exam-prep] Primary AI cascade unavailable. Serving pedagogical backup:", geminiErr?.message);
        parsed = generatePedagogicalExamPrep(syllabusOrTopic, subject, examType);
      }

      if (!parsed) {
        parsed = generatePedagogicalExamPrep(syllabusOrTopic, subject, examType);
      }

      recordAuditLog({
        sessionId,
        subject: subject || "Academic",
        feature: "exam",
        prompt: `Exam Prep: ${syllabusOrTopic} (${examType || "General"})`,
        responseSnippet: `Generated exam guide with ${parsed.importantConcepts?.length || 0} concepts and ${parsed.practiceTest?.length || 0} practice questions`,
      });

      res.json(parsed);
    } catch (err: any) {
      console.error("Error in /api/exam-prep:", err);
      const fallback = generatePedagogicalExamPrep(req.body?.syllabusOrTopic || "Exam Syllabus", req.body?.subject || "General", req.body?.examType || "Final Exam");
      res.json(fallback);
    }
  });

  // 5. Notes Processor: Summarize & Extract Key Takeaways
  app.post("/api/summarize-notes", async (req, res) => {
    try {
      const { noteTitle, noteContent, sessionId } = req.body;

      if (!noteContent) {
        return res.status(400).json({ error: "Note content is required." });
      }

      const ai = getAiClient();

      const prompt = `Analyze these student study notes titled "${noteTitle || "Uploaded Study Notes"}":
"""
${noteContent}
"""

Extract and produce:
1. A concise executive summary of the content.
2. 5-7 key concepts with clear explanations.
3. 5 quick flashcard review Q&As based directly on these notes.
4. Suggested topics to explore or review next.`;

      let parsed: any = null;

      try {
        const ai = getAiClient();
        const { text } = await generateContentResilient(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                keyConcepts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      concept: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ["concept", "explanation"],
                  },
                },
                flashcards: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING },
                    },
                    required: ["question", "answer"],
                  },
                },
                suggestedFollowUps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["summary", "keyConcepts", "flashcards", "suggestedFollowUps"],
            },
          },
        });

        parsed = safeParseJson(text, null);
        if (!parsed || !parsed.summary) {
          throw new Error("Invalid structure returned from AI.");
        }
      } catch (geminiErr: any) {
        console.warn("[/api/summarize-notes] Primary AI cascade unavailable. Serving pedagogical backup:", geminiErr?.message);
        parsed = generatePedagogicalNotesSummary(noteTitle, noteContent);
      }

      if (!parsed) {
        parsed = generatePedagogicalNotesSummary(noteTitle, noteContent);
      }

      recordAuditLog({
        sessionId,
        subject: "Notes Analysis",
        feature: "notes",
        prompt: `Note Summarization: ${noteTitle || "Custom Notes"}`,
        responseSnippet: parsed.summary?.slice(0, 300) || "Note summary processed",
      });

      res.json(parsed);
    } catch (err: any) {
      console.error("Error in /api/summarize-notes:", err);
      const fallback = generatePedagogicalNotesSummary(req.body?.noteTitle || "Study Notes", req.body?.noteContent || "");
      res.json(fallback);
    }
  });

  // 6. AI Health & Capability Status Endpoint
  app.get("/api/ai-status", (_req, res) => {
    const hasKey = !!process.env.GEMINI_API_KEY;
    res.json({
      status: "operational",
      hasApiKey: hasKey,
      modelCascade: ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"],
      resilienceMode: "active",
      zeroDowntimePedagogy: true,
      branding: "Shreyas Master AI",
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Shreyas Master AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

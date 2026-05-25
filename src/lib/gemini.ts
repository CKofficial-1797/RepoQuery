import { GoogleGenAI } from "@google/genai";
import { Document } from "@langchain/core/documents";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const aiSummariseCommit = async (diff: string): Promise<string> => {
  const prompt = `
You are an expert programmer, and you are trying to summarise a git diff.
Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):

\`\`\`
diff --git a/lib/index.js b/lib/index.js
index adf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`

This means that 'lib/index.js' was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with '+' means it was added.
A line that starting with '-' means that line was deleted.
A line that starts with neither '+' nor '-' is code given for context and better understanding.
It is not part of the diff.
[...]
EXAMPLE SUMMARY COMMENTS:
- Raised the amount of returned recordings from '10' to '100'
- Fixed a typo in the github action name
- Moved the 'octokit' initialization to a separate file
- Added an OpenAI API for completions
- Lowered numeric tolerance for test files

Most commits will have less comments than this examples list.
The last comment does not include the file names,
because there were more than two relevant files in the hypothetical commit.
Do not include parts of the example in your summary.
Please summarise the following diff file:

${diff}
`;

  const result = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!result.text) {
    throw new Error("Gemini returned no text");
  }

  return result.text;
};
export async function summariseCode(doc: Document) {
  console.log("getting summary for", doc.metadata.source);

  const code = doc.pageContent.slice(0, 10000); // limit to 10000 characters

  const prompt = 
    `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.
    You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.
    Here is the code:
    ---
    ${code}
    ---
    Give a summary no more than 100 words of the code above`
  

  const result = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!result.text) {
    throw new Error("Gemini returned no text");
  }

  return result.text;
}


export async function generateEmbedding(summary: string) {
  const cleaned = summary?.trim();

  if (!cleaned) {
    return null; 
  }
  const response = await client.models.embedContent({
    model: "gemini-embedding-001", // latest embedding model
    contents: summary,
   config: {
      outputDimensionality: 768,
    },
    });

   if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error("Failed to generate embedding");
  }

  return response.embeddings[0].values;
}

export async function answerQuestionWithContext(question: string, context: string) {
  const prompt = `
You are an AI code assistant who answers questions about the codebase.
Your target audience is a technical intern who is looking to understand the codebase.

START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

START QUESTION
${question}
END OF QUESTION

If the context does not provide the answer to the question, say:
"I'm sorry, but I don't know the answer to that question."

Answer in markdown syntax, with code snippets if needed.
Be as detailed as possible when answering.
  `;

  const result = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!result.text) {
    throw new Error("Gemini returned no text");
  }

  return result.text;
}


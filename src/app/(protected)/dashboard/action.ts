"use server";
import prisma from "@/lib/prisma";
import { answerQuestionWithContext, generateEmbedding } from "../../../lib/gemini";
export async function askQuestion(question: string, projectId: string) {
  const queryVector = await generateEmbedding(question);
  if (!Array.isArray(queryVector) || queryVector.length === 0) {
  throw new Error("Invalid query embedding");
}

  if (!queryVector) {
  throw new Error("Query embedding is undefined");
}

  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = await prisma.$queryRaw<
    { fileName: string; sourceCode: string; summary: string }[]
  >`
    SELECT "fileName", "sourceCode", "summary",
           1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE "summaryEmbedding" IS NOT NULL
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 5
  `;

  const commits = await prisma.commit.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      commitHash: true,
      commitMessage: true,
      commitAuthorName: true,
      commitDate: true,
      summary: true,
    },
  });

  let context = "";

  if (commits.length > 0) {
    context += "RECENT COMMITS:\n";
    for (const commit of commits) {
      context += [
        `HASH: ${commit.commitHash}`,
        `MESSAGE: ${commit.commitMessage}`,
        `AUTHOR: ${commit.commitAuthorName}`,
        `DATE: ${commit.commitDate.toISOString()}`,
        `SUMMARY: ${commit.summary}`,
      ].join("\n") + "\n\n";
    }
  }

  for (const doc of result) {
    context += [
      `FILE: ${doc.fileName}`,
      `SUMMARY: ${doc.summary}`,
      `CODE:\n\`\`\`ts\n${doc.sourceCode.slice(0, 3000)}\n\`\`\``,
    ].join("\n") + "\n\n";
  }
    console.log("Context:", context);
    const answer = await answerQuestionWithContext(question, context);
    return {
        answer,
        filesReferences : result,
    }
}
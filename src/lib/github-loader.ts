import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import prisma from "@/lib/prisma";
import { Document } from "@langchain/core/documents";
import {summariseCode,generateEmbedding} from "./gemini"
import { Octokit } from "octokit";

const getFileCount = async (
  path: string,
  octokit: Octokit,
  githubOwner: string,
  githubRepo: string,
  acc: number = 0
) => {
  const { data } = await octokit.rest.repos.getContent({
    owner: githubOwner,
    repo: githubRepo,
    path,
  })

  if (!Array.isArray(data) && data.type === "file") {
    return acc + 1
  }

  if (Array.isArray(data)) {
            let fileCount = 0
        const directories: string[] = []

        for (const item of data) {
          if (item.type === "dir") {
            directories.push(item.path)
          } else {
            fileCount++
          }
        }

        if (directories.length > 0) {
          const directoryCounts = await Promise.all(
            directories.map((dirPath) =>
              getFileCount(dirPath, octokit, githubOwner, githubRepo, 0)
            )
          )

          fileCount += directoryCounts.reduce((acc, count) => acc + count, 0)
        }

        return acc + fileCount
  }

          return acc
}
export const checkCredits = async (
  githubUrl: string,
  githubToken?: string
) => {
  // find out how many files are in the repo
  const octokit = new Octokit({ auth: githubToken })

  const githubOwner = githubUrl.split("/")[3]
  const githubRepo = githubUrl.split("/")[4]

  if (!githubOwner || !githubRepo) {
    return 0
  }
  const fileCount = await getFileCount(
    "",
    octokit,
    githubOwner,
    githubRepo
  ) 
  return fileCount
}



export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || "",
    branch: "main",
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });

  const docs = await loader.load();
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);
  const allEmbeddings = await generateEmbeddings(docs);

  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      console.log(`processing ${index} of ${allEmbeddings.length}`);
      if (!embedding) return;

      const sourceCodeEmbedding =await prisma.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summary,
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName,
          projectId,
        },
      });
        await prisma.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
      `;

    })
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  if (!docs || docs.length === 0) return [];

  const results = await Promise.allSettled(
    docs.map(async (doc) => {
      const summary = await summariseCode(doc);
      const code = doc.pageContent.slice(0, 10000);
      const embeddingText = [
        `file: ${doc.metadata.source ?? "unknown"}`,
        `summary: ${summary}`,
        `code: ${code}`,
      ].join("\n\n");
      const embedding = await generateEmbedding(embeddingText);

      return {
        summary,
        embedding,
        sourceCode: doc.pageContent,
        fileName: doc.metadata.source ?? "unknown",
      };
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<{
      summary: string;
      embedding: number[];
      sourceCode: string;
      fileName: string;
    }> => r.status === "fulfilled")
    .map((r) => r.value);
};
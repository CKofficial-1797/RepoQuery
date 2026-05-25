import { Octokit } from "octokit";
import prisma from "@/lib/prisma";
import axios from "axios"
import { aiSummariseCommit } from "./gemini"

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};
function parseGithubRepo(githubUrl: string) {
    // console.log("PRISMA MODELS:", Object.keys(prisma));
    const match = githubUrl.match(
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)$/
  );

  if (!match) {
    throw new Error("Invalid GitHub repository URL");
  }

  return {
    owner: match[1],
    repo: match[2],
  };
}

export const getCommitHashes = async (
  githubUrl: string
): Promise<Response[]> => {
  const {owner, repo} = parseGithubRepo(githubUrl);

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data
    .sort(
      (a, b) =>
        new Date(b.commit.author?.date ?? 0).getTime() -
        new Date(a.commit.author?.date ?? 0).getTime()
    )
    .slice(0, 10);

  return sortedCommits.map((commit) => ({
    commitHash: commit.sha,
    commitMessage: commit.commit.message ?? "",
    commitAuthorName: commit.commit.author?.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: commit.commit.author?.date ?? "",
  }));
};

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);

  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes
  );

  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) =>
      summariseCommit(githubUrl, commit.commitHash)
    )
  );

  const summaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value as string;
    }
    return "";
  });

  const commits = await prisma.commit.createMany({
    
    data: summaries.map((summary, index) => {
        console.log(`processing commit ${index}`);
        return{
            projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary,
        }
      
    }),
  });

  return commits;
};


async function fetchProjectGithubUrl(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });

  if (!project?.githubUrl) {
    throw new Error("Project has no GitHub URL");
  }

  return {project,githubUrl :project.githubUrl} ;
}
async function summariseCommit(githubUrl: string, commitHash: string) {
  // get the diff, then pass the diff into ai
  const { data } = await axios.get(
    `${githubUrl}/commit/${commitHash}.diff`,
    {
      headers: {
        Accept: "application/vnd.github.v3.diff",
      },
    }
  );

  return (await aiSummariseCommit(data)) || "";
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[]
): Promise<Response[]> {
  const processedCommits = await prisma.commit.findMany({
    where: { projectId },
    select: { commitHash: true },
  });

  return commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processed) => processed.commitHash === commit.commitHash
      )
  );
}

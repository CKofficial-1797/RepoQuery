// import { api } from "@/trpc/react";


"use client";
import { useLocalStorage } from "usehooks-ts";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../app/api/router/root";

export const api = createTRPCReact<AppRouter>();


const useProject = () => {
  const { data: projects } = api.project.getProjects.useQuery();

  const [projectId, setProjectId] = useLocalStorage<string | null>(
    "prometheus-project-id",
    null
  );

  const project = projects?.find(p => p.id === projectId);

  return {
    projects,
    project,
    projectId,
    setProjectId,
  };
};

export default useProject;

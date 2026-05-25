// meetings-client.tsx
"use client"

import useProject from "@/hooks/use-project"
import MeetingCard from "../dashboard/meeting-card"
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../api/router/root";
 const api = createTRPCReact<AppRouter>();

const MeetingsClient = () => {
  const { projectId } = useProject()

  if (!projectId) return null

  const { data: meetings, isLoading } =
    api.project.getMeetings.useQuery(
      { projectId },
      { refetchInterval: 4000 }
    )

  return (
    <>
      <MeetingCard />
      {/* render meetings */}
    </>
  )
}

export default MeetingsClient

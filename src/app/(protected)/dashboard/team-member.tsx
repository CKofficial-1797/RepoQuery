"use client"

import useProject from "@/hooks/use-project"
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../api/router/root";
const api = createTRPCReact<AppRouter>();
import React from "react"

const TeamMembers = () => {
  const { projectId } = useProject()
 
  const { data: members } =
    api.project.getTeamMembers.useQuery( 
      {projectId : projectId ?? ""},
      { enabled: !!projectId }
    )
   if(!projectId) return null;

  return (
    <div className="flex items-center gap-2">
      {members?.map((member) => (
        <img
          key={member.id}
          src={member.user.imageUrl || ""}
          alt={member.user.firstName || ""}
          height={30}
          width={30}
        />
      ))}
    </div>
  )
}

export default TeamMembers

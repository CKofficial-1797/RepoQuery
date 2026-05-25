import useProject from "@/hooks/use-project"
import useRefetch from "@/hooks/use-refetch"
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../api/router/root";
const api = createTRPCReact<AppRouter>();
import React from "react"
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export const ArchiveButton = () => {
  const archiveProject =
    api.project.archiveProject.useMutation()

  const { projectId } = useProject()
  if (!projectId) return null

  const refetch = useRefetch()

  return (
    <Button
      disabled={archiveProject.isPending}
      size="sm"
      variant="destructive"
      onClick={() => {
        const confirm = window.confirm(
          "are you sure you want to archive this project?"
        )

        if (confirm) {
          archiveProject.mutate(
            { projectId },
            {
              onSuccess: () => {
                toast.success("project archived")
                refetch()
              },
              onError: () => {
                toast.error("failed to archive project")
              },
            }
          )
        }
      }}
    >
      Archive
    </Button>
  )
}

export default ArchiveButton

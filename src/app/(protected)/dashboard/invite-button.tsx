"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useProject from "@/hooks/use-project"
import React from "react"
import toast from "react-hot-toast"

const InviteButton = () => {
  const { projectId } = useProject()
  const [open, setOpen] = React.useState(false)
  const [inviteUrl, setInviteUrl] = React.useState("")

  React.useEffect(() => {
    if (!projectId) return
    setInviteUrl(
      `${window.location.origin}/join/${projectId}`
    )
  }, [projectId])

  if (!projectId) return null

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Invite Team Members
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-500">
            Ask them to copy and paste this link
          </p>

          <Input
            className="mt-4"
            readOnly
            value={inviteUrl}
            onClick={() => {
              navigator.clipboard.writeText(inviteUrl)
              toast.success("copied to clipboard")
            }}
          />
        </DialogContent>
      </Dialog>

      <Button onClick={() => setOpen(true)}>
        Invite
      </Button>
    </>
  )
}

export default InviteButton

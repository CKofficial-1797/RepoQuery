'use client'
 import useProject from "../../../hooks/use-project"
 import React from "react";
 import MDEditor from "@uiw/react-md-editor"
 import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image";
import {askQuestion} from "./action";
import { CodeReferences } from "./code-references";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../api/router/root";

export const api = createTRPCReact<AppRouter>();
import toast from "react-hot-toast";
import useRefetch from "@/hooks/use-refetch";


export const AskQuestionCard = () => {
  const { project } = useProject();
  const [open, setOpen] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [loading ,setLoading] = React.useState(false);
  const saveAnswer = api.project.saveAnswer.useMutation();
const [filesReferences, setFilesReferences] = React.useState<{
  fileName: string,
  sourceCode: string,
  summary: string
}[]>([]);

const [answer,setAnswer] = React.useState('')
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setFilesReferences([]);
    e.preventDefault();
    if(!project?.id) return
    setLoading(true);

    try {
      const { answer, filesReferences } = await askQuestion(question, project.id);
      setOpen(true);
      setFilesReferences(filesReferences);
      setAnswer(answer);
    } catch (error) {
      console.error(error);
      toast.error("Failed to ask RepoQuery. Try again.");
    } finally {
      setLoading(false);
    }

  };
  const refetch = useRefetch();
  return (
  <>
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className ="sm:max-w-[80vw]">
      <DialogHeader>
        <DialogTitle>
          <Image src="/THORFIN.jpg" alt="RepoQuery" width={32} height={32} />
        </DialogTitle>
                <Button
          disabled={saveAnswer.isPending}
          variant="outline"
          onClick={() =>
            saveAnswer.mutate(
              {
                projectId: project!.id,
                question,
                answer,
                filesReferences,
              },
              {
                onSuccess: () => {
                  toast.success("Answer saved!");
                  refetch();
                },
                onError: () => {
                  toast.error("Failed to save answer!");
                },
              }
            )
          }
        >
          Save Answer
        </Button>

      </DialogHeader>
      <MDEditor.Markdown
          source={answer}
          className="max-w-[70vw] h-full max-h-[40vh] overflow-scroll"
        />
        <div className="h-4"></div>
        <CodeReferences filesReferences={filesReferences}/>

        <Button type="button" onClick={() => setOpen(false)}>
          Close
        </Button>

      </DialogContent>
    </Dialog>
    

    <Card className="relative col-span-3">
      <CardHeader>
        <CardTitle>Ask a question</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit}>
          <Textarea
            placeholder="Which file should I edit to change the home page?"
            value={question}
            onChange={e=> setQuestion(e.target.value)}
          />
          <div className="h-4" />
          <Button type="submit" disabled ={loading}>Ask RepoQuery!</Button>
        </form>
      </CardContent>
    </Card>
  </>
);
}
'use client'

import React from 'react'
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../api/router/root";

export const api = createTRPCReact<AppRouter>();
import {AskQuestionCard} from '../dashboard/ask-question-card'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import MDEditor from '@uiw/react-md-editor'
import {CodeReferences} from '../dashboard/code-references'
import  useProject  from '@/hooks/use-project'
import { FileReference } from '../../api/router/file-reference';
const QAPage = () => {
  const { projectId } = useProject()

  if (!projectId) return null;

 type QuestionUI = {
  id: string
  question: string
  answer: string
  createdAt: Date
  user: { imageUrl: string | null }
  filesReferences: FileReference[]
}

const { data: questions } =
  api.project.getQuestions.useQuery({ projectId }) as {
    data: QuestionUI[] | undefined
  }


  const [questionIndex, setQuestionIndex] = React.useState(0)

  return (
    <Sheet>
      <AskQuestionCard />

      <div className="h-4" />
      <h1 className="text-xl font-semibold">Saved Questions</h1>
      <div className="h-2" />

      <div className="flex flex-col gap-2">
        {questions?.map((question, index) => (
          <React.Fragment key={question.id}>
            <SheetTrigger onClick={() => setQuestionIndex(index)}>
              <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border">
                <img
                  className="rounded-full"
                  height={30}
                  width={30}
                  src={question.user?.imageUrl ?? ''}
                />

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 line-clamp-1 text-lg font-medium">
                      {question.question}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>

                  <p className="text-gray-500 line-clamp-2 text-sm">
                    {question.answer}
                  </p>
                </div>
              </div>
            </SheetTrigger>
          </React.Fragment>
        ))}
      </div>

      {questions?.[questionIndex] && (
        <SheetContent className="sm:max-w-[80vw]">
          <SheetHeader>
            <SheetTitle>{questions[questionIndex].question}</SheetTitle>

            <MDEditor.Markdown
              source={questions[questionIndex].answer}
            />

            <CodeReferences
              filesReferences={
                (questions[questionIndex].filesReferences ?? []) as any
              }
            />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  )
}

export default QAPage

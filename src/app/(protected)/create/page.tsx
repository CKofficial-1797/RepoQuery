'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { trpc } from "../../api/router/client";
import { toast } from "react-hot-toast";
import useRefetch from "@/hooks/use-refetch";
import { tr } from "zod/v4/locales";
import { Info } from "lucide-react";
type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const checkCredits = trpc.project.checkCredits.useMutation();
  const refetch = useRefetch();
  const createProject = trpc.project.createProject.useMutation({
  onSuccess: (data) => {
    
    toast.success("Project created successfully");
    refetch();
    reset();
  },
  onError: (err) => {
    console.error(err);
    toast.error(err.message ?? "Failed to create project");
  },    
});

  const { register, handleSubmit, reset } = useForm<FormInput>();
  
 function onSubmit(data: FormInput) {
    if(!!checkCredits.data){
      createProject.mutate({
      githubUrl: data.repoUrl,
      name: data.projectName,
      githubToken: data.githubToken,
  });

  }else {
    checkCredits.mutate({
      githubUrl: data.repoUrl,
      githubToken: data.githubToken,
    });
  }
    // return true;
 
}
  const hasEnoughCredits = checkCredits.data
    ? checkCredits.data.userCredits >=
      checkCredits.data.fileCount
    : true;

  return (
    <div className="flex items-center gap-12 h-full justify-center">
      <img src="/undraw_pair-programming_9jyg.svg" className="h-56 w-auto" />

      <div>
        <div>
          <h1 className="font-semibold text-2xl">
            Link your GitHub Repository
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your repository to link it to Dion
          </p>
        </div>

        <div className="h-4"></div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              required
            />

            <div className="h-2"></div>

            <Input
              {...register("repoUrl", { required: true })}
              type="url"
              placeholder="Github URL"
              required
            />

            <div className="h-2"></div>

            <Input
              {...register("githubToken")}
              placeholder="Github Token (Optional)"
            />
                        {checkCredits.data && (
              <>
                <div className="mt-4 bg-orange-50 px-4 py-2 rounded-md border border-orange-200 text-orange-700">
                  <div className="flex items-center gap-2">
                    <Info className="size-4" />
                    <p className="text-sm">
                      You will be charged{" "}
                      <strong>{checkCredits.data?.fileCount}</strong> credits for this
                      repository.
                    </p>
                  </div>

                  <p className="text-sm text-blue-600 ml-6">
                    You have{" "}
                    <strong>{checkCredits.data?.userCredits}</strong> credits remaining.
                  </p>
                </div>
              </>
            )}

            <div className="h-4"></div>

            <Button type="submit" disabled={createProject.isPending|| !!checkCredits.isPending || !hasEnoughCredits}> 
              {checkCredits.data ? "Create Project" : "Check Credits"}
</Button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;

"use client"

import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useRouter } from "next/navigation";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useStore } from "@tanstack/react-form";
import { agentInsertSchema } from "../../schemas";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface AgentFormProps{
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne
}

export const AgentForm = ({initialValues, onCancel, onSuccess}: AgentFormProps) => {
    const trpc = useTRPC()
    const router = useRouter()
    const queryClient = useQueryClient()

    


    const createAgent = useMutation(trpc.agents.create.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))

            
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const updateAgent = useMutation(trpc.agents.update.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))

            if(initialValues?.id){
               await queryClient.invalidateQueries(
                    trpc.agents.getOne.queryOptions({id: initialValues.id})
                )
            }
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))


    const {Field, handleSubmit, store } = useForm({
        validators: {
            onSubmit: agentInsertSchema
        },
        defaultValues: {
            name: initialValues?.name ?? '',
            instructions: initialValues?.instructions ?? ''
        },
        onSubmit: ({value}) => {
            if(isEdit){
                updateAgent.mutate({ ...value, id: initialValues.id})
            }else{
                createAgent.mutate(value)
            }
        }
    });




    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending || updateAgent.isPending

    return (
        <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
        }}>
            <GeneratedAvatar seed={useStore(store, (state) => state.values.name) } varient="botttsNeutral" className="border size-16" />
            <Field name="name"
            >
                {(field) => {
                    const {errors} = field.state.meta
                    return (
                      <div className="flex flex-col gap-0.5">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold ml-0.5"
                        >
                          Name
                        </Label>
                        <Input
                          id="email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="name"
                        />
                        {errors.length > 0 && (
                            <span className="text-destructive">{errors[0]?.message}</span>
                        )}
                      </div>
                    );
                  }}

            </Field>
            <Field name="instructions"
            >
                {(field) => {
                    const {errors} = field.state.meta
                    return (
                      <div className="flex flex-col gap-0.5">
                        <Label
                          htmlFor="inst"
                          className="text-sm font-semibold ml-0.5"
                        >
                          Instruction
                        </Label>
                        <Textarea
                          id="inst"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="give your assistant a mission"
                        />
                        {errors.length > 0 && (
                            <span className="text-destructive">{errors[0]?.message}</span>
                        )}
                      </div>
                    );
                  }}

            </Field>

            <div className="flex justify-between gap-x-2">
                {onCancel && (
                    <Button variant={"ghost"} disabled={isPending} type="button" onClick={() => onCancel()}>
                        Cancel
                    </Button>
                )}
                <Button  disabled={isPending} type="submit">
                       {isEdit ? "Update" : "Create"}
                    </Button>
            </div>
            
        </form>
    )
}
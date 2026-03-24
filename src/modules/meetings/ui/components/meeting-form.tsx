"use client"

import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types"; 
import { useRouter } from "next/navigation";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useStore } from "@tanstack/react-form";
import { meetingInsertSchema, meetingUpdateSchema } from "../../schemas";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";


interface AgentFormProps{
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne
}

export const MeetingForm = ({initialValues, onCancel, onSuccess}: AgentFormProps) => {

    const [agentSearch, setAgentSearch] = useState("");
    const [open, setOpen] = useState(false)

    const trpc = useTRPC()
    const router = useRouter()
    const queryClient = useQueryClient()

    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch
        })
    )
    


    const createMeeting = useMutation(trpc.meetings.create.mutationOptions({
        onSuccess: async(data) => {
            await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))

            
            onSuccess?.(data.id);
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const updateMeeting = useMutation(trpc.meetings.update.mutationOptions({
        onSuccess: async() => {
            await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))

            if(initialValues?.id){
               await queryClient.invalidateQueries(
                    trpc.meetings.getOne.queryOptions({id: initialValues.id})
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
            onSubmit: meetingInsertSchema
        },
        defaultValues: {
            name: initialValues?.name ?? '',
            agentId: initialValues?.agentId ?? "",
        },
        onSubmit: ({value}) => {
            if(isEdit){
                updateMeeting.mutate({ ...value, id: initialValues.id})
            }else{
                createMeeting.mutate(value)
            }
        }
    });




    const isEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending

    return (
        <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
        }}>
            
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
                          placeholder="e.g. Math Consulataions"
                        />
                        {errors.length > 0 && (
                            <span className="text-destructive">{errors[0]?.message}</span>
                        )}
                      </div>
                    );
                  }}

            </Field>

            <Field name="agentId"
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
                        <CommandSelect options={(agents.data?.items ?? []).map((agent) => ({
                            id: agent.id,
                            value: agent.id,
                            children: (
                                <div className="flex items-center gap-x-2">
                                    <GeneratedAvatar seed={agent.name} varient="botttsNeutral" className="border size-6" />
                                    <span>{agent.name}</span>
                                </div>
                            )
                        }))} 
                        onSelect={field.handleChange}
                        onSearch={setAgentSearch}
                        value={field.state.value}
                        placeholder="Select an agent"
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
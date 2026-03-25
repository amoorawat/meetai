"use client"

import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { MeetingIdViewHeader } from "../components/meeting-id-view-header"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useConfirm } from "@/hooks/use-confirm"
import { UpdateMeetingDialog } from "../components/update-meeting-dialog"
import { useState } from "react"
import { UpcomingState } from "../components/upcoming-state"
import { CancelledState } from "../components/cancelled-state"
import { ProcessingState } from "../components/processing-state"
import { ActiveState } from "../components/active-state"

interface Props{
    meetingId: string
}

export const MeetingIdView = ({meetingId} : Props) => {

    const [open, setOpen] = useState(false)

    const trpc = useTRPC()
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({
        id: meetingId
    }))

      const removeMeetings = useMutation(trpc.meetings.remove.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
            router.push("/meetings")
        },
        onError: (error) => {
            toast.error(error.message)
        }
      }))
    
      const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you Sure?",
        `The following action will remove this meetings`
      )
    
      const handleRemoveMeetings = async() => {
        const ok = await confirmRemove()
    
        if(!ok) return;
    
        await removeMeetings.mutateAsync({id: meetingId})
      }

      const isActive = data.status === "active"
      const isUpcoming = data.status === "upcoming"
      const isCancelled = data.status === "cancelled"
      const isCompleted = data.status === "completed"
      const isProcessing = data.status === "processing"


    return(
        <>
        <UpdateMeetingDialog open={open} onOpenChange={setOpen} initialValues={data} />
        <RemoveConfirmation />
        <div className="flex-1 py-4 px-4  md:px-8 flex flex-col gap-y-4 ">
            <MeetingIdViewHeader 
            meetingId={meetingId}
            meetingName={data.name}
            onEdit={() => setOpen(true)}
            onRemove={handleRemoveMeetings}
            />
           {isCancelled && <CancelledState />}
           {isProcessing && <ProcessingState />}
           {isUpcoming && <UpcomingState meetingId={meetingId} onCancelMeeting={() => {}} isCancelling={false} />}
           {isCompleted && <div>completed</div>}
           {isActive && <ActiveState meetingId={meetingId} />}
        </div>
        </>
    )
}


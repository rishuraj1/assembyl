"use client"

import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"
import { getQueryClient, trpc } from "@/trpc/server"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export default function Homepage() {
  const trpc = useTRPC()
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background job invoked successfully!")
    }
  }))
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Button disabled={invoke?.isPending} onClick={() => invoke.mutateAsync({ text: "Rishu" })}>
        Invoke BG Job
      </Button>
    </div>
  )
}
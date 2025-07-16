"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTRPC } from "@/trpc/client"
import { getQueryClient, trpc } from "@/trpc/server"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

export default function Homepage() {
  const [value, setValue] = useState("")
  const trpc = useTRPC()
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions())
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message created and background job invoked successfully!")
    }
  }))
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button disabled={createMessage?.isPending} onClick={() => createMessage.mutateAsync({ value: value })}>
        Invoke BG Job
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  )
}
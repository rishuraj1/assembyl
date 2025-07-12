"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTRPC } from "@/trpc/client"
import { getQueryClient, trpc } from "@/trpc/server"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

export default function Homepage() {
  const [value, setValue] = useState("")
  const trpc = useTRPC()
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background job invoked successfully!")
    }
  }))
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button disabled={invoke?.isPending} onClick={() => invoke.mutateAsync({ value: value })}>
        Invoke BG Job
      </Button>
    </div>
  )
}
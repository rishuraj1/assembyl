import { trpc, getQueryClient } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import Client from "./client"
import { Suspense } from "react"

export default async function Homepage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({ text: "Rishu PREFETCH" }))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Client />
      </Suspense>
    </HydrationBoundary>
  )
}
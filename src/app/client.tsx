"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Client() {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.createAI.queryOptions({ text: "Rishu PREFETCH" }));
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {JSON.stringify(data, null, 2)}
        </div>
    );
}
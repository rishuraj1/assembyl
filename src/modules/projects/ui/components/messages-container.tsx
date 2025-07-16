import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import MessageCard from "./message-card"
import { MessageForm } from "./message-form"
import { useEffect, useRef } from "react"
import { Fragment } from "@/generated/prisma"
import { MessageLoading } from "./message-loading"

interface Props {
    projectId: string,
    activeFragment: Fragment | null
    setActiveFragment: (fragment: Fragment | null) => void
}

export const MessagesContainer = ({ projectId, activeFragment, setActiveFragment }: Props) => {
    const trpc = useTRPC()
    const bottomRef = useRef<HTMLDivElement>(null)
    const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
        projectId
    }, {
        refetchInterval: 5000, // Refetch every 5 seconds
        refetchOnWindowFocus: true,
    }))

    // useEffect(() => {
    //     const lastAssistantMessageWithFragment = messages.findLast(
    //         (message) => message.role === "ASSISTANT" && !!message.Fragment
    //     )
    //     if (lastAssistantMessageWithFragment) {
    //         setActiveFragment(lastAssistantMessageWithFragment.Fragment || null);
    //     }
    // }, [messages, setActiveFragment])


    useEffect(() => {
        bottomRef.current?.scrollIntoView();
    }, [messages.length])

    const lastMessage = messages[messages.length - 1];
    const isLastMessageFromUser = lastMessage?.role === "USER";

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="pt-2 pr-1">
                    {messages.map((message) => (
                        <MessageCard
                            key={message.id}
                            content={message.content}
                            role={message.role}
                            fragment={message.Fragment}
                            createdAt={message.createdAt}
                            isActiveFragment={activeFragment?.id === message?.Fragment?.id} // Placeholder for active state
                            onFragmentClick={() => setActiveFragment(message.Fragment)}
                            type={message.type} // Assuming type is part of the message
                        />
                    ))}
                    {isLastMessageFromUser && <MessageLoading />}
                    <div ref={bottomRef} className="h-0" />
                </div>
            </div>
            <div className="relative p-3 pt-1">
                <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none" />
                <MessageForm projectId={projectId} />
            </div>
        </div>
    )
}
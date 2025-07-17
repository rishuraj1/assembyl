import { useState } from "react";
import { Fragment } from "@/generated/prisma";
import {
    ExternalLink,
    RefreshCcwIcon
} from "lucide-react"
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";

interface Props {
    data: Fragment;
};

export function FragmentWeb({ data }: Props) {
    const [fragmentKey, setFragmentKey] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const onRefresh = () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        setFragmentKey(prev => prev + 1);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl || "")
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
                <Hint
                    text="Refresh sandbox"
                    side="bottom"
                    align="start"
                >
                    <Button size={"sm"} onClick={onRefresh} variant={"outline"} className="cursor-pointer">
                        <RefreshCcwIcon
                            className={isRefreshing ? "ease-in-out" : ""}
                            style={isRefreshing ? { animation: 'spin 1s linear infinite', animationDirection: 'reverse' } : {}}
                        />
                    </Button>
                </Hint>
                <Hint
                    text="Copy sandbox URL"
                    side="bottom"
                    align="start"
                >
                    <Button disabled={!data.sandboxUrl || copied} size={"sm"} onClick={handleCopy} variant={"outline"} asChild className="flex-1 justify-start text-start font-normal">
                        <span className="truncate">
                            {data.sandboxUrl}
                        </span>
                    </Button>
                </Hint>
                <Hint
                    text="Open in new tab"
                    side="bottom"
                    align="start"
                >
                    <Button
                        disabled={!data.sandboxUrl}
                        size={"sm"}
                        variant={"outline"}
                        onClick={() => {
                            if (!data.sandboxUrl) return;
                            window.open(data.sandboxUrl, "_blank", "noopener,noreferrer");
                        }}
                    >
                        <ExternalLink className="size-4" />
                    </Button>
                </Hint>
            </div>
            <iframe
                key={fragmentKey}
                className="h-full w-full"
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals"
                loading="lazy"
                src={data.sandboxUrl}
            />
        </div>
    )
}
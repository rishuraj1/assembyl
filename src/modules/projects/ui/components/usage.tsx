import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";

interface Props {
    points: number;
    msBeforeNext: number;
}

export const Usage = ({ msBeforeNext, points }: Props) => {
    const { has } = useAuth();
    const hasPremiumAccess = has?.({ plan: "pro" });
    return (
        <div className="rounded-t-xl bg-background border-b-0 border p-2.5">
            <div className="flex items-center gap-x-2">
                <div>
                    <p className="text-sm">
                        {points} {hasPremiumAccess ? "" : "free"} credits remaining
                    </p>
                    <p className="text-xl text-muted-foreground">
                        Resets in {" "}
                        {formatDuration(
                            intervalToDuration({
                                start: new Date(),
                                end: new Date(Date.now() + msBeforeNext)
                            }),
                            { format: ['months', 'days', 'hours'] }
                        )}
                    </p>
                </div>
                {!hasPremiumAccess && (
                    <Button
                        className="ml-auto"
                        variant="outline"
                        size="sm"
                        asChild
                    >
                        <Link href="/pricing" className="text-sm">
                            <CrownIcon className="h-4 w-4 mr-1" />
                            Upgrade
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    )
}
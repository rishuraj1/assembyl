import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    EditIcon,
    SunMoonIcon
} from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuSub,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface Props {
    projectId: string
}

export const ProjectHeader = ({ projectId }: Props) => {
    const trpc = useTRPC()
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId
    }))

    const { setTheme, theme } = useTheme()

    return (
        <header className="p-2 flex justify-between items-center border-b">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={"ghost"}
                        size={"sm"}
                        className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2! items-center cursor-pointer"
                    >
                        <Image
                            src={"/assembyl_logo.svg"}
                            alt="Project Icon"
                            width={24}
                            height={24}
                        />
                        <span className="text-sm font-medium">{project?.name}</span>
                        <ChevronDownIcon className="ml-2 size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start" className="w-56">
                    <DropdownMenuItem asChild>
                        <Link href={`/`}>
                            <ChevronLeftIcon className="mr-2 size-4" />
                            <span>
                                Go to Dashboard
                            </span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="gap-2">
                            <SunMoonIcon className="size-4 text-muted-foreground" />
                            <span>Appearance</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                    <DropdownMenuRadioItem value="light">
                                        <span>Light Mode</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">
                                        <span>Dark Mode</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="system">
                                        <span>System Default</span>
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
"use client"

import { useCurrentTheme } from "@/hooks/use-current-theme"
import { UserButton } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

interface Props {
    showName?: boolean
}

export const UserControl = ({ showName }: Props) => {
    const currTheme = useCurrentTheme()
    return (
        <UserButton
          showName={showName}
          appearance={{
            baseTheme: currTheme === "dark" ? dark : undefined,
            elements: {
                userButtonBox: "rounded-md!",
                userButtonAvatarBox: "rounded-md! size-8!",
                userButtonTrigger: "rounded-md!",
            },
          }} 
        />
    )
}
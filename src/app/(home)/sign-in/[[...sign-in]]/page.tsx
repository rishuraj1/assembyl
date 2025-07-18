"use client"

import { useCurrentTheme } from "@/hooks/use-current-theme"
import { SignIn } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

const SignInPage = () => {
    const currTheme = useCurrentTheme()
    return (
        <div className="flex flex-col max-w-3xl mx-auto w-full">
            <section className="space-y-6 pt-[16vh] 2xl:pt-48">
                <div className="flex flex-col items-center">
                    <SignIn
                        appearance={{
                            baseTheme: currTheme === "dark" ? dark : undefined,
                            elements: {
                                cardBox: "border! shadow-none! rounded-lg!"
                            }
                        }}
                    />
                </div>
            </section>
        </div>
    )
}

export default SignInPage
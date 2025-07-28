"use client"

import { useCurrentTheme } from "@/hooks/use-current-theme"
import { PricingTable } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import Image from "next/image"


const Page = () => {
    const currTheme = useCurrentTheme()
    return (
        <div className="flex flex-col max-w-3xl mx-auto w-full">
            <section className="space-y-6 pt-[16vh] 2xl:pt-48">
                <div className="flex flex-col items-center">
                    <Image
                        src="/assembyl_logo.svg"
                        alt="Pricing Hero"
                        width={50}
                        height={50}
                        className="hidden md:block"
                    />
                </div>
                <h1 className="text-4xl font-bold text-center">Pricing</h1>
                <p className="text-center text-muted-foreground">
                    Choose the plan that's right for you.
                </p>
                <PricingTable
                    appearance={{
                        baseTheme: currTheme === "dark" ? dark : undefined,
                        elements: {
                            card: {
                                backgroundColor: currTheme === "dark" ? "#111827" : "#f3f4f6",
                                borderRadius: "12px",
                                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                            }
                        }
                    }} />
            </section>
        </div>
    )
}

export default Page;
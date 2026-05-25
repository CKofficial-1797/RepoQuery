"use client"

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../api/router/root";
const api = createTRPCReact<AppRouter>();
import React from "react"
import { Info } from "lucide-react";
// import { Slider } from "@/components/ui/slider";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/stripe";
const BillingPage = () => {
  const { data: user } =
    api.project.getMyCredits.useQuery()

  const [creditsToBuy, setCreditsToBuy] =
    React.useState<number[]>([100])

  const creditsToBuyAmount = creditsToBuy[0]!
  const price = (creditsToBuyAmount / 50).toFixed(2)
  const [pending, startTransition] = React.useTransition();

  return (
    <div>
      <h1 className="text-xl font-semibold">
        Billing
      </h1>

      <div className="h-2"></div>

      <p className="text-sm text-gray-800">
        You currently have {user?.credits} credits.
      </p>
            <div className="h-2"></div>

        <div className="bg-green-50 px-4 py-2 rounded-md border border-green-200 text-green-700">
        <div className="flex items-center gap-2">
            <Info className="size-4 text-green-600" />
            <p className="text-sm">
            Each credit allows you to index 1 file in a repository.
            </p>
        </div>

        <p className="text-sm">
            E.g. If your project has 100 files, you will need 100 credits to index it.
        </p>
        </div>

        <div className="h-4"></div>

        {/* <Slider defaultValue={[33]} max={100} step={1} /> */}
         <Slider 
        defaultValue={[100]}
        max={1000}
        min={10}
        step={10}
        onValueChange={(value) =>
            setCreditsToBuy(value)
        }
        value={creditsToBuy}
        />

        <div className="h-4"></div>

            <Button
            disabled={pending}
            onClick={() => {
                startTransition(async () => {
                const url = await createCheckoutSession(
                    creditsToBuyAmount
                )

                if (url) {
                    window.location.href = url
                }
                })
            }}
            >
            Buy {creditsToBuyAmount} credits for ${price}
            </Button>

           
    </div>

  )
}

export default BillingPage

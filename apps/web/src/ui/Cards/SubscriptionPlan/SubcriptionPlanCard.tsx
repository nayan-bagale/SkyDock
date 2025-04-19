"use client"

// import { Check, Zap } from "lucide-react"
import { Button } from "@/ui/button"
import { Badge } from "@skydock/ui/badge"
import { Icons } from "@skydock/ui/icons"
import { showToast } from "@skydock/ui/toast"
import { useState } from "react"

interface PlanFeature {
    name: string
    included: boolean
}

interface PlanProps {
    name: string
    description: string
    price: string
    period: string
    features: PlanFeature[]
    popular?: boolean
    current?: boolean
    onUpgrade?: () => Promise<boolean> | void
}

export default function SubscriptionPlanCard({
    name,
    description,
    price,
    period,
    features,
    popular,
    current,
    onUpgrade = () => Promise.resolve(true),
}: PlanProps) {
    const [isHovering, setIsHovering] = useState(false)
    const [upgradeStatus, setUpgradeStatus] = useState<"idle" | "loading" | "success" | "error">("idle")



    const handleUpgrade = async () => {
        setUpgradeStatus("loading")
        try {
            const result = await onUpgrade()
            if (!result) {
                throw new Error("Upgrade failed")
            }
            setUpgradeStatus("success")
            // Reset status after 3 seconds
            showToast(`Successfully upgraded to ${name} plan`, 'success');
            setTimeout(() => setUpgradeStatus("idle"), 3000)

        } catch (error) {
            setUpgradeStatus("error")
            showToast(`Failed upgraded to ${name} plan`, 'error');

            setTimeout(() => setUpgradeStatus("idle"), 3000)
        }
    }

    return (
        <div className="relative">
            {/* {upgradeStatus === "success" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg shadow-lg">
                        <h3 className="font-bold text-lg mb-1">Upgrade Successful!</h3>
                        <p>You have successfully upgraded to the {name} plan.</p>
                    </div>
                </div>
            )}

            {upgradeStatus === "error" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg shadow-lg">
                        <h3 className="font-bold text-lg mb-1">Upgrade Failed</h3>
                        <p>There was an error upgrading to the {name} plan. Please try again.</p>
                    </div>
                </div>
            )} */}

            <div
                className={`rounded-xl bg-white  shadow w-[16rem]  border-2 transition-all duration-200 ${current
                    ? "border-green-500 shadow-lg"
                    : popular
                        ? "border-primary shadow-lg"
                        : isHovering
                            ? "border-gray-300"
                            : "border-gray-200"
                    }`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="flex flex-col p-6 space-y-1 pb-2">
                    {popular && !current && (
                        <Badge className="w-fit mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                            <Icons.Zap className="mr-1 h-4 w-4" />
                            Most Popular
                        </Badge>
                    )}
                    {current && (
                        <Badge className="w-fit mb-2 bg-green-100 text-green-700 hover:bg-green-200 border-none">
                            {/* <Check className="mr-1 h-3 w-3" /> */}

                            Current Plan
                        </Badge>
                    )}
                    {!popular && !current && (
                        <div className=" py-3">
                        </div>
                    )}
                    <div className=" leading-none tracking-tight text-2xl font-bold">{name}</div>
                    <div className="text-sm text-muted-foreground">{description}</div>
                </div>
                <div className="pb-2 p-6 pt-0">
                    <div className="mb-4">
                        <span className="text-3xl font-bold">{price}</span>
                        {period && <span className="text-muted-foreground ml-1">/{period}</span>}
                    </div>
                    <ul className="space-y-2 mb-6">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                {/* <Check className={`mr-2 h-5 w-5 mt-0.5 ${feature.included ? "text-primary" : "text-gray-300"}`} /> */}
                                <span className={feature.included ? "" : "text-muted-foreground"}>{feature.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex items-center p-2 pt-0">
                    {current ? (
                        <Button disabled className="w-full bg-green-500 hover:bg-green-500 py-1.5" intent="action">
                            Current Plan
                        </Button>
                    ) : (

                        <Button
                            onClick={handleUpgrade}
                            className="w-full bg-blue-400 hover:bg-blue-500 py-1.5"
                            // variant={popular ? "default" : "outline"}
                            intent={"action"}                            // size="lg"
                            disabled={upgradeStatus === "loading"}
                        >
                            {/* {upgradeStatus === "loading" ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                `Upgrade to ${name}`
                            )} */}
                            {upgradeStatus === "loading" ? <span className=" animate-spin"><Icons.Loader className=" h-6 w-6" /> </span> : `Upgrade to ${name}`}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

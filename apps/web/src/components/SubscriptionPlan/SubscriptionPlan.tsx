
import { useGetAllPlansQuery } from "@/redux/apis/planApis"
import { closeSubscriptionPlanCard } from "@/redux/features/apps/appsSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import SubscriptionPlanCard from "@/ui/Cards/SubscriptionPlan/SubcriptionPlanCard"
import SubscriptionPlanWrapper from "@/ui/Cards/SubscriptionPlan/SubscriptionPlanWrapper"
import { useRef } from "react"
import { useDrag } from "../hooks/useDrag"

export default function SubscriptionPlans() {
    const currentPlan = useAppSelector((state) => state.auth.user?.plan.name)
    const draggableRef = useRef<HTMLDivElement>(null);
    const theme = useAppSelector((state) => state.settings.apperance.theme);
    const dispatch = useAppDispatch();

    const { data: allPlans, isLoading } = useGetAllPlansQuery();

    const handleUpgrade = async (plan: string): Promise<boolean> => {

        // Simulate API call with 50% success rate for demo purposes
        return new Promise((resolve) => {
            setTimeout(() => {
                // For demo: Pro plan always succeeds, Enterprise always fails
                if (plan === "Pro") {
                    // setCurrentPlan(plan)
                    resolve(true)
                } else if (plan === "Enterprise") {
                    resolve(false)
                } else {
                    // Random success/failure for other plans
                    const success = Math.random() > 0.5
                    // if (success) setCurrentPlan(plan)
                    resolve(success)
                }
            }, 1500)
        })
    }

    const { position, handleMouseDown } = useDrag({
        ref: draggableRef
    });

    const Action = {
        close: () => {
            dispatch(closeSubscriptionPlanCard())
            // Close the image viewer
            // You'll need to add this action to your apps slice
            // dispatch(closeImageViewer())
        },
    };
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <SubscriptionPlanWrapper
            // className="w-full bg-white/60 backdrop-blur max-w-6xl mx-auto p-4 md:p-6"
            ref={draggableRef}
            style={{ x: position.x, y: position.y }}
            onMouseDown={handleMouseDown}
            action={Action}
            onMouseDownCard={() => { }}
            className={'z-30'}
            theme={theme}
            onContextMenu={handleContextMenu}
        >
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold tracking-tight mb-1">Choose Your Plan</h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Select the perfect plan for your needs. Upgrade or downgrade at any time.
                </p>
            </div>

            <div className="flex items-center justify-center gap-6 px-6 mb-6">
                {allPlans?.map((plan) => (
                    <SubscriptionPlanCard
                        key={plan.id}
                        name={plan.name}
                        description={plan.description ?? ""}
                        price={`$${plan.price}`}
                        period={plan.interval === "monthly" ? "month" : "year"}
                        features={plan.features.map((feature) => ({
                            name: feature,
                            included: true,
                        }))}
                        popular={plan.popular}
                        current={currentPlan === plan.name}
                        onUpgrade={() => handleUpgrade(plan.name)}
                    />
                ))}
                {/* <SubscriptionPlanCard
                    name="Hobby"
                    description=""
                    price="$0"
                    period="forever"
                    features={[
                        { name: "100MB Storage", included: true },
                        { name: "Limited Bandwidth", included: true },
                        { name: "Limited Apps", included: true },
                    ]}
                    current={currentPlan === "Hobby"}
                    onUpgrade={() => handleUpgrade("Hobby")}
                />

                <SubscriptionPlanCard
                    name="Pro"
                    description=""
                    price="$10"
                    period="month"
                    features={[
                        { name: "100GB Storage", included: true },
                        { name: "Accelerated Bandwidth", included: true },
                        { name: "Unlimited Apps", included: true },
                    ]}
                    popular={true}
                    current={currentPlan === "Pro"}
                    onUpgrade={() => handleUpgrade("Pro")}
                /> */}
            </div>
        </SubscriptionPlanWrapper>
    )
}

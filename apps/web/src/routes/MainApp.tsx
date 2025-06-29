import GlobalContextApi from "@/components/ContextApi/GlobalContextApi";
import GlobalContextMenu from "@/components/GlobalContextMenu/GlobalContextMenu";
import { useAppSelector } from "@/redux/hooks";
import { AnimatePresence } from "framer-motion";
import Apps_ from "../components/Apps/Apps_";
import MenuBar from "../components/Bar/MenuBar";
import Desktop from "../components/Desktop/Desktop";
import Dock from "../components/Dock/Dock";
import SubscriptionPlans from "../components/SubscriptionPlan/SubscriptionPlan";
import "../index.css";


const MainApp = () => {

    const isSubscriptionPlanCardOpen = useAppSelector(
        (state) => state.apps.subscriptionPlanCard
    );

    return (
        <GlobalContextApi>
            <div className="w-full">
                <MenuBar />
            </div>
            <Desktop>
                <Apps_ />
            </Desktop>
            <div className="justify-self-end">
                <Dock />
            </div>
            {/* <AiButton /> */}
            <AnimatePresence>
                {isSubscriptionPlanCardOpen && <SubscriptionPlans />}
            </AnimatePresence>
            {/* <DraggingItem /> */}
            <GlobalContextMenu />
        </GlobalContextApi>
    )
}

export default MainApp
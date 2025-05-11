// import GlobalContextMenu from "@/components/GlobalContextMenu/GlobalContextMenu";
// import { AnimatePresence } from "framer-motion";
// import { useMemo } from "react";
// import Apps_ from "./components/Apps/Apps_";
// import MenuBar from "./components/Bar/MenuBar";
// import { ConfirmModalProvider } from "./components/ContextApi/ConfirmModal";
// import Desktop from "./components/Desktop/Desktop";
// import Dock from "./components/Dock/Dock";
// import DraggingItem from "./components/DraggingItem";
// import useSkydockInitialLoad from "./components/hooks/useSkydockInitialLoad";
// import SubscriptionPlans from "./components/SubscriptionPlan/SubscriptionPlan";
// import "./index.css";
// import { useAppSelector } from "./redux/hooks";
// import cn from "./utils";

// function App() {
//   // const { isLocked } = useAppSelector((state) => state.lockScreen);
//   const { isLoading } = useSkydockInitialLoad();
//   const isSubscriptionPlanCardOpen = useAppSelector(
//     (state) => state.apps.subscriptionPlanCard
//   );
//   const handleContext = (e: any) => {
//     // e.preventDefault()
//     // console.log(e.target)
//   };

//   const token = useAppSelector((state) => state.auth.accessToken);

//   const MainScreen = useMemo(() => {
//     return (
// <ConfirmModalProvider>
//   <div className="w-full">
//     <MenuBar />
//   </div>
//   <Desktop>
//     {/* <Folders /> */}
//     <Apps_ />
//   </Desktop>
//   <div className="justify-self-end">
//     <Dock />
//   </div>
//   <AnimatePresence>
//     {isSubscriptionPlanCardOpen && <SubscriptionPlans />}
//   </AnimatePresence>
//   {<DraggingItem />}
// </ConfirmModalProvider>
//     );
//   }, [isSubscriptionPlanCardOpen]);

//   if (isLoading) return <div>Loading...</div>;


//   return (
//     <main className="pb-4 h-screen" onContextMenu={handleContext}>
//       <div
//         className={cn(
//           "flex flex-col items-center h-full",
//           !token ? "justify-center" : "justify-between"
//         )}
//       >
//         {token ? (
//           <>
//             {/* <AnimatePresence>
//               {isLocked && (
//                 <LockScreen />
//               )}
//             </AnimatePresence> */}
//             {MainScreen}
//           </>
//         ) : (
//           <AnimatePresence>
//             <Auth />
//           </AnimatePresence>
//         )}
//       </div>
//       <GlobalContextMenu />

//     </main>
//   );
// }

import { Route, Routes } from "react-router";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword";
import OAuth from "./components/Auth/OAuth";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import Layout from "./routes/Layout";
import MainApp from "./routes/MainApp";
import Protected from "./routes/Protected";


const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/oauth" element={<OAuth />} />
        <Route path="/" element={<Protected />}>
          {/* <Route index element={<Navigate to="/skydock" />} /> */}
          <Route index element={<MainApp />} />
        </Route>
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  )
}


export default App;

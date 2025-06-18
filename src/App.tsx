import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import AccountDetailPage from "./pages/AccountDetailPage";
import AccountsPage from "./pages/AccountsPage";
import DashboardOverviewPage from "./pages/DashboardOverviewPage";
import MoveMoneyPage from "./pages/MoveMoneyPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<DashboardOverviewPage />} />
          <Route path="/account-detail" element={<AccountDetailPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/move-money" element={<MoveMoneyPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;

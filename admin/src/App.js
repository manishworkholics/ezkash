import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./pages/Dashboard";
import UserList from "./pages/UserList";
import UserInformation from "./pages/UserInformation";
import AllCheques from "./pages/AllCheques";
import ChequeDetails from "./pages/ChequeDetails";
import Report from "./pages/Report";
import ReportExport from "./pages/ReportExport";
import ProtectedRoute from './pages/Common_Method/protectedroute'
import Support from "./pages/Support";
import TicketDetails from "./pages/TicketDetails";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/cd-admin/" element={<SignIn />} />
          <Route path="/cd-admin/sign-up" element={<SignUp />} />
          <Route path="/cd-admin/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/cd-admin/user-list" element={<ProtectedRoute element={<UserList />} />} />
          <Route path="/cd-admin/user-information/:id" element={<ProtectedRoute element={<UserInformation />} />} />
          <Route path="/cd-admin/all-cheques" element={<ProtectedRoute element={<AllCheques />} />} />
          <Route path="/cd-admin/cheque-details/:id" element={<ProtectedRoute element={<ChequeDetails />} />} />
          <Route path="/cd-admin/report/:id" element={<ProtectedRoute element={<Report />} />} />
          <Route path="/cd-admin/export-report" element={<ProtectedRoute element={<ReportExport />} />} />
          <Route path="/cd-admin/support" element={<ProtectedRoute element={<Support />} />} />
          <Route path="/cd-admin/ticket-details/:id" element={<ProtectedRoute element={<TicketDetails />} />} />
          <Route path="/cd-admin/terms&conditions" element={<ProtectedRoute element={<TermsAndConditions />} />} />
          <Route path="/cd-admin/privacy-policy" element={<ProtectedRoute element={<PrivacyPolicy />} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

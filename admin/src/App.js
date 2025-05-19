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

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/cm-admin/" element={<SignIn />} />
          <Route path="/cm-admin/sign-up" element={<SignUp />} />
          <Route path="/cm-admin/dashboard" element={<ProtectedRoute element={<Dashboard />}/>} />
          <Route path="/cm-admin/user-list" element={<ProtectedRoute element={<UserList />}/>} />
          <Route path="/cm-admin/user-information/:id" element={<ProtectedRoute element={<UserInformation />}/>} />
          <Route path="/cm-admin/all-cheques" element={<ProtectedRoute element={<AllCheques />}/>} />
          <Route path="/cm-admin/cheque-details/:id" element={<ProtectedRoute element={<ChequeDetails />}/>} />
          <Route path="/cm-admin/report" element={<ProtectedRoute element={<Report />}/>} />
          <Route path="/cm-admin/export-report" element={<ProtectedRoute element={<ReportExport />}/>} />
          <Route path="/cm-admin/support" element={<ProtectedRoute element={<Support />}/>} />
          <Route path="/cm-admin/ticket-details/:id" element={<ProtectedRoute element={<TicketDetails />}/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

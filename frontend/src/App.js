import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./pages/Home";
import Checks from "./pages/Checks";
import CheckDetails from "./pages/CheckDetails";
import Report from "./pages/Report";

import Support from "./pages/Support";
import Otp from "./pages/Otp";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyEmailExpired from "./pages/VerifyEmailExpired";
import VerifyEmailSuccess from "./pages/VerifyEmailSuccess";
import MyTicket from "./pages/MyTicket";
import ForgetPassword from "./pages/ForgetPassword";
import ProtectedRoute from "./pages/Common_Method/protectedroute";
import ForgetPasswordVerification from "./pages/ForgetPasswordVerification";
import Profile from "./pages/Profile";
import MobileAddCheck from "./pages/MobileAddCheck";
import Chat from "./pages/Chat";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AddCheck from "./pages/AddCheck";

function App() {
  return (
    <>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/add-check" element={<ProtectedRoute element={<AddCheck />} />} />
          <Route path="/checks" element={<ProtectedRoute element={<Checks />} />} />
          <Route path="/check-details/:id" element={<ProtectedRoute element={<CheckDetails />} />} />
          <Route path="/report" element={<ProtectedRoute element={<Report />} />} />
          <Route path="/support" element={<ProtectedRoute element={<Support />} />} />
          <Route path="/verify-otp" element={<Otp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-verification-expired" element={<VerifyEmailExpired />} />
          <Route path="/email-verification-successfully" element={<VerifyEmailSuccess />} />
          <Route path="/my-ticket" element={<ProtectedRoute element={<MyTicket />} />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/forget-password-verification" element={<ForgetPasswordVerification />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload-check" element={<MobileAddCheck />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/terms&conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

    </>
  );
}

export default App;

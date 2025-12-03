import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateResume from "./pages/CreateResumepage";
import UploadResume from "./pages/UploadResume";
import Login from "./components/Login";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./layout/Layout";
import {Toaster} from "react-hot-toast"
import SelectTemplates from "./pages/SelectTemplates";
import ForgotPassword from "./components/ForgotPass";
import ResetPassword from "./components/ResetPassword";

export default function App() {
  return (
    <div className="">
      <Routes>
        <Route element={<Layout/>}>
        <Route path="/" element={<Home />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

         <Route
          path="/select-template"
          element={<ProtectedRoute>
            <SelectTemplates />
            </ProtectedRoute>}
        />

        <Route
          path="/create-resume"
          element={
            <ProtectedRoute>
              <CreateResume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-resume"
          element={
            <ProtectedRoute>
              <UploadResume />
            </ProtectedRoute>
          }
        />

         {/* <Route
            path="/ats-result"
            element={
              <ProtectedRoute>
                <ATSResult />
              </ProtectedRoute>
            }
          /> */}

             {/* <Route
                path="/preview-resume"
                element={<ProtectedRoute>
                  <PreviewResume />
                  </ProtectedRoute>}
              /> */}


        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center"/>
      </div>
  );
}

import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages for better performance
const Assets = React.lazy(() => import('../pages/Assets'));
const Reports = React.lazy(() => import('../pages/Reports'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Login = React.lazy(() => import('../pages/Login'));
const Organizations = React.lazy(() => import('../pages/Organizations'));
const Users = React.lazy(() => import('../pages/Users'));
const Requests = React.lazy(() => import('../pages/Requests'));

// Reports Pages
const CRMReports = React.lazy(() => import('../pages/reports/CRMReports'));
const AIReportGenerator = React.lazy(() => import('../pages/reports/AIReportGenerator'));


// Asset Management Pages
const AssetDashboard = React.lazy(() => import('../pages/assets/AssetDashboard'));
const AssetDetails = React.lazy(() => import('../pages/assets/AssetDetails'));
const AssetTypes = React.lazy(() => import('../pages/assets/AssetTypes'));
const AssetCategory = React.lazy(() => import('../pages/assets/AssetCategory'));
const AssetVendors = React.lazy(() => import('../pages/assets/AssetVendors'));
const AssetManufacturers = React.lazy(() => import('../pages/assets/AssetManufacturers'));
const AssetMaintenance = React.lazy(() => import('../pages/assets/AssetMaintenance'));
const AssetDepreciation = React.lazy(() => import('../pages/assets/AssetDepreciation'));

// CRM Pages
const CRMDashboard = React.lazy(() => import('../pages/crm/CRMDashboard'));
const Leads = React.lazy(() => import('../pages/crm/Leads'));
const Deals = React.lazy(() => import('../pages/crm/Deals'));
const Campaign = React.lazy(() => import('../pages/crm/Campaign'));
const Trash = React.lazy(() => import('../pages/crm/Trash'));

// Master Pages
const BusinessUnits = React.lazy(() => import('../pages/master/BusinessUnits'));
const EmailMaster = React.lazy(() => import('../pages/master/EmailMaster'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
  </div>
);

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();



  if (loading) {

    return <LoadingSpinner />;
  }



  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <>

                <Navigate to="/" replace />
              </>
            ) : (
              <>

                <Login />
              </>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AssetDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Rest of the routes remain the same */}
        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Assets />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Asset Management Routes */}
        <Route
          path="/assets/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AssetDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/details"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AssetDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/types"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AssetTypes />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/category"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AssetCategory />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/vendors"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AssetVendors />
              </MainLayout>
            </ProtectedRoute>
          }
        />

                  <Route
            path="/assets/manufacturers"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AssetManufacturers />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assets/maintenance"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AssetMaintenance />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
          path="/assets/depreciation"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AssetDepreciation />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* CRM Routes */}
        <Route
          path="/crm/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CRMDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/crm/leads"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Leads />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/crm/opportunities"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Deals />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/crm/campaigns"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Campaign />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/crm/trash"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Trash />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/master/business-units"
          element={
            <ProtectedRoute>
              <MainLayout>
                <BusinessUnits />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/master/campaigns"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Campaign />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/master/email-master"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EmailMaster />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/crm"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CRMDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizations"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Organizations />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Users />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Requests />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/crm"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CRMReports />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/ai-generator"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AIReportGenerator />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Reports />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />



        {/* Catch all route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 
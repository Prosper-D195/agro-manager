import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
import Layout from './components/Layout';

// Auth
import Login from './pages/auth/Login';
import ForgetPassword from './pages/auth/ForgetPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard
import AgriculturalDashboard from './pages/dashboard/AgriculturalDashboard';
import FinancialDashboardPage from './pages/dashboard/FinancialDashboardPage';

// Cultures
import CulturesList from './pages/cultures/CulturesList';
import CultureForm from './pages/cultures/CultureForm';

// Cultivations
import CultivationsList from './pages/cultivations/CultivationsList';

// Récoltes
import RecoltesList from './pages/recoltes/RecoltesList';
import RecolteForm from './pages/recoltes/RecolteForm';

// Intrants
import IntrantsList from './pages/intrants/IntrantsList';
import IntrantForm from './pages/intrants/IntrantForm';
import IntrantStockUpdate from './pages/intrants/IntrantStockUpdate';

// Compta
import CategoriesList from './pages/compta/CategoriesList';
import CategoryForm from './pages/compta/CategoryForm';
import OperationsList from './pages/compta/OperationsList';
import OperationForm from './pages/compta/OperationForm';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Redirect root */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navigate to="/dashboard" replace />
            </PrivateRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout><AgriculturalDashboard /></Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/financial-dashboard"
          element={
            <PrivateRoute>
              <Layout><FinancialDashboardPage /></Layout>
            </PrivateRoute>
          }
        />

        {/* Cultures */}
        <Route
          path="/cultures"
          element={
            <PrivateRoute>
              <Layout><CulturesList /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cultures/new"
          element={
            <PrivateRoute>
              <Layout><CultureForm /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cultures/:id/edit"
          element={
            <PrivateRoute>
              <Layout><CultureForm /></Layout>
            </PrivateRoute>
          }
        />

        {/* Cultivations */}
        <Route
          path="/cultivations"
          element={
            <PrivateRoute>
              <Layout><CultivationsList /></Layout>
            </PrivateRoute>
          }
        />

        {/* Récoltes */}
        <Route
          path="/recoltes"
          element={
            <PrivateRoute>
              <Layout><RecoltesList /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/recoltes/new"
          element={
            <PrivateRoute>
              <Layout><RecolteForm /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/recoltes/:id/edit"
          element={
            <PrivateRoute>
              <Layout><RecolteForm /></Layout>
            </PrivateRoute>
          }
        />

        {/* Intrants */}
        <Route
          path="/intrants"
          element={
            <PrivateRoute>
              <Layout><IntrantsList /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/intrants/new"
          element={
            <PrivateRoute>
              <Layout><IntrantForm /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/intrants/:id/edit"
          element={
            <PrivateRoute>
              <Layout><IntrantForm /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/intrants/:id/stock"
          element={
            <PrivateRoute>
              <Layout><IntrantStockUpdate /></Layout>
            </PrivateRoute>
          }
        />

        {/* Compta */}
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Layout><CategoriesList /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/categories/new"
          element={
            <PrivateRoute>
              <Layout><CategoryForm /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/categories/:id/edit"
          element={
            <PrivateRoute>
              <Layout><CategoryForm /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/operations"
          element={
            <PrivateRoute>
              <Layout><OperationsList /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/operations/new"
          element={
            <PrivateRoute>
              <Layout><OperationForm /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/operations/:id/edit"
          element={
            <PrivateRoute>
              <Layout><OperationForm /></Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
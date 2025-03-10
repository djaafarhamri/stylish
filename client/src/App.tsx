import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Test from "./Test";
import Navbar from "./components/Navbar";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import AccountPage from "./pages/Account";
import CartPage from "./pages/Cart";
import ProductsPage from "./pages/Products";
import ProductContent from "./pages/Product";
import { AppToaster } from "./components/ui/AppToaster";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutPage from "./pages/Checkout";
import ConfirmationPage from "./pages/CheckoutConfirmation";
import OrderDetailsPage from "./pages/OrderPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/confirmation" element={<ConfirmationPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/order/:id" element={<OrderDetailsPage />} />
        <Route path="/products/:id" element={<ProductContent />} />
        <Route path="/test" element={<Test />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
      <AppToaster />
    </>
  );
}

export default App;

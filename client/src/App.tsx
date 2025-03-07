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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductContent />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      <AppToaster />
    </>
  );
}

export default App;

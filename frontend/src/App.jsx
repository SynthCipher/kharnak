import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Tourism from "./pages/Tourism";
import Culture from "./pages/Culture";
import PlaceOrder from "./pages/PlaceOrder";
import Contact from "./pages/Contact";
import StoryDetail from "./pages/StoryDetail";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import BookStayModal from "./components/BookStayModal";

import GroupDetail from "./pages/GroupDetail";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Archive from "./pages/Archive";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TourDetail from "./pages/TourDetail";

const App = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col min-h-screen ">
            <ScrollToTop />
            <ToastContainer />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/tourism" element={<Tourism />} />
                <Route path="/culture" element={<Culture />} />
                <Route path="/culture/:id" element={<StoryDetail />} />
                <Route path="/place-order" element={<PlaceOrder />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/groups/:id" element={<GroupDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/tour/:id" element={<TourDetail />} />
            </Routes>
            <Footer />
            {!location.pathname.startsWith('/profile') && !location.pathname.startsWith('/tour/') && <BookStayModal />}
        </div >
    );
};

export default App;

import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Bookings from "./pages/Bookings";
import AddStory from "./pages/AddStory";
import ListStories from "./pages/ListStories";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import Users from "./pages/Users";
import ManageAdmins from "./pages/ManageAdmins";
import EditStory from "./pages/EditStory";
import AddPublication from "./pages/AddPublication";
import ListPublications from "./pages/ListPublications";
import EditPublication from "./pages/EditPublication";
import AddTour from "./pages/AddTour";
import ListTours from "./pages/ListTours";
import Applicants from "./pages/Applicants";

import Login from "./components/Login";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";

const App = () => {
  // const [token, setToken] = useState("");
  const { token } = useContext(AppContext);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />

      {token === "" ? (
        <Login />
      ) : (
        <div className="flex bg-gray-50 min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 p-5 md:p-8 lg:p-12 pb-32 md:pb-12 max-w-[1600px] mx-auto w-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/add-story" element={<AddStory />} />
                <Route path="/list-stories" element={<ListStories />} />
                <Route path="/edit-story/:id" element={<EditStory />} />
                <Route path="/users" element={<Users />} />
                <Route path="/manage-admins" element={<ManageAdmins />} />
                <Route path="/add-publication" element={<AddPublication />} />
                <Route path="/list-publications" element={<ListPublications />} />
                <Route path="/edit-publication/:id" element={<EditPublication />} />
                <Route path="/add-tour" element={<AddTour />} />
                <Route path="/list-tours" element={<ListTours />} />
                <Route path="/applicants/:id" element={<Applicants />} />
              </Routes>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;

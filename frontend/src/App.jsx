import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";
import Locations from "./pages/locations";
import Location from "./pages/location";
import Home from "./pages/home";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Book from "./pages/book";
import UserHomepage from "./pages/userHomepage";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:id" element={<Location />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book/:roomid" element={<Book />} /> 
            <Route path="/me" element={<UserHomepage />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </ ThemeProvider>
  )
}

export default App;
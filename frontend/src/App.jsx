import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Locations from "./pages/locations";
import Location from "./pages/location";
import Home from "./pages/Home";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import Book from "./pages/book";
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
          </Routes>
        </AuthProvider>
      </Router>
    </ ThemeProvider>
  )
}

export default App;
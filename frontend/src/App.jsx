import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Locations from "./pages/locations";
import Home from "./pages/Home";
import Navbar from "./components/navbar";

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/locations" element={<Locations />} />
          </Routes>
      </Router>
    </ ThemeProvider>
  )
}

export default App;
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
    const { user, loading, logout } = useAuth();

    return (
        <nav className="flex m-6">
            <div className="flex-1"></div> 
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink className="text-md cursor-pointer">
                            <Link to="/">
                                Home    
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink className="text-md cursor-pointer">
                            <Link to="/locations">
                                Locations
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            
            <div className="flex-1 flex justify-end"> 
                    {user ? 
                        <Link onClick={logout}>
                            <Button variant="outline" className="cursor-pointer">
                                Sign Out
                            </Button>
                        </Link>
                        :
                        <Link to="/login">
                            <Button variant="outline" className="cursor-pointer">
                                Sign In
                            </Button>
                         </Link>
                    }
            </div>
        </nav>
    )
}

export default Navbar;
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

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center m-6">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink className="cursor-pointer">
                            <Link to="/">
                                Home    
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink className="cursor-pointer">
                            <Link to="/locations">
                                Locations
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            
            <Button variant="outline" className="cursor-pointer">
                Log In
            </Button>
        </nav>
    )
}

export default Navbar;
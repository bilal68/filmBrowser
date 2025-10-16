import { NavLink, Outlet } from "react-router-dom";
import { useWishlist } from "@/stores/wishlistStore";
import { usePerformanceMonitoring } from "@/utils/performance";

export default function Layout() {
  const { getWishlistCount } = useWishlist();
  
  // Initialize performance monitoring
  usePerformanceMonitoring();

  return (
    <>
      <header className="header">
        <div className="container">
          <strong>Film Browser</strong>
          <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/wishlist">
              Wish List <span className="badge">{getWishlistCount()}</span>
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="container">© {new Date().getFullYear()}</footer>
    </>
  );
}

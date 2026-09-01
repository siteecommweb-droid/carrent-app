import { Outlet } from "react-router-dom";
import MainNavbar from "../components/layout/MainNavbar";
import Footer from "../components/layout/Footer";

export default function AppLayout() {
return ( <div className="min-h-screen bg-[#020817] overflow-hidden text-white"> <MainNavbar />

```
  <main className="pt-24">
    <Outlet />
  </main>

  <Footer />
</div>
);
}

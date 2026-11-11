import dynamic from "next/dynamic";

// import "react-toastify/dist/ReactToastify.css";
import ResponsiveAppBar from "./AppBar";

const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false } // Prevents SSR issues
);
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastContainer />
      {/* <Navigation /> */}
      <ResponsiveAppBar />
      <main className="container mx-auto pb-20 md:pb-0">{children}</main>
    </>
  )
}
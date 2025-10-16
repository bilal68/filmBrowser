import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/app/router";

// Only import CSS on client side
if (typeof window !== 'undefined') {
  import("@/styles/main.scss");
}

hydrateRoot(
  document.getElementById("root")!,
  <RouterProvider router={router} />
);

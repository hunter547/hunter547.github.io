import React, { lazy, Suspense } from "react";
import { ClientOnly } from "vite-react-ssg";
import AnimatedLayout from "./components/AnimatedLayout";
import Niche from "./templates/Niche";

// The home page is a heavy, browser-only SPA (gsap intro, lightweight-charts,
// canvas-confetti). Load it lazily and render it client-only so its modules
// are never evaluated during the static (Node) pre-render.
const Home = lazy(() => import("./pages/index"));

export const routes = [
  {
    // Layout route: wraps every page in motion/react page transitions.
    path: "/",
    element: <AnimatedLayout />,
    children: [
      {
        index: true,
        element: (
          <ClientOnly>
            {() => (
              <Suspense fallback={null}>
                <Home />
              </Suspense>
            )}
          </ClientOnly>
        ),
      },
      {
        // The niche "template" — one component, statically rendered per slug.
        path: "niches/:slug",
        element: <Niche />,
      },
    ],
  },
];

import "../css/app.css";
import "../css/swiper-custom.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import MainLayout from "@/Layouts/MainLayout";
import { PropertyProvider } from "@/contexts/PropertyContext";

const appName = import.meta.env.VITE_APP_NAME;

createInertiaApp({
    title: (title) => `${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <PropertyProvider>
                <App
                    {...props}
                    layout={(page) => <MainLayout>{page}</MainLayout>}
                />
            </PropertyProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});

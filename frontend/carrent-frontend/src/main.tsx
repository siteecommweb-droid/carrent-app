import "@fontsource/orbitron/400.css";
import "@fontsource/orbitron/700.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/rajdhani/500.css";
import "@fontsource/rajdhani/700.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import "./i18n";
import "./index.css";
import "./styles/luxury.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BookingProvider>
          <CurrencyProvider>
            <LanguageProvider>
              <BrowserRouter>
                <App />
                <Toaster position="top-right" />
              </BrowserRouter>
            </LanguageProvider>
          </CurrencyProvider>
        </BookingProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

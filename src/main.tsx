import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "@radix-ui/themes/styles.css";
import ThemeProvider from "./ThemeProvider";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/crm">
    <ThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </BrowserRouter>
);
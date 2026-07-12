import { useState } from "react";
import Formatter from "./pages/Formatter";
import Guide from "./pages/Guide";
import Footer from "./components/Footer";

type Page = "formatter" | "guide";

export default function App() {
  const [page, setPage] = useState<Page>("formatter");

  return (
    <div className="app">
      <header className="app-header">
        <h1>Disco Elysium CSS Formatter</h1>
        <nav className="app-nav">
          <button
            className={page === "formatter" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("formatter")}
          >
            Formatter
          </button>
          <button
            className={page === "guide" ? "nav-btn active" : "nav-btn"}
            onClick={() => setPage("guide")}
          >
            Guide
          </button>
        </nav>
      </header>
      <main className="app-main">
        {page === "formatter" ? (
          <Formatter onOpenGuide={() => setPage("guide")} />
        ) : (
          <Guide />
        )}
      </main>
      <Footer />
    </div>
  );
}

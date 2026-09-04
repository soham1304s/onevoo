import React from "react";

/** Recurring film-strip perforation divider — the page's signature motif. */
export default function Perf() {
  return (
    <div className="perf-divider perf" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <span key={i} className="perf-hole" />
      ))}
    </div>
  );
}


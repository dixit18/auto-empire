"use client";

/* Last-resort shell: even a root failure keeps the masthead + a way home. */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Georgia, serif", background: "#f7f2e7", color: "#1c1712", padding: 32 }}>
        <h1 style={{ fontSize: "2rem" }}>The Empire <span style={{ color: "#b03325" }}>·</span> <em>Agent World</em></h1>
        <p>Today's edition failed to print. The newsroom has been notified.</p>
        <button onClick={() => reset()} style={{ padding: "8px 16px", marginRight: 8 }}>Try again</button>
        <a href="/">Front page</a>
      </body>
    </html>
  );
}

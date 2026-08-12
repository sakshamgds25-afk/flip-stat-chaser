import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Interactive Virtual Coin Flipper — Probability Simulator" },
      {
        name: "description",
        content:
          "Flip a virtual coin once or in batches of 1000. Live heads/tails tallies, percentages, charts and flip history in a clean probability simulator.",
      },
      { property: "og:title", content: "Interactive Virtual Coin Flipper" },
      {
        property: "og:description",
        content:
          "Animated 3D coin flips with live probability stats, charts and history. Runs entirely in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoinFlipper,
});

type Side = "H" | "T";

const PRESETS = [1, 10, 100, 1000];

function CoinFlipper() {
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);
  const [history, setHistory] = useState<Side[]>([]);
  const [face, setFace] = useState<Side>("H");
  const [spinning, setSpinning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [custom, setCustom] = useState("25");
  const [bias, setBias] = useState(50);
  const [lastResult, setLastResult] = useState<Side | null>(null);
  const spinCount = useRef(0);

  const total = heads + tails;
  const headsPct = total ? (heads / total) * 100 : 50;
  const tailsPct = total ? (tails / total) * 100 : 50;

  const flipBatch = useCallback(
    async (count: number) => {
      if (busy || count < 1) return;
      const n = Math.min(Math.floor(count), 100000);
      setBusy(true);

      let h = 0;
      const results: Side[] = [];
      for (let i = 0; i < n; i++) {
        const s: Side = Math.random() * 100 < bias ? "H" : "T";
        if (s === "H") h++;
        if (i >= n - 20) results.push(s);
      }
      const last = results[results.length - 1] ?? "H";

      if (n === 1) {
        spinCount.current += 5 + (last === "H" ? 0 : 0.5);
        setSpinning(true);
        setFace(last);
        await new Promise((r) => setTimeout(r, 900));
        setSpinning(false);
      } else {
        setSpinning(true);
        spinCount.current += 3;
        setFace(last);
        await new Promise((r) => setTimeout(r, 450));
        setSpinning(false);
      }

      setHeads((p) => p + h);
      setTails((p) => p + (n - h));
      setHistory((p) => [...results, ...p].slice(0, 20));
      setLastResult(last);
      setBusy(false);
    },
    [bias, busy],
  );

  const reset = () => {
    setHeads(0);
    setTails(0);
    setHistory([]);
    setLastResult(null);
  };

  const coinStyle = useMemo(
    () => ({
      transform: `rotateY(${spinCount.current * 360 + (face === "T" ? 180 : 0)}deg)`,
    }),
    [face, spinning],
  );

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:py-14">
      <div className="mx-auto w-full max-w-5xl">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Probability Simulator
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Interactive Virtual <span className="text-primary">Coin Flipper</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Flip once or run thousands of trials and watch the law of large numbers
            pull the ratio toward your set probability.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Coin + controls */}
          <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <div className="flex flex-col items-center">
              <div className="coin-stage">
                <div
                  className={`coin ${spinning ? "coin-spinning" : ""}`}
                  style={coinStyle}
                  aria-live="polite"
                  aria-label={`Coin showing ${face === "H" ? "heads" : "tails"}`}
                >
                  <div className="coin-face coin-heads">
                    <span>H</span>
                  </div>
                  <div className="coin-face coin-tails">
                    <span>T</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 h-7 text-center">
                {lastResult && !spinning && (
                  <p className="animate-fade-in text-sm font-semibold uppercase tracking-widest text-foreground">
                    {lastResult === "H" ? "Heads" : "Tails"}
                  </p>
                )}
              </div>

              <button
                onClick={() => flipBatch(1)}
                disabled={busy}
                className="mt-2 w-full rounded-2xl bg-primary px-8 py-4 text-base font-bold uppercase tracking-wider text-primary-foreground shadow-[var(--shadow-glow)] transition-transform active:scale-[0.98] disabled:opacity-60 sm:w-auto sm:px-14"
              >
                Flip
              </button>

              <div className="mt-6 grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
                {PRESETS.map((n) => (
                  <button
                    key={n}
                    onClick={() => flipBatch(n)}
                    disabled={busy}
                    className="rounded-xl border border-border bg-secondary px-3 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    ×{n}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex w-full gap-2">
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Custom count"
                />
                <button
                  onClick={() => flipBatch(Number(custom) || 0)}
                  disabled={busy}
                  className="shrink-0 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity disabled:opacity-50"
                >
                  Flip batch
                </button>
              </div>

              <div className="mt-6 w-full">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Heads bias</span>
                  <span className="tabular-nums text-foreground">{bias}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={bias}
                  onChange={(e) => setBias(Number(e.target.value))}
                  className="mt-2 w-full accent-[var(--primary)]"
                />
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Heads" value={heads} accent />
              <Stat label="Tails" value={tails} />
              <Stat label="Total" value={total} />
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-baseline justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Distribution
                </h2>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {total} flips
                </span>
              </div>

              <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-[width] duration-500 ease-out"
                  style={{ width: `${headsPct}%` }}
                />
                <div
                  className="h-full bg-chart-2 transition-[width] duration-500 ease-out"
                  style={{ width: `${tailsPct}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <Legend
                  color="bg-primary"
                  label="Heads"
                  pct={headsPct}
                  count={heads}
                />
                <Legend
                  color="bg-chart-2"
                  label="Tails"
                  pct={tailsPct}
                  count={tails}
                />
              </div>

              <div className="mt-6 flex items-end justify-center gap-8">
                <Bar pct={headsPct} className="bg-primary" label="H" />
                <Bar pct={tailsPct} className="bg-chart-2" label="T" />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Last 20 results
              </h2>
              <div className="mt-4 flex min-h-10 flex-wrap gap-2">
                {history.length === 0 && (
                  <p className="text-sm text-muted-foreground">No flips yet.</p>
                )}
                {history.map((s, i) => (
                  <span
                    key={`${i}-${s}`}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      s === "H"
                        ? "bg-primary text-primary-foreground"
                        : "bg-chart-2 text-background"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <button
                onClick={reset}
                className="mt-6 w-full rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-accent"
              >
                Reset stats
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border p-4 text-center shadow-[var(--shadow-soft)] ${
        accent ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"
      }`}
    >
      <p className="text-[0.65rem] font-bold uppercase tracking-widest opacity-70">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black tabular-nums sm:text-3xl">{value}</p>
    </div>
  );
}

function Legend({
  color,
  label,
  pct,
  count,
}: {
  color: string;
  label: string;
  pct: number;
  count: number;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className={`h-3 w-3 shrink-0 rounded-full ${color}`} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {pct.toFixed(1)}% · {count}
        </p>
      </div>
    </div>
  );
}

function Bar({
  pct,
  className,
  label,
}: {
  pct: number;
  className: string;
  label: string;
}) {
  return (
    <div className="flex w-16 flex-col items-center">
      <span className="mb-2 text-xs font-semibold text-muted-foreground tabular-nums">
        {pct.toFixed(0)}%
      </span>
      <div className="flex h-32 w-full items-end rounded-xl bg-muted p-1">
        <div
          className={`w-full rounded-lg transition-[height] duration-500 ease-out ${className}`}
          style={{ height: `${Math.max(pct, 2)}%` }}
        />
      </div>
      <span className="mt-2 text-xs font-bold text-foreground">{label}</span>
    </div>
  );
}

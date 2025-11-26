import { useEffect, useState } from "react";
import { PageContainer } from "./components/layout/PageContainer";
import { fetchHealth } from "./api/healthApi";
import { fetchConfig } from "./api/configApi";
import type { ConfigResponse } from "./types/schedule";

type LoadStatus = "idle" | "loading" | "ok" | "error";

function App() {
  const [healthStatus, setHealthStatus] = useState<LoadStatus>("idle");
  const [healthMessage, setHealthMessage] = useState<string>("");

  const [configStatus, setConfigStatus] = useState<LoadStatus>("idle");
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [configError, setConfigError] = useState<string>("");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setHealthStatus("loading");
        const res = await fetchHealth();
        setHealthStatus("ok");
        setHealthMessage(res.message);
      } catch (error) {
        setHealthStatus("error");
        setHealthMessage(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    const loadConfig = async () => {
      try {
        setConfigStatus("loading");
        const cfg = await fetchConfig();
        setConfig(cfg);
        setConfigStatus("ok");
      } catch (error) {
        setConfigStatus("error");
        setConfigError(
          error instanceof Error ? error.message : "Failed to load config"
        );
      }
    };

    checkHealth();
    loadConfig();
  }, []);

  const footerStatus =
    healthStatus === "loading"
      ? "Checking backend..."
      : healthStatus === "ok"
      ? "Backend connected"
      : healthStatus === "error"
      ? "Backend unreachable"
      : "";

  const footerNode = (
    <span
      className={
        healthStatus === "ok"
          ? "text-emerald-400"
          : healthStatus === "error"
          ? "text-rose-400"
          : "text-slate-400"
      }
    >
      {footerStatus}
    </span>
  );

  return (
    <PageContainer title="Prescription Scheduler" footer={footerNode}>
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold mb-2 text-slate-100">
            System status
          </h2>
          <p className="text-sm text-slate-300">
            Backend health:{" "}
            <span
              className={
                healthStatus === "ok"
                  ? "text-emerald-400"
                  : healthStatus === "error"
                  ? "text-rose-400"
                  : "text-slate-400"
              }
            >
              {healthStatus === "idle"
                ? "not checked"
                : healthStatus === "loading"
                ? "checking..."
                : healthStatus === "ok"
                ? "OK"
                : "error"}
            </span>
          </p>
          {healthMessage && (
            <p className="mt-2 text-xs text-slate-400">
              Message: {healthMessage}
            </p>
          )}

          <p className="mt-4 text-sm text-slate-300">
            Config status:{" "}
            <span
              className={
                configStatus === "ok"
                  ? "text-emerald-400"
                  : configStatus === "error"
                  ? "text-rose-400"
                  : "text-slate-400"
              }
            >
              {configStatus === "idle"
                ? "not loaded"
                : configStatus === "loading"
                ? "loading..."
                : configStatus === "ok"
                ? "loaded"
                : "error"}
            </span>
          </p>
          {configError && (
            <p className="mt-2 text-xs text-rose-400">Error: {configError}</p>
          )}
          {config && (
            <p className="mt-2 text-xs text-slate-400">
              Prescription types: {config.prescriptionTypes.join(", ")}
            </p>
          )}

          <p className="mt-4 text-sm text-slate-300">
            next step = this page will show the prescription input form
            and the generated 14-day schedule. For now, we&apos;re ensuring the
            frontend can read configuration from the backend instead of
            hardcoding it.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}

export default App;

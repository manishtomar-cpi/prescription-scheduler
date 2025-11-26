import { useEffect, useState } from "react";
import { PageContainer } from "./components/layout/PageContainer";
import { fetchHealth } from "./api/healthApi";
import { fetchConfig } from "./api/configApi";
import type {
  ConfigResponse,
  ScheduleRequestPayload
} from "./types/schedule";
import { PrescriptionForm } from "./components/form/PrescriptionForm";
import { useSchedule } from "./hooks/useSchedule";

type LoadStatus = "idle" | "loading" | "ok" | "error";

function App() {
  const [healthStatus, setHealthStatus] = useState<LoadStatus>("idle");
  const [healthMessage, setHealthMessage] = useState<string>("");

  const [configStatus, setConfigStatus] = useState<LoadStatus>("idle");
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [configError, setConfigError] = useState<string>("");

  const {
    schedule,
    status: scheduleStatus,
    error: scheduleError,
    requestId,
    requestSchedule
  } = useSchedule();

  const [lastPayload, setLastPayload] = useState<ScheduleRequestPayload | null>(
    null
  );

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

  const handleFormSubmit = async (payload: ScheduleRequestPayload) => {
    setLastPayload(payload);
    await requestSchedule(payload);
  };

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

          {scheduleStatus !== "idle" && (
            <p className="mt-4 text-xs text-slate-400">
              Schedule status:{" "}
              <span
                className={
                  scheduleStatus === "success"
                    ? "text-emerald-400"
                    : scheduleStatus === "error"
                    ? "text-rose-400"
                    : "text-slate-400"
                }
              >
                {scheduleStatus}
              </span>
              {requestId && (
                <span className="ml-2 text-slate-500">
                  (requestId: {requestId})
                </span>
              )}
            </p>
          )}
          {scheduleError && (
            <p className="mt-1 text-xs text-rose-400">{scheduleError}</p>
          )}
        </div>

        {configStatus === "ok" && config && (
          <PrescriptionForm config={config} onSubmit={handleFormSubmit} />
        )}

        {lastPayload && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
            <div className="font-semibold text-slate-100 mb-2">
              Last valid Stage 1 payload (debug)
            </div>
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(lastPayload, null, 2)}
            </pre>
          </div>
        )}

        {schedule && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
            <div className="font-semibold text-slate-100 mb-2">
              Raw schedule (temporary debug – will be replaced with table)
            </div>
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(schedule, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default App;

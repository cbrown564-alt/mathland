const normaliseError = (error: unknown): { name: string; message: string } => {
  if (error instanceof Error) return { name: error.name.slice(0, 80), message: error.message.slice(0, 300) };
  return { name: "UnknownError", message: String(error).slice(0, 300) };
};

export const reportOperationalError = (error: unknown, context: string): void => {
  if (typeof window === "undefined") return;
  const endpoint = window.__MATHLAND_CONFIG__?.monitoringEndpoint;
  if (!endpoint) return;
  const detail = normaliseError(error);
  void fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ schema: 1, at: new Date().toISOString(), context: context.slice(0, 80), ...detail }),
    keepalive: true,
    credentials: "omit",
    referrerPolicy: "no-referrer",
  }).catch(() => undefined);
};

export const installOperationalMonitoring = (): (() => void) => {
  const onError = (event: ErrorEvent) => reportOperationalError(event.error ?? event.message, "window.error");
  const onRejection = (event: PromiseRejectionEvent) => reportOperationalError(event.reason, "window.unhandledrejection");
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);
  return () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };
};

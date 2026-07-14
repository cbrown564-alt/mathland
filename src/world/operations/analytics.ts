export const ANALYTICS_CONSENT_KEY = "mathland.analytics.consent.v1";

export type AnalyticsConsent = "granted" | "denied";

export type ProductEventName =
  | "horizon_chosen"
  | "journey_step_changed"
  | "evidence_recorded"
  | "detour_started"
  | "detour_resolved"
  | "journey_restored"
  | "legacy_route_redirected";

type ProductEventProperties = Record<string, string | number | boolean | null>;

const allowedPropertyKeys = new Set([
  "from",
  "to",
  "goal",
  "kind",
  "territory",
  "support",
  "detour",
  "legacyRoute",
]);

export const readAnalyticsConsent = (storage: Pick<Storage, "getItem">): AnalyticsConsent =>
  storage.getItem(ANALYTICS_CONSENT_KEY) === "granted" ? "granted" : "denied";

export const writeAnalyticsConsent = (
  storage: Pick<Storage, "setItem">,
  consent: AnalyticsConsent,
): void => storage.setItem(ANALYTICS_CONSENT_KEY, consent);

const sanitiseProperties = (properties: ProductEventProperties): ProductEventProperties => Object.fromEntries(
  Object.entries(properties).filter(([key, value]) => allowedPropertyKeys.has(key)
    && (typeof value === "string" ? value.length <= 80 : true)),
);

export const recordProductEvent = (
  name: ProductEventName,
  properties: ProductEventProperties = {},
): void => {
  if (typeof window === "undefined" || readAnalyticsConsent(window.localStorage) !== "granted") return;
  const endpoint = window.__MATHLAND_CONFIG__?.analyticsEndpoint;
  if (!endpoint) return;
  const payload = JSON.stringify({
    schema: 1,
    name,
    at: new Date().toISOString(),
    properties: sanitiseProperties(properties),
  });
  void fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
    credentials: "omit",
    referrerPolicy: "no-referrer",
  }).catch(() => undefined);
};

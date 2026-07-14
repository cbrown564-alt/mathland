import { ANALYTICS_CONSENT_KEY, readAnalyticsConsent, recordProductEvent, writeAnalyticsConsent } from "./analytics";

describe("production analytics privacy boundary", () => {
  const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>(() => Promise.resolve({ ok: true, status: 202 } as Response));

  beforeEach(() => {
    window.localStorage.clear();
    window.__MATHLAND_CONFIG__ = { analyticsEndpoint: "https://analytics.example/events" };
    fetchMock.mockClear();
    globalThis.fetch = fetchMock as typeof fetch;
  });

  test("is denied by default and transmits nothing", () => {
    expect(readAnalyticsConsent(window.localStorage)).toBe("denied");
    recordProductEvent("journey_step_changed", { from: "entry", to: "observatory" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("sends only allow-listed categorical properties after consent", () => {
    writeAnalyticsConsent(window.localStorage, "granted");
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe("granted");
    recordProductEvent("evidence_recorded", {
      kind: "explained",
      territory: "dot-product",
      support: "cue",
      answer: "learner free text",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = fetchMock.mock.calls[0][1];
    expect(request).toBeDefined();
    const payload = JSON.parse(String(request?.body));
    expect(payload).toMatchObject({ name: "evidence_recorded", properties: { kind: "explained", territory: "dot-product", support: "cue" } });
    expect(payload.properties).not.toHaveProperty("answer");
    expect(request?.credentials).toBe("omit");
  });
});

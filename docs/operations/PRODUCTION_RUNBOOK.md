# Mathland production runbook

Status: **operational contract for the Phase 4 world release**.

## Ownership roles

- **Release owner:** approves preview evidence, production promotion, and rollback.
- **Learning owner:** verifies the evidence, detour, transfer, retrieval, and domain-framing contract.
- **Technical owner:** owns build integrity, monitoring, incident response, and restoration.
- **Support owner:** triages access and journey-recovery reports without requesting answers or unnecessary personal data.

One person may hold several roles, but every release and rollback record names the people or on-call function filling them.

## Environments

- **Local:** Vite development server; endpoints in `runtime-config.js` remain blank.
- **Preview:** immutable release image using non-production analytics/monitoring endpoints and production-equivalent headers.
- **Production:** the same image digest promoted after preview sign-off. Only `/runtime-config.js` differs by environment.

Never rebuild between preview approval and production promotion.

## Release procedure

1. Record the source revision and intended territory/case changes.
2. Run `npm ci` and `npm run quality`.
3. Run `npm run test:e2e` against the built preview.
4. Build the container with `docker build -t mathland:<revision> .`.
5. Start the image and verify `/health.json` returns `200` with `status: ok`.
6. Configure analytics and monitoring endpoints only if the reviewed services are ready. Keep analytics blank otherwise; consent remains off by default.
7. Exercise the critical preview journey at desktop and 320px: choose horizon, notice three meanings, manipulate all sign regions, complete calculation/explanation, normalise, transfer or defer, open Atlas, enter projection, return, reload, and resume.
8. Exercise keyboard-only operation, reduced motion, journey export/restore, deletion, a retired-route redirect, `/privacy`, and `/support`.
9. Confirm there are no new high-severity accessibility violations, client errors, broken media, horizontal overflow, or unexpected network requests.
10. Promote the approved image digest and record the previous digest as the rollback target.

## Monitoring

- Probe `/health.json` at least every minute from outside the hosting boundary.
- Alert on three consecutive health failures, a five-minute client-error rate above 2%, or a critical-journey synthetic failure.
- Track asset and navigation errors separately from learner evidence.
- Product diagnostics never create mastery claims and are read only in aggregate for journey friction, support escalation, detour use, and route migration.
- Retain operational and optional product diagnostics for no more than 30 days.

Blank runtime endpoints are a supported privacy-preserving state. They do not make the learning experience unavailable.

## Incident triage

1. Confirm whether health, initial load, persistence, a mathematical model, a single case, or a media asset is affected.
2. Preserve the currently deployed image and runtime configuration for investigation.
3. If a case has incorrect units, assumptions, or interpretation, remove or roll back that case independently when possible.
4. If evidence can be lost or falsely promoted, stop the release and roll back immediately.
5. If the issue is cosmetic and the complete learning path remains usable, record and fix through the normal release gate.
6. Post a support note that names the affected move and recovery path without exposing learner data.

## Rollback

Rollback is an image promotion, not a rebuild.

1. Restore the previous approved image digest and its compatible runtime configuration.
2. Verify health, root load, exact resume, Atlas, Data, privacy, and support.
3. Confirm the version 3 snapshot still loads. Do not downgrade or rewrite local learner state.
4. Record trigger, start/end time, affected territory/case, evidence risk, and follow-up owner.

The version 3 store can read both prior research schemas, so reverting the UI does not require destructive local-storage intervention.

## Support procedure

Direct learners to `/support`. Ask for the current move, browser version, input/assistive-technology path, and the blocked control. Do not ask for answers, written reasoning, identity documents, or a journey export by default. If the learner chooses to share an export, treat it as learning data and delete it when the case closes.

The first recovery sequence is reload, export, restore, then local deletion only with the learner’s informed choice. Domain unfamiliarity uses deferment or equivalent-context substitution, not a support escalation.

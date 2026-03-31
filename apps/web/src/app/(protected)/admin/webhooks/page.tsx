"use client";

import { useMemo, useState } from "react";
import { useWebhookEndpoints } from "@/modules/webhooks/hooks/use-webhook-endpoints";
import { useCreateWebhookEndpoint } from "@/modules/webhooks/hooks/use-create-webhook-endpoint";
import {
  useDisableWebhookEndpoint,
  useEnableWebhookEndpoint,
  useRotateWebhookSecret,
} from "@/modules/webhooks/hooks/use-webhook-endpoint-actions";
import type { WebhookEvent } from "@/modules/webhooks/types/webhook.types";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { PageTitle } from "@/shared/components/page-title";
import { RoleGuard } from "@/shared/components/role-guard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

const WEBHOOK_EVENT_OPTIONS: WebhookEvent[] = [
  "payment.created",
  "payment.held",
  "payment.captured",
  "payment.canceled",
  "payment.refunded",
  "payment.expired",
];

export default function AdminWebhookEndpointsPage() {
  const [name, setName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [events, setEvents] = useState<WebhookEvent[]>(["payment.created"]);

  const endpointsQuery = useWebhookEndpoints();
  const createMutation = useCreateWebhookEndpoint();
  const enableMutation = useEnableWebhookEndpoint();
  const disableMutation = useDisableWebhookEndpoint();
  const rotateMutation = useRotateWebhookSecret();

  const isBusy =
    createMutation.isPending ||
    enableMutation.isPending ||
    disableMutation.isPending ||
    rotateMutation.isPending;

  const endpointItems = endpointsQuery.data ?? [];

  const selectedEventsText = useMemo(() => events.join(", "), [events]);

  const onToggleEvent = (event: WebhookEvent) => {
    setEvents((prev) => {
      if (prev.includes(event)) {
        const next = prev.filter((item) => item !== event);
        return next.length > 0 ? next : prev;
      }
      return [...prev, event];
    });
  };

  const onCreateEndpoint = () => {
    const trimmedName = name.trim();
    const trimmedTargetUrl = targetUrl.trim();
    if (!trimmedName || !trimmedTargetUrl || events.length === 0) return;

    createMutation.mutate(
      {
        name: trimmedName,
        targetUrl: trimmedTargetUrl,
        eventTypes: events,
      },
      {
        onSuccess: () => {
          setName("");
          setTargetUrl("");
          setEvents(["payment.created"]);
        },
      },
    );
  };

  if (endpointsQuery.isLoading) {
    return <LoadingState label="Loading webhook endpoints..." />;
  }

  if (endpointsQuery.isError) {
    return (
      <ErrorState
        title="Cannot load webhook endpoints"
        description={endpointsQuery.error.message}
      />
    );
  }

  return (
    <RoleGuard allow={["ADMIN"]}>
      <section className="space-y-6">
        <PageTitle
          title="Webhook Endpoints"
          subtitle="Register, enable, disable, and rotate secrets for outbound webhooks"
        />

        <article className="space-y-4 rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
          <h2 className="text-base font-bold text-[#111827]">
            Register endpoint
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                Name
              </label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Payments Production"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                Endpoint URL
              </label>
              <Input
                value={targetUrl}
                onChange={(event) => setTargetUrl(event.target.value)}
                placeholder="https://example.com/webhooks/yubeepay"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
              Events
            </p>
            <div className="flex flex-wrap gap-2">
              {WEBHOOK_EVENT_OPTIONS.map((event) => {
                const active = events.includes(event);
                return (
                  <button
                    key={event}
                    type="button"
                    onClick={() => onToggleEvent(event)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "border-[#1f8265] bg-[#d9f4eb] text-[#0f5f49]"
                        : "border-[#d9deea] bg-white text-[#5b667a] hover:bg-[#e8edf7]"
                    }`}
                  >
                    {event}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#5b667a]">
              Selected: {selectedEventsText}
            </p>
          </div>

          <Button
            type="button"
            onClick={onCreateEndpoint}
            disabled={
              isBusy || !name.trim() || !targetUrl.trim() || events.length === 0
            }
          >
            {createMutation.isPending ? "Creating..." : "Create endpoint"}
          </Button>
        </article>

        <article className="space-y-4 rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#111827]">
              Registered endpoints
            </h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() => endpointsQuery.refetch()}
              disabled={endpointsQuery.isFetching}
            >
              {endpointsQuery.isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {endpointItems.length === 0 ? (
            <EmptyState
              title="No webhook endpoint yet"
              description="Create your first endpoint to receive outbound events."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#d9deea] bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#eef2f8] text-xs uppercase tracking-wider text-[#5b667a]">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Target URL</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Events</th>
                    <th className="px-3 py-2">Secret</th>
                    <th className="px-3 py-2">Deliveries</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {endpointItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#edf1f7] align-top"
                    >
                      <td className="px-3 py-3 font-medium text-[#111827]">
                        {item.name}
                      </td>
                      <td className="px-3 py-3 text-[#334155]">
                        {item.targetUrl}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.status === "ACTIVE"
                              ? "bg-[#d9f4eb] text-[#0f5f49]"
                              : "bg-[#fce1e1] text-[#a02222]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-[#334155]">
                        {item.eventTypes.join(", ")}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-[#334155]">
                        {item.secretHint ?? "-"}
                      </td>
                      <td className="px-3 py-3 text-[#334155]">
                        {item.deliveriesCount}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          {item.status === "ACTIVE" ? (
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-8 px-3 text-xs"
                              disabled={isBusy}
                              onClick={() => disableMutation.mutate(item.id)}
                            >
                              Disable
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="secondary"
                              className="h-8 px-3 text-xs"
                              disabled={isBusy}
                              onClick={() => enableMutation.mutate(item.id)}
                            >
                              Enable
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="secondary"
                            className="h-8 px-3 text-xs"
                            disabled={isBusy}
                            onClick={() =>
                              rotateMutation.mutate({ id: item.id })
                            }
                          >
                            Rotate secret
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </RoleGuard>
  );
}

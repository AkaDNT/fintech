"use client";

import { useMemo, useState } from "react";
import { useWebhookDeliveries } from "@/modules/webhook-deliveries/hooks/use-webhook-deliveries";
import { useWebhookDeliveryDetail } from "@/modules/webhook-deliveries/hooks/use-webhook-delivery-detail";
import { useRetryWebhookDelivery } from "@/modules/webhook-deliveries/hooks/use-retry-webhook-delivery";
import { useReplayDeadDeliveries } from "@/modules/webhook-deliveries/hooks/use-replay-dead-deliveries";
import { useTriggerWebhookRun } from "@/modules/webhook-deliveries/hooks/use-trigger-webhook-run";
import type { WebhookDeliveryStatus } from "@/modules/webhook-deliveries/types/webhook-delivery.types";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import { PageTitle } from "@/shared/components/page-title";
import { RoleGuard } from "@/shared/components/role-guard";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";

export default function AdminWebhookDeliveriesPage() {
  const [status, setStatus] = useState<WebhookDeliveryStatus | "">("");
  const [eventTypeInput, setEventTypeInput] = useState("");
  const [eventType, setEventType] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filters = useMemo(
    () => ({
      status: status || undefined,
      eventType: eventType || undefined,
    }),
    [eventType, status],
  );

  const deliveriesQuery = useWebhookDeliveries(filters);
  const detailQuery = useWebhookDeliveryDetail(selectedId ?? undefined);
  const retryMutation = useRetryWebhookDelivery();
  const replayMutation = useReplayDeadDeliveries();
  const runMutation = useTriggerWebhookRun();

  const deliveries = deliveriesQuery.data ?? [];
  const selectedDelivery = detailQuery.data;

  const isBusy =
    retryMutation.isPending ||
    replayMutation.isPending ||
    runMutation.isPending;

  if (deliveriesQuery.isLoading) {
    return <LoadingState label="Loading webhook deliveries..." />;
  }

  if (deliveriesQuery.isError) {
    return (
      <ErrorState
        title="Cannot load webhook deliveries"
        description={deliveriesQuery.error.message}
      />
    );
  }

  return (
    <RoleGuard allow={["ADMIN"]}>
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <PageTitle
            title="Webhook Deliveries"
            subtitle="Track delivery status, replay dead letters, and manually retry failures"
          />

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={runMutation.isPending}
              onClick={() => runMutation.mutate()}
            >
              {runMutation.isPending ? "Triggering..." : "Run delivery job"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={replayMutation.isPending}
              onClick={() => replayMutation.mutate({})}
            >
              {replayMutation.isPending
                ? "Replaying..."
                : "Replay dead letters"}
            </Button>
          </div>
        </div>

        <article className="space-y-4 rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-full min-w-[180px] flex-1 sm:w-auto">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                Status
              </label>
              <Select
                value={status}
                onChange={(event) =>
                  setStatus(
                    (event.target.value || "") as WebhookDeliveryStatus | "",
                  )
                }
              >
                <option value="">All</option>
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SUCCEEDED">SUCCEEDED</option>
                <option value="FAILED">FAILED</option>
                <option value="DEAD">DEAD</option>
              </Select>
            </div>

            <div className="w-full min-w-[240px] flex-[1.5]">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                Event Type
              </label>
              <Input
                value={eventTypeInput}
                onChange={(event) => setEventTypeInput(event.target.value)}
                placeholder="payment.captured"
              />
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setEventType(eventTypeInput.trim())}
            >
              Apply filters
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setStatus("");
                setEventTypeInput("");
                setEventType("");
              }}
            >
              Reset
            </Button>
          </div>
        </article>

        <article className="space-y-4 rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#111827]">
              Recent deliveries
            </h2>
            <Button
              type="button"
              variant="secondary"
              disabled={deliveriesQuery.isFetching}
              onClick={() => deliveriesQuery.refetch()}
            >
              {deliveriesQuery.isFetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {deliveries.length === 0 ? (
            <EmptyState
              title="No deliveries found"
              description="No webhook delivery matches the current filters."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#d9deea] bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#eef2f8] text-xs uppercase tracking-wider text-[#5b667a]">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Event</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Retries</th>
                    <th className="px-3 py-2">Updated</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#edf1f7] align-top"
                    >
                      <td className="px-3 py-3 font-mono text-xs text-[#334155]">
                        {item.id}
                      </td>
                      <td className="px-3 py-3 text-[#111827]">
                        {item.eventType}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.status === "SUCCEEDED"
                              ? "bg-[#d9f4eb] text-[#0f5f49]"
                              : item.status === "FAILED" ||
                                  item.status === "DEAD"
                                ? "bg-[#fce1e1] text-[#a02222]"
                                : "bg-[#e8edf7] text-[#334155]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[#334155]">
                        {item.attemptCount}
                      </td>
                      <td className="px-3 py-3 text-[#334155]">
                        {new Date(item.updatedAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="h-8 px-3 text-xs"
                            onClick={() => setSelectedId(item.id)}
                          >
                            View
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 px-3 text-xs"
                            disabled={
                              isBusy ||
                              (item.status !== "FAILED" &&
                                item.status !== "DEAD")
                            }
                            onClick={() => retryMutation.mutate(item.id)}
                          >
                            Retry
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

        {selectedId ? (
          <article className="space-y-4 rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[#111827]">
                Delivery detail
              </h2>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setSelectedId(null)}
              >
                Close
              </Button>
            </div>

            {detailQuery.isLoading ? (
              <LoadingState label="Loading delivery detail..." />
            ) : detailQuery.isError ? (
              <ErrorState
                title="Cannot load delivery detail"
                description={detailQuery.error.message}
              />
            ) : selectedDelivery ? (
              <div className="space-y-3 text-sm text-[#334155]">
                <div className="grid gap-2 rounded-xl border border-[#d9deea] bg-white p-3 md:grid-cols-2">
                  <p>
                    <span className="font-semibold text-[#111827]">ID:</span>{" "}
                    {selectedDelivery.id}
                  </p>
                  <p>
                    <span className="font-semibold text-[#111827]">
                      Endpoint:
                    </span>{" "}
                    {selectedDelivery.endpointId}
                  </p>
                  <p>
                    <span className="font-semibold text-[#111827]">
                      Status code:
                    </span>{" "}
                    {selectedDelivery.lastHttpStatus ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-[#111827]">Error:</span>{" "}
                    {selectedDelivery.lastError ?? "-"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                    Payload
                  </p>
                  <pre className="max-h-72 overflow-auto rounded-xl border border-[#d9deea] bg-white p-3 text-xs">
                    {JSON.stringify(selectedDelivery.payload, null, 2)}
                  </pre>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5b667a]">
                    Response body
                  </p>
                  <pre className="max-h-60 overflow-auto rounded-xl border border-[#d9deea] bg-white p-3 text-xs">
                    {selectedDelivery.responseBody || "-"}
                  </pre>
                </div>
              </div>
            ) : null}
          </article>
        ) : null}
      </section>
    </RoleGuard>
  );
}

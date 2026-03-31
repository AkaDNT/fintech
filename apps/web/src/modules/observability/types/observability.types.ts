export interface ObservabilitySummary {
  outbox: {
    pending: number;
  };
  delivery: {
    failed: number;
    dead: number;
  };
  inbox: {
    failed: number;
  };
  generatedAt: string;
}

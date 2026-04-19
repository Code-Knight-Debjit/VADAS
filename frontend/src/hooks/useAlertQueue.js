import { useEffect } from "react";
import api from "../api/client";
import { readQueue, writeQueue } from "../lib/storage";

export function useAlertQueue(online) {
  useEffect(() => {
    if (!online) {
      return;
    }

    async function flushQueue() {
      const queued = readQueue();
      if (!queued.length) {
        return;
      }

      const remaining = [];

      for (const item of queued) {
        try {
          const created = await api.post("/alerts", item.payload);
          await api.post(`/alerts/${created.data._id}/send`);
        } catch (error) {
          remaining.push(item);
        }
      }

      writeQueue(remaining);
    }

    flushQueue();
  }, [online]);
}

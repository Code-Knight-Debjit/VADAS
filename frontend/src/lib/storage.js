const QUEUE_KEY = "vehicle-alert-offline-queue";
const LAST_LOCATION_KEY = "vehicle-alert-last-location";

export function readQueue() {
  return JSON.parse(window.localStorage.getItem(QUEUE_KEY) || "[]");
}

export function writeQueue(entries) {
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(entries));
}

export function enqueueAlert(payload) {
  const queue = readQueue();
  const id = crypto.randomUUID();
  queue.push({ id, ...payload, queuedAt: new Date().toISOString() });
  writeQueue(queue);
  return id;
}

export function removeQueuedAlert(queueId) {
  const queue = readQueue().filter((item) => item.id !== queueId);
  writeQueue(queue);
}

export function saveLastLocation(location) {
  window.localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify({
    ...location,
    savedAt: new Date().toISOString()
  }));
}

export function readLastLocation() {
  return JSON.parse(window.localStorage.getItem(LAST_LOCATION_KEY) || "null");
}

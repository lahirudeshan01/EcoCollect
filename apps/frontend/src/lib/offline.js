// Simple IndexedDB-based offline queue for scan records.
// Minimal promise wrapper for storing pending scans and syncing when online.

function openDB() {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open('ecocollect_offline_v1', 1);
    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains('scans')) {
        db.createObjectStore('scans', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('scans', mode);
    const store = tx.objectStore('scans');
    let done = false;
    tx.oncomplete = () => { if (!done) resolve(); };
    tx.onerror = () => reject(tx.error || new Error('Transaction error'));
    try {
      const result = fn(store);
      // If fn returns a request, wire its events
      if (result && typeof result.onsuccess !== 'undefined') {
        result.onsuccess = (e) => { done = true; resolve(e.target.result); };
        result.onerror = (e) => { done = true; reject(e.target.error); };
      } else if (result instanceof Promise) {
        result.then((r) => { done = true; resolve(r); }).catch((err) => { done = true; reject(err); });
      } else if (typeof result !== 'undefined') {
        done = true; resolve(result);
      }
    } catch (err) {
      reject(err);
    }
  });
}

export async function saveScan(scan) {
  return withStore('readwrite', (store) => store.add(scan));
}

export async function getAllScans() {
  return withStore('readonly', (store) => new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}

export async function deleteScan(id) {
  return withStore('readwrite', (store) => store.delete(id));
}

// Attempt to POST pending scans to backend; delete on success.
export async function syncPendingScans() {
  const scans = await getAllScans();
  if (!scans.length) return { synced: 0 };
  let synced = 0;
  for (const s of scans) {
    try {
      // Try to POST to backend; adjust URL as needed
      const res = await fetch('/api/collections/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s.payload || s),
      });
      if (res.ok) {
        await deleteScan(s.id);
        synced += 1;
      }
    } catch (e) {
      // network error — stop and return
      console.warn('syncPendingScans network error', e);
      return { synced };
    }
  }
  return { synced };
}

export function initOfflineSync(options = {}) {
  const intervalMs = options.intervalMs || 30_000; // periodic attempt
  // Try to sync when back online
  window.addEventListener('online', () => {
    // fire and forget
    syncPendingScans().then((r) => console.log('Offline sync ononline result', r)).catch((e) => console.warn(e));
  });
  // Periodic sync while app is open
  const id = setInterval(() => {
    if (navigator.onLine) syncPendingScans().catch(() => {});
  }, intervalMs);
  return () => clearInterval(id);
}

export default { saveScan, getAllScans, deleteScan, syncPendingScans, initOfflineSync };

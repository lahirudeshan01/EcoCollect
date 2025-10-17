// Simple IndexedDB-backed offline queue for scan payloads
const DB_NAME = 'ecocollect_offline';
const STORE_NAME = 'scans';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    let finished = false;
    tx.oncomplete = () => { finished = true; resolve(); };
    tx.onerror = () => reject(tx.error || new Error('Transaction error'));
    try { fn(store); } catch (e) { reject(e); }
  });
}

export async function addScan(scan) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.add({ ...scan, createdAt: new Date().toISOString() });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllScans() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteScan(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getQueueLength() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.count();
    req.onsuccess = () => resolve(req.result || 0);
    req.onerror = () => reject(req.error);
  });
}

export async function syncAll(endpoint = '/api/collections/scan') {
  const items = await getAllScans();
  const results = [];
  for (const item of items) {
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ binId: item.binId, collectorId: item.collectorId, weight: item.weight, timestamp: item.timestamp || item.createdAt }),
      });
      if (resp.ok) {
        await deleteScan(item.id);
        results.push({ id: item.id, status: 'synced' });
      } else {
        results.push({ id: item.id, status: 'failed', statusCode: resp.status });
      }
    } catch (e) {
      results.push({ id: item.id, status: 'error', error: e.message });
    }
  }
  return results;
}

// Auto-sync when the browser comes back online
if (typeof window !== 'undefined' && 'addEventListener' in window) {
  window.addEventListener('online', () => {
    // Try to sync in background; ignore results
    syncAll().then((r) => console.log('offlineQueue.syncAll result', r)).catch((e) => console.warn('offline sync failed', e));
  });
}

export default { addScan, getAllScans, deleteScan, getQueueLength, syncAll };

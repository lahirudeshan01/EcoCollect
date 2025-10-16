import React, { useRef, useEffect, useState } from 'react';
import offline, { saveScan, syncPendingScans, initOfflineSync } from '../lib/offline';

export default function ScanQR() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [message, setMessage] = useState('Initializing camera...');
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const stopSync = initOfflineSync({ intervalMs: 20000 });
    let stream;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
          await videoRef.current.play();
          requestAnimationFrame(() => { doTick(); });
          setMessage('Point the camera at a QR code');
        }
      } catch (err) {
        console.error(err);
        setMessage('Camera access denied or not available');
      }
    };

    const doTick = async () => {
      if (!scanning) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const width = video.videoWidth;
        const height = video.videoHeight;
        if (width === 0 || height === 0) {
          requestAnimationFrame(() => { doTick(); });
          return;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        try {
          const imageData = ctx.getImageData(0, 0, width, height);
          // jsQR is expected to be available on window.jsQR via CDN
          const code = window.jsQR ? window.jsQR(imageData.data, width, height) : null;
          if (code) {
            setMessage('QR detected: ' + code.data);
            setScanning(false);
            const payload = { binId: code.data, collectorId: 'web-collector', timestamp: new Date().toISOString() };
            // Try to POST immediately; if fails, save offline
            try {
              const res = await fetch('/api/collections/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
              if (!res.ok) throw new Error('Network response not ok');
              setMessage('Scan submitted');
            } catch (err) {
              // Save locally for later sync
              await saveScan({ payload });
              setMessage('Saved offline — will sync when online');
            }
          }
        } catch (e) {
          // imageData may throw if canvas tainted; ignore gracefully
        }
      }
      requestAnimationFrame(() => { doTick(); });
    };

    start();

    return () => {
      setScanning(false);
      stopSync && stopSync();
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [scanning]);

  // Optional: UI action to force sync now
  const handleSyncNow = async () => {
    setMessage('Syncing pending...');
    const r = await syncPendingScans();
    setMessage('Synced ' + (r.synced || 0) + ' scans');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-6">
      <h2 className="text-2xl font-semibold mb-4">Scan QR Code</h2>

      <div className="w-full max-w-xl bg-gray-50 rounded-lg p-4 border">
        <div className="relative" style={{paddingTop: '56.25%'}}>
          <video ref={videoRef} style={{position: 'absolute', top:0, left:0, width:'100%', height:'100%'}} />
          <canvas ref={canvasRef} style={{display: 'none'}} />
        </div>

        <div className="mt-4">
          <div className="text-sm text-gray-600">{message}</div>
          <div className="mt-3 flex gap-3">
            <button onClick={() => { setScanning(true); setMessage('Resuming scan...'); }} className="px-3 py-1 rounded bg-emerald-600 text-white">Resume</button>
            <button onClick={() => { setScanning(false); setMessage('Scan stopped'); }} className="px-3 py-1 rounded border">Stop</button>
            <button onClick={handleSyncNow} className="px-3 py-1 rounded border">Sync Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

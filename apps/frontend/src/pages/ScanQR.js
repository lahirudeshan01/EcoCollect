import React, { useEffect, useRef, useState } from 'react';
import { addScan, getQueueLength, syncAll, getAllScans } from '../lib/offlineQueue';

export default function ScanQR() {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [scanning, setScanning] = useState(false);
	const [lastResult, setLastResult] = useState(null);
	const [queueLength, setQueueLength] = useState(0);

	useEffect(() => {
		// load current queue length
		(async () => {
			try {
				const len = await getQueueLength();
				setQueueLength(len);
			} catch (e) {
				console.warn('failed to read queue length', e);
			}
		})();

		let animationId;
		let stream;

		async function start() {
			setScanning(true);
			try {
				stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
				if (videoRef.current) videoRef.current.srcObject = stream;
				if (videoRef.current) await videoRef.current.play();

				const canvas = canvasRef.current;
				const ctx = canvas.getContext('2d');

				const tick = async () => {
					if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
						animationId = requestAnimationFrame(tick);
						return;
					}
					canvas.width = videoRef.current.videoWidth;
					canvas.height = videoRef.current.videoHeight;
					ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

					try {
						const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
						const code = window.jsQR ? window.jsQR(imageData.data, imageData.width, imageData.height) : null;
						if (code && code.data) {
							if (code.data !== lastResult) {
								setLastResult(code.data);
								const payload = { binId: code.data, collectorId: 'FRONTEND-TEST-01' };
								try {
									const resp = await fetch('/api/collections/scan', {
										method: 'POST',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify(payload),
									});
									if (!resp.ok) throw new Error('server error ' + resp.status);
								} catch (err) {
									console.warn('post scan failed, saving offline', err);
									try { await addScan(payload); } catch (err2) { console.error('addScan failed', err2); }
								} finally {
									try { const len = await getQueueLength(); setQueueLength(len); } catch (e) {}
								}
							}
						}
					} catch (e) {
						// ignore frame errors
					}

					animationId = requestAnimationFrame(tick);
				};

				tick();
			} catch (err) {
				console.error('camera start failed', err);
			}
		}

		start();

		return () => {
			setScanning(false);
			if (animationId) cancelAnimationFrame(animationId);
			if (stream) stream.getTracks().forEach((t) => t.stop());
		};
	}, [lastResult]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-start p-6">
				<div className="w-full flex items-center justify-between mb-4">
					<h2 className="text-2xl font-semibold">Scan QR (Collection Staff)</h2>
					<button onClick={()=> { window.location.hash = '#/'; }} className="px-3 py-2 rounded border">Back</button>
				</div>
			<div className="w-full max-w-xl bg-white rounded-lg shadow p-4">
				<div className="relative" style={{ paddingTop: '56.25%' }}>
					<video ref={videoRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 8 }} muted playsInline />
					<canvas ref={canvasRef} style={{ display: 'none' }} />
				</div>

				<div className="mt-4">
					<div className="text-sm text-gray-600">Status: {scanning ? 'Camera active' : 'Stopped'}</div>
					<div className="mt-2">Last QR data: <span className="font-mono">{lastResult || '—'}</span></div>
					<div className="mt-2">Offline queue: <span className="font-semibold">{queueLength}</span></div>
					<div className="mt-3 flex gap-2">
						<button className="px-3 py-2 rounded border" onClick={async ()=>{ const res = await syncAll(); console.log('syncAll',res); const len = await getQueueLength(); setQueueLength(len); }}>Sync Now</button>
						<button className="px-3 py-2 rounded border" onClick={async ()=>{ const all = await getAllScans(); console.log('pending scans', all); alert('Pending: ' + all.length); }}>Show Pending</button>
					</div>
					<div className="mt-3 text-xs text-gray-500">Scanned data is posted to <code>/api/collections/scan</code> with a test collector id. If offline, scans are queued locally and auto-synced when online.</div>
				</div>
			</div>
		</div>
	);
}

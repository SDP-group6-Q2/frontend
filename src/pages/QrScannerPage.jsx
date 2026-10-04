import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { getMachines } from '../api/machinesApi';

function extractMachineId(value) {
  try {
    const url = new URL(value);

    const match = url.pathname.match(/\/machines\/([^/]+)/);

    if (match) {
      return decodeURIComponent(match[1]);
    }

    return (
      url.searchParams.get('machine_id') ||
      url.searchParams.get('machineId')
    );
  } catch {
    return value.trim();
  }
}

export default function QrScannerPage() {
  const video = useRef(null);
  const navigate = useNavigate();

  const [manual, setManual] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    return () => {
      const stream = video.current?.srcObject;

      stream
        ?.getTracks()
        .forEach((track) => track.stop());
    };
  }, []);

  async function openMachine(rawValue) {
    const machineId = extractMachineId(rawValue);

    if (!machineId) {
      return;
    }

    try {
      const machines = await getMachines();

      const machineExists = machines.some(
        (machine) => machine.id === machineId,
      );

      if (!machineExists) {
        setError(
          'This machine is not associated with your company.',
        );
        return;
      }

      navigate(
        `/machines/${encodeURIComponent(machineId)}`,
      );
    } catch (error) {
      setError(error.message);
    }
  }

  async function start() {
    setError('');

    if (!('BarcodeDetector' in window)) {
      setError(
        'QR scanning is not supported by this browser. Enter the machine ID below.',
      );
      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
          },
        });

      video.current.srcObject = stream;

      await video.current.play();

      setScanning(true);

      const detector = new BarcodeDetector({
        formats: ['qr_code'],
      });

      const scan = async () => {
        if (
          !video.current ||
          !video.current.srcObject
        ) {
          return;
        }

        const codes = await detector.detect(
          video.current,
        );

        if (codes[0]?.rawValue) {
          stream
            .getTracks()
            .forEach((track) => track.stop());

          setScanning(false);

          openMachine(codes[0].rawValue);
          return;
        }

        requestAnimationFrame(scan);
      };

      scan();
    } catch {
      setError(
        'Camera access is unavailable. Enter the machine ID below.',
      );
    }
  }

  return (
    <div>
      <section className="page-header">
        <div className="page-container">
          <p className="page-eyebrow">
            Quick access
          </p>

          <h1>QR Scanner</h1>

          <p>
            Scan a machine QR code to open its overview.
          </p>
        </div>
      </section>

      <section className="feature-section">
        <div className="page-container qr-layout">
          <div className="qr-camera">
            <video
              ref={video}
              muted
              playsInline
            />

            <button
              className="primary-button"
              onClick={start}
              disabled={scanning}
            >
              {scanning
                ? 'Scanning…'
                : 'Start camera'}
            </button>
          </div>

          <form
            className="qr-manual"
            onSubmit={(event) => {
              event.preventDefault();
              openMachine(manual);
            }}
          >
            <h2>Enter machine ID</h2>

            <p>
              You can also open a machine manually.
            </p>

            <input
              value={manual}
              onChange={(event) =>
                setManual(event.target.value)
              }
              placeholder="Machine ID"
              required
            />

            <button className="secondary-button">
              Open machine
            </button>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

export function CameraScanner({
  open,
  onClose,
  onScan,
}: {
  open: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}) {
  const [error, setError] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!open) return;
    setError("");

    // Initialize Html5Qrcode
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            // qrbox is optional. We leave it out to scan the whole frame.
          },
          (decodedText) => {
            // Success callback!
            if (scannerRef.current && scannerRef.current.isScanning) {
              scannerRef.current.stop().then(() => {
                scannerRef.current?.clear();
                onScan(decodedText);
              }).catch(() => {
                onScan(decodedText);
              });
            }
          },
          (errorMessage) => {
            // parse errors are constantly thrown when no barcode is in front of camera
          }
        );
      } catch (err: any) {
        console.error("Camera error:", err);
        setError("Failed to start camera. Please ensure permissions are granted.");
      }
    };

    // Small delay to ensure the DOM element #reader is fully mounted
    const timer = setTimeout(() => {
      startScanner();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          scannerRef.current?.clear();
        }).catch(console.error);
      }
    };
  }, [open, onScan]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-50">
        <h2 className="text-white text-lg font-bold">Scan Barcode</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Video Feed */}
      <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* The target ID required by html5-qrcode */}
        <div id="reader" className="w-full h-full object-cover"></div>
        
        {/* Scanner target overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 border-2 border-white/60 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] z-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red-500 z-20 shadow-[0_0_12px_rgba(239,68,68,1)] pointer-events-none"></div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 to-transparent z-50">
        <p className="text-sm text-white/80 text-center mb-4">
          Hold the phone steady. Ensure the barcode is bright and clear.
        </p>
        {error && <p className="text-sm text-red-400 font-bold mb-4">{error}</p>}
        <Button variant="secondary" onClick={onClose} className="w-full max-w-sm rounded-full py-6 text-lg">
          Cancel Scanner
        </Button>
      </div>
    </div>
  );
}

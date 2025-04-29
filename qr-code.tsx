
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export function QRCodeDisplay() {
  const [qrUrl, setQrUrl] = useState('');
  
  useEffect(() => {
    const generateQR = async () => {
      try {
        // Get the current window location
        const url = window.location.href;
        const qr = await QRCode.toDataURL(url);
        setQrUrl(qr);
      } catch (err) {
        console.error(err);
      }
    };
    generateQR();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h3 className="text-lg font-semibold">Scan to open on your phone</h3>
      {qrUrl && <img src={qrUrl} alt="QR Code" className="w-48 h-48" />}
    </div>
  );
}

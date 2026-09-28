import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor configuration for Athena Voice AI Co-Teacher.
 *
 * Loads the live Next.js web application via `server.url`.
 * Can be overridden with the `CAPACITOR_SERVER_URL` or `NEXT_PUBLIC_WEB_URL` environment variables.
 *
 * For local Android Emulator testing: http://10.0.2.2:3000
 * For physical device testing over LAN: http://<YOUR_LAN_IP>:3000 (e.g., http://192.168.1.10:3000)
 * For Cloudflare Tunnel testing: https://<tunnel-id>.trycloudflare.com
 */
const serverUrl =
  process.env.CAPACITOR_SERVER_URL ||
  process.env.NEXT_PUBLIC_WEB_URL ||
  'http://10.0.2.2:3000';

const config: CapacitorConfig = {
  appId: 'com.athena.coteacher',
  appName: 'Athena',
  webDir: 'www',
  server: {
    url: serverUrl,
    cleartext: true,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
};

export default config;

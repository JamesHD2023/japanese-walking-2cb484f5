import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3739aceac90841eaa2856c4b1ba05a27',
  appName: 'japanese-walking',
  webDir: 'dist',
  server: {
    url: 'https://3739acea-c908-41ea-a285-6c4b1ba05a27.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
  },
};

export default config;
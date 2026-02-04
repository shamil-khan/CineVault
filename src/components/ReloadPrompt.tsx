// src/components/ReloadPrompt.tsx
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (needRefresh) {
      toast('Update Available', {
        description: 'A new version is available for a better experience.',
        duration: Infinity, // Keep open until user acts
        action: {
          label: 'Update',
          onClick: () => updateServiceWorker(true),
        },
        cancel: {
          label: 'Dismiss',
          onClick: () => setNeedRefresh(false),
        },

        // Native iOS styling using Tailwind v4 classes
        className: `
    mt-[env(safe-area-inset-top)] 
    mx-4 
    rounded-[28px] 
    bg-white/70 
    dark:bg-zinc-900/70 
    backdrop-blur-xl 
    border border-white/20 
    shadow-[0_10px_40px_rgba(0,0,0,0.15)]
    text-zinc-900 
    dark:text-white
  `,
      });
    }
  }, [needRefresh, updateServiceWorker, setNeedRefresh]);

  useEffect(() => {
    // Check for updates whenever the app comes back to foreground
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        updateServiceWorker();
      }
    };

    window.addEventListener('visibilitychange', handleVisibility);
    return () =>
      window.removeEventListener('visibilitychange', handleVisibility);
  }, [updateServiceWorker]);

  return null; // This component handles side effects only
}

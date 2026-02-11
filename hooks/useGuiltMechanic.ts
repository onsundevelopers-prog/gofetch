
import { useEffect, useRef } from 'react';
import { NotificationService } from '../services/notificationService';

export const useGuiltMechanic = () => {
    const abandonmentTimeout = useRef<any>(null);
    const originalTitle = useRef(document.title);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                // User left the tab
                document.title = "⚠️ Leaving already?";

                // Start a timer. If they stay away for 30 seconds, poke them.
                abandonmentTimeout.current = setTimeout(() => {
                    NotificationService.pokeUser('abandonment');
                    document.title = "❌ Procrastination Detected";
                }, 30000); // 30 seconds of abandonment
            } else {
                // User came back
                if (abandonmentTimeout.current) {
                    clearTimeout(abandonmentTimeout.current);
                    abandonmentTimeout.current = null;
                }

                // Brief "welcome back" roast in the title before resetting
                document.title = "Back to work, finally.";
                setTimeout(() => {
                    document.title = originalTitle.current;
                }, 3000);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (abandonmentTimeout.current) clearTimeout(abandonmentTimeout.current);
        };
    }, []);
};


import { useEffect, useRef } from 'react';
import { NotificationService } from '../services/notificationService';

export const useNotifications = (planEvents: any[]) => {
    const lastNotifiedBlock = useRef<string | null>(null);

    useEffect(() => {
        const checkSchedule = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const timeString = `${currentHour.toString().padStart(2, '0')}:00`;

            const currentEvent = planEvents.find(e => e.start === timeString);

            if (currentEvent) {
                const eventKey = `${currentEvent.id || currentEvent.title}_${currentHour}`;
                if (lastNotifiedBlock.current !== eventKey) {
                    NotificationService.pokeUser(
                        currentEvent.type === 'deep-work' ? 'deep-work' : 'reminder',
                        `Block: ${currentEvent.title}`
                    );
                    lastNotifiedBlock.current = eventKey;
                }
            } else if (now.getMinutes() < 5) {
                const hourKey = `hourly_${currentHour}`;
                if (lastNotifiedBlock.current !== hourKey) {
                    NotificationService.pokeUser('reminder');
                    lastNotifiedBlock.current = hourKey;
                }
            }
        };

        const interval = setInterval(checkSchedule, 30000);
        checkSchedule();

        return () => clearInterval(interval);
    }, [planEvents]);
};

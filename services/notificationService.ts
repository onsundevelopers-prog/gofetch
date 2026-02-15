
export const NotificationService = {
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('This browser does not support desktop notifications');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    },

    async sendNotification(title: string, body: string) {
        if (Notification.permission === 'granted') {
            const registration = await navigator.serviceWorker.ready;
            if (registration) {
                registration.showNotification(title, {
                    body,
                    silent: false,
                });
            } else {
                new Notification(title, {
                    body,
                    silent: false,
                });
            }
        }
    },

    // Savage "Fetch" style notifications
    pokeUser(type: 'deep-work' | 'slacking' | 'reminder' | 'abandonment', context?: string) {
        const pokes = {
            'deep-work': [
                "Time for Deep Work. No excuses, just output.",
                "Your deep work block starts now. Lock in.",
                "The world is noisy. Go silent for a bit."
            ],
            'slacking': [
                "I smell procrastination. Get back to it.",
                "Your score is dropping. Do something about it.",
                "Excuses don't build empires. Action does."
            ],
            'reminder': [
                "Did you do what you said you'd do?",
                "Checking in. Are we winning today?",
                "Don't let the day win. You win the day."
            ],
            'abandonment': [
                "Where are you going? The work isn't done.",
                "Leaving already? Average people quit when it gets hard.",
                "I'm still watching. Your distraction just cost you points.",
                "Oh, look. Someone found something shinier than their future."
            ]
        };

        const messages = pokes[type];
        const message = messages[Math.floor(Math.random() * messages.length)];

        this.sendNotification("Fetch says...", context || message);
    }
};


export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    target?: string; // CSS selector
    path?: string; // Path to navigate to
    requiredAction?: (data: any) => boolean; // Function to check if action completed
    actionHint?: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 'welcome',
        title: 'Welcome to GoFetch',
        description: 'The ultimate momentum-based habit tracker. I\'m Charlie, and I\'m here to help you scale your potential.',
        path: '/',
    },
    {
        id: 'dashboard',
        title: 'The Dashboard',
        description: 'This is your central command. You\'ll see your daily overview and momentum progress here.',
        path: '/',
    },
    {
        id: 'momentum',
        title: 'Momentum Score',
        description: 'Your score represents your consistency. Keep it high by completing tasks!',
        target: '#momentum-score-card',
        path: '/',
    },
    {
        id: 'plan_nav',
        title: 'Plan Your Day',
        description: 'Let\'s head over to the Plan section to organize your daily routine.',
        target: '#nav-plan',
        path: '/plan',
    },
    {
        id: 'add_plan',
        title: 'Set Your First Task',
        description: 'Click the "+" button to add an activity to your schedule. Go ahead, I\'ll wait.',
        target: '#add-plan-button',
        path: '/plan',
        requiredAction: (data) => data.planEventsCount > 0,
        actionHint: 'Add at least one item to your plan to continue.',
    },
    {
        id: 'goals_nav',
        title: 'Visionary Goals',
        description: 'Success starts with clear goals. Let\'s move to the Goals section.',
        target: '#nav-goals',
        path: '/goals',
    },
    {
        id: 'add_goal',
        title: 'Define Your Future',
        description: 'Type a big goal and press Enter. Aim high!',
        target: '#goal-input-container',
        path: '/goals',
        requiredAction: (data) => data.goalsCount > 0,
        actionHint: 'Create at least one goal to continue.',
    },
    {
        id: 'potential_nav',
        title: 'Your Potential',
        description: 'See how your habits translate into real-world progress in the Potential view.',
        target: '#nav-potential',
        path: '/potential',
    },
    {
        id: 'analytics_nav',
        title: 'Deep Analytics',
        description: 'Monitor your streaks and data over time to stay on track.',
        target: '#nav-analytics',
        path: '/analytics',
    },
    {
        id: 'chat_nav',
        title: 'Charlie AI',
        description: 'Need advice or a routine refresh? Chat with me anytime.',
        target: '#nav-chat',
        path: '/chat',
    },
    {
        id: 'settings_nav',
        title: 'Your Profile',
        description: 'You can manage your account and restart this tutorial in Settings.',
        target: '#nav-settings',
        path: '/',
    },
    {
        id: 'finish',
        title: 'Ready to Fetch?',
        description: 'You\'re all set to dominate your day. Good luck, Explorer!',
        path: '/',
    },
];

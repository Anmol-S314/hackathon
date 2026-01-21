
export const HACKATHON_CONFIG = {
    // Top Level Toggles
    IS_REGISTRATION_OPEN: true, // Set to false to manually close registrations

    // Dates
    HACKATHON_DATE: '2026-02-10T09:00:00', // Target date for countdown
    REGISTRATION_DEADLINE: '2026-02-09T23:59:59', // Optional: Auto-close date

    // Contact & Socials
    CONTACT_EMAIL: 'info@datavex.ai',
    COMPANY_NAME: 'VexStorm', // or DataVex
    SOCIAL_LINKS: {
        LINKEDIN: 'https://www.linkedin.com/company/datavexai-pvt-ltd/?originalSubdomain=in',
    },

    // Location
    LOCATION: {
        NAME: 'TCE Skill Labs, Sahyadri College, Mangalore',
        MAP_EMBED_URL: 'https://maps.google.com/maps?q=Sahyadri+College+of+Engineering+%26+Management,+Mangalore&t=&z=15&ie=UTF8&iwloc=&output=embed'
    }
};

/**
 * specific helper to check if registration is active based on config and time.
 */
export function isRegistrationActive(): boolean {
    if (!HACKATHON_CONFIG.IS_REGISTRATION_OPEN) return false;

    // Optional: Auto-close check
    // const now = new Date();
    // const deadline = new Date(HACKATHON_CONFIG.REGISTRATION_DEADLINE);
    // if (now > deadline) return false;

    return true;
}


export const HACKATHON_CONFIG = {
    // Top Level Toggles
    IS_REGISTRATION_OPEN: true, // Set to false to manually close registrations
    HACKATHON_PHASE: 'PHASE_1', // 'PHASE_1', 'SELECTION', 'PHASE_2'
    SHOW_PHASE_2_RESULTS: false, // Set to true to show the selected 60 teams section

    // Dates
    HACKATHON_DATE: '2026-02-21T09:00:00', // Target date for countdown
    REGISTRATION_DEADLINE: '2026-02-11T23:59:59', // Optional: Auto-close date

    // Timeline Display Dates
    TIMELINE: {
        REGISTRATION: 'NOW - FEB 11',
        DEVELOPMENT: 'FEB 12 - FEB 15',
        FINALE: 'FEB 21 - FEB 22'
    },

    // Contact & Socials
    CONTACT_EMAIL: 'info@datavex.ai',
    COMPANY_NAME: 'VexStorm', // or DataVex
    SOCIAL_LINKS: {
        LINKEDIN: 'https://www.linkedin.com/company/datavexai-pvt-ltd/?originalSubdomain=in',
    },

    // Phase 2 Data (Future Proofing)
    PHASE_2_TEAMS_LINK: 'https://docs.google.com/presentation/d/your-template-link-here/edit?usp=sharing', // Link to a PDF or Sheet with 60 selected teams
    PPT_TEMPLATE_LINK: 'https://docs.google.com/presentation/d/1cjw4qvC81f7wGc8u_nMacxcPz-oR_3xX/edit?usp=sharing&ouid=112636361630830687880&rtpof=true&sd=true', // Link to the PPT template
    // ANNOUNCEMENT_BANNER: 'PHASE 1 REGISTRATIONS CLOSING SOON!- SECURE YOUR SPOT NOW', // Custom text for Phase 2 announcement
    ANNOUNCEMENT_BANNER: '',

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

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Info, Loader2, ChevronDown, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SiliconBeachBackground from './SiliconBeachBackground';
import { isRegistrationActive, HACKATHON_CONFIG } from '../config';
import AnnouncementPost from './AnnouncementPost';

// ... (existing types remain unchanged)

// Types & Constants
type FormStep = 'info' | 'details';

interface PersonInfo {
    name: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    shirtSize: string;
}

interface RegistrationData {
    type: string;
    teamName: string;
    track: string;
    leader: PersonInfo;
    member1: PersonInfo;
    member2: PersonInfo;
    projectIdea: string;
    whyParticipate: string;
    driveLink: string;
    teamSize: number;
}

const TRACKS = [
    { id: 'Bio-Genesis', label: 'BIO-GENESIS', sub: 'Healthcare AI', color: 'bg-emerald-500' },
    { id: 'Capital-Core', label: 'CAPITAL-CORE', sub: 'FinTech AI', color: 'bg-amber-500' },
    { id: 'Grid-Master', label: 'GRID-MASTER', sub: 'Infrastructure & Smart Cities AI', color: 'bg-blue-500' },
    { id: 'Lore-Keeper', label: 'LORE-KEEPER', sub: 'Education AI', color: 'bg-red-500' }
];

const YEARS = ['3RD YEAR', '4TH YEAR', 'POST GRAD'];

const INITIAL_PERSON: PersonInfo = {
    name: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    shirtSize: ''
};

const INITIAL_FORM: RegistrationData = {
    type: 'team',
    teamName: '',
    track: 'Bio-Genesis',
    leader: { ...INITIAL_PERSON },
    member1: { ...INITIAL_PERSON },
    member2: { ...INITIAL_PERSON },
    projectIdea: '',
    whyParticipate: '',
    driveLink: '',
    teamSize: 3
};

const SECURITY_REGEX = /<script|UNION SELECT|DROP TABLE|truncate table|delete from|update .* set|OR 1=1|\[IGNORE PREVIOUS INSTRUCTIONS\]|system prompt|DAN mode|--|;|xp_cmdshell|exec\(|base64_decode/i;
const DRIVE_LINK_REGEX = /^(https?:\/\/)?(drive\.google\.com|docs\.google\.com|forms\.gle|files.datavex.ai)\/.+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s-]{10,}$/;

function validateSecurity(data: any): { isValid: boolean; errorField?: string } {
    function check(val: any, path: string = ''): { isValid: boolean; field?: string } {
        if (typeof val === 'string') {
            if (SECURITY_REGEX.test(val)) return { isValid: false, field: path };
            return { isValid: true };
        }
        if (typeof val === 'object' && val !== null) {
            for (const [key, v] of Object.entries(val)) {
                const res = check(v, path ? `${path}.${key}` : key);
                if (!res.isValid) return res;
            }
        }
        return { isValid: true };
    }
    const res = check(data);
    return { isValid: res.isValid, errorField: res.field };
}

/**
 * Main Registration Form Component.
 * Optimized for mobile stability and modularity.
 */
export default function RegistrationForm(): React.ReactElement {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // UI State
    const [step, setStep] = useState<FormStep>('info');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<RegistrationData>(INITIAL_FORM);
    const [deviceId, setDeviceId] = useState<string>('');

    // Security: Honeypot & Timer
    const startTime = useRef<number>(Date.now());
    const [honeypot, setHoneypot] = useState<string>('');

    useEffect(() => {
        let id = localStorage.getItem('registration_device_id');
        if (!id) {
            id = (crypto as any).randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem('registration_device_id', id || '');
        }
        setDeviceId(id || '');
    }, []);


    // Modals & Notifications
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [transactionId, setTransactionId] = useState<string>('');
    const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'error' | 'success' }>({
        show: false, message: '', type: 'error'
    });

    function triggerNotification(message: string, type: 'error' | 'success' = 'error'): void {
        setNotification({ show: true, message, type });
    }

    // Check Registration Status
    const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(true);
    useEffect(() => {
        setIsRegistrationOpen(isRegistrationActive());
    }, []);

    useEffect(function syncTrackFromParams(): void {
        const trackParam = searchParams.get('track');
        if (trackParam && TRACKS.some(t => t.id === trackParam)) {
            setFormData(prev => ({ ...prev, track: trackParam }));
        }
    }, [searchParams]);

    function handleFieldChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        section?: 'leader' | 'member1' | 'member2'
    ): void {
        const { name, value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [name]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    async function handleSubmission(e: React.FormEvent): Promise<void> {
        e.preventDefault();

        // 1. Security Check (Patterns)
        const secCheck = validateSecurity(formData);
        if (!secCheck.isValid) {
            return triggerNotification(`SECURITY ALERT: MALICIOUS PATTERN DETECTED IN ${secCheck.errorField?.toUpperCase()}.`);
        }

        // 2. Format Validation
        const isDriveValid = formData.driveLink && DRIVE_LINK_REGEX.test(formData.driveLink);
        if (!formData.projectIdea || formData.projectIdea.length < 10) {
            return triggerNotification("PLEASE PROVIDE A BRIEF PROJECT INTEL (MIN 10 CHARS).");
        }
        if (!formData.driveLink) {
            return triggerNotification("PLEASE PROVIDE A PPT OR PROJECT DRIVE LINK.");
        }
        if (!isDriveValid) {
            return triggerNotification("INVALID DRIVE LINK. PLEASE PROVIDE A VALID GOOGLE DRIVE OR DOCS LINK.");
        }

        if (!EMAIL_REGEX.test(formData.leader.email)) {
            return triggerNotification("INVALID LEADER EMAIL FORMAT.");
        }

        if (!EMAIL_REGEX.test(formData.member1.email)) {
            return triggerNotification("INVALID AGENT 2 EMAIL FORMAT.");
        }

        if (!EMAIL_REGEX.test(formData.member2.email)) {
            return triggerNotification("INVALID AGENT 3 EMAIL FORMAT.");
        }

        if (!PHONE_REGEX.test(formData.leader.phone)) {
            return triggerNotification("INVALID LEADER PHONE NUMBER (MIN 10 DIGITS).");
        }

        const finalTxId = transactionId || "TEST_PAYMENT_SKIP";
        setIsLoading(true);

        const apiUrl = import.meta.env.VITE_API_URL;
        console.log("Attempting to connect to:", apiUrl);

        try {
            const duration = Date.now() - startTime.current;
            // FIXED: Removed extra /api since env variable already has it
            const response = await fetch(`${apiUrl}/manual-register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formData,
                    transactionId: finalTxId,
                    deviceId,
                    honeypot,
                    duration
                })
            });
            const data = await response.json();

            if (data.status === 'success') {
                triggerNotification("Registration Submitted! We have received your entry and will get back to you soon.", "success");
                setTimeout(() => navigate('/'), 2000);
            } else {
                const errorMsg = data.error || data.errors?.map((e: any) => `${e.path}: ${e.msg}`).join(', ') || "Unknown error";
                triggerNotification("Submission failed: " + errorMsg);
            }
        } catch (error: any) {
            console.error("Submission Error Details:", error);
            const msg = error.message === "Failed to fetch"
                ? `Connection Failed. Ensure Server is running on ${apiUrl}`
                : `Error: ${error.message}`;
            triggerNotification(msg);
        } finally {
            setIsLoading(false);
        }
    }




    if (!isRegistrationOpen) {
        return (
            <div className="bg-purple-dark min-h-screen relative overflow-x-hidden font-body text-black flex items-center justify-center">
                <AnnouncementPost />
                <SiliconBeachBackground />
                <div className="relative z-10 w-full max-w-md px-4">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold mb-8 transition-colors">
                        <ArrowLeft size={20} /> BACK TO HOME
                    </Link>
                    <div className="bg-white border-[4px] border-black p-8 shadow-[8px_8px_0px_#000] text-center">
                        <h2 className="text-4xl font-display text-black mb-4 uppercase italic">
                            Access <span className="text-red-500">Denied!</span>
                        </h2>
                        <p className="text-lg font-bold text-gray-800 mb-6">
                            Registrations for VexStorm 26 have closed!
                        </p>
                        <div className="bg-yellow-100 border-2 border-dashed border-black p-4 mb-6">
                            <p className="text-sm font-bold">The portal is no longer accepting new team entries.</p>
                        </div>
                        <Link to="/" className="btn-comic-primary w-full block text-center py-3">
                            RETURN TO HQ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-purple-dark min-h-screen relative overflow-hidden flex flex-col">
            <AnnouncementPost />
            <SiliconBeachBackground />

            <div className="relative z-10 pt-12 pb-20 px-4 flex-1 overflow-y-auto w-full">
                <div className="max-w-3xl mx-auto w-full">
                    {/* Header */}
                    <header className="mb-8 flex items-center gap-4">
                        <Link to="/" className="text-white hover:text-neon-green transition-colors p-2 -ml-2">
                            <ArrowLeft size={28} />
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-display text-white uppercase leading-none mb-1">
                                REGISTRATION
                            </h1>
                            <p className="text-neon-green font-bold text-xs md:text-sm uppercase tracking-wider">
                                Join the Arena
                            </p>
                        </div>
                    </header>

                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        {(['info', 'details'] as FormStep[]).map(s => (
                            <div
                                key={s}
                                className={`h-2 flex-1 border-2 border-black transition-colors ${s === step ? 'bg-neon-green' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>

                    <form onSubmit={handleSubmission} className="comic-card p-5 md:p-8 space-y-6 relative mb-12">
                        {/* BOT TRAP: HoneyPot Field (Invisible to humans) */}
                        <div className="fixed opacity-0 pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
                            <label htmlFor="fax_number">Fax Number</label>
                            <input
                                type="text"
                                id="fax_number"
                                name="fax_number"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                                autoComplete="off"
                                tabIndex={-1}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 'info' ? (
                                <StepInfo
                                    formData={formData}
                                    setFormData={setFormData}
                                    onFieldChange={handleFieldChange}
                                    onNext={() => setStep('details')}
                                    triggerNotification={triggerNotification}
                                />
                            ) : (
                                <StepDetails
                                    formData={formData}
                                    isLoading={isLoading}
                                    onFieldChange={handleFieldChange}
                                    onBack={() => setStep('info')}
                                />
                            )}
                        </AnimatePresence>

                        {/* <footer className="bg-black py-2 px-4 md:px-6 flex justify-center items-center text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
                            <span>[ DATA_ENCRYPTED ]</span>
                        </footer> */}
                    </form>
                </div>
            </div>

            {/* Global Overlays */}
            <AnimatePresence>

                {showPaymentModal && (
                    <PaymentModal
                        transactionId={transactionId}
                        setTransactionId={setTransactionId}
                        isLoading={isLoading}
                        onSubmit={handleSubmission}
                        onClose={() => setShowPaymentModal(false)}
                    />
                )}
                {notification.show && (
                    <NotificationModal
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function PaymentModal({ transactionId, setTransactionId, isLoading, onSubmit, onClose }: any): React.ReactElement {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white max-w-md w-full border-[4px] border-black shadow-[8px_8px_0px_#FACC15] p-8 text-center space-y-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-black font-bold">X</button>
                <h3 className="text-3xl font-display uppercase">SCAN TO PAY</h3>
                <div className="bg-gray-100 border-2 border-black p-4 inline-block">
                    <img src="/qr-placeholder.png" alt="UPI QR" className="w-48 h-48 opacity-50" />
                    <p className="text-[10px] font-bold mt-2">UPI ID: vexstorm@upi</p>
                </div>
                <div className="text-left space-y-2">
                    <label className="block text-xs font-bold uppercase">TRANSACTION ID (UTR)</label>
                    <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="input-field text-sm"
                        placeholder="Ex: 3125XXXXXXXX"
                    />
                </div>
                <button onClick={onSubmit} disabled={isLoading} className="btn-comic-primary w-full !py-4">
                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'VERIFY & SUBMIT'}
                </button>
            </motion.div>
        </div>
    );
}

interface StepInfoProps {
    formData: RegistrationData;
    setFormData: React.Dispatch<React.SetStateAction<RegistrationData>>;
    onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section?: 'leader' | 'member1' | 'member2') => void;
    onNext: () => void;
    triggerNotification: (msg: string, type?: 'error' | 'success') => void;
}

function StepInfo({
    formData,
    setFormData,
    onFieldChange,
    onNext,
    triggerNotification
}: StepInfoProps): React.ReactElement {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Placeholder for colleges - User will provide the list
    const COLLEGES = [
        "NITK Surathkal",
        "Sahyadri College of Engg.",
        "St. Joseph Engg. College (SJEC)",
        "Canara Engineering College",
        "Mangalore Inst. of Tech (MITE)",
        "Alva’s Inst. of Engg. (AIET)",
        "A.J. Institute of Engg. (AJIET)",
        "Yenepoya Inst. of Technology",
        "Srinivas Inst. of Tech (SIT)",
        "Srinivas University (SUCET)",
        "P.A. College of Engineering",
        "Bearys Inst. of Tech (BIT)",
        "Shree Devi Inst. of Tech (SDIT)",
        "Vivekananda College (VCET)",
        "KVG College of Engineering",
        "SDM Inst. of Technology",
        "Prasanna College of Engg.",
        "Karavali Inst. of Technology",
        "Mangalore Marine College",
        "Manipal Inst. of Tech (MIT)",
        "NMAM Inst. of Tech (Nitte)",
        "Shri Madhwa Vadiraja (SMVITM)",
        "Moodlakatte Inst. (MITK)",
        "Govt. Engg. College Karwar",
        "Anjuman Inst. (AITM) Bhatkal",
        "KLS Vishwanathrao (VDIT) Haliyal",
        "Girijabai Sail Inst. (GSIT) Karwar",
        "Other"
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (activeDropdown && !target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

    function validateAndProceed(): void {
        const { teamName, leader, member1, member2 } = formData;

        if (!teamName) return triggerNotification("Please enter a Team Name.");

        // 1. Mandatory Presence Checks
        if (!leader.name || !leader.email || !leader.phone || !leader.year || (leader.year !== 'POST GRAD' && !leader.college)) {
            return triggerNotification("Please fill in all Team Leader fields.");
        }

        // 2. Format Checks - Leader
        if (!EMAIL_REGEX.test(leader.email)) {
            return triggerNotification("INVALID LEADER EMAIL FORMAT.");
        }
        if (!PHONE_REGEX.test(leader.phone)) {
            return triggerNotification("INVALID LEADER PHONE (MIN 10 DIGITS).");
        }

        // 3. Members validation (ALWAYS 3)
        if (!member1.name || !member1.email || !member1.phone || !member1.year || (member1.year !== 'POST GRAD' && !member1.college) || !member1.shirtSize) {
            return triggerNotification("Please fill in Agent 2 (Member 1) details including shirt size.");
        }
        if (!EMAIL_REGEX.test(member1.email)) {
            return triggerNotification("INVALID AGENT 2 EMAIL FORMAT.");
        }
        if (!PHONE_REGEX.test(member1.phone)) {
            return triggerNotification("INVALID AGENT 2 PHONE (MIN 10 DIGITS).");
        }

        if (!member2.name || !member2.email || !member2.phone || !member2.year || (member2.year !== 'POST GRAD' && !member2.college || !member2.shirtSize)) {
            return triggerNotification("Please fill in Agent 3 (Member 2) details including shirt size.");
        }
        if (!EMAIL_REGEX.test(member2.email)) {
            return triggerNotification("INVALID AGENT 3 EMAIL FORMAT.");
        }
        if (!PHONE_REGEX.test(member2.phone)) {
            return triggerNotification("INVALID AGENT 3 PHONE (MIN 10 DIGITS).");
        }

        if (!leader.shirtSize) {
            return triggerNotification("Please select a shirt size for the Leader.");
        }

        onNext();
    }

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <h2 className="text-2xl font-display text-black uppercase tracking-tight">SQUAD PROTOCOL</h2>

            <div className="space-y-4">
                <InputGroup label="TEAM IDENTITY" placeholder="TEAM NAME" name="teamName" value={formData.teamName} onChange={onFieldChange} required />

                <div className="space-y-1">
                    <label className="block text-xs font-bold uppercase text-black">MISSION TRACK</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TRACKS.map(track => (
                            <button
                                key={track.id}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, track: track.id }))}
                                className={`p-6 border-[3px] border-black text-left transition-all transform active:scale-[0.98] ${formData.track === track.id
                                    ? `${track.color} text-white shadow-[6px_6px_0px_#000]`
                                    : 'bg-white text-black hover:shadow-[4px_4px_0px_#000]'
                                    }`}
                            >
                                <div className="font-display text-lg uppercase mb-1">{track.label}</div>
                                <div className={`text-[10px] font-bold uppercase transition-opacity ${formData.track === track.id ? 'opacity-100' : 'opacity-60'}`}>
                                    {track.sub}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <PersonFieldsSection
                title="TEAM LEADER"
                data={formData.leader}
                section="leader"
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                onFieldChange={onFieldChange}
                setFormData={setFormData}
                colleges={COLLEGES}
            />

            <PersonFieldsSection
                title="AGENT 2"
                data={formData.member1}
                section="member1"
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                onFieldChange={onFieldChange}
                setFormData={setFormData}
                colleges={COLLEGES}
            />

            <PersonFieldsSection
                title="AGENT 3"
                data={formData.member2}
                section="member2"
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                onFieldChange={onFieldChange}
                setFormData={setFormData}
                colleges={COLLEGES}
            />

            <button onClick={validateAndProceed} type="button" className="btn-comic-primary w-full !text-base !py-4 shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                CONFIRM SQUAD
            </button>
        </motion.div >
    );
}

function PersonFieldsSection({
    title, data, section, activeDropdown, setActiveDropdown, onFieldChange, setFormData, colleges
}: any): React.ReactElement {
    const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];


    const toggleDropdown = (key: string) => {
        setActiveDropdown(activeDropdown === key ? null : key);
    };



    // Forgiving search: remove special chars and spaces for comparison
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Filter colleges based on input, but show all if input matches a valid college strictly (so they can validly re-select)
    // Actually, standard combobox logic: filter by partial match.
    // If the value exactly matches one, we still show list? Usually yes.
    const filteredColleges = (colleges || []).filter((c: string) =>
        normalize(c).includes(normalize(data.college || ""))
    );

    return (
        <div className="space-y-3 pt-4 border-t-2 border-black border-dashed">
            <h3 className="text-sm font-display text-black uppercase mb-1 bg-neon-green inline-block px-2 border-2 border-black -rotate-1">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="input-field text-sm" placeholder="NAME *" name="name" value={data.name} onChange={(e) => onFieldChange(e, section)} required />

                <input className="input-field text-sm flex-1" placeholder="EMAIL *" name="email" value={data.email} onChange={(e) => onFieldChange(e, section)} required />

                <input className="input-field text-sm" placeholder="PHONE *" name="phone" value={data.phone} onChange={(e) => onFieldChange(e, section)} required type="tel" />

                {/* College Unified Combobox */}
                <div className="relative dropdown-container">
                    <div className="relative">
                        <input
                            disabled={data.year === 'POST GRAD'}
                            className={`input-field text-sm w-full uppercase ${data.year === 'POST GRAD' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            placeholder={data.year === 'POST GRAD' ? 'N/A' : "SELECT OR TYPE COLLEGE *"}
                            value={data.year === 'POST GRAD' ? 'N/A' : (data.college || '')}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFormData((prev: any) => ({
                                    ...prev,
                                    [section]: { ...prev[section], college: val }
                                }));
                                if (!activeDropdown) setActiveDropdown(`${section}_college`);
                            }}
                            onFocus={() => {
                                if (data.year !== 'POST GRAD') setActiveDropdown(`${section}_college`);
                            }}
                            required
                        />
                        <ChevronDown
                            size={16}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform pointer-events-none ${activeDropdown === `${section}_college` ? 'rotate-180' : ''}`}
                        />
                    </div>

                    <AnimatePresence>
                        {activeDropdown === `${section}_college` && data.year !== 'POST GRAD' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 bg-white border-2 border-black z-50 shadow-[4px_4px_0px_#000] max-h-[200px] overflow-y-auto"
                            >
                                {filteredColleges.length > 0 ? (
                                    filteredColleges.map((c: string, i: number) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setFormData((prev: any) => ({
                                                    ...prev,
                                                    [section]: {
                                                        ...prev[section],
                                                        college: c === 'Other' ? '' : c
                                                    }
                                                }));
                                                setActiveDropdown(null);
                                            }}
                                            className="p-3 text-xs font-bold text-black hover:bg-neon-green cursor-pointer uppercase border-b border-black last:border-0"
                                        >
                                            {c}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 text-xs font-bold text-gray-500 uppercase italic">
                                        Type your college name...
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Year Custom Dropdown */}
                <div className="relative dropdown-container">
                    <div
                        onClick={() => toggleDropdown(`${section}_year`)}
                        className="input-field text-sm flex justify-between items-center cursor-pointer bg-white"
                    >
                        <span className={data.year ? "text-black" : "text-gray-500"}>{data.year || "SELECT YEAR"}</span>
                        <ChevronDown size={16} className={`transition-transform ${activeDropdown === `${section}_year` ? 'rotate-180' : ''}`} />
                    </div>
                    <AnimatePresence>
                        {activeDropdown === `${section}_year` && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 bg-white border-2 border-black z-50 shadow-[4px_4px_0px_#000]">
                                {YEARS.map(y => (
                                    <div
                                        key={y}
                                        onClick={() => {
                                            setFormData((prev: any) => ({
                                                ...prev,
                                                [section]: { ...prev[section], year: y, college: y === 'POST GRAD' ? '' : prev[section].college }
                                            }));
                                            setActiveDropdown(null);
                                        }}
                                        className="p-3 text-xs font-bold text-black hover:bg-neon-green cursor-pointer uppercase border-b border-black last:border-0"
                                    >
                                        {y}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Shirt Size Custom Dropdown */}
                <div className="relative dropdown-container">
                    <div
                        onClick={() => toggleDropdown(`${section}_shirt`)}
                        className="input-field text-sm flex justify-between items-center cursor-pointer bg-white"
                    >
                        <span className={data.shirtSize ? "text-black" : "text-gray-500"}>{data.shirtSize || "T-SHIRT SIZE *"}</span>
                        <ChevronDown size={16} className={`transition-transform ${activeDropdown === `${section}_shirt` ? 'rotate-180' : ''}`} />
                    </div>
                    <AnimatePresence>
                        {activeDropdown === `${section}_shirt` && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 bg-white border-2 border-black z-50 shadow-[4px_4px_0px_#000] max-h-[160px] overflow-y-auto"
                            >
                                {SHIRT_SIZES.map(s => (
                                    <div
                                        key={s}
                                        onClick={() => {
                                            setFormData((prev: any) => ({
                                                ...prev,
                                                [section]: { ...prev[section], shirtSize: s }
                                            }));
                                            setActiveDropdown(null);
                                        }}
                                        className={`p-3 text-xs font-bold hover:bg-neon-green cursor-pointer uppercase border-b border-black last:border-0 ${data.shirtSize === s ? 'bg-neon-green text-black' : 'text-black'}`}
                                    >
                                        {s}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
}

function StepDetails({ formData, isLoading, onFieldChange, onBack }: any): React.ReactElement {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="text-2xl font-display text-black uppercase tracking-tight">MISSION OBJECTIVE</h2>

            <div className="space-y-4">
                <TextAreaGroup label="BRIEF INTEL *" placeholder="WHAT ARE YOU BUILDING?" name="projectIdea" value={formData.projectIdea} onChange={onFieldChange} />
                <TextAreaGroup label="WHY THIS ARENA?" placeholder="MOTIVATION..." name="whyParticipate" value={formData.whyParticipate} onChange={onFieldChange} />
                <div className="space-y-3">
                    <InputGroup label="DRIVE LINK (PPT/PDF) *" placeholder="GOOGLE DRIVE LINK..." name="driveLink" value={formData.driveLink} onChange={onFieldChange} />
                    <div className="pt-1">
                        <a
                            href={HACKATHON_CONFIG.PPT_TEMPLATE_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-black text-purple-600 hover:text-white hover:bg-purple-600 px-4 py-3 border-2 border-purple-600 border-dashed rounded-sm transition-all uppercase tracking-widest group"
                        >
                            <ExternalLink size={16} className="group-hover:rotate-12 transition-transform" />
                            Get Resource: Phase 1 PPT Template
                        </a>
                    </div>
                </div>
            </div>

            <div className="bg-purple-100 p-4 border-[3px] border-black shadow-[6px_6px_0px_#000]">
                <div className="flex items-center gap-3">
                    <Info size={24} className="shrink-0 text-purple-600" />
                    <div className="text-[10px] font-bold uppercase leading-tight text-black">
                        REGISTRATION IS OPEN! <br />
                        SECURE YOUR SPOT IN THE ARENA.
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={onBack} type="button" className="btn-comic flex-1 bg-gray-200">BACK</button>
                <button type="submit" disabled={isLoading} className="btn-comic-primary flex-[2] flex items-center justify-center gap-2 !text-sm !py-4">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'SUBMIT REGISTRATION'}
                </button>
            </div>
        </motion.div>
    );
}

function InputGroup({ label, ...props }: any): React.ReactElement {
    return (
        <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-black">{label}</label>
            <input className="input-field text-sm uppercase" {...props} />
        </div>
    );
}

function TextAreaGroup({ label, ...props }: any): React.ReactElement {
    return (
        <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-black">{label}</label>
            <textarea className="input-field text-xs uppercase min-h-[100px]" {...props} />
        </div>
    );
}



function NotificationModal({ message, type, onClose }: any): React.ReactElement {
    const bgColor = type === 'success' ? 'bg-green-400' : 'bg-red-500';
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`${bgColor} border-4 border-black p-6 w-full max-w-sm text-center shadow-[10px_10px_0px_#000]`}
            >
                <h4 className="text-2xl font-display uppercase mb-2">{type}</h4>
                <p className="font-bold text-sm uppercase leading-tight mb-6">{message}</p>
                <button onClick={onClose} className="bg-black text-white px-8 py-2 font-display uppercase border-2 border-white shadow-[4px_4px_0px_#fff]">OK</button>
            </motion.div>
        </div>
    );
}

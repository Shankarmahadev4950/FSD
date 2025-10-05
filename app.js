/* ✅ FIXED VERSION - LocalLink Application JavaScript with Enhanced Authentication */

// Application Data (from provided JSON)
const appData = {
    users: [
        {
            id: 1,
            name: "Sarah Johnson",
            email: "sarah@email.com",
            password: "password123",
            location: "Portland, OR",
            bio: "Graphic designer with 8 years experience. Love helping others learn design skills!",
            skillsOffered: ["Graphic Design", "Logo Creation", "Photography", "Branding"],
            skillsWanted: ["Spanish Language", "Guitar Lessons", "Cooking"],
            timeTokens: 25,
            joinDate: "2024-01-15",
            profilePicture: "https://via.placeholder.com/150"
        },
        {
            id: 2,
            name: "Mike Chen",
            email: "mike@email.com",
            password: "password123",
            location: "Austin, TX",
            bio: "Full-stack developer and guitar instructor. Always excited to share knowledge!",
            skillsOffered: ["Web Development", "JavaScript", "Guitar Lessons", "Music Theory"],
            skillsWanted: ["Photography", "Yoga", "French Language"],
            timeTokens: 32,
            joinDate: "2024-02-03",
            profilePicture: "https://via.placeholder.com/150"
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            email: "emily@email.com",
            password: "password123",
            location: "Denver, CO",
            bio: "Certified yoga instructor and photographer. Passionate about wellness and creativity.",
            skillsOffered: ["Yoga", "Photography", "Meditation", "Fitness Training"],
            skillsWanted: ["Web Design", "Digital Marketing", "Piano"],
            timeTokens: 18,
            joinDate: "2024-01-28",
            profilePicture: "https://via.placeholder.com/150"
        },
        {
            id: 4,
            name: "David Kim",
            email: "david@email.com",
            password: "password123",
            location: "Seattle, WA",
            bio: "Marketing professional and language enthusiast. Fluent in Spanish and French.",
            skillsOffered: ["Digital Marketing", "Spanish Language", "French Language", "SEO"],
            skillsWanted: ["Video Editing", "Guitar Lessons", "Cooking"],
            timeTokens: 41,
            joinDate: "2024-01-10",
            profilePicture: "https://via.placeholder.com/150"
        },
        {
            id: 5,
            name: "Lisa Thompson",
            email: "lisa@email.com",
            password: "password123",
            location: "San Francisco, CA",
            bio: "Professional chef and video editor. Love creating content and sharing recipes!",
            skillsOffered: ["Cooking", "Video Editing", "Food Photography", "Nutrition"],
            skillsWanted: ["Yoga", "Spanish Language", "Photography"],
            timeTokens: 29,
            joinDate: "2024-02-12",
            profilePicture: "https://via.placeholder.com/150"
        }
    ],
    skillCategories: {
    "Creative 🎨": [
        "Graphic Design", 
        "Photography & Photo Editing", 
        "Videography & Video Editing", 
        "Digital Illustration", 
        "Creative Writing", 
        "Pottery & Ceramics", 
        "Painting (Watercolor/Acrylic)", 
        "UI/UX Design Basics"
    ],
    "Technology 💻": [
        "Web Development (HTML, CSS, JS)", 
        "Python Programming", 
        "Data Analysis with Excel", 
        "WordPress Management", 
        "Social Media Management", 
        "Search Engine Optimization (SEO)"
    ],
    "Music 🎵": [
        "Acoustic Guitar Lessons", 
        "Piano/Keyboard for Beginners", 
        "Vocal Coaching / Singing", 
        "Music Production Basics", 
        "Ukulele Lessons"
    ],
    "Wellness 🧘": [
        "Yoga Instruction", 
        "Guided Meditation", 
        "Basic Nutrition & Meal Prep", 
        "Personal Fitness Training", 
        "Mindfulness Practices"
    ],
    "Language 🗣️": [
        "Conversational English", 
        "Beginner's Spanish", 
        "French for Travel", 
        "Basic Japanese", 
        "Spoken Hindi"
    ],
    "Business 📈": [
        "Public Speaking", 
        "Digital Marketing", 
        "Resume Writing & Interview Skills", 
        "Project Management Fundamentals", 
        "Small Business Bookkeeping"
    ],
    "Lifestyle 🍳": [
        "Cooking & Baking", 
        "Gardening & Plant Care", 
        "Basic Home Repair", 
        "Personal Finance & Budgeting", 
        "Knitting or Crocheting"
    ]
},
    availableSkills: [
        {
            id: 1,
            name: "Graphic Design",
            category: "Creative",
            providerId: 1,
            providerName: "Sarah Johnson",
            timeRequired: 2,
            description: "Learn the basics of graphic design including composition, color theory, and typography",
            location: "Portland, OR",
            price: "2 hours",
            rating: 4.8
        },
        {
            id: 2,
            name: "Web Development",
            category: "Technology",
            providerId: 2,
            providerName: "Mike Chen",
            timeRequired: 3,
            description: "HTML, CSS, and JavaScript fundamentals for building modern websites",
            location: "Austin, TX",
            price: "3 hours",
            rating: 4.9
        },
        {
            id: 3,
            name: "Guitar Lessons",
            category: "Music",
            providerId: 2,
            providerName: "Mike Chen",
            timeRequired: 1,
            description: "Beginner to intermediate guitar lessons covering chords, strumming, and basic songs",
            location: "Austin, TX",
            price: "1 hour",
            rating: 4.7
        },
        {
            id: 4,
            name: "Yoga Classes",
            category: "Wellness",
            providerId: 3,
            providerName: "Emily Rodriguez",
            timeRequired: 1,
            description: "Hatha yoga for beginners focusing on basic poses and breathing techniques",
            location: "Denver, CO",
            price: "1 hour",
            rating: 4.9
        },
        {
            id: 5,
            name: "Photography",
            category: "Creative",
            providerId: 3,
            providerName: "Emily Rodriguez",
            timeRequired: 2,
            description: "Digital photography basics including composition, lighting, and editing",
            location: "Denver, CO",
            price: "2 hours",
            rating: 4.6
        },
        {
            id: 6,
            name: "Spanish Language",
            category: "Language",
            providerId: 4,
            providerName: "David Kim",
            timeRequired: 1,
            description: "Conversational Spanish lessons for beginners and intermediate learners",
            location: "Seattle, WA",
            price: "1 hour",
            rating: 4.8
        },
        {
            id: 7,
            name: "Digital Marketing",
            category: "Business",
            providerId: 4,
            providerName: "David Kim",
            timeRequired: 2,
            description: "Social media marketing, SEO basics, and content strategy for small businesses",
            location: "Seattle, WA",
            price: "2 hours",
            rating: 4.7
        },
        {
            id: 8,
            name: "Cooking",
            category: "Lifestyle",
            providerId: 5,
            providerName: "Lisa Thompson",
            timeRequired: 2,
            description: "Basic cooking techniques and healthy meal preparation for busy professionals",
            location: "San Francisco, CA",
            price: "2 hours",
            rating: 4.8
        },
        {
            id: 9,
            name: "Video Editing",
            category: "Creative",
            providerId: 5,
            providerName: "Lisa Thompson",
            timeRequired: 3,
            description: "Adobe Premiere Pro basics for creating engaging video content",
            location: "San Francisco, CA",
            price: "3 hours",
            rating: 4.5
        }
    ],
    testimonials: [
        {
            name: "Jennifer M.",
            skill: "Photography",
            text: "Emily's photography lessons were amazing! I learned so much in just 2 hours and now I'm taking better photos every day.",
            rating: 5
        },
        {
            name: "Robert L.",
            skill: "Web Development",
            text: "Mike helped me build my first website, and in return I taught him some Spanish. Perfect exchange!",
            rating: 5
        },
        {
            name: "Amanda K.",
            skill: "Multiple Skills",
            text: "Traded cooking lessons with Lisa for yoga sessions with Emily. LocalLink made it so easy to coordinate!",
            rating: 5
        }
    ]
};

// ✅ MOVE THESE TO TOP WITH OTHER VARIABLES (around line 60)
let currentChatSkill = null;
let messages = [];
let messageInterval = null;
let sessionInterval = null;
// Add event listener for Get Started button
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up Get Started button');
    
    const heroGetStarted = document.getElementById('hero-get-started');
    if (heroGetStarted) {
        heroGetStarted.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Get Started button clicked');
            showGetStartedModal();
        });
    } else {
        console.error('Get Started button not found');
    }
    
    // Also check if modal element exists
    const modalElement = document.getElementById('getStartedModal');
    if (modalElement) {
        console.log('Get Started modal element found');
    } else {
        console.error('Get Started modal element not found');
    }
});
// Application State
let isSubmitting = false;
let currentUser = null;
let currentSection = 'landing';
let filteredSkills = [];
let selectedSkills = [];
let currentGetStartedMode = null;
let authToken = null;
let resetEmail = '';

// API Base URL
const API_BASE = 'https://fsd-locallink.onrender.com/api';

// ✅ TOKEN MANAGEMENT - Persistent Sessions
const TokenManager = {
    setToken: (token) => {
        authToken = token;
        localStorage.setItem('locallink_token', token);
    },
    
    getToken: () => {
        if (!authToken) {
            authToken = localStorage.getItem('locallink_token');
        }
        return authToken;
    },
    
    removeToken: () => {
        authToken = null;
        localStorage.removeItem('locallink_token');
    },
    
    isValid: () => {
        const token = TokenManager.getToken();
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch (e) {
            return false;
        }
    }
};
// ✅ ENHANCED NOTIFICATION SYSTEM - ONLY ONLINE USER COUNTS
const NotificationManager = {
    onlineUsersCount: 0,
    
    // Only show notifications for online users count
    showOnlineUsersCount: function(count) {
        this.onlineUsersCount = count;
        this.updateNavigationBadges();
    },
    
    // Update navigation badges with online users count
    updateNavigationBadges: function() {
        const skillsBadge = document.getElementById('skills-badge');
        const dashboardBadge = document.getElementById('dashboard-badge');
        
        // Remove dashboard badge completely
        if (dashboardBadge) {
            dashboardBadge.style.display = 'none';
        }
        
        // Only show skills badge if there are online users
        if (skillsBadge) {
            if (this.onlineUsersCount > 0) {
                skillsBadge.textContent = this.onlineUsersCount;
                skillsBadge.style.display = 'flex';
                skillsBadge.title = `${this.onlineUsersCount} users online now`;
            } else {
                skillsBadge.style.display = 'none';
            }
        }
    },
    
    // Remove all toast notifications (keep for errors only)
    show: (message, type = 'error', duration = 3000) => {
        // Only show error notifications, suppress success/info notifications
        if (type === 'error') {
            const notification = document.createElement('div');
            notification.className = `alert alert-${type === 'error' ? 'danger' : type} notification-toast`;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                animation: slideInRight 0.3s ease-out;
            `;
            notification.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <span>${message}</span>
                    <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideOutRight 0.3s ease-out';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }
    }
};
// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification-toast {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: none;
        border-left: 4px solid;
    }
`;
document.head.appendChild(style);
document.addEventListener('DOMContentLoaded', function() {
    const getStartedBtn = document.querySelector('#hero-get-started');
    const learnMoreBtn = document.querySelector('#hero-learn');
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showGetStartedModal();
        });
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Scroll to features section
            const featuresSection = document.querySelector('.features-section');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('LocalLink Application Starting...');
    setTimeout(() => {
        initializeApp();
    }, 100);
});

// ✅ SESSION MANAGEMENT - Check existing session
async function checkExistingSession() {
    const token = TokenManager.getToken();
    if (!token) return;
    
    try {
        const response = await apiRequest('/users/verify');
        if (response.valid && response.user) {
            currentUser = response.user;
            authToken = token;
            updateUIForLoggedInUser();
            console.log('Session restored for:', currentUser.name);
        } else {
            TokenManager.removeToken();
        }
    } catch (error) {
        console.log('Session validation failed:', error.message);
        TokenManager.removeToken();
    }
}
// ✅ SHOW MESSAGING UI
function showMessagingUI(skill) {
    currentChatSkill = skill;
    
    // Update modal header
    document.getElementById('message-user-name').textContent = skill.providerName;
    document.getElementById('message-user-skill').textContent = skill.name;
    document.getElementById('message-user-avatar').textContent = getUserInitials(skill.providerName);
    
    // Load messages
    loadMessages(skill.id);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('messagingModal'));
    modal.show();
    
    // Start real-time updates
    startMessagePolling(skill.id);
    
    // Setup message sending
    setupMessageSending();
}
// ✅ DISPLAY MESSAGES
function displayMessages() {
    const container = document.getElementById('messages-container');
    const noMessages = document.getElementById('no-messages');
    
    if (!container) return;
    
    if (messages.length === 0) {
        container.innerHTML = '<div id="no-messages" class="text-center text-muted py-4"><i class="fas fa-comments fa-2x mb-2"></i><p>No messages yet. Start a conversation!</p></div>';
        return;
    }
    
    if (noMessages) noMessages.style.display = 'none';
    
    container.innerHTML = messages.map(message => `
        <div class="message-bubble ${message.senderId === currentUser.id ? 'message-sent' : 'message-received'}">
            <div class="message-content">
                <p class="message-text">${message.content}</p>
                <div class="message-meta">
                    <small class="message-time">${formatMessageTime(message.timestamp)}</small>
                    ${message.senderId === currentUser.id ? `
                        <span class="message-status ${message.read ? 'text-primary' : 'text-muted'}">
                            <i class="fas fa-check${message.read ? '-double' : ''}"></i>
                        </span>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function setupFilterHandlers() {
    console.log('🔧 Setting up filter handlers...');
    
    // Search input handler
    const searchInput = document.getElementById('skill-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.trim();
            console.log('🔍 Searching for:', searchTerm);
            searchSkills();
        }, 300));
    }
    
    // Category filter handler
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            console.log('🎯 Category filter changed');
            searchSkills();
        });
    }
    
    // Duration filter handler (if exists)
    const durationFilter = document.getElementById('duration-filter');
    if (durationFilter) {
        durationFilter.addEventListener('change', () => {
            console.log('⏰ Duration filter changed');
            searchSkills();
        });
    }
    
    // Clear filters button (if exists)
    const clearButton = document.getElementById('clear-filters');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            console.log('🗑️ Clearing all filters');
            clearFilters();
        });
    }
    
    console.log('✅ Filter handlers setup completed');
}

// ✅ ADD MISSING HELPER FUNCTIONS FOR SEARCH
function setupSearchListeners() {
    const searchInput = document.getElementById('skill-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchSkills, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', searchSkills);
    }
}

// ✅ ADD MISSING: SETUP SEARCH FUNCTIONALITY
function setupSearchFunctionality() {
    console.log('🔧 Setting up search functionality...');
    
    const searchInput = document.getElementById('skill-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.trim();
            console.log('🔍 Searching skills for:', searchTerm);
            performSkillsSearch(searchTerm);
        }, 300));
    }
}

// ✅ ADD MISSING: PERFORM SKILLS SEARCH
function performSkillsSearch(searchTerm) {
    if (!filteredSkills || filteredSkills.length === 0) {
        console.log('No skills available to search');
        return;
    }
    
    let filtered = filteredSkills;
    
    if (searchTerm && searchTerm.length > 0) {
        filtered = filteredSkills.filter(skill => {
            const skillName = skill.name || '';
            const providerName = skill.providerName || '';
            const description = skill.description || '';
            const category = skill.category || '';
            
            return skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   category.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }
    
    console.log(`🔍 Search results: ${filtered.length} skills found`);
    populateSkillsGrid(filtered);
}


// ✅ GLOBAL WEBSOCKET EVENT HANDLER (add this to your app.js)
document.addEventListener('DOMContentLoaded', function() {
    // Listen for WebSocket connection events
    window.addEventListener('websocketConnected', function(event) {
        console.log('✅ Global WebSocket connected event - initializing video calls');
        videoCallManager.initializeSocket(event.detail.socket);
    });
    
    // If socket is already available, initialize immediately
    if (typeof socket !== 'undefined' && socket.readyState === WebSocket.OPEN) {
        console.log('✅ Socket already connected - initializing video calls');
        videoCallManager.initializeSocket(socket);
    }
});

function connectWebSocket() {
    try {
        // Your existing WebSocket connection code
        socket = new WebSocket('ws://localhost:5001'); // or your WebSocket URL
        
        socket.onopen = function(event) {
            console.log('✅ WebSocket connected successfully');
            
            // ✅ CRITICAL: Initialize video call manager
            videoCallManager.initializeSocket(socket);
            
            // Also dispatch global event for other components
            window.dispatchEvent(new CustomEvent('websocketConnected', {
                detail: { socket: socket }
            }));
        };
        
        socket.onmessage = function(event) {
            // Your existing message handling
            const data = JSON.parse(event.data);
            // ... handle other messages
        };
        
    } catch (error) {
        console.error('❌ WebSocket connection failed:', error);
    }
}

function startVideoCall(skillId, recipientId, recipientName) {
    console.log('🎬 Starting video call to:', recipientName);
    
    // Check if user is logged in
    if (!currentUser) {
        NotificationManager.show('Please login to start a video call', 'error');
        showAuthForm('signin');
        return;
    }
    
    // Check if video call system is available
    if (typeof videoCallManager === 'undefined') {
        NotificationManager.show('Video call system is not available. Please refresh the page.', 'error');
        return;
    }
    
    // Check if WebSocket is connected
    if (!videoCallManager.socket) {
        // Try to initialize with existing WebSocket
        if (typeof socket !== 'undefined' && socket.readyState === WebSocket.OPEN) {
            videoCallManager.initializeSocket(socket);
        } else {
            NotificationManager.show('Video call connection is not ready. Please wait a moment and try again.', 'warning');
            return;
        }
    }
    
    // Check if already in a call
    if (videoCallManager.isCallActive) {
        NotificationManager.show('You are already in a video call. Please end the current call first.', 'warning');
        return;
    }
    
    // All checks passed - start the call
    videoCallManager.startCall(skillId, recipientId, recipientName);
}
// ✅ FIXED: SEND MESSAGE FUNCTION
async function sendMessage() {
    if (!currentChatSkill || !currentUser) {
        NotificationManager.show('Please select a skill and login first', 'error');
        return;
    }
    
    const messageInput = document.getElementById('message-input');
    const content = messageInput.value.trim();
    
    if (!content) {
        NotificationManager.show('Please enter a message', 'error');
        return;
    }
    
    try {
        console.log('🔄 Sending message for skill:', currentChatSkill.id);
        
        const messageData = {
            skillId: currentChatSkill.id,
            receiverId: currentChatSkill.providerId,
            content: content
        };
        
        console.log('📝 Message data:', messageData);
        
        const response = await apiRequest('/messages/send', {
            method: 'POST',
            body: messageData
        });
        
        console.log('✅ Message send response:', response);
        
        if (response.messageData) {
            // Add message to local array
            messages.push({
                id: response.messageData.id,
                content: content,
                senderId: currentUser.id,
                receiverId: currentChatSkill.providerId,
                timestamp: response.messageData.timestamp || new Date().toISOString(),
                read: response.messageData.read || false
            });
            
            // Clear input and update display
            messageInput.value = '';
            displayMessages();
            
            NotificationManager.show('Message sent successfully!', 'success');
        } else {
            throw new Error('Invalid response from server');
        }
        
    } catch (error) {
        console.error('❌ Error sending message:', error);
        NotificationManager.show('Failed to send message: ' + error.message, 'error');
    }
}

// ✅ FIXED: LOAD MESSAGES FUNCTION
async function loadMessages(skillId) {
    try {
        console.log('🔄 Loading messages for skill:', skillId);
        
        if (!skillId || skillId === 'undefined') {
            console.error('Invalid skill ID:', skillId);
            messages = [];
            displayMessages();
            return;
        }
        
        const response = await apiRequest(`/messages/skill/${skillId}`);
        console.log('✅ Messages loaded:', response.messages?.length || 0);
        
        messages = response.messages || [];
        displayMessages();
    } catch (error) {
        console.error('❌ Error loading messages:', error);
        messages = [];
        displayMessages();
        
        // Don't show error for empty messages, only for actual errors
        if (!error.message.includes('Network') && !error.message.includes('timeout')) {
            NotificationManager.show('Failed to load messages', 'error');
        }
    }
}

// ✅ FIXED: SETUP MESSAGE SENDING
function setupMessageSending() {
    const sendBtn = document.getElementById('send-message-btn');
    const messageInput = document.getElementById('message-input');
    
    if (sendBtn && messageInput) {
        // Remove existing event listeners
        sendBtn.onclick = null;
        messageInput.onkeypress = null;
        
        // Add new event listeners
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        console.log('✅ Message sending setup completed');
    }
}
// ✅ START REAL-TIME MESSAGE POLLING
function startMessagePolling(skillId) {
    // Clear existing interval
    if (messageInterval) {
        clearInterval(messageInterval);
    }
    
    // Poll for new messages every 3 seconds
    messageInterval = setInterval(async () => {
        if (currentChatSkill && currentChatSkill.id === skillId) {
            await loadMessages(skillId);
        }
    }, 3000);
}

// ✅ STOP MESSAGE POLLING
function stopMessagePolling() {
    if (messageInterval) {
        clearInterval(messageInterval);
        messageInterval = null;
    }
}

// ✅ FORMAT MESSAGE TIME
function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ✅ CLOSE MESSAGING MODAL HANDLER
document.addEventListener('DOMContentLoaded', function() {
    const messagingModal = document.getElementById('messagingModal');
    if (messagingModal) {
        messagingModal.addEventListener('hidden.bs.modal', function() {
            stopMessagePolling();
            currentChatSkill = null;
        });
    }
});
// ✅ ENHANCED API FUNCTIONS WITH TIMEOUT, ERROR HANDLING AND AD BLOCKER DETECTION
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const config = {
        signal: controller.signal,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options,
        // Prevent caching for POST requests
        cache: options.method === 'POST' ? 'no-cache' : 'default'
    };

    const token = TokenManager.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        console.log(`🔄 API Request: ${config.method || 'GET'} ${url}`, config.body ? JSON.parse(config.body) : '');
        
        const response = await fetch(url, config);
        
        // Handle redirect responses
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // Handle non-JSON responses gracefully
            const text = await response.text();
            throw new Error(`Unexpected response: ${text}`);
        }

        console.log(`✅ API Response: ${config.method || 'GET'} ${url}`, data);

        if (!response.ok) {
            // Handle 400 Bad Request specifically for duplicate actions
            if (response.status === 400 && data.error?.includes('Duplicate')) {
                NotificationManager.show('This action was already completed. Please continue browsing.', 'info');
                return { success: true, duplicate: true };
            }
            
            // Handle authentication errors
            if (response.status === 401 || response.status === 403) {
                TokenManager.clearToken();
                currentUser = null;
                updateUIForLoggedOutUser();
                NotificationManager.show('Session expired. Please log in again.', 'error');
                showSection('login');
                throw new Error('Authentication failed');
            }
            
            throw new Error(data.error || data.message || `API error: ${response.status}`);
        }

        return data;
        
    } catch (error) {
        console.error(`❌ API Error: ${config.method || 'GET'} ${url}`, error);
        
        if (error.name === 'AbortError') {
            NotificationManager.show('Request timeout. Please try again.', 'error');
        } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            // Check if this might be an ad blocker issue
            const isLikelyAdBlocker = url.includes('localhost') || url.includes('127.0.0.1');
            if (isLikelyAdBlocker) {
                console.warn('⚠️ Request blocked - this might be due to an ad blocker or CORS issue');
                NotificationManager.show('Cannot connect to server. Please check if the server is running and try disabling ad blockers for this site.', 'error');
            } else {
                NotificationManager.show('Cannot connect to server. Please check your internet connection.', 'error');
            }
        } else if (error.message.includes('Invalid JSON response')) {
            NotificationManager.show('Server response error. Please try again.', 'error');
        } else {
            // Only show notification for non-authentication errors
            if (!error.message.includes('Authentication failed')) {
                NotificationManager.show(error.message, 'error');
            }
        }
        
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}
// ✅ ENHANCED ACTIVITY TRACKING SYSTEM
const ActivityTracker = {
    // Initialize user activity
    initUserActivity() {
        if (!currentUser) return;
        
        const userActivity = this.getUserActivity();
        if (!userActivity) {
            this.createInitialActivity();
        }
    },

    // Get user activity from localStorage
    getUserActivity() {
        if (!currentUser) return null;
        const activityKey = `user_activity_${currentUser.id}`;
        return JSON.parse(localStorage.getItem(activityKey));
    },

    // Create initial activity structure
    createInitialActivity() {
        if (!currentUser) return;
        
        const activityKey = `user_activity_${currentUser.id}`;
        const initialActivity = {
            userId: currentUser.id,
            createdAt: new Date().toISOString(),
            totalHoursActive: 0,
            coursesCompleted: 0,
            skillsLearned: [],
            dailyActivity: this.generateEmptyWeeklyActivity(),
            learningProgress: [],
            sessionHistory: []
        };
        
        localStorage.setItem(activityKey, JSON.stringify(initialActivity));
        return initialActivity;
    },

    // Generate empty weekly activity
    generateEmptyWeeklyActivity() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
            day,
            hours: 0,
            courses: 0,
            skills: []
        }));
    },

    // Track session start
    startSession() {
        if (!currentUser) return;
        
        const session = {
            startTime: new Date().toISOString(),
            endTime: null,
            duration: 0,
            activities: []
        };
        
        const activity = this.getUserActivity();
        if (activity) {
            activity.sessionHistory.push(session);
            this.saveUserActivity(activity);
        }
        
        return session;
    },

    // Track session end
    endSession() {
        if (!currentUser) return;
        
        const activity = this.getUserActivity();
        if (activity && activity.sessionHistory.length > 0) {
            const lastSession = activity.sessionHistory[activity.sessionHistory.length - 1];
            if (!lastSession.endTime) {
                lastSession.endTime = new Date().toISOString();
                const start = new Date(lastSession.startTime);
                const end = new Date(lastSession.endTime);
                lastSession.duration = (end - start) / (1000 * 60 * 60); // hours
                
                // Update total hours
                activity.totalHoursActive += lastSession.duration;
                
                this.updateDailyActivity(activity, lastSession.duration);
                this.saveUserActivity(activity);
            }
        }
    },

    // Update daily activity
    updateDailyActivity(activity, hours) {
        const today = new Date();
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today.getDay()];
        
        const dailyActivity = activity.dailyActivity.find(day => day.day === dayName);
        if (dailyActivity) {
            dailyActivity.hours += hours;
        }
    },

    // Track course completion
    trackCourseCompletion(courseName, skill, hoursSpent) {
        if (!currentUser) return;
        
        const activity = this.getUserActivity();
        if (activity) {
            // Add to skills learned
            const existingSkill = activity.skillsLearned.find(s => s.name === skill);
            if (existingSkill) {
                existingSkill.hours += hoursSpent;
                existingSkill.courses.push(courseName);
            } else {
                activity.skillsLearned.push({
                    name: skill,
                    hours: hoursSpent,
                    courses: [courseName]
                });
            }
            
            // Update courses completed
            activity.coursesCompleted += 1;
            
            // Add to learning progress
            activity.learningProgress.push({
                date: new Date().toISOString(),
                course: courseName,
                skill: skill,
                hours: hoursSpent,
                type: 'course_completed'
            });
            
            this.saveUserActivity(activity);
        }
    },

    // Track skill learning progress
    trackSkillProgress(skillName, hours, progress) {
        if (!currentUser) return;
        
        const activity = this.getUserActivity();
        if (activity) {
            activity.learningProgress.push({
                date: new Date().toISOString(),
                skill: skillName,
                hours: hours,
                progress: progress,
                type: 'skill_progress'
            });
            
            this.saveUserActivity(activity);
        }
    },

    // Save user activity
    saveUserActivity(activity) {
        if (!currentUser) return;
        const activityKey = `user_activity_${currentUser.id}`;
        localStorage.setItem(activityKey, JSON.stringify(activity));
    },

    // Get activity statistics
    getActivityStats() {
        const activity = this.getUserActivity();
        if (!activity) return null;
        
        return {
            totalHoursActive: activity.totalHoursActive || 0,
            coursesCompleted: activity.coursesCompleted || 0,
            skillsLearned: activity.skillsLearned?.length || 0,
            weeklyActivity: activity.dailyActivity || this.generateEmptyWeeklyActivity(),
            learningProgress: activity.learningProgress || []
        };
    },

    // Get skills learned with hours
    getSkillsWithHours() {
        const activity = this.getUserActivity();
        if (!activity || !activity.skillsLearned) return [];
        
        return activity.skillsLearned.map(skill => ({
            name: skill.name,
            hours: skill.hours,
            courses: skill.courses.length
        }));
    }
};
// ✅ ENHANCED DASHBOARD BUTTON HANDLERS
function setupDashboardQuickActions() {
    // Browse Skills Button
    const browseSkillsBtn = document.getElementById('browse-skills-btn');
    if (browseSkillsBtn) {
        browseSkillsBtn.addEventListener('click', function() {
            console.log('Browse Skills button clicked');
            showSection('skills');
            
            // Start activity tracking for skills browsing
            ActivityTracker.trackSkillProgress('Skills Browsing', 0.1, 'browsing');
        });
    }

    // Manage Profile Button
    const manageProfileBtn = document.getElementById('manage-profile-btn');
    if (manageProfileBtn) {
        manageProfileBtn.addEventListener('click', function() {
            console.log('Manage Profile button clicked');
            showSection('profile');
            
            // Track profile management activity
            ActivityTracker.trackSkillProgress('Profile Management', 0.1, 'profile_updated');
        });
    }

    // View Activity Button
    const viewActivityBtn = document.getElementById('view-activity-btn');
    if (viewActivityBtn) {
        viewActivityBtn.addEventListener('click', function() {
            console.log('View Activity button clicked');
            showActivityDashboard();
        });
    }

    // Add Skills Button
    const addSkillsBtn = document.getElementById('add-skills-btn');
    if (addSkillsBtn) {
        addSkillsBtn.addEventListener('click', function() {
            console.log('Add Skills button clicked');
            navigateToProfileSkills();
        });
    }
}

// ✅ SHOW ACTIVITY DASHBOARD
function showActivityDashboard() {
    // Update main content to show activity
    const dashboardContent = document.getElementById('dashboard-content');
    const activityContent = document.getElementById('activity-content');
    
    if (dashboardContent && activityContent) {
        dashboardContent.classList.add('d-none');
        activityContent.classList.remove('d-none');
        
        // Render activity charts and data
        renderActivityDashboard();
    }
}

// ✅ NAVIGATE TO PROFILE SKILLS SECTION
function navigateToProfileSkills() {
    showSection('profile');
    
    // Scroll to skills section after a brief delay
    setTimeout(() => {
        const skillsSection = document.querySelector('.profile-card .card-header');
        if (skillsSection) {
            skillsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Highlight the skills section
            skillsSection.parentElement.style.border = '2px solid #007bff';
            skillsSection.parentElement.style.transition = 'border 0.3s ease';
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                skillsSection.parentElement.style.border = '';
            }, 3000);
        }
    }, 500);
}


// ✅ RENDER COURSES COMPLETED
function renderCoursesCompleted(stats) {
    // This can be expanded to show detailed course completion data
    console.log('Courses completed:', stats.coursesCompleted);
}
// ✅ TOGGLE ACTIVITY VIEW

// ✅ ENHANCED SKILLS LOADING WITH ONLINE STATUS
// ✅ ENHANCED SKILLS LOADING - WITH BETTER ERROR HANDLING
async function loadSkills() {
    console.log('🔄 Starting to load skills...');
    
    try {
        const skills = await apiRequest('/skills');
        console.log('📦 Skills received from API:', skills?.length || 0, 'skills');
        
        if (!skills || !Array.isArray(skills)) {
            console.error('❌ Invalid skills data received:', skills);
            throw new Error('Invalid skills data received from server');
        }
        
        // Filter skills safely
        filteredSkills = skills.filter(skill => {
            if (!skill) return false;
            if (skill.isActive === false) return false;
            if (!skill.providerName && !skill.provider?.name) return false;
            if (currentUser && (skill.providerId === currentUser.id || skill.provider?._id === currentUser.id)) return false;
            return true;
        });
        
        console.log(`✅ Filtered ${filteredSkills.length} skills`);
        
        // Count online users
        const onlineUsersCount = filteredSkills.filter(skill => {
            return skill.providerOnline === true || skill.provider?.isOnline === true;
        }).length;
        
        console.log(`👥 Online users: ${onlineUsersCount}`);
        
        // Update notification badge
        NotificationManager.showOnlineUsersCount(onlineUsersCount);
        
        // Always update the skills grid if we're on the skills section
        if (currentSection === 'skills') {
            console.log('🎯 Updating skills grid...');
            populateSkillsGrid(filteredSkills);
        }
        
    } catch (error) {
        console.error('❌ Failed to load skills from API:', error.message);
        
        // Show fallback skills immediately
        showFallbackSkills();
        
        // Show user-friendly error (but don't show for network errors to avoid spam)
        if (!error.message.includes('Network') && !error.message.includes('timeout')) {
            NotificationManager.show('Using demo skills data. ' + error.message, 'warning');
        }
    }
}

// ✅ FALLBACK SKILLS FUNCTION
function showFallbackSkills() {
    console.log('🔄 Loading fallback skills data...');
    
    filteredSkills = appData.availableSkills.filter(skill => {
        if (!skill) return false;
        if (currentUser && skill.providerId === currentUser.id) return false;
        return true;
    });
    
    console.log(`📦 Loaded ${filteredSkills.length} fallback skills`);
    
    // Add online status to fallback data
    filteredSkills.forEach(skill => {
        skill.providerOnline = Math.random() > 0.5; // Random online status for demo
        skill.providerLastSeen = new Date();
    });
    
    const onlineUsersCount = filteredSkills.filter(skill => skill.providerOnline).length;
    NotificationManager.showOnlineUsersCount(onlineUsersCount);
    
    if (currentSection === 'skills') {
        populateSkillsGrid(filteredSkills);
    }
}

// In app.js, change these:
async function registerUser(userData) {
    return apiRequest('/auth/register', {  // Changed from /users/register
        method: 'POST',
        body: userData
    });
}
async function loginUser(credentials) {
    return apiRequest('/auth/login', {  // NOT /auth/login
        method: 'POST', 
        body: credentials
    });
}

// ✅ ENHANCED PROFILE UPDATE WITH NOTIFICATIONS
async function updateUserProfile(profileData) {
    try {
        console.log('🔄 Updating profile with data:', profileData);
        
        const response = await apiRequest('/users/profile', {
            method: 'PUT',
            body: profileData
        });
        
        console.log('✅ Profile update response:', response);
        
        // Update current user data with the response
        if (response.user) {
            currentUser = response.user;
            // Update UI immediately
            updateProfileDisplay();
            updateDashboardStats();
        }
        
        NotificationManager.show(response.message || 'Profile updated successfully!', 'success');
        return response;
    } catch (error) {
        console.error('❌ Profile update failed:', error);
        NotificationManager.show('Failed to update profile: ' + error.message, 'error');
        throw error;
    }
}
// Enhanced Navigation Functionality
function setupEnhancedNavigation() {
    // Update navigation badges based on user data
    updateNavigationBadges();
    
    // Setup search functionality
    setupNavSearch();
    
    // Setup quick action buttons
    setupQuickActions();
}

function updateNavigationBadges() {
    // Remove dashboard badge completely
    const dashboardBadge = document.getElementById('dashboard-badge');
    if (dashboardBadge) {
        dashboardBadge.style.display = 'none';
    }
    
    // Skills badge will be controlled by NotificationManager based on online users
    const skillsBadge = document.getElementById('skills-badge');
    if (skillsBadge) {
        skillsBadge.style.display = 'none'; // Start hidden, will show when online users exist
    }
}

// ✅ ENHANCED NAVIGATION CLICK HANDLERS
function setupNavigationHandlers() {
    console.log('Setting up navigation handlers...');

    // Home navigation
    const navHome = document.getElementById('nav-home');
    if (navHome) {
        navHome.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Home nav clicked');
            showSection('landing');
        });
    }

    // Dashboard navigation
    const navDashboard = document.getElementById('nav-dashboard');
    if (navDashboard) {
        navDashboard.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Dashboard nav clicked');
            if (currentUser) {
                showSection('dashboard');
            } else {
                showAuthForm('signin');
            }
        });
    }

    // Skills navigation
    const navSkills = document.getElementById('nav-skills');
    if (navSkills) {
        navSkills.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Skills nav clicked');
            showSection('skills');
        });
    }

    // Profile navigation
    const navProfile = document.getElementById('nav-profile');
    if (navProfile) {
        navProfile.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Profile nav clicked');
            if (currentUser) {
                showSection('profile');
            } else {
                showAuthForm('signin');
            }
        });
    }

    // Logo click (should go home)
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logo clicked');
            showSection('landing');
        });
    }

    console.log('Navigation handlers setup completed');
}

// ✅ ENHANCED UI UPDATE FUNCTION
function updateUIForLoggedInUser() {
    console.log('🔄 Updating UI for logged in user:', currentUser);
    
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    
    if (currentUser) {
        // Show user navigation, hide guest navigation
        if (guestNav) {
            guestNav.classList.add('d-none');
            console.log('✅ Hid guest navigation');
        }
        if (userNav) {
            userNav.classList.remove('d-none');
            console.log('✅ Showed user navigation');
        }
        
        // Update user info in dropdown
        const userDisplayName = document.getElementById('user-display-name');
        const userAvatar = document.getElementById('user-avatar');
        
        if (userDisplayName) {
            userDisplayName.textContent = currentUser.name.split(' ')[0];
            console.log('✅ Updated user display name:', currentUser.name.split(' ')[0]);
        }
        
        if (userAvatar) {
            const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.innerHTML = initials;
            console.log('✅ Updated user avatar with initials:', initials);
        }
        
        // Show auth-required navigation items
        const authRequiredItems = ['nav-dashboard-item', 'nav-skills-item', 'nav-profile-item'];
        authRequiredItems.forEach(itemId => {
            const item = document.getElementById(itemId);
            if (item) {
                item.classList.remove('d-none');
                console.log(`✅ Showing navigation item: ${itemId}`);
            }
        });
        
        // Setup dropdown menu handlers
        setupUserDropdownHandlers();
        
    } else {
        // Show guest navigation, hide user navigation
        if (guestNav) {
            guestNav.classList.remove('d-none');
            console.log('✅ Showed guest navigation');
        }
        if (userNav) {
            userNav.classList.add('d-none');
            console.log('✅ Hid user navigation');
        }
        
        // Hide auth-required navigation items
        const authRequiredItems = ['nav-dashboard-item', 'nav-skills-item', 'nav-profile-item'];
        authRequiredItems.forEach(itemId => {
            const item = document.getElementById(itemId);
            if (item) {
                item.classList.add('d-none');
                console.log(`📦 Hiding navigation item: ${itemId}`);
            }
        });
    }

    console.log('✅ UI update completed');
}

// ✅ SETUP USER DROPDOWN HANDLERS
function setupUserDropdownHandlers() {
    const menuProfile = document.getElementById('menu-profile');
    const menuDashboard = document.getElementById('menu-dashboard');
    const menuActivity = document.getElementById('menu-activity');
    const btnLogout = document.getElementById('btn-logout');
    
    if (menuProfile) {
        menuProfile.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('profile');
        });
    }
    
    if (menuDashboard) {
        menuDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('dashboard');
        });
    }
    
    if (menuActivity) {
        menuActivity.addEventListener('click', (e) => {
            e.preventDefault();
            // Show activity section or toggle activity view
            if (currentSection === 'dashboard') {
                toggleActivityView();
            } else {
                showSection('dashboard');
                // Small delay to ensure dashboard is loaded before showing activity
                setTimeout(toggleActivityView, 100);
            }
        });
    }
    
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
}

// ✅ ENHANCED LOGOUT HANDLER
function handleLogout() {
    TokenManager.removeToken();
    currentUser = null;
    
    // Reset notification badges
    const dashboardBadge = document.getElementById('dashboard-badge');
    const skillsBadge = document.getElementById('skills-badge');
    
    if (dashboardBadge) dashboardBadge.style.display = 'flex';
    if (skillsBadge) skillsBadge.style.display = 'flex';
    
    // Update UI for logged out state
    updateUIForLoggedInUser();
    
    NotificationManager.show('Logged out successfully', 'success');
    showSection('landing');
}

function setupNavSearch() {
    const searchInputs = document.querySelectorAll('.nav-search');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length > 2) {
                // Trigger search functionality
                performNavSearch(searchTerm);
            }
        }, 300));
        
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('search-focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('search-focused');
        });
    });
}

function performNavSearch(searchTerm) {
    console.log('Searching for:', searchTerm);
    // Implement search logic here
    // This could filter skills, users, or navigate to search results
}

function setupQuickActions() {
    const quickSearchBtn = document.getElementById('nav-quick-search');
    const addSkillBtn = document.getElementById('nav-add-skill');
    
    if (quickSearchBtn) {
        quickSearchBtn.addEventListener('click', () => {
            showSection('skills');
            // Focus on search input in skills section
            setTimeout(() => {
                const skillsSearch = document.getElementById('skill-search');
                if (skillsSearch) skillsSearch.focus();
            }, 100);
        });
    }
    
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', () => {
            showGetStartedModal();
        });
    }
}
// ✅ ENHANCED EVENT LISTENERS
function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Navigation event listeners
    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('landing');
        });
    }

    const navHome = document.getElementById('nav-home');
    if (navHome) {
        navHome.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('landing');
        });
    }

    const navDashboard = document.getElementById('nav-dashboard');
    if (navDashboard) {
        navDashboard.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser) {
                showSection('dashboard');
            } else {
                showAuthForm('signin');
            }
        });
    }

    const navSkills = document.getElementById('nav-skills');
    if (navSkills) {
        navSkills.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('skills');
        });
    }

    const navProfile = document.getElementById('nav-profile');
    if (navProfile) {
        navProfile.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentUser) {
                showSection('profile');
            } else {
                showAuthForm('signin');
            }
        });
    }

    // Auth buttons
    const btnSignin = document.getElementById('btn-signin');
    if (btnSignin) {
        btnSignin.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthForm('signin');
        });
    }

    const btnSignup = document.getElementById('btn-signup');
    if (btnSignup) {
        btnSignup.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthForm('signup');
        });
    }

    // Hero buttons
    const heroGetStarted = document.getElementById('hero-get-started');
    if (heroGetStarted) {
        heroGetStarted.addEventListener('click', function(e) {
            e.preventDefault();
            showGetStartedModal();
        });
    }

    const heroLearn = document.getElementById('hero-learn');
    if (heroLearn) {
        heroLearn.addEventListener('click', function(e) {
            e.preventDefault();
            const featuresSection = document.querySelector('.container.py-5');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Form submissions
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignin);
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSave);
    }

    // OTP functionality
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthForm('forgot');
        });
    }

    const backToSignin = document.getElementById('back-to-signin');
    if (backToSignin) {
        backToSignin.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthForm('signin');
        });
    }

    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', handleResetPassword);
    }

    const signInHereLink = document.getElementById('signin-here-link');
    if (signInHereLink) {
        signInHereLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthForm('signin');
        });
    }

    console.log('Event listeners setup completed');
}
// ✅ UPDATE PROFILE DISPLAY FUNCTION
function updateProfileDisplay() {
    if (!currentUser) return;
    
    // Update profile form fields
    const profileName = document.getElementById('profile-name');
    const profileLocation = document.getElementById('profile-location');
    const profileTokens = document.getElementById('profile-tokens');
    const profileExchanges = document.getElementById('profile-exchanges');
    const profileRating = document.getElementById('profile-rating');
    
    if (profileName) profileName.textContent = currentUser.name || 'User Name';
    if (profileLocation) profileLocation.textContent = currentUser.location || 'Location';
    if (profileTokens) profileTokens.textContent = currentUser.timeTokens || 0;
    if (profileExchanges) profileExchanges.textContent = currentUser.exchangesCompleted || 0;
    if (profileRating) profileRating.textContent = currentUser.rating || '0.0';
    
    // Update profile form inputs
    const profileFirstName = document.getElementById('profile-firstname');
    const profileLastName = document.getElementById('profile-lastname');
    const profileEmail = document.getElementById('profile-email');
    const profileLocationInput = document.getElementById('profile-location-input');
    const profileBio = document.getElementById('profile-bio');
    
    if (profileFirstName) profileFirstName.value = currentUser.firstName || currentUser.name?.split(' ')[0] || '';
    if (profileLastName) profileLastName.value = currentUser.lastName || currentUser.name?.split(' ').slice(1).join(' ') || '';
    if (profileEmail) profileEmail.value = currentUser.email || '';
    if (profileLocationInput) profileLocationInput.value = currentUser.location || '';
    if (profileBio) profileBio.value = currentUser.bio || '';
    
    // Update skills lists in profile
    updateProfileSkills();
    
    // Update dashboard stats
    updateDashboardStats();
}
// Scroll reveal animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollReveal);
// ✅ FIXED AUTHENTICATION FORMS
function showAuthForm(type) {
    console.log('Showing auth form:', type);
    showSection('auth');

    const forms = ['signin-form-container', 'signup-form-container', 'forgot-password-container', 'reset-password-container'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) form.classList.add('d-none');
    });

    switch (type) {
        case 'signin':
            document.getElementById('signin-form-container')?.classList.remove('d-none');
            break;
        case 'signup':
            document.getElementById('signup-form-container')?.classList.remove('d-none');
            break;
        case 'forgot':
            document.getElementById('forgot-password-container')?.classList.remove('d-none');
            break;
        case 'reset':
            document.getElementById('reset-password-container')?.classList.remove('d-none');
            break;
    }
}

// ✅ ENHANCED LOGIN HANDLER WITH BETTER ERROR HANDLING
async function handleSignin(e) {
    e.preventDefault();
    
    if (isSubmitting) {
        NotificationManager.show('Please wait, processing your request...', 'info');
        return;
    }
    
    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;

    if (!email || !password) {
        NotificationManager.show('Please enter both email and password', 'error');
        return;
    }

    isSubmitting = true;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;

    try {
        console.log('🔄 Attempting login for:', email);
        
        const credentials = { email, password };
        const response = await loginUser(credentials);
        
        console.log('✅ Login successful:', response);
        
        // ✅ FIXED: Ensure user object has required arrays
        if (response.user) {
            response.user.skillsToLearn = response.user.skillsToLearn || [];
            response.user.skillsToTeach = response.user.skillsToTeach || [];
        }
        
        TokenManager.setToken(response.token);
        currentUser = response.user;
        
        // Initialize activity tracking
        ActivityTracker.initUserActivity();
        startAutoSessionTracking();
        
        // Update UI
        updateUIForLoggedInUser();
        
        NotificationManager.show(response.message || 'Login successful!', 'success');
        
        // Clear form and redirect
        e.target.reset();
        setTimeout(() => showSection('dashboard'), 100);
        
    } catch (error) {
        console.error('❌ Signin error:', error);
        
        // More specific error messages
        if (error.message.includes('Cannot read properties of undefined')) {
            NotificationManager.show('Database error. Please try again or contact support.', 'error');
        } else {
            NotificationManager.show(error.message || 'Login failed. Please check your credentials.', 'error');
        }
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        isSubmitting = false;
    }
}
// ✅ ENHANCED LOGOUT HANDLER
function handleLogout() {
    console.log('Logging out user...');
    
    // Stop activity tracking
    stopAutoSessionTracking();
    
    // Clear authentication data
    TokenManager.removeToken();
    currentUser = null;
    
    // Reset UI to logged out state
    resetUIForLoggedOut();
    
    NotificationManager.show('Logged out successfully', 'success');
    showSection('landing');
}

// ✅ ENHANCED SIGN UP HANDLER
async function handleSignup(e) {
    e.preventDefault();
    
    // Prevent multiple simultaneous submissions
    if (isSubmitting) {
        NotificationManager.show('Please wait, processing your request...', 'info');
        return;
    }
    
    console.log('Signup form submitted');
    
    let name = '';
    const firstName = document.getElementById('signup-firstname')?.value.trim() || '';
    const lastName = document.getElementById('signup-lastname')?.value.trim() || '';
    const fullName = document.getElementById('signup-name')?.value.trim() || '';
    
    // Handle both name formats (split first/last or single name field)
    if (firstName && lastName) {
        name = `${firstName} ${lastName}`.trim();
    } else if (fullName) {
        name = fullName;
    }
    
    const email = document.getElementById('signup-email')?.value.trim() || '';
    const password = document.getElementById('signup-password')?.value || '';
    const confirmPassword = document.getElementById('signup-confirm-password')?.value || '';
    const location = document.getElementById('signup-location')?.value.trim() || '';

    // Validation checks
    if (!name || !email || !password) {
        NotificationManager.show('Please fill in all required fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        NotificationManager.show('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        NotificationManager.show('Password must be at least 6 characters long', 'error');
        return;
    }

    if (!validateEmail(email)) {
        NotificationManager.show('Please enter a valid email address', 'error');
        return;
    }

    // Set submitting state and update UI
    isSubmitting = true;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;

    try {
        const userData = { 
            name, 
            email, 
            password, 
            location
        };
        
        console.log('🔄 Sending registration request:', userData);
        
        const response = await registerUser(userData);
        
        // Store token and user data
        TokenManager.setToken(response.token);
        currentUser = response.user;
        
        NotificationManager.show('Registration successful! Welcome to LocalLink!', 'success');
        updateUIForLoggedInUser();
        showSection('dashboard');
        
    } catch (error) {
        console.error('❌ Signup error:', error);
        NotificationManager.show(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        // Reset UI state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        isSubmitting = false;
    }
}
// ✅ ENHANCED PROFILE SAVE HANDLER
async function handleProfileSave(e) {
    e.preventDefault();
    
    if (!currentUser) {
        NotificationManager.show('Please log in first', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const profileData = {};
    
    for (let [key, value] of formData.entries()) {
        if (key === 'skillsToLearn' || key === 'skillsToTeach') {
            if (!profileData[key]) profileData[key] = [];
            if (value.trim()) profileData[key].push(value.trim());
        } else {
            profileData[key] = value;
        }
    }

    const skillsToLearnContainer = document.getElementById('skills-to-learn-list');
    const skillsToTeachContainer = document.getElementById('skills-to-teach-list');
    
    if (skillsToLearnContainer) {
        const skillTags = skillsToLearnContainer.querySelectorAll('.badge');
        profileData.skillsToLearn = Array.from(skillTags).map(tag => 
            tag.textContent.replace('×', '').trim()
        );
    }
    
    if (skillsToTeachContainer) {
        const skillTags = skillsToTeachContainer.querySelectorAll('.badge');
        profileData.skillsToTeach = Array.from(skillTags).map(tag => 
            tag.textContent.replace('×', '').trim()
        );
    }

    try {
        const response = await updateUserProfile(profileData);
        currentUser = response.user;
        
    } catch (error) {
        console.error('Profile save error:', error);
    }
}
// ✅ ENHANCED LOGOUT HANDLER - PROPERLY RESETS UI
function handleLogout() {
    console.log('Logging out user...');
    
    // Clear authentication data
    TokenManager.removeToken();
    currentUser = null;
    
    // Reset notification badges to show them again
    const dashboardBadge = document.getElementById('dashboard-badge');
    const skillsBadge = document.getElementById('skills-badge');
    
    if (dashboardBadge) {
        dashboardBadge.style.display = 'flex';
        console.log('Dashboard badge reset');
    }
    if (skillsBadge) {
        skillsBadge.style.display = 'flex';
        console.log('Skills badge reset');
    }
    
    // Reset UI to logged out state
    resetUIForLoggedOut();
    
    NotificationManager.show('Logged out successfully', 'success');
    showSection('landing');
    
    console.log('Logout completed');
}

// ✅ RESET UI FOR LOGGED OUT STATE
function resetUIForLoggedOut() {
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    
    console.log('Resetting UI for logged out state...');
    
    // Show guest navigation, hide user navigation
    if (guestNav) {
        guestNav.classList.remove('d-none');
        console.log('Guest navigation shown');
    }
    if (userNav) {
        userNav.classList.add('d-none');
        console.log('User navigation hidden');
    }
    
    // Hide auth-required navigation items
    const authRequiredItems = ['nav-dashboard-item', 'nav-skills-item', 'nav-profile-item'];
    authRequiredItems.forEach(itemId => {
        const item = document.getElementById(itemId);
        if (item) {
            item.classList.add('d-none');
            console.log(`Hidden ${itemId}`);
        }
    });
    
    // Reset user display name and avatar in dropdown (for safety)
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatar = document.getElementById('user-avatar');
    
    if (userDisplayName) {
        userDisplayName.textContent = 'User';
        console.log('User display name reset');
    }
    
    if (userAvatar) {
        userAvatar.innerHTML = '<i class="fas fa-user"></i>';
        console.log('User avatar reset');
    }
    
    // Close any open dropdowns
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
    
    console.log('UI reset completed');
}

// Handle forgot password
async function handleForgotPassword(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();

    if (!email || !validateEmail(email)) {
        NotificationManager.show('Please enter a valid email address', 'error');
        return;
    }

    try {
        await requestPasswordReset(email);
        resetEmail = email;
        showAuthForm('reset');
        NotificationManager.show('OTP sent to your email', 'success');
    } catch (error) {
        console.error('Forgot password error:', error);
    }
}
// Handle reset password
async function handleResetPassword(e) {
    e.preventDefault();
    const otp = document.getElementById('reset-otp').value.trim();
    const newPassword = document.getElementById('reset-new-password').value;
    const confirmPassword = document.getElementById('reset-confirm-password').value;

    if (!otp || otp.length !== 4) {
        NotificationManager.show('Please enter a valid 4-digit OTP', 'error');
        return;
    }

    if (!newPassword || newPassword.length < 6) {
        NotificationManager.show('Password must be at least 6 characters long', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        NotificationManager.show('Passwords do not match', 'error');
        return;
    }

    try {
        await resetPasswordWithOTP(resetEmail, otp, newPassword);
        NotificationManager.show('Password reset successfully', 'success');
        showAuthForm('signin');
        resetEmail = '';
    } catch (error) {
        console.error('Reset password error:', error);
    }
}

// ✅ SECTION NAVIGATION
function showSection(sectionName) {
    console.log('🔄 Showing section:', sectionName);

    // Hide all sections
    const sections = ['landing-page', 'auth-section', 'dashboard-section', 'skills-section', 'profile-section'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('d-none');
            console.log(`📦 Hid section: ${sectionId}`);
        }
    });

    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`) || document.getElementById(`${sectionName}-page`);
    if (targetSection) {
        targetSection.classList.remove('d-none');
        targetSection.classList.add('fade-in');
        console.log(`🎯 Showing section: ${sectionName}`);
    } else {
        console.error(`❌ Target section not found: ${sectionName}`);
    }

    // Update navigation
    updateNavigation(sectionName);
    currentSection = sectionName;

    // Load section-specific content
    switch (sectionName) {
        case 'dashboard':
            console.log('Loading dashboard...');
            loadDashboard();
            break;
        case 'skills':
            console.log('Loading skills...');
            loadSkillsMarketplace();
            break;
        case 'profile':
            console.log('Loading profile...');
            loadProfile();
            break;
    }
}

// ✅ UPDATE DASHBOARD STATS FUNCTION
function updateDashboardStats() {
    if (!currentUser) return;
    
    const userTokens = document.getElementById('user-tokens');
    const userSkillsOffered = document.getElementById('user-skills-offered');
    const userSkillsWanted = document.getElementById('user-skills-wanted');
    
    if (userTokens) userTokens.textContent = currentUser.timeTokens || 0;
    
    const skillsOffered = currentUser.skillsToTeach || currentUser.skillsOffered || [];
    const skillsWanted = currentUser.skillsToLearn || currentUser.skillsWanted || [];
    
    if (userSkillsOffered) userSkillsOffered.textContent = skillsOffered.length;
    if (userSkillsWanted) userSkillsWanted.textContent = skillsWanted.length;
}
function updateNavigation(activeSection) {
    console.log('Updating navigation for:', activeSection);
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current section
    const activeNav = document.getElementById(`nav-${activeSection}`);
    if (activeNav) {
        activeNav.classList.add('active');
        console.log(`✅ Set active nav: nav-${activeSection}`);
    } else {
        console.log(`ℹ️  Nav item not found: nav-${activeSection}`);
    }

    // Show/hide auth-required items
    const authRequiredItems = ['nav-dashboard-item', 'nav-skills-item', 'nav-profile-item'];
    authRequiredItems.forEach(itemId => {
        const item = document.getElementById(itemId);
        if (item) {
            if (currentUser) {
                item.classList.remove('d-none');
                console.log(`✅ Showing auth item: ${itemId}`);
            } else {
                item.classList.add('d-none');
                console.log(`📦 Hiding auth item: ${itemId}`);
            }
        }
    });
}
// ✅ UTILITY FUNCTIONS
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ✅ FIXED GET STARTED FLOW
// ✅ FIXED GET STARTED MODAL FUNCTION
function showGetStartedModal() {
    console.log('Showing Get Started modal');
    try {
        const modalElement = document.getElementById('getStartedModal');
        if (modalElement) {
            // Reset the modal first
            resetGetStartedModal();
            
            // Populate skills before showing the modal
            populateAllSkillSections();
            
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            
            setupGetStartedEventListeners();
            console.log('Get Started modal shown successfully');
        } else {
            console.error('Get Started modal element not found');
        }
    } catch (error) {
        console.error('Error showing Get Started modal:', error);
    }
}
function populateAllSkillSections() {
    console.log('Populating all skill sections');
    const sections = ['learn-skills-section', 'teach-skills-section', 'both-skills-section'];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const mode = sectionId.replace('-skills-section', '');
            populateSkillsForCategory(section, mode);
        }
    });
}

// ✅ ROBUST MODAL OPERATIONS

function showSkillSelection(mode) {
    console.log('Showing skill selection for mode:', mode);
    
    const skillSections = document.querySelectorAll('.skill-selection-section');
    skillSections.forEach(section => {
        section.classList.add('d-none');
    });
    
    let targetSection = '';
    if (mode === 'learn') {
        targetSection = 'learn-skills-section';
    } else if (mode === 'teach') {
        targetSection = 'teach-skills-section';
    } else if (mode === 'both') {
        targetSection = 'both-skills-section';
    }
    
    const skillSection = document.getElementById(targetSection);
    if (skillSection) {
        skillSection.classList.remove('d-none');
        console.log('Skill section shown:', targetSection);
    } else {
        console.error('Skill section not found:', targetSection);
    }
}
function scrollToFeatures() {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
        featuresSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}
function populateSkillsForCategory(container, mode) {
    const skillsContainer = container.querySelector('.skills-container');
    if (!skillsContainer) {
        console.error('Skills container not found for mode:', mode);
        return;
    }
    
    // Clear existing content
    skillsContainer.innerHTML = '';
    
    // Create category sections for better organization
    Object.entries(appData.skillCategories).forEach(([category, skills]) => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section mb-4';
        categorySection.innerHTML = `
            <h6 class="category-header mb-3 p-2 bg-light rounded">
                <strong>${category}</strong>
            </h6>
            <div class="row" id="skills-${mode}-${category.replace(/\s+/g, '-')}">
                <!-- Skills will be populated here -->
            </div>
        `;
        skillsContainer.appendChild(categorySection);
        
        const skillsRow = categorySection.querySelector(`#skills-${mode}-${category.replace(/\s+/g, '-')}`);
        
        // Add skills as checkboxes in a grid layout
        skills.forEach(skill => {
            const skillId = `skill-${mode}-${category.replace(/\s+/g, '-')}-${skill.replace(/\s+/g, '-').toLowerCase()}`;
            const skillCol = document.createElement('div');
            skillCol.className = 'col-md-6 col-lg-4 mb-2';
            skillCol.innerHTML = `
                <div class="form-check">
                    <input class="form-check-input skill-checkbox" type="checkbox" 
                           value="${skill}" id="${skillId}" 
                           data-category="${category}" data-mode="${mode}">
                    <label class="form-check-label skill-label" for="${skillId}">
                        ${skill}
                    </label>
                </div>
            `;
            skillsRow.appendChild(skillCol);
            
            // Add event listener to each checkbox
            const checkboxElement = skillCol.querySelector('input');
            checkboxElement.addEventListener('change', function() {
                handleSkillSelection(skill, category, mode, this.checked);
            });
        });
    });
    
    console.log(`Skills populated for ${mode} mode`);
}
function addSkillSearch(container, mode) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'mb-3';
    searchContainer.innerHTML = `
        <input type="text" class="form-control form-control-sm" 
               placeholder="Search skills..." id="skill-search-${mode}">
    `;
    container.parentNode.insertBefore(searchContainer, container);
    
    const searchInput = document.getElementById(`skill-search-${mode}`);
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const labels = container.querySelectorAll('.skill-label');
            
            labels.forEach(label => {
                const skillText = label.textContent.toLowerCase();
                if (skillText.includes(searchTerm)) {
                    label.parentElement.style.display = 'block';
                } else {
                    label.parentElement.style.display = 'none';
                }
            });
        });
    }
}

// ✅ COMPLETE SAFE SKILL HANDLER
// ✅ COMPLETE SAFE SKILL HANDLER - FIXED VERSION
function handleSkillReference(skill) {
    // Validate skill parameter
    if (typeof skill === 'undefined' || skill === null) {
        console.error('❌ Skill parameter is undefined or null');
        return {
            id: 'unknown',
            name: 'Unnamed Skill',
            category: 'General',
            description: 'No description available',
            providerName: 'Unknown User',
            providerId: null,
            timeRequired: 1,
            location: 'Location not specified',
            rating: 0,
            isActive: true,
            providerOnline: false,
            providerLastSeen: new Date().toISOString()
        };
    }
    
    // Ensure skill has required properties with fallbacks
    const safeSkill = {
        id: skill.id || 'unknown',
        name: skill.name || 'Unnamed Skill',
        category: skill.category || 'General',
        description: skill.description || 'No description available',
        providerName: skill.providerName || skill.provider?.name || 'Unknown User',
        providerId: skill.providerId || skill.provider?.id,
        timeRequired: skill.timeRequired || 1,
        location: skill.location || 'Location not specified',
        rating: skill.rating || 0,
        isActive: skill.isActive !== false, // Default to true
        providerOnline: skill.providerOnline || false,
        providerLastSeen: skill.providerLastSeen || new Date().toISOString()
    };
    
    console.log('✅ Safe skill object:', safeSkill.name);
    return safeSkill;
}

// Example 2: In skill rendering
function renderSkillCard(skill) {
    const safeSkill = handleSkillReference(skill);
    if (!safeSkill) return ''; // Return empty string if skill is invalid
    
    return `
        <div class="skill-card">
            <h3>${safeSkill.name}</h3>
            <p>${safeSkill.description}</p>
            <span class="category">${safeSkill.category}</span>
        </div>
    `;
}

// Example 3: In profile skill management
function addSkillToProfile(skill) {
    const safeSkill = handleSkillReference(skill);
    if (!safeSkill) return;
    
    // Safe to use the skill now
    currentUser.skillsToTeach = currentUser.skillsToTeach || [];
    currentUser.skillsToTeach.push(safeSkill.name);
    
    updateUserProfile({
        skillsToTeach: currentUser.skillsToTeach
    });
}

// ✅ ENHANCED SKILL VALIDATION
function validateSkill(skill) {
    const errors = [];
    
    if (!skill) {
        errors.push('Skill object is null or undefined');
        return { isValid: false, errors };
    }
    
    if (!skill.id && !skill.name) {
        errors.push('Skill must have either id or name');
    }
    
    if (skill.name && typeof skill.name !== 'string') {
        errors.push('Skill name must be a string');
    }
    
    if (skill.name && skill.name.trim().length === 0) {
        errors.push('Skill name cannot be empty');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        skill: errors.length === 0 ? skill : null
    };
}

// ✅ BULK SKILL PROCESSING
function processSkills(skills) {
    if (!Array.isArray(skills)) {
        console.error('Skills must be an array');
        return [];
    }
    
    return skills
        .map(skill => handleSkillReference(skill))
        .filter(skill => skill !== null); // Remove invalid skills
}

function handleSkillSelection(skill, category, mode, isChecked) {
    const skillObj = { skill, category, mode };
    
    if (isChecked) {
        const existingIndex = selectedSkills.findIndex(s => 
            s.skill === skill && s.mode === mode
        );
        
        if (existingIndex === -1) {
            selectedSkills.push(skillObj);
        }
    } else {
        const index = selectedSkills.findIndex(s => 
            s.skill === skill && s.mode === mode
        );
        if (index > -1) {
            selectedSkills.splice(index, 1);
        }
    }
    
    updateSelectedSkillsDisplay();
}

function updateSelectedSkillsDisplay() {
    const selectedSkillsElement = document.getElementById('selected-skills-display');
    if (selectedSkillsElement) {
        if (selectedSkills.length > 0) {
            const learnSkills = selectedSkills.filter(s => s.mode === 'learn' || s.mode === 'both');
            const teachSkills = selectedSkills.filter(s => s.mode === 'teach' || s.mode === 'both');
            
            selectedSkillsElement.innerHTML = `
                <div class="selected-skills-summary">
                    <h6 class="mb-3">Selected Skills Summary</h6>
                    <div class="row">
                        ${learnSkills.length > 0 ? `
                            <div class="col-md-6">
                                <div class="card border-primary">
                                    <div class="card-header bg-primary text-white py-2">
                                        <h6 class="mb-0">Skills to Learn (${learnSkills.length})</h6>
                                    </div>
                                    <div class="card-body p-3">
                                        <div class="d-flex flex-wrap gap-2">
                                            ${learnSkills.map(skill => 
                                                `<span class="badge bg-primary">${skill.skill}</span>`
                                            ).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        ${teachSkills.length > 0 ? `
                            <div class="col-md-6">
                                <div class="card border-success">
                                    <div class="card-header bg-success text-white py-2">
                                        <h6 class="mb-0">Skills to Teach (${teachSkills.length})</h6>
                                    </div>
                                    <div class="card-body p-3">
                                        <div class="d-flex flex-wrap gap-2">
                                            ${teachSkills.map(skill => 
                                                `<span class="badge bg-success">${skill.skill}</span>`
                                            ).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="mt-3 text-center">
                        <small class="text-muted">
                            <i class="fas fa-info-circle me-1"></i>
                            These skills will be saved to your profile and visible to other users
                        </small>
                    </div>
                </div>
            `;
        } else {
            selectedSkillsElement.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-clipboard-list fa-2x text-muted mb-2"></i>
                    <p class="text-muted mb-0">No skills selected yet</p>
                    <small class="text-muted">Choose skills from the categories above</small>
                </div>
            `;
        }
    }
}
// ✅ NEW CANCEL HANDLER
// ✅ ENHANCED CANCEL HANDLER
function handleGetStartedCancel() {
    console.log('Get Started modal cancelled');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('getStartedModal'));
    if (modal) {
        modal.hide();
    }
    
    // Reset modal state
    resetGetStartedModal();
    
    NotificationManager.show('Skill selection cancelled', 'info');
    
    // Optionally navigate to home on cancel as well
    // showSection('landing');
}

// ✅ NEW CONTINUE HANDLER - SAVES SKILLS TO DATABASE
// ✅ NEW CONTINUE HANDLER - SAVES SKILLS TO DATABASE
// ✅ NEW CONTINUE HANDLER - SAVES SKILLS TO DATABASE (MERGE WITH EXISTING)
// ✅ ENHANCED CONTINUE HANDLER - SAVES SKILLS AND NAVIGATES HOME
async function handleGetStartedContinue() {
    if (!currentGetStartedMode) {
        NotificationManager.show('Please select what you want to do', 'error');
        return;
    }
    
    if (selectedSkills.length === 0) {
        NotificationManager.show('Please select at least one skill', 'error');
        return;
    }
    
    try {
        const submitBtn = document.getElementById('get-started-continue');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;

        if (currentUser) {
            const learnSkills = selectedSkills
                .filter(skill => skill.mode === 'learn' || skill.mode === 'both')
                .map(skill => skill.skill);
                
            const teachSkills = selectedSkills
                .filter(skill => skill.mode === 'teach' || skill.mode === 'both')
                .map(skill => skill.skill);
            
            // Merge with existing skills instead of replacing
            const existingLearnSkills = currentUser.skillsToLearn || currentUser.skillsWanted || [];
            const existingTeachSkills = currentUser.skillsToTeach || currentUser.skillsOffered || [];
            
            const mergedLearnSkills = [...new Set([...existingLearnSkills, ...learnSkills])];
            const mergedTeachSkills = [...new Set([...existingTeachSkills, ...teachSkills])];
            
            // Prepare skills data for database
            const skillsData = {
                skillsToLearn: mergedLearnSkills,
                skillsToTeach: mergedTeachSkills
            };
            
            console.log('🔄 Saving skills to database (merged):', skillsData);
            
            // Save skills to user profile
            const response = await updateUserProfile(skillsData);
            
            // Update current user data with the response
            if (response.user) {
                currentUser = response.user;
            } else {
                // Fallback: update locally
                currentUser.skillsToLearn = mergedLearnSkills;
                currentUser.skillsToTeach = mergedTeachSkills;
            }
            
            // Create skill listings for teaching skills (only new ones)
            const newTeachSkills = teachSkills.filter(skill => !existingTeachSkills.includes(skill));
            if (newTeachSkills.length > 0) {
                await createSkillListings(newTeachSkills);
            }
            
            // ✅ GUARANTEED NAVIGATION BACK TO HOME
            safeModalHide();
            resetGetStartedModal();
            
            // Update the profile display immediately
            updateProfileDisplay();
            
            // Refresh the skills page to show new listings
            if (currentSection === 'skills') {
                await loadSkills();
            }
            
            // Navigate to home
            safeShowSection('landing');
            
            // Show success message
            handleSkillsSaveSuccess(selectedSkills.length);
            
        } else {
            // User not logged in
            safeModalHide();
            resetGetStartedModal();
            showAuthForm('signup');
            NotificationManager.show('Please create an account to save your selected skills', 'info');
            
            sessionStorage.setItem('pendingSkills', JSON.stringify(selectedSkills));
            sessionStorage.setItem('pendingMode', currentGetStartedMode);
        }
    } catch (error) {
        console.error('Error in Get Started flow:', error);
        NotificationManager.show('Failed to save skills: ' + error.message, 'error');
        
        // Ensure button is re-enabled on error
        const submitBtn = document.getElementById('get-started-continue');
        if (submitBtn) {
            submitBtn.innerHTML = 'Continue';
            submitBtn.disabled = false;
        }
        
        // Still navigate to home even on error
        safeModalHide();
        resetGetStartedModal();
        safeShowSection('landing');
    }
}

// ✅ SAFE MODAL OPERATIONS
function safeModalHide() {
    try {
        const modalElement = document.getElementById('getStartedModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            } else {
                // If no instance exists, hide manually
                modalElement.style.display = 'none';
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
            }
        }
    } catch (error) {
        console.error('Error hiding modal:', error);
        // Fallback: redirect to home
        showSection('landing');
    }
}

function safeModalHide(modalId) {
    try {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            } else {
                modalElement.style.display = 'none';
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
            }
        }
    } catch (error) {
        console.error('Error hiding modal:', error);
    }
}

// Safe section navigation
function safeShowSection(sectionName) {
    try {
        showSection(sectionName);
    } catch (error) {
        console.error('Error showing section:', error);
        // Fallback to landing page
        const landingSection = document.getElementById('landing-page');
        if (landingSection) {
            document.querySelectorAll('[id$="-section"], [id$="-page"]').forEach(el => {
                el.classList.add('d-none');
            });
            landingSection.classList.remove('d-none');
        }
    }
}


// ✅ ENHANCED RESET GET STARTED MODAL
function resetGetStartedModal() {
    console.log('Resetting Get Started modal');
    
    // Reset option cards
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Reset checkboxes
    document.querySelectorAll('.skill-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Hide all skill sections
    const skillSections = document.querySelectorAll('.skill-selection-section');
    skillSections.forEach(section => {
        section.classList.add('d-none');
    });
    
    // Clear selected skills
    currentGetStartedMode = null;
    selectedSkills = [];
    
    // Clear selected skills display
    const selectedSkillsElement = document.getElementById('selected-skills-display');
    if (selectedSkillsElement) {
        selectedSkillsElement.innerHTML = '<p class="text-muted text-center mb-0">No skills selected yet</p>';
    }
    
    // Re-enable continue button
    const continueButton = document.getElementById('get-started-continue');
    if (continueButton) {
        continueButton.innerHTML = 'Continue';
        continueButton.disabled = false;
    }
    
    console.log('Get Started modal reset completed');
}

// ✅ HANDLE MODAL CLOSE EVENTS
function setupModalEventListeners() {
    const getStartedModal = document.getElementById('getStartedModal');
    if (getStartedModal) {
        getStartedModal.addEventListener('hidden.bs.modal', function() {
            console.log('Get Started modal closed');
            // Reset modal state when closed
            resetGetStartedModal();
        });
        
        getStartedModal.addEventListener('show.bs.modal', function() {
            console.log('Get Started modal opened');
            // Ensure modal is properly reset when opened
            resetGetStartedModal();
        });
    }
}

function startAutoSessionTracking() {
    if (!currentUser) return;
    
    // End any existing session first
    stopAutoSessionTracking();
    
    // Start new session
    ActivityTracker.startSession();
    
    // Update session every minute
    sessionInterval = setInterval(() => {
        if (currentUser) {
            ActivityTracker.endSession();
            ActivityTracker.startSession();
        }
    }, 60000);
}

function stopAutoSessionTracking() {
    if (sessionInterval) {
        clearInterval(sessionInterval);
        sessionInterval = null;
    }
    if (currentUser) {
        ActivityTracker.endSession();
    }
}

// ✅ ENHANCED GET STARTED EVENT LISTENERS
function setupGetStartedEventListeners() {
    console.log('Setting up Get Started event listeners');
    
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            console.log('Option card clicked:', this.getAttribute('data-mode'));
            optionCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            const mode = this.getAttribute('data-mode');
            currentGetStartedMode = mode;
            showSkillSelection(mode);
        });
    });
    
    // Ensure continue button has proper event listener
    const continueButton = document.getElementById('get-started-continue');
    const cancelButton = document.getElementById('get-started-cancel');
    
    if (continueButton) {
        // Remove any existing event listeners
        continueButton.replaceWith(continueButton.cloneNode(true));
        const newContinueButton = document.getElementById('get-started-continue');
        newContinueButton.addEventListener('click', handleGetStartedContinue);
    }
    
    if (cancelButton) {
        cancelButton.replaceWith(cancelButton.cloneNode(true));
        const newCancelButton = document.getElementById('get-started-cancel');
        newCancelButton.addEventListener('click', handleGetStartedCancel);
    }
    
    console.log('Get Started event listeners setup completed');
}
async function createSkillListings(teachSkills) {
    try {
        console.log('🔄 Creating skill listings for:', teachSkills);
        
        for (const skillName of teachSkills) {
            const category = findCategoryForSkill(skillName);
            
            const skillData = {
                name: skillName,
                category: category,
                description: `Learn ${skillName} from ${currentUser.name}. ${getDefaultDescription(skillName)}`,
                timeRequired: 1,
                location: currentUser.location || 'Online'
            };
            
            console.log(`🔄 Creating skill: ${skillName}`);
            
            const response = await apiRequest('/skills', {
                method: 'POST',
                body: skillData
            });
            
            console.log(`✅ Skill created: ${skillName}`, response);
        }
    } catch (error) {
        console.error('❌ Error creating skill listings:', error);
        // Don't throw error here to avoid blocking the main flow
        NotificationManager.show('Some skills could not be listed: ' + error.message, 'warning');
    }
}
// ✅ HELPER FUNCTION TO FIND CATEGORY FOR A SKILL
function findCategoryForSkill(skillName) {
    for (const [category, skills] of Object.entries(appData.skillCategories)) {
        if (skills.includes(skillName)) {
            return category;
        }
    }
    return 'Lifestyle 🍳'; // Default category
}

// ✅ HELPER FUNCTION TO GENERATE DEFAULT DESCRIPTIONS
function getDefaultDescription(skillName) {
    const descriptions = {
        'Graphic Design': 'Learn design principles, color theory, and software basics to create stunning visuals.',
        'Photography & Photo Editing': 'Master camera settings, composition, and editing techniques for professional photos.',
        'Web Development': 'Build responsive websites using HTML, CSS, and JavaScript fundamentals.',
        'Yoga Instruction': 'Learn basic poses, breathing techniques, and mindfulness practices.',
        'Cooking & Baking': 'Discover essential cooking techniques and recipes for delicious home meals.',
        'Acoustic Guitar Lessons': 'Start your musical journey with chords, strumming patterns, and simple songs.'
    };
    
    return descriptions[skillName] || 'Personalized instruction tailored to your learning goals and experience level.';
}

// ✅ ADDITIONAL CSS FOR BETTER SKILL SELECTION UI
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    .category-section {
        border-left: 3px solid #007bff;
        padding-left: 15px;
    }
    
    .category-header {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border-left: 4px solid #007bff;
    }
    
    .skill-checkbox:checked + .skill-label {
        font-weight: 600;
        color: #007bff;
    }
    
    .selected-skills-summary {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
    }
    
    .option-card {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .option-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .option-card.selected {
        border-color: #007bff;
        background-color: #f8f9ff;
    }
    
    .form-check-input:checked {
        background-color: #007bff;
        border-color: #007bff;
    }
`;
document.head.appendChild(enhancedStyles);
async function handleGetStartedDone() {
    if (!currentGetStartedMode) {
        NotificationManager.show('Please select what you want to do', 'error');
        return;
    }
    
    if (selectedSkills.length === 0) {
        NotificationManager.show('Please select at least one skill', 'error');
        return;
    }
    
    try {
        if (currentUser) {
            const profileData = {};
            
            const learnSkills = selectedSkills
                .filter(skill => skill.mode === 'learn' || skill.mode === 'both')
                .map(skill => skill.skill);
                
            const teachSkills = selectedSkills
                .filter(skill => skill.mode === 'teach' || skill.mode === 'both')
                .map(skill => skill.skill);
            
            if (learnSkills.length > 0) {
                profileData.skillsToLearn = learnSkills;
            }
            
            if (teachSkills.length > 0) {
                profileData.skillsToTeach = teachSkills;
            }
            
            await updateUserProfile(profileData);
            
            currentUser.skillsToLearn = learnSkills;
            currentUser.skillsToTeach = teachSkills;
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('getStartedModal'));
            if (modal) {
                modal.hide();
            }
            
            loadDashboard();
            
            NotificationManager.show('Skills updated successfully!', 'success');
        } else {
            const modal = bootstrap.Modal.getInstance(document.getElementById('getStartedModal'));
            if (modal) {
                modal.hide();
            }
            
            showAuthForm('signup');
            NotificationManager.show('Please create an account to save your skills', 'info');
        }
    } catch (error) {
        console.error('Error saving skills:', error);
        NotificationManager.show('Failed to save skills', 'error');
    }
}

// Profile Management Functions
// Profile Management Functions
function loadProfile() {
    if (!currentUser) {
        showAuthForm('signin');
        return;
    }

    updateProfileDisplay(); // Use the new unified function
}

// ✅ ENHANCED PROFILE SKILLS MANAGEMENT
function updateProfileSkills() {
    const skillsOfferedList = document.getElementById('skills-offered-list');
    const skillsWantedList = document.getElementById('skills-wanted-list');

    // Use the new field names (skillsToTeach and skillsToLearn)
    const skillsToTeach = currentUser.skillsToTeach || currentUser.skillsOffered || [];
    const skillsToLearn = currentUser.skillsToLearn || currentUser.skillsWanted || [];

    if (skillsOfferedList) {
        skillsOfferedList.innerHTML = skillsToTeach.length > 0 ? 
            skillsToTeach.map(skill => 
                `<span class="badge bg-success me-1 mb-1 skill-badge" data-skill="${skill}" data-type="teach">
                    ${skill} 
                    <span class="remove-skill" style="cursor: pointer; margin-left: 5px;">×</span>
                </span>`
            ).join('') :
            '<p class="text-muted small">No skills offered yet</p>';
    }

    if (skillsWantedList) {
        skillsWantedList.innerHTML = skillsToLearn.length > 0 ? 
            skillsToLearn.map(skill => 
                `<span class="badge bg-primary me-1 mb-1 skill-badge" data-skill="${skill}" data-type="learn">
                    ${skill} 
                    <span class="remove-skill" style="cursor: pointer; margin-left: 5px;">×</span>
                </span>`
            ).join('') :
            '<p class="text-muted small">No skills wanted yet</p>';
    }

    // Add event listeners to remove buttons
    setupSkillRemoveListeners();
}

// ✅ SETUP SKILL REMOVE LISTENERS
function setupSkillRemoveListeners() {
    document.querySelectorAll('.remove-skill').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const badge = this.closest('.skill-badge');
            const skill = badge.getAttribute('data-skill');
            const type = badge.getAttribute('data-type');
            removeSkillFromProfile(type, skill);
        });
    });
}

// ✅ REMOVE SKILL FROM PROFILE (INDIVIDUAL)
async function removeSkillFromProfile(type, skillToRemove) {
    if (!currentUser) return;

    try {
        // Get current skills
        const skillsToLearn = currentUser.skillsToLearn || currentUser.skillsWanted || [];
        const skillsToTeach = currentUser.skillsToTeach || currentUser.skillsOffered || [];

        // Remove the specific skill
        let updatedLearnSkills, updatedTeachSkills;

        if (type === 'learn') {
            updatedLearnSkills = skillsToLearn.filter(skill => skill !== skillToRemove);
            updatedTeachSkills = skillsToTeach;
        } else {
            updatedLearnSkills = skillsToLearn;
            updatedTeachSkills = skillsToTeach.filter(skill => skill !== skillToRemove);
        }

        // Prepare update data
        const updateData = {
            skillsToLearn: updatedLearnSkills,
            skillsToTeach: updatedTeachSkills
        };

        // Update in database
        const response = await updateUserProfile(updateData);

        // Update current user
        if (response.user) {
            currentUser = response.user;
        } else {
            currentUser.skillsToLearn = updatedLearnSkills;
            currentUser.skillsToTeach = updatedTeachSkills;
        }

        // Update UI
        updateProfileDisplay();

        NotificationManager.show(`Removed ${skillToRemove} from your ${type === 'learn' ? 'skills wanted' : 'skills offered'}`, 'success');

    } catch (error) {
        console.error('Error removing skill:', error);
        NotificationManager.show('Failed to remove skill: ' + error.message, 'error');
    }
}

// ✅ ADD SKILL FROM PROFILE INPUT (MERGE WITH EXISTING)
async function addSkillFromProfile(type) {
    if (!currentUser) {
        NotificationManager.show('Please log in to manage skills', 'error');
        return;
    }

    const inputId = type === 'teach' ? 'new-skill-offered' : 'new-skill-wanted';
    const input = document.getElementById(inputId);
    const newSkill = input.value.trim();

    if (!newSkill) {
        NotificationManager.show('Please enter a skill', 'error');
        return;
    }

    try {
        // Get current skills
        const currentLearnSkills = currentUser.skillsToLearn || currentUser.skillsWanted || [];
        const currentTeachSkills = currentUser.skillsToTeach || currentUser.skillsOffered || [];

        let updatedLearnSkills, updatedTeachSkills;

        if (type === 'learn') {
            // Check if skill already exists
            if (currentLearnSkills.includes(newSkill)) {
                NotificationManager.show('Skill already in your wanted list', 'warning');
                input.value = '';
                return;
            }
            updatedLearnSkills = [...currentLearnSkills, newSkill];
            updatedTeachSkills = currentTeachSkills;
        } else {
            // Check if skill already exists
            if (currentTeachSkills.includes(newSkill)) {
                NotificationManager.show('Skill already in your offered list', 'warning');
                input.value = '';
                return;
            }
            updatedLearnSkills = currentLearnSkills;
            updatedTeachSkills = [...currentTeachSkills, newSkill];
        }

        // Prepare update data
        const updateData = {
            skillsToLearn: updatedLearnSkills,
            skillsToTeach: updatedTeachSkills
        };

        // Update in database
        const response = await updateUserProfile(updateData);

        // Update current user
        if (response.user) {
            currentUser = response.user;
        } else {
            currentUser.skillsToLearn = updatedLearnSkills;
            currentUser.skillsToTeach = updatedTeachSkills;
        }

        // Clear input
        input.value = '';

        // Update UI
        updateProfileDisplay();

        // Create skill listing if it's a teaching skill
        if (type === 'teach') {
            await createSkillListings([newSkill]);
        }

        NotificationManager.show(`Added ${newSkill} to your ${type === 'learn' ? 'skills wanted' : 'skills offered'}`, 'success');

    } catch (error) {
        console.error('Error adding skill:', error);
        NotificationManager.show('Failed to add skill: ' + error.message, 'error');
    }
}
// Dashboard Functions
function loadDashboard() {
    if (!currentUser) {
        showAuthForm('signin');
        return;
    }

    const userName = document.getElementById('dashboard-user-name');
    const userTokens = document.getElementById('dashboard-user-tokens');
    const userSkillsOffered = document.getElementById('dashboard-skills-offered');
    const userSkillsWanted = document.getElementById('dashboard-skills-wanted');

    if (userName) userName.textContent = currentUser.name;
    if (userTokens) userTokens.textContent = currentUser.timeTokens || 0;
    
   // In the loadDashboard function, replace the skills counting part:
const skillsToTeach = currentUser.skillsToTeach || currentUser.skillsOffered || [];
const skillsToLearn = currentUser.skillsToLearn || currentUser.skillsWanted || [];

if (userSkillsOffered) userSkillsOffered.textContent = skillsToTeach.length;
if (userSkillsWanted) userSkillsWanted.textContent = skillsToLearn.length;

    setupDashboardQuickActions();
}

// ✅ FIXED DASHBOARD QUICK ACTIONS
function setupDashboardQuickActions() {
    console.log('Setting up dashboard quick actions...');

    // Browse Skills Button
    const browseSkillsBtn = document.getElementById('browse-skills-btn');
    if (browseSkillsBtn) {
        // Remove existing event listeners
        browseSkillsBtn.replaceWith(browseSkillsBtn.cloneNode(true));
        const newBrowseBtn = document.getElementById('browse-skills-btn');
        
        newBrowseBtn.addEventListener('click', function() {
            console.log('Browse Skills button clicked');
            showSection('skills');
        });
    }

    // Manage Profile Button
    const manageProfileBtn = document.getElementById('manage-profile-btn');
    if (manageProfileBtn) {
        manageProfileBtn.replaceWith(manageProfileBtn.cloneNode(true));
        const newManageBtn = document.getElementById('manage-profile-btn');
        
        newManageBtn.addEventListener('click', function() {
            console.log('Manage Profile button clicked');
            showSection('profile');
        });
    }

    // View Activity Button
    const viewActivityBtn = document.getElementById('view-activity-btn');
    if (viewActivityBtn) {
        viewActivityBtn.replaceWith(viewActivityBtn.cloneNode(true));
        const newActivityBtn = document.getElementById('view-activity-btn');
        
        newActivityBtn.addEventListener('click', function() {
            console.log('View Activity button clicked');
            toggleActivityView();
        });
    }

    // Add Skills Button
    const addSkillsBtn = document.getElementById('add-skills-btn');
    if (addSkillsBtn) {
        addSkillsBtn.replaceWith(addSkillsBtn.cloneNode(true));
        const newAddSkillsBtn = document.getElementById('add-skills-btn');
        
        newAddSkillsBtn.addEventListener('click', function() {
            console.log('Add Skills button clicked');
            showGetStartedModal();
        });
    }

    console.log('Dashboard quick actions setup completed');
}
// Activity Tracking
let userActivity = {
    dailyActivity: [],
    skillHistory: [],
    weeklyStats: {
        hoursLearned: 0,
        hoursTaught: 0,
        exchangesCompleted: 0
    }
};

// ✅ FIXED ACTIVITY VIEW TOGGLE FUNCTION
function toggleActivityView() {
    console.log('Toggling activity view');
    
    const dashboardContent = document.getElementById('dashboard-content');
    const activityContent = document.getElementById('activity-content');
    
    if (!dashboardContent || !activityContent) {
        console.error('Dashboard or activity content elements not found');
        return;
    }
    
    if (dashboardContent.classList.contains('d-none')) {
        // Show dashboard, hide activity
        console.log('Showing dashboard, hiding activity');
        dashboardContent.classList.remove('d-none');
        activityContent.classList.add('d-none');
        
        // Update button text if needed
        const viewActivityBtn = document.getElementById('view-activity-btn');
        if (viewActivityBtn) {
            viewActivityBtn.innerHTML = '<i class="fas fa-chart-line me-2"></i>View Activity';
        }
    } else {
        // Show activity, hide dashboard
        console.log('Showing activity, hiding dashboard');
        dashboardContent.classList.add('d-none');
        activityContent.classList.remove('d-none');
        
        // Update button text if needed
        const viewActivityBtn = document.getElementById('view-activity-btn');
        if (viewActivityBtn) {
            viewActivityBtn.innerHTML = '<i class="fas fa-tachometer-alt me-2"></i>Back to Dashboard';
        }
        
        // Render activity dashboard
        renderActivityDashboard();
    }
}

// ✅ ENHANCED ACTIVITY DASHBOARD RENDERING
function renderActivityDashboard() {
    console.log('Rendering activity dashboard');
    const stats = ActivityTracker.getActivityStats();
    if (!stats) {
        renderEmptyActivityState();
        return;
    }
    renderActivityStats(stats);
    renderWeeklyActivityChart(stats.weeklyActivity);
    renderSkillsProgressChart(stats.learningProgress);
    renderCoursesCompleted(stats);
}


// ✅ FIXED RENDER ACTIVITY STATS
function renderActivityStats(stats) {
    const statsContainer = document.getElementById('weekly-stats');
    if (!statsContainer) {
        console.error('Weekly stats container not found');
        return;
    }
    
    statsContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">Your Learning Statistics</h6>
            </div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-4">
                        <div class="stat-value text-primary">${stats.totalHoursActive.toFixed(1)}</div>
                        <div class="stat-label small text-muted">Total Hours</div>
                    </div>
                    <div class="col-4">
                        <div class="stat-value text-success">${stats.coursesCompleted}</div>
                        <div class="stat-label small text-muted">Courses Completed</div>
                    </div>
                    <div class="col-4">
                        <div class="stat-value text-info">${stats.skillsLearned}</div>
                        <div class="stat-label small text-muted">Skills Learned</div>
                    </div>
                </div>
                <div class="mt-3">
                    <small class="text-muted">
                        <i class="fas fa-info-circle me-1"></i>
                        Tracked automatically while you use the app
                    </small>
                </div>
            </div>
        </div>
    `;
}

// ✅ FIXED RENDER WEEKLY ACTIVITY CHART
function renderWeeklyActivityChart(weeklyActivity) {
    const chartContainer = document.getElementById('daily-activity-chart');
    if (!chartContainer) {
        console.error('Daily activity chart container not found');
        return;
    }

    const maxHours = Math.max(...weeklyActivity.map(day => day.hours), 1);
    
    chartContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">Weekly Activity Hours</h6>
            </div>
            <div class="card-body">
                <div class="activity-bars d-flex align-items-end justify-content-between" style="height: 200px;">
                    ${weeklyActivity.map(day => `
                        <div class="bar-container text-center mx-1" style="flex: 1;">
                            <div class="bar bg-primary mb-1 rounded-top" 
                                 style="height: ${(day.hours / maxHours) * 160}px; 
                                        transition: height 0.5s ease;
                                        position: relative;">
                                <div class="bar-tooltip" 
                                     style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); 
                                            background: #333; color: white; padding: 2px 6px; border-radius: 3px; 
                                            font-size: 12px; white-space: nowrap; display: none;">
                                    ${day.hours.toFixed(1)}h
                                </div>
                            </div>
                            <div class="bar-label small">
                                <div class="fw-bold">${day.hours.toFixed(1)}h</div>
                                <div class="text-muted">${day.day}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-3 text-center">
                    <small class="text-muted">
                        <i class="fas fa-chart-bar me-1"></i>
                        Hours spent learning and browsing skills
                    </small>
                </div>
            </div>
        </div>
    `;
    
    // Add hover effects to bars
    setTimeout(() => {
        const bars = chartContainer.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.addEventListener('mouseenter', function() {
                const tooltip = this.querySelector('.bar-tooltip');
                if (tooltip) tooltip.style.display = 'block';
            });
            bar.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.bar-tooltip');
                if (tooltip) tooltip.style.display = 'none';
            });
        });
    }, 100);
}

// ✅ FIXED RENDER SKILLS PROGRESS CHART
function renderSkillsProgressChart(learningProgress) {
    const skills = ActivityTracker.getSkillsWithHours();
    const historyContainer = document.getElementById('skill-history');
    if (!historyContainer) {
        console.error('Skill history container not found');
        return;
    }
    
    if (skills.length === 0) {
        historyContainer.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0">Skills Progress</h6>
                </div>
                <div class="card-body text-center py-5">
                    <i class="fas fa-graduation-cap fa-3x text-muted mb-3"></i>
                    <h5>No Skills Learned Yet</h5>
                    <p class="text-muted">Start learning skills to track your progress here!</p>
                    <button class="btn btn-primary mt-2" onclick="showSection('skills')">
                        Browse Skills
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    historyContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">Skills Progress</h6>
            </div>
            <div class="card-body">
                <div class="skills-progress">
                    ${skills.map(skill => `
                        <div class="skill-progress-item mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <strong>${skill.name}</strong>
                                <span class="text-muted small">${skill.hours.toFixed(1)} hours</span>
                            </div>
                            <div class="progress" style="height: 8px;">
                                <div class="progress-bar bg-success" 
                                     role="progressbar" 
                                     style="width: ${Math.min((skill.hours / 10) * 100, 100)}%"
                                     aria-valuenow="${Math.min((skill.hours / 10) * 100, 100)}" 
                                     aria-valuemin="0" 
                                     aria-valuemax="100">
                                </div>
                            </div>
                            <div class="d-flex justify-content-between mt-1">
                                <small class="text-muted">${skill.courses} course${skill.courses !== 1 ? 's' : ''}</small>
                                <small class="text-muted">
                                    ${skill.hours >= 10 ? 'Expert' : skill.hours >= 5 ? 'Intermediate' : 'Beginner'}
                                </small>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ✅ FIXED RENDER EMPTY ACTIVITY STATE
function renderEmptyActivityState() {
    const activityContent = document.getElementById('activity-content');
    if (!activityContent) {
        console.error('Activity content container not found');
        return;
    }
    
    activityContent.innerHTML = `
        <div class="row mb-4">
            <div class="col-12">
                <button class="btn btn-outline-primary btn-sm" onclick="toggleActivityView()">
                    <i class="fas fa-arrow-left me-1"></i> Back to Dashboard
                </button>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12">
                <div class="card text-center py-5">
                    <i class="fas fa-chart-line fa-4x text-muted mb-3"></i>
                    <h3>No Activity Data Yet</h3>
                    <p class="text-muted mb-4">Start using the app to track your learning progress and activity.</p>
                    <div class="d-flex justify-content-center gap-3">
                        <button class="btn btn-primary" onclick="showSection('skills')">
                            <i class="fas fa-search me-2"></i>Browse Skills
                        </button>
                        <button class="btn btn-outline-primary" onclick="toggleActivityView()">
                            <i class="fas fa-tachometer-alt me-2"></i>Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ✅ FIXED DASHBOARD QUICK ACTIONS SETUP
function setupDashboardQuickActions() {
    console.log('Setting up dashboard quick actions');
    
    // Browse Skills Button
    const browseSkillsBtn = document.getElementById('browse-skills-btn');
    if (browseSkillsBtn) {
        browseSkillsBtn.addEventListener('click', function() {
            console.log('Browse Skills button clicked');
            showSection('skills');
            
            // Start activity tracking for skills browsing
            ActivityTracker.trackSkillProgress('Skills Browsing', 0.1, 'browsing');
        });
    }

    // Manage Profile Button
    const manageProfileBtn = document.getElementById('manage-profile-btn');
    if (manageProfileBtn) {
        manageProfileBtn.addEventListener('click', function() {
            console.log('Manage Profile button clicked');
            showSection('profile');
            
            // Track profile management activity
            ActivityTracker.trackSkillProgress('Profile Management', 0.1, 'profile_updated');
        });
    }

    // View Activity Button - FIXED
    const viewActivityBtn = document.getElementById('view-activity-btn');
    if (viewActivityBtn) {
        // Remove any existing event listeners
        viewActivityBtn.replaceWith(viewActivityBtn.cloneNode(true));
        const newViewActivityBtn = document.getElementById('view-activity-btn');
        
        newViewActivityBtn.addEventListener('click', function() {
            console.log('View Activity button clicked');
            toggleActivityView();
        });
    }

    // Add Skills Button
    const addSkillsBtn = document.getElementById('add-skills-btn');
    if (addSkillsBtn) {
        addSkillsBtn.addEventListener('click', function() {
            console.log('Add Skills button clicked');
            showGetStartedModal();
        });
    }
}

// ✅ ADD MISSING FUNCTION FOR COURSES COMPLETED
function renderCoursesCompleted(stats) {
    const coursesContainer = document.getElementById('courses-completed');
    if (!coursesContainer) return;
    
    coursesContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">Learning Achievements</h6>
            </div>
            <div class="card-body">
                <div class="text-center">
                    <div class="mb-3">
                        <i class="fas fa-trophy fa-3x text-warning"></i>
                    </div>
                    <h4>${stats.coursesCompleted} Courses Completed</h4>
                    <p class="text-muted">Great progress! Keep learning new skills.</p>
                    ${stats.coursesCompleted === 0 ? `
                        <button class="btn btn-primary" onclick="showSection('skills')">
                            Start Your First Course
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// ✅ MAKE FUNCTIONS GLOBALLY ACCESSIBLE
window.toggleActivityView = toggleActivityView;
window.renderActivityDashboard = renderActivityDashboard;

function loadUserActivity() {
    userActivity = {
        dailyActivity: generateDailyActivity(),
        skillHistory: generateSkillHistory(),
        weeklyStats: generateWeeklyStats()
    };
}

function generateDailyActivity() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
        day,
        hours: Math.floor(Math.random() * 8),
        exchanges: Math.floor(Math.random() * 5)
    }));
}

function generateSkillHistory() {
    const skills = currentUser?.skillsToLearn?.concat(currentUser?.skillsToTeach || []) || ['Graphic Design', 'Web Development', 'Yoga'];
    return skills.map(skill => ({
        skill,
        type: Math.random() > 0.5 ? 'learned' : 'taught',
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        hours: Math.floor(Math.random() * 10) + 1
    }));
}

function generateWeeklyStats() {
    return {
        hoursLearned: Math.floor(Math.random() * 20) + 5,
        hoursTaught: Math.floor(Math.random() * 15) + 3,
        exchangesCompleted: Math.floor(Math.random() * 8) + 1
    };
}

function renderActivityCharts() {
    loadUserActivity();
    renderDailyActivityChart();
    renderSkillHistory();
    renderWeeklyStats();
}

function renderDailyActivityChart() {
    const chartContainer = document.getElementById('daily-activity-chart');
    if (!chartContainer) return;

    const activityData = userActivity.dailyActivity;
    
    chartContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">Daily Activity (This Week)</h6>
            </div>
            <div class="card-body">
                <div class="activity-bars d-flex align-items-end justify-content-between" style="height: 200px;">
                    ${activityData.map(day => `
                        <div class="bar-container text-center mx-1" style="flex: 1;">
                            <div class="bar bg-primary mb-1" style="height: ${day.hours * 20}px; transition: height 0.5s ease;"></div>
                            <div class="bar-label small">
                                <div>${day.hours}h</div>
                                <div class="text-muted">${day.day}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderSkillHistory() {
    const historyContainer = document.getElementById('skill-history');
    if (!historyContainer) return;

    const skillHistory = userActivity.skillHistory;
    
    historyContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">Recent Skill Activity</h6>
            </div>
            <div class="card-body">
                ${skillHistory.length > 0 ? `
                    <div class="list-group list-group-flush">
                        ${skillHistory.map(activity => `
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>${activity.skill}</strong>
                                    <br>
                                    <small class="text-muted">
                                        ${activity.type === 'learned' ? 'Learned' : 'Taught'} • 
                                        ${formatDate(activity.date)} • 
                                        ${activity.hours} hour(s)
                                    </small>
                                </div>
                                <span class="badge bg-${activity.type === 'learned' ? 'primary' : 'success'}">
                                    ${activity.type === 'learned' ? 'Learned' : 'Taught'}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <p class="text-muted text-center">No recent activity</p>
                `}
            </div>
        </div>
    `;
}

function renderWeeklyStats() {
    const statsContainer = document.getElementById('weekly-stats');
    if (!statsContainer) return;

    const stats = userActivity.weeklyStats;
    
    statsContainer.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">Weekly Summary</h6>
            </div>
            <div class="card-body">
                <div class="row text-center">
                    <div class="col-4">
                        <div class="stat-value text-primary">${stats.hoursLearned}</div>
                        <div class="stat-label small text-muted">Hours Learned</div>
                    </div>
                    <div class="col-4">
                        <div class="stat-value text-success">${stats.hoursTaught}</div>
                        <div class="stat-label small text-muted">Hours Taught</div>
                    </div>
                    <div class="col-4">
                        <div class="stat-value text-info">${stats.exchangesCompleted}</div>
                        <div class="stat-label small text-muted">Exchanges</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadSkillsMarketplace() {
    console.log('🎯 Loading skills marketplace...');
    
    // Initialize marketplace components
    initializeMarketplaceComponents();
    
    // Load skills
    if (!filteredSkills || filteredSkills.length === 0) {
        console.log('🔄 No filtered skills, loading fresh data...');
        loadSkills();
    } else {
        console.log(`🔄 Using existing ${filteredSkills.length} skills`);
        populateSkillsGrid(filteredSkills);
    }
    
    populateCategories();
}

// ✅ HELPER FUNCTION TO UPDATE ONLINE USERS BADGE
function updateOnlineUsersBadge() {
    if (filteredSkills && filteredSkills.length > 0) {
        const onlineUsersCount = filteredSkills.filter(skill => 
            skill.providerOnline === true
        ).length;
        
        NotificationManager.showOnlineUsersCount(onlineUsersCount);
    } else {
        NotificationManager.showOnlineUsersCount(0);
    }
}

// ✅ FIXED: INITIALIZE MARKETPLACE COMPONENTS
function initializeMarketplaceComponents() {
    console.log('🔧 Initializing marketplace components...');
    
    try {
        // Setup filter handlers
        if (typeof setupFilterHandlers === 'function') {
            setupFilterHandlers();
        } else {
            console.warn('⚠️ setupFilterHandlers function not found');
        }
        
        // Setup search functionality
        if (typeof setupSearchFunctionality === 'function') {
            setupSearchFunctionality();
        }
        
        console.log('✅ Marketplace components initialized');
    } catch (error) {
        console.error('❌ Error initializing marketplace components:', error);
    }
}
// ✅ HELPER FUNCTION TO UPDATE RESULTS COUNT
function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${count} skill${count !== 1 ? 's' : ''} found`;
        resultsCount.style.display = 'block';
    }
}

// ✅ HELPER FUNCTION TO SHOW NO SKILLS MESSAGE
function showNoSkillsMessage() {
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid) {
        skillsGrid.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5>No Skills Available Yet</h5>
                    <p class="text-muted mb-4">Be the first to share your skills with the community!</p>
                    <div class="d-flex gap-2 justify-content-center">
                        <button class="btn btn-primary" onclick="showGetStartedModal()">
                            <i class="fas fa-plus me-2"></i>Add Your First Skill
                        </button>
                        <button class="btn btn-outline-primary" onclick="loadSkillsMarketplace()">
                            <i class="fas fa-redo me-2"></i>Refresh
                        </button>
                    </div>
                </div>
            </div>`;
    }
}

// ✅ BASIC REAL-TIME MESSAGING WITH POLLING
function startMessagePolling(skillId) {
    if (messageInterval) clearInterval(messageInterval);
    
    messageInterval = setInterval(async () => {
        if (currentChatSkill && currentChatSkill.id === skillId) {
            await loadMessages(skillId);
        }
    }, 3000); // Poll every 3 seconds
}

function stopMessagePolling() {
    if (messageInterval) {
        clearInterval(messageInterval);
        messageInterval = null;
    }
}

// ✅ COMPLETE ONLINE STATUS MANAGER
const OnlineStatusManager = {
    heartbeatInterval: null,
    isInitialized: false,
    lastHeartbeatTime: 0,
    heartbeatCooldown: 30000,
    
    init: function() {
        if (this.isInitialized) return;
        
        console.log('🔄 Initializing Online Status Manager...');
        this.setupEventListeners();
        this.startHeartbeat();
        this.isInitialized = true;
        
        if (currentUser) {
            this.forceOnline();
        }
    },
    
    forceOnline: async function() {
        if (!currentUser) return;
        console.log('🚀 Force setting user online...');
        await this.setOnline();
    },
    
    setOnline: async function() {
        if (!currentUser) return;
        try {
            console.log('🔄 Setting user online...');
            const response = await apiRequest('/users/online', {
                method: 'POST'
            });
            if (response && response.success) {
                console.log('✅ Online status set successfully');
                return true;
            }
        } catch (error) {
            console.error('❌ Failed to set online status:', error);
        }
        return false;
    },
    
    setOffline: async function() {
        if (!currentUser) return;
        try {
            const response = await apiRequest('/users/offline', {
                method: 'POST'
            });
            if (response && response.success) {
                console.log('✅ User marked as offline successfully');
            }
        } catch (error) {
            console.error('❌ Failed to set offline status:', error);
        }
    },
    
    sendHeartbeat: async function() {
        if (!currentUser) return;
        const now = Date.now();
        if (now - this.lastHeartbeatTime < this.heartbeatCooldown) return;
        
        this.lastHeartbeatTime = now;
        try {
            console.log('💓 Sending heartbeat...');
            const response = await apiRequest('/users/heartbeat', {
                method: 'POST'
            });
            if (response && response.success) {
                console.log('✅ Heartbeat successful');
            }
        } catch (error) {
            console.error('❌ Heartbeat failed:', error);
        }
    },
    
    startHeartbeat: function() {
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = setInterval(() => {
            if (currentUser && document.visibilityState === 'visible') {
                this.sendHeartbeat();
            }
        }, 30000);
    },
    
    stopHeartbeat: function() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    },
    
    formatLastSeen: function(lastSeen) {
        if (!lastSeen) return 'Never';
        const now = new Date();
        const lastSeenDate = new Date(lastSeen);
        const diffMs = now - lastSeenDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return lastSeenDate.toLocaleDateString();
    },
    
    getStatusBadge: function(isOnline, lastSeen) {
        if (isOnline) {
            return '<span class="badge bg-success status-badge"><i class="fas fa-circle me-1"></i>Online</span>';
        } else {
            const lastSeenText = this.formatLastSeen(lastSeen);
            return `<span class="badge bg-secondary status-badge"><i class="fas fa-clock me-1"></i>${lastSeenText}</span>`;
        }
    },
    
    setupEventListeners: function() {
        document.addEventListener('visibilitychange', () => {
            if (!currentUser) return;
            if (!document.hidden) {
                this.setOnline();
                this.sendHeartbeat();
            } else {
                this.setOffline();
            }
        });
        
        const throttledHeartbeat = this.throttle(() => {
            if (currentUser && document.visibilityState === 'visible') {
                this.sendHeartbeat();
            }
        }, 10000);
        
        const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
        activityEvents.forEach(event => {
            document.addEventListener(event, throttledHeartbeat, { passive: true });
        });
        
        window.addEventListener('focus', () => {
            if (currentUser) this.setOnline();
        });
        
        window.addEventListener('online', () => {
            console.log('🌐 Browser online - marking online');
            if (currentUser) this.setOnline();
        });
        
        window.addEventListener('offline', () => {
            console.log('🌐 Browser offline - marking offline');
            if (currentUser) this.setOffline();
        });
        
        window.addEventListener('beforeunload', () => {
            if (currentUser) {
                console.log('🚪 Page unloading - marking offline');
                this.setOffline();
            }
        });
        
        console.log('✅ Online status event listeners setup complete');
    },
    
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};

// ✅ ENHANCED: POPULATE SKILLS GRID WITH VIDEO CALL BUTTONS
function populateSkillsGrid(skills) {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) {
        console.error('Skills grid element not found');
        return;
    }

    if (!skills || skills.length === 0) {
        skillsGrid.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5>No skills found</h5>
                    <p class="text-muted">Try adjusting your search or filters.</p>
                    <button class="btn btn-primary mt-2" onclick="showGetStartedModal()">
                        <i class="fas fa-plus me-2"></i>Add Your First Skill
                    </button>
                </div>
            </div>`;
        return;
    }

    console.log(`🔄 Rendering ${skills.length} skills in grid`);

    // ✅ SAFE FORMAT LAST SEEN FUNCTION
    const safeFormatLastSeen = (lastSeen) => {
        try {
            // Try to use OnlineStatusManager if available
            if (window.OnlineStatusManager && typeof window.OnlineStatusManager.formatLastSeen === 'function') {
                return window.OnlineStatusManager.formatLastSeen(lastSeen);
            }
        } catch (error) {
            console.warn('OnlineStatusManager.formatLastSeen not available, using fallback');
        }
        
        // Fallback formatting
        if (!lastSeen) return 'Never';
        try {
            const now = new Date();
            const lastSeenDate = new Date(lastSeen);
            const diffMs = now - lastSeenDate;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return lastSeenDate.toLocaleDateString();
        } catch (e) {
            return 'Recently';
        }
    };

    skillsGrid.innerHTML = skills.map(skill => {
        // ✅ SAFE DATA ACCESS WITH COMPREHENSIVE FALLBACKS
        const skillName = skill.name || 'Unnamed Skill';
        const providerName = skill.providerName || skill.provider?.name || 'Unknown User';
        const category = skill.category || 'General';
        const description = skill.description || 'No description available';
        const location = skill.location || 'Location not specified';
        const timeRequired = skill.timeRequired || 1;
        const rating = skill.rating || 4.5;
        
        // ✅ SAFE ONLINE STATUS CHECK
        const isOnline = skill.providerOnline !== undefined ? skill.providerOnline : 
                        (skill.provider?.isOnline || false);
        const lastSeen = skill.providerLastSeen || skill.provider?.lastSeen || new Date();
        
        // ✅ SAFE STATUS BADGE
        const statusBadge = isOnline ? 
            '<span class="badge bg-success status-badge"><i class="fas fa-circle me-1"></i>Online</span>' :
            `<span class="badge bg-secondary status-badge"><i class="fas fa-clock me-1"></i>${safeFormatLastSeen(lastSeen)}</span>`;

        // ✅ SAFE SKILL ID FOR CLICK HANDLER
        const skillId = skill.id || skill._id || 'unknown';
        const providerId = skill.providerId || skill.provider?._id || 'unknown';

        return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 skill-card" style="cursor: pointer;" onclick="openSkillDetails('${skillId}')">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title">${skillName}</h5>
                        <span class="badge bg-secondary">${category}</span>
                    </div>
                    <p class="card-text text-muted small">${description}</p>
                    
                    <!-- User Profile Section with Enhanced Online Status -->
                    <div class="user-profile-section mb-3 p-3 bg-light rounded">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <div class="user-avatar me-3 position-relative">
                                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                                         style="width: 40px; height: 40px; font-size: 14px;">
                                        ${getUserInitials(providerName)}
                                    </div>
                                    <!-- Enhanced Online Status Indicator -->
                                    <div class="position-absolute bottom-0 end-0 ${isOnline ? 'bg-success' : 'bg-secondary'} rounded-circle border border-2 border-white status-indicator"
                                         style="width: 12px; height: 12px;"
                                         title="${isOnline ? 'Online now' : 'Offline'}">
                                    </div>
                                </div>
                                <div class="user-info">
                                    <h6 class="mb-1">${providerName}</h6>
                                    <small class="text-muted">
                                        <i class="fas fa-map-marker-alt me-1"></i> ${location}
                                    </small>
                                    <div class="status-text small mt-1">
                                        ${isOnline ? 
                                            '<span class="text-success"><i class="fas fa-circle me-1"></i>Online now</span>' : 
                                            `<span class="text-muted"><i class="fas fa-clock me-1"></i>Last seen ${safeFormatLastSeen(lastSeen)}</span>`
                                        }
                                    </div>
                                </div>
                            </div>
                            ${statusBadge}
                        </div>
                    </div>
                    
                    <div class="skill-details">
                        <small class="text-muted">
                            <i class="fas fa-clock me-1"></i> ${timeRequired} hour(s)
                        </small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <small class="text-warning">
                                ${'★'.repeat(Math.floor(rating))}${'☆'.repeat(5 - Math.floor(rating))}
                                <span class="ms-1">${rating}</span>
                            </small>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); requestExchange('${skillId}')">
                                Exchange
                            </button>
                            <!-- ✅ ADD VIDEO CALL BUTTON -->
                            <button class="btn btn-success btn-sm" 
                                    onclick="event.stopPropagation(); startVideoCall('${skillId}', '${providerId}', '${providerName}')"
                                    ${!currentUser ? 'disabled title="Please login to start video call"' : ''}
                                    ${!isOnline ? 'disabled title="User is currently offline"' : ''}>
                                <i class="fas fa-video me-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    console.log('✅ Skills grid populated successfully with video call buttons');
}
// ✅ ADD MISSING CSS FOR SKILLS GRID
const skillsGridStyles = document.createElement('style');
skillsGridStyles.textContent = `
    .skills-grid {
        min-height: 400px;
    }
    
    .skill-card {
        transition: all 0.3s ease;
        border: 1px solid #e9ecef;
    }
    
    .skill-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        border-color: #007bff;
    }
    
    .user-profile-section {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border-left: 4px solid #007bff;
        border-radius: 8px;
    }
    
    .status-indicator {
        width: 12px;
        height: 12px;
        border: 2px solid white;
    }
    
    .status-badge {
        font-size: 0.7rem;
        padding: 0.25rem 0.5rem;
    }
    
    #skills-grid:empty::before {
        content: "Loading skills...";
        display: block;
        text-align: center;
        padding: 2rem;
        color: #6c757d;
    }
`;
document.head.appendChild(skillsGridStyles);

// ✅ ADD MISSING UTILITY FUNCTION
function getUserInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}
// ✅ FIXED: User card click handler
function openSkillDetails(skillId) {
    console.log('Opening skill details for:', skillId);
    
    // Find skill by string ID comparison
    const skill = filteredSkills.find(s => s.id.toString() === skillId.toString());
    
    if (!skill) {
        console.error('Skill not found for ID:', skillId);
        console.log('Available skills:', filteredSkills.map(s => ({ id: s.id, name: s.name })));
        NotificationManager.show('Skill not found. Please try again.', 'error');
        return;
    }
    
    console.log('Found skill:', skill);
    
    // Show messaging modal
    showMessagingUI(skill);
}

// ✅ ENHANCED: Safe messaging UI
function showMessagingUI(skill) {
    try {
        currentChatSkill = skill;
        
        // Update modal content safely
        const userNameElement = document.getElementById('message-user-name');
        const userSkillElement = document.getElementById('message-user-skill');
        
        if (userNameElement) userNameElement.textContent = skill.providerName || 'User';
        if (userSkillElement) userSkillElement.textContent = skill.name || 'Skill';
        
        // Load messages
        loadMessages(skill.id);
        
        // Show modal
        const modalElement = document.getElementById('messagingModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        
    } catch (error) {
        console.error('Error showing messaging UI:', error);
        NotificationManager.show('Failed to open chat. Please try again.', 'error');
    }
}
function shouldShowNewUserBadge(user) {
    const joinDate = new Date(user.createdAt || user.joinDate);
    const daysSinceJoin = (new Date() - joinDate) / (1000 * 60 * 60 * 24);
    return daysSinceJoin < 7; // New if joined less than 7 days ago
}

// Add to skill card rendering:
const isNewUser = shouldShowNewUserBadge(skill.provider);
const newUserBadge = isNewUser ? '<span class="badge bg-info">New User</span>' : '';
function populateCategories() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;

    const categories = Object.keys(appData.skillCategories);
    categoryFilter.innerHTML = '<option value="">All Categories</option>' + 
        categories.map(category => `<option value="${category}">${category}</option>`).join('');
}

// ✅ SORT USERS BY ONLINE STATUS & LAST SEEN
function sortUsersByOnlineStatus(users) {
    return users.sort((a, b) => {
        // Online users first
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        
        // Then by last activity time (most recent first)
        return new Date(b.lastActivity) - new Date(a.lastActivity);
    });
}
function populateTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (!testimonialsContainer) return;

    testimonialsContainer.innerHTML = appData.testimonials.map(testimonial => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body text-center">
                    <div class="mb-3">
                        ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                    </div>
                    <p class="card-text">"${testimonial.text}"</p>
                    <footer class="blockquote-footer mt-3">
                        <strong>${testimonial.name}</strong> <br>
                        <small class="text-muted">${testimonial.skill}</small>
                    </footer>
                </div>
            </div>
        </div>
    `).join('');
}

// ✅ ENHANCED SKILL MANAGEMENT
function addSkill(type) {
    const inputId = type === 'learn' ? 'new-skill-learn' : 'new-skill-teach';
    const listId = type === 'learn' ? 'skills-to-learn-list' : 'skills-to-teach-list';
    
    const input = document.getElementById(inputId);
    const skill = input.value.trim();
    
    if (!skill) {
        NotificationManager.show('Please enter a skill', 'error');
        return;
    }
    
    addSkillToUI(type, skill, listId);
    input.value = '';
    
    if (currentUser) {
        updateUserSkillsInProfile();
    }
}

function addSkillToUI(type, skill, listId) {
    const list = document.getElementById(listId);
    if (!list) return;
    
    const existingSkills = Array.from(list.querySelectorAll('.badge')).map(badge => 
        badge.textContent.replace('×', '').trim()
    );
    
    if (existingSkills.includes(skill)) {
        NotificationManager.show('Skill already added', 'warning');
        return;
    }
    
    const badge = document.createElement('span');
    badge.className = `badge bg-${type === 'learn' ? 'primary' : 'success'} me-1 mb-1`;
    badge.innerHTML = `${skill} <span onclick="removeSkill('${type}', '${skill}')" style="cursor: pointer; margin-left: 5px;">×</span>`;
    
    list.appendChild(badge);
}

function removeSkill(type, skill) {
    const listId = type === 'learn' ? 'skills-to-learn-list' : 'skills-to-teach-list';
    const list = document.getElementById(listId);
    
    if (list) {
        const badges = list.querySelectorAll('.badge');
        badges.forEach(badge => {
            if (badge.textContent.includes(skill)) {
                badge.remove();
            }
        });
    }
    
    if (currentUser) {
        updateUserSkillsInProfile();
    }
}
// ✅ SKILLS SAVE SUCCESS HANDLER
function handleSkillsSaveSuccess(skillsCount) {
    // Show success notification
    NotificationManager.show(`Successfully saved ${skillsCount} skills! Welcome to LocalLink!`, 'success');
    
    // Optional: Show a welcome message on home page
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        // Add a temporary success banner
        const successBanner = document.createElement('div');
        successBanner.className = 'alert alert-success alert-dismissible fade show mb-4';
        successBanner.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>Welcome to LocalLink!</strong> Your ${skillsCount} skills have been saved successfully.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        heroSection.insertBefore(successBanner, heroSection.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (successBanner.parentElement) {
                successBanner.remove();
            }
        }, 5000);
    }
}
function handleSkillInputKeypress(event, type) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSkill(type);
    }
}

async function updateUserSkillsInProfile() {
    if (!currentUser) return;
    
    try {
        const skillsToLearn = getSkillsFromList('skills-to-learn-list');
        const skillsToTeach = getSkillsFromList('skills-to-teach-list');
        
        const profileData = {
            skillsToLearn,
            skillsToTeach
        };
        
        await updateUserProfile(profileData);
    } catch (error) {
        console.error('Error updating skills in profile:', error);
    }
}

function getSkillsFromList(listId) {
    const list = document.getElementById(listId);
    if (!list) return [];
    
    const badges = list.querySelectorAll('.badge');
    return Array.from(badges).map(badge => 
        badge.textContent.replace('×', '').trim()
    );
}

// Initialize skill management
// Initialize skill management
function initializeSkillManagement() {
    const addOfferedBtn = document.getElementById('add-skill-offered');
    const addWantedBtn = document.getElementById('add-skill-wanted');
    
    if (addOfferedBtn) {
        addOfferedBtn.addEventListener('click', () => addSkillFromProfile('teach'));
    }
    
    if (addWantedBtn) {
        addWantedBtn.addEventListener('click', () => addSkillFromProfile('learn'));
    }
    
    // Add enter key support
    const offeredInput = document.getElementById('new-skill-offered');
    const wantedInput = document.getElementById('new-skill-wanted');
    
    if (offeredInput) {
        offeredInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkillFromProfile('teach');
            }
        });
    }
    
    if (wantedInput) {
        wantedInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSkillFromProfile('learn');
            }
        });
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 20);
    });
}

// ✅ EXCHANGE REQUEST FUNCTION
async function requestExchange(skillId) {
    if (!currentUser) {
        NotificationManager.show('Please log in to request an exchange', 'error');
        showAuthForm('signin');
        return;
    }

    try {
        const response = await apiRequest('/exchanges/request', {
            method: 'POST',
            body: { skillId }
        });
        
        NotificationManager.show('Exchange request sent successfully!', 'success');
        
        if (currentSection === 'dashboard') {
            loadDashboard();
        }
    } catch (error) {
        console.error('Exchange request error:', error);
        NotificationManager.show('Failed to request exchange: ' + error.message, 'error');
    }
}

// ✅ SKILL SEARCH AND FILTER FUNCTIONS
function searchSkills() {
    const searchInput = document.getElementById('skill-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (!searchInput || !categoryFilter) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    let filtered = filteredSkills;
    
    if (searchTerm) {
        filtered = filtered.filter(skill => 
            skill.name.toLowerCase().includes(searchTerm) ||
            skill.description.toLowerCase().includes(searchTerm) ||
            skill.providerName.toLowerCase().includes(searchTerm)
        );
    }
    
    if (selectedCategory) {
        filtered = filtered.filter(skill => skill.category === selectedCategory);
    }
    
    populateSkillsGrid(filtered);
}
// ✅ ENHANCED CLEAR FILTERS FUNCTION
function clearFilters() {
    console.log('Clearing all filters');
    
    // Clear search input
    const searchInput = document.getElementById('skill-search');
    if (searchInput) searchInput.value = '';
    
    // Reset category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) categoryFilter.value = '';
    
    // Reset time filter
    const timeFilter = document.getElementById('time-filter');
    if (timeFilter) timeFilter.value = '';
    
    // Reset to show only available skills from database
    loadSkillsMarketplace();
    
    NotificationManager.show('Filters cleared successfully', 'success');
}

// Update the clearSearch function to use clearFilters
window.clearSearch = clearFilters;


// ✅ HELPER FUNCTIONS FOR UI
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ✅ INITIALIZATION HELPERS
function setupSearchListeners() {
    const searchInput = document.getElementById('skill-search');
    const categoryFilter = document.getElementById('category-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchSkills, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', searchSkills);
    }
}

async function initializeApp() {
    console.log('🚀 Initializing LocalLink app...');
    
    try {
        // Setup navigation and event listeners first
        setupNavigationHandlers();
        setupEventListeners();
        updateNavigationBadges();
        handlePageRefresh();
        
        // ✅ INITIALIZE ONLINE STATUS MANAGER FIRST
        try {
            if (typeof OnlineStatusManager !== 'undefined' && OnlineStatusManager.init) {
                OnlineStatusManager.init();
                console.log('✅ OnlineStatusManager initialized successfully');
            }
        } catch (error) {
            console.warn('⚠️ OnlineStatusManager initialization warning:', error.message);
        }
         try {
            initializeVideoCallSystem();
        } catch (error) {
            console.warn('⚠️ Video call system initialization warning:', error.message);
        }
        // Check backend connection
        try {
            const response = await fetch(`${API_BASE}/health`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                console.log('✅ Backend server is reachable');
            } else {
                console.warn('⚠️ Backend server responded with non-OK status');
            }
        } catch (error) {
            console.error('❌ Backend server is not reachable:', error.message);
        }
        
        // Check existing session
        await checkExistingSession();
        
        // Initialize activity tracking and online status if user is logged in
        if (currentUser) {
            try {
                ActivityTracker.initUserActivity();
                startAutoSessionTracking();
                
                // Mark user as online immediately after login
                if (OnlineStatusManager && OnlineStatusManager.setOnline) {
                    await OnlineStatusManager.setOnline();
                    console.log('✅ User marked as online after login');
                }
            } catch (error) {
                console.warn('⚠️ Activity tracking initialization warning:', error.message);
            }
        }
        
        // Show appropriate section based on authentication
        if (currentUser) {
            showSection('dashboard');
        } else {
            showSection('landing');
        }
        
        // Initialize video call system
        try {
            initializeVideoCallSystem();
        } catch (error) {
            console.warn('⚠️ Video call system initialization warning:', error.message);
        }
        
        // Initialize all app components
        populateTestimonials();
        populateCategories();
        animateCounters();
        
        try {
            await loadSkills();
        } catch (error) {
            console.warn('⚠️ Skills loading warning:', error.message);
        }
        
        initializeSkillManagement();
        setupSearchListeners();
        
        console.log('✅ LocalLink app initialized successfully');
        
    } catch (error) {
        console.error('❌ App initialization failed:', error);
        // Still show the landing page even if initialization partially failed
        showSection('landing');
    }
}
// ✅ VIDEO CALL MANAGER PLACEHOLDER - Ensure this exists
if (typeof videoCallManager === 'undefined') {
    var videoCallManager = {
        initializeSocket: function(socket) {
            console.log('🎥 VideoCallManager placeholder - socket initialized');
        },
        startCall: function(skillId, recipientId, recipientName) {
            console.log('🎬 Starting video call to:', recipientName);
            NotificationManager.show('Video call system is not fully loaded. Please refresh the page.', 'warning');
        },
        isCallActive: false,
        socket: null
    };
}

// ✅ VIDEO CALL SYSTEM INITIALIZATION
function initializeVideoCallSystem() {
    console.log('🎥 Initializing video call system...');
    
    // Check if videoCallManager exists (videocall.js loaded)
    if (typeof videoCallManager === 'undefined') {
        console.warn('⚠️ VideoCallManager not loaded - make sure videocall.js is included in HTML');
        return;
    }
    
    // Strategy 1: If WebSocket is already available, initialize immediately
    if (typeof socket !== 'undefined' && socket.readyState === WebSocket.OPEN) {
        console.log('✅ WebSocket already connected - initializing video calls');
        videoCallManager.initializeSocket(socket);
        return;
    }
    
    // Strategy 2: Set up a listener for future WebSocket connections
    console.log('⏳ WebSocket not ready yet, setting up connection listener...');
    
    // Listen for custom event when WebSocket connects
    window.addEventListener('websocketConnected', function(event) {
        console.log('✅ WebSocket connected event received - initializing video calls');
        videoCallManager.initializeSocket(event.detail.socket);
    });
    
    // Strategy 3: Periodic check for WebSocket connection (fallback)
    const videoCallInitInterval = setInterval(() => {
        if (typeof socket !== 'undefined' && socket.readyState === WebSocket.OPEN) {
            console.log('✅ WebSocket now connected - initializing video calls');
            videoCallManager.initializeSocket(socket);
            clearInterval(videoCallInitInterval);
        }
    }, 1000);
    
    // Clear interval after 15 seconds if still not connected
    setTimeout(() => {
        clearInterval(videoCallInitInterval);
        if (!videoCallManager.socket) {
            console.warn('⚠️ Video call system: WebSocket not available after timeout');
        }
    }, 15000);
}
// ✅ ADD VISIBILITY CHANGE HANDLER
document.addEventListener('visibilitychange', function() {
    if (currentUser) {
        if (document.hidden) {
            // Tab is hidden - user might be away
            OnlineStatusManager.setOffline();
        } else {
            // Tab is visible - user is active
            OnlineStatusManager.setOnline();
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Listen for WebSocket connection events for video calls
    window.addEventListener('websocketConnected', function(event) {
        console.log('✅ Global WebSocket connected - initializing video calls');
        if (typeof videoCallManager !== 'undefined') {
            videoCallManager.initializeSocket(event.detail.socket);
        }
    });
    
    // If socket is already available, initialize immediately
    if (typeof socket !== 'undefined' && socket.readyState === WebSocket.OPEN) {
        console.log('✅ Socket already connected - initializing video calls');
        if (typeof videoCallManager !== 'undefined') {
            videoCallManager.initializeSocket(socket);
        }
    }
});
// ✅ GLOBAL ERROR HANDLER
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    NotificationManager.show('An unexpected error occurred', 'error');
});

window.removeSkill = function(type, skill) {
    removeSkillFromProfile(type, skill);
};

window.addSkill = function(type) {
    addSkillFromProfile(type);
};

window.handleSkillInputKeypress = function(event, type) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSkillFromProfile(type);
    }
};

function someFunction(skill) {
    if (!skill) {
        console.warn('Skill parameter is required');
        return;
    }
    console.log(skill.name);
}

function handlePageRefresh() {
    // Clear any pending form data
    if (window.performance && window.performance.navigation.type === 1) {
        // Page was refreshed
        console.log('Page was refreshed - clearing sensitive data');
        
        // Clear any sensitive form data that might cause duplicate submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.id !== 'profile-form') { // Don't clear profile form
                form.reset();
            }
        });
        
        // Clear any pending submissions
        isSubmitting = false;
    }
}

// ✅ ADD CSS FOR ONLINE STATUS INDICATORS
const onlineStatusStyles = document.createElement('style');
onlineStatusStyles.textContent = `
    .user-avatar {
        position: relative;
    }
    
    .online-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
    }
    
    .online-indicator.online {
        background-color: #28a745;
    }
    
    .online-indicator.offline {
        background-color: #6c757d;
    }
    
    .status-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
    }
    
    .skill-card:hover {
        transform: translateY(-2px);
        transition: transform 0.2s ease;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .user-profile-section {
        border-left: 3px solid #007bff;
    }
`;
document.head.appendChild(onlineStatusStyles);
// ✅ GLOBAL ERROR HANDLER
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    NotificationManager.show('An unexpected error occurred', 'error');
});
window.removeSkill = function(type, skill) {
    removeSkillFromProfile(type, skill);
};

window.addSkill = function(type) {
    addSkillFromProfile(type);
};

window.handleSkillInputKeypress = function(event, type) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSkillFromProfile(type);
    }
};
// ✅ EXPORT FUNCTIONS FOR GLOBAL ACCESS
window.handleSkillInputKeypress = handleSkillInputKeypress;
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.requestExchange = requestExchange;
window.searchSkills = searchSkills;
window.clearSearch = clearSearch;
window.showGetStartedModal = showGetStartedModal;
window.showSection = showSection;
window.showAuthForm = showAuthForm;
window.handleSignin = handleSignin;
window.handleSignup = handleSignup;
window.handleLogout = handleLogout;
window.startVideoCall = startVideoCall;
window.toggleActivityView = toggleActivityView;
window.renderActivityDashboard = renderActivityDashboard;
window.searchSkills = searchSkills;
window.clearFilters = clearFilters;
window.requestExchange = requestExchange;
window.addSkill = addSkillFromProfile;
window.removeSkill = removeSkillFromProfile;
window.handleSkillInputKeypress = handleSkillInputKeypress;

console.log('LocalLink Application - All functions loaded successfully');

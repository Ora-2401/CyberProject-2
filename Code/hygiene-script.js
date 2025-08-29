// Global variables for tracking
let currentUser = null;
let trackingData = {
    startTime: Date.now(),
    activitiesCompleted: [],
    timeSpent: 0,
    passwordsChecked: 0,
    securityScore: 0,
    tipsLearned: new Set(),
    moduleCompleted: false,
    sessionsCount: 0,
    totalTimeSpent: 0,
    deviceUpdatesChecked: 0,
    browsingTipsCompleted: 0
};

// Review data storage
let reviewData = {
    allTips: [],
    completedActivities: [],
    securityRecommendations: []
};

// Content data for different topics
const topicContent = {
    passwords: {
        title: 'Password Security',
        icon: 'ri-shield-keyhole-line',
        description: 'Strong passwords are your first line of defense against cyber threats. Learn how to create unbreakable passwords that protect your digital life.',
        tips: [
            'Use at least 12 characters for maximum security',
            'Mix uppercase letters, lowercase letters, numbers, and symbols',
            'Never reuse passwords across different accounts',
            'Consider using a password manager for convenience',
            'Enable two-factor authentication when available',
            'Avoid personal information in passwords',
            'Change passwords if a breach is reported'
        ],
        widget: 'passwordChecker',
        detailedContent: 'Password security is the foundation of digital safety. A strong password acts as the first barrier against unauthorized access to your accounts. The complexity and uniqueness of your passwords directly correlate with your overall security posture.'
    },
    updates: {
        title: 'Software Updates', 
        icon: 'ri-refresh-line',
        description: 'Keeping software updated is crucial for security. Updates often contain critical security patches that protect against newly discovered vulnerabilities.',
        tips: [
            'Enable automatic updates for operating systems',
            'Keep browsers and plugins current',
            'Update mobile apps regularly',
            'Don\'t ignore security update notifications',
            'Update antivirus software definitions',
            'Keep firmware updated on routers and IoT devices',
            'Schedule regular update checks for all software'
        ],
        widget: 'updateSchedule',
        detailedContent: 'Software updates are essential for maintaining security. Cybercriminals constantly look for vulnerabilities in outdated software to exploit. Regular updates ensure you have the latest security patches and improvements.'
    },
    browsing: {
        title: 'Safe Browsing Habits',
        icon: 'ri-global-line', 
        description: 'Develop secure browsing habits to protect yourself from online threats, malicious websites, and social engineering attacks.',
        tips: [
            'Always look for HTTPS (secure) connections',
            'Use reputable ad blockers and popup blockers',
            'Be cautious with email links and attachments',
            'Verify website authenticity before entering credentials',
            'Keep your browser updated with latest security features',
            'Use private/incognito mode for sensitive browsing',
            'Be wary of free Wi-Fi for sensitive activities'
        ],
        widget: 'browserChecklist',
        detailedContent: 'Safe browsing practices are essential in today\'s digital landscape. The internet contains numerous threats that can compromise your personal information, install malware, or steal your credentials through sophisticated phishing attempts.'
    }
};

// Initialize authentication
function initializeAuth() {
    if (typeof window.cyberGuardAuth !== 'undefined' && window.cyberGuardAuth.isAuthenticated()) {
        currentUser = window.cyberGuardAuth.getCurrentUser();
        const userInfo = document.getElementById('user-info');
        if (userInfo) userInfo.textContent = `Welcome, ${currentUser.fullname}`;
    } else {
        currentUser = { email: 'guest@example.com', fullname: 'Guest User' };
        const userInfo = document.getElementById('user-info');
        if (userInfo) userInfo.textContent = 'Guest User';
    }
}

// Initialize tracking
function initializeTracking() {
    trackingData.startTime = Date.now();
    setInterval(updateTimeSpent, 10000);
}

// Track activity completion
function trackActivity(activityName) {
    if (!trackingData.activitiesCompleted.includes(activityName)) {
        trackingData.activitiesCompleted.push(activityName);
        markActivityComplete(activityName);
        updateStats();
        saveProgress();
        showNotification(`Activity completed: ${formatActivityName(activityName)}`);
    }
}

// Mark activity as complete
function markActivityComplete(activityName) {
    const statusElement = document.querySelector(`[data-activity="${activityName}"] .activity-status`);
    if (statusElement) {
        statusElement.className = 'activity-status completed';
        statusElement.innerHTML = '<i class="ri-check-line"></i>';
    }
    const navCard = document.querySelector(`[data-topic="${activityName}"]`);
    if (navCard) navCard.classList.add('completed');
}

// Format activity names
function formatActivityName(name) {
    const names = {
        'passwords': 'Password Security',
        'updates': 'Software Updates', 
        'browsing': 'Safe Browsing'
    };
    return names[name] || name;
}

// Update time spent
function updateTimeSpent() {
    trackingData.timeSpent = Math.floor((Date.now() - trackingData.startTime) / 60000);
    const timeElement = document.getElementById('time-spent');
    if (timeElement) timeElement.textContent = `${trackingData.timeSpent}m`;
}

// Update statistics
function updateStats() {
    const elements = {
        activities: document.getElementById('completed-activities'),
        tips: document.getElementById('tips-learned'),
        score: document.getElementById('security-score'),
        progressText: document.getElementById('overall-progress-text'),
        progressFill: document.getElementById('overall-progress-fill')
    };

    if (elements.activities) elements.activities.textContent = trackingData.activitiesCompleted.length;
    if (elements.tips) elements.tips.textContent = trackingData.tipsLearned.size;
    
    // Calculate security score
    const activityScore = (trackingData.activitiesCompleted.length / 3) * 40;
    const passwordScore = Math.min(trackingData.passwordsChecked * 10, 30);
    const tipsScore = Math.min(trackingData.tipsLearned.size * 3, 30);
    trackingData.securityScore = Math.min(Math.round(activityScore + passwordScore + tipsScore), 100);
    
    if (elements.score) elements.score.textContent = trackingData.securityScore;
    
    // Update progress
    const progress = Math.min((trackingData.activitiesCompleted.length / 3) * 100, 100);
    if (elements.progressText) elements.progressText.textContent = `${Math.round(progress)}%`;
    if (elements.progressFill) elements.progressFill.style.width = `${progress}%`;
    
    updateHeaderProgress(progress);
}

// Update header progress
function updateHeaderProgress(progress) {
    const headerProgress = document.getElementById('header-progress');
    const headerProgressText = document.getElementById('header-progress-text');
    
    if (headerProgress) headerProgress.style.width = `${progress}%`;
    if (headerProgressText) headerProgressText.textContent = `${Math.round(progress)}%`;
}

// Save progress
function saveProgress() {
    if (!currentUser) return;
    
    const progressKey = `cyberguard_hygiene_progress_${currentUser.email}`;
    localStorage.setItem(progressKey, JSON.stringify({
        ...trackingData,
        tipsLearned: Array.from(trackingData.tipsLearned)
    }));
    
    // Update global progress
    const allProgress = JSON.parse(localStorage.getItem('cyberguard_training_progress') || '{}');
    const userEmail = currentUser.email;
    
    if (!allProgress[userEmail]) allProgress[userEmail] = {};
    allProgress[userEmail]['cyber-hygiene'] = {
        module: 'cyber-hygiene',
        completed: trackingData.activitiesCompleted.length,
        total: 3,
        score: trackingData.securityScore,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('cyberguard_training_progress', JSON.stringify(allProgress));
}

// Load progress
function loadUserProgress() {
    if (!currentUser) return;
    
    const progressKey = `cyberguard_hygiene_progress_${currentUser.email}`;
    const saved = localStorage.getItem(progressKey);
    
    if (saved) {
        const data = JSON.parse(saved);
        trackingData = { ...trackingData, ...data };
        trackingData.tipsLearned = new Set(data.tipsLearned || []);
        
        trackingData.activitiesCompleted.forEach(activity => {
            markActivityComplete(activity);
        });
        
        updateStats();
    }
}

// Enhanced notification system
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    // Create notification content with icon
    const icons = {
        success: 'ri-check-line',
        warning: 'ri-alert-line',
        error: 'ri-error-warning-line',
        info: 'ri-information-line'
    };
    
    notification.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => notification.classList.remove('show'), duration);
    
    // Add to activity log
    trackingData.tipsLearned.add(`notification-${Date.now()}`);
    updateStats();
}

// Enhanced password checker with real-time feedback
function setupPasswordChecker() {
    const input = document.getElementById('passwordInput');
    const btn = document.getElementById('checkBtn');
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (!input || !btn) return;
    
    // Common passwords list for checking
    const commonPasswords = [
        'password', '123456', 'password123', 'admin', 'qwerty', 'letmein',
        'welcome', '123456789', 'password1', 'abc123', '111111', 'sunshine'
    ];
    
    // Password visibility toggle
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            toggleBtn.innerHTML = isPassword ? '<i class="ri-eye-line"></i>' : '<i class="ri-eye-off-line"></i>';
        });
    }
    
    function checkPassword() {
        const password = input.value;
        const criteria = {
            length: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            common: !commonPasswords.some(common => 
                password.toLowerCase().includes(common.toLowerCase()))
        };
        
        // Update visual criteria
        updateCriterion('lengthCriterion', criteria.length);
        updateCriterion('uppercaseCriterion', criteria.uppercase);
        updateCriterion('lowercaseCriterion', criteria.lowercase);
        updateCriterion('numberCriterion', criteria.number);
        updateCriterion('symbolCriterion', criteria.symbol);
        updateCriterion('commonCriterion', criteria.common);
        
        const validCriteria = Object.values(criteria).filter(Boolean).length;
        const strength = (validCriteria / 6) * 100;
        
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (strengthFill) {
            strengthFill.style.width = `${strength}%`;
            if (strength < 33) {
                strengthFill.style.background = 'linear-gradient(90deg, #dc2626, #ef4444)';
            } else if (strength < 66) {
                strengthFill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            } else {
                strengthFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            }
        }
        
        if (strengthText) {
            const labels = ['Enter password', 'Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
            const colors = ['#94a3b8', '#dc2626', '#ef4444', '#f59e0b', '#10b981', '#059669'];
            let index = 0;
            if (password.length === 0) index = 0;
            else if (strength < 20) index = 1;
            else if (strength < 40) index = 2;
            else if (strength < 60) index = 3;
            else if (strength < 80) index = 4;
            else index = 5;
            
            strengthText.textContent = labels[index];
            strengthText.style.color = colors[index];
        }
        
        // Show suggestions for improvement
        showPasswordSuggestions(criteria, password);
        
        if (password.length > 0) {
            trackingData.passwordsChecked++;
            trackingData.tipsLearned.add('password-strength-' + Date.now());
            saveProgress();
            
            // Show encouraging message for strong passwords
            if (strength >= 80) {
                showNotification('Excellent! This is a very strong password.', 'success');
            } else if (strength >= 60) {
                showNotification('Good password strength! Consider adding more complexity.', 'info');
            }
        }
    }
    
    function updateCriterion(elementId, isValid) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.className = isValid ? 'criterion valid' : 'criterion invalid';
        element.querySelector('i').className = isValid ? 'ri-check-line' : 'ri-close-line';
        
        // Add animation effect
        if (isValid) {
            element.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => element.style.animation = '', 500);
        }
    }
    
    function showPasswordSuggestions(criteria, password) {
        const suggestionsContainer = document.getElementById('passwordSuggestions');
        const suggestionsList = document.getElementById('suggestionsList');
        
        if (!suggestionsContainer || !suggestionsList) return;
        
        const suggestions = [];
        
        if (!criteria.length) suggestions.push('Make your password at least 12 characters long');
        if (!criteria.uppercase) suggestions.push('Add uppercase letters (A-Z)');
        if (!criteria.lowercase) suggestions.push('Add lowercase letters (a-z)');
        if (!criteria.number) suggestions.push('Include numbers (0-9)');
        if (!criteria.symbol) suggestions.push('Add special characters (!@#$%^&*)');
        if (!criteria.common) suggestions.push('Avoid common passwords and dictionary words');
        
        if (suggestions.length > 0) {
            suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }
    
    // Event listeners
    btn.addEventListener('click', checkPassword);
    input.addEventListener('input', debounce(checkPassword, 300));
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkPassword();
    });
}

// Utility function for debouncing
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

// Password example functions
function tryExample(password) {
    const input = document.getElementById('passwordInput');
    if (input) {
        input.value = password;
        input.dispatchEvent(new Event('input'));
        showNotification(`Testing example: "${password}"`, 'info');
    }
}

function generateSecurePassword() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const length = 16;
    let password = '';
    
    // Ensure at least one character from each required set
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*()_+-='[Math.floor(Math.random() * 14)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    const input = document.getElementById('passwordInput');
    if (input) {
        input.value = password;
        input.dispatchEvent(new Event('input'));
        showNotification('Generated a secure password for testing!', 'success');
    }
}

// Device update management functions
function checkDeviceUpdates(deviceType) {
    const statusElement = document.getElementById(`${deviceType}-status`);
    if (!statusElement) return;
    
    // Simulate checking for updates
    statusElement.textContent = 'Checking for updates...';
    statusElement.className = 'update-status checking';
    
    setTimeout(() => {
        const hasUpdates = Math.random() > 0.5; // Simulate random update availability
        
        if (hasUpdates) {
            statusElement.textContent = 'Updates available';
            statusElement.className = 'update-status pending';
            showNotification(`Updates found for ${deviceType}! Install them to stay secure.`, 'warning');
        } else {
            statusElement.textContent = 'Up to date';
            statusElement.className = 'update-status up-to-date';
            showNotification(`${deviceType} is up to date!`, 'success');
        }
        
        trackingData.deviceUpdatesChecked++;
        trackingData.tipsLearned.add(`update-check-${deviceType}`);
        updateStats();
        saveProgress();
    }, 2000);
}

function scheduleUpdates(deviceType) {
    const deviceNames = {
        computer: 'Computer/Laptop',
        mobile: 'Mobile Device',
        browser: 'Web Browser',
        router: 'Router/IoT Devices'
    };
    
    const messages = {
        computer: 'Enable Windows Update or macOS Software Update in system settings.',
        mobile: 'Go to Settings > Software Update and enable automatic updates.',
        browser: 'Check browser settings for automatic update options.',
        router: 'Access router admin panel to enable firmware auto-updates.'
    };
    
    showNotification(`Auto-updates scheduled for ${deviceNames[deviceType]}`, 'success');
    
    // Show detailed instructions
    setTimeout(() => {
        alert(`Auto-Update Instructions for ${deviceNames[deviceType]}:\n\n${messages[deviceType]}\n\nAutomatic updates help ensure you receive critical security patches promptly.`);
    }, 1000);
    
    trackingData.tipsLearned.add(`schedule-updates-${deviceType}`);
    updateStats();
    saveProgress();
}

// Browser security checklist functions
let checklistProgress = {
    https: false,
    adblocker: false,
    updates: false,
    privacy: false,
    downloads: false
};

function updateChecklistItem(item, checked) {
    checklistProgress[item] = checked;
    
    const itemElement = document.querySelector(`[data-item="${item}"]`);
    const statusElement = itemElement?.querySelector('.checklist-status');
    
    if (statusElement) {
        statusElement.textContent = checked ? 'Completed' : 'Pending';
        statusElement.className = checked ? 'checklist-status completed' : 'checklist-status pending';
    }
    
    if (itemElement) {
        itemElement.className = checked ? 'checklist-item completed' : 'checklist-item';
    }
    
    updateChecklistProgress();
    
    if (checked) {
        trackingData.browsingTipsCompleted++;
        trackingData.tipsLearned.add(`browsing-${item}`);
        showNotification(`Great! You've completed: ${item}`, 'success');
    }
    
    updateStats();
    saveProgress();
}

function updateChecklistProgress() {
    const completed = Object.values(checklistProgress).filter(Boolean).length;
    const total = Object.keys(checklistProgress).length;
    const percentage = (completed / total) * 100;
    
    const progressText = document.getElementById('checklist-progress-text');
    const progressFill = document.getElementById('checklist-progress-fill');
    const securityScore = document.getElementById('browser-security-score');
    
    if (progressText) progressText.textContent = `${completed}/${total} completed`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (securityScore) securityScore.textContent = `${Math.round(percentage)}/100`;
    
    if (completed === total) {
        showNotification('Congratulations! Browser security checklist completed!', 'success', 5000);
    }
}

// Individual checklist test functions
function testHTTPS() {
    const isSecure = window.location.protocol === 'https:';
    if (isSecure) {
        showNotification('✓ This site uses HTTPS - your connection is secure!', 'success');
    } else {
        showNotification('⚠ This site does not use HTTPS. Be cautious with sensitive data.', 'warning');
    }
}

function testAdBlocker() {
    // Simple ad blocker detection
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-999px';
    document.body.appendChild(testAd);
    
    setTimeout(() => {
        const isBlocked = testAd.offsetHeight === 0;
        document.body.removeChild(testAd);
        
        if (isBlocked) {
            showNotification('✓ Ad blocker detected and working!', 'success');
        } else {
            showNotification('Consider installing an ad blocker for better security.', 'info');
        }
    }, 100);
}

function checkBrowserVersion() {
    const userAgent = navigator.userAgent;
    let browserInfo = 'Unknown browser';
    
    if (userAgent.includes('Chrome')) {
        browserInfo = 'Google Chrome';
    } else if (userAgent.includes('Firefox')) {
        browserInfo = 'Mozilla Firefox';
    } else if (userAgent.includes('Safari')) {
        browserInfo = 'Safari';
    } else if (userAgent.includes('Edge')) {
        browserInfo = 'Microsoft Edge';
    }
    
    showNotification(`Browser: ${browserInfo}. Check for updates in browser settings.`, 'info');
}

function showPrivacyGuide() {
    const guide = `
Browser Privacy Settings Guide:

• Block third-party cookies
• Disable location tracking
• Turn off data collection
• Enable "Do Not Track"
• Clear browsing data regularly
• Use private/incognito mode for sensitive browsing

Access these settings through your browser's Privacy or Security section.`;
    
    alert(guide);
    trackingData.tipsLearned.add('privacy-guide');
    updateStats();
}

function showDownloadTips() {
    const tips = `
Safe Download Practices:

• Only download from official websites
• Verify file checksums when available
• Scan downloads with antivirus software
• Be suspicious of unexpected downloads
• Avoid downloading from ads or pop-ups
• Check file extensions carefully
• Keep downloads folder organized and scanned

When in doubt, don't download!`;
    
    alert(tips);
    trackingData.tipsLearned.add('download-safety');
    updateStats();
}

// Enhanced activity page initialization
function initializeActivityPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const topic = urlParams.get('topic');
    
    if (!topic || !topicContent[topic]) {
        showNotification('Invalid activity topic. Redirecting to hub...', 'warning');
        setTimeout(() => window.location.href = 'hygiene-hub.html', 2000);
        return;
    }
    
    const content = topicContent[topic];
    
    // Update page title
    document.title = `CyberGuard - ${content.title}`;
    
    const titleElement = document.getElementById('activity-title');
    if (titleElement) {
        titleElement.innerHTML = `<i class="${content.icon}"></i> ${content.title}`;
    }
    
    const contentElement = document.getElementById('activity-content');
    if (contentElement) {
        contentElement.innerHTML = `
            <div class="activity-intro">
                <p class="activity-description">${content.description}</p>
                <div class="detailed-content">
                    <p>${content.detailedContent}</p>
                </div>
            </div>
            <div class="tip-box">
                <h3 class="tip-title"><i class="ri-lightbulb-flash-line"></i> Essential Security Tips</h3>
                <ul class="tips-list">
                    ${content.tips.map((tip, index) => `
                        <li class="tip-item" data-tip-id="${topic}-tip-${index}">
                            <i class="ri-check-line tip-check"></i>
                            <span class="tip-text">${tip}</span>
                            <button class="tip-action" onclick="markTipLearned('${topic}-tip-${index}', this)">
                                <i class="ri-bookmark-line"></i> Mark as Learned
                            </button>
                        </li>
                    `).join('')}
                </ul>
                <div class="tips-progress">
                    <span>Tips Learned: </span>
                    <span id="tips-learned-count">0/${content.tips.length}</span>
                </div>
            </div>
        `;
    }
    
    const widgetElement = document.getElementById('interactive-widget');
    if (widgetElement) {
        widgetElement.innerHTML = getWidgetHTML(content.widget);
    }
    
    // Initialize specific widget functionality
    setTimeout(() => {
        if (content.widget === 'passwordChecker') {
            setupPasswordChecker();
        } else if (content.widget === 'updateSchedule') {
            initializeUpdateSchedule();
        } else if (content.widget === 'browserChecklist') {
            initializeBrowserChecklist();
        }
    }, 100);
    
    // Track activity start
    trackActivityStart(topic);
    
    // Update navigation breadcrumb
    updateBreadcrumb(content.title);
}

// Mark individual tips as learned
function markTipLearned(tipId, buttonElement) {
    const tipItem = buttonElement.closest('.tip-item');
    if (!tipItem) return;
    
    if (!trackingData.tipsLearned.has(tipId)) {
        trackingData.tipsLearned.add(tipId);
        tipItem.classList.add('learned');
        buttonElement.innerHTML = '<i class="ri-bookmark-fill"></i> Learned';
        buttonElement.disabled = true;
        
        showNotification('Tip marked as learned!', 'success');
        updateTipsProgress();
        updateStats();
        saveProgress();
    }
}

// Update tips progress counter
function updateTipsProgress() {
    const countElement = document.getElementById('tips-learned-count');
    if (!countElement) return;
    
    const totalTips = document.querySelectorAll('.tip-item').length;
    const learnedTips = document.querySelectorAll('.tip-item.learned').length;
    countElement.textContent = `${learnedTips}/${totalTips}`;
}

// Track activity start time
function trackActivityStart(activityName) {
    const activityKey = `activity-start-${activityName}`;
    sessionStorage.setItem(activityKey, Date.now().toString());
}

// Initialize update schedule functionality
function initializeUpdateSchedule() {
    // Auto-check one device on load to demonstrate functionality
    setTimeout(() => {
        const devices = ['computer', 'mobile', 'browser', 'router'];
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        showNotification(`Auto-checking ${randomDevice} for demonstration...`, 'info');
        setTimeout(() => checkDeviceUpdates(randomDevice), 1000);
    }, 2000);
}

// Initialize browser checklist functionality
function initializeBrowserChecklist() {
    // Load saved checklist progress
    const savedProgress = localStorage.getItem('browser-checklist-progress');
    if (savedProgress) {
        checklistProgress = JSON.parse(savedProgress);
        
        // Update UI to reflect saved progress
        Object.keys(checklistProgress).forEach(item => {
            const checkbox = document.getElementById(`${item}-check`);
            if (checkbox) {
                checkbox.checked = checklistProgress[item];
                updateChecklistItem(item, checklistProgress[item]);
            }
        });
    }
    
    updateChecklistProgress();
}

// Update breadcrumb navigation
function updateBreadcrumb(activityTitle) {
    // This could be expanded to show a full breadcrumb trail
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.innerHTML = `<i class="ri-arrow-left-line"></i> Back to Hub`;
    }
}

// Get widget HTML for different activity types
function getWidgetHTML(widgetType) {
    if (widgetType === 'passwordChecker') {
        return `
            <div class="password-checker">
                <h3><i class="ri-shield-keyhole-line"></i> Interactive Password Strength Checker</h3>
                <p>Test different passwords to see how they measure up against security best practices.</p>
                <div class="password-input-container">
                    <input type="password" class="password-input" id="passwordInput" placeholder="Enter a password to test its strength">
                    <button class="check-btn" id="checkBtn">Analyze</button>
                    <button class="toggle-visibility" id="toggleBtn" type="button"><i class="ri-eye-off-line"></i></button>
                </div>
                <div class="strength-meter">
                    <div class="strength-fill" id="strengthFill"></div>
                </div>
                <div class="strength-text" id="strengthText">Enter a password to analyze its strength</div>
                <div class="criteria-list">
                    <div class="criterion invalid" id="lengthCriterion">
                        <i class="ri-close-line"></i><span>At least 12 characters</span>
                    </div>
                    <div class="criterion invalid" id="uppercaseCriterion">
                        <i class="ri-close-line"></i><span>Uppercase letters (A-Z)</span>
                    </div>
                    <div class="criterion invalid" id="lowercaseCriterion">
                        <i class="ri-close-line"></i><span>Lowercase letters (a-z)</span>
                    </div>
                    <div class="criterion invalid" id="numberCriterion">
                        <i class="ri-close-line"></i><span>Numbers (0-9)</span>
                    </div>
                    <div class="criterion invalid" id="symbolCriterion">
                        <i class="ri-close-line"></i><span>Special characters (!@#$%^&*)</span>
                    </div>
                    <div class="criterion invalid" id="commonCriterion">
                        <i class="ri-close-line"></i><span>Not a common password</span>
                    </div>
                </div>
                <div class="password-suggestions" id="passwordSuggestions" style="display: none;">
                    <h4><i class="ri-lightbulb-line"></i> Suggestions for Improvement:</h4>
                    <ul id="suggestionsList"></ul>
                </div>
                <div class="password-examples">
                    <h4><i class="ri-example-line"></i> Try These Examples:</h4>
                    <div class="example-passwords">
                        <button class="example-btn" onclick="tryExample('password123')">Weak Example</button>
                        <button class="example-btn" onclick="tryExample('MyP@ssw0rd2024!')">Strong Example</button>
                        <button class="example-btn" onclick="generateSecurePassword()">Generate Secure</button>
                    </div>
                </div>
            </div>
        `;
    } else if (widgetType === 'updateSchedule') {
        return `
            <div class="update-schedule">
                <h3><i class="ri-refresh-line"></i> Device Update Management Center</h3>
                <p>Track and manage updates across all your devices to maintain optimal security.</p>
                <div class="device-grid">
                    <div class="device-card" data-device="computer">
                        <div class="device-icon"><i class="ri-computer-line"></i></div>
                        <div class="device-name">Computer/Laptop</div>
                        <div class="update-status pending" id="computer-status">Check for updates</div>
                        <div class="device-actions">
                            <button class="update-btn" onclick="checkDeviceUpdates('computer')">Check Updates</button>
                            <button class="schedule-btn" onclick="scheduleUpdates('computer')">Schedule Auto-Update</button>
                        </div>
                    </div>
                    <div class="device-card" data-device="mobile">
                        <div class="device-icon"><i class="ri-smartphone-line"></i></div>
                        <div class="device-name">Mobile Device</div>
                        <div class="update-status pending" id="mobile-status">Check for updates</div>
                        <div class="device-actions">
                            <button class="update-btn" onclick="checkDeviceUpdates('mobile')">Check Updates</button>
                            <button class="schedule-btn" onclick="scheduleUpdates('mobile')">Enable Auto-Update</button>
                        </div>
                    </div>
                    <div class="device-card" data-device="browser">
                        <div class="device-icon"><i class="ri-global-line"></i></div>
                        <div class="device-name">Web Browser</div>
                        <div class="update-status pending" id="browser-status">Check for updates</div>
                        <div class="device-actions">
                            <button class="update-btn" onclick="checkDeviceUpdates('browser')">Check Updates</button>
                            <button class="schedule-btn" onclick="scheduleUpdates('browser')">Auto-Update Settings</button>
                        </div>
                    </div>
                    <div class="device-card" data-device="router">
                        <div class="device-icon"><i class="ri-router-line"></i></div>
                        <div class="device-name">Router/IoT Devices</div>
                        <div class="update-status pending" id="router-status">Check for updates</div>
                        <div class="device-actions">
                            <button class="update-btn" onclick="checkDeviceUpdates('router')">Check Updates</button>
                            <button class="schedule-btn" onclick="scheduleUpdates('router')">Setup Monitoring</button>
                        </div>
                    </div>
                </div>
                <div class="update-tips">
                    <h4><i class="ri-information-line"></i> Update Best Practices:</h4>
                    <ul>
                        <li>Enable automatic updates for critical security patches</li>
                        <li>Schedule updates during low-usage hours</li>
                        <li>Always backup important data before major updates</li>
                        <li>Restart devices after installing updates</li>
                    </ul>
                </div>
            </div>
        `;
    } else if (widgetType === 'browserChecklist') {
        return `
            <div class="browser-checklist">
                <h3><i class="ri-shield-check-line"></i> Browser Security Checklist</h3>
                <p>Complete this interactive checklist to ensure your browser is configured for maximum security.</p>
                <div class="checklist-container">
                    <div class="checklist-item" data-item="https">
                        <div class="checklist-header">
                            <input type="checkbox" id="https-check" onchange="updateChecklistItem('https', this.checked)">
                            <label for="https-check">Always verify HTTPS connections</label>
                            <span class="checklist-status">Pending</span>
                        </div>
                        <div class="checklist-description">Look for the padlock icon and "https://" in the address bar</div>
                        <button class="test-btn" onclick="testHTTPS()">Test Current Site</button>
                    </div>
                    <div class="checklist-item" data-item="adblocker">
                        <div class="checklist-header">
                            <input type="checkbox" id="adblocker-check" onchange="updateChecklistItem('adblocker', this.checked)">
                            <label for="adblocker-check">Install and enable ad blocker</label>
                            <span class="checklist-status">Pending</span>
                        </div>
                        <div class="checklist-description">Blocks malicious ads and tracking scripts</div>
                        <button class="test-btn" onclick="testAdBlocker()">Check Ad Blocker</button>
                    </div>
                    <div class="checklist-item" data-item="updates">
                        <div class="checklist-header">
                            <input type="checkbox" id="browser-updates-check" onchange="updateChecklistItem('updates', this.checked)">
                            <label for="browser-updates-check">Keep browser updated</label>
                            <span class="checklist-status">Pending</span>
                        </div>
                        <div class="checklist-description">Latest version includes security patches</div>
                        <button class="test-btn" onclick="checkBrowserVersion()">Check Version</button>
                    </div>
                    <div class="checklist-item" data-item="privacy">
                        <div class="checklist-header">
                            <input type="checkbox" id="privacy-check" onchange="updateChecklistItem('privacy', this.checked)">
                            <label for="privacy-check">Configure privacy settings</label>
                            <span class="checklist-status">Pending</span>
                        </div>
                        <div class="checklist-description">Disable tracking and limit data collection</div>
                        <button class="test-btn" onclick="showPrivacyGuide()">View Guide</button>
                    </div>
                    <div class="checklist-item" data-item="downloads">
                        <div class="checklist-header">
                            <input type="checkbox" id="downloads-check" onchange="updateChecklistItem('downloads', this.checked)">
                            <label for="downloads-check">Verify download sources</label>
                            <span class="checklist-status">Pending</span>
                        </div>
                        <div class="checklist-description">Only download from trusted, official sources</div>
                        <button class="test-btn" onclick="showDownloadTips()">Learn More</button>
                    </div>
                </div>
                <div class="checklist-progress">
                    <div class="progress-label">
                        <span>Security Checklist Progress</span>
                        <span id="checklist-progress-text">0/5 completed</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="checklist-progress-fill" style="width: 0%;"></div>
                    </div>
                </div>
                <div class="security-score-display">
                    <h4><i class="ri-trophy-line"></i> Your Browser Security Score: <span id="browser-security-score">0/100</span></h4>
                </div>
            </div>
        `;
    }
    return '<div class="widget-placeholder">Interactive widget loading...</div>';
}

// Navigation functions
function goBack() {
    window.history.back();
}

// Comprehensive review system with advanced UI
function openReviewPage() {
    // Collect all learned tips and activities
    const allTips = [];
    const completedActivities = [];
    const securityRecommendations = [];
    
    // Gather tips from all topics
    Object.keys(topicContent).forEach(topic => {
        const content = topicContent[topic];
        const topicTips = content.tips.map((tip, index) => ({
            id: `${topic}-tip-${index}`,
            text: tip,
            topic: content.title,
            learned: trackingData.tipsLearned.has(`${topic}-tip-${index}`)
        }));
        allTips.push(...topicTips);
        
        if (trackingData.activitiesCompleted.includes(topic)) {
            completedActivities.push({
                name: content.title,
                icon: content.icon,
                description: content.description
            });
        }
    });
    
    // Generate personalized recommendations
    if (trackingData.passwordsChecked < 3) {
        securityRecommendations.push('Practice more with the password strength checker to improve your password creation skills.');
    }
    if (trackingData.deviceUpdatesChecked < 2) {
        securityRecommendations.push('Check for updates on more of your devices to ensure comprehensive security.');
    }
    if (trackingData.browsingTipsCompleted < 3) {
        securityRecommendations.push('Complete more browser security checklist items for safer web browsing.');
    }
    if (trackingData.securityScore < 70) {
        securityRecommendations.push('Continue engaging with activities to improve your overall security score.');
    }
    
    // Calculate progress metrics
    const progressPercentage = Math.round((trackingData.activitiesCompleted.length / 3) * 100);
    const learnedTipsCount = Array.from(trackingData.tipsLearned).filter(tip => 
        tip.includes('-tip-') || tip.includes('password-strength') || tip.includes('browsing-') || tip.includes('update-check')
    ).length;
    
    // Create advanced review page HTML with enhanced visuals
    const reviewHTML = `
        <div class="review-overlay" id="reviewOverlay">
            <div class="floating-particles">
                ${Array.from({length: 20}, (_, i) => {
                    const left = Math.random() * 100;
                    const animationDelay = Math.random() * 3;
                    const animationDuration = 8 + Math.random() * 4;
                    return `<div class="particle particle-${i % 4}" style="
                        left: ${left}%;
                        animation-delay: ${animationDelay}s;
                        animation-duration: ${animationDuration}s;
                    "></div>`;
                }).join('')}
            </div>
            <div class="review-container">
                <div class="holographic-border"></div>
                <div class="review-header">
                    <div class="header-decoration">
                        <div class="cyber-grid"></div>
                        <div class="pulse-ring"></div>
                    </div>
                    <h2><i class="ri-shield-star-line cyber-icon"></i> <span class="glitch-text">Cyber Hygiene</span> <span class="gradient-text">Mastery Dashboard</span></h2>
                    <div class="security-level-indicator">
                        <div class="level-bar">
                            <div class="level-fill" style="width: ${Math.min(trackingData.securityScore, 100)}%;"></div>
                        </div>
                        <span class="level-text">Security Level ${Math.floor(trackingData.securityScore / 20) + 1}</span>
                    </div>
                    <button class="close-review" onclick="closeReviewPage()" title="Close Review">
                        <div class="close-ripple"></div>
                        <i class="ri-close-line"></i>
                    </button>
                </div>
                
                <div class="review-content">
                    <!-- Enhanced Progress Overview Section -->
                    <div class="review-section quantum-section">
                        <div class="section-header">
                            <h3><i class="ri-trophy-line trophy-spin"></i> <span class="neon-text">Learning Progress Overview</span></h3>
                            <div class="data-stream"></div>
                        </div>
                        <div class="progress-summary">
                            <div class="progress-ring-container">
                                <div class="progress-ring enhanced-ring">
                                    <svg width="140" height="140" viewBox="0 0 140 140">
                                        <defs>
                                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" style="stop-color:#10b981"/>
                                                <stop offset="50%" style="stop-color:#34d399"/>
                                                <stop offset="100%" style="stop-color:#6ee7b7"/>
                                            </linearGradient>
                                            <filter id="glow">
                                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur"/>
                                                    <feMergeNode in="SourceGraphic"/>
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        <!-- Background ring -->
                                        <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8"/>
                                        <!-- Pulse ring -->
                                        <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(16,185,129,0.3)" stroke-width="2" class="pulse-ring-svg"/>
                                        <!-- Progress ring -->
                                        <circle cx="70" cy="70" r="60" fill="none" stroke="url(#progressGradient)" stroke-width="8" 
                                            stroke-dasharray="${2 * Math.PI * 60}" stroke-dashoffset="${2 * Math.PI * 60 * (1 - progressPercentage / 100)}"
                                            transform="rotate(-90 70 70)" style="transition: stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1); filter: url(#glow);"/>
                                        <!-- Center dot -->
                                        <circle cx="70" cy="70" r="4" fill="var(--hygiene-primary)" class="center-pulse"/>
                                    </svg>
                                    <div class="progress-text enhanced-text">
                                        <span class="progress-number hologram-number">${progressPercentage}%</span>
                                        <span class="progress-label">Complete</span>
                                        <div class="completion-spark"></div>
                                    </div>
                                </div>
                                <div class="orbital-elements">
                                    <div class="orbit orbit-1">
                                        <div class="satellite"><i class="ri-shield-check-line"></i></div>
                                    </div>
                                    <div class="orbit orbit-2">
                                        <div class="satellite"><i class="ri-key-line"></i></div>
                                    </div>
                                    <div class="orbit orbit-3">
                                        <div class="satellite"><i class="ri-global-line"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-details">
                                <h4>Your Security Journey</h4>
                                <p>You've completed <strong>${trackingData.activitiesCompleted.length} of 3</strong> essential cyber hygiene modules.</p>
                                <div class="achievement-badges">
                                    ${generateAchievementBadges()}
                                </div>
                            </div>
                        </div>
                        
                        <div class="review-stats enhanced-stats">
                            <div class="review-stat cyber-stat" data-stat="activities">
                                <div class="stat-background">
                                    <div class="neural-network"></div>
                                </div>
                                <div class="stat-icon pulsing-icon"><i class="ri-checkbox-circle-line"></i></div>
                                <div class="stat-content">
                                    <span class="stat-number matrix-number" data-target="${trackingData.activitiesCompleted.length}">${trackingData.activitiesCompleted.length}</span>
                                    <span class="stat-total">/3</span>
                                    <span class="stat-label">Activities Completed</span>
                                    <div class="progress-bar-mini">
                                        <div class="progress-fill-mini" style="width: ${(trackingData.activitiesCompleted.length / 3) * 100}%;"></div>
                                    </div>
                                </div>
                                <div class="stat-sparkle"></div>
                            </div>
                            <div class="review-stat cyber-stat" data-stat="time">
                                <div class="stat-background">
                                    <div class="time-waves"></div>
                                </div>
                                <div class="stat-icon pulsing-icon"><i class="ri-time-line"></i></div>
                                <div class="stat-content">
                                    <span class="stat-number matrix-number" data-target="${trackingData.timeSpent}">${trackingData.timeSpent}</span>
                                    <span class="stat-unit">min</span>
                                    <span class="stat-label">Time Invested</span>
                                    <div class="time-efficiency-indicator ${trackingData.timeSpent > 30 ? 'high' : trackingData.timeSpent > 15 ? 'medium' : 'low'}"></div>
                                </div>
                                <div class="stat-sparkle"></div>
                            </div>
                            <div class="review-stat cyber-stat" data-stat="score">
                                <div class="stat-background">
                                    <div class="security-matrix"></div>
                                </div>
                                <div class="stat-icon pulsing-icon"><i class="ri-shield-star-line"></i></div>
                                <div class="stat-content">
                                    <span class="stat-number matrix-number" data-target="${trackingData.securityScore}">${trackingData.securityScore}</span>
                                    <span class="stat-total">/100</span>
                                    <span class="stat-label">Security Score</span>
                                    <div class="score-rank ${trackingData.securityScore >= 80 ? 'expert' : trackingData.securityScore >= 60 ? 'advanced' : trackingData.securityScore >= 40 ? 'intermediate' : 'beginner'}">
                                        ${trackingData.securityScore >= 80 ? 'Expert' : trackingData.securityScore >= 60 ? 'Advanced' : trackingData.securityScore >= 40 ? 'Intermediate' : 'Beginner'}
                                    </div>
                                </div>
                                <div class="stat-sparkle"></div>
                            </div>
                            <div class="review-stat cyber-stat" data-stat="tips">
                                <div class="stat-background">
                                    <div class="knowledge-particles"></div>
                                </div>
                                <div class="stat-icon pulsing-icon"><i class="ri-lightbulb-line"></i></div>
                                <div class="stat-content">
                                    <span class="stat-number matrix-number" data-target="${learnedTipsCount}">${learnedTipsCount}</span>
                                    <span class="stat-label">Tips Mastered</span>
                                    <div class="knowledge-level">
                                        <div class="knowledge-bar">
                                            <div class="knowledge-fill" style="width: ${Math.min((learnedTipsCount / 21) * 100, 100)}%;"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="stat-sparkle"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Completed Activities Section -->
                    <div class="review-section">
                        <h3><i class="ri-check-double-line"></i> Mastered Security Domains</h3>
                        <div class="completed-activities-list">
                            ${completedActivities.length > 0 ? 
                                completedActivities.map(activity => `
                                    <div class="completed-activity">
                                        <i class="${activity.icon}"></i>
                                        <div class="activity-info">
                                            <h4>${activity.name}</h4>
                                            <p>${activity.description}</p>
                                        </div>
                                        <div class="completion-check">
                                            <i class="ri-medal-line"></i>
                                        </div>
                                    </div>
                                `).join('') :
                                `<div class="no-activities">
                                    <div class="no-activities-icon"><i class="ri-book-open-line"></i></div>
                                    <h4>Ready to Start Learning?</h4>
                                    <p>Complete activities to see your achievements here. Each module you finish builds your cyber security expertise!</p>
                                    <button class="btn" onclick="closeReviewPage(); window.location.href='hygiene-hub.html'">
                                        <i class="ri-play-line"></i> Start Learning
                                    </button>
                                </div>`
                            }
                        </div>
                    </div>
                    
                    <!-- Enhanced Security Knowledge Base Section -->
                    <div class="review-section quantum-section">
                        <div class="section-header">
                            <h3><i class="ri-database-line"></i> <span class="neon-text">Your Security Knowledge Base</span></h3>
                            <div class="knowledge-stats-mini">
                                <div class="mini-stat">
                                    <span class="mini-value">${allTips.filter(tip => tip.learned).length}</span>
                                    <span class="mini-label">Learned</span>
                                </div>
                                <div class="mini-stat">
                                    <span class="mini-value">${Math.round((allTips.filter(tip => tip.learned).length / allTips.length) * 100)}%</span>
                                    <span class="mini-label">Coverage</span>
                                </div>
                            </div>
                        </div>
                        <div class="knowledge-summary enhanced-summary">
                            <div class="knowledge-stats holographic-panel">
                                <div class="knowledge-visualization">
                                    <div class="brain-network">
                                        <div class="neural-node main-node">
                                            <i class="ri-brain-line"></i>
                                        </div>
                                        <div class="neural-connections">
                                            ${Array.from({length: 8}, (_, i) => `
                                                <div class="neural-connection connection-${i}" style="--delay: ${i * 0.2}s">
                                                    <div class="connection-pulse"></div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                                <div class="knowledge-stats-grid">
                                    <div class="knowledge-stat crystal-stat">
                                        <div class="crystal-background"></div>
                                        <span class="stat-value quantum-number">${allTips.filter(tip => tip.learned).length}</span>
                                        <span class="stat-desc">Tips Learned</span>
                                        <div class="energy-wave"></div>
                                    </div>
                                    <div class="knowledge-stat crystal-stat">
                                        <div class="crystal-background"></div>
                                        <span class="stat-value quantum-number">${allTips.length}</span>
                                        <span class="stat-desc">Total Available</span>
                                        <div class="energy-wave"></div>
                                    </div>
                                    <div class="knowledge-stat crystal-stat">
                                        <div class="crystal-background"></div>
                                        <span class="stat-value quantum-number">${Math.round((allTips.filter(tip => tip.learned).length / allTips.length) * 100)}%</span>
                                        <span class="stat-desc">Knowledge Coverage</span>
                                        <div class="energy-wave"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tips-reference enhanced-tips">
                            <div class="tips-filter cyber-filter">
                                <div class="filter-background">
                                    <div class="digital-pattern"></div>
                                </div>
                                <button class="filter-btn active" onclick="filterTips('all')">
                                    <span class="btn-text">All Tips</span>
                                    <div class="btn-indicator"></div>
                                    <div class="btn-ripple"></div>
                                </button>
                                <button class="filter-btn" onclick="filterTips('learned')">
                                    <span class="btn-text">Learned</span>
                                    <div class="btn-indicator"></div>
                                    <div class="btn-ripple"></div>
                                </button>
                                <button class="filter-btn" onclick="filterTips('unlearned')">
                                    <span class="btn-text">To Review</span>
                                    <div class="btn-indicator"></div>
                                    <div class="btn-ripple"></div>
                                </button>
                                <div class="search-field">
                                    <input type="text" placeholder="Search tips..." class="tip-search" oninput="searchTips(this.value)">
                                    <i class="ri-search-line search-icon"></i>
                                </div>
                            </div>
                            
                            <div class="tips-grid" id="tipsGrid">
                                ${allTips.map(tip => `
                                    <div class="tip-reference-item ${tip.learned ? 'learned' : ''}" data-category="${tip.learned ? 'learned' : 'unlearned'}">
                                        <div class="tip-reference-header">
                                            <span class="tip-topic">${tip.topic}</span>
                                            <div class="tip-status-badge ${tip.learned ? 'learned' : 'pending'}">
                                                <i class="${tip.learned ? 'ri-check-line' : 'ri-time-line'}"></i>
                                                ${tip.learned ? 'Mastered' : 'Review'}
                                            </div>
                                        </div>
                                        <p class="tip-reference-text">${tip.text}</p>
                                        <div class="tip-actions">
                                            <button class="copy-tip-btn" onclick="copyTipToClipboard('${tip.text.replace(/'/g, "\\'").replace(/"/g, '\\"')}')"
                                                title="Copy tip to clipboard">
                                                <i class="ri-file-copy-line"></i> Copy
                                            </button>
                                            ${!tip.learned ? `
                                                <button class="mark-learned-btn" onclick="markTipAsLearned('${tip.id}', this)" 
                                                    title="Mark as learned">
                                                    <i class="ri-check-line"></i> Mark Learned
                                                </button>
                                            ` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    ${securityRecommendations.length > 0 ? `
                        <div class="review-section">
                            <h3><i class="ri-compass-line"></i> Personalized Security Roadmap</h3>
                            <div class="recommendations-container">
                                <div class="recommendations-intro">
                                    <p>Based on your learning progress, here are targeted recommendations to strengthen your cybersecurity posture:</p>
                                </div>
                                <div class="recommendations-list">
                                    ${securityRecommendations.map((rec, index) => `
                                        <div class="recommendation-item priority-${Math.min(index + 1, 3)}">
                                            <div class="rec-icon"><i class="ri-flag-line"></i></div>
                                            <div class="rec-content">
                                                <h5>Priority ${index + 1}</h5>
                                                <p>${rec}</p>
                                            </div>
                                            <div class="rec-action">
                                                <i class="ri-arrow-right-line"></i>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <!-- Learning Impact Section -->
                    <div class="review-section">
                        <h3><i class="ri-rocket-line"></i> Your Security Impact</h3>
                        <div class="impact-metrics">
                            <div class="impact-card">
                                <div class="impact-icon"><i class="ri-shield-check-line"></i></div>
                                <div class="impact-content">
                                    <h4>Password Security</h4>
                                    <p>Tested <strong>${trackingData.passwordsChecked}</strong> passwords</p>
                                    <div class="impact-level ${trackingData.passwordsChecked >= 5 ? 'high' : trackingData.passwordsChecked >= 3 ? 'medium' : 'low'}">
                                        ${trackingData.passwordsChecked >= 5 ? 'Expert Level' : trackingData.passwordsChecked >= 3 ? 'Intermediate' : 'Beginner'}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="impact-card">
                                <div class="impact-icon"><i class="ri-refresh-line"></i></div>
                                <div class="impact-content">
                                    <h4>Update Management</h4>
                                    <p>Checked <strong>${trackingData.deviceUpdatesChecked}</strong> devices</p>
                                    <div class="impact-level ${trackingData.deviceUpdatesChecked >= 3 ? 'high' : trackingData.deviceUpdatesChecked >= 2 ? 'medium' : 'low'}">
                                        ${trackingData.deviceUpdatesChecked >= 3 ? 'Proactive' : trackingData.deviceUpdatesChecked >= 2 ? 'Aware' : 'Starting'}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="impact-card">
                                <div class="impact-icon"><i class="ri-global-line"></i></div>
                                <div class="impact-content">
                                    <h4>Safe Browsing</h4>
                                    <p>Completed <strong>${trackingData.browsingTipsCompleted}</strong> safety checks</p>
                                    <div class="impact-level ${trackingData.browsingTipsCompleted >= 4 ? 'high' : trackingData.browsingTipsCompleted >= 2 ? 'medium' : 'low'}">
                                        ${trackingData.browsingTipsCompleted >= 4 ? 'Vigilant' : trackingData.browsingTipsCompleted >= 2 ? 'Cautious' : 'Learning'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="review-actions enhanced-actions-panel">
                    <div class="action-group primary-actions">
                        <button class="btn quantum-btn primary" onclick="exportDetailedReport()" title="Download detailed progress report">
                            <div class="btn-hologram"></div>
                            <i class="ri-download-line"></i> 
                            <span>Export Report</span>
                            <div class="btn-particles"></div>
                        </button>
                        <button class="btn quantum-btn secondary" onclick="copyAllTips()" title="Copy all tips to clipboard">
                            <div class="btn-hologram"></div>
                            <i class="ri-file-copy-line"></i> 
                            <span>Copy All Tips</span>
                            <div class="btn-particles"></div>
                        </button>
                    </div>
                    <div class="action-group secondary-actions">
                        <button class="btn quantum-btn tertiary" onclick="shareProgress()" title="Share your progress">
                            <div class="btn-hologram"></div>
                            <i class="ri-share-line"></i> 
                            <span>Share Progress</span>
                            <div class="btn-particles"></div>
                        </button>
                        <button class="btn quantum-btn tertiary" onclick="printSummary()" title="Print learning summary">
                            <div class="btn-hologram"></div>
                            <i class="ri-printer-line"></i> 
                            <span>Print Summary</span>
                            <div class="btn-particles"></div>
                        </button>
                    </div>
                    <div class="action-group close-action">
                        <button class="btn quantum-btn close-btn" onclick="closeReviewPage()">
                            <div class="btn-hologram"></div>
                            <i class="ri-close-line"></i> 
                            <span>Close</span>
                            <div class="btn-particles"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add review page to document
    const existingOverlay = document.getElementById('reviewOverlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    try {
        document.body.insertAdjacentHTML('beforeend', reviewHTML);
        
        // Show the overlay with animation
        setTimeout(() => {
            const overlay = document.getElementById('reviewOverlay');
            if (overlay) {
                overlay.classList.add('show');
                console.log('Review overlay displayed successfully with advanced features');
            } else {
                console.error('Failed to find review overlay after creation');
            }
        }, 10);
        
        // Track review page access
        trackingData.tipsLearned.add('review-page-accessed');
        updateStats();
        saveProgress();
        
        // Add click outside to close functionality
        setTimeout(() => {
            const overlay = document.getElementById('reviewOverlay');
            if (overlay) {
                overlay.addEventListener('click', function(e) {
                    if (e.target === overlay) {
                        closeReviewPage();
                    }
                });
                
                // Add escape key listener
                document.addEventListener('keydown', handleEscapeKey);
                
                // Focus the overlay for accessibility
                overlay.setAttribute('tabindex', '-1');
                overlay.focus();
            }
        }, 100);
        
    } catch (error) {
        console.error('Error creating review overlay:', error);
        showNotification('Error opening review page. Please try again.', 'error');
    }
}

// Generate achievement badges for review page
function generateAchievementBadges() {
    const achievements = generateAchievements();
    return achievements.map(achievement => `
        <div class="achievement-badge" title="${achievement.description}">
            <div class="badge-icon">
                <i class="${getBadgeIcon(achievement.name)}"></i>
            </div>
            <span class="badge-name">${achievement.name}</span>
        </div>
    `).join('');
}

// Get appropriate icon for achievement badge
function getBadgeIcon(achievementName) {
    const icons = {
        'First Steps': 'ri-foot-print-line',
        'Hygiene Expert': 'ri-star-line',
        'Password Pro': 'ri-shield-keyhole-line',
        'Security Champion': 'ri-award-line',
        'Dedicated Learner': 'ri-time-line'
    };
    return icons[achievementName] || 'ri-medal-line';
}

// Filter tips in review page with enhanced animations
function filterTips(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tipItems = document.querySelectorAll('.tip-reference-item');
    
    // Update active filter button with enhanced animations
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        const indicator = btn.querySelector('.btn-indicator');
        if (indicator) indicator.style.transform = 'scaleX(0)';
    });
    event.target.classList.add('active');
    const activeIndicator = event.target.querySelector('.btn-indicator');
    if (activeIndicator) {
        activeIndicator.style.transform = 'scaleX(1)';
    }
    
    // Filter tip items with staggered animations
    tipItems.forEach((item, index) => {
        if (category === 'all') {
            item.style.display = 'block';
            item.style.animation = `fadeInUp 0.4s ease forwards`;
            item.style.animationDelay = `${index * 0.05}s`;
        } else {
            const itemCategory = item.getAttribute('data-category');
            if (itemCategory === category) {
                item.style.display = 'block';
                item.style.animation = `fadeInUp 0.4s ease forwards`;
                item.style.animationDelay = `${index * 0.05}s`;
            } else {
                item.style.animation = 'fadeOut 0.2s ease forwards';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 200);
            }
        }
    });
    
    // Trigger grid reorganization animation
    const grid = document.getElementById('tipsGrid');
    if (grid) {
        grid.classList.add('reorganizing');
        setTimeout(() => {
            grid.classList.remove('reorganizing');
        }, 500);
    }
}

// Search tips functionality
function searchTips(searchTerm) {
    const tipItems = document.querySelectorAll('.tip-reference-item');
    const searchLower = searchTerm.toLowerCase();
    
    tipItems.forEach((item, index) => {
        const tipText = item.querySelector('.tip-reference-text').textContent.toLowerCase();
        const tipTopic = item.querySelector('.tip-topic').textContent.toLowerCase();
        
        const matches = tipText.includes(searchLower) || tipTopic.includes(searchLower);
        
        if (matches || searchTerm === '') {
            item.style.display = 'block';
            item.style.animation = `searchFadeIn 0.3s ease forwards`;
            item.style.animationDelay = `${index * 0.03}s`;
            
            // Highlight search terms
            if (searchTerm) {
                highlightSearchTerm(item, searchTerm);
            } else {
                removeHighlights(item);
            }
        } else {
            item.style.animation = 'searchFadeOut 0.2s ease forwards';
            setTimeout(() => {
                item.style.display = 'none';
            }, 200);
        }
    });
    
    // Show search results count
    const visibleCount = Array.from(tipItems).filter(item => 
        item.style.display !== 'none'
    ).length;
    
    // Update search indicator
    const searchField = document.querySelector('.tip-search');
    if (searchField) {
        if (searchTerm && visibleCount === 0) {
            searchField.classList.add('no-results');
        } else {
            searchField.classList.remove('no-results');
        }
    }
}

// Highlight search terms
function highlightSearchTerm(item, term) {
    const textElement = item.querySelector('.tip-reference-text');
    const originalText = textElement.dataset.originalText || textElement.textContent;
    
    if (!textElement.dataset.originalText) {
        textElement.dataset.originalText = originalText;
    }
    
    const regex = new RegExp(`(${term})`, 'gi');
    const highlightedText = originalText.replace(regex, '<mark class="search-highlight">$1</mark>');
    textElement.innerHTML = highlightedText;
}

// Close review page with animation
function closeReviewPage() {
    const overlay = document.getElementById('reviewOverlay');
    if (overlay) {
        // Add closing animation
        overlay.classList.remove('show');
        const container = overlay.querySelector('.review-container');
        if (container) {
            container.style.transform = 'scale(0.8) translateY(50px)';
            container.style.opacity = '0';
        }
        
        // Remove overlay after animation
        setTimeout(() => {
            overlay.remove();
            // Remove escape key listener
            document.removeEventListener('keydown', handleEscapeKey);
        }, 400);
        
        // Track review page closure
        trackingData.tipsLearned.add('review-page-closed');
        saveProgress();
        
        console.log('Review overlay closed successfully');
    }
}

// Handle escape key to close overlay
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeReviewPage();
    }
}

// Enhanced share progress functionality
function shareProgress() {
    const progressData = {
        user: currentUser ? currentUser.fullname : 'Guest User',
        module: 'Cyber Hygiene Essentials',
        completedActivities: trackingData.activitiesCompleted.length,
        totalActivities: 3,
        securityScore: trackingData.securityScore,
        timeSpent: trackingData.timeSpent,
        date: new Date().toLocaleDateString()
    };
    
    const shareText = `🛡️ Cyber Hygiene Progress Update\n\n` +
        `👤 Student: ${progressData.user}\n` +
        `📚 Module: ${progressData.module}\n` +
        `✅ Completed: ${progressData.completedActivities}/${progressData.totalActivities} activities\n` +
        `🎯 Security Score: ${progressData.securityScore}/100\n` +
        `⏱️ Time Invested: ${progressData.timeSpent} minutes\n` +
        `📅 Date: ${progressData.date}\n\n` +
        `🚀 Building a safer digital future through cybersecurity awareness!\n\n` +
        `#CyberSecurity #DigitalSafety #CyberGuard`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Cyber Hygiene Progress',
            text: shareText
        }).then(() => {
            showNotification('Progress shared successfully!', 'success');
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

// Helper function for clipboard operations
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Progress copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback clipboard function
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Progress copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Unable to copy to clipboard. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Mark tip as learned from review page
function markTipAsLearned(tipId, buttonElement) {
    if (!trackingData.tipsLearned.has(tipId)) {
        trackingData.tipsLearned.add(tipId);
        
        // Update UI
        const tipItem = buttonElement.closest('.tip-reference-item');
        if (tipItem) {
            tipItem.classList.add('learned');
            tipItem.setAttribute('data-category', 'learned');
            
            // Update status badge
            const statusBadge = tipItem.querySelector('.tip-status-badge');
            if (statusBadge) {
                statusBadge.className = 'tip-status-badge learned';
                statusBadge.innerHTML = '<i class="ri-check-line"></i> Mastered';
            }
            
            // Remove the mark learned button
            buttonElement.remove();
        }
        
        updateStats();
        saveProgress();
        showNotification('Tip marked as learned!', 'success');
    }
}

// Print summary functionality
function printSummary() {
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cyber Hygiene Learning Summary</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #10b981; padding-bottom: 20px; }
                .section { margin-bottom: 25px; }
                .section h3 { color: #10b981; margin-bottom: 15px; }
                .stats { display: flex; justify-content: space-around; margin: 20px 0; }
                .stat { text-align: center; }
                .stat-number { font-size: 24px; font-weight: bold; color: #10b981; }
                .activities { margin: 20px 0; }
                .activity { margin-bottom: 10px; padding: 10px; background: #f0f9ff; border-radius: 5px; }
                .tips { margin: 20px 0; }
                .tip { margin-bottom: 8px; padding: 8px; background: #f9f9f9; border-radius: 3px; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Cyber Hygiene Learning Summary</h1>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
                <p>Student: ${currentUser ? currentUser.fullname : 'Guest User'}</p>
            </div>
            
            <div class="section">
                <h3>Progress Overview</h3>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-number">${trackingData.activitiesCompleted.length}/3</div>
                        <div>Activities</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${trackingData.timeSpent}</div>
                        <div>Minutes</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${trackingData.securityScore}/100</div>
                        <div>Security Score</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${trackingData.tipsLearned.size}</div>
                        <div>Tips Learned</div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>Completed Activities</h3>
                <div class="activities">
                    ${trackingData.activitiesCompleted.length > 0 ? 
                        trackingData.activitiesCompleted.map(activity => 
                            `<div class="activity">✓ ${formatActivityName(activity)}</div>`
                        ).join('') :
                        '<div class="activity">No activities completed yet.</div>'
                    }
                </div>
            </div>
            
            <div class="section">
                <h3>Key Security Tips</h3>
                <div class="tips">
                    ${Object.keys(topicContent).map(topic => {
                        const content = topicContent[topic];
                        return `
                            <h4>${content.title}</h4>
                            ${content.tips.map(tip => `<div class="tip">• ${tip}</div>`).join('')}
                        `;
                    }).join('')}
                </div>
            </div>
            
            <div class="section">
                <h3>Next Steps</h3>
                <div class="tips">
                    <div class="tip">• Continue practicing with interactive security tools</div>
                    <div class="tip">• Review security tips regularly</div>
                    <div class="tip">• Apply learned concepts in daily digital activities</div>
                    <div class="tip">• Consider advanced cybersecurity training</div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
    
    showNotification('Print summary generated!', 'success');
}

// Copy individual tip to clipboard
function copyTipToClipboard(tipText) {
    navigator.clipboard.writeText(tipText).then(() => {
        showNotification('Tip copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = tipText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Tip copied to clipboard!', 'success');
    });
}

// Copy all tips to clipboard
function copyAllTips() {
    const allTipsText = [];
    
    Object.keys(topicContent).forEach(topic => {
        const content = topicContent[topic];
        allTipsText.push(`\n${content.title.toUpperCase()}:`);
        content.tips.forEach((tip, index) => {
            allTipsText.push(`${index + 1}. ${tip}`);
        });
    });
    
    const fullText = `CYBER HYGIENE SECURITY TIPS\n${"=".repeat(50)}${allTipsText.join('\n')}\n\nGenerated by CyberGuard Training Platform`;
    
    navigator.clipboard.writeText(fullText).then(() => {
        showNotification('All tips copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback method
        const textArea = document.createElement('textarea');
        textArea.value = fullText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('All tips copied to clipboard!', 'success');
    });
}

// Export detailed report
function exportDetailedReport() {
    const reportData = {
        user: currentUser ? currentUser.fullname : 'Guest User',
        module: 'Cyber Hygiene Essentials',
        generatedDate: new Date().toISOString(),
        summary: {
            activitiesCompleted: trackingData.activitiesCompleted.length,
            totalActivities: 3,
            timeSpent: trackingData.timeSpent,
            securityScore: trackingData.securityScore,
            tipsLearned: trackingData.tipsLearned.size,
            passwordsChecked: trackingData.passwordsChecked,
            deviceUpdatesChecked: trackingData.deviceUpdatesChecked,
            browsingTipsCompleted: trackingData.browsingTipsCompleted
        },
        completedActivities: trackingData.activitiesCompleted,
        securityTips: Object.keys(topicContent).map(topic => ({
            topic: topicContent[topic].title,
            tips: topicContent[topic].tips
        })),
        recommendations: generatePersonalizedRecommendations(),
        nextSteps: [
            'Continue practicing with the password checker',
            'Regularly check for software updates',
            'Implement safe browsing habits daily',
            'Consider taking additional cybersecurity training modules'
        ]
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber_hygiene_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Detailed report exported successfully!', 'success');
}

// Generate personalized recommendations
function generatePersonalizedRecommendations() {
    const recommendations = [];
    
    if (trackingData.securityScore < 50) {
        recommendations.push('Focus on completing more activities to improve your security awareness');
    }
    if (trackingData.passwordsChecked < 5) {
        recommendations.push('Practice more with password creation to develop stronger security habits');
    }
    if (trackingData.activitiesCompleted.length < 3) {
        recommendations.push('Complete remaining activities for comprehensive cyber hygiene knowledge');
    }
    
    return recommendations;
}

// Share progress functionality
function shareProgress() {
    const shareText = `I've completed ${trackingData.activitiesCompleted.length}/3 cyber hygiene activities and achieved a security score of ${trackingData.securityScore}/100 on CyberGuard Training Platform! 🛡️💻`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Cyber Hygiene Progress',
            text: shareText,
            url: window.location.origin
        }).then(() => {
            showNotification('Progress shared successfully!', 'success');
        }).catch(() => {
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

// Fallback share method
function fallbackShare(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Progress text copied to clipboard! Share it wherever you like.', 'success');
    }).catch(() => {
        alert(`Share your progress:\n\n${text}`);
    });
}

// Enhanced export progress functionality
function exportProgress() {
    const exportData = {
        user: currentUser ? currentUser.fullname : 'Guest User',
        userEmail: currentUser ? currentUser.email : 'guest@example.com',
        module: 'Cyber Hygiene Essentials',
        exportDate: new Date().toISOString(),
        progress: {
            activitiesCompleted: trackingData.activitiesCompleted,
            totalActivities: 3,
            completionPercentage: Math.round((trackingData.activitiesCompleted.length / 3) * 100),
            securityScore: trackingData.securityScore,
            timeSpent: trackingData.timeSpent,
            tipsLearned: Array.from(trackingData.tipsLearned),
            passwordsChecked: trackingData.passwordsChecked,
            deviceUpdatesChecked: trackingData.deviceUpdatesChecked,
            browsingTipsCompleted: trackingData.browsingTipsCompleted,
            moduleCompleted: trackingData.moduleCompleted
        },
        achievements: generateAchievements(),
        nextRecommendations: generatePersonalizedRecommendations()
    };
    
    // Create both JSON and readable text formats
    const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    
    // Create human-readable format
    const readableReport = generateReadableReport(exportData);
    const textBlob = new Blob([readableReport], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    
    // Show export options
    const exportOptions = `
        <div class="export-overlay" id="exportOverlay">
            <div class="export-container">
                <div class="export-header">
                    <h3><i class="ri-download-line"></i> Export Your Progress</h3>
                    <button class="close-export" onclick="closeExportOptions()">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
                <div class="export-options">
                    <div class="export-option">
                        <div class="export-icon"><i class="ri-file-text-line"></i></div>
                        <div class="export-info">
                            <h4>Readable Report</h4>
                            <p>Human-friendly text format perfect for sharing or printing</p>
                        </div>
                        <a href="${textUrl}" download="cyber_hygiene_progress_${new Date().toISOString().split('T')[0]}.txt" class="export-btn">
                            <i class="ri-download-line"></i> Download Text
                        </a>
                    </div>
                    <div class="export-option">
                        <div class="export-icon"><i class="ri-code-line"></i></div>
                        <div class="export-info">
                            <h4>JSON Data</h4>
                            <p>Structured data format for technical analysis or import</p>
                        </div>
                        <a href="${jsonUrl}" download="cyber_hygiene_data_${new Date().toISOString().split('T')[0]}.json" class="export-btn">
                            <i class="ri-download-line"></i> Download JSON
                        </a>
                    </div>
                </div>
                <div class="export-actions">
                    <button class="btn btn-secondary" onclick="closeExportOptions()">
                        <i class="ri-close-line"></i> Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', exportOptions);
    
    setTimeout(() => {
        const overlay = document.getElementById('exportOverlay');
        if (overlay) overlay.classList.add('show');
    }, 10);
    
    showNotification('Export options ready! Choose your preferred format.', 'success');
}

// Close export options
function closeExportOptions() {
    const overlay = document.getElementById('exportOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
}

// Generate achievements based on progress
function generateAchievements() {
    const achievements = [];
    
    if (trackingData.activitiesCompleted.length >= 1) {
        achievements.push({ name: 'First Steps', description: 'Completed your first cyber hygiene activity' });
    }
    if (trackingData.activitiesCompleted.length >= 3) {
        achievements.push({ name: 'Hygiene Expert', description: 'Completed all cyber hygiene activities' });
    }
    if (trackingData.passwordsChecked >= 5) {
        achievements.push({ name: 'Password Pro', description: 'Tested 5 or more passwords for strength' });
    }
    if (trackingData.securityScore >= 80) {
        achievements.push({ name: 'Security Champion', description: 'Achieved a security score of 80 or higher' });
    }
    if (trackingData.timeSpent >= 30) {
        achievements.push({ name: 'Dedicated Learner', description: 'Spent 30+ minutes learning about cyber hygiene' });
    }
    
    return achievements;
}

// Generate readable report
function generateReadableReport(data) {
    const achievements = data.achievements.map(a => `• ${a.name}: ${a.description}`).join('\n');
    const recommendations = data.nextRecommendations.map(r => `• ${r}`).join('\n');
    
    return `
CYBER HYGIENE PROGRESS REPORT
${'='.repeat(50)}

User: ${data.user}
Generated: ${new Date(data.exportDate).toLocaleDateString()}
Module: ${data.module}

PROGRESS SUMMARY
${'-'.repeat(20)}
Activities Completed: ${data.progress.activitiesCompleted.length}/${data.progress.totalActivities} (${data.progress.completionPercentage}%)
Security Score: ${data.progress.securityScore}/100
Time Spent Learning: ${data.progress.timeSpent} minutes
Tips Learned: ${data.progress.tipsLearned.length}
Passwords Tested: ${data.progress.passwordsChecked}
Device Updates Checked: ${data.progress.deviceUpdatesChecked}
Browser Tips Completed: ${data.progress.browsingTipsCompleted}

COMPLETED ACTIVITIES
${'-'.repeat(20)}
${data.progress.activitiesCompleted.length > 0 ? 
    data.progress.activitiesCompleted.map(activity => `✓ ${activity.charAt(0).toUpperCase() + activity.slice(1)}`).join('\n') :
    'No activities completed yet.'}

ACHIEVEMENTS
${'-'.repeat(20)}
${achievements || 'No achievements unlocked yet.'}

RECOMMENDATIONS
${'-'.repeat(20)}
${recommendations || 'Continue learning to receive personalized recommendations.'}

NEXT STEPS
${'-'.repeat(20)}
• Continue practicing with interactive tools
• Review security tips regularly
• Apply learned concepts in daily digital activities
• Consider advanced cybersecurity training

${'='.repeat(50)}
Report generated by CyberGuard Training Platform
Visit our platform for more cybersecurity training modules.
    `.trim();
}

// Enhanced mark module complete functionality
function markModuleComplete() {
    if (trackingData.activitiesCompleted.length < 3) {
        showNotification('Please complete all activities before marking the module as complete.', 'warning', 4000);
        
        // Show which activities are remaining
        const remaining = ['passwords', 'updates', 'browsing'].filter(activity => 
            !trackingData.activitiesCompleted.includes(activity)
        );
        
        setTimeout(() => {
            const remainingNames = remaining.map(activity => topicContent[activity]?.title || activity).join(', ');
            showNotification(`Remaining activities: ${remainingNames}`, 'info', 5000);
        }, 2000);
        
        return;
    }
    
    // Check if user has engaged sufficiently with the content
    if (trackingData.tipsLearned.size < 5) {
        showNotification('Please engage more with the learning content before completing the module.', 'info', 4000);
        return;
    }
    
    trackingData.moduleCompleted = true;
    trackingData.completionDate = new Date().toISOString();
    saveProgress();
    
    // Show completion celebration
    showCompletionCelebration();
    
    // Update complete button
    const completeBtn = document.getElementById('complete-btn');
    if (completeBtn) {
        completeBtn.innerHTML = '<i class="ri-check-double-line"></i> Module Completed!';
        completeBtn.disabled = true;
        completeBtn.style.background = 'var(--success)';
    }
    
    // Track completion achievement
    trackingData.tipsLearned.add('module-completion-achievement');
    updateStats();
}

// Show completion celebration
function showCompletionCelebration() {
    const celebration = `
        <div class="completion-overlay" id="completionOverlay">
            <div class="completion-container">
                <div class="completion-animation">
                    <div class="trophy-icon">
                        <i class="ri-trophy-fill"></i>
                    </div>
                    <div class="celebration-confetti">
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                    </div>
                </div>
                <div class="completion-content">
                    <h2>Congratulations!</h2>
                    <p>You've successfully completed the Cyber Hygiene Essentials module!</p>
                    <div class="completion-stats">
                        <div class="completion-stat">
                            <span class="stat-number">${trackingData.securityScore}</span>
                            <span class="stat-label">Final Security Score</span>
                        </div>
                        <div class="completion-stat">
                            <span class="stat-number">${trackingData.timeSpent}m</span>
                            <span class="stat-label">Time Invested</span>
                        </div>
                        <div class="completion-stat">
                            <span class="stat-number">${trackingData.tipsLearned.size}</span>
                            <span class="stat-label">Tips Mastered</span>
                        </div>
                    </div>
                    <div class="completion-message">
                        <p>You've gained essential knowledge in:</p>
                        <ul>
                            <li><i class="ri-shield-keyhole-line"></i> Password Security & Management</li>
                            <li><i class="ri-refresh-line"></i> Software Update Best Practices</li>
                            <li><i class="ri-global-line"></i> Safe Browsing Techniques</li>
                        </ul>
                    </div>
                </div>
                <div class="completion-actions">
                    <button class="btn" onclick="exportDetailedReport()">
                        <i class="ri-download-line"></i> Download Certificate
                    </button>
                    <button class="btn btn-secondary" onclick="shareProgress()">
                        <i class="ri-share-line"></i> Share Achievement
                    </button>
                    <button class="btn btn-secondary" onclick="closeCompletion()">
                        <i class="ri-close-line"></i> Continue
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', celebration);
    
    setTimeout(() => {
        const overlay = document.getElementById('completionOverlay');
        if (overlay) overlay.classList.add('show');
    }, 10);
    
    // Auto-close after 10 seconds if user doesn't interact
    setTimeout(() => {
        const overlay = document.getElementById('completionOverlay');
        if (overlay && overlay.classList.contains('show')) {
            closeCompletion();
        }
    }, 10000);
}

// Close completion celebration
function closeCompletion() {
    const overlay = document.getElementById('completionOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    }
}

// Enhanced navigation function
function goBack() {
    // Check if user has unsaved progress
    if (trackingData.timeSpent > 0) {
        const confirmLeave = confirm('You have made progress in this session. Are you sure you want to go back? Your progress will be saved.');
        if (!confirmLeave) return;
    }
    
    saveProgress();
    
    // Determine where to go back to
    if (document.referrer && document.referrer.includes('hygiene-hub.html')) {
        window.location.href = 'hygiene-hub.html';
    } else if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'hygiene-hub.html';
    }
}

// Enhanced initialization based on page type
function initializePageSpecific() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('hygiene-activity.html')) {
        initializeActivityPage();
    } else if (currentPage.includes('hygiene-hub.html')) {
        initializeHubPage();
    }
}

// Initialize hub page functionality
function initializeHubPage() {
    // Update navigation card completion status
    trackingData.activitiesCompleted.forEach(activity => {
        const navCard = document.querySelector(`[data-topic="${activity}"]`);
        if (navCard) {
            navCard.classList.add('completed');
        }
    });
    
    // Add click tracking for navigation cards
    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const topic = this.getAttribute('data-topic');
            if (topic) {
                trackingData.tipsLearned.add(`nav-card-click-${topic}`);
                saveProgress();
            }
        });
    });
    
    // Initialize hub-specific animations
    setTimeout(() => {
        const cards = document.querySelectorAll('.nav-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 100);
}

// Add keyboard navigation support
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Escape key closes overlays
        if (e.key === 'Escape') {
            closeReviewPage();
            closeExportOptions();
            closeCompletion();
        }
        
        // Ctrl/Cmd + E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportProgress();
        }
        
        // Ctrl/Cmd + R for review
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            openReviewPage();
        }
    });
}

// Initialize activity tracking with intersection observer
function initializeActivityTracking() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.classList.contains('content-section')) {
                        trackingData.tipsLearned.add(`section-viewed-${Date.now()}`);
                    } else if (element.classList.contains('tip-box')) {
                        trackingData.tipsLearned.add(`tip-box-viewed-${Date.now()}`);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        // Observe content sections
        const contentSections = document.querySelectorAll('.content-section, .tip-box');
        contentSections.forEach(section => observer.observe(section));
    }
}

// Save checklist progress separately
function saveChecklistProgress() {
    localStorage.setItem('browser-checklist-progress', JSON.stringify(checklistProgress));
}

// Enhanced initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core systems
    initializeAuth();
    initializeTracking();
    loadUserProgress();
    
    // Initialize page-specific functionality
    initializePageSpecific();
    
    // Initialize UI enhancements
    initializeKeyboardNavigation();
    initializeActivityTracking();
    
    // Add visibility change detection to track time accurately
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause time tracking
            sessionStorage.setItem('time-tracking-paused', Date.now().toString());
        } else {
            // Page is visible again, resume time tracking
            const pausedTime = sessionStorage.getItem('time-tracking-paused');
            if (pausedTime) {
                const pauseDuration = Date.now() - parseInt(pausedTime);
                trackingData.startTime += pauseDuration; // Adjust start time to account for pause
                sessionStorage.removeItem('time-tracking-paused');
            }
        }
    });
    
    // Auto-save progress every 30 seconds
    setInterval(() => {
        saveProgress();
    }, 30000);
    
    // Initialize CSS animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Add periodic engagement prompts
    setTimeout(() => {
        if (trackingData.activitiesCompleted.length === 0 && trackingData.timeSpent > 5) {
            showNotification('Ready to try an interactive activity? Click on any topic card!', 'info', 4000);
        }
    }, 5 * 60 * 1000); // After 5 minutes
    
    console.log('CyberGuard Cyber Hygiene module initialized successfully!');
});
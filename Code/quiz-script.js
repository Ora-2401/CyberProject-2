// CyberGuard Security Quiz - Shared JavaScript with Context-Aware Initialization

// Enhanced Quiz Application with Advanced User Tracking
class AdvancedSecurityQuiz {
    constructor() {
        this.questions = this.initializeQuestions();
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.startTime = null;
        this.questionStartTimes = [];
        this.sessionId = this.generateSessionId();
        this.autoSaveInterval = null;
        this.responseTimeStart = null;
        this.isArenaPage = this.detectArenaPage();
        this.analytics = {
            deviceInfo: this.getDeviceInfo(),
            browserInfo: this.getBrowserInfo(),
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            sessionStartTime: Date.now(),
            interactions: [],
            performanceMetrics: {
                loadTime: 0,
                responseTime: [],
                errorCount: 0
            }
        };
        this.detailedProgress = {
            totalTime: 0,
            questionsAttempted: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            averageTimePerQuestion: 0,
            streakCounter: 0,
            maxStreak: 0,
            hintsUsed: 0,
            difficultyCounts: { beginner: 0, intermediate: 0, advanced: 0 },
            categoryScores: {
                firewall: 0, passwords: 0, phishing: 0, mfa: 0, emails: 0,
                malware: 0, updates: 0, vpn: 0, encryption: 0, social: 0
            },
            categoryAttempts: {
                firewall: 0, passwords: 0, phishing: 0, mfa: 0, emails: 0,
                malware: 0, updates: 0, vpn: 0, encryption: 0, social: 0
            }
        };
        this.initializeQuiz();
    }
    
    detectArenaPage() {
        return window.location.pathname.includes('quiz-arena') || 
               document.getElementById('quiz') !== null;
    }
    
    generateSessionId() {
        return 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getDeviceInfo() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android|Tablet/i.test(navigator.userAgent);
        return {
            type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
        };
    }
    
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browserName = 'Unknown', browserVersion = 'Unknown';
        
        if (ua.indexOf('Chrome') > -1) {
            browserName = 'Chrome';
            browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)?.[1];
        } else if (ua.indexOf('Firefox') > -1) {
            browserName = 'Firefox';
            browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)?.[1];
        } else if (ua.indexOf('Safari') > -1) {
            browserName = 'Safari';
            browserVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1];
        } else if (ua.indexOf('Edge') > -1) {
            browserName = 'Edge';
            browserVersion = ua.match(/Edge\/(\d+\.\d+)/)?.[1];
        }
        
        return {
            name: browserName,
            version: browserVersion,
            language: navigator.language,
            onLine: navigator.onLine,
            javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false
        };
    }
    
    generateDetailedAnalytics() {
        const currentUser = window.cyberGuardAuth?.getCurrentUser();
        return {
            user: {
                email: currentUser?.email || 'anonymous',
                fullname: currentUser?.fullname || 'Anonymous User',
                sessionId: this.sessionId
            },
            performance: {
                totalScore: this.score,
                maxPossibleScore: this.questions.length * 100,
                accuracy: (this.detailedProgress.correctAnswers / this.questions.length) * 100,
                totalTime: this.detailedProgress.totalTime,
                averageTimePerQuestion: this.detailedProgress.averageTimePerQuestion,
                questionsAttempted: this.detailedProgress.questionsAttempted,
                streakCounter: this.detailedProgress.streakCounter,
                maxStreak: this.detailedProgress.maxStreak,
                hintsUsed: this.detailedProgress.hintsUsed
            },
            categories: Object.keys(this.detailedProgress.categoryScores).map(category => ({
                name: category,
                score: this.detailedProgress.categoryScores[category],
                attempts: this.detailedProgress.categoryAttempts[category],
                accuracy: this.detailedProgress.categoryAttempts[category] > 0 ? 
                        (this.detailedProgress.categoryScores[category] / (this.detailedProgress.categoryAttempts[category] * 100)) * 100 : 0
            })),
            difficulty: this.detailedProgress.difficultyCounts,
            technical: {
                device: this.analytics.deviceInfo,
                browser: this.analytics.browserInfo,
                screen: this.analytics.screenResolution,
                timezone: this.analytics.timezone,
                language: this.analytics.language
            },
            interactions: this.analytics.interactions.length,
            completedAt: new Date().toISOString()
        };
    }
    
    recordInteraction(type, data = {}) {
        const interaction = {
            timestamp: Date.now(),
            type: type,
            sessionId: this.sessionId,
            currentQuestion: this.currentQuestion,
            ...data
        };
        
        this.analytics.interactions.push(interaction);
        
        if (this.analytics.interactions.length > 1000) {
            this.analytics.interactions = this.analytics.interactions.slice(-1000);
        }
    }
    
    initializeQuestions() {
        return [
            {
                id: 'firewall_001', category: 'firewall', difficulty: 'beginner',
                question: "What is the primary purpose of a firewall in network security?",
                options: [
                    "To prevent physical access to servers",
                    "To monitor and control incoming and outgoing network traffic",
                    "To encrypt data transmissions",
                    "To detect viruses in email attachments"
                ],
                correct: 1,
                explanation: "Firewalls act as barriers between trusted internal networks and untrusted external networks, monitoring and controlling traffic based on predetermined security rules.",
                points: 100
            },
            {
                id: 'passwords_001', category: 'passwords', difficulty: 'intermediate',
                question: "Which of the following is the strongest password?",
                options: ["Password123!", "Summer2024", "J4nuary!2024#Security", "123456789"],
                correct: 2,
                explanation: "Strong passwords should be long, contain a mix of characters, numbers, symbols, and avoid common words or patterns.",
                points: 100
            },
            {
                id: 'phishing_001', category: 'phishing', difficulty: 'intermediate',
                question: "What does 'phishing' refer to in cybersecurity?",
                options: [
                    "A method of fishing for data in large databases",
                    "A physical security breach technique",
                    "A type of malware that encrypts files",
                    "A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity"
                ],
                correct: 3,
                explanation: "Phishing attacks use deceptive emails, websites, or messages to trick users into revealing sensitive information like passwords or financial data.",
                points: 100
            },
            {
                id: 'mfa_001', category: 'mfa', difficulty: 'beginner',
                question: "What is multi-factor authentication (MFA)?",
                options: [
                    "Using multiple firewalls for network security",
                    "A security system that requires more than one method of verification",
                    "Having multiple antivirus programs installed",
                    "Using multiple passwords for the same account"
                ],
                correct: 1,
                explanation: "MFA adds extra layers of security by requiring two or more verification factors: something you know, have, or are.",
                points: 100
            },
            {
                id: 'emails_001', category: 'emails', difficulty: 'beginner',
                question: "What should you do if you receive a suspicious email?",
                options: [
                    "Open any attachments to investigate",
                    "Reply to ask for more information",
                    "Forward it to all your colleagues to warn them",
                    "Report it to your security team and delete it"
                ],
                correct: 3,
                explanation: "Suspicious emails should be reported to your security team and deleted. Never open attachments or reply to potentially malicious emails.",
                points: 100
            },
            {
                id: 'malware_001', category: 'malware', difficulty: 'intermediate',
                question: "What is ransomware?",
                options: [
                    "Software that protects your computer from viruses",
                    "A security protocol for wireless networks",
                    "Malicious software that blocks access to systems until a ransom is paid",
                    "A type of firewall configuration"
                ],
                correct: 2,
                explanation: "Ransomware encrypts files or systems and demands payment for decryption keys, making it one of the most dangerous cyber threats.",
                points: 100
            },
            {
                id: 'updates_001', category: 'updates', difficulty: 'beginner',
                question: "Why is it important to regularly update software?",
                options: [
                    "To get new features and interface changes",
                    "To fix security vulnerabilities and bugs",
                    "To improve computer performance",
                    "All of the above"
                ],
                correct: 3,
                explanation: "Regular updates provide security patches, bug fixes, performance improvements, and new features, making them essential for cybersecurity.",
                points: 100
            },
            {
                id: 'vpn_001', category: 'vpn', difficulty: 'intermediate',
                question: "What is a VPN used for?",
                options: [
                    "To increase internet speed",
                    "To create a secure connection over the internet",
                    "To block unwanted websites",
                    "To scan for viruses"
                ],
                correct: 1,
                explanation: "VPNs create encrypted tunnels for secure internet connections, protecting data from interception and maintaining privacy.",
                points: 100
            },
            {
                id: 'encryption_001', category: 'encryption', difficulty: 'beginner',
                question: "What does HTTPS in a URL indicate?",
                options: [
                    "The website is hosted on a high-speed server",
                    "The connection between your browser and the website is encrypted",
                    "The website is certified by a security authority",
                    "The website is safe from all security threats"
                ],
                correct: 1,
                explanation: "HTTPS uses SSL/TLS encryption to secure data transmission between your browser and the website, protecting against eavesdropping.",
                points: 100
            },
            {
                id: 'social_001', category: 'social', difficulty: 'advanced',
                question: "What is social engineering?",
                options: [
                    "A branch of engineering that deals with social networks",
                    "The process of training employees in social skills",
                    "Psychological manipulation to trick people into revealing confidential information",
                    "A software development methodology"
                ],
                correct: 2,
                explanation: "Social engineering exploits human psychology and trust to manipulate people into divulging confidential information or performing actions that compromise security.",
                points: 100,
                hint: "Think about psychological manipulation techniques used to trick people."
            }
        ];
    }
    
    // Quiz Initialization and Context-Aware Setup
    initializeQuiz() {
        this.bindEvents();
        this.loadSavedProgress();
        
        if (this.isArenaPage) {
            this.initializeArenaPage();
        } else {
            this.initializeHubPage();
        }
    }
    
    initializeHubPage() {
        console.log('Initializing Quiz Hub...');
        this.updateLeaderboardDisplay();
        this.updateQuickStats();
    }
    
    initializeArenaPage() {
        console.log('Initializing Quiz Arena...');
        this.setupArenaInterface();
        this.updatePersonalStats();
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('autostart') === 'true') {
            setTimeout(() => this.startQuiz(), 1000);
        } else {
            // Auto-start quiz for arena page after a short delay to ensure everything is loaded
            setTimeout(() => {
                console.log('Auto-starting quiz for arena page...');
                this.startQuiz();
            }, 1500);
        }
    }
    
    setupArenaInterface() {
        this.setupHintSystem();
        this.setupTimerUpdates();
        this.setupLiveStats();
    }
    
    setupHintSystem() {
        const hintBtn = document.getElementById('hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
    }
    
    showHint() {
        // Check if current question exists before accessing its properties
        if (this.currentQuestion >= this.questions.length) {
            this.showNotification('No question available for hint.', 'warning');
            return;
        }
        
        const currentQ = this.questions[this.currentQuestion];
        if (currentQ && currentQ.hint) {
            const hintDisplay = document.getElementById('hint-display');
            const hintText = document.getElementById('hint-text');
            
            if (hintDisplay && hintText) {
                hintText.textContent = currentQ.hint;
                hintDisplay.classList.remove('hidden');
                this.detailedProgress.hintsUsed++;
                
                this.trackEvent('hint_used', { questionId: currentQ.id, hint: currentQ.hint });
                this.showNotification('Hint revealed! This will affect your score slightly.', 'info');
            }
        } else {
            this.showNotification('No hint available for this question.', 'warning');
        }
    }
    
    setupTimerUpdates() {
        setInterval(() => {
            if (this.startTime) {
                const elapsed = Date.now() - this.startTime;
                const timeEl = document.getElementById('time-elapsed');
                if (timeEl) timeEl.textContent = this.formatTime(elapsed);
            }
        }, 1000);
    }
    
    setupLiveStats() {
        setInterval(() => {
            this.updateLiveStats();
        }, 2000);
    }
    
    updateLiveStats() {
        if (!this.startTime) return;
        
        const correctEl = document.getElementById('correct-count');
        const streakEl = document.getElementById('streak-count');
        const accuracyEl = document.getElementById('accuracy-display');
        
        if (correctEl) correctEl.textContent = this.detailedProgress.correctAnswers;
        if (streakEl) streakEl.textContent = this.detailedProgress.streakCounter;
        
        if (accuracyEl && this.detailedProgress.questionsAttempted > 0) {
            const accuracy = Math.round((this.detailedProgress.correctAnswers / this.detailedProgress.questionsAttempted) * 100);
            accuracyEl.textContent = `${accuracy}%`;
        }
    }
    
    updateQuickStats() {
        const currentUser = window.cyberGuardAuth?.getCurrentUser();
        if (!currentUser) return;
        
        const userHistory = this.getUserQuizHistory();
        
        const totalAttemptsEl = document.getElementById('total-attempts');
        const bestScoreEl = document.getElementById('best-score');
        const avgAccuracyEl = document.getElementById('average-accuracy');
        
        if (totalAttemptsEl) totalAttemptsEl.textContent = userHistory.length;
        
        if (bestScoreEl && userHistory.length > 0) {
            const bestScore = Math.max(...userHistory.map(result => result.score));
            bestScoreEl.textContent = bestScore;
        }
        
        if (avgAccuracyEl && userHistory.length > 0) {
            const avgAccuracy = userHistory.reduce((sum, result) => sum + result.accuracy, 0) / userHistory.length;
            avgAccuracyEl.textContent = `${Math.round(avgAccuracy)}%`;
        }
    }
    
    updatePersonalStats() {
        const currentUser = window.cyberGuardAuth?.getCurrentUser();
        if (!currentUser) return;
        
        const userHistory = this.getUserQuizHistory();
        
        const attemptsEl = document.getElementById('quiz-attempts');
        const bestEl = document.getElementById('personal-best');
        const avgEl = document.getElementById('avg-accuracy');
        
        if (attemptsEl) attemptsEl.textContent = userHistory.length;
        
        if (bestEl && userHistory.length > 0) {
            const bestScore = Math.max(...userHistory.map(result => result.score));
            bestEl.textContent = bestScore;
        }
        
        if (avgEl && userHistory.length > 0) {
            const avgAccuracy = userHistory.reduce((sum, result) => sum + result.accuracy, 0) / userHistory.length;
            avgEl.textContent = `${Math.round(avgAccuracy)}%`;
        }
    }
    
    // Core Quiz Operations
    bindEvents() {
        const startBtn = document.getElementById('start-quiz');
        if (startBtn) startBtn.addEventListener('click', () => this.startQuiz());
        
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const retryBtn = document.getElementById('retry-btn');
        const skipBtn = document.getElementById('skip-btn');
        
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
        if (retryBtn) retryBtn.addEventListener('click', () => this.resetQuiz());
        if (skipBtn) skipBtn.addEventListener('click', () => this.skipQuestion());
        
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        setInterval(() => this.saveProgress(), 30000);
        window.addEventListener('beforeunload', () => this.saveProgress());
    }
    
    handleKeyboardShortcuts(event) {
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case 'ArrowRight':
                    event.preventDefault();
                    this.nextQuestion();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.previousQuestion();
                    break;
                case 's':
                    event.preventDefault();
                    this.saveProgress();
                    this.showNotification('Progress saved!', 'success');
                    break;
            }
        }
        
        if (event.key >= '1' && event.key <= '4') {
            const optionIndex = parseInt(event.key) - 1;
            this.selectOption(optionIndex);
        }
    }
    
    startQuiz() {
        if (!this.ensureAuthentication()) return;
        
        this.startTime = Date.now();
        this.questionStartTimes = [Date.now()];
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers.fill(null);
        this.resetDetailedProgress();
        
        this.updateQuestion();
        this.updateProgress();
        this.updateScore();
        
        const quizSection = document.getElementById('quiz');
        const resultsSection = document.getElementById('results');
        if (quizSection) quizSection.classList.remove('hidden');
        if (resultsSection) resultsSection.classList.add('hidden');
        
        this.trackEvent('quiz_started');
        this.showNotification('Quiz started! Good luck!', 'info');
    }
    
    ensureAuthentication() {
        if (!window.cyberGuardAuth) {
            this.showNotification('Authentication system not loaded. Please refresh the page.', 'error');
            return false;
        }
        
        if (!window.cyberGuardAuth.isAuthenticated()) {
            this.showNotification('Please log in to take the quiz.', 'warning');
            window.cyberGuardAuth.requireAuth();
            return false;
        }
        
        return true;
    }
    
    resetDetailedProgress() {
        this.detailedProgress = {
            totalTime: 0, questionsAttempted: 0, correctAnswers: 0, incorrectAnswers: 0,
            averageTimePerQuestion: 0, streakCounter: 0, maxStreak: 0, hintsUsed: 0,
            difficultyCounts: { beginner: 0, intermediate: 0, advanced: 0 },
            categoryScores: { firewall: 0, passwords: 0, phishing: 0, mfa: 0, emails: 0, malware: 0, updates: 0, vpn: 0, encryption: 0, social: 0 },
            categoryAttempts: { firewall: 0, passwords: 0, phishing: 0, mfa: 0, emails: 0, malware: 0, updates: 0, vpn: 0, encryption: 0, social: 0 }
        };
    }
    
    // Utility Functions
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
    }
    
    trackEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: Date.now(),
            userId: window.cyberGuardAuth?.getCurrentUser()?.email || 'anonymous',
            sessionId: this.sessionId,
            ...data
        };
        
        const events = JSON.parse(localStorage.getItem('quiz_events') || '[]');
        events.push(eventData);
        
        if (events.length > 1000) {
            events.splice(0, events.length - 1000);
        }
        
        localStorage.setItem('quiz_events', JSON.stringify(events));
        console.log('Quiz Event:', eventData);
    }
    
    saveProgress() {
        if (!window.cyberGuardAuth || !window.cyberGuardAuth.isAuthenticated()) return;
        
        const currentUser = window.cyberGuardAuth.getCurrentUser();
        const progressData = {
            userId: currentUser.email,
            sessionId: this.sessionId,
            currentQuestion: this.currentQuestion,
            userAnswers: this.userAnswers,
            score: this.score,
            startTime: this.startTime,
            questionStartTimes: this.questionStartTimes,
            detailedProgress: this.detailedProgress,
            analytics: this.analytics,
            lastSaved: Date.now(),
            version: '2.0'
        };
        
        const progressKey = `quiz_progress_${currentUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        localStorage.setItem(progressKey, JSON.stringify(progressData));
    }
    
    loadSavedProgress() {
        if (!window.cyberGuardAuth || !window.cyberGuardAuth.isAuthenticated()) return;
        
        const currentUser = window.cyberGuardAuth.getCurrentUser();
        const progressKey = `quiz_progress_${currentUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const savedProgress = localStorage.getItem(progressKey);
        
        if (savedProgress) {
            try {
                const progressData = JSON.parse(savedProgress);
                const timeSinceLastSave = Date.now() - progressData.lastSaved;
                
                if (timeSinceLastSave < 7200000 && progressData.version) {
                    this.currentQuestion = progressData.currentQuestion || 0;
                    this.userAnswers = progressData.userAnswers || new Array(this.questions.length).fill(null);
                    this.score = progressData.score || 0;
                    this.startTime = progressData.startTime;
                    this.questionStartTimes = progressData.questionStartTimes || [];
                    this.detailedProgress = { ...this.detailedProgress, ...progressData.detailedProgress };
                    this.sessionId = progressData.sessionId || this.sessionId;
                    
                    if (this.currentQuestion > 0) {
                        this.showNotification(
                            `Welcome back, ${currentUser.fullname}! Your previous progress has been restored.`, 
                            'info', 
                            4000
                        );
                    }
                }
            } catch (error) {
                console.error('Error loading saved progress:', error);
                this.showNotification('Error loading previous progress. Starting fresh.', 'warning');
            }
        }
    }
    
    getUserQuizHistory() {
        if (!window.cyberGuardAuth || !window.cyberGuardAuth.isAuthenticated()) return [];
        
        const currentUser = window.cyberGuardAuth.getCurrentUser();
        const resultsKey = `quiz_results_${currentUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        return JSON.parse(localStorage.getItem(resultsKey) || '[]');
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `
            fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg
            transform translate-x-full transition-transform duration-300
            ${
                type === 'success' ? 'bg-green-600 text-white' :
                type === 'error' ? 'bg-red-600 text-white' :
                type === 'warning' ? 'bg-yellow-600 text-white' :
                'bg-blue-600 text-white'
            }
        `;
        
        notification.innerHTML = `
            <div class="flex items-start">
                <i class="${
                    type === 'success' ? 'ri-check-circle-line' :
                    type === 'error' ? 'ri-error-warning-line' :
                    type === 'warning' ? 'ri-alert-line' :
                    'ri-information-line'
                } text-xl mr-3 mt-0.5"></i>
                <div class="flex-1">
                    <p class="text-sm">${message}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                    class="ml-2 text-white hover:text-gray-200">
                    <i class="ri-close-line"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
    }
    
    updateLeaderboardDisplay() {
        if (!window.cyberGuardAuth || !window.cyberGuardAuth.isAuthenticated()) return;
        
        const leaderboardData = window.cyberGuardAuth.getLeaderboardData();
        const currentUser = window.cyberGuardAuth.getCurrentUser();
        
        this.updateTopPerformers(leaderboardData.slice(0, 3));
        this.updateUserPosition(leaderboardData, currentUser);
        this.updateFullLeaderboard(leaderboardData);
    }
    
    updateTopPerformers(topThree) {
        const topPerformersContainer = document.getElementById('top-performers');
        if (topPerformersContainer) {
            topPerformersContainer.innerHTML = topThree.map((user, index) => `
                <div class="text-center p-6 bg-slate-800/50 rounded-xl ${index === 0 ? 'ring-2 ring-yellow-500' : ''}">
                    <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4 text-xl font-bold">
                        ${index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <h3 class="font-bold text-lg mb-1">${user.name}</h3>
                    <p class="text-purple-400 font-bold text-xl">${user.score} pts</p>
                    <p class="text-gray-400 text-sm">${user.department}</p>
                </div>
            `).join('');
        }
    }
    
    updateUserPosition(leaderboardData, currentUser) {
        const userPosition = leaderboardData.findIndex(user => user.email === currentUser.email) + 1;
        const userPositionEl = document.getElementById('user-position');
        
        if (userPositionEl) {
            const userData = leaderboardData.find(user => user.email === currentUser.email);
            userPositionEl.innerHTML = `
                <div class="flex items-center">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mr-4">
                        <span class="font-bold text-white">#${userPosition}</span>
                    </div>
                    <div>
                        <h4 class="font-bold">${userData.name}</h4>
                        <p class="text-gray-400 text-sm">${userData.department}</p>
                    </div>
                </div>
                <div class="text-xl font-bold text-purple-400">${userData.score} pts</div>
            `;
        }
    }
    
    updateFullLeaderboard(leaderboardData) {
        const fullLeaderboardEl = document.getElementById('full-leaderboard');
        if (fullLeaderboardEl) {
            fullLeaderboardEl.innerHTML = leaderboardData.slice(0, 10).map((user, index) => `
                <div class="leaderboard-item p-4 flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mr-4">
                            <span class="font-bold text-white text-sm">${index + 1}</span>
                        </div>
                        <div>
                            <h4 class="font-medium">${user.name}</h4>
                            <p class="text-gray-400 text-sm">${user.department}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-purple-400">${user.score} pts</div>
                        <div class="text-gray-400 text-sm">${user.completion}% complete</div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Core Quiz Operations
    updateQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.finishQuiz();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        this.questionStartTimes[this.currentQuestion] = Date.now();
        
        // Update question text
        const questionTextEl = document.getElementById('question-text');
        if (questionTextEl) {
            questionTextEl.textContent = question.question;
        }
        
        // Update options
        this.updateOptions(question.options);
        
        // Update progress
        this.updateProgress();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Hide hint display
        const hintDisplay = document.getElementById('hint-display');
        if (hintDisplay) hintDisplay.classList.add('hidden');
        
        // Update category indicators
        this.updateCategoryIndicators();
        
        this.trackEvent('question_viewed', { 
            questionId: question.id, 
            questionIndex: this.currentQuestion 
        });
    }
    
    updateOptions(options) {
        const optionsContainer = document.getElementById('options-container');
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = options.map((option, index) => `
            <div class="option p-4 cursor-pointer" data-option="${index}">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-4">
                        ${String.fromCharCode(65 + index)}
                    </div>
                    <span>${option}</span>
                </div>
            </div>
        `).join('');
        
        // Bind option click events
        optionsContainer.querySelectorAll('.option').forEach((option, index) => {
            option.addEventListener('click', () => this.selectOption(index));
        });
        
        // Restore selected option if exists
        if (this.userAnswers[this.currentQuestion] !== null) {
            this.selectOption(this.userAnswers[this.currentQuestion], false);
        }
    }
    
    selectOption(optionIndex, recordInteraction = true) {
        // Check if current question exists and option index is valid
        if (this.currentQuestion >= this.questions.length || 
            optionIndex < 0 || 
            optionIndex >= this.questions[this.currentQuestion].options.length) {
            return;
        }
        
        // Clear previous selections
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select new option
        const selectedOption = document.querySelector(`[data-option="${optionIndex}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // Store answer
        this.userAnswers[this.currentQuestion] = optionIndex;
        
        // Record interaction
        if (recordInteraction) {
            this.recordInteraction('option_selected', {
                questionId: this.questions[this.currentQuestion].id,
                selectedOption: optionIndex,
                optionText: this.questions[this.currentQuestion].options[optionIndex]
            });
        }
        
        // Enable next button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
    
    nextQuestion() {
        if (this.userAnswers[this.currentQuestion] === null) {
            this.showNotification('Please select an answer before continuing.', 'warning');
            return;
        }
        
        // Check if current question exists before accessing its properties
        if (this.currentQuestion >= this.questions.length) {
            this.finishQuiz();
            return;
        }
        
        // Record response time
        const responseTime = Date.now() - this.questionStartTimes[this.currentQuestion];
        this.analytics.performanceMetrics.responseTime.push(responseTime);
        
        // Update detailed progress
        this.updateDetailedProgress();
        
        this.currentQuestion++;
        this.updateQuestion();
        this.saveProgress();
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.updateQuestion();
        }
    }
    
    skipQuestion() {
        // Check if current question exists before accessing its properties
        if (this.currentQuestion >= this.questions.length) {
            this.finishQuiz();
            return;
        }
        
        this.userAnswers[this.currentQuestion] = null;
        this.detailedProgress.questionsAttempted++;
        this.detailedProgress.streakCounter = 0;
        
        const responseTime = Date.now() - this.questionStartTimes[this.currentQuestion];
        this.analytics.performanceMetrics.responseTime.push(responseTime);
        
        this.trackEvent('question_skipped', { 
            questionId: this.questions[this.currentQuestion].id 
        });
        
        this.currentQuestion++;
        this.updateQuestion();
        this.saveProgress();
    }
    
    updateDetailedProgress() {
        // Check if current question exists before accessing its properties
        if (this.currentQuestion >= this.questions.length) {
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        const isCorrect = this.userAnswers[this.currentQuestion] === question.correct;
        
        this.detailedProgress.questionsAttempted++;
        this.detailedProgress.categoryAttempts[question.category]++;
        this.detailedProgress.difficultyCounts[question.difficulty]++;
        
        if (isCorrect) {
            this.detailedProgress.correctAnswers++;
            this.detailedProgress.categoryScores[question.category] += 100;
            this.detailedProgress.streakCounter++;
            this.detailedProgress.maxStreak = Math.max(this.detailedProgress.maxStreak, this.detailedProgress.streakCounter);
            this.score += question.points;
        } else {
            this.detailedProgress.incorrectAnswers++;
            this.detailedProgress.streakCounter = 0;
        }
        
        this.updateScore();
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        
        const progressFillEl = document.getElementById('progress-fill');
        const progressPercentEl = document.getElementById('progress-percent');
        const currentQuestionEl = document.getElementById('current-question');
        const totalQuestionsEl = document.getElementById('total-questions');
        
        if (progressFillEl) progressFillEl.style.width = `${progress}%`;
        if (progressPercentEl) progressPercentEl.textContent = `${Math.round(progress)}%`;
        if (currentQuestionEl) currentQuestionEl.textContent = this.currentQuestion + 1;
        if (totalQuestionsEl) totalQuestionsEl.textContent = this.questions.length;
    }
    
    updateScore() {
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.textContent = this.score;
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            if (this.currentQuestion === 0) {
                prevBtn.disabled = true;
                prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                prevBtn.disabled = false;
                prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
        
        if (nextBtn) {
            if (this.userAnswers[this.currentQuestion] === null) {
                nextBtn.disabled = true;
                nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                nextBtn.disabled = false;
                nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            
            if (this.currentQuestion === this.questions.length - 1) {
                nextBtn.innerHTML = '<i class="ri-check-line mr-2"></i> Finish Quiz';
            } else {
                nextBtn.innerHTML = 'Next Question <i class="ri-arrow-right-line ml-2"></i>';
            }
        }
    }
    
    updateCategoryIndicators() {
        const categoryIndicatorsEl = document.getElementById('category-indicators');
        if (!categoryIndicatorsEl) return;
        
        const categories = [...new Set(this.questions.map(q => q.category))];
        categoryIndicatorsEl.innerHTML = categories.map(category => {
            const completed = this.questions.slice(0, this.currentQuestion)
                .filter(q => q.category === category && this.userAnswers[this.questions.indexOf(q)] !== null)
                .length;
            const total = this.questions.filter(q => q.category === category).length;
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            
            return `
                <div class="category-indicator" title="${category}: ${completed}/${total}">
                    <div class="category-fill" style="width: ${percentage}%"></div>
                </div>
            `;
        }).join('');
        
        const categoryStatsEl = document.getElementById('category-stats');
        if (categoryStatsEl) {
            const completedCategories = categories.filter(cat => {
                const total = this.questions.filter(q => q.category === cat).length;
                const completed = this.questions.slice(0, this.currentQuestion)
                    .filter(q => q.category === cat && this.userAnswers[this.questions.indexOf(q)] !== null)
                    .length;
                return completed === total;
            }).length;
            categoryStatsEl.textContent = `${completedCategories}/${categories.length} categories`;
        }
    }
    
    finishQuiz() {
        this.detailedProgress.totalTime = Date.now() - this.startTime;
        this.detailedProgress.averageTimePerQuestion = this.detailedProgress.totalTime / this.questions.length;
        
        this.trackEvent('quiz_completed', {
            finalScore: this.score,
            totalTime: this.detailedProgress.totalTime,
            accuracy: (this.detailedProgress.correctAnswers / this.questions.length) * 100
        });
        
        this.saveQuizResults();
        this.showResults();
    }
    
    saveQuizResults() {
        if (!window.cyberGuardAuth || !window.cyberGuardAuth.isAuthenticated()) return;
        
        const currentUser = window.cyberGuardAuth.getCurrentUser();
        const resultsKey = `quiz_results_${currentUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const results = JSON.parse(localStorage.getItem(resultsKey) || '[]');
        
        const newResult = {
            score: this.score,
            accuracy: (this.detailedProgress.correctAnswers / this.questions.length) * 100,
            completedAt: new Date().toISOString(),
            totalTime: this.detailedProgress.totalTime,
            sessionId: this.sessionId,
            detailedAnalytics: this.generateDetailedAnalytics()
        };
        
        results.push(newResult);
        
        // Keep only last 50 results
        if (results.length > 50) {
            results.splice(0, results.length - 50);
        }
        
        localStorage.setItem(resultsKey, JSON.stringify(results));
        
        // Update global leaderboard
        this.updateGlobalLeaderboard(newResult);
    }
    
    updateGlobalLeaderboard(newResult) {
        const currentUser = window.cyberGuardAuth?.getCurrentUser();
        if (!currentUser) return;
        
        const leaderboardKey = 'quiz_global_leaderboard';
        const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey) || '[]');
        
        const existingUserIndex = leaderboard.findIndex(entry => entry.email === currentUser.email);
        const userEntry = {
            email: currentUser.email,
            name: currentUser.fullname || 'Anonymous',
            department: currentUser.department || 'Unknown',
            score: newResult.score,
            accuracy: newResult.accuracy,
            lastCompleted: newResult.completedAt,
            totalAttempts: this.getUserQuizHistory().length
        };
        
        if (existingUserIndex >= 0) {
            // Update existing entry if new score is better
            if (newResult.score > leaderboard[existingUserIndex].score) {
                leaderboard[existingUserIndex] = userEntry;
            } else {
                leaderboard[existingUserIndex].totalAttempts = userEntry.totalAttempts;
                leaderboard[existingUserIndex].lastCompleted = userEntry.lastCompleted;
            }
        } else {
            leaderboard.push(userEntry);
        }
        
        // Sort by score descending
        leaderboard.sort((a, b) => b.score - a.score);
        
        localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
    }
    
    showResults() {
        const quizSection = document.getElementById('quiz');
        const resultsSection = document.getElementById('results');
        
        if (quizSection) quizSection.classList.add('hidden');
        if (resultsSection) resultsSection.classList.remove('hidden');
        
        this.updateResultsDisplay();
        this.triggerCelebration();
    }
    
    updateResultsDisplay() {
        const finalScoreEl = document.getElementById('final-score');
        const finalCorrectEl = document.getElementById('final-correct');
        const finalIncorrectEl = document.getElementById('final-incorrect');
        const finalAccuracyEl = document.getElementById('final-accuracy');
        const completionTimeEl = document.getElementById('completion-time');
        const percentileTextEl = document.getElementById('percentile-text');
        
        const accuracy = Math.round((this.detailedProgress.correctAnswers / this.questions.length) * 100);
        
        if (finalScoreEl) finalScoreEl.textContent = this.score;
        if (finalCorrectEl) finalCorrectEl.textContent = this.detailedProgress.correctAnswers;
        if (finalIncorrectEl) finalIncorrectEl.textContent = this.detailedProgress.incorrectAnswers;
        if (finalAccuracyEl) finalAccuracyEl.textContent = `${accuracy}%`;
        if (completionTimeEl) completionTimeEl.textContent = `Completed in ${this.formatTime(this.detailedProgress.totalTime)}`;
        
        // Calculate percentile
        const percentile = this.calculatePercentile();
        if (percentileTextEl) {
            percentileTextEl.textContent = `You scored higher than ${percentile}% of participants`;
        }
        
        // Update category breakdown
        this.updateCategoryBreakdown();
        
        // Show achievements
        this.showAchievements();
    }
    
    calculatePercentile() {
        const leaderboard = JSON.parse(localStorage.getItem('quiz_global_leaderboard') || '[]');
        if (leaderboard.length < 2) return 50;
        
        const scoresBelow = leaderboard.filter(entry => entry.score < this.score).length;
        return Math.round((scoresBelow / leaderboard.length) * 100);
    }
    
    updateCategoryBreakdown() {
        const categoryBreakdownEl = document.getElementById('category-breakdown');
        if (!categoryBreakdownEl) return;
        
        const categories = Object.keys(this.detailedProgress.categoryScores);
        categoryBreakdownEl.innerHTML = categories.map(category => {
            const score = this.detailedProgress.categoryScores[category];
            const attempts = this.detailedProgress.categoryAttempts[category];
            const accuracy = attempts > 0 ? Math.round((score / (attempts * 100)) * 100) : 0;
            
            return `
                <div class="bg-slate-700/50 rounded-lg p-4">
                    <h4 class="font-medium text-white capitalize mb-2">${category}</h4>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-300">${attempts} questions</span>
                        <span class="${accuracy >= 80 ? 'text-green-400' : accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'} font-bold">${accuracy}%</span>
                    </div>
                </div>
            `;
        }).filter((_, index) => this.detailedProgress.categoryAttempts[categories[index]] > 0).join('');
    }
    
    showAchievements() {
        const achievementsEl = document.getElementById('achievements-section');
        if (!achievementsEl) return;
        
        const achievements = [];
        const accuracy = (this.detailedProgress.correctAnswers / this.questions.length) * 100;
        
        if (accuracy === 100) {
            achievements.push({ icon: '🎯', title: 'Perfect Score!', description: 'Answered all questions correctly' });
        } else if (accuracy >= 90) {
            achievements.push({ icon: '⭐', title: 'Excellent!', description: 'Scored 90% or higher' });
        } else if (accuracy >= 80) {
            achievements.push({ icon: '👍', title: 'Well Done!', description: 'Scored 80% or higher' });
        }
        
        if (this.detailedProgress.maxStreak >= 5) {
            achievements.push({ icon: '🔥', title: 'Hot Streak!', description: `${this.detailedProgress.maxStreak} correct answers in a row` });
        }
        
        if (this.detailedProgress.totalTime < 300000) { // Less than 5 minutes
            achievements.push({ icon: '⚡', title: 'Speed Demon!', description: 'Completed quiz in under 5 minutes' });
        }
        
        if (achievements.length > 0) {
            achievementsEl.innerHTML = `
                <h3 class="text-xl font-bold mb-4 text-center">🏆 Achievements</h3>
                <div class="grid grid-cols-1 md:grid-cols-${Math.min(achievements.length, 3)} gap-4">
                    ${achievements.map(achievement => `
                        <div class="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-600/30 rounded-lg p-4 text-center">
                            <div class="text-3xl mb-2">${achievement.icon}</div>
                            <h4 class="font-bold text-white mb-1">${achievement.title}</h4>
                            <p class="text-gray-300 text-sm">${achievement.description}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }
    
    triggerCelebration() {
        const accuracy = (this.detailedProgress.correctAnswers / this.questions.length) * 100;
        
        if (accuracy >= 80) {
            this.createConfetti();
        }
    }
    
    createConfetti() {
        const celebrationOverlay = document.getElementById('celebration-overlay');
        if (!celebrationOverlay) return;
        
        const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                
                celebrationOverlay.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentElement) {
                        confetti.remove();
                    }
                }, 3000);
            }, i * 100);
        }
    }
    
    resetQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers.fill(null);
        this.startTime = null;
        this.questionStartTimes = [];
        this.resetDetailedProgress();
        
        const quizSection = document.getElementById('quiz');
        const resultsSection = document.getElementById('results');
        
        if (quizSection) quizSection.classList.remove('hidden');
        if (resultsSection) resultsSection.classList.add('hidden');
        
        this.startQuiz();
    }
}

// Global Functions for External Buttons
function shareQuizResults() {
    const quiz = window.securityQuizInstance;
    if (!quiz || !window.cyberGuardAuth?.isAuthenticated()) {
        quiz?.showNotification('Please complete the quiz first!', 'warning');
        return;
    }
    
    const currentUser = window.cyberGuardAuth.getCurrentUser();
    const accuracy = Math.round((quiz.detailedProgress.correctAnswers / quiz.questions.length) * 100);
    const shareText = `I just completed the CyberGuard Security Quiz and scored ${quiz.score} points with ${accuracy}% accuracy! Test your cybersecurity knowledge too.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'CyberGuard Security Quiz Results',
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText + ' ' + window.location.href)
            .then(() => quiz.showNotification('Results copied to clipboard!', 'success'))
            .catch(() => quiz.showNotification('Unable to share results', 'error'));
    }
}

function downloadCertificate() {
    const quiz = window.securityQuizInstance;
    if (!quiz || !window.cyberGuardAuth?.isAuthenticated()) {
        quiz?.showNotification('Please complete the quiz first!', 'warning');
        return;
    }
    
    const accuracy = Math.round((quiz.detailedProgress.correctAnswers / quiz.questions.length) * 100);
    
    if (accuracy < 80) {
        quiz.showNotification('You need at least 80% accuracy to earn a certificate. Try again!', 'warning');
        return;
    }
    
    const currentUser = window.cyberGuardAuth.getCurrentUser();
    const certificate = {
        recipientName: currentUser.fullname || 'Security Champion',
        score: quiz.score,
        accuracy: accuracy,
        completionDate: new Date().toLocaleDateString(),
        certificateId: quiz.sessionId,
        issuer: 'CyberGuard Security Training'
    };
    
    // Create certificate content
    const certificateContent = `
CYBERGUARD SECURITY CERTIFICATE

This certifies that
${certificate.recipientName}

has successfully completed the CyberGuard Security Quiz
with a score of ${certificate.score} points (${certificate.accuracy}% accuracy)

Completed on: ${certificate.completionDate}
Certificate ID: ${certificate.certificateId}

Issued by: ${certificate.issuer}
    `;
    
    // Download as text file
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberGuard_Certificate_${currentUser.fullname?.replace(/\s+/g, '_') || 'User'}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    quiz.showNotification('Certificate downloaded successfully!', 'success');
}

function exportDetailedReport() {
    const quiz = window.securityQuizInstance;
    if (!quiz || !window.cyberGuardAuth?.isAuthenticated()) {
        quiz?.showNotification('Please complete the quiz first!', 'warning');
        return;
    }
    
    const analyticsData = quiz.generateDetailedAnalytics();
    const reportContent = JSON.stringify(analyticsData, null, 2);
    
    const blob = new Blob([reportContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberGuard_Detailed_Report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    quiz.showNotification('Detailed report exported successfully!', 'success');
}

// Initialize the application based on page context
document.addEventListener('DOMContentLoaded', function() {
    console.log('CyberGuard Security Quiz Loading...');
    
    // Wait for authentication system to be ready
    const initializeQuizSystem = () => {
        // Check if authentication is available
        if (window.cyberGuardAuth && window.cyberGuardAuth.isAuthenticated()) {
            const currentUser = window.cyberGuardAuth.getCurrentUser();
            
            // Update user display elements
            const userInitialsEl = document.getElementById('user-initials');
            const userNameEl = document.getElementById('user-name');
            const userScoreEl = document.getElementById('user-score');
            
            if (userInitialsEl && currentUser.fullname) {
                const initials = currentUser.fullname.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                userInitialsEl.textContent = initials;
            }
            
            if (userNameEl) {
                userNameEl.textContent = currentUser.fullname || 'User';
            }
            
            if (userScoreEl) {
                // Get user's best score from history
                const userHistory = JSON.parse(localStorage.getItem(`quiz_results_${currentUser.email.replace(/[^a-zA-Z0-9]/g, '_')}`) || '[]');
                const bestScore = userHistory.length > 0 ? Math.max(...userHistory.map(result => result.score)) : 0;
                userScoreEl.textContent = `${bestScore} pts`;
            }
        } else {
            console.log('User not authenticated, will prompt when quiz starts');
        }
        
        // Create quiz instance
        window.securityQuizInstance = new AdvancedSecurityQuiz();
        console.log('CyberGuard Security Quiz Ready!');
    };
    
    // Initialize after a brief delay to ensure all resources are loaded
    if (window.cyberGuardAuth) {
        initializeQuizSystem();
    } else {
        // Wait for auth system to load
        setTimeout(() => {
            initializeQuizSystem();
        }, 500);
    }
    
    // Module completion event listeners for cross-page integration
    window.addEventListener('message', (event) => {
        if (event.data.type === 'module_completed') {
            const quiz = window.securityQuizInstance;
            quiz?.showNotification(
                `Great job completing ${event.data.module}! Ready for the security quiz?`, 
                'success', 
                5000
            );
            
            // Auto-start quiz if on arena page
            if (quiz?.isArenaPage && event.data.autoStartQuiz) {
                setTimeout(() => {
                    quiz.startQuiz();
                }, 2000);
            }
        }
    });
    
    // Handle navigation from other modules
    const urlParams = new URLSearchParams(window.location.search);
    const fromModule = urlParams.get('from');
    const autoStart = urlParams.get('autostart');
    
    if (fromModule && window.securityQuizInstance) {
        const moduleNames = {
            'hygiene': 'Cyber Hygiene Hub',
            'phishing': 'Phishing Training',
            'ransomware': 'Ransomware Simulation'
        };
        
        const moduleName = moduleNames[fromModule] || 'training module';
        window.securityQuizInstance.showNotification(
            `Welcome from ${moduleName}! Ready to test your knowledge?`,
            'info',
            4000
        );
        
        if (autoStart === 'true' && window.securityQuizInstance.isArenaPage) {
            setTimeout(() => {
                window.securityQuizInstance.startQuiz();
            }, 2000);
        }
    }
    
    console.log('CyberGuard Security Quiz Ready!');
});
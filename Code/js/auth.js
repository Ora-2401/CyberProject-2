/**
 * CyberGuard Authentication and User Management System
 * Provides global authentication functionality and user progress tracking
 */

class CyberGuardAuth {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.init();
    }

    init() {
        this.loadUsers();
        this.loadCurrentUser();
        this.setupEventListeners();
    }

    // User Management Functions
    loadUsers() {
        try {
            // First try to load from localStorage
            let users = JSON.parse(localStorage.getItem('cyberguard_users') || '[]');
            
            // Also try to load from a simulated text file storage
            const textFileUsers = this.loadUsersFromTextFile();
            
            // Merge users from both sources (localStorage takes precedence)
            if (textFileUsers.length > 0) {
                textFileUsers.forEach(textUser => {
                    if (!users.find(u => u.email === textUser.email)) {
                        users.push(textUser);
                    }
                });
            }
            
            this.users = users;
            
            // Save back to localStorage to ensure consistency
            if (users.length > 0) {
                this.saveUsers();
            }
        } catch (error) {
            console.error('Error loading users:', error);
            this.users = [];
        }
    }
    
    loadUsersFromTextFile() {
        try {
            // Simulate loading from text file using localStorage with a special key
            const textFileData = localStorage.getItem('cyberguard_users_textfile');
            return textFileData ? JSON.parse(textFileData) : [];
        } catch (error) {
            console.error('Error loading users from text file:', error);
            return [];
        }
    }
    
    saveUsersToTextFile() {
        try {
            // Simulate saving to text file
            const userData = this.users.map(user => ({
                email: user.email,
                fullname: user.fullname,
                password: user.password, // In production, this would be hashed
                registeredAt: user.registeredAt,
                lastLogin: user.lastLogin || null,
                progress: user.progress || {}
            }));
            
            localStorage.setItem('cyberguard_users_textfile', JSON.stringify(userData));
            
            // Also create individual user files for backup
            this.users.forEach(user => {
                const userKey = `cyberguard_user_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}`;
                localStorage.setItem(userKey, JSON.stringify(user));
            });
            
            console.log(`Users successfully saved to persistent storage. Total users: ${this.users.length}`);
        } catch (error) {
            console.error('Error saving users to text file:', error);
        }
    }

    loadCurrentUser() {
        try {
            this.currentUser = JSON.parse(localStorage.getItem('cyberguard_current_user'));
        } catch (error) {
            console.error('Error loading current user:', error);
            this.currentUser = null;
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('cyberguard_users', JSON.stringify(this.users));
            // Also save to simulated text file for persistence
            this.saveUsersToTextFile();
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    saveCurrentUser() {
        try {
            if (this.currentUser) {
                localStorage.setItem('cyberguard_current_user', JSON.stringify(this.currentUser));
            } else {
                localStorage.removeItem('cyberguard_current_user');
            }
        } catch (error) {
            console.error('Error saving current user:', error);
        }
    }

    // Authentication Functions
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            // Update user's last login time
            user.lastLogin = new Date().toISOString();
            
            this.currentUser = {
                email: user.email,
                fullname: user.fullname,
                progress: user.progress || {},
                loggedInAt: new Date().toISOString(),
                lastLogin: user.lastLogin
            };
            
            // Save updated user data
            this.saveUsers();
            this.saveCurrentUser();
            
            // Log successful login
            console.log(`User ${user.fullname} (${user.email}) logged in successfully`);
            
            return { success: true, user: this.currentUser };
        }
        
        console.log(`Failed login attempt for email: ${email}`);
        return { success: false, message: 'Invalid email or password' };
    }

    register(userData) {
        // Check if user already exists
        if (this.users.find(u => u.email === userData.email)) {
            return { success: false, message: 'User already exists with this email' };
        }

        // Create new user with enhanced data
        const newUser = {
            ...userData,
            progress: {
                phishing: 0,
                hygiene: 0,
                ransomware: 0,
                quiz: 0
            },
            registeredAt: new Date().toISOString(),
            lastLogin: null,
            loginCount: 0
        };

        this.users.push(newUser);
        this.saveUsers();
        
        // Auto-export credentials for backup
        setTimeout(() => {
            this.exportCredentialsAsTextFile();
        }, 1000);
        
        console.log(`New user registered: ${newUser.fullname} (${newUser.email})`);
        return { success: true, message: 'Registration successful. Credentials have been saved to your downloads.' };
    }

    logout() {
        this.currentUser = null;
        this.saveCurrentUser();
        window.location.href = 'index.html';
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getAllUsers() {
        return this.users;
    }

    // Progress Tracking Functions
    updateProgress(module, value) {
        if (!this.isAuthenticated()) {
            console.error('Cannot update progress: User not authenticated');
            return false;
        }

        // Validate input
        if (!module || typeof value !== 'number') {
            console.error('Invalid progress update parameters:', { module, value });
            return false;
        }

        // Update current user progress
        if (!this.currentUser.progress) {
            this.currentUser.progress = {};
        }
        
        // Use Math.max to ensure progress only goes forward
        const previousValue = this.currentUser.progress[module] || 0;
        this.currentUser.progress[module] = Math.max(previousValue, value);

        // Update user in users array
        const userIndex = this.users.findIndex(u => u.email === this.currentUser.email);
        if (userIndex !== -1) {
            if (!this.users[userIndex].progress) {
                this.users[userIndex].progress = {};
            }
            this.users[userIndex].progress[module] = this.currentUser.progress[module];
            
            // Update last activity timestamp
            this.users[userIndex].lastActivity = new Date().toISOString();
        }

        // Save all data
        this.saveUsers();
        this.saveCurrentUser();
        
        // Log progress update
        console.log(`Progress updated for ${this.currentUser.fullname}: ${module} = ${value}`);
        
        // Notify UI components
        this.notifyProgressUpdate(module, value);
        
        // Check for achievements
        this.checkAchievements(module, value);
        
        return true;
    }

    notifyProgressUpdate(module, value) {
        // Dispatch custom event for progress updates
        window.dispatchEvent(new CustomEvent('progressUpdated', {
            detail: { module, value, user: this.currentUser }
        }));
    }

    // Leaderboard Functions
    getLeaderboardData() {
        return this.users.map(user => {
            const progress = user.progress || {};
            const totalScore = (progress.phishing || 0) + (progress.hygiene || 0) + 
                             (progress.ransomware || 0) + (progress.quiz || 0);
            
            return {
                name: user.fullname || user.name || 'Unknown User',
                email: user.email,
                department: user.department || 'General',
                score: totalScore,
                quizScore: progress.quiz || 0,
                phishingProgress: progress.phishing || 0,
                hygieneProgress: progress.hygiene || 0,
                ransomwareProgress: progress.ransomware || 0,
                completion: Math.round(((progress.phishing >= 100 ? 1 : 0) + 
                                      (progress.hygiene >= 100 ? 1 : 0) + 
                                      (progress.ransomware >= 100 ? 1 : 0)) / 3 * 100)
            };
        }).sort((a, b) => b.score - a.score);
    }

    getUserRank() {
        if (!this.isAuthenticated()) return 0;
        
        const leaderboard = this.getLeaderboardData();
        return leaderboard.findIndex(user => user.email === this.currentUser.email) + 1;
    }

    // UI Helper Functions
    requireAuth(redirectToLogin = true) {
        if (!this.isAuthenticated()) {
            if (redirectToLogin) {
                this.showAuthModal();
            }
            return false;
        }
        return true;
    }

    showAuthModal() {
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'auth-modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div class="text-center">
                    <div class="mb-4">
                        <i class="ri-lock-line text-4xl text-blue-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Authentication Required</h3>
                    <p class="text-gray-600 mb-6">Please sign in to access this feature and track your progress.</p>
                    <div class="flex gap-3">
                        <button onclick="window.location.href='Login.html'" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Sign In
                        </button>
                        <button onclick="this.closest('.auth-modal').remove()" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    updateUserInterface() {
        const userAvatar = document.getElementById('user-avatar');
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');

        if (this.isAuthenticated()) {
            // Show user avatar and hide auth buttons
            if (userAvatar) {
                userAvatar.classList.remove('hidden');
                
                // Set avatar with user initials
                const names = this.currentUser.fullname.split(' ');
                let initials = '';
                if (names.length > 0) {
                    initials = names[0].charAt(0);
                    if (names.length > 1) {
                        initials += names[names.length - 1].charAt(0);
                    }
                }
                userAvatar.textContent = initials;
            }

            if (authButtons) {
                authButtons.classList.add('hidden');
            }

            // Update user menu info
            const menuUserName = document.getElementById('menu-user-name');
            const menuUserEmail = document.getElementById('menu-user-email');
            if (menuUserName) menuUserName.textContent = this.currentUser.fullname;
            if (menuUserEmail) menuUserEmail.textContent = this.currentUser.email;

            // Update progress displays
            this.updateProgressDisplays();
        } else {
            // Hide user avatar and show auth buttons
            if (userAvatar) userAvatar.classList.add('hidden');
            if (authButtons) authButtons.classList.remove('hidden');
        }
    }

    updateProgressDisplays() {
        if (!this.isAuthenticated()) return;

        const progress = this.currentUser.progress || {};
        
        // Update training module progress displays
        const modules = [
            { name: 'phishing', selector: 'phishing-progress' },
            { name: 'hygiene', selector: 'hygiene-progress' },
            { name: 'ransomware', selector: 'ransomware-progress' },
            { name: 'quiz', selector: 'quiz-progress' }
        ];
        
        modules.forEach(module => {
            const progressValue = progress[module.name] || 0;
            const progressElement = document.querySelector(`[data-module="${module.name}"] .progress-text`);
            const progressBar = document.querySelector(`[data-module="${module.name}"] .progress-fill`);
            
            if (progressElement && progressBar) {
                if (module.name === 'quiz') {
                    progressElement.textContent = `${progressValue} pts`;
                    const percentage = Math.min(100, (progressValue / 1000) * 100);
                    progressBar.style.width = `${percentage}%`;
                } else {
                    progressElement.textContent = `${progressValue}%`;
                    progressBar.style.width = `${progressValue}%`;
                }
            }
        });
    }

    setupEventListeners() {
        // Close user menu when clicking outside
        document.addEventListener('click', (event) => {
            const userMenu = document.getElementById('user-menu');
            const userAvatar = document.getElementById('user-avatar');
            
            if (userMenu && userAvatar && 
                !userAvatar.contains(event.target) && 
                !userMenu.contains(event.target)) {
                userMenu.style.display = 'none';
            }
        });

        // Handle progress updates
        window.addEventListener('progressUpdated', (event) => {
            this.updateProgressDisplays();
        });
    }

    // Achievement System
    checkAchievements(module, value) {
        const achievements = [];
        
        if (module === 'quiz') {
            if (value >= 900) achievements.push({ title: 'Quiz Master', description: 'Scored 90% or higher on security quiz' });
            else if (value >= 800) achievements.push({ title: 'Security Expert', description: 'Scored 80% or higher on security quiz' });
            else if (value >= 700) achievements.push({ title: 'Security Aware', description: 'Scored 70% or higher on security quiz' });
        }
        
        if (value === 100 && module !== 'quiz') {
            achievements.push({ title: `${module.charAt(0).toUpperCase() + module.slice(1)} Complete`, description: `Completed ${module} training module` });
        }
        
        // Check for completion achievements
        const progress = this.currentUser.progress || {};
        const completedModules = Object.values(progress).filter(p => p >= 100).length;
        
        if (completedModules >= 3) {
            achievements.push({ title: 'Training Champion', description: 'Completed all training modules' });
        }
        
        achievements.forEach(achievement => this.showAchievement(achievement));
    }

    showAchievement(achievement) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-lg shadow-lg z-50 max-w-sm achievement-notification';
        notification.innerHTML = `
            <div class="flex items-center mb-2">
                <i class="ri-trophy-line text-yellow-200 text-2xl mr-3"></i>
                <h4 class="font-bold text-lg">Achievement Unlocked!</h4>
            </div>
            <h5 class="font-semibold mb-1">${achievement.title}</h5>
            <p class="text-sm opacity-90">${achievement.description}</p>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Data Export Functions
    exportUserCredentialsToFile() {
        try {
            const credentialsData = {
                exportDate: new Date().toISOString(),
                totalUsers: this.users.length,
                users: this.users.map(user => ({
                    fullname: user.fullname,
                    email: user.email,
                    password: user.password, // In production, store hashed passwords
                    registeredAt: user.registeredAt,
                    lastLogin: user.lastLogin,
                    progress: user.progress || {}
                }))
            };
            
            const dataStr = JSON.stringify(credentialsData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cyberguard-credentials-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            console.log('User credentials exported to file successfully');
        } catch (error) {
            console.error('Error exporting credentials:', error);
        }
    }
    
    // Create a simple text file with user credentials
    exportCredentialsAsTextFile() {
        try {
            let textContent = `CyberGuard User Credentials\n`;
            textContent += `Generated: ${new Date().toLocaleString()}\n`;
            textContent += `Total Users: ${this.users.length}\n`;
            textContent += `${'='.repeat(50)}\n\n`;
            
            this.users.forEach((user, index) => {
                textContent += `User ${index + 1}:\n`;
                textContent += `  Name: ${user.fullname}\n`;
                textContent += `  Email: ${user.email}\n`;
                textContent += `  Password: ${user.password}\n`;
                textContent += `  Registered: ${new Date(user.registeredAt).toLocaleString()}\n`;
                if (user.lastLogin) {
                    textContent += `  Last Login: ${new Date(user.lastLogin).toLocaleString()}\n`;
                }
                
                // Progress information
                if (user.progress && Object.keys(user.progress).length > 0) {
                    textContent += `  Progress:\n`;
                    Object.entries(user.progress).forEach(([module, value]) => {
                        textContent += `    ${module}: ${value}${module === 'quiz' ? ' pts' : '%'}\n`;
                    });
                }
                
                textContent += `\n`;
            });
            
            const dataBlob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `cyberguard-credentials-${new Date().toISOString().split('T')[0]}.txt`;
            link.click();
            URL.revokeObjectURL(url);
            
            console.log('User credentials exported as text file successfully');
        } catch (error) {
            console.error('Error exporting credentials as text:', error);
        }
    }

    // Export individual user data
    exportUserData() {
        if (!this.isAuthenticated()) return;

        const dataStr = JSON.stringify(this.currentUser, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cyberguard-data-${this.currentUser.email.replace('@', '-')}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
    
    // Admin function to export all user credentials (for backup purposes)
    exportAllCredentials() {
        // This function should be used by administrators only
        this.exportCredentialsAsTextFile();
        this.exportUserCredentialsToFile();
        console.log('All user credentials exported for backup purposes');
    }

    // Reset progress
    resetProgress() {
        if (!this.isAuthenticated()) return;

        if (confirm('Are you sure you want to reset all training progress? This action cannot be undone.')) {
            this.currentUser.progress = {};
            
            const userIndex = this.users.findIndex(u => u.email === this.currentUser.email);
            if (userIndex !== -1) {
                this.users[userIndex].progress = {};
                this.saveUsers();
            }
            
            this.saveCurrentUser();
            this.updateProgressDisplays();
            alert('Progress reset successfully!');
        }
    }
}

// Global instance
window.cyberGuardAuth = new CyberGuardAuth();

// Global helper functions for backward compatibility
window.getCurrentUser = () => window.cyberGuardAuth.getCurrentUser();
window.getAllUsers = () => window.cyberGuardAuth.getAllUsers();
window.updateUserProgress = (module, value) => window.cyberGuardAuth.updateProgress(module, value);
window.logout = () => window.cyberGuardAuth.logout();
window.toggleUserMenu = () => {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
    }
};

// Initialize UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cyberGuardAuth.updateUserInterface();
});
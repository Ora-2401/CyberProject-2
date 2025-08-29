# 🛡️ CyberGuard - Cybersecurity Awareness Portal

**A comprehensive cybersecurity training and awareness platform designed to enhance organizational security posture through interactive training modules, simulations, and real-time threat intelligence.**

![Project Status](https://img.shields.io/badge/Status-Active-green)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Core Modules](#-core-modules)
- [Authentication System](#-authentication-system)
- [User Interface](#-user-interface)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

CyberGuard is a modern, responsive cybersecurity awareness platform that provides:

- **Interactive Training Modules** - Hands-on learning experiences
- **Real-time Threat Intelligence** - Live security monitoring and alerts
- **User Progress Tracking** - Comprehensive learning analytics
- **SIEM Dashboard** - Security Information and Event Management
- **Incident Reporting** - Streamlined security incident management
- **AI-Powered Chatbot** - 24/7 cybersecurity assistance

## ✨ Features

### 🎓 Training & Education
- **Phishing Awareness Training** - Interactive phishing recognition and prevention
- **Cyber Hygiene Best Practices** - Essential security habits and protocols
- **Ransomware Simulation** - Controlled ransomware scenario training
- **Security Quiz Arena** - Gamified knowledge assessment
- **Resource Library** - Comprehensive security documentation (PDFs)

### 🔐 Security Operations
- **SIEM Dashboard** - Real-time security monitoring and analytics
- **Threat Intelligence** - Live threat feeds and security bulletins
- **Incident Reporting** - Automated incident detection and reporting
- **Security Events** - Comprehensive event logging and analysis

### 👤 User Management
- **Authentication System** - Secure user registration and login
- **Progress Tracking** - Individual and organizational progress metrics
- **Leaderboard** - Gamified user rankings and achievements
- **User Profiles** - Personalized learning experiences

### 🤖 Advanced Features
- **AI Chatbot** - Intelligent cybersecurity assistance
- **Contact Management** - Functional contact forms with validation
- **Responsive Design** - Mobile-first, cross-platform compatibility
- **Real-time Updates** - Live data synchronization

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Advanced styling with animations and responsive design
- **JavaScript (ES6+)** - Modern JavaScript with modular architecture
- **Tailwind CSS** - Utility-first CSS framework
- **ECharts** - Interactive data visualizations

### Dependencies
- **RemixIcon** - Comprehensive icon library
- **Google Fonts** - Typography (Pacifico font family)
- **External APIs** - Threat intelligence and image services

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📁 Project Structure

```
CyberProject/
├── 📄 index.html                          # Main dashboard and homepage
├── 🔐 Login.html                          # User authentication page
├── 📝 register.html                       # User registration page
├── 👤 UserAuthentication.html             # User profile and settings
├── 🎯 Training Modules/
│   ├── phishing-training.html             # Phishing awareness training
│   ├── phishing-training-part1.html       # Advanced phishing scenarios
│   ├── phishing-training-part2.html       # Phishing response training
│   ├── hygiene-activity.html              # Cyber hygiene activities
│   ├── hygiene-hub.html                   # Hygiene best practices hub
│   ├── ransomware-simulation.html         # Interactive ransomware training
│   ├── quiz-arena.html                    # Security knowledge assessment
│   └── quiz-hub.html                      # Quiz management dashboard
├── 🛡️ Security Operations/
│   ├── siem-dashboard.html                # SIEM monitoring dashboard
│   ├── siem-analytics.html               # Advanced security analytics
│   ├── Security-Events.html              # Security event management
│   ├── incident-report.html              # Incident reporting system
│   └── start-simulation.html             # Security simulation launcher
├── 🤖 AI & Support/
│   ├── ai-chatbot.html                    # AI-powered assistance
│   └── chatbot.css                        # Chatbot styling
├── 📁 js/                                 # JavaScript modules
│   ├── auth.js                            # Authentication system
│   ├── form-validation.js                 # Form validation logic
│   ├── chatbot.js                         # AI chatbot functionality
│   ├── siem-manager.js                    # SIEM data management
│   └── config.js                          # Configuration settings
├── 📁 css/                                # Stylesheets
│   ├── common.css                         # Global styles
│   ├── secquiz.css                        # Quiz-specific styles
│   └── siem-styles.css                    # SIEM dashboard styles
├── 📁 images/                             # Image assets
├── 📁 resources/                          # PDF documentation
│   ├── PHISHING_RECOGNITION.pdf           # Phishing identification guide
│   ├── PASSWORD_SECURITY.pdf              # Password best practices
│   ├── MOBILE_DEVICE SECURITY.pdf         # Mobile security guide
│   ├── REMOTE_WORK SECURITY.pdf           # Remote work security
│   ├── SECURITY_POLICY.pdf                # Organizational security policy
│   └── INCIDENT_RESPONSE.pdf              # Incident response procedures
├── 📁 scripts/                            # Additional JavaScript
│   ├── hygiene-script.js                  # Hygiene module logic
│   └── quiz-script.js                     # Quiz engine
└── 📁 test/                               # Testing files
    ├── test-auth.html                     # Authentication testing
    ├── test-enhanced-phishing.html        # Phishing module testing
    ├── test-enhanced-quiz.html            # Quiz functionality testing
    └── test-modular-quiz.html             # Modular quiz testing
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Local web server (optional but recommended)

### Installation

1. **Clone or Download the Project**
   ```bash
   git clone <repository-url>
   cd CyberProject
   ```

2. **Local Development Server (Recommended)**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:8000`
   - Or simply open `index.html` directly in your browser

### First Time Setup

1. **Create an Account**
   - Click "Sign Up" in the top navigation
   - Fill out the registration form
   - Login with your new credentials

2. **Explore Training Modules**
   - Start with "Phishing Awareness" for beginners
   - Progress through "Cyber Hygiene Tips"
   - Challenge yourself with "Security Quiz Arena"

3. **Access Advanced Features**
   - View the SIEM Dashboard for threat monitoring
   - Try the AI Chatbot for security questions
   - Submit test incident reports

## 🎓 Core Modules

### 1. Phishing Awareness Training
- **File**: `phishing-training.html`
- **Description**: Interactive training to identify and respond to phishing attacks
- **Features**: 
  - Real-world phishing examples
  - Interactive email analysis
  - Progress tracking
  - Completion certificates

### 2. Cyber Hygiene Hub
- **File**: `hygiene-hub.html`
- **Description**: Essential security practices for daily computing
- **Features**:
  - Password security guidelines
  - Software update protocols
  - Safe browsing practices
  - Mobile device security

### 3. Ransomware Simulation
- **File**: `ransomware-simulation.html`
- **Description**: Controlled environment to understand ransomware attacks
- **Features**:
  - Step-by-step attack simulation
  - Prevention strategies
  - Response procedures
  - Recovery planning

### 4. Security Quiz Arena
- **File**: `quiz-arena.html`
- **Description**: Gamified security knowledge assessment
- **Features**:
  - Multiple difficulty levels
  - Leaderboard competition
  - Instant feedback
  - Achievement system

### 5. SIEM Dashboard
- **File**: `siem-dashboard.html`
- **Description**: Security Information and Event Management interface
- **Features**:
  - Real-time threat monitoring
  - Security analytics
  - Incident correlation
  - Alert management

## 🔐 Authentication System

The CyberGuard platform includes a comprehensive authentication system:

### Features
- **User Registration** - Secure account creation with validation
- **Session Management** - Persistent login sessions
- **Progress Tracking** - Individual user progress across all modules
- **Role-based Access** - Different access levels for users
- **Data Persistence** - LocalStorage-based data management

### User Data Structure
```javascript
{
  email: "user@example.com",
  fullname: "John Doe",
  progress: {
    phishing: 75,      // Percentage completion
    hygiene: 90,       // Percentage completion
    ransomware: 60,    // Percentage completion
    quiz: 850          // Points scored
  },
  registeredAt: "2024-01-01T00:00:00.000Z",
  lastLogin: "2024-01-15T10:30:00.000Z"
}
```

### Authentication Flow
1. User accesses training module
2. System checks authentication status
3. If not authenticated, login modal appears
4. Upon successful login, user gains full access
5. Progress is tracked and saved automatically

## 🎨 User Interface

### Design Principles
- **Responsive First** - Mobile-optimized design
- **Accessibility** - WCAG 2.1 AA compliance
- **Modern Aesthetics** - Clean, professional interface
- **Intuitive Navigation** - Clear user flow and wayfinding

### Key UI Components

#### Navigation Header
- Brand logo and navigation menu
- User authentication status
- Emergency incident reporting button
- Responsive mobile menu

#### Dashboard Cards
- Training module progress cards
- Interactive hover effects
- Real-time progress indicators
- Direct module access

#### Contact Form
- **Location**: Contact section with two-column layout
- **Features**: 
  - Form validation with visual feedback
  - Loading overlay during submission
  - Success message with contact promise
  - Auto-hiding notifications after 10 seconds
- **User Experience**: 
  - Clean "Send Message" button
  - Success confirmation: "Our security team will contact you within 24 hours"
  - Smooth animations and auto-scroll to messages

#### SIEM Dashboard
- Real-time threat visualization
- Interactive charts and graphs
- Alert management interface
- Comprehensive security metrics

## 📡 API Documentation

### Authentication API

#### Login User
```javascript
// Usage
const result = cyberGuardAuth.login(email, password);

// Response
{
  success: true,
  user: {
    email: "user@example.com",
    fullname: "John Doe",
    progress: {...}
  }
}
```

#### Register User
```javascript
// Usage
const result = cyberGuardAuth.register({
  email: "new@example.com",
  fullname: "New User",
  password: "securePassword"
});

// Response
{
  success: true,
  message: "Registration successful"
}
```

#### Update Progress
```javascript
// Usage
cyberGuardAuth.updateProgress('phishing', 85);

// Automatically triggers UI updates and saves to localStorage
```

### Form Validation API

#### Contact Form
```javascript
// Automatic validation on submit
// Validates: firstName, lastName, email, subject, message
// Provides visual feedback and error messages
// Success message displays after submission
```

## 🧪 Testing

### Manual Testing
The project includes comprehensive testing files:

- **test-auth.html** - Authentication system testing
- **test-enhanced-phishing.html** - Phishing module functionality
- **test-enhanced-quiz.html** - Quiz engine testing
- **test-modular-quiz.html** - Modular quiz components

### Testing Checklist
- ✅ User registration and authentication
- ✅ Training module access and progress tracking
- ✅ Quiz functionality and scoring
- ✅ SIEM dashboard data visualization
- ✅ Contact form submission and validation
- ✅ Mobile responsiveness
- ✅ Cross-browser compatibility

### Performance Testing
- Page load times < 3 seconds
- Smooth animations and transitions
- Efficient data handling and storage
- Responsive design across all device sizes

## 🤝 Contributing

We welcome contributions to improve CyberGuard! Here's how you can help:

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and patterns
- Test all functionality thoroughly
- Update documentation for new features
- Ensure mobile responsiveness
- Maintain accessibility standards

### Areas for Contribution
- 🆕 New training modules
- 🎨 UI/UX improvements
- 🔒 Enhanced security features
- 📊 Additional analytics and reporting
- 🌐 Internationalization
- ♿ Accessibility enhancements

## 📞 Support & Contact

### Security Team Information
- **Address**: 19 Ameshoff Street, 13th Floor, Hollard City Campus Building, Braamfontein, Johannesburg, 2000
- **Email**: info@cyberguard.co.za
- **Phone**: +27 (0)11 717-2900
- **Emergency Hotline**: +27 (0)11 717-CYBER
- **Hours**: Monday-Friday, 8:00 AM - 5:00 PM

### Team Members
- **Lesego Mphahlele** - Team Lead, Cybersecurity
- **Pearl Dlomu** - Security Analyst
- **Tshepiso Monama** - Incident Response Specialist
- **Oratile Modubu** - Security Training Manager

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Roadmap

### Short Term (Q1-Q2 2025)
- [ ] Enhanced mobile app development
- [ ] Integration with enterprise SIEM solutions
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

### Long Term (Q3-Q4 2025)
- [ ] Machine learning threat detection
- [ ] VR/AR training modules
- [ ] Integration with popular LMS platforms
- [ ] Advanced certification pathways

---

**Built with ❤️ by the CyberGuard Security Team**

*Protecting organizations through comprehensive cybersecurity awareness, training, and incident response capabilities.*
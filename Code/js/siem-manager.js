/**
 * SIEM Manager - Advanced Security Information and Event Management System
 * Integrates with CyberGuard authentication and provides real-time security monitoring
 */

class SIEMManager {
    constructor() {
        this.events = [];
        this.threats = [];
        this.metrics = {
            securityScore: 98,
            activeThreats: 3,
            monitoredAssets: 847,
            eventsPerHour: 12700
        };
        this.charts = {};
        this.realTimeEnabled = true;
        this.init();
    }

    init() {
        this.generateSampleData();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    // Data Generation
    generateSampleData() {
        // Generate threat feed data
        this.threats = [
            {
                id: 1,
                level: 'critical',
                title: 'Unauthorized Access Attempt',
                description: 'Multiple failed login attempts detected on production server',
                source: '192.168.1.247',
                timestamp: new Date(Date.now() - 5 * 60000),
                status: 'active'
            },
            {
                id: 2,
                level: 'high',
                title: 'Suspicious Network Traffic',
                description: 'Unusual data transfer patterns detected',
                source: 'Internal Network',
                timestamp: new Date(Date.now() - 15 * 60000),
                status: 'investigating'
            },
            {
                id: 3,
                level: 'medium',
                title: 'Malware Signature Detected',
                description: 'Known malware hash found in email attachment',
                source: 'Email Gateway',
                timestamp: new Date(Date.now() - 30 * 60000),
                status: 'contained'
            }
        ];

        // Generate security events
        this.events = [];
        for (let i = 0; i < 100; i++) {
            this.events.push({
                id: i + 1,
                timestamp: new Date(Date.now() - Math.random() * 86400000),
                type: this.getRandomEventType(),
                severity: this.getRandomSeverity(),
                source: this.getRandomSource(),
                description: this.getRandomDescription()
            });
        }
    }

    getRandomEventType() {
        const types = [
            'Authentication Failure', 'Network Intrusion', 'Malware Detection', 'Data Exfiltration',
            'Privilege Escalation', 'Lateral Movement', 'Command & Control', 'Phishing Attack',
            'DDoS Attack', 'Brute Force', 'SQL Injection', 'Cross-Site Scripting',
            'File Integrity', 'Access Violation', 'Policy Violation', 'Anomaly Detection'
        ];
        return types[Math.floor(Math.random() * types.length)];
    }

    getRandomSeverity() {
        const severities = ['low', 'medium', 'high', 'critical'];
        const weights = [0.5, 0.3, 0.15, 0.05]; // Lower severity more common
        const random = Math.random();
        let cumulative = 0;
        for (let i = 0; i < weights.length; i++) {
            cumulative += weights[i];
            if (random < cumulative) return severities[i];
        }
        return 'low';
    }

    getRandomSource() {
        const sources = [
            '192.168.1.247', '10.0.0.15', '172.16.5.23', '192.168.100.45',
            'Email Security Gateway', 'Web Application Firewall', 'Endpoint Detection System',
            'Network Intrusion Detection', 'Database Activity Monitor', 'DNS Security Service',
            'Identity Management System', 'Cloud Security Platform', 'Mobile Device Manager',
            'Security Information Hub', 'Threat Intelligence Feed', 'Behavioral Analytics Engine'
        ];
        return sources[Math.floor(Math.random() * sources.length)];
    }

    getRandomDescription() {
        const descriptions = [
            'Multiple failed authentication attempts detected from external IP',
            'Suspicious file download activity from compromised endpoint',
            'Unauthorized privilege escalation attempt blocked',
            'Malicious email attachment quarantined by security system',
            'DDoS attack mitigated by network protection systems',
            'Unusual data transfer patterns detected on internal network',
            'Brute force attack detected on administrative accounts',
            'Potentially malicious executable blocked by endpoint protection',
            'Suspicious network scanning activity from external source',
            'Unauthorized access attempt to critical database server',
            'Phishing email campaign detected and blocked',
            'Ransomware signature detected and contained',
            'Lateral movement attempt blocked by network segmentation',
            'Suspicious PowerShell execution detected and investigated',
            'External communication to known malicious domain blocked',
            'Credential stuffing attack detected on user portal',
            'Suspicious registry modification attempt prevented',
            'Malware command and control communication intercepted',
            'Unauthorized USB device detected and access denied',
            'Advanced persistent threat indicators detected in logs'
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    // Dashboard Initialization
    initializeDashboard() {
        this.updateSecurityMetrics();
        this.renderThreatFeed();
        this.initializeCharts();
        this.updateNetworkStatus();
        this.renderRecentIncidents();
        this.initializeThreatMap();
    }

    // Analytics Initialization
    initializeAnalytics() {
        this.initializeAnalyticsCharts();
        this.updateAnalyticsData();
    }

    updateSecurityMetrics() {
        document.getElementById('security-score').textContent = this.metrics.securityScore;
        document.getElementById('active-threats').textContent = this.metrics.activeThreats;
        document.getElementById('monitored-assets').textContent = this.metrics.monitoredAssets;
        document.getElementById('events-processed').textContent = (this.metrics.eventsPerHour / 1000).toFixed(1) + 'K';
    }

    renderThreatFeed() {
        const container = document.getElementById('threat-feed');
        if (!container) return;

        container.innerHTML = this.threats.map(threat => {
            const timeAgo = this.getTimeAgo(threat.timestamp);
            const levelColor = {
                critical: 'text-red-400 bg-red-900/20 border-red-500/30',
                high: 'text-orange-400 bg-orange-900/20 border-orange-500/30',
                medium: 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30',
                low: 'text-green-400 bg-green-900/20 border-green-500/30'
            };

            return `
                <div class="p-3 ${levelColor[threat.level]} border rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-semibold uppercase">${threat.level}</span>
                        <span class="text-xs text-gray-400">${timeAgo}</span>
                    </div>
                    <h4 class="font-medium text-sm mb-1">${threat.title}</h4>
                    <p class="text-xs text-gray-300 mb-2">${threat.description}</p>
                    <div class="text-xs text-gray-400">Source: ${threat.source}</div>
                </div>
            `;
        }).join('');
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) return `${hours}h ago`;
        return `${minutes}m ago`;
    }

    initializeCharts() {
        // Metrics Timeline Chart
        const metricsChart = echarts.init(document.getElementById('metrics-chart'));
        const metricsOption = {
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis', backgroundColor: '#1f2937', borderColor: '#374151' },
            legend: { textStyle: { color: '#ffffff' } },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                data: this.getLast24Hours(),
                axisLine: { lineStyle: { color: '#374151' } },
                axisLabel: { color: '#9ca3af' }
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#374151' } },
                axisLabel: { color: '#9ca3af' },
                splitLine: { lineStyle: { color: '#374151' } }
            },
            series: [
                {
                    name: 'Threats Detected',
                    type: 'line',
                    data: this.generateTimeSeriesData(24),
                    itemStyle: { color: '#ef4444' },
                    areaStyle: { color: 'rgba(239, 68, 68, 0.1)' }
                },
                {
                    name: 'Events Processed',
                    type: 'line',
                    data: this.generateTimeSeriesData(24, 1000, 2000),
                    itemStyle: { color: '#3b82f6' },
                    areaStyle: { color: 'rgba(59, 130, 246, 0.1)' }
                }
            ]
        };
        metricsChart.setOption(metricsOption);
        this.charts.metrics = metricsChart;

        // Network Traffic Chart
        const networkChart = echarts.init(document.getElementById('network-chart'));
        const networkOption = {
            backgroundColor: 'transparent',
            tooltip: { trigger: 'axis' },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                data: this.getLast24Hours().slice(-12),
                axisLabel: { color: '#9ca3af', fontSize: 10 }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#9ca3af', fontSize: 10 }
            },
            series: [{
                name: 'Network Traffic',
                type: 'bar',
                data: this.generateTimeSeriesData(12, 50, 100),
                itemStyle: { color: '#00d4ff' }
            }]
        };
        networkChart.setOption(networkOption);
        this.charts.network = networkChart;
    }

    updateNetworkStatus() {
        // This method updates network status displays
        const networkElements = {
            inbound: document.querySelector('.network-inbound'),
            outbound: document.querySelector('.network-outbound'),
            blocked: document.querySelector('.network-blocked')
        };
        
        // Update network traffic values with realistic fluctuations
        const baseInbound = 2.4;
        const baseOutbound = 1.8;
        const baseBlocked = 127;
        
        const inboundVariation = (Math.random() - 0.5) * 0.4;
        const outboundVariation = (Math.random() - 0.5) * 0.3;
        const blockedVariation = Math.floor((Math.random() - 0.5) * 40);
        
        // These values are displayed in the HTML but we're updating them dynamically
        console.log(`Network Status Update: Inbound: ${(baseInbound + inboundVariation).toFixed(1)} GB/s, Outbound: ${(baseOutbound + outboundVariation).toFixed(1)} GB/s, Blocked: ${baseBlocked + blockedVariation}/min`);
    }

    initializeThreatMap() {
        const mapContainer = document.getElementById('threat-map');
        if (!mapContainer) return;

        // Initialize threat map data
        this.threatMapData = {
            attacks: [],
            countries: [
                { name: 'United States', lat: 39.8283, lng: -98.5795, threats: 45 },
                { name: 'China', lat: 35.8617, lng: 104.1954, threats: 38 },
                { name: 'Russia', lat: 61.5240, lng: 105.3188, threats: 32 },
                { name: 'Brazil', lat: -14.2350, lng: -51.9253, threats: 28 },
                { name: 'India', lat: 20.5937, lng: 78.9629, threats: 25 },
                { name: 'Germany', lat: 51.1657, lng: 10.4515, threats: 22 },
                { name: 'United Kingdom', lat: 55.3781, lng: -3.4360, threats: 18 },
                { name: 'Japan', lat: 36.2048, lng: 138.2529, threats: 15 }
            ]
        };

        // Generate initial attack data
        this.generateThreatMapData();
        
        // Render the threat map
        this.renderThreatMap();
        
        // Update map data periodically
        setInterval(() => {
            this.updateThreatMapData();
        }, 5000);
    }

    generateThreatMapData() {
        const attackTypes = ['malware', 'phishing', 'ddos', 'intrusion', 'ransomware'];
        const cities = [
            { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'US' },
            { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
            { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'JP' },
            { name: 'Moscow', lat: 55.7558, lng: 37.6176, country: 'RU' },
            { name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'CN' },
            { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'AU' },
            { name: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'BR' },
            { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'IN' },
            { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'DE' },
            { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'CA' }
        ];

        // Generate 30 random attacks
        for (let i = 0; i < 30; i++) {
            const city = cities[Math.floor(Math.random() * cities.length)];
            const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
            
            this.threatMapData.attacks.push({
                id: i + 1,
                type: attackType,
                city: city.name,
                country: city.country,
                lat: city.lat + (Math.random() - 0.5) * 4,
                lng: city.lng + (Math.random() - 0.5) * 4,
                intensity: Math.floor(Math.random() * 5) + 1,
                timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
                status: ['active', 'mitigated', 'investigating'][Math.floor(Math.random() * 3)]
            });
        }
    }

    renderThreatMap() {
        const mapContainer = document.getElementById('threat-map');
        if (!mapContainer) return;

        // Create a simple visualization since we don't have world map data
        mapContainer.innerHTML = `
            <div class="threat-map-container bg-gray-900 rounded-lg p-4 h-full">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div class="threat-stat bg-red-900/30 border border-red-500/50 rounded p-3 text-center">
                        <div class="text-2xl font-bold text-red-400">${this.threatMapData.attacks.filter(a => a.type === 'malware').length}</div>
                        <div class="text-xs text-gray-400">Malware Attacks</div>
                    </div>
                    <div class="threat-stat bg-yellow-900/30 border border-yellow-500/50 rounded p-3 text-center">
                        <div class="text-2xl font-bold text-yellow-400">${this.threatMapData.attacks.filter(a => a.type === 'phishing').length}</div>
                        <div class="text-xs text-gray-400">Phishing Attempts</div>
                    </div>
                    <div class="threat-stat bg-blue-900/30 border border-blue-500/50 rounded p-3 text-center">
                        <div class="text-2xl font-bold text-blue-400">${this.threatMapData.attacks.filter(a => a.type === 'ddos').length}</div>
                        <div class="text-xs text-gray-400">DDoS Attacks</div>
                    </div>
                    <div class="threat-stat bg-purple-900/30 border border-purple-500/50 rounded p-3 text-center">
                        <div class="text-2xl font-bold text-purple-400">${this.threatMapData.attacks.filter(a => a.type === 'intrusion').length}</div>
                        <div class="text-xs text-gray-400">Intrusion Attempts</div>
                    </div>
                </div>
                
                <div class="threat-feed max-h-64 overflow-y-auto space-y-2">
                    <h4 class="text-lg font-semibold text-cyber-blue mb-3">Recent Global Threats</h4>
                    ${this.threatMapData.attacks.slice(0, 8).map(attack => `
                        <div class="threat-item bg-gray-700/50 border border-gray-600 rounded p-3 flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="w-3 h-3 rounded-full ${this.getThreatColor(attack.type)}"></div>
                                <div>
                                    <div class="text-sm font-medium text-white">${attack.type.toUpperCase()} - ${attack.city}</div>
                                    <div class="text-xs text-gray-400">${this.getTimeAgo(attack.timestamp)} • Intensity: ${attack.intensity}/5</div>
                                </div>
                            </div>
                            <div class="text-xs px-2 py-1 rounded ${this.getStatusColor(attack.status)}">
                                ${attack.status.toUpperCase()}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getThreatColor(type) {
        const colors = {
            malware: 'bg-red-500',
            phishing: 'bg-yellow-500',
            ddos: 'bg-blue-500',
            intrusion: 'bg-purple-500',
            ransomware: 'bg-red-600'
        };
        return colors[type] || 'bg-gray-500';
    }

    getStatusColor(status) {
        const colors = {
            active: 'bg-red-600 text-red-100',
            mitigated: 'bg-green-600 text-green-100',
            investigating: 'bg-yellow-600 text-yellow-100'
        };
        return colors[status] || 'bg-gray-600 text-gray-100';
    }

    updateThreatMapData() {
        // Add a new random threat
        if (Math.random() < 0.3) {
            const attackTypes = ['malware', 'phishing', 'ddos', 'intrusion', 'ransomware'];
            const cities = [
                { name: 'New York', lat: 40.7128, lng: -74.0060 },
                { name: 'London', lat: 51.5074, lng: -0.1278 },
                { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
                { name: 'Moscow', lat: 55.7558, lng: 37.6176 },
                { name: 'Berlin', lat: 52.5200, lng: 13.4050 }
            ];
            
            const city = cities[Math.floor(Math.random() * cities.length)];
            const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
            
            const newAttack = {
                id: Date.now(),
                type: attackType,
                city: city.name,
                lat: city.lat + (Math.random() - 0.5) * 4,
                lng: city.lng + (Math.random() - 0.5) * 4,
                intensity: Math.floor(Math.random() * 5) + 1,
                timestamp: new Date(),
                status: 'active'
            };
            
            this.threatMapData.attacks.unshift(newAttack);
            
            // Keep only the latest 50 attacks
            if (this.threatMapData.attacks.length > 50) {
                this.threatMapData.attacks = this.threatMapData.attacks.slice(0, 50);
            }
            
            // Re-render the map
            this.renderThreatMap();
        }
    }

    initializeAnalyticsCharts() {
        // Threat Trend Chart for Analytics
        const trendChart = echarts.init(document.getElementById('threat-trend-chart'));
        if (trendChart) {
            const trendOption = {
                backgroundColor: 'transparent',
                tooltip: { trigger: 'axis' },
                legend: { textStyle: { color: '#ffffff' } },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: this.getLast30Days(),
                    axisLabel: { color: '#9ca3af' }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: { color: '#9ca3af' }
                },
                series: [
                    {
                        name: 'Malware',
                        type: 'line',
                        data: this.generateTimeSeriesData(30, 5, 25),
                        itemStyle: { color: '#ef4444' }
                    },
                    {
                        name: 'Phishing',
                        type: 'line',
                        data: this.generateTimeSeriesData(30, 3, 15),
                        itemStyle: { color: '#f59e0b' }
                    },
                    {
                        name: 'Intrusion',
                        type: 'line',
                        data: this.generateTimeSeriesData(30, 1, 8),
                        itemStyle: { color: '#8b5cf6' }
                    }
                ]
            };
            trendChart.setOption(trendOption);
            this.charts.trend = trendChart;
        }

        // Attack Vectors Chart
        const vectorsChart = echarts.init(document.getElementById('attack-vectors-chart'));
        if (vectorsChart) {
            const vectorsOption = {
                backgroundColor: 'transparent',
                tooltip: { trigger: 'item' },
                series: [{
                    type: 'pie',
                    radius: ['40%', '70%'],
                    data: [
                        { value: 35, name: 'Email Phishing', itemStyle: { color: '#ef4444' } },
                        { value: 28, name: 'Web Exploits', itemStyle: { color: '#f59e0b' } },
                        { value: 20, name: 'Malware', itemStyle: { color: '#8b5cf6' } },
                        { value: 17, name: 'Social Engineering', itemStyle: { color: '#06b6d4' } }
                    ],
                    label: { color: '#ffffff' }
                }]
            };
            vectorsChart.setOption(vectorsOption);
            this.charts.vectors = vectorsChart;
        }

        // Geographic Attack Distribution Chart
        const geoChart = echarts.init(document.getElementById('geo-distribution-chart'));
        if (geoChart) {
            const geoOption = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return `${params.name}<br/>Attacks: ${params.value[2]}<br/>Severity: ${params.value[3]}`;
                    }
                },
                visualMap: {
                    min: 0,
                    max: 100,
                    calculable: true,
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    },
                    textStyle: {
                        color: '#ffffff'
                    },
                    left: 'left',
                    top: 'bottom'
                },
                geo: {
                    map: 'world',
                    roam: true,
                    emphasis: {
                        label: {
                            show: false
                        },
                        itemStyle: {
                            areaColor: '#389BB7'
                        }
                    },
                    itemStyle: {
                        borderColor: '#404040',
                        borderWidth: 1,
                        areaColor: '#2c3e50'
                    },
                    label: {
                        show: false
                    }
                },
                series: [
                    {
                        name: 'Attack Distribution',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: this.generateGeoAttackData(),
                        symbolSize: function (val) {
                            return Math.max(val[2] / 5, 4);
                        },
                        itemStyle: {
                            color: function(params) {
                                const severity = params.value[3];
                                const colors = {
                                    'Critical': '#ef4444',
                                    'High': '#f59e0b',
                                    'Medium': '#eab308',
                                    'Low': '#22c55e'
                                };
                                return colors[severity] || '#6b7280';
                            },
                            shadowBlur: 10,
                            shadowColor: 'rgba(120, 36, 50, 0.5)'
                        },
                        emphasis: {
                            scale: true,
                            itemStyle: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        }
                    }
                ]
            };
            
            // Since we don't have world map data, create a simplified geographic visualization
            const simplifiedGeoOption = {
                backgroundColor: 'transparent',
                tooltip: {
                    trigger: 'item',
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    textStyle: { color: '#ffffff' }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    name: 'Longitude',
                    axisLabel: { color: '#9ca3af', fontSize: 10 },
                    axisLine: { lineStyle: { color: '#374151' } },
                    splitLine: { lineStyle: { color: '#374151' } }
                },
                yAxis: {
                    type: 'value',
                    name: 'Latitude',
                    axisLabel: { color: '#9ca3af', fontSize: 10 },
                    axisLine: { lineStyle: { color: '#374151' } },
                    splitLine: { lineStyle: { color: '#374151' } }
                },
                series: [
                    {
                        name: 'Global Attacks',
                        type: 'scatter',
                        data: this.generateGeoAttackData(),
                        symbolSize: function (data) {
                            return Math.max(data[2] / 3, 8);
                        },
                        itemStyle: {
                            color: function(params) {
                                const severity = params.value[3];
                                const colors = {
                                    'Critical': '#ef4444',
                                    'High': '#f59e0b',
                                    'Medium': '#eab308',
                                    'Low': '#22c55e'
                                };
                                return colors[severity] || '#6b7280';
                            },
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 212, 255, 0.5)'
                        },
                        label: {
                            show: true,
                            position: 'top',
                            color: '#ffffff',
                            fontSize: 10,
                            formatter: function(params) {
                                return params.value[4]; // City name
                            }
                        }
                    }
                ]
            };
            
            geoChart.setOption(simplifiedGeoOption);
            this.charts.geo = geoChart;
        }
    }

    getLast24Hours() {
        const hours = [];
        for (let i = 23; i >= 0; i--) {
            const time = new Date(Date.now() - i * 3600000);
            hours.push(time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
        }
        return hours;
    }

    getLast30Days() {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date(Date.now() - i * 86400000);
            days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return days;
    }

    generateTimeSeriesData(points, min = 0, max = 100) {
        return Array.from({ length: points }, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }

    generateGeoAttackData() {
        // Generate realistic geographic attack data with major cities and their coordinates
        const cities = [
            { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' },
            { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
            { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
            { name: 'Moscow', lat: 55.7558, lng: 37.6176, country: 'Russia' },
            { name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China' },
            { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
            { name: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'Brazil' },
            { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
            { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany' },
            { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada' },
            { name: 'Seoul', lat: 37.5665, lng: 126.9780, country: 'South Korea' },
            { name: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'UAE' },
            { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore' },
            { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, country: 'Hong Kong' },
            { name: 'Mexico City', lat: 19.4326, lng: -99.1332, country: 'Mexico' },
            { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt' },
            { name: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
            { name: 'Jakarta', lat: -6.2088, lng: 106.8456, country: 'Indonesia' },
            { name: 'Bangkok', lat: 13.7563, lng: 100.5018, country: 'Thailand' },
            { name: 'Istanbul', lat: 41.0082, lng: 28.9784, country: 'Turkey' }
        ];
        
        const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
        const attackData = [];
        
        cities.forEach(city => {
            // Generate random attack intensity (1-100)
            const intensity = Math.floor(Math.random() * 80) + 20;
            
            // Assign severity based on intensity
            let severity;
            if (intensity >= 80) severity = 'Critical';
            else if (intensity >= 60) severity = 'High';
            else if (intensity >= 40) severity = 'Medium';
            else severity = 'Low';
            
            // Add some randomness to coordinates for visual variety
            const lat = city.lat + (Math.random() - 0.5) * 2;
            const lng = city.lng + (Math.random() - 0.5) * 2;
            
            attackData.push([lng, lat, intensity, severity, city.name]);
        });
        
        // Add some additional random attack points
        for (let i = 0; i < 15; i++) {
            const lat = (Math.random() - 0.5) * 160; // -80 to 80 degrees
            const lng = (Math.random() - 0.5) * 360; // -180 to 180 degrees
            const intensity = Math.floor(Math.random() * 60) + 10;
            const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
            
            attackData.push([lng, lat, intensity, severity, `Location ${i + 1}`]);
        }
        
        return attackData;
    }

    renderRecentIncidents() {
        const container = document.getElementById('recent-incidents');
        if (!container) return;

        const incidents = this.events.slice(0, 5);
        container.innerHTML = incidents.map(incident => {
            const severityColors = {
                critical: 'border-l-red-500 bg-red-900/20',
                high: 'border-l-orange-500 bg-orange-900/20',
                medium: 'border-l-yellow-500 bg-yellow-900/20',
                low: 'border-l-green-500 bg-green-900/20'
            };
            
            const severityIcons = {
                critical: 'ri-alarm-warning-line text-red-400',
                high: 'ri-error-warning-line text-orange-400',
                medium: 'ri-information-line text-yellow-400',
                low: 'ri-checkbox-circle-line text-green-400'
            };
            
            return `
                <div class="p-4 bg-gray-700/50 rounded border-l-4 ${severityColors[incident.severity]} border border-gray-600 hover:bg-gray-700/70 transition-colors">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center space-x-3">
                            <i class="${severityIcons[incident.severity]} text-lg"></i>
                            <div>
                                <h4 class="text-sm font-semibold text-cyber-blue">${incident.type}</h4>
                                <span class="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 uppercase">${incident.severity}</span>
                            </div>
                        </div>
                        <span class="text-xs text-gray-400">${this.getTimeAgo(incident.timestamp)}</span>
                    </div>
                    <p class="text-sm text-gray-300 mb-3 leading-relaxed">${incident.description}</p>
                    <div class="flex items-center justify-between text-xs">
                        <div class="text-gray-400">
                            <i class="ri-computer-line mr-1"></i>
                            Source: <span class="text-cyber-blue">${incident.source}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button onclick="investigateIncident('${incident.id}')" class="text-cyber-blue hover:text-cyan-300 transition-colors">
                                <i class="ri-search-line mr-1"></i>Investigate
                            </button>
                            <button onclick="resolveIncident('${incident.id}')" class="text-cyber-green hover:text-green-300 transition-colors">
                                <i class="ri-check-line mr-1"></i>Resolve
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Real-time Updates
    startRealTimeUpdates() {
        if (this.realTimeEnabled) {
            setInterval(() => {
                this.updateMetrics();
                this.addRandomThreat();
            }, 30000); // Update every 30 seconds
        }
    }

    updateMetrics() {
        // Simulate metric changes
        this.metrics.eventsPerHour += Math.floor(Math.random() * 200) - 100;
        this.metrics.eventsPerHour = Math.max(10000, this.metrics.eventsPerHour);
        
        if (document.getElementById('events-processed')) {
            document.getElementById('events-processed').textContent = 
                (this.metrics.eventsPerHour / 1000).toFixed(1) + 'K';
        }
    }

    addRandomThreat() {
        if (Math.random() < 0.3) { // 30% chance to add new threat
            const newThreat = {
                id: Date.now(),
                level: this.getRandomSeverity(),
                title: 'New Security Event',
                description: 'Automated threat detection alert',
                source: this.getRandomSource(),
                timestamp: new Date(),
                status: 'active'
            };
            
            this.threats.unshift(newThreat);
            if (this.threats.length > 10) {
                this.threats = this.threats.slice(0, 10);
            }
            
            this.renderThreatFeed();
        }
    }

    // Utility Methods
    refreshAllData() {
        this.generateSampleData();
        this.updateSecurityMetrics();
        this.renderThreatFeed();
        this.renderRecentIncidents();
        
        // Refresh threat map if it exists
        if (this.threatMapData) {
            this.generateThreatMapData();
            this.renderThreatMap();
        }
        
        // Refresh charts
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
        
        console.log('SIEM Dashboard data refreshed at', new Date().toLocaleTimeString());
    }

    setupEventListeners() {
        // Handle window resize for charts
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        });
    }

    // Map Animation Control
    toggleMapAnimation() {
        // Toggle real-time threat map updates
        this.realTimeEnabled = !this.realTimeEnabled;
        
        const icon = document.getElementById('map-play-icon');
        if (icon) {
            if (this.realTimeEnabled) {
                icon.classList.remove('ri-play-line');
                icon.classList.add('ri-pause-line');
                // Resume threat map updates
                console.log('Threat map animation resumed');
            } else {
                icon.classList.remove('ri-pause-line');
                icon.classList.add('ri-play-line');
                // Pause threat map updates
                console.log('Threat map animation paused');
            }
        }
        
        // Show status message
        const statusMessage = this.realTimeEnabled ? 'Live threat tracking enabled' : 'Live threat tracking paused';
        this.showNotification(statusMessage, this.realTimeEnabled ? 'success' : 'info');
    }

    showNotification(message, type = 'info') {
        // Create and show a notification
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600';
        
        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    updateAnalyticsData() {
        // Update analytics-specific data
        if (document.getElementById('global-search')) {
            document.getElementById('global-search').addEventListener('input', (e) => {
                this.searchEvents(e.target.value);
            });
        }
    }

    searchEvents(query) {
        // Implement search functionality
        console.log('Searching for:', query);
    }
}

// Global instance
window.siemManager = new SIEMManager();

// Initialize Dashboard
function initializeSIEMDashboard() {
    window.siemManager.initializeDashboard();
}

// Initialize Analytics
function initializeSIEMAnalytics() {
    window.siemManager.initializeAnalytics();
}

// Global incident management functions
function investigateIncident(incidentId) {
    const incident = window.siemManager.events.find(e => e.id == incidentId);
    if (incident) {
        alert(`Investigation Started:\n\nIncident: ${incident.type}\nSeverity: ${incident.severity.toUpperCase()}\nDescription: ${incident.description}\nSource: ${incident.source}\n\nForensic analysis has been initiated. Security team has been notified.`);
        console.log(`Incident ${incidentId} under investigation:`, incident);
    }
}

function resolveIncident(incidentId) {
    const incidentIndex = window.siemManager.events.findIndex(e => e.id == incidentId);
    if (incidentIndex !== -1) {
        const incident = window.siemManager.events[incidentIndex];
        const confirmed = confirm(`Mark incident as resolved?\n\nType: ${incident.type}\nSeverity: ${incident.severity.toUpperCase()}\nSource: ${incident.source}`);
        
        if (confirmed) {
            // Remove the incident from the list
            window.siemManager.events.splice(incidentIndex, 1);
            // Re-render the incidents
            window.siemManager.renderRecentIncidents();
            alert('Incident has been marked as resolved and removed from active monitoring.');
        }
    }
}

function filterThreatMap(filterType) {
    if (window.siemManager && window.siemManager.threatMapData) {
        if (filterType === 'all') {
            window.siemManager.renderThreatMap();
        } else {
            // Filter attacks by type
            const originalAttacks = [...window.siemManager.threatMapData.attacks];
            window.siemManager.threatMapData.attacks = originalAttacks.filter(attack => attack.type === filterType);
            window.siemManager.renderThreatMap();
            // Restore original data after display
            setTimeout(() => {
                window.siemManager.threatMapData.attacks = originalAttacks;
            }, 100);
        }
    }
}

// Export functions for global use
window.refreshSIEMData = () => window.siemManager.refreshAllData();
window.toggleMapAnimation = () => window.siemManager.toggleMapAnimation();
window.investigateIncident = investigateIncident;
window.resolveIncident = resolveIncident;
window.filterThreatMap = filterThreatMap;
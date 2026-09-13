/**
 * BOT CONFIGURATION FILE
 * Customize your bot behavior here
 */

require('dotenv').config();

module.exports = {
  // ============================================
  // INSTAGRAM CREDENTIALS
  // ============================================
  instagram: {
    username: process.env.IG_USERNAME || 'your_username',
    password: process.env.IG_PASSWORD || 'your_password',
  },

  // ============================================
  // ENGAGEMENT LIMITS (per session)
  // ============================================
  engagement: {
    likesPerSession: parseInt(process.env.LIKES_PER_SESSION) || 20,
    followsPerSession: parseInt(process.env.FOLLOWS_PER_SESSION) || 15,
    commentsPerSession: parseInt(process.env.COMMENTS_PER_SESSION) || 10,
  },

  // ============================================
  // DELAYS & RATE LIMITING
  // ============================================
  timing: {
    // Delay between actions in milliseconds
    // Higher = safer (less likely to be detected)
    // Recommended: 3000-8000ms (3-8 seconds)
    delayBetweenActions: parseInt(process.env.DELAY_BETWEEN_ACTIONS) || 4000,

    // Delay between sessions (in milliseconds)
    delayBetweenSessions: 60000, // 1 minute
  },

  // ============================================
  // TARGETING
  // ============================================
  targeting: {
    // Hashtags to search and engage with
    hashtags: (process.env.TARGET_HASHTAGS || 'trading,forex,stocks')
      .split(',')
      .map(h => h.trim()),

    // Accounts whose followers to target
    accountsToFollow: (process.env.TARGET_ACCOUNTS || 'trader1,trader2')
      .split(',')
      .map(a => a.trim()),

    // Only like posts with engagement above this threshold
    minimumEngagement: 10, // likes
  },

  // ============================================
  // COMMENT MESSAGES
  // ============================================
  comments: {
    // Messages will be randomly selected
    messages: [
      'Great analysis! 📈',
      'Love the content! 🔥',
      'Very insightful 💡',
      'Thanks for sharing! 🙏',
      'Interesting perspective! 👀',
      'This is helpful! ✅',
      'Solid breakdown! 💪',
      'Really appreciate this! 🙌',
    ],

    // Enable/disable auto-commenting
    enabled: true,
  },

  // ============================================
  // FOLLOW SETTINGS
  // ============================================
  follow: {
    // Enable/disable auto-following
    enabled: true,

    // Unfollow accounts after X days (0 = never)
    unfollowAfterDays: 0,
  },

  // ============================================
  // LOGGING
  // ============================================
  logging: {
    // Log file path
    logFile: process.env.LOG_FILE || 'bot-activity.log',

    // Log level: 'debug', 'info', 'warn', 'error'
    level: process.env.LOG_LEVEL || 'info',

    // Console output
    console: true,
  },

  // ============================================
  // SCHEDULING
  // ============================================
  scheduling: {
    // Enable scheduled runs
    enabled: false,

    // Cron time format (see node-schedule docs)
    // Examples:
    // '0 10 * * *' = Every day at 10:00 AM
    // '0 */3 * * *' = Every 3 hours
    // '0 9-17 * * 1-5' = Weekdays 9am-5pm hourly
    cronTime: '0 10 * * *',
  },

  // ============================================
  // PROXY SETTINGS (Optional)
  // ============================================
  proxy: {
    enabled: false,
    // List of proxies to rotate through
    proxies: [
      // Format: 'http://user:pass@ip:port' or 'http://ip:port'
      // 'http://192.168.1.1:8080',
      // 'http://proxy.example.com:8080',
    ],
  },

  // ============================================
  // DETECTION AVOIDANCE
  // ============================================
  antiDetection: {
    // Randomize delays
    randomizeDelays: true,

    // Random delay variance (percentage, 0-100)
    delayVariance: 20,

    // User agents to rotate
    userAgents: [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ],
  },

  // ============================================
  // NOTIFICATION SETTINGS
  // ============================================
  notifications: {
    // Send notifications when actions complete
    enabled: false,

    // Discord webhook URL (optional)
    discordWebhook: process.env.DISCORD_WEBHOOK || '',

    // Telegram bot token (optional)
    telegramToken: process.env.TELEGRAM_TOKEN || '',
  },

  // ============================================
  // SAFETY & LIMITS
  // ============================================
  safety: {
    // Maximum sessions per day
    maxSessionsPerDay: 5,

    // Maximum total actions per day
    maxActionsPerDay: 200,

    // Emergency stop: pause if account shows warning
    emergencyStop: true,

    // Minimum account age before running (days)
    minAccountAge: 7,
  },
};

/**
 * INSTAGRAM ENGAGEMENT BOT
 * ⚠️  WARNING: Using this violates Instagram's ToS and risks account suspension
 * Use for educational purposes or at your own risk
 * 
 * Features:
 * - Auto-like posts from target hashtags/accounts
 * - Auto-comment with custom messages
 * - Auto-follow users
 * - Rate limiting to avoid detection
 * - Activity logging
 */

const { IgApiClient } = require('instagram-private-api');
const fs = require('fs');
const readline = require('readline');

class InstagramBot {
  constructor(config = {}) {
    this.ig = new IgApiClient();
    this.config = {
      username: config.username || process.env.IG_USERNAME,
      password: config.password || process.env.IG_PASSWORD,
      likesPerSession: config.likesPerSession || 15,
      followsPerSession: config.followsPerSession || 10,
      commentsPerSession: config.commentsPerSession || 5,
      delayBetweenActions: config.delayBetweenActions || 3000, // ms
      targetHashtags: config.targetHashtags || ['trading', 'forex'],
      targetAccounts: config.targetAccounts || [],
      commentMessages: config.commentMessages || [
        'Great content! 🔥',
        'Love this! 📈',
        'Interesting perspective 💡',
      ],
      logFile: 'bot-activity.log',
      ...config
    };
    this.activity = {
      likes: 0,
      follows: 0,
      comments: 0,
      errors: 0,
      startTime: new Date()
    };
  }

  /**
   * Log activities to file and console
   */
  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    
    fs.appendFileSync(this.config.logFile, logMessage + '\n');
  }

  /**
   * Delay execution (for rate limiting)
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Login to Instagram
   */
  async login() {
    try {
      this.log('Attempting login...');
      this.ig.state.generateDevice(this.config.username);
      
      await this.ig.account.login(this.config.username, this.config.password);
      this.log('✓ Successfully logged in', 'success');
      return true;
    } catch (error) {
      this.log(`✗ Login failed: ${error.message}`, 'error');
      this.activity.errors++;
      return false;
    }
  }

  /**
   * Like posts from hashtags
   */
  async likeFromHashtags() {
    try {
      this.log(`Starting hashtag engagement for: ${this.config.targetHashtags.join(', ')}`);
      let likeCount = 0;

      for (const hashtag of this.config.targetHashtags) {
        if (likeCount >= this.config.likesPerSession) break;

        try {
          const hashtag_id = (await this.ig.hashtag.search(hashtag)).hashtags[0].id;
          const feed = this.ig.feed.hashtagFeed(hashtag_id);
          const posts = await feed.items();

          for (const post of posts) {
            if (likeCount >= this.config.likesPerSession) break;

            try {
              await this.ig.media.like({ mediaId: post.id });
              likeCount++;
              this.activity.likes++;
              this.log(`♥ Liked post from #${hashtag}`);
              await this.delay(this.config.delayBetweenActions);
            } catch (error) {
              this.log(`Failed to like post: ${error.message}`, 'warn');
            }
          }
        } catch (error) {
          this.log(`Error processing #${hashtag}: ${error.message}`, 'warn');
        }
      }

      this.log(`Completed hashtag engagement: ${likeCount} likes`);
      return likeCount;
    } catch (error) {
      this.log(`Hashtag engagement error: ${error.message}`, 'error');
      this.activity.errors++;
      return 0;
    }
  }

  /**
   * Follow users from target accounts
   */
  async followFromAccounts() {
    try {
      this.log(`Starting follow engagement for: ${this.config.targetAccounts.join(', ')}`);
      let followCount = 0;

      for (const account of this.config.targetAccounts) {
        if (followCount >= this.config.followsPerSession) break;

        try {
          const user = await this.ig.user.searchExact(account);
          
          // Get their followers
          const followersFeed = this.ig.feed.userFollowers(user.id);
          const followers = await followersFeed.items();

          for (const follower of followers) {
            if (followCount >= this.config.followsPerSession) break;

            try {
              await this.ig.friendship.create(follower.id);
              followCount++;
              this.activity.follows++;
              this.log(`👤 Followed @${follower.username}`);
              await this.delay(this.config.delayBetweenActions);
            } catch (error) {
              if (!error.message.includes('already follow')) {
                this.log(`Failed to follow user: ${error.message}`, 'warn');
              }
            }
          }
        } catch (error) {
          this.log(`Error processing account @${account}: ${error.message}`, 'warn');
        }
      }

      this.log(`Completed follow engagement: ${followCount} follows`);
      return followCount;
    } catch (error) {
      this.log(`Follow engagement error: ${error.message}`, 'error');
      this.activity.errors++;
      return 0;
    }
  }

  /**
   * Leave comments on posts
   */
  async commentOnPosts() {
    try {
      this.log('Starting comment engagement');
      let commentCount = 0;

      for (const hashtag of this.config.targetHashtags) {
        if (commentCount >= this.config.commentsPerSession) break;

        try {
          const hashtag_id = (await this.ig.hashtag.search(hashtag)).hashtags[0].id;
          const feed = this.ig.feed.hashtagFeed(hashtag_id);
          const posts = await feed.items();

          for (const post of posts) {
            if (commentCount >= this.config.commentsPerSession) break;

            try {
              const randomComment = this.config.commentMessages[
                Math.floor(Math.random() * this.config.commentMessages.length)
              ];

              await this.ig.media.comment({
                mediaId: post.id,
                text: randomComment
              });

              commentCount++;
              this.activity.comments++;
              this.log(`💬 Commented on post from #${hashtag}: "${randomComment}"`);
              await this.delay(this.config.delayBetweenActions);
            } catch (error) {
              this.log(`Failed to comment: ${error.message}`, 'warn');
            }
          }
        } catch (error) {
          this.log(`Error in comment engagement: ${error.message}`, 'warn');
        }
      }

      this.log(`Completed comment engagement: ${commentCount} comments`);
      return commentCount;
    } catch (error) {
      this.log(`Comment engagement error: ${error.message}`, 'error');
      this.activity.errors++;
      return 0;
    }
  }

  /**
   * Run a complete bot session
   */
  async runSession() {
    try {
      this.log('═══════════════════════════════════════');
      this.log('🤖 INSTAGRAM BOT SESSION STARTED');
      this.log('═══════════════════════════════════════');

      const loggedIn = await this.login();
      if (!loggedIn) {
        this.log('Cannot continue without login', 'error');
        return;
      }

      // Run engagement tasks
      await this.likeFromHashtags();
      await this.delay(5000);
      
      await this.commentOnPosts();
      await this.delay(5000);
      
      if (this.config.targetAccounts.length > 0) {
        await this.followFromAccounts();
      }

      this.printSummary();
      this.log('═══════════════════════════════════════');
      this.log('✓ BOT SESSION COMPLETED');
      this.log('═══════════════════════════════════════');
    } catch (error) {
      this.log(`Session error: ${error.message}`, 'error');
      this.activity.errors++;
    }
  }

  /**
   * Print session summary
   */
  printSummary() {
    const duration = (new Date() - this.activity.startTime) / 1000;
    const summary = `
  📊 SESSION SUMMARY
  ├─ ♥ Likes: ${this.activity.likes}
  ├─ 👤 Follows: ${this.activity.follows}
  ├─ 💬 Comments: ${this.activity.comments}
  ├─ ⚠️  Errors: ${this.activity.errors}
  └─ ⏱️  Duration: ${duration.toFixed(2)}s
    `;
    this.log(summary);
  }

  /**
   * Schedule bot to run at intervals
   */
  scheduleDaily(hour = 10, minute = 0) {
    const schedule = require('node-schedule');
    const cronTime = `${minute} ${hour} * * *`; // Run daily at specified time
    
    schedule.scheduleJob(cronTime, () => {
      this.log('📅 Running scheduled bot session');
      this.runSession();
    });

    this.log(`✓ Bot scheduled to run daily at ${hour}:${minute.toString().padStart(2, '0')}`);
  }
}

// ============================================
// USAGE EXAMPLE
// ============================================

async function main() {
  const bot = new InstagramBot({
    username: process.env.IG_USERNAME,
    password: process.env.IG_PASSWORD,
    likesPerSession: 20,
    followsPerSession: 15,
    commentsPerSession: 10,
    targetHashtags: ['trading', 'forex', 'stocks'],
    targetAccounts: ['trader_account_1', 'trader_account_2'],
    commentMessages: [
      'Great analysis! 📈',
      'Love the content! 🔥',
      'Very insightful 💡',
      'This is helpful, thanks! 🙏',
    ],
    delayBetweenActions: 4000, // 4 second delay between actions
  });

  // Run a single session
  await bot.runSession();

  // Uncomment to schedule daily runs:
  // bot.scheduleDaily(10, 0); // Run at 10:00 AM daily
}

// Run if executed directly
if (require.main === module) {
  main().catch(err => console.error('Fatal error:', err));
}

module.exports = InstagramBot;


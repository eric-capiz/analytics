# Analytics API

Backend analytics system for tracking user interactions across web projects.

## Tracking Points

### Time & Duration

- Visit start timestamp
- Last activity timestamp
- Session status

### Traffic Source

- Referrer tracking (how users found the site)
- Direct visits vs external referrals

### User Actions

- Link clicks
- Button interactions
- Navigation changes
- Page transitions

### Error Monitoring

- JavaScript runtime errors
- Failed API requests
- Application errors

## Implementation

Simple integration that requires minimal changes to existing projects. No user notifications required - all tracking is passive and unobtrusive.

### Usage Example

1. Create analytics.js:

```javascript
class Analytics {
  constructor() {
    this.baseUrl = "your_api_url/api/analytics";
    this.sessionId = null;
  }

  async startSession() {
    try {
      const response = await fetch(`${this.baseUrl}/session/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referrer: document.referrer || "Direct",
        }),
      });

      if (!response.ok) return;

      const data = await response.json();
      this.sessionId = data.sessionId;
    } catch {
      // Silently fail
    }
  }

  async trackAction(action) {
    if (!this.sessionId) return;

    try {
      await fetch(`${this.baseUrl}/session/${this.sessionId}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action),
      });
    } catch {
      // Silently fail
    }
  }
}

export default new Analytics();
```

2. Use in your app:

```javascript
import Analytics from './services/analytics';

// Start session
useEffect(() => {
Analytics.startSession();
}, []);

// Track actions
const handleClick = () => {
Analytics.trackAction({
type: 'click',
element: 'button',
text: 'Contact Me',
url: window.location.pathname
});
};

## Note

This system does not collect:

- Personal data
- Location information
- Device details
- Cookies
- Browser information

## Tech Stack

- Node.js
- Express
- MongoDB
- Fly.io (Deployment)
```

// Real-time Presence Tracker for Actual Active Highway Listeners

class HighwayPresenceTracker {
  constructor() {
    this.clientId = 'driver_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    this.channel = null;
    this.onCountChange = null;
    this.heartbeatInterval = null;
    this.isListening = false;
    this.storageKey = 'indian_driver_active_listeners_v1';
  }

  init(onCountChangeCallback) {
    this.onCountChange = onCountChangeCallback;

    // 1. Setup BroadcastChannel for cross-tab realtime sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('indian_driver_highway_presence');
        this.channel.onmessage = (event) => this.handleMessage(event.data);
      } catch (e) {
        console.warn('BroadcastChannel not supported:', e);
      }
    }

    // 2. Sync via localStorage storage events across browser windows
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.storageKey) {
          this.calculateActiveCount();
        }
      });

      // Cleanup on tab close/unload
      window.addEventListener('beforeunload', () => this.leaveSession());
      window.addEventListener('unload', () => this.leaveSession());
    }

    // 3. Heartbeat cycle (runs every 2.5 seconds)
    this.sendHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
      this.pruneStaleListeners();
    }, 2500);
  }

  setListeningState(isPlaying) {
    this.isListening = Boolean(isPlaying);
    this.sendHeartbeat();
  }

  sendHeartbeat() {
    const now = Date.now();
    const activeMap = this.getStorageMap();
    
    activeMap[this.clientId] = {
      timestamp: now,
      isListening: this.isListening
    };

    this.saveStorageMap(activeMap);

    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'HEARTBEAT',
          clientId: this.clientId,
          isListening: this.isListening,
          timestamp: now
        });
      } catch (e) {
        // channel closed
      }
    }

    this.calculateActiveCount();
  }

  leaveSession() {
    const activeMap = this.getStorageMap();
    delete activeMap[this.clientId];
    this.saveStorageMap(activeMap);

    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'LEAVE',
          clientId: this.clientId
        });
        this.channel.close();
      } catch (e) {}
    }
  }

  handleMessage(data) {
    if (!data) return;
    if (data.type === 'HEARTBEAT') {
      const activeMap = this.getStorageMap();
      activeMap[data.clientId] = {
        timestamp: data.timestamp,
        isListening: data.isListening
      };
      this.saveStorageMap(activeMap);
      this.calculateActiveCount();
    } else if (data.type === 'LEAVE') {
      const activeMap = this.getStorageMap();
      delete activeMap[data.clientId];
      this.saveStorageMap(activeMap);
      this.calculateActiveCount();
    }
  }

  pruneStaleListeners() {
    const now = Date.now();
    const activeMap = this.getStorageMap();
    let modified = false;

    Object.keys(activeMap).forEach(id => {
      // Prune inactive sessions older than 7 seconds
      if (now - activeMap[id].timestamp > 7000) {
        delete activeMap[id];
        modified = true;
      }
    });

    if (modified) {
      this.saveStorageMap(activeMap);
      this.calculateActiveCount();
    }
  }

  getStorageMap() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  saveStorageMap(map) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(map));
    } catch {}
  }

  calculateActiveCount() {
    const activeMap = this.getStorageMap();
    const now = Date.now();
    
    // Count sessions active within last 7 seconds
    const activeSessions = Object.values(activeMap).filter(item => (now - item.timestamp) < 7000);
    const count = activeSessions.length;
    
    // Guarantee minimum of 1 for active user session
    const activeCount = Math.max(1, count);
    
    if (this.onCountChange) {
      this.onCountChange(activeCount);
    }
  }
}

export const presenceTracker = new HighwayPresenceTracker();

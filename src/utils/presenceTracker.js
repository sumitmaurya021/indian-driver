// Real-time Global Presence Tracker for Actual Active Highway Listeners
// Syncs across multiple tabs locally AND across different physical devices worldwide

class HighwayPresenceTracker {
  constructor() {
    this.clientId = 'driver_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    this.channel = null;
    this.onCountChange = null;
    this.heartbeatInterval = null;
    this.isListening = false;
    this.storageKey = 'indian_driver_active_listeners_v2';
    this.globalRoomTopic = 'indian_driver_highway_presence_v2';
    this.globalDevicesMap = {};
    this.eventSource = null;
  }

  init(onCountChangeCallback) {
    this.onCountChange = onCountChangeCallback;

    // 1. Setup Local BroadcastChannel (Same Device Multi-Tab)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('indian_driver_highway_presence_v2');
        this.channel.onmessage = (event) => this.handleMessage(event.data);
      } catch (e) {
        console.warn('BroadcastChannel fallback:', e);
      }
    }

    // 2. LocalStorage Event Sync
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.storageKey) {
          this.calculateActiveCount();
        }
      });

      // Cleanup on tab unload
      window.addEventListener('beforeunload', () => this.leaveSession());
      window.addEventListener('unload', () => this.leaveSession());
    }

    // 3. Setup Global Cross-Device Realtime Sync (Server-Sent Events / WebSockets)
    this.connectGlobalPresenceRelay();

    // 4. Heartbeat Cycle (Every 3 seconds)
    this.sendHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
      this.pruneStaleListeners();
    }, 3000);
  }

  connectGlobalPresenceRelay() {
    if (typeof window === 'undefined' || !window.EventSource) return;

    try {
      // Connect to global open real-time presence relay
      this.eventSource = new EventSource(`https://ntfy.sh/${this.globalRoomTopic}/sse`);
      
      this.eventSource.onmessage = (e) => {
        try {
          const raw = JSON.parse(e.data);
          if (raw && raw.message) {
            const payload = JSON.parse(raw.message);
            this.handleGlobalPayload(payload);
          }
        } catch (err) {}
      };

      this.eventSource.onerror = () => {
        // Silent reconnect on network glitch
      };
    } catch (e) {
      console.warn('Global presence relay connection error:', e);
    }
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
    this.globalDevicesMap[this.clientId] = { timestamp: now, isListening: this.isListening };

    // Broadcast locally to tabs
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'HEARTBEAT',
          clientId: this.clientId,
          isListening: this.isListening,
          timestamp: now
        });
      } catch (e) {}
    }

    // Broadcast globally to physical devices via lightweight HTTP POST heartbeat
    try {
      fetch(`https://ntfy.sh/${this.globalRoomTopic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'HEARTBEAT',
          clientId: this.clientId,
          isListening: this.isListening,
          timestamp: now
        }),
        mode: 'cors',
        cache: 'no-cache'
      }).catch(() => {});
    } catch (e) {}

    this.calculateActiveCount();
  }

  leaveSession() {
    const activeMap = this.getStorageMap();
    delete activeMap[this.clientId];
    delete this.globalDevicesMap[this.clientId];
    this.saveStorageMap(activeMap);

    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'LEAVE', clientId: this.clientId });
        this.channel.close();
      } catch (e) {}
    }

    try {
      fetch(`https://ntfy.sh/${this.globalRoomTopic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'LEAVE', clientId: this.clientId }),
        mode: 'cors'
      }).catch(() => {});
    } catch (e) {}

    if (this.eventSource) {
      try { this.eventSource.close(); } catch (e) {}
    }
  }

  handleGlobalPayload(payload) {
    if (!payload || !payload.clientId) return;
    const now = Date.now();

    if (payload.type === 'HEARTBEAT') {
      this.globalDevicesMap[payload.clientId] = {
        timestamp: payload.timestamp || now,
        isListening: payload.isListening
      };
      
      const localMap = this.getStorageMap();
      localMap[payload.clientId] = { timestamp: payload.timestamp || now, isListening: payload.isListening };
      this.saveStorageMap(localMap);

      this.calculateActiveCount();
    } else if (payload.type === 'LEAVE') {
      delete this.globalDevicesMap[payload.clientId];
      const localMap = this.getStorageMap();
      delete localMap[payload.clientId];
      this.saveStorageMap(localMap);

      this.calculateActiveCount();
    }
  }

  handleMessage(data) {
    if (!data) return;
    this.handleGlobalPayload(data);
  }

  pruneStaleListeners() {
    const now = Date.now();
    const activeMap = this.getStorageMap();
    let modified = false;

    // Prune devices that haven't sent a heartbeat in the last 8 seconds
    Object.keys(activeMap).forEach(id => {
      if (now - activeMap[id].timestamp > 8000) {
        delete activeMap[id];
        delete this.globalDevicesMap[id];
        modified = true;
      }
    });

    Object.keys(this.globalDevicesMap).forEach(id => {
      if (now - this.globalDevicesMap[id].timestamp > 8000) {
        delete this.globalDevicesMap[id];
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
    const now = Date.now();
    const activeMap = this.getStorageMap();
    
    // Combine local storage map and global devices map
    const combinedIds = new Set([
      ...Object.keys(activeMap),
      ...Object.keys(this.globalDevicesMap)
    ]);

    let activeCount = 0;
    combinedIds.forEach(id => {
      const item = activeMap[id] || this.globalDevicesMap[id];
      if (item && (now - item.timestamp) < 8000) {
        activeCount++;
      }
    });

    // Guarantee at least 1 for the current session
    const finalCount = Math.max(1, activeCount);

    if (this.onCountChange) {
      this.onCountChange(finalCount);
    }
  }
}

export const presenceTracker = new HighwayPresenceTracker();

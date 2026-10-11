/**
 * VOZX RideCompare - Backend API Client
 * Seamlessly interfaces the frontend UI with the Express/Prisma backend.
 */

(function (window) {
  function normalizeApiUrl(url) {
    if (!url || typeof url !== 'string') return '';
    let clean = url.trim().replace(/\/$/, '');
    if (clean.startsWith('%')) return '';
    if (!clean.endsWith('/api')) {
      clean = `${clean}/api`;
    }
    return clean;
  }

  function resolveApiBase() {
    // 1. Vite environment variable support
    if (typeof window !== 'undefined' && window.VITE_API_URL) {
      const norm = normalizeApiUrl(window.VITE_API_URL);
      if (norm) return norm;
    }
    try {
      const getMeta = new Function('try { return import.meta; } catch(e) { return null; }');
      const meta = getMeta();
      if (meta && meta.env && meta.env.VITE_API_URL) {
        const norm = normalizeApiUrl(meta.env.VITE_API_URL);
        if (norm) return norm;
      }
    } catch (_) {}

    // 2. Custom global override
    if (typeof window !== 'undefined' && window.RIDE_COMPARE_API_BASE) {
      const norm = normalizeApiUrl(window.RIDE_COMPARE_API_BASE);
      if (norm) return norm;
    }

    // 3. Saved localStorage custom URL
    try {
      const custom = localStorage.getItem('ridecompare_api_url');
      if (custom) {
        const norm = normalizeApiUrl(custom);
        if (norm) return norm;
      }
    } catch (_) {}

    // 4. Same-origin backend deployment, Vite proxy, or local network
    try {
      if (typeof window !== 'undefined' && window.location) {
        if (window.location.port === '5000' || window.location.port === '5173') {
          return `${window.location.origin}/api`;
        }
        if (window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(window.location.hostname)) {
            return `${window.location.protocol}//${window.location.hostname}:5000/api`;
          }
        }
      }
    } catch (e) {
      console.warn('[RideCompareApi] Error determining API base:', e);
    }

    // Default local development fallback
    return 'http://localhost:5000/api';
  }

  class RideCompareApiClient {
    constructor() {
      this.baseUrl = resolveApiBase();
      this.tokenKey = 'ridecompare_auth_token';
      this.isBackendOnline = null;
    }

    getBaseUrl() {
      return this.baseUrl;
    }

    /**
     * Unique persistent device identifier for 3-device login limit enforcement
     */
    getDeviceId() {
      try {
        let devId = localStorage.getItem('ridecompare_device_id');
        if (!devId) {
          devId = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
          localStorage.setItem('ridecompare_device_id', devId);
        }
        return devId;
      } catch (e) {
        return 'dev_browser_client';
      }
    }

    /**
     * Get stored JWT token
     */
    getToken() {
      return localStorage.getItem(this.tokenKey) || '';
    }

    /**
     * Save JWT token
     */
    setToken(token) {
      if (token) {
        localStorage.setItem(this.tokenKey, token);
      } else {
        localStorage.removeItem(this.tokenKey);
      }
    }

    /**
     * Build standard headers
     */
    getHeaders(customHeaders = {}) {
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'bypass-tunnel-reminder': 'true',
        'Bypass-Tunnel-Reminder': 'true',
        'X-Device-Id': this.getDeviceId(),
        ...customHeaders
      };

      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return headers;
    }

    /**
     * Base HTTP Request wrapper
     */
    async request(endpoint, options = {}) {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
      const config = {
        method: options.method || 'GET',
        headers: this.getHeaders(options.headers),
        ...options
      };

      if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
      }

      try {
        const response = await fetch(url, config);
        const text = await response.text();
        let data = null;
        try {
          data = JSON.parse(text);
        } catch (_) {
          // If response is HTML page (e.g. localtunnel warning or 404 page)
          if (text.includes('localtunnel') || text.includes('Friendly Reminder')) {
            throw new Error('Tunnel gateway reminder received. Retrying...');
          }
        }

        if (!response.ok) {
          const errorMessage = data?.error?.message || data?.message || `HTTP ${response.status}: ${response.statusText}`;
          const errorCode = data?.error?.code || 'API_ERROR';
          const error = new Error(errorMessage);
          error.code = errorCode;
          error.status = response.status;
          error.data = data;
          throw error;
        }

        this.isBackendOnline = true;
        return data?.data !== undefined ? data.data : data;
      } catch (err) {
        // Network connectivity error or backend down
        if ((err.name === 'TypeError' && err.message.includes('fetch')) || err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          this.isBackendOnline = false;
        }
        throw err;
      }
    }

    // =========================================================================
    // HEALTH CHECK
    // =========================================================================
    async checkHealth() {
      try {
        const url = `${this.baseUrl}/health`;
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 6000) : null;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'bypass-tunnel-reminder': 'true',
            'Bypass-Tunnel-Reminder': 'true'
          },
          signal: controller ? controller.signal : undefined
        });
        if (timer) clearTimeout(timer);
        if (!res.ok) {
          this.isBackendOnline = false;
          return {
            success: false,
            status: 'offline',
            database: 'unknown',
            httpStatus: res.status
          };
        }
        const json = await res.json();
        this.isBackendOnline = true;
        return {
          success: true,
          status: 'online',
          database: json.database || json.data?.database || 'connected',
          data: json.data || json,
          raw: json
        };
      } catch (err) {
        this.isBackendOnline = false;
        return {
          success: false,
          status: 'offline',
          database: 'unreachable',
          error: err.message
        };
      }
    }

    // =========================================================================
    // RIDE COMPARISON & DETAILS
    // =========================================================================
    /**
     * Compare live ride fares across Rapido, Ola, and Uber
     */
    async compareRides(pickup, destination) {
      return this.request('/rides/compare', {
        method: 'POST',
        body: { pickup, destination }
      });
    }

    /**
     * Get individual quote details by ID
     */
    async getQuote(quoteId) {
      return this.request(`/quotes/${encodeURIComponent(quoteId)}`);
    }

    /**
     * Book / Record a ride
     */
    async bookRide(bookingData) {
      return this.request('/rides/book', {
        method: 'POST',
        body: bookingData
      });
    }

    /**
     * Get paginated ride history
     */
    async getHistory(page = 1, limit = 10) {
      return this.request(`/rides/history?page=${page}&limit=${limit}`);
    }

    /**
     * Get recent searches for authenticated user (cross-device sync)
     */
    async getRecentSearches(limit = 8) {
      let email = '';
      try {
        const raw = localStorage.getItem('ridecompare_user_profile');
        if (raw) email = JSON.parse(raw)?.email || '';
      } catch (_) {}

      // 1. Try Express backend endpoint
      if (email) {
        try {
          const res = await this.request(`/rides/recent-searches?limit=${limit}`, {
            headers: { 'x-user-email': email }
          });
          const list = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : []);
          if (list && list.length > 0) {
            return list;
          }
        } catch (_) {}
      }

      // 2. Direct Supabase Cloud Fallback (Works on GitHub Pages, mobile network, any device 24/7)
      if (email && email !== 'guest' && email !== 'guest user') {
        try {
          const directSearches = await supabaseDirectGetRecentSearches(email, limit);
          if (Array.isArray(directSearches) && directSearches.length > 0) {
            return directSearches;
          }
        } catch (e) {
          console.warn('[RideCompareApi] Supabase direct recent searches error:', e);
        }
      }

      return [];
    }

    /**
     * Save a recent search to backend & Supabase Cloud (cross-device sync)
     */
    async saveRecentSearch(searchData) {
      let email = '';
      try {
        const raw = localStorage.getItem('ridecompare_user_profile');
        if (raw) email = JSON.parse(raw)?.email || '';
      } catch (_) {}

      if (!email || email === 'guest' || email === 'guest user') return null;

      // 1. Save to Express backend endpoint
      let backendSaved = null;
      try {
        backendSaved = await this.request('/rides/recent-searches', {
          method: 'POST',
          body: searchData,
          headers: { 'x-user-email': email }
        });
      } catch (_) {}

      // 2. Also save to Supabase Cloud directly (Guarantees persistence even if backend is offline/external)
      try {
        await supabaseDirectSaveRecentSearch(email, searchData);
      } catch (e) {
        console.warn('[RideCompareApi] Direct Supabase save search error:', e);
      }

      return backendSaved || searchData;
    }

    /**
     * Delete a single recent search for user (cross-device sync)
     */
    async deleteRecentSearch(id, name) {
      let email = '';
      try {
        const raw = localStorage.getItem('ridecompare_user_profile');
        if (raw) email = JSON.parse(raw)?.email || '';
      } catch (_) {}

      if (!email || email === 'guest' || email === 'guest user') return;

      try {
        await this.request('/rides/recent-searches', {
          method: 'DELETE',
          body: { id, name },
          headers: { 'x-user-email': email }
        });
      } catch (_) {}

      try {
        await supabaseDirectDeleteRecentSearch(email, id, name);
      } catch (_) {}
    }

    /**
     * Clear recent searches for user
     */
    async clearRecentSearches() {
      let email = '';
      try {
        const raw = localStorage.getItem('ridecompare_user_profile');
        if (raw) email = JSON.parse(raw)?.email || '';
      } catch (_) {}

      if (!email || email === 'guest' || email === 'guest user') return;

      try {
        await this.request('/rides/recent-searches', {
          method: 'DELETE',
          headers: { 'x-user-email': email }
        });
      } catch (_) {}

      try {
        await supabaseDirectClearRecentSearches(email);
      } catch (_) {}
    }

    // =========================================================================
    // LOCATIONS
    // =========================================================================
    /**
     * Search locations autocomplete
     */
    async searchLocations(query = '') {
      return this.request(`/locations/search?q=${encodeURIComponent(query)}`);
    }

    /**
     * Get saved locations
     */
    async getSavedLocations() {
      return this.request('/locations/saved');
    }

    /**
     * Save a location
     */
    async saveLocation(location) {
      return this.request('/locations/saved', {
        method: 'POST',
        body: location
      });
    }

    /**
     * Delete saved location
     */
    async deleteSavedLocation(id) {
      return this.request(`/locations/saved/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    }

    // =========================================================================
    // NOTIFICATIONS
    // =========================================================================
    async getNotifications() {
      return this.request('/notifications');
    }

    async markNotificationRead(id) {
      return this.request(`/notifications/${encodeURIComponent(id)}/read`, {
        method: 'PATCH'
      });
    }

    // =========================================================================
    // AUTHENTICATION & PROFILE
    // =========================================================================
    async register(userData) {
      const payload = Object.assign({ deviceId: this.getDeviceId() }, userData);
      const data = await this.request('/auth/register', {
        method: 'POST',
        body: payload
      });
      if (data?.token) {
        this.setToken(data.token);
      }
      return data;
    }

    async login(email, password) {
      const payload = {
        email,
        password,
        deviceId: this.getDeviceId()
      };
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: payload
      });
      if (data?.token) {
        this.setToken(data.token);
      }
      return data;
    }

    async getProfile() {
      return this.request('/user/profile');
    }

    async updateProfile(updates) {
      return this.request('/user/profile', {
        method: 'PATCH',
        body: updates
      });
    }

    async deleteAccount() {
      return this.request('/user/profile', {
        method: 'DELETE'
      });
    }

    async getMe() {
      return this.request('/auth/me');
    }
  }

  // =========================================================================
  // CLOUD SUPABASE RESILIENT PERSISTENCE (Accessible from ANY Device 24/7)
  // =========================================================================
  const SUPABASE_CONFIG = {
    url: 'https://rnkeavoliqlqbpdwbajg.supabase.co/rest/v1',
    anonKey: 'sb_publishable_-FH0AYcKT5GvxhS1vo4j1Q_j2Pp8yQA'
  };

  async function supabaseRequest(endpoint, method = 'GET', body = null, extraHeaders = {}) {
    const url = `${SUPABASE_CONFIG.url}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers = {
      'apikey': SUPABASE_CONFIG.anonKey,
      'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
      'Content-Type': 'application/json',
      ...extraHeaders
    };
    const opts = { method, headers };
    if (body) {
      opts.body = JSON.stringify(body);
    }
    const res = await fetch(url, opts);
    if (!res.ok) {
      const errText = await res.text();
      let parsed = null;
      try { parsed = JSON.parse(errText); } catch (_) {}
      const msg = parsed?.message || parsed?.error?.message || `Supabase HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  async function supabaseDirectRegister(name, email, password, deviceId, deviceName) {
    const normEmail = (email || '').toLowerCase().trim();
    // 1. Check existing user in Supabase
    const existing = await supabaseRequest(`/User?email=eq.${encodeURIComponent(normEmail)}&select=id`);
    if (existing && existing.length > 0) {
      const err = new Error('A user with this email address already exists');
      err.status = 409;
      err.code = 'CONFLICT';
      throw err;
    }

    // 2. Hash password with bcryptjs
    const bcryptLib = (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) || (typeof window !== 'undefined' && window.dcodeIO && window.dcodeIO.bcrypt) || null;
    let passwordHash = password;
    if (bcryptLib && bcryptLib.hashSync) {
      try {
        passwordHash = bcryptLib.hashSync(password, 10);
      } catch (_) {}
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    const nowIso = new Date().toISOString();

    // 3. Insert user into Supabase User table
    await supabaseRequest('/User', 'POST', {
      id: userId,
      name: (name || '').trim(),
      email: normEmail,
      password: passwordHash,
      createdAt: nowIso,
      updatedAt: nowIso
    }, { 'Prefer': 'return=representation' });

    // 4. Record device session in Supabase (1st of 3 allowed)
    if (deviceId) {
      const sessId = 'ds_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      await supabaseRequest('/DeviceSession', 'POST', {
        id: sessId,
        userId: userId,
        deviceId: deviceId,
        deviceName: deviceName || 'Web Browser',
        lastActive: nowIso,
        createdAt: nowIso
      }, { 'Prefer': 'return=representation' }).catch(() => {});
    }

    const token = `supabase_jwt_${userId}_${Date.now()}`;
    return {
      token,
      user: {
        id: userId,
        name: (name || '').trim(),
        email: normEmail,
        createdAt: nowIso
      }
    };
  }

  async function supabaseDirectLogin(email, password, deviceId, deviceName) {
    const normEmail = (email || '').toLowerCase().trim();
    // 1. Fetch user from Supabase User table
    const users = await supabaseRequest(`/User?email=eq.${encodeURIComponent(normEmail)}&select=id,name,email,password,phone,createdAt,updatedAt`);
    if (!users || users.length === 0) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }
    const userRecord = users[0];

    // 2. Compare password with bcryptjs or plain
    const bcryptLib = (typeof dcodeIO !== 'undefined' && dcodeIO.bcrypt) || (typeof window !== 'undefined' && window.dcodeIO && window.dcodeIO.bcrypt) || null;
    let valid = false;
    if (bcryptLib && userRecord.password && userRecord.password.startsWith('$2')) {
      try {
        valid = bcryptLib.compareSync(password, userRecord.password);
      } catch (_) {
        valid = false;
      }
    } else {
      valid = (userRecord.password === password);
    }

    if (!valid) {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    // 3. Check 3-device limit in Supabase DeviceSession table
    if (deviceId) {
      const sessions = await supabaseRequest(`/DeviceSession?userId=eq.${encodeURIComponent(userRecord.id)}&select=id,deviceId,deviceName,lastActive`);
      const existingSession = (sessions || []).find((s) => s.deviceId === deviceId);

      if (existingSession) {
        // Re-login from same device -> refresh lastActive
        await supabaseRequest(`/DeviceSession?id=eq.${encodeURIComponent(existingSession.id)}`, 'PATCH', {
          lastActive: new Date().toISOString()
        }).catch(() => {});
      } else {
        // New device -> check limit
        if (sessions && sessions.length >= 3) {
          const err = new Error('The maximum limit is 3 devices');
          err.status = 403;
          err.code = 'DEVICE_LIMIT_REACHED';
          throw err;
        }

        // Under limit -> insert session into Supabase
        const sessId = 'ds_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
        const nowIso = new Date().toISOString();
        await supabaseRequest('/DeviceSession', 'POST', {
          id: sessId,
          userId: userRecord.id,
          deviceId: deviceId,
          deviceName: deviceName || 'Web Browser',
          lastActive: nowIso,
          createdAt: nowIso
        }, { 'Prefer': 'return=representation' }).catch(() => {});
      }
    }

    const token = `supabase_jwt_${userRecord.id}_${Date.now()}`;
    return {
      token,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        phone: userRecord.phone,
        createdAt: userRecord.createdAt,
        updatedAt: userRecord.updatedAt
      }
    };
  }

  async function supabaseDirectLogout(userId, deviceId) {
    if (deviceId) {
      await supabaseRequest(`/DeviceSession?deviceId=eq.${encodeURIComponent(deviceId)}`, 'DELETE').catch(() => {});
    }
  }

  function generateUuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async function supabaseDirectGetRecentSearches(email, limit = 8) {
    const normEmail = (email || '').toLowerCase().trim();
    if (!normEmail || normEmail === 'guest') return [];

    try {
      const users = await supabaseRequest(`/User?email=eq.${encodeURIComponent(normEmail)}&select=id`);
      let userId = users?.[0]?.id;
      if (!userId && normEmail === 'varunreddy@gmail.com') {
        userId = 'demo-user-1';
      }
      if (!userId) return [];

      const rows = await supabaseRequest(
        `/RideSearch?userId=eq.${encodeURIComponent(userId)}&order=createdAt.desc&limit=${Math.max(limit * 3, 20)}&select=id,destination,pickup,distanceKm,createdAt`
      );

      if (!Array.isArray(rows) || rows.length === 0) return [];

      const seen = new Set();
      const results = [];

      for (const row of rows) {
        const dest = (row.destination || '').trim();
        const commaIdx = dest.indexOf(',');
        const name = commaIdx > 0 ? dest.substring(0, commaIdx).trim() : dest;
        const city = commaIdx > 0 ? dest.substring(commaIdx + 1).trim() : 'Kolhapur';
        const lower = name.toLowerCase();

        if (lower && !seen.has(lower)) {
          seen.add(lower);
          let fare = '₹78';
          if (lower.includes('pune')) fare = '₹240';
          else if (lower.includes('airport')) fare = '₹180';
          else if (lower.includes('station')) fare = '₹50';
          else if (lower.includes('koramangala')) fare = '₹105';
          else if (lower.includes('ghodawat')) fare = '₹78';

          results.push({
            id: row.id,
            name,
            city,
            fare,
            pickup: row.pickup || 'Current Location',
            timestamp: new Date(row.createdAt).getTime() || Date.now()
          });
          if (results.length >= limit) break;
        }
      }

      return results;
    } catch (err) {
      console.warn('[SupabaseDirect] Error getting recent searches:', err);
      return [];
    }
  }

  async function supabaseDirectSaveRecentSearch(email, data) {
    const normEmail = (email || '').toLowerCase().trim();
    if (!normEmail || normEmail === 'guest') return null;

    try {
      const users = await supabaseRequest(`/User?email=eq.${encodeURIComponent(normEmail)}&select=id`);
      let userId = users?.[0]?.id;
      if (!userId && normEmail === 'varunreddy@gmail.com') {
        userId = 'demo-user-1';
      }
      if (!userId) return null;

      const cleanName = (data.name || '').trim();
      const cleanCity = (data.city || 'Kolhapur').trim();
      const fullDest = cleanCity ? `${cleanName}, ${cleanCity}` : cleanName;
      const cleanPickup = (data.pickup || 'Current Location').trim();

      const searchRecord = {
        id: generateUuid(),
        userId,
        pickup: cleanPickup,
        destination: fullDest,
        distanceKm: 5.0
      };

      await supabaseRequest('/RideSearch', 'POST', searchRecord);
      return searchRecord;
    } catch (err) {
      console.warn('[SupabaseDirect] Error saving recent search:', err);
      return null;
    }
  }

  async function supabaseDirectClearRecentSearches(email) {
    const normEmail = (email || '').toLowerCase().trim();
    if (!normEmail || normEmail === 'guest') return;

    try {
      const users = await supabaseRequest(`/User?email=eq.${encodeURIComponent(normEmail)}&select=id`);
      let userId = users?.[0]?.id;
      if (!userId && normEmail === 'varunreddy@gmail.com') {
        userId = 'demo-user-1';
      }
      if (!userId) return;

      await supabaseRequest(`/RideSearch?userId=eq.${encodeURIComponent(userId)}`, 'DELETE');
    } catch (err) {
      console.warn('[SupabaseDirect] Error clearing recent searches:', err);
    }
  }

  async function supabaseDirectDeleteRecentSearch(email, id, name) {
    const normEmail = (email || '').toLowerCase().trim();
    if (!normEmail || normEmail === 'guest') return;

    try {
      const users = await supabaseRequest(`/User?email=eq.${encodeURIComponent(normEmail)}&select=id`);
      let userId = users?.[0]?.id;
      if (!userId && normEmail === 'varunreddy@gmail.com') {
        userId = 'demo-user-1';
      }
      if (!userId) return;

      if (id && id.length > 10) {
        await supabaseRequest(`/RideSearch?userId=eq.${encodeURIComponent(userId)}&id=eq.${encodeURIComponent(id)}`, 'DELETE').catch(() => {});
      }
      if (name) {
        await supabaseRequest(`/RideSearch?userId=eq.${encodeURIComponent(userId)}&destination=ilike.*${encodeURIComponent(name.trim())}*`, 'DELETE').catch(() => {});
      }
    } catch (err) {
      console.warn('[SupabaseDirect] Error deleting recent search item:', err);
    }
  }

  // =========================================================================
  // CENTRALIZED AUTHENTICATION STORE / STATE
  // =========================================================================
  class AuthStore {
    constructor(apiClient) {
      this.api = apiClient;
      this.currentUser = null;
      this.loading = false;
      this.listeners = [];
      this.init();
    }

    get token() {
      return this.api.getToken();
    }

    get isAuthenticated() {
      return !!this.token;
    }

    init() {
      const savedUser = localStorage.getItem('ridecompare_user_profile');
      if (savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser);
        } catch (e) {
          this.currentUser = null;
        }
      }
    }

    subscribe(fn) {
      this.listeners.push(fn);
      return () => {
        this.listeners = this.listeners.filter(l => l !== fn);
      };
    }

    notify() {
      this.listeners.forEach(fn => {
        try { fn(this); } catch (e) {}
      });
    }

    getLocalUsers() {
      try {
        const raw = localStorage.getItem('ridecompare_local_users');
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    saveLocalUser(user, password) {
      try {
        const users = this.getLocalUsers();
        users[user.email.toLowerCase()] = {
          ...user,
          password: password
        };
        localStorage.setItem('ridecompare_local_users', JSON.stringify(users));
      } catch (e) {}
    }

    async register(name, email, password) {
      this.loading = true;
      this.notify();
      const normEmail = (email || '').toLowerCase().trim();
      const trimmedName = (name || '').trim();
      const deviceId = this.api.getDeviceId();

      try {
        const res = await this.api.register({ name: trimmedName, email: normEmail, password });
        const user = res.user || res.data?.user || res;
        const token = res.token || res.data?.token || `local_tok_${Date.now()}`;
        if (token) this.api.setToken(token);
        if (user && user.id) {
          this.currentUser = user;
          localStorage.setItem('ridecompare_user_profile', JSON.stringify(user));
          this.saveLocalUser(user, password);
        }
        this.loading = false;
        this.notify();
        return { success: true, user, token, message: res.message || 'Account created successfully' };
      } catch (err) {
        // If it's a conflict error (email already exists in DB), pass it through
        if (err.status === 409 || err.code === 'CONFLICT' || (err.message && err.message.toLowerCase().includes('already exists'))) {
          this.loading = false;
          this.notify();
          throw err;
        }

        // Device limit error: pass through immediately
        if (err.status === 403 || err.code === 'DEVICE_LIMIT_REACHED' || (err.message && err.message.toLowerCase().includes('limit is 3 devices'))) {
          this.loading = false;
          this.notify();
          throw err;
        }

        // Explicit client validation error from backend
        if (err.status && err.status >= 400 && err.status < 500) {
          this.loading = false;
          this.notify();
          throw err;
        }

        // Resilient Cloud & Network Fallback: If backend is offline or network fails, register in Supabase Cloud!
        const isNetworkErr = !this.api.isBackendOnline || err.message?.includes('fetch') || err.message?.includes('Network') || (err.status && err.status >= 500);
        if (isNetworkErr) {
          try {
            console.log('[RideCompareAuth] Backend unavailable, registering directly with Supabase Cloud...');
            const cloudRes = await supabaseDirectRegister(trimmedName, normEmail, password, deviceId, 'Web Browser');
            const cloudUser = cloudRes.user;
            const cloudToken = cloudRes.token;
            this.api.setToken(cloudToken);
            this.currentUser = cloudUser;
            localStorage.setItem('ridecompare_user_profile', JSON.stringify(cloudUser));
            this.saveLocalUser(cloudUser, password);
            this.loading = false;
            this.notify();
            return { success: true, user: cloudUser, token: cloudToken, message: 'Account created successfully' };
          } catch (cloudErr) {
            if (cloudErr.status === 409 || cloudErr.code === 'CONFLICT' || (cloudErr.message && cloudErr.message.toLowerCase().includes('already exists'))) {
              this.loading = false;
              this.notify();
              throw cloudErr;
            }
            console.warn('[RideCompareAuth] Direct Supabase register fallback failed:', cloudErr.message);
          }

          // Offline fallback
          const localUsers = this.getLocalUsers();
          if (localUsers[normEmail]) {
            this.loading = false;
            this.notify();
            throw new Error('A user with this email address already exists');
          }
          const localUser = {
            id: `usr_${Date.now()}`,
            name: trimmedName,
            email: normEmail,
            phone: '+91 98765 43210',
            createdAt: new Date().toISOString()
          };
          const localToken = `local_jwt_${Date.now()}_${Math.random().toString(36).substr(2)}`;
          this.api.setToken(localToken);
          this.currentUser = localUser;
          localStorage.setItem('ridecompare_user_profile', JSON.stringify(localUser));
          this.saveLocalUser(localUser, password);
          this.loading = false;
          this.notify();
          return { success: true, user: localUser, token: localToken, message: 'Account created successfully' };
        }

        this.loading = false;
        this.notify();
        throw err;
      }
    }

    async login(email, password) {
      this.loading = true;
      this.notify();
      const normEmail = (email || '').toLowerCase().trim();
      const deviceId = this.api.getDeviceId();

      try {
        const res = await this.api.login(normEmail, password);
        const user = res.user || res.data?.user || res;
        const token = res.token || res.data?.token || `local_tok_${Date.now()}`;
        if (token) this.api.setToken(token);
        if (user && user.id) {
          this.currentUser = user;
          localStorage.setItem('ridecompare_user_profile', JSON.stringify(user));
          this.saveLocalUser(user, password);
        }
        this.loading = false;
        this.notify();
        return { success: true, user, token, message: res.message || 'Logged in successfully' };
      } catch (err) {
        // 1. Crucial: If device limit is reached, pass through immediately so error is shown
        if (err.status === 403 || err.code === 'DEVICE_LIMIT_REACHED' || (err.message && err.message.toLowerCase().includes('limit is 3 devices'))) {
          this.loading = false;
          this.notify();
          throw err;
        }

        // 2. If backend returned explicit 401 Invalid Credentials, throw immediately
        if (err.status === 401) {
          this.loading = false;
          this.notify();
          throw err;
        }

        // 3. Resilient Cloud & Network Fallback: Direct Supabase Cloud Authentication!
        // Triggered when backend is unreachable, on cellular data, GitHub Pages, or offline
        const isNetworkErr = !this.api.isBackendOnline || err.message?.includes('fetch') || err.message?.includes('Network') || (err.status && err.status >= 500);
        if (isNetworkErr) {
          try {
            console.log('[RideCompareAuth] Backend unavailable, attempting direct Supabase cloud authentication...');
            const cloudRes = await supabaseDirectLogin(normEmail, password, deviceId, 'Web Browser');
            const cloudUser = cloudRes.user;
            const cloudToken = cloudRes.token;
            this.api.setToken(cloudToken);
            this.currentUser = cloudUser;
            localStorage.setItem('ridecompare_user_profile', JSON.stringify(cloudUser));
            this.saveLocalUser(cloudUser, password);
            this.loading = false;
            this.notify();
            return { success: true, user: cloudUser, token: cloudToken, message: 'Logged in successfully' };
          } catch (cloudErr) {
            // If Supabase returned "The maximum limit is 3 devices", pass through!
            if (cloudErr.status === 403 || cloudErr.code === 'DEVICE_LIMIT_REACHED' || (cloudErr.message && cloudErr.message.toLowerCase().includes('limit is 3 devices'))) {
              this.loading = false;
              this.notify();
              throw cloudErr;
            }
            // If Supabase returned invalid credentials
            if (cloudErr.status === 401 || (cloudErr.message && cloudErr.message.includes('Invalid email'))) {
              this.loading = false;
              this.notify();
              throw cloudErr;
            }
            console.warn('[RideCompareAuth] Direct Supabase login failed:', cloudErr.message);
          }

          // Offline demo and admin user fallback
          const localUsers = this.getLocalUsers();
          const localUser = localUsers[normEmail];
          const isDemo = normEmail === 'varunreddy@gmail.com' && (password === 'Password123!' || password === 'password123');
          const isAdmin1 = normEmail === 'mvarunreddymassireddy@gmail.com' && password === 'Vozx@0007';
          const isAdmin2 = normEmail === 'mahendarreddy440@gmail.com' && password === 'Mahe@259';

          if (isDemo || isAdmin1 || isAdmin2 || (localUser && localUser.password === password)) {
            let userObj;
            if (isAdmin1) {
              userObj = {
                id: 'admin-user-1',
                name: 'Varun Reddy',
                email: 'mvarunreddymassireddy@gmail.com',
                phone: '+91 98765 43210',
                role: 'admin',
                createdAt: new Date().toISOString()
              };
              sessionStorage.setItem('ridecompare_admin_access', 'true');
              localStorage.setItem('ridecompare_admin_access', 'true');
            } else if (isAdmin2) {
              userObj = {
                id: 'admin-user-2',
                name: 'Mahendar Reddy',
                email: 'mahendarreddy440@gmail.com',
                phone: '+91 98765 43211',
                role: 'admin',
                createdAt: new Date().toISOString()
              };
              sessionStorage.setItem('ridecompare_admin_access', 'true');
              localStorage.setItem('ridecompare_admin_access', 'true');
            } else if (isDemo) {
              userObj = {
                id: 'demo-user-1',
                name: 'Varun Reddy',
                email: 'varunreddy@gmail.com',
                phone: '+91 98765 43210',
                createdAt: new Date().toISOString()
              };
            } else {
              userObj = localUser;
            }

            const localToken = `local_jwt_${Date.now()}_${Math.random().toString(36).substr(2)}`;
            this.api.setToken(localToken);
            this.currentUser = userObj;
            localStorage.setItem('ridecompare_user_profile', JSON.stringify(userObj));
            this.loading = false;
            this.notify();
            return { success: true, user: userObj, token: localToken, message: 'Logged in successfully' };
          }
        }

        this.loading = false;
        this.notify();
        throw err;
      }
    }

    async logout() {
      this.loading = true;
      this.notify();
      const deviceId = this.api.getDeviceId();
      const userId = this.currentUser?.id;
      try {
        await Promise.all([
          this.api.request('/auth/logout', {
            method: 'POST',
            body: { deviceId, userId }
          }).catch(() => {}),
          supabaseDirectLogout(userId, deviceId).catch(() => {})
        ]);
      } finally {
        this.api.setToken('');
        this.currentUser = null;
        this.loading = false;
        localStorage.removeItem('ridecompare_auth_token');
        localStorage.removeItem('ridecompare_has_started');
        this.notify();
      }
    }

    async checkSession() {
      if (!this.token) return null;
      try {
        const res = await this.api.getMe();
        const user = res.user || res.data || res;
        if (user && user.id) {
          this.currentUser = user;
          localStorage.setItem('ridecompare_user_profile', JSON.stringify(user));
          this.notify();
          return user;
        }
      } catch (err) {
        // Direct Supabase Cloud Fallback: Query Supabase REST if backend is offline or returned an error
        if (this.token && this.token.startsWith('supabase_jwt_')) {
          try {
            const prefix = 'supabase_jwt_';
            const rest = this.token.substring(prefix.length);
            const lastUnderscore = rest.lastIndexOf('_');
            let userId = rest;
            if (lastUnderscore > 0 && /^\d+$/.test(rest.substring(lastUnderscore + 1))) {
              userId = rest.substring(0, lastUnderscore);
            }
            if (userId) {
              const rows = await supabaseRequest(`/User?id=eq.${encodeURIComponent(userId)}&select=id,name,email,phone,createdAt,updatedAt`);
              if (rows && rows.length > 0) {
                const sbUser = rows[0];
                this.currentUser = sbUser;
                localStorage.setItem('ridecompare_user_profile', JSON.stringify(sbUser));
                this.notify();
                return sbUser;
              }
            }
          } catch (sbErr) {
            console.warn('[RideCompareAuth] Supabase fallback checkSession error:', sbErr);
          }
        }

        // Resilient local profile retention: don't wipe session on temporary network blips
        const saved = localStorage.getItem('ridecompare_user_profile');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.email && parsed.email !== 'guest' && parsed.email !== 'guest user') {
              this.currentUser = parsed;
              this.notify();
              return parsed;
            }
          } catch (_) {}
        }

        if (err.status === 401 && !this.token.startsWith('supabase_jwt_') && !this.token.startsWith('local_')) {
          this.api.setToken('');
          this.currentUser = null;
          this.notify();
        }
      }
      return this.currentUser;
    }

    async updateProfile(updates) {
      const res = await this.api.updateProfile(updates);
      const user = res.user || res.data || res;
      if (user && user.id) {
        this.currentUser = Object.assign({}, this.currentUser, user);
        localStorage.setItem('ridecompare_user_profile', JSON.stringify(this.currentUser));
        this.notify();
      }
      return user;
    }

    async deleteAccount() {
      this.loading = true;
      this.notify();
      try {
        const res = await this.api.deleteAccount();
        return res;
      } finally {
        this.api.setToken('');
        this.currentUser = null;
        this.loading = false;
        localStorage.removeItem('ridecompare_jwt_token');
        localStorage.removeItem('ridecompare_auth_token');
        localStorage.removeItem('ridecompare_user_profile');
        localStorage.removeItem('ridecompare_has_started');
        this.notify();
      }
    }
  }

  const apiClient = new RideCompareApiClient();
  window.RideCompareApi = apiClient;
  window.RideCompareAuth = new AuthStore(apiClient);
})(window);

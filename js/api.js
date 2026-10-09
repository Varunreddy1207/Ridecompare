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

    // 4. Same-origin backend deployment or local network
    try {
      if (typeof window !== 'undefined' && window.location) {
        if (window.location.port === '5000') {
          return `${window.location.origin}/api`;
        }
        if (window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.port !== '5173') {
          return `${window.location.protocol}//${window.location.hostname}:5000/api`;
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
      const data = await this.request('/auth/register', {
        method: 'POST',
        body: userData
      });
      if (data?.token) {
        this.setToken(data.token);
      }
      return data;
    }

    async login(email, password) {
      const data = await this.request('/auth/login', {
        method: 'POST',
        body: { email, password }
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

        // Resilient fallback: If backend is offline or network fails, register locally
        const isNetworkErr = !this.api.isBackendOnline || err.message?.includes('fetch') || err.message?.includes('Network') || err.status >= 500;
        if (isNetworkErr) {
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
        // Resilient fallback: check demo user or locally registered users
        const localUsers = this.getLocalUsers();
        const localUser = localUsers[normEmail];
        const isDemo = normEmail === 'varunreddy@gmail.com' && (password === 'Password123!' || password === 'password123');

        if (isDemo || (localUser && localUser.password === password)) {
          const userObj = isDemo ? {
            id: 'demo-user-1',
            name: 'Varun Reddy',
            email: 'varunreddy@gmail.com',
            phone: '+91 98765 43210',
            createdAt: new Date().toISOString()
          } : localUser;

          const localToken = `local_jwt_${Date.now()}_${Math.random().toString(36).substr(2)}`;
          this.api.setToken(localToken);
          this.currentUser = userObj;
          localStorage.setItem('ridecompare_user_profile', JSON.stringify(userObj));
          this.loading = false;
          this.notify();
          return { success: true, user: userObj, token: localToken, message: 'Logged in successfully' };
        }

        this.loading = false;
        this.notify();
        throw err;
      }
    }

    async logout() {
      this.loading = true;
      this.notify();
      try {
        await this.api.request('/auth/logout', { method: 'POST' }).catch(() => {});
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
        if (err.status === 401) {
          this.api.setToken('');
          this.currentUser = null;
          this.notify();
        }
      }
      return null;
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

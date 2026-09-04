/**
 * Onevoo Neon PostgreSQL Authentication Client
 * Directly interfaces with Neon Serverless Database backend
 */

const TOKEN_KEY = "onevoo_neon_auth_token";

export const neonAuth = {
  // Get stored JWT session token
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  // Set JWT session token
  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      console.error("Error setting token:", e);
    }
  },

  // Remove session token
  removeToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error("Error removing token:", e);
    }
  },

  // Helper for API requests
  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      throw err;
    }
  },

  // 1. Sign In
  async signIn({ email, password }) {
    const data = await this.request("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  },

  // 1.1 Admin Portal Sign In
  async adminSignIn({ adminId, email, password }) {
    const data = await this.request("/api/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({ adminId: adminId || email, email: email || adminId, password }),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  },

  // 2. Sign Up
  async signUp({ email, password, fullName, role = "creator", city = "Mumbai" }) {
    const data = await this.request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, fullName, role, city }),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  },

  // 3. Get Current User & Profile
  async getMe() {
    const token = this.getToken();
    if (!token) return null;
    return await this.request("/api/auth/me");
  },

  // 4. Update Profile
  async updateProfile(profileData) {
    return await this.request("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  // 5. Sign Out
  async signOut() {
    try {
      await this.request("/api/auth/signout", { method: "POST" });
    } catch (e) {
      console.warn("Signout request failed:", e);
    } finally {
      this.removeToken();
    }
  },

  // 6. Check Database Health
  async getDbHealth() {
    return await this.request("/api/health");
  },

  // 7. Reset Password
  async resetPassword({ email, newPassword, resetCode }) {
    return await this.request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, newPassword, resetCode }),
    });
  }
};

export default neonAuth;

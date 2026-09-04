import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import neonAuth from "../lib/neonAuth";

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  isAuthenticated: false,
  isVerified: false,
  dbStatus: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState(null);

  // Check Neon Database health and restore session
  const checkSession = useCallback(async () => {
    try {
      // 1. Check DB Health
      neonAuth.getDbHealth()
        .then((health) => setDbStatus(health))
        .catch((err) => {
          console.warn("Neon DB healthcheck warning:", err.message);
          setDbStatus({ status: "offline", error: err.message });
        });

      // 2. Restore User from JWT token
      const token = neonAuth.getToken();
      if (!token) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const me = await neonAuth.getMe();
      if (me?.user) {
        setUser(me.user);
        setProfile(me.profile);
      } else {
        neonAuth.removeToken();
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.warn("Session restore failed:", err);
      neonAuth.removeToken();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Sign In with Neon Postgres
  const login = async (email, password) => {
    const data = await neonAuth.signIn({ email, password });
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  // Dedicated Admin Portal Sign In
  const adminLogin = async (adminId, password) => {
    const data = await neonAuth.adminSignIn({ adminId, password });
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  // Sign Up with Neon Postgres
  const signup = async ({ email, password, fullName, city }) => {
    const data = await neonAuth.signUp({ email, password, fullName, city });
    setUser(data.user);
    setProfile(data.profile);
    return data;
  };

  // Sign Out
  const logout = async () => {
    await neonAuth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Update Profile
  const updateProfile = async (profileData) => {
    const data = await neonAuth.updateProfile(profileData);
    const targetAvatar = profileData.avatar_url || profileData.avatarUrl;

    if (data?.user) {
      setUser({ ...data.user });
    } else if (targetAvatar) {
      setUser((prev) => (prev ? { ...prev, avatar_url: targetAvatar } : null));
    }

    if (data?.profile) {
      setProfile({ ...data.profile });
    } else if (targetAvatar) {
      setProfile((prev) => (prev ? { ...prev, avatar_url: targetAvatar } : null));
    }

    return data;
  };

  // Reset / Forgot Password
  const resetPassword = async ({ email, newPassword, resetCode }) => {
    return await neonAuth.resetPassword({ email, newPassword, resetCode });
  };

  const isVerified = user?.verification_status === "approved" || profile?.verification_status === "approved";
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: Boolean(user),
        isVerified,
        isAdmin,
        dbStatus,
        login,
        adminLogin,
        signup,
        logout,
        updateProfile,
        resetPassword,
        refreshUser: checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, hasSupabaseConfig } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setAuthError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.");
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setAuthError(error.message || "Unable to load session.");
      } else {
        setAuthError("");
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, name, username) => {
    if (!hasSupabaseConfig) {
      return { data: null, error: new Error("Supabase credentials are missing. Update your .env file to enable signup.") };
    }

    const trimmedUsername = username?.trim() || null;
    const metadata = { name };
    if (trimmedUsername) {
      metadata.username = trimmedUsername;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (!error && data?.user) {
      try {
        await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            email,
            name,
            username: trimmedUsername,
          })
          .select()
          .single();
      } catch (profileErr) {
        console.error("Error saving profile:", profileErr);
      }
    }
    return { data, error };
  };

  const signIn = async (email, password) => {
    if (!hasSupabaseConfig) {
      return { data: null, error: new Error("Supabase credentials are missing. Update your .env file to enable login.") };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

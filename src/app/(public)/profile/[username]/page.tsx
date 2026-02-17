"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import "styles/profiles.css";
import "styles/themes.css";

interface UserProfile {
  id?: string;
  user_id?: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role?: string | null;
  created_at: string;
  portfolio_value?: number | null;
  is_minor?: boolean;
  parental_consent?: boolean;
  is_public?: boolean;
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const supabase = createClient();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [viewerId, setViewerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark" | null)
      ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setViewerId(user?.id ?? null);

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username.toLowerCase())
        .single();

      if (fetchError || !data) {
        setError("Profile not found");
        setLoading(false);
        return;
      }

      setProfile(data as UserProfile);
      setLoading(false);
    }

    if (username) {
      fetchProfile();
    }
  }, [username, supabase]);

  const profileId = profile?.id ?? profile?.user_id ?? null;
  const isOwner = Boolean(profileId && viewerId && profileId === viewerId);
  const isPublic = profile?.is_public ?? true;
  const hasConsent = !profile?.is_minor || Boolean(profile?.parental_consent);
  const canView = isOwner || (isPublic && hasConsent);

  const privacyMessage = useMemo(() => {
    if (isOwner) return null;
    if (!isPublic) return "This profile is private.";
    if (!hasConsent) return "This profile is unavailable until parental consent is granted.";
    return null;
  }, [hasConsent, isOwner, isPublic]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">404</h1>
          <p className="text-lg">{error || "Profile not found"}</p>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold mb-3">Profile unavailable</h1>
          <p className="text-base">{privacyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-var(--bg) text-var(--text)">
      <button
        className="theme-toggle theme-toggle-fixed"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <span className="theme-icon">{theme === "light" ? "🌙" : "☀️"}</span>
      </button>

      {isOwner && (
        <div className="profile-edit-link">
          <Link href="/profile" className="profile-edit-btn">
            Edit profile
          </Link>
        </div>
      )}

      <div
        className="profile-container"
        style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}
      >
        <div className="profile-header" style={{ textAlign: "center", marginBottom: "40px" }}>
          <div className="avatar-wrapper" style={{ marginBottom: "20px" }}>
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.username}
                width={120}
                height={120}
                className="profile-avatar"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid var(--color-primary-500)",
                }}
              />
            ) : (
              <div
                className="profile-avatar-placeholder"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary-500)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "50px",
                  margin: "0 auto",
                }}
              >
                👤
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold">{profile.full_name ?? "Unnamed"}</h1>
          <p className="text-lg text-gray-500">@{profile.username}</p>

          {profile.role && (
            <span
              className="role-badge"
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor:
                  profile.role === "admin"
                    ? "#ef4444"
                    : profile.role === "creator"
                      ? "#f59e0b"
                      : "#3b82f6",
                color: "white",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {profile.role}
            </span>
          )}
        </div>

        {profile.bio && (
          <div className="profile-bio" style={{ marginBottom: "30px" }}>
            <p className="text-center text-lg">{profile.bio}</p>
          </div>
        )}

        <div
          className="profile-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            className="stat-card"
            style={{
              padding: "20px",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="text-xl font-bold">
              {new Date(profile.created_at).getFullYear()}
            </p>
          </div>
          <div
            className="stat-card"
            style={{
              padding: "20px",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <p className="text-sm text-gray-500">Portfolio Value</p>
            <p className="text-xl font-bold">
              {profile.portfolio_value === null || profile.portfolio_value === undefined
                ? "—"
                : `$${profile.portfolio_value.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

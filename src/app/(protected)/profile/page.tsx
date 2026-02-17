"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AvatarUpload from "@/components/profile/Avatar";
import "styles/profiles.css";
import "styles/themes.css";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  date_of_birth: string | null;
  is_minor: boolean;
  age_verified: boolean;
  parental_consent: boolean;
  learning_level: "beginner" | "intermediate" | "advanced" | null;
  interests: string[];
  onboarding_completed: boolean;
  is_verified_creator: boolean;
  is_suspended: boolean;
  trust_score: number;
  created_at: string;
  updated_at: string;
  last_active_at: string | null;
}

interface Role {
  name: string;
  expires_at: string | null;
}

interface RoleData {
  role: {
    name: string;
  }[];
  expires_at: string | null;
}

type Socials = {
  x?: string;
  instagram?: string;
  github?: string;
  linkedin?: string;
  website?: string;
};

const emptySocials: Required<Socials> = {
  x: "",
  instagram: "",
  github: "",
  linkedin: "",
  website: "",
};

const normalizeSocials = (value: unknown): Required<Socials> => {
  if (!value || typeof value !== "object") {
    return { ...emptySocials };
  }
  const socialData = value as Record<string, unknown>;
  return {
    x: typeof socialData.x === "string" ? socialData.x : "",
    instagram: typeof socialData.instagram === "string" ? socialData.instagram : "",
    github: typeof socialData.github === "string" ? socialData.github : "",
    linkedin: typeof socialData.linkedin === "string" ? socialData.linkedin : "",
    website: typeof socialData.website === "string" ? socialData.website : "",
  };
};

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [profile, setProfile] = useState<(Profile & { socials?: Socials }) | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [formData, setFormData] = useState({
    bio: "",
    learning_level: "",
    interests: [] as string[],
    socials: { ...emptySocials },
  });
  const [newInterest, setNewInterest] = useState("");

  const getIsMinor = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return false;
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age < 18;
  };

  const formatSupabaseError = (error: unknown) => {
    if (!error) return "Unknown error";
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    const maybeError = error as {
      code?: string;
      message?: string;
      details?: string;
      hint?: string;
    };
    return [
      maybeError.code,
      maybeError.message,
      maybeError.details,
      maybeError.hint,
    ]
      .filter(Boolean)
      .join(" | ") || "Unknown error";
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth");
        return;
      }

      const userSocials = normalizeSocials(user.user_metadata?.socials);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        const profileErrorMessage = formatSupabaseError(profileError);
        console.error("Profile select error:", profileErrorMessage, profileError);
        const notFound = profileError.code === "PGRST116"
          || profileError.message?.toLowerCase().includes("0 rows")
          || profileError.message?.toLowerCase().includes("not found");

        if (!notFound) {
          setFetchError(profileErrorMessage);
          return;
        }

        const metadata = user.user_metadata ?? {};
        const rawUsername = typeof metadata.username === "string" ? metadata.username : "";
        const fallbackUsername = user.email?.split("@")[0] || `user_${user.id.slice(0, 8)}`;
        const username = (rawUsername || fallbackUsername).toLowerCase();
        const fullName = typeof metadata.full_name === "string" ? metadata.full_name : null;
        const dateOfBirth = typeof metadata.date_of_birth === "string" ? metadata.date_of_birth : null;
        const isMinor = getIsMinor(dateOfBirth);

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username,
            full_name: fullName,
            date_of_birth: dateOfBirth,
            is_minor: isMinor,
            age_verified: false,
            parental_consent: false,
            onboarding_completed: false,
            is_verified_creator: false,
            is_suspended: false,
            trust_score: 0,
            learning_level: null,
            interests: [],
          })
          .select("*")
          .single();

        if (createError) {
          const createErrorMessage = formatSupabaseError(createError);
          console.error("Profile create error:", createErrorMessage, createError);
          setFetchError(createErrorMessage);
          return;
        }

        setProfile({
          ...createdProfile,
          socials: userSocials,
        });
        setFormData({
          bio: createdProfile.bio || "",
          learning_level: createdProfile.learning_level || "",
          interests: createdProfile.interests || [],
          socials: userSocials,
        });
      } else {
        setProfile({
          ...profileData,
          socials: userSocials,
        });
        setFormData({
          bio: profileData.bio || "",
          learning_level: profileData.learning_level || "",
          interests: profileData.interests || [],
          socials: userSocials,
        });
      }

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role:roles(name), expires_at")
        .eq("user_id", user.id);

      if (rolesError) {
        const rolesErrorMessage = formatSupabaseError(rolesError);
        console.warn("Roles fetch failed:", rolesErrorMessage, rolesError);
        setRoles([]);
        return;
      }
      setRoles((rolesData ?? []).flatMap((r: RoleData) => r.role.map(role => ({
        name: role.name,
        expires_at: r.expires_at,
      }))));
    } catch (error) {
      const message = formatSupabaseError(error);
      console.error("Error fetching profile:", message, error);
      setFetchError(message || "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark")
      || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    // Step 1: Ask for confirmation
    const confirmed = window.confirm(
      "Are you absolutely sure? This will permanently delete your account and all data. This cannot be undone."
    );
    
    if (!confirmed) return; // User canceled
    
    // Step 2: Ask again to be extra safe
    const doubleConfirm = window.confirm(
      "Last chance: Type your username to confirm, or cancel now."
    );
    
    if (!doubleConfirm) return;

    try {
      // Step 3: Call the delete API endpoint
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to delete account: ${error.message || "Unknown error"}`);
        return;
      }

      // Step 4: Sign out the user
      await supabase.auth.signOut();

      // Step 5: Redirect to home page
      alert("Your account has been deleted.");
      router.replace("/");
    } catch (error) {
      console.error("Delete account error:", error);
      alert("An error occurred while deleting your account. Please try again.");
    }
  };

  const buildSocialUrl = (type: keyof Socials, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const handle = trimmed.replace(/^@/, "");
    switch (type) {
      case "x":
        return `https://x.com/${handle}`;
      case "instagram":
        return `https://instagram.com/${handle}`;
      case "github":
        return `https://github.com/${handle}`;
      case "linkedin":
        return `https://www.linkedin.com/in/${handle}`;
      case "website":
        return `https://${handle}`;
      default:
        return null;
    }
  };

  async function handleSave() {
    if (!profile) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          bio: formData.bio,
          learning_level: formData.learning_level || null,
          interests: formData.interests,
        })
        .eq("id", profile.id);

      if (error) throw error;

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          socials: formData.socials,
        },
      });

      if (authError) throw authError;

      setProfile({
        ...profile,
        bio: formData.bio,
        learning_level: (formData.learning_level as "beginner" | "intermediate" | "advanced") || null,
        interests: formData.interests,
        socials: formData.socials,
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your crazzy profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <h2>{fetchError ? "Profile load failed" : "Profile not found"}</h2>
        {fetchError && <p>{fetchError}</p>}
        <button onClick={() => router.push("/")}>Go Home</button>
      </div>
    );
  }

  const roleLabel = roles.length > 0 ? roles.map((role) => role.name).join(", ") : "learner";
  const socialLinks = {
    x: buildSocialUrl("x", profile.socials?.x || ""),
    instagram: buildSocialUrl("instagram", profile.socials?.instagram || ""),
    github: buildSocialUrl("github", profile.socials?.github || ""),
    linkedin: buildSocialUrl("linkedin", profile.socials?.linkedin || ""),
    website: buildSocialUrl("website", profile.socials?.website || ""),
  };

  return (
    <div className="profile-page">
      {/* Background elements */}
      <div className="profile-noise"></div>
      <div className="profile-gradient-sphere"></div>
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="profile-container">
        <div className="profile-hero glass">
          <div className="profile-hero-left">
            <div className="profile-identity">
              <h1 className="profile-username">
                @{profile.username}
                {profile.is_verified_creator && (
                  <span className="verified-badge" title="Verified Creator">✓</span>
                )}
              </h1>
              <p className="profile-fullname">{profile.full_name || "No name set"}</p>
              <p className="profile-role">Role: {roleLabel}</p>
              <div className="profile-badges">
                <span className={`badge age-badge ${profile.is_minor ? "minor" : "adult"}`}>
                  {profile.is_minor ? "Minor" : "Adult"}
                </span>
                {roles.map((role) => (
                  <span key={role.name} className={`badge role-badge ${role.name}`}>
                    {role.name === "admin" && "👑"}
                    {role.name === "creator" && "🎨"}
                    {role.name === "learner" && "📚"}
                    {role.name}
                    {role.expires_at && (
                      <span className="role-expiry">
                        {new Date(role.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <div className="profile-actions">
                {!editMode ? (
                  <div className="edit-actions">
                    <button className="edit-btn" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="cancel-btn" onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="profile-hero-right">
            <div className="hero-avatar-shell">
              <AvatarUpload
                userId={profile.id}
                url={profile.avatar_url}
                onUpload={(url: string) => setProfile({ ...profile, avatar_url: url })}
                size={220} />
            </div>
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-card glass">
            <div className="profile-card-heading">
              <h3>Bio</h3>
              <span className="profile-card-sub">Keep it real.</span>
            </div>
            <div className="profile-field">
              <label>Bio</label>
              {editMode ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  placeholder="Tell us about yourself..." />
              ) : (
                <p className="bio-text">{profile.bio || "No bio yet."}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Full Name</label>
              <p className="profile-readonly">{profile.full_name || "No name set"}</p>
            </div>

            <div className="profile-field">
              <label>Date of Birth</label>
              <p className="dob-text">
                {profile.date_of_birth
                  ? new Date(profile.date_of_birth).toLocaleDateString()
                  : "Not set"}
                {profile.age_verified && (
                  <span className="verified-badge-small" title="Age verified">✓</span>
                )}
                {!profile.age_verified && profile.is_minor && (
                  <span className="consent-badge" title="Parental consent required">
                    Consent {profile.parental_consent ? "given" : "pending"}
                  </span>
                )}
              </p>
            </div>
            <div className="profile-card glass">
              <div className="profile-card-heading">
                <h3>Interests</h3>
                <span className="profile-card-sub">Your vibe map.</span>
              </div>
              <div className="profile-field">
                <label>Interests</label>
                {editMode ? (
                  <div className="interests-edit">
                    <div className="interests-tags">
                      {formData.interests.map((interest) => (
                        <span key={interest} className="interest-tag">
                          {interest}
                          <button onClick={() => removeInterest(interest)}>✕</button>
                        </span>
                      ))}
                    </div>
                    <div className="add-interest">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add interest"
                        onKeyPress={(e) => e.key === "Enter" && addInterest()} />
                      <button onClick={addInterest}>Add</button>
                    </div>
                  </div>
                ) : (
                  <div className="interests-list">
                    {profile.interests?.length > 0 ? (
                      profile.interests.map((interest) => (
                        <span key={interest} className="interest-badge">
                          #{interest}
                        </span>
                      ))
                    ) : (
                      <p className="no-interests">No interests added yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-card glass">
              <div className="profile-card-heading">
                <h3>Socials</h3>
                <span className="profile-card-sub">Handles can be different.</span>
              </div>
              {editMode ? (
                <div className="socials-edit">
                  <div className="social-field">
                    <label>X</label>
                    <input
                      type="text"
                      value={formData.socials.x}
                      onChange={(e) => setFormData({
                        ...formData,
                        socials: { ...formData.socials, x: e.target.value },
                      })}
                      placeholder="@handle or link" />
                  </div>
                  <div className="social-field">
                    <label>Instagram</label>
                    <input
                      type="text"
                      value={formData.socials.instagram}
                      onChange={(e) => setFormData({
                        ...formData,
                        socials: { ...formData.socials, instagram: e.target.value },
                      })}
                      placeholder="@handle or link" />
                  </div>
                  <div className="social-field">
                    <label>GitHub</label>
                    <input
                      type="text"
                      value={formData.socials.github}
                      onChange={(e) => setFormData({
                        ...formData,
                        socials: { ...formData.socials, github: e.target.value },
                      })}
                      placeholder="@handle or link" />
                  </div>
                  <div className="social-field">
                    <label>LinkedIn</label>
                    <input
                      type="text"
                      value={formData.socials.linkedin}
                      onChange={(e) => setFormData({
                        ...formData,
                        socials: { ...formData.socials, linkedin: e.target.value },
                      })}
                      placeholder="handle or link" />
                  </div>
                  <div className="social-field">
                    <label>Website</label>
                    <input
                      type="text"
                      value={formData.socials.website}
                      onChange={(e) => setFormData({
                        ...formData,
                        socials: { ...formData.socials, website: e.target.value },
                      })}
                      placeholder="yourdomain.com" />
                  </div>
                </div>
              ) : (
                <div className="socials-grid">
                  {socialLinks.x && (
                    <a className="social-pill" href={socialLinks.x} target="_blank" rel="noreferrer">
                      X
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a className="social-pill" href={socialLinks.instagram} target="_blank" rel="noreferrer">
                      Instagram
                    </a>
                  )}
                  {socialLinks.github && (
                    <a className="social-pill" href={socialLinks.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a className="social-pill" href={socialLinks.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  )}
                  {socialLinks.website && (
                    <a className="social-pill" href={socialLinks.website} target="_blank" rel="noreferrer">
                      Website
                    </a>
                  )}
                  {!socialLinks.x
                    && !socialLinks.instagram
                    && !socialLinks.github
                    && !socialLinks.linkedin
                    && !socialLinks.website && (
                      <p className="no-socials">No socials yet. Add them.</p>
                    )}
                </div>
              )}
            </div>

            <div className="stats-section glass">
              <h3>Trust Score</h3>
              <div className="trust-ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="ring-bg" />
                  <circle
                    cx="50" cy="50"
                    r="40"
                    className="ring-fill"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 * (1 - profile.trust_score / 100)}`,
                    }} />
                  <text x="50" y="55" textAnchor="middle" className="ring-text">
                    {profile.trust_score}%
                  </text>
                </svg>
              </div>
              <div className="stat-item">
                <span>Member since:</span>
                <strong>{new Date(profile.created_at).toLocaleDateString()}</strong>
              </div>
              {profile.last_active_at && (
                <div className="stat-item">
                  <span>Last active:</span>
                  <strong>{new Date(profile.last_active_at).toLocaleDateString()}</strong>
                </div>
              )}
            </div>

            <div className="profile-achievements glass">
              <h3>Achievements</h3>
              <div className="achievement-placeholder">
                <p>Coming soon - your certificates and course completions will appear here.</p>
              </div>
            </div>

            <div className="creator-cta glass">
              <h3>Creator Mode</h3>
              <p>Want the keys? Apply and show us why you deserve it.</p>
              <a
                className="creator-apply-btn"
                href={`mailto:rudra070311@gmail.com?subject=Creator%20Application%20-%20@${profile.username}`}
              >
                Apply to be a Creator
              </a>
            </div>

            <div className="theme-card glass">
              <h3>Theme</h3>
              <p>Flip the vibe in one tap.</p>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                <span className="theme-icon">{theme === "light" ? "🌙" : "☀️"}</span>
                <span>{theme === "light" ? "Go Dark" : "Go Light"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer - Danger Zone */}
        <div className="profile-footer glass danger-zone">
          <h3 className="danger-title">⚠️ Danger Part</h3>
          <p className="danger-text">
            This permanently deletes your account and all associated data. This action cannot be undone.
          </p>
          <button className="danger-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
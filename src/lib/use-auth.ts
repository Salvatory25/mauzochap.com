import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type Role = "admin" | "manager" | "cashier" | "owner" | "super_admin";
export type Business = Database["public"]["Tables"]["businesses"]["Row"];

interface AuthContextType {
  user: User | null;
  roles: Role[];
  branchId: string | null;
  business: Business | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async (sessionUser: User | null) => {
      if (!sessionUser) {
        if (mounted) {
          setUser(null);
          setRoles([]);
          setBranchId(null);
          setBusiness(null);
          setLoading(false);
        }
        return;
      }

      if (mounted) {
        setUser(sessionUser);
      }

      try {
        const [rolesRes, profileRes] = await Promise.all([
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", sessionUser.id),
          supabase
            .from("profiles")
            .select("branch_id, business_id")
            .eq("id", sessionUser.id)
            .single()
        ]);

        if (!mounted) return;

        const rolesList = (rolesRes.data?.map((r) => r.role) ?? []) as Role[];
        setRoles(rolesList);

        if (profileRes.data) {
          setBranchId(profileRes.data.branch_id);
          if (profileRes.data.business_id) {
            const { data: bData } = await supabase
              .from("businesses")
              .select("*")
              .eq("id", profileRes.data.business_id)
              .single();
            if (mounted && bData) {
              setBusiness(bData);
            }
          }
        }
      } catch (err) {
        console.error("Error loading user roles/profile:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      loadData(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      loadData(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const isSuperAdmin = roles.includes("super_admin");
  const value = {
    user,
    roles,
    branchId,
    business,
    loading,
    isAdmin: roles.includes("admin") || roles.includes("owner") || isSuperAdmin,
    isManager: roles.includes("manager") || roles.includes("admin") || roles.includes("owner") || isSuperAdmin,
    isSuperAdmin,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

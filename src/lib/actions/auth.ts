"use server";

import { createClient } from "@/lib/supabase/server";
import { type Profile } from "@/lib/utils/auth";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(data: LoginInput) {
  const supabase = await createClient();

  // Validate input
  const validatedFields = loginSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }

  const { email, password } = validatedFields.data;

  // Sign in with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function register(data: RegisterInput) {
  const supabase = await createClient();

  // Validate input
  const validatedFields = registerSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }

  const { email, password, fullName, schoolId, role } = validatedFields.data;

  // Sign up with Supabase
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        school_id: schoolId,
        role,
      },
    },
  });

  if (signUpError) {
    return {
      error: signUpError.message,
    };
  }

  // Create profile entry
  if (authData.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      school_id: schoolId,
      role,
    });

    if (profileError) {
      return {
        error: "Failed to create user profile: " + profileError.message,
      };
    }
  }

  // Sign out the user after registration
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login?registered=true");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login?loggedOut=true");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile with role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) {
    return profile;
  }

  // Heal missing profile rows to avoid auth redirect loops.
  const fallbackProfile: Profile = {
    id: user.id,
    email: user.email ?? "",
    full_name:
      (typeof user.user_metadata?.full_name === "string" &&
        user.user_metadata.full_name) ||
      (user.email?.split("@")[0] ?? "User"),
    role:
      user.user_metadata?.role === "admin" ||
      user.user_metadata?.role === "psg_member" ||
      user.user_metadata?.role === "student"
        ? user.user_metadata.role
        : "student",
    school_id:
      typeof user.user_metadata?.school_id === "string"
        ? user.user_metadata.school_id
        : null,
    avatar_url:
      typeof user.user_metadata?.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: createdProfile } = await supabase
    .from("profiles")
    .upsert(fallbackProfile)
    .select("*")
    .single();

  return createdProfile ?? fallbackProfile;
}

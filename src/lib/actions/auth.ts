"use server";

import { createClient } from "@/lib/supabase/server";
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
  redirect("/login");
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

  return profile;
}

import { create } from 'zustand';

import { type Profile } from '@repo/contracts';

import {
  restoreProfile,
  signIn as signInRequest,
  signOut as signOutRequest,
  signUp as signUpRequest,
} from '@/features/auth/api/auth';
import { getSupabaseClient } from '@/shared/lib/supabase';

type Credentials = { email: string; password: string };
type SignUpArgs = Credentials & { displayName: string };
type SignUpResult =
  | { profile: Profile; requiresEmailConfirmation: false }
  | { profile: null; requiresEmailConfirmation: true };

type AuthStore = {
  /** The signed-in admin's profile, or `null` when signed out. */
  profile: Profile | null;
  /** True until the initial session has been restored. */
  isLoading: boolean;
  signIn: (credentials: Credentials) => Promise<Profile>;
  signUp: (args: SignUpArgs) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  profile: null,
  isLoading: true,
  signIn: async (credentials) => {
    const profile = await signInRequest(credentials);
    set({ profile });
    return profile;
  },
  signUp: async (args) => {
    const result = await signUpRequest(args);
    if (!result.requiresEmailConfirmation) set({ profile: result.profile });
    return result;
  },
  signOut: async () => {
    await signOutRequest();
    set({ profile: null });
  },
}));

let initialized = false;

/**
 * Restores the session once and keeps the store in sync with Supabase auth events
 * (sign-out in another tab, expired refresh, etc.). Safe to call more than once —
 * only the first call does the work. Returns an unsubscribe for the auth listener.
 */
export function initializeAuth(): () => void {
  if (initialized) return () => {};
  initialized = true;

  void restoreProfile()
    .then((profile) => useAuthStore.setState({ profile }))
    .catch(() => useAuthStore.setState({ profile: null }))
    .finally(() => useAuthStore.setState({ isLoading: false }));

  const { data } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
    if (!session) useAuthStore.setState({ profile: null });
  });

  return () => data.subscription.unsubscribe();
}

import { profileSchema, type Profile } from '@repo/contracts';

import { api, setAuthToken } from '@/shared/lib/api';
import { getSupabaseClient } from '@/shared/lib/supabase';

export type { Profile };

// Keep the axios bearer token in sync with the Supabase session across sign-in,
// sign-out and silent token refreshes.
getSupabaseClient().auth.onAuthStateChange((_event, session) => {
  setAuthToken(session?.access_token ?? null);
});

type Credentials = {
  email: string;
  password: string;
};

type SignUpCredentials = Credentials & {
  displayName: string;
};

type SignUpResult =
  | { profile: Profile; requiresEmailConfirmation: false }
  | { profile: null; requiresEmailConfirmation: true };

async function syncProfile(): Promise<Profile> {
  const { data } = await api.get('/v1/me');
  return profileSchema.parse(data);
}

export async function signIn(credentials: Credentials): Promise<Profile> {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword(credentials);

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error('No active session was returned by Supabase.');
  }

  setAuthToken(data.session.access_token);
  return syncProfile();
}

export async function signUp({ displayName, email, password }: SignUpCredentials): Promise<SignUpResult> {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.session) {
    return { profile: null, requiresEmailConfirmation: true };
  }

  setAuthToken(data.session.access_token);
  return { profile: await syncProfile(), requiresEmailConfirmation: false };
}

export async function restoreProfile(): Promise<Profile | null> {
  const { data, error } = await getSupabaseClient().auth.getSession();

  if (error) {
    throw error;
  }

  if (!data.session) {
    return null;
  }

  setAuthToken(data.session.access_token);
  return syncProfile();
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut();

  if (error) {
    throw error;
  }
}

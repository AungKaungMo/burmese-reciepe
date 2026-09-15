import { ChefHat, Moon, Sun } from 'lucide-react';
import { useEffect, useState, type ComponentProps, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/auth-store';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

type AuthMode = 'login' | 'signup';

export function AuthPage() {
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: Location } | null)?.from?.pathname ?? '/';

  const [mode, setMode] = useState<AuthMode>('login');
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  function selectMode(nextMode: AuthMode) {
    setMode(nextMode);
    setNotice('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    if (mode === 'signup' && form.get('password') !== form.get('confirmPassword')) {
      setNotice('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setNotice('');

    try {
      if (mode === 'login') {
        await signIn({ email, password });
        navigate(redirectTo, { replace: true });
      } else {
        const result = await signUp({
          displayName: String(form.get('name') ?? ''),
          email,
          password,
        });

        if (result.requiresEmailConfirmation) {
          setNotice('Check your email to confirm your account, then log in.');
          setMode('login');
        } else {
          navigate(redirectTo, { replace: true });
        }
      }
    } catch (error) {
      setNotice(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-foreground">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ChefHat className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-medium text-primary">Burmese Recipe</span>
              <span className="block text-lg font-semibold tracking-tight">Admin</span>
            </span>
          </div>
          <Button
            aria-label="Toggle color theme"
            variant="outline"
            size="icon"
            onClick={() => setDark((current) => !current)}
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">{mode === 'login' ? 'Welcome back' : 'Create your account'}</CardTitle>
            <CardDescription>
              {mode === 'login'
                ? 'Sign in to manage Burmese Recipe.'
                : 'Create an admin account to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 rounded-lg bg-muted p-1" role="tablist" aria-label="Authentication mode">
              <Button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                variant={mode === 'login' ? 'secondary' : 'ghost'}
                className={mode === 'login' ? 'w-full bg-card shadow-sm hover:bg-card' : 'w-full bg-transparent'}
                onClick={() => selectMode('login')}
              >
                Log in
              </Button>
              <Button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                variant={mode === 'signup' ? 'secondary' : 'ghost'}
                className={mode === 'signup' ? 'w-full bg-card shadow-sm hover:bg-card' : 'w-full bg-transparent'}
                onClick={() => selectMode('signup')}
              >
                Sign up
              </Button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <Field label="Full name" name="name" autoComplete="name" placeholder="Aye Aye" required />
              )}
              <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
              <Field label="Password" name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />
              {mode === 'signup' && (
                <Field label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" required />
              )}

              {notice && (
                <p className="rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground" role="status">
                  {notice}
                </p>
              )}

              <Button className="mt-2 w-full" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

type FieldProps = {
  label: string;
  name: string;
  type?: ComponentProps<typeof Input>['type'];
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
};

function Field({ label, name, type = 'text', autoComplete, placeholder, required }: FieldProps) {
  const id = `auth-${name}`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <Input id={id} name={name} type={type} autoComplete={autoComplete} placeholder={placeholder} required={required} />
    </div>
  );
}

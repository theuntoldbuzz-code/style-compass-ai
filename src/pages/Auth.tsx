import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, User, ArrowLeft, Chrome } from 'lucide-react';
import fashionAuth from '@/assets/fashion-6.avif';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');

type AuthStep = 'email' | 'otp';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [step, setStep] = useState<AuthStep>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
    } catch {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    if (!isLogin && !fullName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your full name',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // For login, use Supabase's native OTP authentication
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
          }
        });
        
        if (error) {
          if (error.message.includes('User not found') || error.message.includes('Signups not allowed')) {
            toast({
              title: 'Account Not Found',
              description: 'No account exists with this email. Please sign up first.',
              variant: 'destructive',
            });
            setIsLogin(false);
          } else {
            throw error;
          }
        } else {
          setStep('otp');
          toast({
            title: 'Check Your Email',
            description: `We've sent a magic link to ${email}. Click it to sign in.`,
          });
        }
      } else {
        // For signup, use Supabase's native OTP with user creation
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            data: {
              full_name: fullName,
            }
          }
        });
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Account Exists',
              description: 'This email is already registered. Please log in instead.',
              variant: 'destructive',
            });
            setIsLogin(true);
          } else {
            throw error;
          }
        } else {
          setStep('otp');
          toast({
            title: 'Check Your Email',
            description: `We've sent a magic link to ${email}. Click it to complete signup.`,
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send verification email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: !isLogin,
          data: isLogin ? undefined : { full_name: fullName },
        }
      });
      
      if (error) {
        throw error;
      }

      toast({
        title: 'Email Resent',
        description: `A new magic link has been sent to ${email}`,
      });
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        title: 'Error',
        description: 'Failed to resend email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold animate-pulse">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          variant="ghost"
          onClick={() => {
            if (step === 'otp') {
              setStep('email');
            } else {
              navigate('/');
            }
          }}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        {/* Fashion Side Image - Hidden on mobile */}
        <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-1/2">
          <img 
            src={fashionAuth} 
            alt="Fashion inspiration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30" />
        </div>
        
        <div className="w-full max-w-md lg:ml-auto lg:mr-[10%]">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-serif text-3xl text-foreground">
                <span className="text-gradient-gold">Aurion</span> AI
              </span>
            </div>
            <h1 className="font-serif text-2xl text-foreground mb-2">
              {step === 'email' 
                ? (isLogin ? 'Welcome Back' : 'Create Account')
                : 'Check Your Email'
              }
            </h1>
            <p className="text-muted-foreground">
              {step === 'email'
                ? (isLogin
                    ? 'Sign in to access your virtual closet'
                    : 'Join Aurion AI and discover your perfect style')
                : `We've sent a magic link to ${email}. Click it to continue.`
              }
            </p>
          </div>

          {/* Auth Card */}
          <div className="luxury-card p-8">
            {step === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                {/* Full Name (Sign Up Only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 luxury-input"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 luxury-input"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="luxury"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending link...
                    </span>
                  ) : (
                    'Continue with Email'
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6 text-center">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <Mail className="w-12 h-12 mx-auto text-primary mb-3" />
                  <p className="text-foreground font-medium">Check your inbox</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click the magic link we sent to complete {isLogin ? 'sign in' : 'sign up'}.
                  </p>
                </div>

                {/* Resend Email */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={isSubmitting}
                    className="text-primary hover:underline text-sm disabled:opacity-50"
                  >
                    Didn't receive the email? Resend
                  </button>
                </div>
              </div>
            )}

            {step === 'email' && (
              <>
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={async () => {
                    const { error } = await signInWithGoogle();
                    if (error) {
                      toast({
                        title: 'Google Sign In Failed',
                        description: error.message,
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  <Chrome className="w-5 h-5" />
                  Continue with Google
                </Button>

                {/* Toggle Auth Mode */}
                <p className="text-center text-muted-foreground mt-6">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

import { useEffect, useRef, useState } from 'react';
import { Apple, Chrome, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { configService, SocialProviderConfig } from '@/lib/configService';

interface SocialAuthButtonsProps {
  disabled?: boolean;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const spinner = (
  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
);

export function SocialAuthButtons({ disabled = false, onSuccess, onError }: SocialAuthButtonsProps) {
  const { googleLogin, appleLogin, facebookLogin } = useAuth();
  const [config, setConfig] = useState<SocialProviderConfig | null>(null);
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [isGsiReady, setIsGsiReady] = useState(false);
  const [isAppleReady, setIsAppleReady] = useState(false);
  const [isFacebookReady, setIsFacebookReady] = useState(false);
  const googleInitialized = useRef(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await configService.getPublicConfig();
        if (isMounted) {
          setConfig(response);
        }
      } catch (error) {
        console.error('Failed to load social login config', error);
        if (isMounted) {
          onError('Unable to load social login configuration.');
        }
      } finally {
        if (isMounted) {
          setIsConfigLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [onError]);

  useEffect(() => {
    googleInitialized.current = false;
  }, [config?.google?.clientId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!config?.google?.enabled || !config.google.clientId) {
      setIsGsiReady(false);
      return;
    }

    const existing = document.getElementById('google-gsi-script');
    if (existing) {
      setIsGsiReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGsiReady(true);
    script.onerror = () => onError('Google sign-in could not load. Please retry.');
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [config?.google?.enabled, config?.google?.clientId, onError]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!config?.apple?.enabled || !config.apple.clientId || !config.apple.redirectURI) {
      setIsAppleReady(false);
      return;
    }

    const initApple = () => {
      try {
        window.AppleID?.auth?.init({
          clientId: config.apple.clientId,
          scope: config.apple.scopes || 'name email',
          redirectURI: config.apple.redirectURI,
          usePopup: true
        });
        setIsAppleReady(true);
      } catch (error) {
        console.error('Apple init error', error);
        onError('Apple sign-in could not initialize. Please retry.');
      }
    };

    const existing = document.getElementById('apple-signin-sdk');
    if (existing) {
      initApple();
      return;
    }

    const script = document.createElement('script');
    script.id = 'apple-signin-sdk';
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.onload = initApple;
    script.onerror = () => onError('Apple sign-in could not load. Please retry.');
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [config?.apple?.enabled, config?.apple?.clientId, config?.apple?.redirectURI, config?.apple?.scopes, onError]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!config?.facebook?.enabled || !config.facebook.appId) {
      setIsFacebookReady(false);
      return;
    }

    const initFacebook = () => {
      if (!window.FB) return;
      window.FB.init({
        appId: config.facebook.appId,
        cookie: true,
        xfbml: false,
        version: config.facebook.version || 'v19.0'
      });
      setIsFacebookReady(true);
    };

    window.fbAsyncInit = initFacebook;

    const existing = document.getElementById('facebook-jssdk');
    if (existing) {
      initFacebook();
      return () => {
        window.fbAsyncInit = undefined;
      };
    }

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onerror = () => onError('Facebook sign-in could not load. Please retry.');
    document.body.appendChild(script);

    return () => {
      window.fbAsyncInit = undefined;
    };
  }, [config?.facebook?.enabled, config?.facebook?.appId, config?.facebook?.version, onError]);

  const handleGoogleCredential = async (response: any) => {
    try {
      // In development, use mock token for testing
      const credential = import.meta.env.DEV ? 'mock-google-token' : response?.credential;
      if (!credential) {
        throw new Error('Google sign-in returned no credential');
      }
      await googleLogin(credential);
      onError('');
      onSuccess();
    } catch (error: any) {
      const message = error?.response?.data?.error || error.message || 'Google sign-in failed';
      onError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const startGoogleSignIn = () => {
    if (!config?.google?.enabled || !config.google.clientId) {
      onError('Google login is not configured yet.');
      return;
    }

    if (!window.google?.accounts?.id || !isGsiReady) {
      onError('Google sign-in is still loading. Please try again.');
      return;
    }

    if (!googleInitialized.current) {
      window.google.accounts.id.initialize({
        client_id: config.google.clientId,
        callback: handleGoogleCredential
      });
      googleInitialized.current = true;
    }

    setIsGoogleLoading(true);

    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
        setIsGoogleLoading(false);
        onError('Google sign-in was closed or blocked.');
      }
    });
  };

  const startAppleSignIn = async () => {
    if (!config?.apple?.enabled) {
      onError('Apple login is not configured yet.');
      return;
    }

    // In development mode, use mock token directly
    if (import.meta.env.DEV) {
      setIsAppleLoading(true);
      try {
        await appleLogin('mock-apple-token', 'Test Apple User');
        onError('');
        onSuccess();
      } catch (error: any) {
        const message = error?.response?.data?.error || error.message || 'Apple sign-in failed';
        onError(message);
      } finally {
        setIsAppleLoading(false);
      }
      return;
    }

    if (!window.AppleID?.auth || !isAppleReady) {
      onError('Apple sign-in is still loading. Please try again.');
      return;
    }

    setIsAppleLoading(true);

    try {
      const response = await window.AppleID.auth.signIn();
      const idToken = response?.authorization?.id_token;
      const nameInfo = response?.user?.name;
      const nameFromApple = nameInfo
        ? [nameInfo.firstName, nameInfo.lastName].filter(Boolean).join(' ').trim()
        : undefined;

      if (!idToken) {
        throw new Error('Apple sign-in returned no token');
      }

      await appleLogin(idToken, nameFromApple);
      onError('');
      onSuccess();
    } catch (error: any) {
      const message = error?.error === 'popup_closed_by_user'
        ? 'Apple sign-in was cancelled.'
        : error?.response?.data?.error || error.message || 'Apple sign-in failed';
      onError(message);
    } finally {
      setIsAppleLoading(false);
    }
  };

  const startFacebookSignIn = () => {
    if (!config?.facebook?.enabled) {
      onError('Facebook login is not configured yet.');
      return;
    }

    // In development mode, use mock token directly
    if (import.meta.env.DEV) {
      setIsFacebookLoading(true);
      (async () => {
        try {
          await facebookLogin('mock-facebook-token');
          onError('');
          onSuccess();
        } catch (error: any) {
          const message = error?.response?.data?.error || error.message || 'Facebook sign-in failed';
          onError(message);
        } finally {
          setIsFacebookLoading(false);
        }
      })();
      return;
    }

    if (!window.FB || !isFacebookReady) {
      onError('Facebook sign-in is still loading. Please try again.');
      return;
    }

    setIsFacebookLoading(true);

    window.FB.login(async (response: any) => {
      if (response?.authResponse?.accessToken) {
        try {
          await facebookLogin(response.authResponse.accessToken);
          onError('');
          onSuccess();
        } catch (error: any) {
          const message = error?.response?.data?.error || error.message || 'Facebook sign-in failed';
          onError(message);
        } finally {
          setIsFacebookLoading(false);
        }
      } else {
        setIsFacebookLoading(false);
        onError('Facebook sign-in was cancelled.');
      }
    }, { scope: 'email' });
  };

  const appleDisabled = disabled || isConfigLoading || !config?.apple?.enabled || !isAppleReady || isAppleLoading;
  const facebookDisabled = disabled || isConfigLoading || !config?.facebook?.enabled || !isFacebookReady || isFacebookLoading;
  const googleDisabled = disabled || isConfigLoading || !config?.google?.enabled || !config.google.clientId || isGoogleLoading;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-3">
        <Button type="button" variant="outline" className="h-11" onClick={startAppleSignIn} disabled={appleDisabled}>
          {isAppleLoading ? spinner : <Apple className="w-5 h-5" />}
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={startFacebookSignIn} disabled={facebookDisabled}>
          {isFacebookLoading ? spinner : <Facebook className="w-5 h-5" />}
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={startGoogleSignIn} disabled={googleDisabled}>
          {isGoogleLoading ? spinner : <Chrome className="w-5 h-5 text-accent" />}
        </Button>
      </div>
      {!isConfigLoading && (!config?.google?.enabled || !config?.apple?.enabled || !config?.facebook?.enabled) && (
        <p className="text-xs text-muted-foreground text-center">
          Configure all social providers in the .env file to unlock every button.
        </p>
      )}
    </div>
  );
}

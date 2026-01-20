import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LoginRegisterModalProps {
  triggerSource?: 'auto' | 'feature-click'; // 'auto' = timer, 'feature-click' = user action
}

export default function LoginRegisterModal({ triggerSource = 'auto' }: LoginRegisterModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Auto-show modal after 5 seconds on page load (only if not authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      setIsVisible(false);
      return;
    }

    if (triggerSource === 'auto') {
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Trigger animation after a tiny delay to ensure render
        setTimeout(() => setShowAnimation(true), 10);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [triggerSource, isAuthenticated]);

  const handleClose = () => {
    setShowAnimation(false);
    setTimeout(() => setIsVisible(false), 300); // Wait for animation
  };

  const handleLoginClick = () => {
    handleClose();
    navigate('/login');
  };

  const handleRegisterClick = () => {
    handleClose();
    navigate('/register');
  };

  if (!isVisible || isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          showAnimation ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Escape' && handleClose()}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          showAnimation
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0'
        }`}
      >
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white">Welcome!</h2>
                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-slate-400 text-sm">Sign in to unlock more features</p>
            </div>

            {/* Content */}
            <div className="px-6 py-6 bg-gradient-to-b from-slate-800/50 to-slate-900/50">
              <p className="text-slate-300 text-center mb-6">
                Join thousands of creatives and businesses using our services.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleLoginClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <LogIn size={20} className="group-hover:scale-110 transition-transform" />
                  Login to Account
                </Button>

                <Button
                  onClick={handleRegisterClick}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                  Create New Account
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-slate-500 text-sm">or</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {/* Continue Browsing */}
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors text-sm"
              >
                Continue Browsing
              </button>
            </div>

            {/* Footer Info */}
            <div className="px-6 py-3 bg-slate-900/50 border-t border-slate-700">
              <p className="text-xs text-slate-500 text-center">
                You can browse our website freely. Chatbot and advanced features require login.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

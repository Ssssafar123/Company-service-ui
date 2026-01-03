import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import {
  Box,
  Card,
  Flex,
  Text,
  TextField,
  Button,
  Container,
  Heading,
  Separator,
  Link,
} from '@radix-ui/themes';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(getApiUrl('login'), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Store user info and modules in localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.user.role && data.user.role.modules) {
            localStorage.setItem('userModules', JSON.stringify(data.user.role.modules));
          }
        }
        
        setUsername('');
        setPassword('');
        navigate("/dashboard");
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="1" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--accent-3) 0%, var(--accent-5) 100%)',
      padding: '20px'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid var(--accent-6)'
      }}>
        {/* Header */}
        <Flex direction="column" gap="4" align="center" style={{ marginBottom: '32px' }}>
          <Box style={{ 
            width: '100%', 
            height: '48px', 
            borderRadius: '12px',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Playfair Display', 'Georgia', serif",
            border: '2px solid var(--accent-9)',
            background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent-3) 100%)'
          }}>
            <Text 
              weight="bold" 
              style={{ 
                background: 'linear-gradient(135deg, var(--accent-11) 0%, var(--accent-9) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '18px',
                letterSpacing: '0.02em'
              }}
            >
              Safar Wanderlust
            </Text>
          </Box>
          
          <Flex direction="column" gap="1" align="center">
            <Heading size="5" weight="bold" style={{ color: 'var(--accent-12)' }}>
              Welcome Back 
            </Heading>
            <Text size="2" style={{ color: 'var(--accent-11)', textAlign: 'center' }}>
              Sign in to your account to continue
            </Text>
          </Flex>
        </Flex>

        {/* Error Message */}
        {error && (
          <Box
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--red-3)',
              border: '1px solid var(--red-6)',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            <Text size="2" style={{ color: 'var(--red-11)' }}>
              {error}
            </Text>
          </Box>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <Flex direction="column" gap="4">
            {/* Username Field */}
            <Flex direction="column" gap="2">
              <Text as="label" size="2" weight="medium" style={{ color: 'var(--accent-12)' }}>
                Username *
              </Text>
              <TextField.Root
                size="3"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ 
                  padding: '12px 16px',
                  borderRadius: '8px'
                }}
              >
                <TextField.Slot>
                  <UserIcon />
                </TextField.Slot>
              </TextField.Root>
            </Flex>

            {/* Password Field */}
            <Flex direction="column" gap="2">
              <Text as="label" size="2" weight="medium" style={{ color: 'var(--accent-12)' }}>
                Password *
              </Text>
              <TextField.Root
                size="3"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  padding: '12px 16px',
                  borderRadius: '8px'
                }}
              >
                <TextField.Slot>
                  <LockIcon />
                </TextField.Slot>
              </TextField.Root>
            </Flex>

            {/* Forgot Password */}
            <Flex justify="end" align="center">
              <Link size="2" style={{ color: 'var(--accent-11)', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </Flex>

            {/* Submit Button */}
            <Button 
              size="3" 
              type="submit" 
              disabled={isLoading}
              style={{ 
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                background: isLoading ? 'var(--accent-8)' : 'var(--accent-9)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '8px'
              }}
            >
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Spinner />
                  Signing in...
                </Flex>
              ) : (
                'Sign in to your account'
              )}
            </Button>
          </Flex>
        </form>

        {/* Separator */}
        <Flex align="center" gap="4" style={{ margin: '24px 0' }}>
          <Separator style={{ flex: 1 }} />
          <Text size="1" style={{ color: 'var(--accent-11)' }}>OR</Text>
          <Separator style={{ flex: 1 }} />
        </Flex>

        {/* Footer */}
        <Flex justify="center" style={{ marginTop: '24px' }}>
          <Text size="2" style={{ color: 'var(--accent-11)' }}>
            Don't have an account?{' '}
            <Link 
              size="2" 
              weight="medium" 
              style={{ 
                color: 'var(--accent-12)', 
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              Sign up
            </Link>
          </Text>
        </Flex>
      </Card>
    </Container>
  );
};

// Icon Components
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="var(--accent-11)" strokeWidth="1.5"/>
    <path d="M14 14C14 12.3431 12.6569 11 11 11H5C3.34315 11 2 12.3431 2 14V15H14V14Z" stroke="var(--accent-11)" strokeWidth="1.5"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="7" width="10" height="8" rx="2" stroke="var(--accent-11)" strokeWidth="1.5"/>
    <path d="M5 7V5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5V7" stroke="var(--accent-11)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 11V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default Login;

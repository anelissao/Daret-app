import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[100px]" />
            </div>

            <Card className="w-full max-w-md relative z-10 glass-card border-white/10">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl">Welcome Back</CardTitle>
                    <p className="text-muted-foreground">Sign in to your premium account</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                type="email"
                                placeholder="Email address"
                                icon={Mail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-black/20 border-white/5 focus:border-primary/50"
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                icon={Lock}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-black/20 border-white/5 focus:border-primary/50"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                            isLoading={isLoading}
                        >
                            Sign In
                        </Button>

                        <div className="text-center text-sm text-muted-foreground pt-2">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary hover:text-primary/80 font-medium hover:underline">
                                Create one
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;

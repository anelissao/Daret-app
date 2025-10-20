import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsLoading(true);

        try {
            await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-8">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[10%] left-[20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            <Card className="w-full max-w-lg relative z-10 glass-card border-white/10">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl">Create Account</CardTitle>
                    <p className="text-muted-foreground">Join the exclusive Daret community</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="firstName"
                                placeholder="First Name"
                                icon={User}
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="bg-black/20"
                            />
                            <Input
                                name="lastName"
                                placeholder="Last Name"
                                icon={User}
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="bg-black/20"
                            />
                        </div>

                        <Input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            icon={Mail}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-black/20"
                        />

                        <Input
                            name="phone"
                            type="tel"
                            placeholder="Phone number"
                            icon={Phone}
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="bg-black/20"
                        />

                        <div className="space-y-4">
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                icon={Lock}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="bg-black/20"
                            />
                            <Input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                icon={Lock}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="bg-black/20"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity mt-6"
                            isLoading={isLoading}
                        >
                            Get Started
                        </Button>

                        <div className="text-center text-sm text-muted-foreground pt-2">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:text-primary/80 font-medium hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;

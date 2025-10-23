import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Wallet, Users, AlertCircle } from 'lucide-react';
import ReliabilityGauge from '@/components/dashboard/ReliabilityGauge';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

const Dashboard = () => {
    const { user } = useAuth();

    // Mock data for display (later fetched from API)
    const stats = [
        { label: 'Total Saved', value: 15000, icon: Wallet, color: 'text-violet-400' },
        { label: 'Active Groups', value: 2, icon: Users, color: 'text-blue-400' },
        { label: 'Next Payment', value: 1000, context: 'Due in 5 days', icon: AlertCircle, color: 'text-yellow-400' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Hello, <span className="gradient-text">{user?.firstName}</span>
                    </h1>
                    <p className="text-muted-foreground">Here is your financial overview for today.</p>
                </div>
                <Link to="/groups/create">
                    <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" />
                        New Group
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="glass-card hover:bg-white/5 transition-colors border-white/5">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                    <h3 className="text-2xl font-bold mt-1">
                                        {typeof stat.value === 'number' && stat.label !== 'Active Groups'
                                            ? formatCurrency(stat.value)
                                            : stat.value}
                                    </h3>
                                    {stat.context && (
                                        <p className="text-xs text-yellow-500 mt-1">{stat.context}</p>
                                    )}
                                </div>
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Reliability Score */}
                <Card className="md:col-span-1 glass-card border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Reliability Score</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center py-6">
                        <ReliabilityGauge score={user?.reliabilityScore || 100} />
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="md:col-span-2 glass-card border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Your Active Groups</CardTitle>
                        <Button variant="link" className="text-primary p-0 h-auto">
                            View All <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-10 text-muted-foreground bg-black/20 rounded-lg border border-white/5">
                            <Users className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            <p>You haven't joined any groups yet.</p>
                            <Link to="/groups">
                                <Button variant="outline" className="mt-4 border-primary/20 hover:bg-primary/10">Browse Groups</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle, Upload, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

const ContributionsList = () => {
    const [contributions, setContributions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchContributions();
    }, []);

    const fetchContributions = async () => {
        try {
            const response = await axios.get('/contributions/my-contributions');
            setContributions(response.data.data);
        } catch (error) {
            console.error('Failed to fetch contributions', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white gradient-text">My Contributions</h1>
                <p className="text-muted-foreground">Track your payments and history</p>
            </div>

            <Card className="glass-card border-white/5">
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="p-4 font-medium text-muted-foreground">Group</th>
                                    <th className="p-4 font-medium text-muted-foreground">Round</th>
                                    <th className="p-4 font-medium text-muted-foreground">Amount</th>
                                    <th className="p-4 font-medium text-muted-foreground">Due Date</th>
                                    <th className="p-4 font-medium text-muted-foreground">Status</th>
                                    <th className="p-4 font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contributions.map((contribution) => (
                                    <tr key={contribution._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">{contribution.group?.name}</td>
                                        <td className="p-4">Round {contribution.round}</td>
                                        <td className="p-4 font-bold">{formatCurrency(contribution.amount)}</td>
                                        <td className="p-4 text-sm text-muted-foreground">{formatDate(contribution.dueDate)}</td>
                                        <td className="p-4">
                                            {contribution.status === 'paid' && (
                                                <span className="flex items-center text-emerald-500 text-sm">
                                                    <CheckCircle className="h-4 w-4 mr-1" /> Paid
                                                </span>
                                            )}
                                            {contribution.status === 'pending' && (
                                                <span className="flex items-center text-yellow-500 text-sm">
                                                    <Clock className="h-4 w-4 mr-1" /> Pending
                                                </span>
                                            )}
                                            {contribution.status === 'late' && (
                                                <span className="flex items-center text-red-500 text-sm">
                                                    <AlertTriangle className="h-4 w-4 mr-1" /> Late
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {contribution.status !== 'paid' && (
                                                <Button size="sm" className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20">
                                                    <Upload className="h-3 w-3 mr-1" /> Pay Now
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContributionsList;

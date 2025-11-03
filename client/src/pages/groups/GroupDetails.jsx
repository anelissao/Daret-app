import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Calendar, DollarSign, Award, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const GroupDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [group, setGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGroupDetails();
    }, [id]);

    const fetchGroupDetails = async () => {
        try {
            const response = await axios.get(`/groups/${id}`);
            const payload = response?.data?.data;
            const nextGroup = payload?.group ?? payload;
            setGroup(nextGroup ?? null);
        } catch (error) {
            console.error('Failed to fetch group details', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            await axios.post(`/groups/${id}/join`);
            fetchGroupDetails();
        } catch (error) {
            console.error('Failed to join group', error);
        }
    };

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>;
    if (!group) return <div>Group not found</div>;

    const isMember = group.members.some(m => m.user._id === user?._id);
    const isOwner = group.creator._id === user?._id;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white gradient-text">{group.name}</h1>
                    <p className="text-muted-foreground">{group.description}</p>
                </div>
                {!isMember && group.status === 'pending' && (
                    <Button onClick={handleJoin} className="bg-primary hover:bg-primary/90">
                        Join Group
                    </Button>
                )}
                {isOwner && group.status === 'pending' && (
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Start Tontine
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info Cards */}
                <Card className="glass-card border-white/5 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Group Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl">
                            <DollarSign className="h-5 w-5 text-emerald-400 mb-2" />
                            <p className="text-xs text-muted-foreground">Contribution</p>
                            <p className="text-lg font-bold">{formatCurrency(group.contributionAmount)}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                            <Calendar className="h-5 w-5 text-blue-400 mb-2" />
                            <p className="text-xs text-muted-foreground">Frequency</p>
                            <p className="text-lg font-bold capitalize">{group.frequency}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                            <Users className="h-5 w-5 text-violet-400 mb-2" />
                            <p className="text-xs text-muted-foreground">Members</p>
                            <p className="text-lg font-bold">{group.members.length} / {group.rules.maxMembers}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl">
                            <Award className="h-5 w-5 text-yellow-400 mb-2" />
                            <p className="text-xs text-muted-foreground">Min Score</p>
                            <p className="text-lg font-bold">{group.rules.minReliabilityScore}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Card */}
                <Card className="glass-card border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Current Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Round</span>
                            <span className="font-bold">{group.currentRound}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${group.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-yellow-500/20 text-yellow-500'
                                }`}>{group.status}</span>
                        </div>
                        {group.currentBeneficiary && (
                            <div className="pt-4 border-t border-white/10">
                                <p className="text-xs text-muted-foreground mb-1">Current Beneficiary</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-bold">
                                        {group.currentBeneficiary.firstName[0]}
                                    </div>
                                    <span className="font-medium">{group.currentBeneficiary.firstName} {group.currentBeneficiary.lastName}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Members List */}
            <Card className="glass-card border-white/5">
                <CardHeader>
                    <CardTitle>Member Circle</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="p-4 font-medium text-muted-foreground">Member</th>
                                    <th className="p-4 font-medium text-muted-foreground">Join Date</th>
                                    <th className="p-4 font-medium text-muted-foreground">Turn Status</th>
                                    <th className="p-4 font-medium text-muted-foreground">Reliability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {group.members.map((member) => (
                                    <tr key={member._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                                    {member.user.firstName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{member.user.firstName} {member.user.lastName}</p>
                                                    {member.role === 'admin' && <span className="text-xs text-primary">Admin</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {formatDate(member.joinedAt)}
                                        </td>
                                        <td className="p-4">
                                            {member.hasTakenTurn ? (
                                                <span className="flex items-center text-emerald-500 text-sm">
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Collected
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Waiting</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full max-w-[100px] h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500"
                                                        style={{ width: `${member.user.reliabilityScore}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono">{member.user.reliabilityScore}</span>
                                            </div>
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

export default GroupDetails;

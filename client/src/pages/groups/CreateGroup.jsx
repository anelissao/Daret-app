import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, DollarSign, Calendar, Info, Check } from 'lucide-react';

const CreateGroup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contributionAmount: '',
        frequency: 'monthly',
        maxMembers: 12,
        minReliabilityScore: 50
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);
        try {
            await axios.post('/groups', {
                ...formData,
                rules: {
                    maxMembers: parseInt(formData.maxMembers),
                    minReliabilityScore: parseInt(formData.minReliabilityScore)
                }
            });
            navigate('/groups');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create group');
            setIsLoading(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Create New Group</h1>
            <p className="text-muted-foreground text-center mb-8">Set up your Tontine circle in 3 easy steps</p>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-8 px-12">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors border-2 ${step >= s ? 'bg-primary border-primary text-white' : 'bg-transparent border-white/20 text-muted-foreground'
                            }`}>
                            {step > s ? <Check className="h-6 w-6" /> : s}
                        </div>
                        {s < 3 && (
                            <div className={`w-24 h-1 mx-2 rounded ${step > s ? 'bg-primary' : 'bg-white/10'}`} />
                        )}
                    </div>
                ))}
            </div>

            <Card className="glass-card border-white/10">
                <CardContent className="p-8">
                    {error && (
                        <div className="bg-destructive/15 text-destructive p-3 rounded-lg mb-6 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold">Group Details</h2>
                                <p className="text-sm text-muted-foreground">Basic information about your circle</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Group Name</label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="E.g. Family Savings 2025"
                                        icon={Users}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Description</label>
                                    <Input
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Purpose of this savings group..."
                                        icon={Info}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={nextStep} disabled={!formData.name}>Next Step</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold">Contribution Rules</h2>
                                <p className="text-sm text-muted-foreground">Financial settings for the group</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Amount (MAD)</label>
                                    <Input
                                        name="contributionAmount"
                                        type="number"
                                        value={formData.contributionAmount}
                                        onChange={handleChange}
                                        placeholder="1000"
                                        icon={DollarSign}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Frequency</label>
                                    <select
                                        name="frequency"
                                        value={formData.frequency}
                                        onChange={handleChange}
                                        className="w-full h-10 rounded-lg border border-white/5 bg-black/20 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 text-white"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Max Members</label>
                                    <Input
                                        name="maxMembers"
                                        type="number"
                                        value={formData.maxMembers}
                                        onChange={handleChange}
                                        placeholder="12"
                                        icon={Users}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Min Reliability Score</label>
                                    <Input
                                        name="minReliabilityScore"
                                        type="number"
                                        value={formData.minReliabilityScore}
                                        onChange={handleChange}
                                        placeholder="50"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Users below this score cannot join.</p>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={prevStep}>Back</Button>
                                <Button onClick={nextStep} disabled={!formData.contributionAmount}>Next Step</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold">Review & Create</h2>
                                <p className="text-sm text-muted-foreground">Confirm your group settings</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name:</span>
                                    <span className="font-bold">{formData.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Amount:</span>
                                    <span className="font-bold">{formData.contributionAmount} MAD</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Frequency:</span>
                                    <span className="capitalize font-bold">{formData.frequency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Max Members:</span>
                                    <span className="font-bold">{formData.maxMembers}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Min Score:</span>
                                    <span className="font-bold">{formData.minReliabilityScore}</span>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={prevStep}>Back</Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-emerald-600 hover:bg-emerald-700 w-32"
                                    isLoading={isLoading}
                                >
                                    Create Group
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateGroup;

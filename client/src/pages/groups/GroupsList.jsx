import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Users, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const GroupsList = () => {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get('/groups');
            setGroups(response.data.data);
        } catch (error) {
            console.error('Failed to fetch groups', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Groups</h1>
                    <p className="text-muted-foreground">Manage your Tontine circles</p>
                </div>
                <Link to="/groups/create">
                    <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Group
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Input
                    placeholder="Search groups..."
                    icon={Search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-black/20 border-white/5"
                />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
            ) : filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.map(group => (
                        <Card key={group._id} className="glass-card hover:border-primary/30 transition-all duration-300 group cursor-pointer border-white/5">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">{group.name}</CardTitle>
                                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${group.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                                        group.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {group.status}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center text-muted-foreground">
                                            <Users className="h-4 w-4 mr-2" />
                                            <span>{group.members?.length || 0} Members</span>
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span className="capitalize">{group.frequency}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Contribution</p>
                                            <p className="text-lg font-bold text-white">{formatCurrency(group.contributionAmount)}</p>
                                        </div>
                                        <Link to={`/groups/${group._id}`}>
                                            <Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
                                                View <ArrowRight className="ml-1 h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/5">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-white mb-2">No Groups Found</h3>
                    <p className="text-muted-foreground mb-6">You haven't joined any groups yet. Create one to get started.</p>
                    <Link to="/groups/create">
                        <Button variant="secondary">Create First Group</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default GroupsList;

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Wallet, MessageSquare, Menu, X, LogOut, Ticket } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { pathname } = useLocation();
    const { logout, user } = useAuth();

    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/groups', label: 'My Groups', icon: Users },
        { href: '/contributions', label: 'Contributions', icon: Wallet },
        { href: '/messages', label: 'Messages', icon: MessageSquare },
        { href: '/support', label: 'Support', icon: Ticket },
    ];

    return (
        <>
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-card/80 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 h-full flex flex-col">
                    <div className="mb-8 pl-2">
                        <h1 className="text-2xl font-bold gradient-text">Daret</h1>
                        <p className="text-xs text-muted-foreground mt-1">Premium Tontine</p>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;

                            return (
                                <Link key={link.href} to={link.href}>
                                    <div className={cn(
                                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                        isActive
                                            ? "bg-primary/20 text-white border border-primary/20"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                    )}>
                                        <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "group-hover:text-white")} />
                                        <span className="font-medium">{link.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto border-t border-white/10 pt-6">
                        <div className="flex items-center mb-4 px-2">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
                                {user?.firstName?.charAt(0)}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <main className="md:ml-64 min-h-screen transition-all duration-300">
                <div className="p-4 md:p-8">
                    <button
                        className="md:hidden mb-4 p-2 text-white"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;

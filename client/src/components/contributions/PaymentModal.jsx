import React, { useState } from 'react';
import { Dialog } from '@headlessui/react'; // Assuming headless UI or custom modal logic
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';

// Using a custom modal implementation for simplicity without adding new deps like Radix UI
// unless I want to manually build it. For "best practices", I'll build a simple accessible modal.

const PaymentModal = ({ isOpen, onClose, contribution, onSubmit }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await onSubmit(file);
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden glass-card">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold">Record Payment</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <p className="text-sm text-primary font-medium">Amount Due</p>
                        <p className="text-2xl font-bold text-white">{contribution?.amount} MAD</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Upload Proof of Payment</label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer relative bg-black/20">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                required
                            />
                            {preview ? (
                                <img src={preview} alt="Receipt" className="h-32 w-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <Upload className="h-8 w-8" />
                                    <span className="text-sm">Receipt Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" className="flex-1" isLoading={isLoading} disabled={!file}>Submit Payment</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;

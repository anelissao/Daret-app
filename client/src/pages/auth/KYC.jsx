import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const KYC = () => {
    const [idNumber, setIdNumber] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const formData = new FormData();
        formData.append('idCardNumber', idNumber);
        formData.append('idCardImage', file);

        try {
            await axios.post('/api/users/kyc', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit KYC documents');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[20%] right-[30%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
            </div>

            <Card className="w-full max-w-lg relative z-10 glass-card">
                <CardHeader className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
                    <p className="text-muted-foreground mt-2">
                        To ensure the security of all members, we need to verify your identity before you can join or create groups.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-destructive/15 text-destructive p-3 rounded-lg flex items-center gap-2 text-sm">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">National ID Number</label>
                            <Input
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                placeholder="Enter your ID card number"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Upload ID Card Photo</label>
                            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    required
                                />
                                {preview ? (
                                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                        <img src={preview} alt="ID Preview" className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <div className="bg-background/80 p-2 rounded-full">
                                                <Upload className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Upload className="h-10 w-10 mb-2" />
                                        <p className="text-sm">Click to upload or drag and drop</p>
                                        <p className="text-xs">JPG, PNG up to 5MB</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Submit Application
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default KYC;

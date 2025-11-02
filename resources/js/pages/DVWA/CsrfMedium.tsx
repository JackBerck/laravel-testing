import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Home, Lock } from 'lucide-react';
import { useState } from 'react';

interface Props {
    currentPassword: string;
}

export default function CsrfMedium({ currentPassword }: Props) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // MEDIUM: Relies on Referer header
            const response = await fetch('/dvwa/csrf/medium', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="CSRF - Medium" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="mx-auto max-w-5xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                CSRF (Cross-Site Request Forgery)
                            </h1>
                            <p className="mt-1 text-gray-600">
                                Practice Module - DVWA Clone
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Badge
                                variant="default"
                                className="bg-orange-500 text-sm"
                            >
                                Level: Medium
                            </Badge>
                            <Link href="/">
                                <Button variant="outline" size="sm">
                                    <Home className="mr-2 h-4 w-4" />
                                    Home
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Difficulty Levels
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Link href="/dvwa/csrf/low">
                                    <Badge
                                        variant="outline"
                                        className="cursor-pointer hover:bg-red-100"
                                    >
                                        Low
                                    </Badge>
                                </Link>
                                <Badge className="bg-orange-500">
                                    Medium (Current)
                                </Badge>
                                <Link href="/dvwa/csrf/high">
                                    <Badge
                                        variant="outline"
                                        className="cursor-pointer hover:bg-green-100"
                                    >
                                        High
                                    </Badge>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Tujuan:</strong> Bypass Referer header check
                            untuk CSRF attack.
                            <br />
                            <strong>Hint:</strong> Server hanya memeriksa
                            Referer header. Bisa di-bypass dengan:
                            <ul className="mt-2 ml-4 list-inside list-disc">
                                <li>Hosting attack page di subdomain</li>
                                <li>Menggunakan data URI atau about:blank</li>
                                <li>Browser yang tidak mengirim Referer</li>
                            </ul>
                        </AlertDescription>
                    </Alert>

                    {/* Current Password Display */}
                    <Card className="border-blue-200 bg-blue-50">
                        <CardHeader>
                            <CardTitle className="text-blue-900">
                                ℹ️ Current Password (Demo)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <code className="text-blue-800">
                                {currentPassword}
                            </code>
                        </CardContent>
                    </Card>

                    {/* Change Password Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Change Password
                            </CardTitle>
                            <CardDescription>
                                Enter your new password (Referer check only)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new_password">
                                        New Password
                                    </Label>
                                    <Input
                                        id="new_password"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm_password">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirm_password"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading
                                        ? 'Changing...'
                                        : 'Change Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Success Message */}
                    {message && (
                        <Alert className="border-green-500 bg-green-50">
                            <AlertDescription className="text-green-800">
                                ✅ {message}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Learning Section */}
                    <Card className="border-orange-200 bg-orange-50">
                        <CardHeader>
                            <CardTitle className="text-orange-900">
                                📚 Penjelasan Vulnerability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-orange-800">
                            <p>
                                <strong>Level Medium:</strong> Hanya memeriksa
                                Referer header, masih bisa di-bypass.
                            </p>
                            <p>
                                <strong>Kelemahan Referer Check:</strong>
                            </p>
                            <ul className="ml-4 list-inside list-disc space-y-1">
                                <li>
                                    User bisa disable Referer header di browser
                                </li>
                                <li>
                                    Proxy/Firewall bisa strip Referer header
                                </li>
                                <li>
                                    Attacker bisa hosting di subdomain yang sama
                                </li>
                                <li>Bisa menggunakan iframe dengan data URI</li>
                            </ul>
                            <p className="mt-3">
                                <strong>Contoh Bypass:</strong> Host attack page
                                di subdomain atau gunakan meta refresh tanpa
                                Referer.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

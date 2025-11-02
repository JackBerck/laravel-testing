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
import { AlertCircle, Home, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface Props {
    currentPassword: string;
}

export default function CsrfHigh({ currentPassword }: Props) {
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
            // HIGH: Uses CSRF token
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';

            const response = await fetch('/dvwa/csrf/high', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
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
            <Head title="CSRF - High" />

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
                                className="bg-green-600 text-sm"
                            >
                                Level: High (Secure)
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
                                <Link href="/dvwa/csrf/medium">
                                    <Badge
                                        variant="outline"
                                        className="cursor-pointer hover:bg-orange-100"
                                    >
                                        Medium
                                    </Badge>
                                </Link>
                                <Badge className="bg-green-600">
                                    High (Current)
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Alert className="border-green-500 bg-green-50">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            <strong>Level Secure:</strong> Menggunakan CSRF
                            token untuk validasi request.
                            <br />
                            <strong>Info:</strong> Setiap request harus
                            menyertakan CSRF token yang valid. Token di-generate
                            per session dan tidak bisa di-predict.
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
                                Change Password (Secure)
                            </CardTitle>
                            <CardDescription>
                                Enter your new password (Protected with CSRF
                                token)
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
                    <Card className="border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-green-900">
                                ✅ Penjelasan Security
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-green-800">
                            <p>
                                <strong>Level High (Secure):</strong>{' '}
                                Menggunakan CSRF token untuk mencegah CSRF
                                attack.
                            </p>
                            <p>
                                <strong>Mengapa Aman?</strong>
                            </p>
                            <ul className="ml-4 list-inside list-disc space-y-1">
                                <li>
                                    Token unik di-generate per session/request
                                </li>
                                <li>
                                    Token tidak bisa di-predict atau di-brute
                                    force
                                </li>
                                <li>
                                    Token tidak dapat diakses dari domain lain
                                    (Same-Origin Policy)
                                </li>
                                <li>
                                    Server memvalidasi token sebelum memproses
                                    request
                                </li>
                            </ul>
                            <p className="mt-3">
                                <strong>Best Practice:</strong>
                            </p>
                            <ul className="ml-4 list-inside list-disc space-y-1">
                                <li>
                                    Selalu gunakan CSRF token untuk state
                                    changing operations
                                </li>
                                <li>
                                    Laravel otomatis menyediakan CSRF
                                    protection via middleware
                                </li>
                                <li>
                                    Gunakan SameSite cookie attribute untuk
                                    extra protection
                                </li>
                                <li>
                                    Kombinasikan dengan proper authentication
                                    dan authorization
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

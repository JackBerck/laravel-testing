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

export default function CsrfLow({ currentPassword }: Props) {
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
            // VULNERABLE: No CSRF token sent
            const response = await fetch('/dvwa/csrf/low', {
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
            <Head title="CSRF - Low" />

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
                            <Badge variant="destructive" className="text-sm">
                                Level: Low
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
                                <Badge variant="destructive">
                                    Low (Current)
                                </Badge>
                                <Link href="/dvwa/csrf/medium">
                                    <Badge
                                        variant="outline"
                                        className="cursor-pointer hover:bg-orange-100"
                                    >
                                        Medium
                                    </Badge>
                                </Link>
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
                            <strong>Tujuan:</strong> Eksploitasi CSRF untuk
                            mengubah password tanpa sepengetahuan user.
                            <br />
                            <strong>Hint:</strong> Tidak ada CSRF token. Buat
                            HTML form di domain lain yang auto-submit ke
                            endpoint ini.
                            <br />
                            <strong>Contoh Attack:</strong>
                            <code className="mt-2 block rounded bg-gray-900 p-2 text-xs text-green-400">
                                {`<form action="http://yoursite.com/dvwa/csrf/low" method="POST">
  <input name="new_password" value="hacked123">
  <input name="confirm_password" value="hacked123">
</form>
<script>document.forms[0].submit()</script>`}
                            </code>
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
                                Enter your new password (No CSRF protection)
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
                    <Card className="border-blue-200 bg-blue-50">
                        <CardHeader>
                            <CardTitle className="text-blue-900">
                                📚 Penjelasan Vulnerability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-blue-800">
                            <p>
                                <strong>Level Low:</strong> Tidak ada proteksi
                                CSRF sama sekali. Request bisa datang dari
                                domain manapun.
                            </p>
                            <p>
                                <strong>Cara Exploit:</strong>
                            </p>
                            <ul className="ml-4 list-inside list-disc space-y-1">
                                <li>
                                    Buat HTML page dengan form yang auto-submit
                                </li>
                                <li>
                                    Kirim link ke victim (phishing/social
                                    engineering)
                                </li>
                                <li>
                                    Saat victim buka link, form otomatis submit
                                    ke server
                                </li>
                                <li>
                                    Password victim berubah tanpa sepengetahuan
                                    mereka
                                </li>
                            </ul>
                            <p className="mt-3">
                                <strong>Impact:</strong> Account takeover,
                                unauthorized actions, data manipulation
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

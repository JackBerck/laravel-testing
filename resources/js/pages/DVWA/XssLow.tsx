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
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Home, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export default function XssLow() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [rawInput, setRawInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';
            const response = await fetch('/dvwa/xss/low', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ name }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setRawInput(data.raw_input);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="XSS - Low" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="mx-auto max-w-5xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Cross-Site Scripting (XSS)
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
                                <Link href="/dvwa/xss/medium">
                                    <Badge
                                        variant="outline"
                                        className="cursor-pointer hover:bg-orange-100"
                                    >
                                        Medium
                                    </Badge>
                                </Link>
                                <Link href="/dvwa/xss/high">
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
                            <strong>Tujuan:</strong> Eksploitasi XSS untuk
                            menjalankan JavaScript di browser.
                            <br />
                            <strong>Hint:</strong> Coba masukkan:{' '}
                            <code className="rounded bg-gray-200 px-2 py-1">
                                {'<script>alert("XSS")</script>'}
                            </code>{' '}
                            atau{' '}
                            <code className="rounded bg-gray-200 px-2 py-1">
                                {'<img src=x onerror="alert(\'XSS\')">'}
                            </code>
                        </AlertDescription>
                    </Alert>

                    {/* Main Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                What's your name?
                            </CardTitle>
                            <CardDescription>
                                Masukkan nama Anda untuk mendapatkan pesan
                                sambutan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex gap-3">
                                    <Input
                                        type="text"
                                        placeholder="Masukkan nama (contoh: John)"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="flex-1"
                                    />
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Loading...' : 'Submit'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Response Display */}
                    {message && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    Response
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="rounded-lg bg-gray-100 p-4"
                                    dangerouslySetInnerHTML={{
                                        __html: message,
                                    }}
                                />
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">
                                        Raw Input:
                                    </p>
                                    <code className="mt-1 block rounded bg-gray-900 p-2 text-xs text-green-400">
                                        {rawInput}
                                    </code>
                                </div>
                            </CardContent>
                        </Card>
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
                                <strong>Level Low:</strong> Input langsung
                                ditampilkan tanpa sanitasi apapun.
                            </p>
                            <p>
                                <strong>Contoh Exploit:</strong>
                            </p>
                            <ul className="ml-4 list-inside list-disc space-y-1">
                                <li>
                                    <code>
                                        {'<script>alert("XSS")</script>'}
                                    </code>{' '}
                                    - Basic XSS
                                </li>
                                <li>
                                    <code>
                                        {'<img src=x onerror="alert(\'XSS\')">'}
                                    </code>{' '}
                                    - Image tag XSS
                                </li>
                                <li>
                                    <code>
                                        {'<svg onload="alert(\'XSS\')">'}
                                    </code>{' '}
                                    - SVG XSS
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

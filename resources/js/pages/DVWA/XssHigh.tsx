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
import { Home, MessageSquare, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function XssHigh() {
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
            const response = await fetch('/dvwa/xss/high', {
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
            <Head title="XSS - High" />

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
                                <Link href="/dvwa/xss/low">
                                    <Badge
                                        variant="outline"
                                        className="cursor-pointer hover:bg-red-100"
                                    >
                                        Low
                                    </Badge>
                                </Link>
                                <Link href="/dvwa/xss/medium">
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
                            <strong>Level Secure:</strong> Menggunakan proper
                            HTML encoding untuk mencegah XSS.
                            <br />
                            <strong>Info:</strong> Pada level ini, semua payload
                            XSS tidak akan berhasil karena menggunakan
                            htmlspecialchars().
                        </AlertDescription>
                    </Alert>

                    {/* Main Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                What's your name? (Secure)
                            </CardTitle>
                            <CardDescription>
                                Masukkan nama Anda untuk mendapatkan pesan
                                sambutan (Protected with HTML encoding)
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
                                <div className="rounded-lg bg-gray-100 p-4">
                                    {message}
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">
                                        Raw Input (after encoding):
                                    </p>
                                    <code className="mt-1 block rounded bg-gray-900 p-2 text-xs text-green-400">
                                        {rawInput}
                                    </code>
                                </div>
                            </CardContent>
                        </Card>
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
                                Menggunakan htmlspecialchars() untuk mengenkode
                                karakter khusus HTML.
                            </p>
                            <p>
                                <strong>Mengapa Aman?</strong>
                            </p>
                            <ul className="ml-4 list-inside list-disc space-y-1">
                                <li>Karakter {'<'} diubah menjadi &lt;</li>
                                <li>Karakter {'>'} diubah menjadi &gt;</li>
                                <li>Karakter " diubah menjadi &quot;</li>
                                <li>
                                    Browser tidak akan mengeksekusi kode yang
                                    sudah di-encode
                                </li>
                            </ul>
                            <p className="mt-3">
                                <strong>Best Practice:</strong> Selalu encode
                                output user untuk mencegah XSS di production!
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Code, Database, Home } from 'lucide-react';
import { useState } from 'react';

export default function SqlInjectionMedium() {
    const [userId, setUserId] = useState('');
    const [results, setResults] = useState(null);
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResults(null);

        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';
            const response = await fetch('/dvwa/sql-injection/medium', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ user_id: userId }),
            });

            const data = await response.json();

            if (data.success) {
                setResults(data.data);
                setQuery(data.query);
            } else {
                setError(data.error);
            }
        } catch {
            setError('Terjadi kesalahan saat mengirim request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="SQL Injection - Medium" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="mx-auto max-w-5xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                SQL Injection
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
                                <Link href="/dvwa/sql-injection/low">
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
                                <Link href="/dvwa/sql-injection/high">
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
                            <strong>Tujuan:</strong> Bypass basic sanitization
                            untuk eksploitasi SQL injection.
                            <br />
                            <strong>Hint:</strong> Server menghilangkan spasi.
                            Gunakan comment atau karakter khusus:{' '}
                            <code className="rounded bg-gray-200 px-2 py-1">
                                1'/**/OR/**/'1'='1
                            </code>{' '}
                            atau{' '}
                            <code className="rounded bg-gray-200 px-2 py-1">
                                1'OR'1'='1
                            </code>
                        </AlertDescription>
                    </Alert>

                    {/* Main Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                User ID Lookup
                            </CardTitle>
                            <CardDescription>
                                Masukkan User ID untuk mencari informasi
                                pengguna (spasi dihilangkan)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex gap-3">
                                    <Input
                                        type="text"
                                        placeholder="Masukkan User ID (contoh: 1)"
                                        value={userId}
                                        onChange={(e) =>
                                            setUserId(e.target.value)
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

                    {/* Query Display */}
                    {query && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-sm">
                                    <Code className="h-4 w-4" />
                                    Query yang Dijalankan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-green-400">
                                    {query}
                                </pre>
                            </CardContent>
                        </Card>
                    )}

                    {/* Results Table */}
                    {results && results.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Hasil Pencarian ({results.length} record)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Username</TableHead>
                                            <TableHead>First Name</TableHead>
                                            <TableHead>Last Name</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.map((user, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{user.id}</TableCell>
                                                <TableCell>
                                                    {user.username}
                                                </TableCell>
                                                <TableCell>
                                                    {user.first_name}
                                                </TableCell>
                                                <TableCell>
                                                    {user.last_name}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error Display */}
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
                                <strong>Level Medium:</strong> Server melakukan
                                basic sanitization dengan menghilangkan spasi,
                                tapi masih bisa di-bypass.
                            </p>
                            <p>
                                <strong>Contoh Exploit:</strong>
                            </p>
                            <ul className="ml-4 list-inside list-disc space-y-1">
                                <li>
                                    <code>1'OR'1'='1</code> - Bypass tanpa spasi
                                </li>
                                <li>
                                    <code>1'/**/OR/**/'1'='1</code> -
                                    Menggunakan comment sebagai pengganti spasi
                                </li>
                                <li>
                                    <code>
                                        1'UNION/**/SELECT/**/1,username,first_name,last_name/**/FROM/**/dvwa_users--{' '}
                                    </code>{' '}
                                    - UNION dengan comment
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

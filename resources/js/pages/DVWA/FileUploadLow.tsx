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
import { AlertCircle, FileUp, Home, Upload } from 'lucide-react';
import { useState } from 'react';

interface Upload {
    id: number;
    filename: string;
    original_name: string;
    mime_type: string;
    size: number;
    created_at: string;
}

interface Props {
    uploads: Upload[];
}

export default function FileUploadLow({ uploads: initialUploads }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [uploads, setUploads] = useState<Upload[]>(initialUploads);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage('');
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setMessage('');
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';

            const response = await fetch('/dvwa/file-upload/low', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setFile(null);
                // Refresh uploads list
                window.location.reload();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <>
            <Head title="File Upload - Low" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="mx-auto max-w-5xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                File Upload Vulnerability
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
                                <Link href="/dvwa/file-upload/medium">
                                    <Badge
                                        variant="outline"
                                        className="cursor-pointer hover:bg-orange-100"
                                    >
                                        Medium
                                    </Badge>
                                </Link>
                                <Link href="/dvwa/file-upload/high">
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
                            <strong>Tujuan:</strong> Upload file berbahaya
                            (shell script) ke server.
                            <br />
                            <strong>Hint:</strong> Tidak ada validasi file. Coba
                            upload file .php atau .phtml untuk webshell.
                        </AlertDescription>
                    </Alert>

                    {/* Upload Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload File
                            </CardTitle>
                            <CardDescription>
                                Pilih file untuk diupload (tanpa validasi)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={uploading || !file}
                                    >
                                        <FileUp className="mr-2 h-4 w-4" />
                                        {uploading ? 'Uploading...' : 'Upload'}
                                    </Button>
                                </div>
                                {file && (
                                    <p className="text-sm text-gray-600">
                                        Selected: {file.name} (
                                        {formatFileSize(file.size)})
                                    </p>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Success Message */}
                    {message && (
                        <Alert className="border-green-500 bg-green-50">
                            <AlertDescription className="text-green-800">
                                {message}
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

                    {/* Uploaded Files */}
                    {uploads && uploads.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Uploaded Files ({uploads.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Filename</TableHead>
                                            <TableHead>Original Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {uploads.map((upload) => (
                                            <TableRow key={upload.id}>
                                                <TableCell className="font-mono text-xs">
                                                    {upload.filename}
                                                </TableCell>
                                                <TableCell>
                                                    {upload.original_name}
                                                </TableCell>
                                                <TableCell>
                                                    {upload.mime_type}
                                                </TableCell>
                                                <TableCell>
                                                    {formatFileSize(
                                                        upload.size,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        upload.created_at,
                                                    ).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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
                                <strong>Level Low:</strong> Tidak ada validasi
                                sama sekali. Semua jenis file bisa diupload.
                            </p>
                            <p>
                                <strong>Bahaya:</strong>
                            </p>
                            <ul className="ml-4 list-inside list-disc space-y-1">
                                <li>
                                    Attacker bisa upload PHP shell untuk remote
                                    code execution
                                </li>
                                <li>
                                    Upload file berbahaya yang bisa menginfeksi
                                    server
                                </li>
                                <li>
                                    Upload file dengan ukuran besar untuk DoS
                                    attack
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

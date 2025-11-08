<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MahasiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);
        $mahasiswas = Mahasiswa::latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Data mahasiswa retrieved successfully',
            'data' => $mahasiswas,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'nim' => 'required|string|max:20|unique:mahasiswas,nim',
                'jurusan' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:mahasiswas,email',
                'nomor_telepon' => 'required|string|max:20',
            ]);

            $mahasiswa = Mahasiswa::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Mahasiswa created successfully',
                'data' => $mahasiswa,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $mahasiswa = Mahasiswa::find($id);

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Mahasiswa retrieved successfully',
            'data' => $mahasiswa,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $mahasiswa = Mahasiswa::find($id);

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa not found',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'nama' => 'sometimes|required|string|max:255',
                'nim' => 'sometimes|required|string|max:20|unique:mahasiswas,nim,' . $id,
                'jurusan' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|max:255|unique:mahasiswas,email,' . $id,
                'nomor_telepon' => 'sometimes|required|string|max:20',
            ]);

            $mahasiswa->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Mahasiswa updated successfully',
                'data' => $mahasiswa,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $mahasiswa = Mahasiswa::find($id);

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa not found',
            ], 404);
        }

        $mahasiswa->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mahasiswa deleted successfully',
        ]);
    }
}

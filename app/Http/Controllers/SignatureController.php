<?php

namespace App\Http\Controllers;

use App\Models\Signature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SignatureController extends Controller
{
    public function index()
    {
        $signatures = Signature::latest()->get()->map(fn ($signature) => [
            'id' => $signature->id,
            'url' => $signature->url,
            'created_at' => $signature->created_at->diffForHumans(),
        ]);

        return Inertia::render('Signatures/Index', [
            'signatures' => $signatures,
        ]);
    }

    public function create()
    {
        return Inertia::render('Signatures/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'signature' => ['required', 'string'],
        ]);

        $imageData = $request->input('signature');

        if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
            $type = strtolower($type[1]);

            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }
            $imageData = base64_decode($imageData);

            if ($imageData === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $fileName = 'signature_' . time() . '_' . Str::random(10) . '.' . $type;
        $path = 'signatures/' . $fileName;

        Storage::disk('public')->put($path, $imageData);

        Signature::create(['path' => $path]);

        return redirect()->route('signatures.index')->with('success', 'Created.');
    }

    public function show(Signature $signature)
    {
        return Inertia::render('Signatures/Show', [
            'signature' => [
                'id' => $signature->id,
                'url' => $signature->url,
                'created_at' => $signature->created_at->format('d.m.Y H:i'),
            ],
        ]);
    }

    public function destroy(Signature $signature)
    {
        if (Storage::disk('public')->exists($signature->path)) {
            Storage::disk('public')->delete($signature->path);
        }

        $signature->delete();

        return redirect()->route('signatures.index')->with('success', 'Deleted.');
    }
}

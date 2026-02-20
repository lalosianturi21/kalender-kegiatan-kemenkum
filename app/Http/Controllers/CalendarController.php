<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;


class CalendarController extends Controller
{
    public function import(Request $request)
{
    // Format bulan: MM-YYYY
    $bulan = $request->bulan
        ? Carbon::createFromFormat('m-Y', $request->bulan)->format('m-Y')
        : now()->format('m-Y');

    // Kita kirim tanggal awal bulan ke API (karena API butuh DD-MM-YYYY)
    $tanggalApi = Carbon::createFromFormat('m-Y', $bulan)
                    ->startOfMonth()
                    ->format('d-m-Y');

    $apiUrl = config('services.agenda_url') . $tanggalApi;

    $response = Http::get($apiUrl);

    if (!$response->successful()) {
        return response()->json([
            'error' => 'Gagal mengambil data agenda dari API'
        ], 500);
    }

    $data = $response->json();
    $events = [];

    foreach ($data as $event) {

        if (!isset($event['start'])) {
            continue;
        }

        // ===== KONVERSI WAKTU =====
        $start = Carbon::createFromTimestampUTC($event['start'])
                    ->setTimezone('Asia/Jakarta');

        $end = isset($event['end']) && $event['end'] != 0
            ? Carbon::createFromTimestampUTC($event['end'])->setTimezone('Asia/Jakarta')
            : $start->copy();

        $summary = $event['agenda'] ?? '';
        $picRaw = $event['pic'] ?? '';
        $pic = is_array($picRaw) ? ($picRaw[0] ?? '') : $picRaw;

        // ===== DETEKSI DIVISI =====
        $divisiMap = [
            'P3H'   => 'divisi-1',
            'Tim AHU'   => 'divisi-2',
            'KI'    => 'divisi-3',
            'Tim TUM' => 'divisi-4',
        ];

        $divisiClass = 'divisi-default';

        foreach ($divisiMap as $key => $class) {
            if (stripos($pic, $key) !== false) {
                $divisiClass = $class;
                break;
            }
        }

        $events[] = [
            'uid'         => $event['id'],
            'summary'     => $summary,
            'description' => $event['description'] ?? null,
            'start'       => $start->format('Y-m-d H:i:s'),
            'end'         => $end->format('Y-m-d H:i:s'),
            'location'    => $event['location'] ?? null,
            'divisiClass' => $divisiClass,
        ];
    }

    return response()->json($events);
}


    public function index()
    {
        $videos = collect(File::files(public_path('videos')))
            ->filter(fn ($file) => in_array($file->getExtension(), ['mp4', 'webm', 'ogg']))
            ->map(fn ($file) => asset('videos/' . $file->getFilename()))
            ->values();

        return view('home', compact('videos'));
    }

}

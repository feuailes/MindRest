<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use Illuminate\Http\Request;

class JournalController extends Controller
{
    /** GET /api/journal */
    public function index(Request $request)
    {
        $entries = JournalEntry::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($entries);
    }

    /** POST /api/journal */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'      => 'nullable|string|max:150',
            'content'    => 'required|string',
            'mood_tag'   => 'nullable|string|max:50',
        ]);

        $entry = JournalEntry::create([
            'user_id'    => $request->user()->id,
            'title'      => $data['title'] ?? 'Daily Reflection',
            'content'    => $data['content'],
            'mood_tag'   => $data['mood_tag'] ?? 'neutral',
        ]);

        return response()->json($entry, 201);
    }

    /** DELETE /api/journal/{id} */
    public function destroy(Request $request, int $id)
    {
        $entry = JournalEntry::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $entry->delete();

        return response()->json(['message' => 'Entry deleted.']);
    }
}

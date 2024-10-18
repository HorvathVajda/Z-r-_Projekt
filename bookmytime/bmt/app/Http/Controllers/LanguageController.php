<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    public function changeLanguage(Request $request)
    {
        $language = $request->input('language');

        // Ellenőrizzük, hogy a kiválasztott nyelv támogatott-e
        if (in_array($language, ['hu', 'en'])) {
            App::setLocale($language);
            Session::put('applocale', $language);
        }

        return redirect()->back();
    }
}

<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalender Kemenkumham 2026</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('css/calendar.css') }}">
</head>

<body>

    <!-- SCENE WEB -->
    <div id="scene-web">
        @yield('content')
    </div>

    <!-- SCENE VIDEO -->
    <div id="scene-video1" class="scene-hidden">
    <video id="videoPlayer" playsinline></video>
    </div>


    <script>
        const videoList = @json($videos);
    </script>

    <script src="{{ asset('js/calendar.js') }}"></script>
    <script src="{{ asset('js/videoScene.js') }}"></script>

</body>
</html>

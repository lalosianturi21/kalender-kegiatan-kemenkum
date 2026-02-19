const scenes = [
    { id: "scene-web", duration: 20000 }, // kalender 20 detik
    { id: "scene-video1", isVideo: true },
];

let sceneIndex = 0;
let videoIndex = 0;
let idleTimer = null;

const video = document.getElementById("videoPlayer");

// =======================
// DETEKSI INTERAKSI USER
// =======================
function resetIdleTimer() {
    if (!scenes[sceneIndex].isVideo) {
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(nextScene, scenes[sceneIndex].duration);
    }
}

["click","mousemove","keydown","touchstart","scroll"].forEach(evt => {
    window.addEventListener(evt, resetIdleTimer, true);
});

// =======================

function showScene(index) {
    document.getElementById("scene-web").classList.add("scene-hidden");
    document.getElementById("scene-video1").classList.add("scene-hidden");

    const scene = scenes[index];
    document.getElementById(scene.id).classList.remove("scene-hidden");

    if (idleTimer) clearTimeout(idleTimer);

    if (scene.isVideo) {
        playVideo();
    } else {
        resetIdleTimer(); // timer hanya aktif jika tidak ada interaksi
    }
}

function playVideo() {
    if (!videoList || videoList.length === 0) {
        nextScene();
        return;
    }

    video.src = videoList[videoIndex];
    video.currentTime = 0;
    video.load();
    video.play();

    video.onended = () => {
        videoIndex++;
        if (videoIndex >= videoList.length) {
            videoIndex = 0;
            nextScene();
        } else {
            playVideo();
        }
    };
}

function nextScene() {
    if (idleTimer) clearTimeout(idleTimer);
    sceneIndex = (sceneIndex + 1) % scenes.length;
    showScene(sceneIndex);
}

// mulai
showScene(0);

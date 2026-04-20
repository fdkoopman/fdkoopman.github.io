(() => {
  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function setupLatencyDemo(root) {
    const teacher = root.querySelector(".teacher-video");
    const student = root.querySelector(".student-video");
    const playBtn = root.querySelector(".sync-play");
    const resetBtn = root.querySelector(".reset-playback");
    const meta = root.querySelector(".latency-meta");

    if (!teacher || !student || !playBtn || !resetBtn || !meta) return;

    const env = root.dataset.env || "task";
    const teacherMs = Number(root.dataset.teacherMs || "0");
    const studentMs = Number(root.dataset.studentMs || "1");

    const ratio = teacherMs > 0 && studentMs > 0 ? teacherMs / studentMs : 1.0;
    const studentRate = 1.0;
    // Browser practical lower bound is around 0.0625.
    const teacherRate = clamp(1.0 / ratio, 0.0625, 1.0);
    const clipped = teacherRate !== 1.0 / ratio;

    meta.textContent =
      `${env}: teacher latency ${teacherMs.toFixed(2)} ms vs student latency ${studentMs.toFixed(2)} ms `
      + `(${ratio.toFixed(1)}x slower). Replay rates: teacher ${teacherRate.toFixed(4)}x, student ${studentRate.toFixed(2)}x`
      + (clipped ? " (teacher rate clipped by browser minimum)." : ".");

    function reset() {
      teacher.pause();
      student.pause();
      teacher.currentTime = 0;
      student.currentTime = 0;
      teacher.playbackRate = teacherRate;
      student.playbackRate = studentRate;
    }

    async function syncPlay() {
      teacher.pause();
      student.pause();
      teacher.currentTime = 0;
      student.currentTime = 0;
      teacher.playbackRate = teacherRate;
      student.playbackRate = studentRate;
      try {
        await Promise.all([teacher.play(), student.play()]);
      } catch (_) {
        // User gesture policies differ by browser; controls remain available.
      }
    }

    playBtn.addEventListener("click", syncPlay);
    resetBtn.addEventListener("click", reset);
    reset();
  }

  document.querySelectorAll(".latency-demo").forEach(setupLatencyDemo);
})();

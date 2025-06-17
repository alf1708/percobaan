document.addEventListener('DOMContentLoaded', () => {
    // Ambil referensi ke semua elemen yang dibutuhkan
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const questionDisplay = document.getElementById('question');
    const answerInput = document.getElementById('answerInput');
    const submitAnswerButton = document.getElementById('submitAnswer');
    const messageDisplay = document.getElementById('message');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const logoutButton = document.getElementById('logoutButton');

    // Elemen terkait login
    const loginButton = document.getElementById('loginButton');
    const passwordInput = document.getElementById('passwordInput');
    const loginMessage = document.getElementById('loginMessage');
    const loginSection = document.getElementById('login-section');
    const gameSection = document.getElementById('game-section');

    let score = 0;
    let timeLeft = 30;
    let timer;
    let currentQuestion = {};
    const CORRECT_PASSWORD = "alif2024"; // Password yang diminta

    // --- Fungsi Bantuan Game ---
    function generateQuestion() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        let answer;
        let questionText;

        switch (operator) {
            case '+':
                answer = num1 + num2;
                questionText = `${num1} + ${num2}`;
                break;
            case '-':
                // Pastikan hasilnya tidak negatif untuk pengurangan
                if (num1 < num2) {
                    [num1, num2] = [num2, num1]; // Tukar jika num1 lebih kecil
                }
                answer = num1 - num2;
                questionText = `${num1} - ${num2}`;
                break;
            case '*':
                answer = num1 * num2;
                questionText = `${num1} * ${num2}`;
                break;
        }
        currentQuestion = { questionText, answer };
        questionDisplay.textContent = currentQuestion.questionText;
        answerInput.value = ''; // Kosongkan input jawaban
        answerInput.focus(); // Fokuskan kembali ke input jawaban
        messageDisplay.textContent = ''; // Hapus pesan sebelumnya
    }

    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value);
        if (isNaN(userAnswer)) {
            messageDisplay.textContent = "Masukkan angka yang valid!";
            messageDisplay.style.color = "orange";
            return;
        }

        if (userAnswer === currentQuestion.answer) {
            score++;
            scoreDisplay.textContent = score;
            messageDisplay.textContent = "Benar!";
            messageDisplay.style.color = "green";
            generateQuestion(); // Lanjut ke soal berikutnya
        } else {
            messageDisplay.textContent = `Salah! Jawaban yang benar adalah ${currentQuestion.answer}.`;
            messageDisplay.style.color = "red";
        }
    }

    function startGame() {
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        startButton.classList.add('hidden');
        restartButton.classList.add('hidden');
        messageDisplay.textContent = '';
        generateQuestion();
        answerInput.disabled = false;
        submitAnswerButton.disabled = false;

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        messageDisplay.textContent = `Waktu Habis! Skor akhir Anda: ${score}`;
        messageDisplay.style.color = "blue";
        answerInput.disabled = true;
        submitAnswerButton.disabled = true;
        restartButton.classList.remove('hidden');
    }

    function resetGame() {
        clearInterval(timer);
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        questionDisplay.textContent = '';
        answerInput.value = '';
        messageDisplay.textContent = 'Tekan "Mulai Game!" untuk memulai.';
        answerInput.disabled = true;
        submitAnswerButton.disabled = true;
        startButton.classList.remove('hidden');
        restartButton.classList.add('hidden');
    }

    // --- Logika Login/Logout ---
    function showLoginSection() {
        loginSection.classList.remove('hidden');
        gameSection.classList.add('hidden');
        passwordInput.value = '';
        loginMessage.textContent = '';
        passwordInput.focus();
        clearInterval(timer); // Pastikan timer game berhenti jika logout saat game berjalan
        messageDisplay.textContent = 'Anda telah logout.'; // Beri pesan setelah logout
    }

    function showGameSection() {
        loginSection.classList.add('hidden');
        gameSection.classList.remove('hidden');
        resetGame(); // Reset game state setiap kali berhasil login
    }

    // Penanganan klik tombol Login
    loginButton.addEventListener('click', () => {
        if (passwordInput.value === CORRECT_PASSWORD) {
            loginMessage.textContent = "Login Berhasil!";
            loginMessage.style.color = "green";
            setTimeout(showGameSection, 500); // Tunggu sebentar sebelum beralih
        } else {
            loginMessage.textContent = "Password Salah. Coba lagi.";
            loginMessage.style.color = "red";
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    // Penanganan klik tombol Logout DENGAN KONFIRMASI SWEETALERT2
    logoutButton.addEventListener('click', () => {
        Swal.fire({
            title: 'Apakah Anda yakin ingin logout?',
            text: "Anda akan kembali ke halaman login.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Logout!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                showLoginSection(); // Panggil fungsi logout jika user mengkonfirmasi
                Swal.fire(
                    'Logout!',
                    'Anda berhasil logout.',
                    'success'
                );
            }
        });
    });

    // Penanganan Enter pada input password
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });

    // --- Event Listeners untuk Game ---
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', resetGame);
    submitAnswerButton.addEventListener('click', checkAnswer);

    // Penanganan Enter pada input jawaban
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // --- Inisialisasi Saat Halaman Dimuat ---
    showLoginSection(); // Pastikan halaman dimulai dengan tampilan login
});

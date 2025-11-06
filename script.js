// Daftar simbol yang mungkin
const symbols = ["🍒", "🍋", "🔔", "🍉", "⭐", "💎"];

// --- VARIABEL "MEMORI" / STATE BARU ---
// Ini adalah variabel yang melacak status permainan
let spinCount = 0; // Menghitung jumlah putaran
let winCount = 0;  // Menghitung jumlah kemenangan
// ------------------------------------

// Dapatkan elemen tombol, wadah mesin, dan pesan status
const spinButton = document.getElementById('spin-button');
const machine = document.getElementById('slot-machine');
const statusMessage = document.getElementById('status-message'); // Elemen baru
let reelContainers = [];

/**
 * Fungsi untuk membuat elemen simbol acak
 */
function createSymbolElement() {
    const div = document.createElement('div');
    div.classList.add('symbol');
    div.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    return div;
}

/**
 * Fungsi untuk mengisi satu reel dengan simbol-simbol awal
 */
function initializeReel(reelContainer) {
    for (let i = 0; i < 20; i++) {
        reelContainer.appendChild(createSymbolElement());
    }
}

/**
 * Fungsi: Membuat grid 6x6 (tidak berubah)
 */
function createGrid() {
    machine.innerHTML = '';
    reelContainers = [];

    for (let i = 0; i < 36; i++) {
        const reel = document.createElement('div');
        reel.classList.add('reel');
        const reelContainer = document.createElement('div');
        reelContainer.classList.add('reel-container');
        initializeReel(reelContainer);
        reel.appendChild(reelContainer);
        machine.appendChild(reel);
        reelContainers.push(reelContainer);
    }
}

/**
 * Fungsi: Logika putaran yang diperbarui (LOGIKA BARU)
 */
function spin() {
    // 1. Bersihkan pesan status lama
    statusMessage.textContent = '';
    
    // 2. Tambah penghitung putaran
    spinCount++;

    // 3. Tentukan apakah ini putaran kemenangan
    const isWinningSpin = (spinCount === 10);
    let jackpotTriggered = false; // Tandai jika jackpot terpicu

    if (isWinningSpin) {
        winCount++; // Tambah penghitung kemenangan
        spinCount = 0; // Reset penghitung putaran
        
        // Tampilkan pesan "Menang!"
        statusMessage.textContent = 'Menang!';

        // 4. Periksa apakah ini adalah kemenangan ke-3 (JACKPOT)
        if (winCount === 3) {
            jackpotTriggered = true;
            winCount = 0; // Reset penghitung kemenangan
            
            // Tampilkan pesan "Jackpot!"
            statusMessage.textContent = 'JACKPOT!';
        }
    }

    // Loop melalui semua 36 reel container
    reelContainers.forEach((reel, index) => {
        
        // Reset animasi (sama seperti sebelumnya)
        reel.style.transition = 'none';
        
        setTimeout(() => {
            reel.style.transform = 'translateY(0)';
            reel.offsetHeight; 

            // Buat simbol-simbol baru
            reel.innerHTML = '';
            for (let i = 0; i < 20; i++) {
                reel.appendChild(createSymbolElement());
            }

            // --- Tentukan Simbol Akhir (LOGIKA BARU) ---
            const finalSymbol = createSymbolElement();
            
            // Jika ini putaran kemenangan, PAKSA simbolnya menjadi '💎'
            if (isWinningSpin) {
                finalSymbol.textContent = '💎'; // Simbol kemenangan (Jackpot)
            }
            
            reel.appendChild(finalSymbol);
            // -----------------------------------------

            // Tentukan posisi akhir
            const targetPosition = -finalSymbol.offsetTop;

            // Beri durasi dan delay acak (sama seperti sebelumnya)
            const spinDuration = 1 + Math.random() * 0.8;
            const spinDelay = Math.random() * 0.5;

            reel.style.transition = `transform ${spinDuration}s cubic-bezier(0.33, 1, 0.68, 1) ${spinDelay}s`;

            // Mulai animasi
            reel.style.transform = `translateY(${targetPosition}px)`;

        }, 0);
    });

    // 5. Terapkan EFEK JACKPOT jika terpicu
    if (jackpotTriggered) {
        // Tambahkan kelas 'jackpot-effect' ke mesin
        machine.classList.add('jackpot-effect');
        
        // Hapus kelas setelah animasi selesai (3 detik)
        // Ini penting agar animasi bisa diputar lagi nanti
        setTimeout(() => {
            machine.classList.remove('jackpot-effect');
        }, 3000); // 3000ms = 3 detik (animasi 1s, 3x pengulangan)
    }
}

// --- INISIALISASI ---
createGrid(); // Buat grid saat halaman dimuat
spinButton.addEventListener('click', spin); // Klik tombol akan memanggil 'spin'
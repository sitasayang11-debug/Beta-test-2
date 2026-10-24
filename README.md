# MLBB BETA WhatsApp Bot

Bot dasar WhatsApp dengan perintah `.menu`, `.ping`, `.mlbb`, dan `.owner`.

## Menjalankan di komputer
1. Pasang Node.js 20 atau lebih baru.
2. Jalankan `npm install`.
3. Jalankan `npm start`.
4. Buka WhatsApp di HP utama → Perangkat tertaut → Tautkan perangkat, lalu pindai QR dari terminal.
5. Kirim `.menu` ke akun WhatsApp yang ditautkan.

## Deploy ke Render
1. Upload isi folder ini ke repository GitHub milikmu.
2. Di Render pilih New → Blueprint, lalu pilih repository tersebut.
3. Deploy dan buka Logs untuk melihat QR jika sesi belum terhubung.
4. Pindai QR lewat WhatsApp → Perangkat tertaut.

**Penting:** filesystem layanan gratis dapat bersifat sementara dan layanan dapat tidur. Folder `session/` menyimpan kredensial login; jangan pernah mengunggahnya ke GitHub atau membagikannya. Untuk sesi persisten, gunakan hosting dengan persistent disk dan pasang disk ke direktori proyek, atau host yang menyimpan sesi secara persisten. Ini proyek starter, bukan layanan yang sudah tertaut ke akun WhatsApp Anda. Baileys adalah library tidak resmi; gunakan secara bertanggung jawab dan patuhi ketentuan WhatsApp.

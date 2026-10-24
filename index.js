import express from 'express';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import P from 'pino';
import qrcode from 'qrcode-terminal';
import fs from 'node:fs';

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_req, res) => res.type('text').send('MLBB BETA WhatsApp Bot aktif.'));
app.get('/health', (_req, res) => res.json({ ok: true, bot: 'MLBB BETA' }));
app.listen(PORT, '0.0.0.0', () => console.log(`Web health server aktif pada port ${PORT}`));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['MLBB BETA', 'Chrome', '1.0.0'],
    printQRInTerminal: false
  });

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('\nPindai QR ini melalui WhatsApp > Perangkat tertaut > Tautkan perangkat:');
      qrcode.generate(qr, { small: true });
    }
    if (connection === 'open') console.log('✅ MLBB BETA terhubung ke WhatsApp.');
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      console.log('Koneksi terputus. Kode:', code);
      if (code !== DisconnectReason.loggedOut) setTimeout(() => startBot().catch(console.error), 3000);
      else console.log('Sesi keluar. Hapus folder session dan jalankan ulang untuk menautkan kembali.');
    }
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe || msg.key.remoteJid === 'status@broadcast') continue;
      const jid = msg.key.remoteJid;
      const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').trim();
      if (!text.startsWith('.')) continue;
      const cmd = text.split(/\s+/)[0].toLowerCase();
      let reply;
      if (cmd === '.menu' || cmd === '.help') {
        reply = `╭──「 🤖 MLBB BETA 」\n│ .menu  - Tampilkan menu\n│ .ping  - Cek bot\n│ .mlbb  - Info Mobile Legends\n│ .owner - Info pengelola\n╰──────────────`; 
      } else if (cmd === '.ping') {
        reply = '🏓 Pong! MLBB BETA aktif.';
      } else if (cmd === '.mlbb') {
        reply = '🎮 MOBILE LEGENDS: BANG BANG\nMain sportif, kerja sama tim, dan lindungi akunmu.\nKetik .menu untuk melihat perintah bot.';
      } else if (cmd === '.owner') {
        reply = '👑 Bot MLBB BETA. Atur informasi pengelola di file index.js.';
      }
      if (reply) await sock.sendMessage(jid, { text: reply }, { quoted: msg }).catch(console.error);
    }
  });
}

startBot().catch(err => { console.error('Gagal menjalankan bot:', err); process.exit(1); });

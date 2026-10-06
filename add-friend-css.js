const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const addFriendModalCss = `
/* ========================================================
   MODAL DE AÑADIR NUEVOS AMIGOS / SPOTTERS SUGERIDOS
   ======================================================== */
.add-friend-card {
  max-width: 480px;
  width: 95%;
}

.add-friend-search-wrap {
  margin-bottom: 18px;
}

.suggested-spotters-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suggested-title-label {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.suggested-spotters-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 290px;
  overflow-y: auto;
  padding-right: 4px;
}

.suggested-user-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.suggested-user-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(56, 189, 248, 0.3);
}

.suggested-user-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.suggested-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(56, 189, 248, 0.3);
}

.suggested-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.suggested-meta strong {
  font-size: 0.9rem;
  color: #ffffff;
}

.suggested-meta small {
  font-size: 0.74rem;
  color: var(--text-muted);
}

.btn-send-friend-req {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  border: none;
  color: #0b0f19;
  font-weight: 800;
  font-size: 0.78rem;
  padding: 7px 14px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.btn-send-friend-req:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.4);
}

.btn-send-friend-req.sent {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  cursor: default;
  box-shadow: none;
  transform: none;
}

/* Modo claro para añadir amigos */
[data-theme="light"] .suggested-user-card {
  background: #f8fafc;
  border-color: rgba(15, 23, 42, 0.08);
}

[data-theme="light"] .suggested-user-card:hover {
  background: #f1f5f9;
  border-color: rgba(2, 132, 199, 0.3);
}

[data-theme="light"] .suggested-meta strong {
  color: #0f172a;
}

[data-theme="light"] .suggested-meta small {
  color: #64748b;
}
`;

if (!css.includes('MODAL DE AÑADIR NUEVOS AMIGOS')) {
  css += '\n' + addFriendModalCss;
  fs.writeFileSync('style.css', css, 'utf8');
  console.log('style.css: Estilos para añadir amigos agregados');
} else {
  console.log('style.css ya contenia los estilos');
}

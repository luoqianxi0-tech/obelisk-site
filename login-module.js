// Login Module JS
function openModal() {
    document.getElementById('loginModal').classList.add('show');
}
function closeModal() {
    document.getElementById('loginModal').classList.remove('show');
}
function googleSignIn() {
    if (!window.auth || !window.provider) {
        console.error('[OBELISK] Auth not initialized');
        return;
    }
    window.auth.signInWithPopup(window.provider).catch(function(err) {
        if (window.addLog) {
            window.addLog('auth.error', '&#8594; ' + err.message, 'err');
        }
        console.error('[OBELISK Auth]', err.code, err.message);
    });
}
function logout() {
    if (!window.auth) return;
    window.auth.signOut();
    if (window.addLog) {
        window.addLog('auth.state', '&#8594; session terminated', 'out');
    }
}
// Close on overlay click
document.addEventListener('click', function(e) {
    if (e.target.id === 'loginModal') closeModal();
});
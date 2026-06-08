// Supabase Configuration and Helpers
const SUPABASE_URL = "https://wpnhelhqemjrcifpnufo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbmhlbGhxZW1qcmNpZnBudWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzI3NjEsImV4cCI6MjA5NTAwODc2MX0.S-ZE_QWQ3OqOEJc6qZVoSoVaYID_jUj4K45d7o5zLJc";

// Load Supabase Client library dynamically if not loaded
if (typeof supabase === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.async = false;
    document.head.appendChild(script);
}

let supabaseClient;
function getSupabase() {
    if (!supabaseClient && typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

// Check auth state
function getCurrentUser() {
    const userStr = sessionStorage.getItem('support_portal_user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            console.error("Error parsing user session:", e);
        }
    }
    // Tạm thời trả về user mock để không bắt buộc đăng nhập khi test
    return {
        id: "a787b8d6-1e88-4478-bdef-6aaa7bc14fc5", // ID của customer@gmail.com trên Supabase
        email: "customer@gmail.com",
        full_name: "Test Customer",
        role: "CUSTOMER"
    };
}

function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf('/') + 1);
        if (file !== 'login.html') {
            window.location.href = 'login.html';
        }
    }
    return user;
}

function logout() {
    sessionStorage.removeItem('support_portal_user');
    window.location.href = 'login.html';
}

// Expose functions globally once the window loads or immediately
window.getCurrentUser = getCurrentUser;
window.checkAuth = checkAuth;
window.logout = logout;
window.getSupabase = getSupabase;

// Automatically sync user profile header details across all pages
document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if (user) {
        const nameEl = document.getElementById('user-display-name') || document.getElementById('header-username');
        if (nameEl) {
            nameEl.textContent = user.full_name || user.username || user.email || 'User';
            nameEl.classList.remove('animate-pulse');
        }
    }
});

// Backend Integration Example for Browser Phone Login
// =================================================

// This file shows how to integrate the login system with a real backend
// Replace the local validation with API calls to your authentication server

// Configuration
const API_BASE_URL = 'https://api.voipeasy.com.br'; // Replace with your API URL
const API_TIMEOUT = 10000; // 10 seconds timeout

// Enhanced login validation with backend integration
function validateCredentialsBackend(username, password, callback) {
    console.log('Validating credentials with backend...');
    
    $.ajax({
        url: `${API_BASE_URL}/auth/login`,
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        timeout: API_TIMEOUT,
        data: JSON.stringify({
            username: username,
            password: password,
            client: 'browser-phone',
            version: '1.0.0'
        }),
        success: function(response) {
            console.log('Backend response:', response);
            
            if (response.success && response.user) {
                // Login successful
                const user = response.user;
                
                // Save authentication token
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('tokenExpiry', response.expiry);
                
                // Save user data
                localStorage.setItem('username', username);
                localStorage.setItem('password', password); // Consider not storing password
                localStorage.setItem('displayName', user.displayName);
                localStorage.setItem('userId', user.id);
                
                // Save SIP credentials from backend
                localStorage.setItem('SipUsername', user.sipUsername);
                localStorage.setItem('SipPassword', user.sipPassword);
                localStorage.setItem('wssServer', user.wssServer);
                localStorage.setItem('WebSocketPort', user.webSocketPort);
                localStorage.setItem('ServerPath', user.serverPath);
                localStorage.setItem('SipDomain', user.sipDomain);
                
                // Call success callback
                callback(true, user);
            } else {
                // Login failed
                callback(false, response.message || 'Credenciais inválidas');
            }
        },
        error: function(xhr, status, error) {
            console.error('Backend validation error:', status, error);
            
            let errorMessage = 'Erro de conexão com o servidor';
            
            if (xhr.status === 401) {
                errorMessage = 'Usuário ou senha incorretos';
            } else if (xhr.status === 403) {
                errorMessage = 'Acesso negado. Contate o administrador';
            } else if (xhr.status === 429) {
                errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos';
            } else if (xhr.status === 500) {
                errorMessage = 'Erro interno do servidor';
            } else if (status === 'timeout') {
                errorMessage = 'Tempo limite excedido. Verifique sua conexão';
            }
            
            callback(false, errorMessage);
        }
    });
}

// Check if user session is still valid
function checkSessionValidity(callback) {
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) {
        callback(false, 'Sessão expirada');
        return;
    }
    
    // Check if token is expired
    if (new Date() > new Date(expiry)) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiry');
        callback(false, 'Sessão expirada');
        return;
    }
    
    // Validate token with backend
    $.ajax({
        url: `${API_BASE_URL}/auth/validate`,
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        timeout: API_TIMEOUT,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify({
            client: 'browser-phone'
        }),
        success: function(response) {
            if (response.valid) {
                callback(true, response.user);
            } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('tokenExpiry');
                callback(false, 'Sessão inválida');
            }
        },
        error: function(xhr, status, error) {
            console.error('Session validation error:', status, error);
            callback(false, 'Erro ao validar sessão');
        }
    });
}

// Logout function
function logout() {
    const token = localStorage.getItem('authToken');
    
    if (token) {
        // Notify backend about logout
        $.ajax({
            url: `${API_BASE_URL}/auth/logout`,
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            timeout: API_TIMEOUT
        }).always(function() {
            // Clear local storage regardless of backend response
            clearLocalStorage();
        });
    } else {
        clearLocalStorage();
    }
}

// Clear all stored data
function clearLocalStorage() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('displayName');
    localStorage.removeItem('userId');
    localStorage.removeItem('SipUsername');
    localStorage.removeItem('SipPassword');
    localStorage.removeItem('wssServer');
    localStorage.removeItem('WebSocketPort');
    localStorage.removeItem('ServerPath');
    localStorage.removeItem('SipDomain');
}

// Get user profile from backend
function getUserProfile(callback) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        callback(false, 'Token não encontrado');
        return;
    }
    
    $.ajax({
        url: `${API_BASE_URL}/user/profile`,
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        timeout: API_TIMEOUT,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(response) {
            if (response.success) {
                callback(true, response.profile);
            } else {
                callback(false, response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Get profile error:', status, error);
            callback(false, 'Erro ao obter perfil do usuário');
        }
    });
}

// Update user profile
function updateUserProfile(profileData, callback) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        callback(false, 'Token não encontrado');
        return;
    }
    
    $.ajax({
        url: `${API_BASE_URL}/user/profile`,
        method: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        timeout: API_TIMEOUT,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(profileData),
        success: function(response) {
            if (response.success) {
                callback(true, response.profile);
            } else {
                callback(false, response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Update profile error:', status, error);
            callback(false, 'Erro ao atualizar perfil');
        }
    });
}

// Example of how to use these functions in login.js:

/*
// Replace the validateCredentials function in login.js with:

function validateCredentials(username, password) {
    validateCredentialsBackend(username, password, function(success, user) {
        if (success) {
            // Login successful
            console.log('Login successful for user:', user.displayName);
            
            // Update form fields with user's server config
            $('#wssServer').val(user.wssServer);
            $('#webSocketPort').val(user.webSocketPort);
            $('#serverPath').val(user.serverPath);
            $('#sipDomain').val(user.sipDomain);
            
            // Hide login screen and show loading
            $('#loginScreen').hide();
            $('.loading').show();
            
            // Initialize phone with credentials
            if (typeof InitPhone === 'function') {
                InitPhone();
            } else {
                const checkInitPhone = setInterval(function() {
                    if (typeof InitPhone === 'function') {
                        clearInterval(checkInitPhone);
                        InitPhone();
                    }
                }, 100);
            }
        } else {
            // Login failed
            showError(user); // user contains the error message
        }
    });
}

// Add session check on page load:

$(document).ready(function() {
    // Check if user has valid session
    checkSessionValidity(function(valid, user) {
        if (valid) {
            // User has valid session, auto-login
            console.log('Auto-login with valid session for user:', user.displayName);
            
            // Update form fields
            $('#wssServer').val(user.wssServer);
            $('#webSocketPort').val(user.webSocketPort);
            $('#serverPath').val(user.serverPath);
            $('#sipDomain').val(user.sipDomain);
            
            // Hide login screen and show loading
            $('#loginScreen').hide();
            $('.loading').show();
            
            // Initialize phone
            if (typeof InitPhone === 'function') {
                InitPhone();
            }
        } else {
            // No valid session, show login screen
            console.log('No valid session, showing login screen');
            $('.loading').hide();
        }
    });
});
*/ 
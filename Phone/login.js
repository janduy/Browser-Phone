// Login Management for Browser Phone
// ==================================

let usersData = null; // Cache para os dados dos usuários

$(document).ready(function() {
    // Hide loading screen initially
    $('.loading').hide();
    
    // Load users data
    loadUsersData();
    
    // Toggle server configuration fields
    $('#serverConfigToggle').click(function() {
        $('#serverConfigFields').toggleClass('show');
    });
    
    // Handle login form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        
        if (!username || !password) {
            showError('Por favor, preencha usuário e senha.');
            return;
        }
        
        // Validate credentials
        validateCredentials(username, password);
    });
});

// Validate user credentials
function validateCredentials(username, password) {
    if (!usersData) {
        showError('Dados dos usuários não carregados. Tente novamente.');
        return;
    }
    
    // Find user in the data
    const user = usersData.users.find(u => 
        u.username === username && u.password === password
    );
    
    if (user) {
        // Login successful
        console.log('Login successful for user:', user.displayName);
        
        // Save credentials to localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        localStorage.setItem('displayName', user.displayName);
        localStorage.setItem('SipUsername', user.sipUsername);
        localStorage.setItem('SipPassword', user.sipPassword);
        localStorage.setItem('wssServer', user.wssServer);
        localStorage.setItem('WebSocketPort', user.webSocketPort);
        localStorage.setItem('ServerPath', user.serverPath);
        localStorage.setItem('SipDomain', user.sipDomain);
        
        // Set default profileUserID if not exists
        if (!localStorage.getItem('profileUserID')) {
            localStorage.setItem('profileUserID', 'user_' + Date.now());
        }

        // Hide login screen
        $('#loginScreen').hide();
        
        // Load phone interface
        window.location.reload();
    } else {
        showError('Usuário ou senha inválidos.');
    }
}

// Show error message
function showError(message) {
    $('#loginError').show().text(message);
    setTimeout(function() {
        $('#loginError').hide();
    }, 5000);
}

// Load users data from JSON file
function loadUsersData() {
    $.getJSON('users.json')
        .done(function(data) {
            usersData = data;
            console.log('Users data loaded successfully');
        })
        .fail(function(jqXHR, textStatus, error) {
            console.error('Error loading users data:', error);
            showError('Erro ao carregar dados dos usuários. Recarregue a página.');
        });
} 
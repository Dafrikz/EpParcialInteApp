document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
        alert('Usuario registrado exitosamente. Token: ' + data.token);
        window.location.href = '/login.html'; // Redirigir a login.html
    } else {
        alert('Error al registrar usuario: ' + data.message);
    }
});
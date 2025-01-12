
const form = document.getElementById('suggestion');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
    
        localStorage.setItem('email', email);
    
        alert('Thanks for your suggestion!');
    });
    
}


const email = localStorage.getItem('email');
if (email) {
    document.getElementById('email').value = email;
}

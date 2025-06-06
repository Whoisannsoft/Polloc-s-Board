import { registerUser } from "./../../firebase/firebaseconfig";
import Navigate from "./../../utils/navegate";

class RegisterPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                }

                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #333;
                    font-family: Arial, sans-serif;
                }

                form {
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    width: 300px;
                }

                h2 {
                    margin: 0 0 20px;
                    color: #333;
                    text-align: center;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: #555;
                }

                .form-group input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                }

                .form-group input[type="checkbox"] {
                    width: auto;
                }

                .form-group .toggle-password {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 14px;
                    color: #555;
                }

                button {
                    width: 100%;
                    padding: 10px;
                    background-color:rgb(211, 76, 110);
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                }

                button:hover {
                    background-color:rgb(136, 33, 50);
                }
            </style>
            <form id="register-form">
                <h2>Registro</h2>
                <div class="form-group">
                    <label for="email">Correo electrónico</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="firstName">Nombre</label>
                    <input type="text" id="firstName" name="firstName" required>
                </div>
                <div class="form-group">
                    <label for="lastName">Apellido</label>
                    <input type="text" id="lastName" name="lastName" required>
                </div>
                <div class="form-group">
                    <label for="dob">Fecha de nacimiento</label>
                    <input type="date" id="dob" name="dob" required>
                </div>
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password" required>
                    <div class="toggle-password">
                        <input type="checkbox" id="show-password">
                        <label for="show-password">Mostrar contraseña</label>
                    </div>
                </div>
                <button type="submit">Registrarse</button>
            </form>
        `;

        const form = this.shadowRoot!.querySelector<HTMLFormElement>('#register-form')!;
        const passwordInput = form.querySelector<HTMLInputElement>('#password')!;
        const showPasswordCheckbox = form.querySelector<HTMLInputElement>('#show-password')!;

        showPasswordCheckbox.addEventListener('change', () => {
            passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                email: form.email.value,
                firstName: form.firstName.value,
                lastName: form.lastName.value,
                dob: form.dob.value,
                password: form.password.value,
            };
            console.log('Registro enviado:', data);

            registerUser(data.email, data.password)
                .then((response) => {
                    if (!response.isRegistered) {
                        console.error('Error al registrar el usuario:', response.error);
                        alert('Error al registrar el usuario. Por favor, verifica tus datos.');
                        return;
                    }
                    alert('Usuario registrado exitosamente.');
                    console.log('Usuario registrado:', response);
                    Navigate('/login');
                })
                .catch((error) => {
                    console.error('Error al registrar el usuario:', error);
                    alert('Ocurrió un error. Por favor, intenta nuevamente.');
                });
        });
    }
}

export default RegisterPage;

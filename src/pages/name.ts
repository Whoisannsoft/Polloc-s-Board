// src/components/NameScreen.ts

class NameScreen extends HTMLElement {
  private inputEl!: HTMLInputElement;
  private formEl!: HTMLFormElement;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }


  connectedCallback() {
    this.render();
    this.setupElements();
    this.setupListeners();
  }


  private setupElements() {
    this.inputEl = this.shadowRoot!.querySelector('input')!;
    this.formEl = this.shadowRoot!.querySelector('form')!;
  }

  private setupListeners() {
    this.formEl.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      const name = this.inputEl.value.trim();
      if (!name) {
        alert('Please enter your name.');
        return;
      }

     
      localStorage.setItem('playerName', name);

      this.dispatchEvent(
        new CustomEvent('name-submitted', {
          detail: { name },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  private render() {
    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #fff;
          font-family: 'Segoe UI', sans-serif;
        }

        .container {
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        h1 {
          font-size: 1.8rem;
          font-w; 
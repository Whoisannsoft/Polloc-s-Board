
class LetterScreen extends HTMLElement {
  private selectedLetter: string | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  private setupListeners() {
    const letterButtons = this.shadowRoot!.querySelectorAll('.letter-btn');
    const nextBtn = this.shadowRoot!.querySelector('#next-btn')!;
    const skipBtn = this.shadowRoot!.querySelector('#skip-btn')!;

    letterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedLetter = (btn as HTMLButtonElement).textContent!;
        this.highlightSelected(btn as HTMLButtonElement);
      });
    });

    nextBtn.addEventListener('click', () => {
      if (!this.selectedLetter) {
        alert('Please choose a letter or skip.');
        return;
      }

      localStorage.setItem('playerLetter', this.selectedLetter);

      this.dispatchEvent(
        new CustomEvent('letter-selected', {
          detail: { letter: this.selectedLetter },
          bubbles: true,
          composed: true,
        })
      );
    });

    skipBtn.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('

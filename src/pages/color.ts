
class ColorScreen extends HTMLElement {
  private selectedColor: string = '';
  private selectedOpacity: number = 1;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  private setupListeners() {
    const colorButtons = this.shadowRoot!.querySelectorAll('.color-btn');
    const opacitySlider = this.shadowRoot!.querySelector('#opacity') as HTMLInputElement;
    const selectBtn = this.shadowRoot!.querySelector('button')!;

    colorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedColor = (btn as HTMLButtonElement).dataset.color!;
        this.highlightSelected(btn as HTMLButtonElement);
      });
    });

    opacitySlider.addEventListener('input', () => {
      this.selectedOpacity = parseFloat(opacitySlider.value);
      const label = this.shadowRoot!.querySelector('#opacity-label')!;
      label.textContent = `${Math.round(this.selectedOpacity * 100)}%`;
    });

    selectBtn.addEventListener('click', () => {
      if (!this.selectedColor) {
        alert('Please select a color.');
        return;
      }

      const rgbaColor = this.hexToRgba(this.selectedColor, this.selectedOpacity);

      localStorage.setItem('playerColor', rgbaColor);

      this.dispatchEvent(
        new CustomEvent('color-selected', {
          detail: { color: rgbaColor },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  private highlightSelected(selectedBtn: HTMLButtonElement) {
    const buttons = this.shadowRoot!.querySelectorAll('.color-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    selectedBtn.classList.add('selected');
  }

  private hexToRgba(colorName: string, opacity: number): string {
    const temp = document.createElement('div');
    temp.style.color = colorName;
    document.body.appendChild(temp);
    const computed = getComputedStyle(temp).color;
    document.body.removeChild(temp);
    return computed.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }

  private render() {
    const colors = [
      'Black', 'Red', 'Lime', 'Blue', 'Yellow',
      'Fuchsia', 'Aqua', 'Gray', 'Silver', 'Maroon',
      'Green', 'Navy', 'Olive', 'Purple', 'Teal', 'White'
    ];

    const colorButtons = colors
      .map(
        color => `<button class="color-btn" data-color="${color}" style="color:${color}">${color}</button>`
      )
      .join('');

    this.shadowRoot!.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          background-color: #fff;
        }

        .container {
          max-width: 600px;
          width: 100%;
          text-align: center;
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .color-btn {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          cursor: pointer;
          background: white;
          font-weight: bold;
        }

        .color-btn.selected {
          outline: 3px solid orange;
        }

        .opacity-control {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        input[type="range"] {
          width: 200px;
        }

        button[type="submit"] {
          background-color: orange;
          color: white;
          padding: 0.6rem 2rem;
          border: none;
          border-radius: 999px;
          font-size: 1rem;
          cursor: pointer;
        }

        button[type="submit"]:hover {
          background-color: darkorange;
        }
      </style>

      <div class="container">
        <h2>Color Palette</h2>
        <div class="grid">${colorButtons}</div>
        <div class="opacity-control">
          <label for="opacity">Opacity</label>
          <input type="range" id="opacity" min="0" max="1" step="0.01" value="1" />
          <span id="opacity-label">100%</span>
        </div>
        <button type="submit">Select</button>
      </div>
    `;
  }
}

customElements.define('color-screen', ColorScreen);

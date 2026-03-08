export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return (
            `
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
                <div class="container">
                    <a class="navbar-brand" href="#" id="home-link">☕ Рецепты кофе</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="#" id="home-link-nav">Домой</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            `
        );
    }

    addListeners() {
        const homeLinks = document.querySelectorAll('#home-link, #home-link-nav');
        homeLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const event = new CustomEvent('navigate-home', {
                    bubbles: true,
                    composed: true
                });
                e.target.dispatchEvent(event);
            });
        });
    }

    render() {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('afterbegin', html);
        this.addListeners();
    }
}
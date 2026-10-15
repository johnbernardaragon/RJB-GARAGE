document.addEventListener('DOMContentLoaded', () => {
    const filters = [...document.querySelectorAll('.filter')];
    const cards = [...document.querySelectorAll('.vehicle')];
    const vehicleDialog = document.getElementById('vehicle-dialog');
    const menuToggle = document.getElementById('menu-toggle');
    const links = document.getElementById('main-links');

    filters.forEach((button) => {
        button.addEventListener('click', () => {
            filters.forEach((item) => item.classList.toggle('active', item === button));
            const filter = button.dataset.filter;

            cards.forEach((card) => {
                const matches = filter === 'all'
                    || (filter === 'available' && card.dataset.status === 'available')
                    || card.dataset.kind === filter
                    || (filter === 'unavailable' && card.dataset.status === 'unavailable');
                card.hidden = !matches;
            });
        });
    });

    if (vehicleDialog) {
        const dialogImage = vehicleDialog.querySelector('.dialog-image');
        const dialogInterest = vehicleDialog.querySelector('[data-dialog-interest]');

        cards.forEach((card) => {
            card.querySelector('[data-open-vehicle]').addEventListener('click', () => {
                vehicleDialog.querySelector('[data-dialog-type]').textContent = card.dataset.type;
                vehicleDialog.querySelector('[data-dialog-name]').textContent = card.dataset.name;
                vehicleDialog.querySelector('[data-dialog-description]').textContent = card.dataset.description;
                vehicleDialog.querySelector('[data-dialog-number]').textContent = card.dataset.number;
                dialogImage.src = card.dataset.image;
                dialogImage.alt = card.dataset.alt;
                dialogInterest.value = card.dataset.name;

                const status = vehicleDialog.querySelector('[data-dialog-status]');
                const available = card.dataset.status === 'available';
                status.textContent = available ? 'Available for inquiry' : 'Currently unavailable';
                status.classList.toggle('unavailable', !available);

                const specs = vehicleDialog.querySelector('[data-dialog-specs]');
                specs.replaceChildren(...JSON.parse(card.dataset.specs).map((spec) => {
                    const item = document.createElement('span');
                    item.textContent = spec;
                    return item;
                }));

                vehicleDialog.showModal();
            });
        });

        vehicleDialog.querySelector('[data-close-dialog]').addEventListener('click', () => vehicleDialog.close());
        vehicleDialog.addEventListener('click', (event) => {
            if (event.target === vehicleDialog) vehicleDialog.close();
        });
    }

    if (menuToggle && links) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!expanded));
            links.classList.toggle('open', !expanded);
        });

        links.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                links.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});


// Static-site inquiry handling: opens the visitor's configured email application.
// Replace the address below with the garage's real inquiry email before publishing.
const RJB_INQUIRY_EMAIL = 'YOUR_EMAIL@example.com';
document.querySelectorAll('[data-mailto-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        if (RJB_INQUIRY_EMAIL === 'YOUR_EMAIL@example.com') {
            alert('Before using inquiries, replace YOUR_EMAIL@example.com in js/app.js with the RJB Garage email address.');
            return;
        }
        const data = new FormData(form);
        const name = String(data.get('name') || '').trim();
        const contact = String(data.get('contact') || '').trim();
        const interest = String(data.get('interest') || data.get('interest_hidden') || '').trim();
        const message = String(data.get('message') || '').trim();
        const subject = `RJB Garage inquiry: ${interest || 'General inquiry'}`;
        const body = `Hello RJB Garage,\n\nI would like to inquire about: ${interest || 'General inquiry'}\n\nName: ${name}\nContact number: ${contact}\n\nMessage:\n${message || '(No additional message)'}\n\nSent from the RJB Garage website.`;
        window.location.href = `mailto:${RJB_INQUIRY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
});

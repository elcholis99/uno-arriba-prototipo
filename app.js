/**
 * UNO ARRIBA - Aplicación de Reserva de Canchas de Fútbol
 * Lógica dinámicos de 7 días, formulario de seña, Mercado Pago y WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. ESTADO GLOBAL DE LA APLICACIÓN
    // ==========================================
    const state = {
        selectedCourtId: 1,
        selectedDateObj: new Date(), // Comienza HOY
        selectedDateStr: formatDateKey(new Date()),
        selectedSlot: null,
        sevenDays: []
    };

    // ==========================================
    // 2. INICIALIZACIÓN DE LOCALSTORAGE & MOCK
    // ==========================================
    initLocalStorage();

    // ==========================================
    // 3. INICIALIZACIÓN DE COMPONENTES UI
    // ==========================================
    setupPlaceholdersAndContactInfo();
    renderCourts();
    renderBuffet();
    generateSevenDays();
    renderDayChips();
    renderSlots();
    setupEventListeners();
    setupMobileMenu();

    // ==========================================
    // FUNCIONES PRINCIPALES
    // ==========================================

    /**
     * Carga reservas iniciales de ejemplo en LocalStorage si no existen.
     * Ejemplo requerido: Hoy 20:00-21:00 en Cancha 1 -> OCUPADO por "La banda de la pelota vs Los pollos"
     */
    function initLocalStorage() {
        const existing = localStorage.getItem('uno_arriba_bookings');
        if (!existing) {
            const todayStr = formatDateKey(new Date());
            const initialBookings = [
                {
                    courtId: 1,
                    dateStr: todayStr,
                    timeLabel: "20:00 - 21:00 hs",
                    customerNamePhone: "Carlos Gutiérrez - 11 5544-3322",
                    matchName: "La banda de la pelota vs Los pollos",
                    deposit: "$13.000",
                    timestamp: Date.now()
                }
            ];
            localStorage.setItem('uno_arriba_bookings', JSON.stringify(initialBookings));
        }
    }

    /**
     * Configura información de contacto y placeholders globales en el DOM
     */
    function setupPlaceholdersAndContactInfo() {
        document.getElementById('displayDireccion').textContent = DIRECCION;
        document.getElementById('displayTelefono').textContent = TELEFONO;
        document.getElementById('footerDireccion').textContent = DIRECCION;
        document.getElementById('footerTelefono').textContent = TELEFONO;

        document.getElementById('googleMapsEmbed').src = GOOGLE_MAPS_EMBED_URL;

        const mapsBtn = document.getElementById('btnOpenMaps');
        if (mapsBtn) mapsBtn.href = GOOGLE_MAPS_URL;

        const footerIg = document.getElementById('footerInstagram');
        if (footerIg) footerIg.href = INSTAGRAM_URL;

        const footerWsp = document.getElementById('footerWhatsapp');
        if (footerWsp) footerWsp.href = `https://wa.me/${WHATSAPP_COMPLEJO}`;

        document.getElementById('currentYear').textContent = new Date().getFullYear();
    }

    /**
     * Renderiza las 5 Tarjetas de Canchas
     */
    function renderCourts() {
        const grid = document.getElementById('courtsGrid');
        if (!grid) return;

        grid.innerHTML = COURTS_DATA.map(court => `
            <div class="court-card" data-court-id="${court.id}">
                <div class="court-image-wrapper">
                    <img src="${court.image}" alt="${court.name} ${court.category}" class="court-image">
                    <span class="court-category-badge">${court.category}</span>
                </div>
                <div class="court-body">
                    <div class="court-header">
                        <h3 class="court-name">${court.name}</h3>
                        <span class="court-price">${court.formattedPrice}</span>
                    </div>
                    <p class="court-description">${court.description}</p>
                    <button class="btn btn-primary court-btn btn-select-court" data-court-id="${court.id}">
                        VER HORARIOS
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Renderiza la Carta Digital del Buffet
     */
    function renderBuffet() {
        const drinksGrid = document.getElementById('drinksGrid');
        const foodGrid = document.getElementById('foodGrid');

        if (drinksGrid) {
            drinksGrid.innerHTML = BUFFET_DATA.drinks.map(item => `
                <div class="buffet-item-card">
                    <img src="${item.image}" alt="${item.name}" class="buffet-item-img">
                    <div class="buffet-item-info">
                        <div class="buffet-item-name">${item.name}</div>
                        <div class="buffet-item-price">${item.formattedPrice || item.price}</div>
                    </div>
                </div>
            `).join('');
        }

        if (foodGrid) {
            foodGrid.innerHTML = BUFFET_DATA.food.map(item => `
                <div class="buffet-item-card">
                    <img src="${item.image}" alt="${item.name}" class="buffet-item-img">
                    <div class="buffet-item-info">
                        <div class="buffet-item-name">${item.name}</div>
                        <div class="buffet-item-price">${item.formattedPrice || item.price}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    /**
     * Genera dinámicamente los próximos 7 DÍAS estrictos comenzando desde HOY
     */
    function generateSevenDays() {
        state.sevenDays = [];
        const daysOfWeek = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);

            let labelDay = daysOfWeek[date.getDay()];
            let labelDate = date.getDate();

            let displayName = `${labelDay} ${labelDate}`;
            if (i === 0) displayName = "HOY";
            else if (i === 1) displayName = "MAÑANA";

            state.sevenDays.push({
                index: i,
                dateObj: date,
                dateStr: formatDateKey(date),
                dayName: displayName,
                fullLabel: formatDateFull(date)
            });
        }
    }

    /**
     * Renderiza los Chips Horizontales de los 7 Días
     */
    function renderDayChips() {
        const wrapper = document.getElementById('daysWrapper');
        if (!wrapper) return;

        wrapper.innerHTML = state.sevenDays.map(day => `
            <div class="day-chip ${day.dateStr === state.selectedDateStr ? 'active' : ''}" data-date-str="${day.dateStr}">
                <span class="day-name">${day.dayName}</span>
                <span class="day-date">${day.dateObj.getDate()}/${day.dateObj.getMonth() + 1}</span>
            </div>
        `).join('');
    }

    /**
     * Renderiza la grilla de horarios DISPONIBLE / OCUPADO
     */
    function renderSlots() {
        const container = document.getElementById('slotsContainer');
        const bannerTitle = document.getElementById('selectedCourtTitle');
        const bannerPrice = document.getElementById('selectedCourtPrice');

        const currentCourt = COURTS_DATA.find(c => c.id === state.selectedCourtId) || COURTS_DATA[0];

        if (bannerTitle) bannerTitle.textContent = `${currentCourt.category} — ${currentCourt.name}`;
        if (bannerPrice) bannerPrice.textContent = `${currentCourt.formattedPrice} / Hora — Seña (50%): $${formatNumber(Math.round(currentCourt.price * 0.5))}`;

        // Obtener reservas almacenadas
        const bookings = getStoredBookings();

        if (!container) return;

        container.innerHTML = TIME_SLOTS.map(slot => {
            // Verificar si el turno está reservado
            const isBooked = bookings.find(b => 
                b.courtId === state.selectedCourtId && 
                b.dateStr === state.selectedDateStr && 
                b.timeLabel === slot.label
            );

            if (isBooked) {
                return `
                    <div class="slot-card occupied">
                        <div class="slot-time-info">
                            <div class="slot-time">
                                🔴 ${slot.label}
                            </div>
                            <span class="slot-status-badge">OCUPADO</span>
                            <div class="match-name">
                                🏆 ${escapeHtml(isBooked.matchName || "Partido reservado")}
                            </div>
                        </div>
                        <button class="btn slot-action-btn disabled" disabled>
                            OCUPADO
                        </button>
                    </div>
                `;
            } else {
                return `
                    <div class="slot-card available">
                        <div class="slot-time-info">
                            <div class="slot-time">
                                🟢 ${slot.label}
                            </div>
                            <span class="slot-status-badge">DISPONIBLE</span>
                        </div>
                        <button class="btn btn-primary slot-action-btn btn-open-booking" data-slot-label="${slot.label}">
                            DISPONIBLE
                        </button>
                    </div>
                `;
            }
        }).join('');
    }

    /**
     * Configuración de Eventos de Interacción
     */
    function setupEventListeners() {
        // Seleccionar Cancha (Botones "VER HORARIOS")
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-select-court');
            if (btn) {
                const courtId = parseInt(btn.dataset.courtId, 10);
                selectCourt(courtId);
            }
        });

        // Seleccionar Día (Selector horizontal)
        const daysWrapper = document.getElementById('daysWrapper');
        if (daysWrapper) {
            daysWrapper.addEventListener('click', (e) => {
                const chip = e.target.closest('.day-chip');
                if (chip) {
                    state.selectedDateStr = chip.dataset.dateStr;
                    renderDayChips();
                    renderSlots();
                }
            });
        }

        // Abrir Modal de Reserva (Botón DISPONIBLE)
        const slotsContainer = document.getElementById('slotsContainer');
        if (slotsContainer) {
            slotsContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-open-booking');
                if (btn) {
                    const slotLabel = btn.dataset.slotLabel;
                    state.selectedSlot = TIME_SLOTS.find(s => s.label === slotLabel);
                    openBookingModal();
                }
            });
        }

        // Formulario de Reserva Submission
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', handleBookingSubmit);
        }

        // Cerrar Modales
        document.getElementById('closeBookingModalBtn')?.addEventListener('click', closeBookingModal);
        document.getElementById('closeConfirmationModalBtn')?.addEventListener('click', closeConfirmationModal);
    }

    /**
     * Cambia la cancha activa y hace scroll a disponibilidad
     */
    function selectCourt(courtId) {
        state.selectedCourtId = courtId;
        renderSlots();

        const section = document.getElementById('disponibilidad');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Abre y rellena el Modal de Reserva
     */
    function openBookingModal() {
        const currentCourt = COURTS_DATA.find(c => c.id === state.selectedCourtId);
        const dayData = state.sevenDays.find(d => d.dateStr === state.selectedDateStr);

        const depositAmount = Math.round(currentCourt.price * 0.5);

        document.getElementById('modalCourtName').textContent = `${currentCourt.category} - ${currentCourt.name}`;
        document.getElementById('modalDate').textContent = dayData ? dayData.fullLabel : state.selectedDateStr;
        document.getElementById('modalTime').textContent = state.selectedSlot.label;
        document.getElementById('modalTotalPrice').textContent = currentCourt.formattedPrice;
        document.getElementById('modalDepositPrice').textContent = `$${formatNumber(depositAmount)}`;

        const modal = document.getElementById('bookingModal');
        modal?.classList.add('active');
    }

    function closeBookingModal() {
        document.getElementById('bookingModal')?.classList.remove('active');
    }

    function closeConfirmationModal() {
        document.getElementById('confirmationModal')?.classList.remove('active');
    }

    /**
     * Procesa la Reserva y Abre Mercado Pago + Confirmación
     */
    function handleBookingSubmit(e) {
        e.preventDefault();

        const namePhoneInput = document.getElementById('customerNamePhone').value.trim();
        const matchNameInput = document.getElementById('matchName').value.trim();

        if (!namePhoneInput || !matchNameInput) return;

        const currentCourt = COURTS_DATA.find(c => c.id === state.selectedCourtId);
        const depositVal = Math.round(currentCourt.price * 0.5);
        const depositFormatted = `$${formatNumber(depositVal)}`;
        const dayData = state.sevenDays.find(d => d.dateStr === state.selectedDateStr);

        // Guardar Reserva en LocalStorage
        const newBooking = {
            courtId: state.selectedCourtId,
            dateStr: state.selectedDateStr,
            timeLabel: state.selectedSlot.label,
            customerNamePhone: namePhoneInput,
            matchName: matchNameInput,
            deposit: depositFormatted,
            timestamp: Date.now()
        };

        saveBooking(newBooking);

        // Abrir link de Mercado Pago asignado a la cancha
        const mpLink = PAYMENT_LINKS[state.selectedCourtId] || MERCADO_PAGO_LINK_CANCHA_1;
        if (mpLink && mpLink !== "#") {
            window.open(mpLink, '_blank');
        }

        // Actualizar UI
        closeBookingModal();
        renderSlots();

        // Mostrar Modal de Confirmación
        showConfirmationModal({
            courtName: `${currentCourt.category} - ${currentCourt.name}`,
            matchName: matchNameInput,
            dateLabel: dayData ? dayData.fullLabel : state.selectedDateStr,
            timeLabel: state.selectedSlot.label,
            deposit: depositFormatted,
            namePhone: namePhoneInput
        });
    }

    /**
     * Muestra la Pantalla de Confirmación y Prepara el Mensaje de WhatsApp
     */
    function showConfirmationModal(details) {
        document.getElementById('confCourtName').textContent = details.courtName;
        document.getElementById('confMatchName').textContent = details.matchName;
        document.getElementById('confDate').textContent = details.dateLabel;
        document.getElementById('confTime').textContent = details.timeLabel;
        document.getElementById('confDeposit').textContent = details.deposit;

        // Construir Mensaje de WhatsApp Dinámico Codificado
        const rawMessage = 
`Hola UNO ARRIBA 👋

Quería avisar que reservé una cancha.

⚽ Cancha: ${details.courtName}
📅 Fecha: ${details.dateLabel}
🕐 Horario: ${details.timeLabel}
👤 Responsable: ${details.namePhone}
🏆 Partido: ${details.matchName}
💰 Seña: ${details.deposit}

📍 Ubicación:
${GOOGLE_MAPS_URL}

¡Gracias!`;

        const encodedMessage = encodeURIComponent(rawMessage);
        const whatsappUrl = `https://wa.me/${WHATSAPP_COMPLEJO}?text=${encodedMessage}`;

        const btnWsp = document.getElementById('btnSendWhatsApp');
        if (btnWsp) btnWsp.href = whatsappUrl;

        const btnConfMaps = document.getElementById('btnConfMaps');
        if (btnConfMaps) btnConfMaps.href = GOOGLE_MAPS_URL;

        document.getElementById('confirmationModal')?.classList.add('active');
    }

    /**
     * Menú Hamburguesa Responsivo
     */
    function setupMobileMenu() {
        const btn = document.getElementById('hamburgerBtn');
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileMenuOverlay');

        function toggleMenu() {
            btn?.classList.toggle('active');
            menu?.classList.toggle('active');
            overlay?.classList.toggle('active');
        }

        btn?.addEventListener('click', toggleMenu);
        overlay?.addEventListener('click', toggleMenu);

        document.querySelectorAll('.mobile-nav-link, #mobileReserveBtn').forEach(link => {
            link.addEventListener('click', () => {
                btn?.classList.remove('active');
                menu?.classList.remove('active');
                overlay?.classList.remove('active');
            });
        });
    }

    // ==========================================
    // HELPER UTILITIES
    // ==========================================
    function getStoredBookings() {
        try {
            return JSON.parse(localStorage.getItem('uno_arriba_bookings')) || [];
        } catch (e) {
            return [];
        }
    }

    function saveBooking(booking) {
        const current = getStoredBookings();
        current.push(booking);
        localStorage.setItem('uno_arriba_bookings', JSON.stringify(current));
    }

    function formatDateKey(dateObj) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatDateFull(dateObj) {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return `${days[dateObj.getDay()]} ${dateObj.getDate()} de ${months[dateObj.getMonth()]}`;
    }

    function formatNumber(num) {
        return num.toLocaleString('es-AR');
    }

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});

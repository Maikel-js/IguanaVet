// INTERFACES Y TIPOS

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    iguanaName: string;
    iguanaAge: string;
}

interface Appointment {
    id: number;
    userId: number;
    date: string; 
    time: string; 
    reason: string;
    notes: string;
    status: 'programada' | 'cancelada';
}

type NotificationType = 'success' | 'error' | 'warning' | 'info';

type PageId = 'homePage' | 'loginPage' | 'registerPage' | 'dashboardPage';

type DashboardView = 'appointments' | 'calendar' | 'profile';

// CLASE PRINCIPAL DE LA APLICACIÓN

class IguanaVetApp {
    private users: User[] = [];
    private appointments: Appointment[] = [];
    private currentUser: User | null = null;
    private currentView: string = 'home';
    private currentDashboardView: DashboardView = 'appointments';

    constructor() {
        this.initializeData();
        this.bindEvents();
        this.showPage('homePage');
    }

    // INICIALIZACIÓN

    private initializeData(): void {
        this.users = [
            {
                id: 1,
                name: 'Ana García',
                email: 'ana@email.com',
                password: '123',
                phone: '809-555-0001',
                iguanaName: 'Verde',
                iguanaAge: '3 años'
            },
            {
                id: 2,
                name: 'Carlos López',
                email: 'carlos@email.com',
                password: '123',
                phone: '809-555-0002',
                iguanaName: 'Spike',
                iguanaAge: '5 años'
            },
            {
                id: 3,
                name: 'María Rodríguez',
                email: 'maria@email.com',
                password: '123',
                phone: '809-555-0003',
                iguanaName: 'Esmeralda',
                iguanaAge: '1 año'
            }
        ];

        this.appointments = [
            {
                id: 1,
                userId: 1,
                date: '2025-08-20',
                time: '10:00',
                reason: 'Chequeo general',
                notes: 'Revisión rutinaria de Verde',
                status: 'programada'
            },
            {
                id: 2,
                userId: 2,
                date: '2025-08-22',
                time: '14:30',
                reason: 'Problemas de piel',
                notes: 'Spike tiene manchas extrañas',
                status: 'programada'
            },
            {
                id: 3,
                userId: 1,
                date: '2025-08-18',
                time: '09:00',
                reason: 'Vacunación',
                notes: 'Vacuna anual',
                status: 'cancelada'
            }
        ];

        console.log('✅ Datos inicializados:', {
            usuarios: this.users.length,
            citas: this.appointments.length
        });
    }

    private bindEvents(): void {
        // Usar setTimeout para asegurar que el DOM esté completamente cargado
        setTimeout(() => {
            // Formulario de login
            const loginForm = this.getElementById<HTMLFormElement>('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            }

            // Formulario de registro
            const registerForm = this.getElementById<HTMLFormElement>('registerForm');
            if (registerForm) {
                registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            }

            // Formulario de citas
            const appointmentForm = this.getElementById<HTMLFormElement>('appointmentForm');
            if (appointmentForm) {
                appointmentForm.addEventListener('submit', (e) => this.handleCreateAppointment(e));
            }

            // Establecer fecha mínima para las citas
            const appointmentDate = this.getElementById<HTMLInputElement>('appointmentDate');
            if (appointmentDate) {
                const today = new Date().toISOString().split('T')[0];
                appointmentDate.setAttribute('min', today);
                appointmentDate.value = today;
            }

            // Animaciones
            this.addPageAnimations();

            console.log('✅ Eventos vinculados correctamente');
        }, 100);
    }

    private addPageAnimations(): void {
        if (typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-fade-in');
                        }, index * 100);
                    }
                });
            });

            document.querySelectorAll('.card, .feature-card').forEach(card => {
                observer.observe(card);
            });
        }
    }

    // NAVEGACIÓN

    public showPage(pageId: PageId): void {
        try {
            // Ocultar todas las páginas
            document.querySelectorAll('.page').forEach(page => {
                page.classList.add('hidden');
            });

            // Mostrar la página solicitada
            const targetPage = this.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.remove('hidden');
                targetPage.classList.add('animate-fade-in');
                this.currentView = pageId;

                if (pageId === 'dashboardPage' && this.currentUser) {
                    this.updateUserGreeting();
                    this.showDashboardView(this.currentDashboardView);
                }

                console.log(`📄 Página cambiada a: ${pageId}`);
            } else {
                console.warn(`⚠️ No se encontró la página: ${pageId}`);
            }
        } catch (error) {
            console.error('Error al cambiar de página:', error);
        }
    }

    public showDashboardView(viewName: DashboardView): void {
        try {
            // Actualizar navegación
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            const activeLink = document.querySelector(`[data-view="${viewName}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Ocultar todas las vistas
            document.querySelectorAll('.dashboard-view').forEach(view => {
                view.classList.add('hidden');
            });

            // Mostrar la vista solicitada
            const targetView = this.getElementById(`${viewName}View`);
            if (targetView) {
                targetView.classList.remove('hidden');
                targetView.classList.add('animate-slide-left');
                this.currentDashboardView = viewName;

                // Actualizar contenido específico
                switch (viewName) {
                    case 'appointments':
                        this.updateAppointmentsList();
                        break;
                    case 'calendar':
                        this.updateCalendar();
                        break;
                    case 'profile':
                        this.updateProfile();
                        break;
                }

                console.log(`📋 Vista del dashboard: ${viewName}`);
            } else {
                console.warn(`⚠️ No se encontró la vista: ${viewName}View`);
            }
        } catch (error) {
            console.error('Error al cambiar vista del dashboard:', error);
        }
    }

    // AUTENTICACIÓN

    private handleLogin(e: Event): void {
        e.preventDefault();

        try {
            const email = this.getInputValue('loginEmail').trim();
            const password = this.getInputValue('loginPassword');

            if (!email || !password) {
                this.showNotification('Por favor completa todos los campos', 'error');
                return;
            }

            const user = this.users.find(u => u.email === email && u.password === password);

            if (user) {
                this.currentUser = user;
                this.showPage('dashboardPage');
                this.clearForm('loginForm');
                this.showNotification('¡Bienvenido de vuelta!', 'success');
                console.log('✅ Login exitoso:', user.name);
            } else {
                this.showNotification('Credenciales incorrectas', 'error');
                console.log('❌ Login fallido para:', email);
            }
        } catch (error) {
            console.error('Error en login:', error);
            this.showNotification('Error al iniciar sesión', 'error');
        }
    }

    private handleRegister(e: Event): void {
        e.preventDefault();

        try {
            const formData: Omit<User, 'id'> = {
                name: this.getInputValue('registerName').trim(),
                email: this.getInputValue('registerEmail').trim().toLowerCase(),
                password: this.getInputValue('registerPassword'),
                phone: this.getInputValue('registerPhone').trim(),
                iguanaName: this.getInputValue('registerIguanaName').trim(),
                iguanaAge: this.getInputValue('registerIguanaAge').trim()
            };

            // Validaciones
            if (!formData.name || !formData.email || !formData.password || 
                !formData.phone || !formData.iguanaName || !formData.iguanaAge) {
                this.showNotification('Por favor completa todos los campos', 'error');
                return;
            }

            if (this.users.find(u => u.email === formData.email)) {
                this.showNotification('El email ya está registrado', 'error');
                return;
            }

            if (formData.password.length < 3) {
                this.showNotification('La contraseña debe tener al menos 3 caracteres', 'error');
                return;
            }

            // Crear nuevo usuario
            const newUser: User = {
                id: Math.max(...this.users.map(u => u.id), 0) + 1,
                ...formData
            };

            this.users.push(newUser);
            this.currentUser = newUser;

            this.showPage('dashboardPage');
            this.clearForm('registerForm');
            this.showNotification(`¡Bienvenido ${newUser.name}! Tu cuenta ha sido creada exitosamente.`, 'success');

            console.log('✅ Usuario registrado:', newUser);
        } catch (error) {
            console.error('Error en registro:', error);
            this.showNotification('Error al registrar usuario', 'error');
        }
    }

    public logout(): void {
        try {
            if (this.currentUser) {
                console.log('👋 Cerrando sesión de:', this.currentUser.name);
                this.currentUser = null;
                this.currentView = 'home';
                this.currentDashboardView = 'appointments';
                this.showPage('homePage');
                this.showNotification('Sesión cerrada correctamente', 'success');
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    // GESTIÓN DE CITAS

    private handleCreateAppointment(e: Event): void {
        e.preventDefault();

        try {
            if (!this.currentUser) {
                this.showNotification('Debes iniciar sesión', 'error');
                return;
            }

            const formData: Omit<Appointment, 'id' | 'userId' | 'status'> = {
                date: this.getInputValue('appointmentDate'),
                time: this.getInputValue('appointmentTime'),
                reason: this.getInputValue('appointmentReason'),
                notes: this.getInputValue('appointmentNotes').trim()
            };

            // Validaciones
            if (!formData.date || !formData.time || !formData.reason) {
                this.showNotification('Por favor completa los campos obligatorios', 'error');
                return;
            }

            // Validar fecha futura
            const appointmentDateTime = new Date(`${formData.date}T${formData.time}`);
            const now = new Date();

            if (appointmentDateTime <= now) {
                this.showNotification('No puedes agendar citas en el pasado', 'error');
                return;
            }

            // Verificar conflictos
            const conflict = this.appointments.find(apt =>
                apt.date === formData.date &&
                apt.time === formData.time &&
                apt.status === 'programada'
            );

            if (conflict) {
                this.showNotification('Ya existe una cita programada para esa fecha y hora', 'error');
                return;
            }

            // Crear nueva cita
            const newAppointment: Appointment = {
                id: Math.max(...this.appointments.map(a => a.id), 0) + 1,
                userId: this.currentUser.id,
                ...formData,
                status: 'programada'
            };

            this.appointments.push(newAppointment);
            this.clearForm('appointmentForm');
            this.updateAppointmentsList();
            this.showNotification('¡Cita agendada exitosamente!', 'success');

            // Restablecer fecha
            const today = new Date().toISOString().split('T')[0];
            const dateInput = this.getElementById<HTMLInputElement>('appointmentDate');
            if (dateInput) dateInput.value = today;

            console.log('✅ Nueva cita creada:', newAppointment);
        } catch (error) {
            console.error('Error al crear cita:', error);
            this.showNotification('Error al crear la cita', 'error');
        }
    }

    public cancelAppointment(appointmentId: number): void {
        try {
            const appointment = this.appointments.find(apt => apt.id === appointmentId);
            if (!appointment) {
                this.showNotification('Cita no encontrada', 'error');
                return;
            }

            if (appointment.userId !== this.currentUser?.id) {
                this.showNotification('No puedes cancelar esta cita', 'error');
                return;
            }

            const confirmation = confirm(
                `¿Estás seguro de que quieres cancelar la cita del ${appointment.date} a las ${appointment.time}?`
            );

            if (confirmation) {
                appointment.status = 'cancelada';
                this.updateAppointmentsList();
                this.updateCalendar();
                this.updateProfile();
                this.showNotification('Cita cancelada correctamente', 'success');
                console.log('🚫 Cita cancelada:', appointmentId);
            }
        } catch (error) {
            console.error('Error al cancelar cita:', error);
            this.showNotification('Error al cancelar la cita', 'error');
        }
    }

    public deleteAppointment(appointmentId: number): void {
        try {
            const appointment = this.appointments.find(apt => apt.id === appointmentId);
            if (!appointment) {
                this.showNotification('Cita no encontrada', 'error');
                return;
            }

            if (appointment.userId !== this.currentUser?.id) {
                this.showNotification('No puedes eliminar esta cita', 'error');
                return;
            }

            const confirmation = confirm(
                `¿Estás seguro de que quieres eliminar permanentemente la cita del ${appointment.date}? Esta acción no se puede deshacer.`
            );

            if (confirmation) {
                const index = this.appointments.findIndex(apt => apt.id === appointmentId);
                if (index !== -1) {
                    this.appointments.splice(index, 1);
                    this.updateAppointmentsList();
                    this.updateCalendar();
                    this.updateProfile();
                    this.showNotification('Cita eliminada correctamente', 'success');
                    console.log('🗑️ Cita eliminada:', appointmentId);
                }
            }
        } catch (error) {
            console.error('Error al eliminar cita:', error);
            this.showNotification('Error al eliminar la cita', 'error');
        }
    }

    // ACTUALIZACIÓN DE VISTAS

    private updateUserGreeting(): void {
        try {
            const greeting = this.getElementById('userGreeting');
            if (greeting && this.currentUser) {
                const hour = new Date().getHours();
                let timeGreeting = 'Hola';

                if (hour < 12) timeGreeting = 'Buenos días';
                else if (hour < 18) timeGreeting = 'Buenas tardes';
                else timeGreeting = 'Buenas noches';

                greeting.textContent = `${timeGreeting}, ${this.currentUser.name}`;
            }
        } catch (error) {
            console.error('Error al actualizar saludo:', error);
        }
    }

    private updateAppointmentsList(): void {
        try {
            const container = this.getElementById('appointmentList');
            if (!container || !this.currentUser) return;

            const userAppointments = this.appointments
                .filter(apt => apt.userId === (this.currentUser as User).id)
                .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

            if (userAppointments.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <div class="text-6xl mb-4">🦎</div>
                        <p class="text-gray-600 text-lg">No tienes citas programadas</p>
                        <p class="text-gray-500 text-sm mt-2">¡Agenda tu primera cita arriba!</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = userAppointments.map(appointment => {
                const date = new Date(`${appointment.date}T${appointment.time}`);
                const formattedDate = date.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                const formattedTime = date.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return `
                    <div class="appointment-card ${appointment.status === 'cancelada' ? 'cancelled' : ''}" data-id="${appointment.id}">
                        <div class="appointment-header">
                            <div class="appointment-info">
                                <div class="appointment-datetime">
                                    <span>📅 ${formattedDate}</span>
                                    <span>🕐 ${formattedTime}</span>
                                </div>
                                <h3 class="text-lg font-bold text-green-800 mb-2">${appointment.reason}</h3>
                                ${appointment.notes ? `<p class="text-gray-600 mb-3">${appointment.notes}</p>` : ''}
                                <span class="status-badge ${appointment.status === 'programada' ? 'status-active' : 'status-cancelled'}">
                                    ${appointment.status === 'programada' ? '✅ Programada' : '❌ Cancelada'}
                                </span>
                            </div>
                            
                            ${appointment.status === 'programada' ? `
                                <div class="appointment-actions">
                                    <button onclick="window.app.cancelAppointment(${appointment.id})" 
                                            class="btn btn-warning btn-sm" title="Cancelar cita">
                                        ⚠️ Cancelar
                                    </button>
                                    <button onclick="window.app.deleteAppointment(${appointment.id})" 
                                            class="btn btn-danger btn-sm" title="Eliminar cita">
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            ` : `
                                <div class="appointment-actions">
                                    <button onclick="window.app.deleteAppointment(${appointment.id})" 
                                            class="btn btn-danger btn-sm" title="Eliminar cita">
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                `;
            }).join('');

            // Agregar animaciones
            container.querySelectorAll('.appointment-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-slide-left');
                }, index * 100);
            });
        } catch (error) {
            console.error('Error al actualizar lista de citas:', error);
        }
    }

    private updateCalendar(): void {
        try {
            const calendarGrid = this.getElementById('calendarGrid');
            const calendarTitle = this.getElementById('calendarTitle');

            if (!calendarGrid || !calendarTitle) return;

            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            const monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];

            calendarTitle.textContent = `Calendario - ${monthNames[currentMonth]} ${currentYear}`;

            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

            let calendarHTML = '';

            // Días vacíos al inicio
            for (let i = 0; i < firstDayOfMonth; i++) {
                calendarHTML += '<div class="calendar-day"></div>';
            }

            // Días del mes
            for (let day = 1; day <= daysInMonth; day++) {
                const monthStr = (currentMonth + 1 < 10) ? '0' + (currentMonth + 1) : (currentMonth + 1).toString();
                const dayStr = (day < 10) ? '0' + day : day.toString();
                const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
                const dayAppointments = this.appointments.filter(apt => apt.date === dateStr && apt.status === 'programada');
                const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

                const appointmentsHTML = dayAppointments.map(apt => {
                    const user = this.users.find(u => u.id === apt.userId);
                    return `<div class="calendar-appointment" title="${apt.reason} - ${user?.iguanaName || 'Usuario'}">${apt.time} ${user?.iguanaName || 'Usuario'}</div>`;
                }).join('');

                calendarHTML += `
                    <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                        <div class="calendar-day-number">${day}</div>
                        ${appointmentsHTML}
                    </div>
                `;
            }

            calendarGrid.innerHTML = calendarHTML;

            // Agregar eventos de click
            calendarGrid.querySelectorAll('.calendar-day').forEach(day => {
                day.addEventListener('click', (e) => {
                    const target = e.currentTarget as HTMLElement;
                    const date = target.dataset.date;
                    if (date) {
                        this.handleCalendarDayClick(date);
                    }
                });
            });
        } catch (error) {
            console.error('Error al actualizar calendario:', error);
        }
    }

    private handleCalendarDayClick(date: string): void {
        try {
            const dayAppointments = this.appointments.filter(apt => apt.date === date && apt.status === 'programada');

            if (dayAppointments.length > 0) {
                const appointmentList = dayAppointments.map(apt => {
                    const user = this.users.find(u => u.id === apt.userId);
                    return `• ${apt.time} - ${user?.iguanaName || 'Usuario'} (${apt.reason})`;
                }).join('\n');

                alert(`Citas para ${date}:\n\n${appointmentList}`);
            } else {
                // Cambiar a la vista de citas y preseleccionar la fecha
                this.showDashboardView('appointments');
                const dateInput = this.getElementById<HTMLInputElement>('appointmentDate');
                if (dateInput) {
                    dateInput.value = date;
                    dateInput.focus();
                    this.showNotification('Fecha seleccionada. Puedes agendar una cita.', 'info');
                }
            }
        } catch (error) {
            console.error('Error al manejar click en calendario:', error);
        }
    }

    private updateProfile(): void {
        try {
            if (!this.currentUser) return;

            // Información personal
            this.setTextContent('profileName', this.currentUser.name);
            this.setTextContent('profileEmail', this.currentUser.email);
            this.setTextContent('profilePhone', this.currentUser.phone);

            // Información de la iguana
            this.setTextContent('profileIguanaName', this.currentUser.iguanaName);
            this.setTextContent('profileIguanaAge', this.currentUser.iguanaAge);

            // Estadísticas
            const userAppointments = this.appointments.filter(apt => apt.userId === (this.currentUser as User).id);
            const activeAppointments = userAppointments.filter(apt => apt.status === 'programada');
            const cancelledAppointments = userAppointments.filter(apt => apt.status === 'cancelada');
            const today = new Date().toISOString().split('T')[0];
            const upcomingAppointments = userAppointments.filter(apt =>
                apt.date >= today && apt.status === 'programada'
            );

            this.setTextContent('totalAppointments', userAppointments.length.toString());
            this.setTextContent('activeAppointments', activeAppointments.length.toString());
            this.setTextContent('cancelledAppointments', cancelledAppointments.length.toString());
            this.setTextContent('upcomingAppointments', upcomingAppointments.length.toString());
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
        }
    }

    // UTILIDADES

    private getElementById<T extends HTMLElement = HTMLElement>(id: string): T | null {
        return document.getElementById(id) as T | null;
    }

    private getInputValue(id: string): string {
        const input = this.getElementById<HTMLInputElement>(id);
        return input?.value || '';
    }

    private setTextContent(id: string, text: string): void {
        const element = this.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }

    private clearForm(formId: string): void {
        const form = this.getElementById<HTMLFormElement>(formId);
        if (form) {
            form.reset();
        }
    }

    public showNotification(message: string, type: NotificationType = 'info'): void {
        try {
            // Remover notificaciones existentes
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => notification.remove());

            // Crear nueva notificación
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                    <span class="notification-message">${message}</span>
                    <button class="notification-close" onclick="this.parentElement.parentElement.remove()">✕</button>
                </div>
            `;

            // Agregar estilos
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 400px;
                background: white;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border-left: 4px solid ${this.getNotificationColor(type)};
                animation: slideInRight 0.3s ease;
            `;

            const content = notification.querySelector('.notification-content') as HTMLElement;
            if (content) {
                content.style.cssText = `
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                `;
            }

            const icon = notification.querySelector('.notification-icon') as HTMLElement;
            if (icon) {
                icon.style.cssText = `
                    font-size: 1.25rem;
                    color: ${this.getNotificationColor(type)};
                `;
            }

            const messageSpan = notification.querySelector('.notification-message') as HTMLElement;
            if (messageSpan) {
                messageSpan.style.cssText = `
                    flex: 1;
                    color: #374151;
                    font-weight: 500;
                `;
            }

            const closeBtn = notification.querySelector('.notification-close') as HTMLButtonElement;
            if (closeBtn) {
                closeBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    font-size: 1rem;
                    padding: 0.25rem;
                    border-radius: 0.25rem;
                    transition: color 0.2s;
                `;

                closeBtn.onmouseover = () => closeBtn.style.color = '#374151';
                closeBtn.onmouseout = () => closeBtn.style.color = '#9ca3af';
            }

            // Agregar al DOM
            document.body.appendChild(notification);

            // Auto-remover después de 5 segundos
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => notification.remove(), 300);
                }
            }, 5000);

            console.log(`🔔 Notificación [${type}]:`, message);
        } catch (error) {
            console.error('Error al mostrar notificación:', error);
        }
    }

    private getNotificationIcon(type: NotificationType): string {
        const icons: Record<NotificationType, string> = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type];
    }

    private getNotificationColor(type: NotificationType): string {
        const colors: Record<NotificationType, string> = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type];
    }
}

// FUNCIONES GLOBALES PARA HTML

// Declarar la instancia global
declare global {
    interface Window {
        app: IguanaVetApp;
        showPage: (pageId: PageId) => void;
        showDashboardView: (viewName: DashboardView) => void;
        logout: () => void;
    }
}

function showPage(pageId: PageId): void {
    if (window.app) {
        window.app.showPage(pageId);
    }
}

function showDashboardView(viewName: DashboardView): void {
    if (window.app) {
        window.app.showDashboardView(viewName);
    }
}

function logout(): void {
    if (window.app) {
        window.app.logout();
    }
}

// ESTILOS DINÁMICOS

const addNotificationStyles = (): void => {
    // Verificar si los estilos ya existen
    if (document.getElementById('notification-styles')) return;

    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }

        .animate-slide-left {
            animation: slideLeft 0.3s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideLeft {
            from { transform: translateX(50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(notificationStyles);
};

// INICIALIZACIÓN

// Función de inicialización segura
const initializeApp = (): void => {
    try {
        // Agregar estilos
        addNotificationStyles();
        
        // Crear instancia de la aplicación
        window.app = new IguanaVetApp();
        
        // Exponer funciones globalmente
        window.showPage = showPage;
        window.showDashboardView = showDashboardView;
        window.logout = logout;
        
        console.log('🦎 VetIguana Pro iniciado correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar VetIguana Pro:', error);
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // El DOM ya está cargado
    initializeApp();
}

// Exportar para uso en módulos (opcional)
export { IguanaVetApp, type User, type Appointment, type NotificationType, type PageId, type DashboardView };
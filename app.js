"use strict";
// Ensure `exports` exists in browser environments to avoid ReferenceError
if (typeof exports === 'undefined') { var exports = {}; }
// ====================================
// VETERINARIA DE IGUANAS - APP.TS
// Sistema completo en TypeScript (CORREGIDO)
// ====================================
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IguanaVetApp = void 0;
// ====================================
// CLASE PRINCIPAL DE LA APLICACIÓN
// ====================================
var IguanaVetApp = /** @class */ (function () {
    function IguanaVetApp() {
        this.users = [];
        this.appointments = [];
        this.currentUser = null;
        this.currentView = 'home';
        this.currentDashboardView = 'appointments';
        this.initializeData();
        this.bindEvents();
        this.showPage('homePage');
    }
    // ====================================
    // INICIALIZACIÓN
    // ====================================
    IguanaVetApp.prototype.initializeData = function () {
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
    };
    IguanaVetApp.prototype.bindEvents = function () {
        var _this = this;
        // Usar setTimeout para asegurar que el DOM esté completamente cargado
        setTimeout(function () {
            // Formulario de login
            var loginForm = _this.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', function (e) { return _this.handleLogin(e); });
            }
            // Formulario de registro
            var registerForm = _this.getElementById('registerForm');
            if (registerForm) {
                registerForm.addEventListener('submit', function (e) { return _this.handleRegister(e); });
            }
            // Formulario de citas
            var appointmentForm = _this.getElementById('appointmentForm');
            if (appointmentForm) {
                appointmentForm.addEventListener('submit', function (e) { return _this.handleCreateAppointment(e); });
            }
            // Establecer fecha mínima para las citas
            var appointmentDate = _this.getElementById('appointmentDate');
            if (appointmentDate) {
                var today = new Date().toISOString().split('T')[0];
                appointmentDate.setAttribute('min', today);
                appointmentDate.value = today;
            }
            // Animaciones
            _this.addPageAnimations();
            console.log('✅ Eventos vinculados correctamente');
        }, 100);
    };
    IguanaVetApp.prototype.addPageAnimations = function () {
        if (typeof IntersectionObserver !== 'undefined') {
            var observer_1 = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry, index) {
                    if (entry.isIntersecting) {
                        setTimeout(function () {
                            entry.target.classList.add('animate-fade-in');
                        }, index * 100);
                    }
                });
            });
            document.querySelectorAll('.card, .feature-card').forEach(function (card) {
                observer_1.observe(card);
            });
        }
    };
    // ====================================
    // NAVEGACIÓN
    // ====================================
    IguanaVetApp.prototype.showPage = function (pageId) {
        try {
            // Ocultar todas las páginas
            document.querySelectorAll('.page').forEach(function (page) {
                page.classList.add('hidden');
            });
            // Mostrar la página solicitada
            var targetPage = this.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.remove('hidden');
                targetPage.classList.add('animate-fade-in');
                this.currentView = pageId;
                if (pageId === 'dashboardPage' && this.currentUser) {
                    this.updateUserGreeting();
                    this.showDashboardView(this.currentDashboardView);
                }
                console.log("\uD83D\uDCC4 P\u00E1gina cambiada a: ".concat(pageId));
            }
            else {
                console.warn("\u26A0\uFE0F No se encontr\u00F3 la p\u00E1gina: ".concat(pageId));
            }
        }
        catch (error) {
            console.error('Error al cambiar de página:', error);
        }
    };
    IguanaVetApp.prototype.showDashboardView = function (viewName) {
        try {
            // Actualizar navegación
            document.querySelectorAll('.nav-link').forEach(function (link) {
                link.classList.remove('active');
            });
            var activeLink = document.querySelector("[data-view=\"".concat(viewName, "\"]"));
            if (activeLink) {
                activeLink.classList.add('active');
            }
            // Ocultar todas las vistas
            document.querySelectorAll('.dashboard-view').forEach(function (view) {
                view.classList.add('hidden');
            });
            // Mostrar la vista solicitada
            var targetView = this.getElementById("".concat(viewName, "View"));
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
                console.log("\uD83D\uDCCB Vista del dashboard: ".concat(viewName));
            }
            else {
                console.warn("\u26A0\uFE0F No se encontr\u00F3 la vista: ".concat(viewName, "View"));
            }
        }
        catch (error) {
            console.error('Error al cambiar vista del dashboard:', error);
        }
    };
    // ====================================
    // AUTENTICACIÓN
    // ====================================
    IguanaVetApp.prototype.handleLogin = function (e) {
        e.preventDefault();
        try {
            var email_1 = this.getInputValue('loginEmail').trim();
            var password_1 = this.getInputValue('loginPassword');
            if (!email_1 || !password_1) {
                this.showNotification('Por favor completa todos los campos', 'error');
                return;
            }
            var user = this.users.find(function (u) { return u.email === email_1 && u.password === password_1; });
            if (user) {
                this.currentUser = user;
                this.showPage('dashboardPage');
                this.clearForm('loginForm');
                this.showNotification('¡Bienvenido de vuelta!', 'success');
                console.log('✅ Login exitoso:', user.name);
            }
            else {
                this.showNotification('Credenciales incorrectas', 'error');
                console.log('❌ Login fallido para:', email_1);
            }
        }
        catch (error) {
            console.error('Error en login:', error);
            this.showNotification('Error al iniciar sesión', 'error');
        }
    };
    IguanaVetApp.prototype.handleRegister = function (e) {
        e.preventDefault();
        try {
            var formData_1 = {
                name: this.getInputValue('registerName').trim(),
                email: this.getInputValue('registerEmail').trim().toLowerCase(),
                password: this.getInputValue('registerPassword'),
                phone: this.getInputValue('registerPhone').trim(),
                iguanaName: this.getInputValue('registerIguanaName').trim(),
                iguanaAge: this.getInputValue('registerIguanaAge').trim()
            };
            // Validaciones
            if (!formData_1.name || !formData_1.email || !formData_1.password ||
                !formData_1.phone || !formData_1.iguanaName || !formData_1.iguanaAge) {
                this.showNotification('Por favor completa todos los campos', 'error');
                return;
            }
            if (this.users.find(function (u) { return u.email === formData_1.email; })) {
                this.showNotification('El email ya está registrado', 'error');
                return;
            }
            if (formData_1.password.length < 3) {
                this.showNotification('La contraseña debe tener al menos 3 caracteres', 'error');
                return;
            }
            // Crear nuevo usuario
            var newUser = __assign({ id: Math.max.apply(Math, __spreadArray(__spreadArray([], this.users.map(function (u) { return u.id; }), false), [0], false)) + 1 }, formData_1);
            this.users.push(newUser);
            this.currentUser = newUser;
            this.showPage('dashboardPage');
            this.clearForm('registerForm');
            this.showNotification("\u00A1Bienvenido ".concat(newUser.name, "! Tu cuenta ha sido creada exitosamente."), 'success');
            console.log('✅ Usuario registrado:', newUser);
        }
        catch (error) {
            console.error('Error en registro:', error);
            this.showNotification('Error al registrar usuario', 'error');
        }
    };
    IguanaVetApp.prototype.logout = function () {
        try {
            if (this.currentUser) {
                console.log('👋 Cerrando sesión de:', this.currentUser.name);
                this.currentUser = null;
                this.currentView = 'home';
                this.currentDashboardView = 'appointments';
                this.showPage('homePage');
                this.showNotification('Sesión cerrada correctamente', 'success');
            }
        }
        catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };
    // ====================================
    // GESTIÓN DE CITAS
    // ====================================
    IguanaVetApp.prototype.handleCreateAppointment = function (e) {
        e.preventDefault();
        try {
            if (!this.currentUser) {
                this.showNotification('Debes iniciar sesión', 'error');
                return;
            }
            var formData_2 = {
                date: this.getInputValue('appointmentDate'),
                time: this.getInputValue('appointmentTime'),
                reason: this.getInputValue('appointmentReason'),
                notes: this.getInputValue('appointmentNotes').trim()
            };
            // Validaciones
            if (!formData_2.date || !formData_2.time || !formData_2.reason) {
                this.showNotification('Por favor completa los campos obligatorios', 'error');
                return;
            }
            // Validar fecha futura
            var appointmentDateTime = new Date("".concat(formData_2.date, "T").concat(formData_2.time));
            var now = new Date();
            if (appointmentDateTime <= now) {
                this.showNotification('No puedes agendar citas en el pasado', 'error');
                return;
            }
            // Verificar conflictos
            var conflict = this.appointments.find(function (apt) {
                return apt.date === formData_2.date &&
                    apt.time === formData_2.time &&
                    apt.status === 'programada';
            });
            if (conflict) {
                this.showNotification('Ya existe una cita programada para esa fecha y hora', 'error');
                return;
            }
            // Crear nueva cita
            var newAppointment = __assign(__assign({ id: Math.max.apply(Math, __spreadArray(__spreadArray([], this.appointments.map(function (a) { return a.id; }), false), [0], false)) + 1, userId: this.currentUser.id }, formData_2), { status: 'programada' });
            this.appointments.push(newAppointment);
            this.clearForm('appointmentForm');
            this.updateAppointmentsList();
            this.showNotification('¡Cita agendada exitosamente!', 'success');
            // Restablecer fecha
            var today = new Date().toISOString().split('T')[0];
            var dateInput = this.getElementById('appointmentDate');
            if (dateInput)
                dateInput.value = today;
            console.log('✅ Nueva cita creada:', newAppointment);
        }
        catch (error) {
            console.error('Error al crear cita:', error);
            this.showNotification('Error al crear la cita', 'error');
        }
    };
    IguanaVetApp.prototype.cancelAppointment = function (appointmentId) {
        var _a;
        try {
            var appointment = this.appointments.find(function (apt) { return apt.id === appointmentId; });
            if (!appointment) {
                this.showNotification('Cita no encontrada', 'error');
                return;
            }
            if (appointment.userId !== ((_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.id)) {
                this.showNotification('No puedes cancelar esta cita', 'error');
                return;
            }
            var confirmation = confirm("\u00BFEst\u00E1s seguro de que quieres cancelar la cita del ".concat(appointment.date, " a las ").concat(appointment.time, "?"));
            if (confirmation) {
                appointment.status = 'cancelada';
                this.updateAppointmentsList();
                this.updateCalendar();
                this.updateProfile();
                this.showNotification('Cita cancelada correctamente', 'success');
                console.log('🚫 Cita cancelada:', appointmentId);
            }
        }
        catch (error) {
            console.error('Error al cancelar cita:', error);
            this.showNotification('Error al cancelar la cita', 'error');
        }
    };
    IguanaVetApp.prototype.deleteAppointment = function (appointmentId) {
        var _a;
        try {
            var appointment = this.appointments.find(function (apt) { return apt.id === appointmentId; });
            if (!appointment) {
                this.showNotification('Cita no encontrada', 'error');
                return;
            }
            if (appointment.userId !== ((_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.id)) {
                this.showNotification('No puedes eliminar esta cita', 'error');
                return;
            }
            var confirmation = confirm("\u00BFEst\u00E1s seguro de que quieres eliminar permanentemente la cita del ".concat(appointment.date, "? Esta acci\u00F3n no se puede deshacer."));
            if (confirmation) {
                var index = this.appointments.findIndex(function (apt) { return apt.id === appointmentId; });
                if (index !== -1) {
                    this.appointments.splice(index, 1);
                    this.updateAppointmentsList();
                    this.updateCalendar();
                    this.updateProfile();
                    this.showNotification('Cita eliminada correctamente', 'success');
                    console.log('🗑️ Cita eliminada:', appointmentId);
                }
            }
        }
        catch (error) {
            console.error('Error al eliminar cita:', error);
            this.showNotification('Error al eliminar la cita', 'error');
        }
    };
    // ====================================
    // ACTUALIZACIÓN DE VISTAS
    // ====================================
    IguanaVetApp.prototype.updateUserGreeting = function () {
        try {
            var greeting = this.getElementById('userGreeting');
            if (greeting && this.currentUser) {
                var hour = new Date().getHours();
                var timeGreeting = 'Hola';
                if (hour < 12)
                    timeGreeting = 'Buenos días';
                else if (hour < 18)
                    timeGreeting = 'Buenas tardes';
                else
                    timeGreeting = 'Buenas noches';
                greeting.textContent = "".concat(timeGreeting, ", ").concat(this.currentUser.name);
            }
        }
        catch (error) {
            console.error('Error al actualizar saludo:', error);
        }
    };
    IguanaVetApp.prototype.updateAppointmentsList = function () {
        var _this = this;
        try {
            var container = this.getElementById('appointmentList');
            if (!container || !this.currentUser)
                return;
            var userAppointments = this.appointments
                .filter(function (apt) { return apt.userId === _this.currentUser.id; })
                .sort(function (a, b) { return new Date("".concat(a.date, "T").concat(a.time)).getTime() - new Date("".concat(b.date, "T").concat(b.time)).getTime(); });
            if (userAppointments.length === 0) {
                container.innerHTML = "\n                    <div class=\"text-center py-8\">\n                        <div class=\"text-6xl mb-4\">\uD83E\uDD8E</div>\n                        <p class=\"text-gray-600 text-lg\">No tienes citas programadas</p>\n                        <p class=\"text-gray-500 text-sm mt-2\">\u00A1Agenda tu primera cita arriba!</p>\n                    </div>\n                ";
                return;
            }
            container.innerHTML = userAppointments.map(function (appointment) {
                var date = new Date("".concat(appointment.date, "T").concat(appointment.time));
                var formattedDate = date.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                var formattedTime = date.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return "\n                    <div class=\"appointment-card ".concat(appointment.status === 'cancelada' ? 'cancelled' : '', "\" data-id=\"").concat(appointment.id, "\">\n                        <div class=\"appointment-header\">\n                            <div class=\"appointment-info\">\n                                <div class=\"appointment-datetime\">\n                                    <span>\uD83D\uDCC5 ").concat(formattedDate, "</span>\n                                    <span>\uD83D\uDD50 ").concat(formattedTime, "</span>\n                                </div>\n                                <h3 class=\"text-lg font-bold text-green-800 mb-2\">").concat(appointment.reason, "</h3>\n                                ").concat(appointment.notes ? "<p class=\"text-gray-600 mb-3\">".concat(appointment.notes, "</p>") : '', "\n                                <span class=\"status-badge ").concat(appointment.status === 'programada' ? 'status-active' : 'status-cancelled', "\">\n                                    ").concat(appointment.status === 'programada' ? '✅ Programada' : '❌ Cancelada', "\n                                </span>\n                            </div>\n                            \n                            ").concat(appointment.status === 'programada' ? "\n                                <div class=\"appointment-actions\">\n                                    <button onclick=\"window.app.cancelAppointment(".concat(appointment.id, ")\" \n                                            class=\"btn btn-warning btn-sm\" title=\"Cancelar cita\">\n                                        \u26A0\uFE0F Cancelar\n                                    </button>\n                                    <button onclick=\"window.app.deleteAppointment(").concat(appointment.id, ")\" \n                                            class=\"btn btn-danger btn-sm\" title=\"Eliminar cita\">\n                                        \uD83D\uDDD1\uFE0F Eliminar\n                                    </button>\n                                </div>\n                            ") : "\n                                <div class=\"appointment-actions\">\n                                    <button onclick=\"window.app.deleteAppointment(".concat(appointment.id, ")\" \n                                            class=\"btn btn-danger btn-sm\" title=\"Eliminar cita\">\n                                        \uD83D\uDDD1\uFE0F Eliminar\n                                    </button>\n                                </div>\n                            "), "\n                        </div>\n                    </div>\n                ");
            }).join('');
            // Agregar animaciones
            container.querySelectorAll('.appointment-card').forEach(function (card, index) {
                setTimeout(function () {
                    card.classList.add('animate-slide-left');
                }, index * 100);
            });
        }
        catch (error) {
            console.error('Error al actualizar lista de citas:', error);
        }
    };
    IguanaVetApp.prototype.updateCalendar = function () {
        var _this = this;
        try {
            var calendarGrid = this.getElementById('calendarGrid');
            var calendarTitle = this.getElementById('calendarTitle');
            if (!calendarGrid || !calendarTitle)
                return;
            var today = new Date();
            var currentMonth = today.getMonth();
            var currentYear = today.getFullYear();
            var monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            calendarTitle.textContent = "Calendario - ".concat(monthNames[currentMonth], " ").concat(currentYear);
            var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            var firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
            var calendarHTML = '';
            // Días vacíos al inicio
            for (var i = 0; i < firstDayOfMonth; i++) {
                calendarHTML += '<div class="calendar-day"></div>';
            }
            var _loop_1 = function (day) {
                var monthStr = (currentMonth + 1 < 10) ? '0' + (currentMonth + 1) : (currentMonth + 1).toString();
                var dayStr = (day < 10) ? '0' + day : day.toString();
                var dateStr = "".concat(currentYear, "-").concat(monthStr, "-").concat(dayStr);
                var dayAppointments = this_1.appointments.filter(function (apt) { return apt.date === dateStr && apt.status === 'programada'; });
                var isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                var appointmentsHTML = dayAppointments.map(function (apt) {
                    var user = _this.users.find(function (u) { return u.id === apt.userId; });
                    return "<div class=\"calendar-appointment\" title=\"".concat(apt.reason, " - ").concat((user === null || user === void 0 ? void 0 : user.iguanaName) || 'Usuario', "\">").concat(apt.time, " ").concat((user === null || user === void 0 ? void 0 : user.iguanaName) || 'Usuario', "</div>");
                }).join('');
                calendarHTML += "\n                    <div class=\"calendar-day ".concat(isToday ? 'today' : '', "\" data-date=\"").concat(dateStr, "\">\n                        <div class=\"calendar-day-number\">").concat(day, "</div>\n                        ").concat(appointmentsHTML, "\n                    </div>\n                ");
            };
            var this_1 = this;
            // Días del mes
            for (var day = 1; day <= daysInMonth; day++) {
                _loop_1(day);
            }
            calendarGrid.innerHTML = calendarHTML;
            // Agregar eventos de click
            calendarGrid.querySelectorAll('.calendar-day').forEach(function (day) {
                day.addEventListener('click', function (e) {
                    var target = e.currentTarget;
                    var date = target.dataset.date;
                    if (date) {
                        _this.handleCalendarDayClick(date);
                    }
                });
            });
        }
        catch (error) {
            console.error('Error al actualizar calendario:', error);
        }
    };
    IguanaVetApp.prototype.handleCalendarDayClick = function (date) {
        var _this = this;
        try {
            var dayAppointments = this.appointments.filter(function (apt) { return apt.date === date && apt.status === 'programada'; });
            if (dayAppointments.length > 0) {
                var appointmentList = dayAppointments.map(function (apt) {
                    var user = _this.users.find(function (u) { return u.id === apt.userId; });
                    return "\u2022 ".concat(apt.time, " - ").concat((user === null || user === void 0 ? void 0 : user.iguanaName) || 'Usuario', " (").concat(apt.reason, ")");
                }).join('\n');
                alert("Citas para ".concat(date, ":\n\n").concat(appointmentList));
            }
            else {
                // Cambiar a la vista de citas y preseleccionar la fecha
                this.showDashboardView('appointments');
                var dateInput = this.getElementById('appointmentDate');
                if (dateInput) {
                    dateInput.value = date;
                    dateInput.focus();
                    this.showNotification('Fecha seleccionada. Puedes agendar una cita.', 'info');
                }
            }
        }
        catch (error) {
            console.error('Error al manejar click en calendario:', error);
        }
    };
    IguanaVetApp.prototype.updateProfile = function () {
        var _this = this;
        try {
            if (!this.currentUser)
                return;
            // Información personal
            this.setTextContent('profileName', this.currentUser.name);
            this.setTextContent('profileEmail', this.currentUser.email);
            this.setTextContent('profilePhone', this.currentUser.phone);
            // Información de la iguana
            this.setTextContent('profileIguanaName', this.currentUser.iguanaName);
            this.setTextContent('profileIguanaAge', this.currentUser.iguanaAge);
            // Estadísticas
            var userAppointments = this.appointments.filter(function (apt) { return apt.userId === _this.currentUser.id; });
            var activeAppointments = userAppointments.filter(function (apt) { return apt.status === 'programada'; });
            var cancelledAppointments = userAppointments.filter(function (apt) { return apt.status === 'cancelada'; });
            var today_1 = new Date().toISOString().split('T')[0];
            var upcomingAppointments = userAppointments.filter(function (apt) {
                return apt.date >= today_1 && apt.status === 'programada';
            });
            this.setTextContent('totalAppointments', userAppointments.length.toString());
            this.setTextContent('activeAppointments', activeAppointments.length.toString());
            this.setTextContent('cancelledAppointments', cancelledAppointments.length.toString());
            this.setTextContent('upcomingAppointments', upcomingAppointments.length.toString());
        }
        catch (error) {
            console.error('Error al actualizar perfil:', error);
        }
    };
    // ====================================
    // UTILIDADES
    // ====================================
    IguanaVetApp.prototype.getElementById = function (id) {
        return document.getElementById(id);
    };
    IguanaVetApp.prototype.getInputValue = function (id) {
        var input = this.getElementById(id);
        return (input === null || input === void 0 ? void 0 : input.value) || '';
    };
    IguanaVetApp.prototype.setTextContent = function (id, text) {
        var element = this.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    };
    IguanaVetApp.prototype.clearForm = function (formId) {
        var form = this.getElementById(formId);
        if (form) {
            form.reset();
        }
    };
    IguanaVetApp.prototype.showNotification = function (message, type) {
        if (type === void 0) { type = 'info'; }
        try {
            // Remover notificaciones existentes
            var existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(function (notification) { return notification.remove(); });
            // Crear nueva notificación
            var notification_1 = document.createElement('div');
            notification_1.className = "notification notification-".concat(type);
            notification_1.innerHTML = "\n                <div class=\"notification-content\">\n                    <span class=\"notification-icon\">".concat(this.getNotificationIcon(type), "</span>\n                    <span class=\"notification-message\">").concat(message, "</span>\n                    <button class=\"notification-close\" onclick=\"this.parentElement.parentElement.remove()\">\u2715</button>\n                </div>\n            ");
            // Agregar estilos
            notification_1.style.cssText = "\n                position: fixed;\n                top: 20px;\n                right: 20px;\n                z-index: 1000;\n                max-width: 400px;\n                background: white;\n                border-radius: 0.5rem;\n                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);\n                border-left: 4px solid ".concat(this.getNotificationColor(type), ";\n                animation: slideInRight 0.3s ease;\n            ");
            var content = notification_1.querySelector('.notification-content');
            if (content) {
                content.style.cssText = "\n                    padding: 1rem;\n                    display: flex;\n                    align-items: center;\n                    gap: 0.75rem;\n                ";
            }
            var icon = notification_1.querySelector('.notification-icon');
            if (icon) {
                icon.style.cssText = "\n                    font-size: 1.25rem;\n                    color: ".concat(this.getNotificationColor(type), ";\n                ");
            }
            var messageSpan = notification_1.querySelector('.notification-message');
            if (messageSpan) {
                messageSpan.style.cssText = "\n                    flex: 1;\n                    color: #374151;\n                    font-weight: 500;\n                ";
            }
            var closeBtn_1 = notification_1.querySelector('.notification-close');
            if (closeBtn_1) {
                closeBtn_1.style.cssText = "\n                    background: none;\n                    border: none;\n                    color: #9ca3af;\n                    cursor: pointer;\n                    font-size: 1rem;\n                    padding: 0.25rem;\n                    border-radius: 0.25rem;\n                    transition: color 0.2s;\n                ";
                closeBtn_1.onmouseover = function () { return closeBtn_1.style.color = '#374151'; };
                closeBtn_1.onmouseout = function () { return closeBtn_1.style.color = '#9ca3af'; };
            }
            // Agregar al DOM
            document.body.appendChild(notification_1);
            // Auto-remover después de 5 segundos
            setTimeout(function () {
                if (notification_1.parentElement) {
                    notification_1.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(function () { return notification_1.remove(); }, 300);
                }
            }, 5000);
            console.log("\uD83D\uDD14 Notificaci\u00F3n [".concat(type, "]:"), message);
        }
        catch (error) {
            console.error('Error al mostrar notificación:', error);
        }
    };
    IguanaVetApp.prototype.getNotificationIcon = function (type) {
        var icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type];
    };
    IguanaVetApp.prototype.getNotificationColor = function (type) {
        var colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type];
    };
    return IguanaVetApp;
}());
exports.IguanaVetApp = IguanaVetApp;
function showPage(pageId) {
    if (window.app) {
        window.app.showPage(pageId);
    }
}
function showDashboardView(viewName) {
    if (window.app) {
        window.app.showDashboardView(viewName);
    }
}
function logout() {
    if (window.app) {
        window.app.logout();
    }
}
// ====================================
// ESTILOS DINÁMICOS
// ====================================
var addNotificationStyles = function () {
    // Verificar si los estilos ya existen
    if (document.getElementById('notification-styles'))
        return;
    var notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.textContent = "\n        @keyframes slideInRight {\n            from {\n                transform: translateX(100%);\n                opacity: 0;\n            }\n            to {\n                transform: translateX(0);\n                opacity: 1;\n            }\n        }\n        \n        @keyframes slideOutRight {\n            from {\n                transform: translateX(0);\n                opacity: 1;\n            }\n            to {\n                transform: translateX(100%);\n                opacity: 0;\n            }\n        }\n\n        .animate-fade-in {\n            animation: fadeIn 0.5s ease-in-out;\n        }\n\n        .animate-slide-left {\n            animation: slideLeft 0.3s ease-in-out;\n        }\n\n        @keyframes fadeIn {\n            from { opacity: 0; transform: translateY(20px); }\n            to { opacity: 1; transform: translateY(0); }\n        }\n\n        @keyframes slideLeft {\n            from { transform: translateX(50px); opacity: 0; }\n            to { transform: translateX(0); opacity: 1; }\n        }\n    ";
    document.head.appendChild(notificationStyles);
};
// ====================================
// INICIALIZACIÓN
// ====================================
// Función de inicialización segura
var initializeApp = function () {
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
    }
    catch (error) {
        console.error('❌ Error al inicializar VetIguana Pro:', error);
    }
};
// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
}
else {
    // El DOM ya está cargado
    initializeApp();
}

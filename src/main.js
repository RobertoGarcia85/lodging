window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Establecer año actual automáticamente en el footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        /* ==========================================================
           2. SELECCIÓN DINÁMICA DE ALOJAMIENTOS DESDE LAS TARJETAS
           ========================================================== */
        function prepararSeleccion(nombreAlojamiento) {
            const selectEl = document.getElementById('alojamientoSelect');
            selectEl.value = nombreAlojamiento;
            
            // Efecto focus visual para que el usuario note que se ha autoseleccionado
            selectEl.focus();
            selectEl.style.borderColor = 'var(--accent)';
            setTimeout(() => {
                selectEl.style.borderColor = '#e5e7eb';
            }, 1500);
        }
        window.prepararSeleccion = prepararSeleccion;

        /* ==========================================================
           3. SISTEMA DE ALERTAS PERSONALIZADO (Evita alert() del navegador)
           ========================================================== */
        function showAlert(title, message, type = 'info') {
            const alertEl = document.getElementById('customAlert');
            const iconEl = document.getElementById('alertIcon');
            const titleEl = document.getElementById('alertTitle');
            const msgEl = document.getElementById('alertMsg');

            // Personalizar según el estado de la reserva
            if (type === 'success') {
                alertEl.className = 'custom-alert show success';
                iconEl.textContent = '✅';
            } else if (type === 'error') {
                alertEl.className = 'custom-alert show';
                alertEl.style.borderLeftColor = '#dc2626';
                iconEl.textContent = '⚠️';
            } else {
                alertEl.className = 'custom-alert show';
                alertEl.style.borderLeftColor = 'var(--accent)';
                iconEl.textContent = '✨';
            }

            titleEl.textContent = title;
            msgEl.textContent = message;

            // Ocultar la alerta automáticamente tras 5 segundos
            setTimeout(() => {
                closeAlert();
            }, 5000);
        }

        function closeAlert() {
            document.getElementById('customAlert').classList.remove('show');
        }
        window.closeAlert = closeAlert;

        /* ==========================================================
           4. VALIDACIÓN INTERACTIVA DE FORMULARIO
           ========================================================== */
        // Seteamos las fechas mínimas coherentes para el calendario en base a hoy
        const inputCheckIn = document.getElementById('checkIn');
        const inputCheckOut = document.getElementById('checkOut');
        const hoy = new Date().toISOString().split('T')[0];
        inputCheckIn.min = hoy;

        // Actualiza el mínimo de la fecha de salida según la de entrada elegida
        inputCheckIn.addEventListener('change', function() {
            inputCheckOut.min = this.value;
        });

        document.getElementById('reservationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            let esValido = true;

            // Obtener todos los campos
            const name = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const alojamiento = document.getElementById('alojamientoSelect').value;
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;

            // Resetear mensajes de error
            document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

            // Validar Nombre (Mínimo 3 letras)
            if (name.length < 3) {
                document.getElementById('nameError').style.display = 'block';
                esValido = false;
            }

            // Validar Correo Electrónico (Regex estándar)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                document.getElementById('emailError').style.display = 'block';
                esValido = false;
            }

            // Validar Teléfono (Solo números y signos comunes, min 8 dígitos)
            const cleanPhone = phone.replace(/[^0-9]/g, '');
            if (cleanPhone.length < 8) {
                document.getElementById('phoneError').style.display = 'block';
                esValido = false;
            }

            // Validar Selección de Alojamiento
            if (!alojamiento) {
                document.getElementById('alojamientoError').style.display = 'block';
                esValido = false;
            }

            // Validar Fecha de Ingreso
            if (!checkIn) {
                document.getElementById('checkInError').style.display = 'block';
                esValido = false;
            }

            // Validar Fecha de Salida (Debe estar rellenada y ser mayor que el checkIn)
            if (!checkOut) {
                document.getElementById('checkOutError').innerText = "Por favor selecciona una fecha de salida.";
                document.getElementById('checkOutError').style.display = 'block';
                esValido = false;
            } else if (checkIn && checkOut <= checkIn) {
                document.getElementById('checkOutError').innerText = "La fecha de salida debe ser posterior al ingreso.";
                document.getElementById('checkOutError').style.display = 'block';
                esValido = false;
            }

            // ACCIÓN FINAL EN BASE A LA VALIDACIÓN
            if (esValido) {
                // Éxito de reserva simulado con datos dinámicos reales
                showAlert(
                    "¡Solicitud Recibida!", 
                    `Excelente elección, ${name}. Hemos recibido tu pre-registro para "${alojamiento}". Revisaremos la disponibilidad y te enviaremos la confirmación a tu correo.`, 
                    "success"
                );
                
                // Reiniciar el formulario
                document.getElementById('reservationForm').reset();
            } else {
                showAlert(
                    "Error de Validación", 
                    "Por favor, revisa detalladamente los campos marcados en rojo antes de enviar.", 
                    "error"
                );
            }
        });

        /* ==========================================================
           5. LÓGICA DEL CARRUSEL DE IMÁGENES DINÁMICO
           ========================================================== */
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            const slides = carousel.querySelectorAll('.carousel-slide');
            const dots = carousel.querySelectorAll('.carousel-dot');
            const prevBtn = carousel.querySelector('.carousel-prev');
            const nextBtn = carousel.querySelector('.carousel-next');
            
            let currentIndex = 0;
            let slideInterval;
            const intervalTime = 5000; // 5 segundos por diapositiva

            function showSlide(index) {
                // Remover clases activas de todas las diapositivas y puntos
                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                // Asegurar que el índice esté dentro de los límites
                currentIndex = (index + slides.length) % slides.length;
                
                // Agregar clase activa al slide y dot correspondiente
                slides[currentIndex].classList.add('active');
                dots[currentIndex].classList.add('active');
            }

            function nextSlide() {
                showSlide(currentIndex + 1);
            }

            function prevSlide() {
                showSlide(currentIndex - 1);
            }

            // Listeners de eventos para las flechas
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    nextSlide();
                    resetTimer();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    prevSlide();
                    resetTimer();
                });
            }

            // Listeners de eventos para los indicadores (puntos)
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    showSlide(index);
                    resetTimer();
                });
            });

            // Temporizador de Autoreproducción
            function startTimer() {
                slideInterval = setInterval(nextSlide, intervalTime);
            }

            function stopTimer() {
                clearInterval(slideInterval);
            }

            function resetTimer() {
                stopTimer();
                startTimer();
            }

            // Pausar al pasar el mouse por encima y reanudar al salir
            carousel.addEventListener('mouseenter', stopTimer);
            carousel.addEventListener('mouseleave', startTimer);

            // Inicializar
            startTimer();
        }
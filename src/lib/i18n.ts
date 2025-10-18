import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.dashboard': 'Dashboard',
      'nav.programs': 'Programs',
      'nav.progress': 'Progress',
      'nav.library': 'Library',
      'nav.coaches': 'Coaches',
      'nav.settings': 'Settings',
      'nav.income': 'Income',
      'nav.clients': 'Clients',
      'nav.blog': 'Blog',
      'nav.logout': 'Logout',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.close': 'Close',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.submit': 'Submit',
      'common.continue': 'Continue',
      'common.finish': 'Finish',
      'common.morning': 'Morning',
      'common.afternoon': 'Afternoon',
      'common.evening': 'Evening',
      'common.coach': 'Coach',
      'common.customer': 'Customer',
      'common.viewDetails': 'View Details',
      'common.free': 'Free',
      'common.plan': 'Plan',
      'common.noDataAvailable': 'No data available',
      'common.refresh': 'Refresh',
      
      // Client Status
      'clientStatus.noStatus': 'No Status',
      'clientStatus.waitingOffer': 'Waiting Offer',
      'clientStatus.missingProgram': 'Missing Program',
      'clientStatus.programActive': 'Program Active',
      'clientStatus.onTrack': 'On Track',
      'clientStatus.offTrack': 'Off Track',
      'clientStatus.soonToExpire': 'Soon to Expire',
      
      // Settings
      'settings.changePassword': 'Change Password',
      'settings.updatePassword': 'Update Password',
      'settings.preferences': 'Preferences',
      'settings.preferredLanguage': 'Preferred Language',
      
      // Auth
      'auth.currentPassword': 'Current Password',
      'auth.newPassword': 'New Password',
      'auth.confirmPassword': 'Confirm New Password',
      
      // Income
      'income.dashboard': 'Income Dashboard',
      'income.description': 'Manage your earnings, track client payments, and request payouts.',
      'income.currentBalance': 'Current Balance',
      'income.totalEarned': 'Total Earned (All Time)',
      'income.lastMonthIncome': 'Last Month Income',
      'income.pendingPayouts': 'Pending Payouts',
      'income.payouts': 'Payouts',
      'income.noPayoutsYet': 'No payouts yet.',
      'income.noCompletedEarningsYet': 'No Completed Earnings Yet',
      'income.clientIncomeDescription': 'Client income will appear here once their payment periods are complete.',
      'income.recentActivity': 'Recent Activity',
      'income.clientIncomeBreakdown': 'Client Income Breakdown',
      'income.client': 'Client',
      'income.contracts': 'Contracts',
      'income.lastPayout': 'Last Payout',
      
      // Clients
      'clients.management': 'Client Management',
      'clients.description': 'A detailed overview of all your clients, their status, and new requests.',
      'clients.incomingRequests': 'Incoming Requests',
      'clients.newRequest': 'New Request',
      'clients.newCustomer': 'New Customer',
      'clients.noEmailProvided': 'No email provided',
      'clients.freePlan': 'Free Plan',
      'clients.startChat': 'Start Chat',
      'clients.viewProfile': 'View Profile',
      'clients.accept': 'Accept',
      'clients.decline': 'Decline',
      'clients.loadingRequests': 'Loading requests...',
      'clients.filterClients': 'Filter Clients',
      'clients.clearAll': 'Clear All',
      'clients.status': 'Status',
      'clients.badges': 'Badges',
      'clients.activeFilters': 'Active Filters',
      
      // Programs
      'programs.description': 'Manage all your created programs. Assign, schedule, and edit them with ease.',
      
      // Library
      'library.title': 'Your Library',
      'library.searchPlaceholder': 'Search {{category}}...',
      'library.allContent': 'all content',
      'library.filter': 'Filter',
      'library.filterByType': 'Filter by Type',
      'library.items': 'items',
      
      // Blog
      'blog.title': 'Blog Posts',
      'blog.searchPlaceholder': 'Search {{category}}...',
      'blog.allPosts': 'all posts',
      'blog.filter': 'Filter',
      'blog.filterByTopic': 'Filter by Topic',
      'blog.allTopics': 'All Topics',
      'blog.posts': 'posts',
      
      // Messages
      'messages.loadingConversations': 'Loading conversations...',
      'messages.selectConversation': 'Select a conversation',
      'messages.chooseConversation': 'Choose a conversation from the list to start messaging',
      
      // Blog
      'blog.accessRequired': 'Blog Access Required',
      'blog.accessDescription': 'Access our exclusive blog content with expert insights, tips, and guidance from our professional coaches.',
      'blog.subscribeNow': 'Subscribe Now',
      'blog.findCoach': 'Find a Coach',
      'blog.thisJustIn': 'This Just In',
      
      // My Coach
      'mycoach.coachingHub': 'Coaching Hub',
      'mycoach.description': 'Your complete coach management center.',
      'mycoach.myCoach': 'My Coach',
      'mycoach.exploreHistory': 'Explore & History',
      'mycoach.noCoach': 'You don\'t have any coach',
      'mycoach.findCoachFromTab': 'Find a coach from the Explore & History tab.',
      'mycoach.goToExplore': 'Go to Explore & History',
      
      // Progress
      'progress.tracking': 'Progress Tracking',
      'progress.unlockDescription': 'Unlock detailed progress tracking and analytics with a paid plan. Track your fitness journey, monitor trends, and get personalized insights.',
      'progress.yourProgress': 'Your Progress',
      
      // Programs
      'programs.noActiveProgram': 'No active program schedule found.',
      'programs.noTasksToday': 'No tasks today!',
      
      // Settings
      'settings.coachSettings': 'Coach Settings',
      'settings.description': 'Shape your professional profile and manage account settings.',
      'settings.publicProfile': 'Public Profile',
      'settings.accountSecurity': 'Account & Security',
      'settings.profileStrength': 'Profile Strength',
      'settings.weak': 'Weak',
      'settings.fair': 'Fair',
      'settings.good': 'Good',
      'settings.excellent': 'Excellent',
      'settings.complete': 'Complete',
      'settings.completeProfileToStandOut': 'Complete your profile to stand out:',
      'settings.profileCompleteMessage': 'Perfect! Your profile is complete and ready to attract clients.',
      'settings.profilePhoto': 'Profile Photo',
      'settings.profilePhotoTip': 'A professional photo builds trust',
      'settings.completeBio': 'Complete Bio (100+ chars)',
      'settings.completeBioTip': 'Tell clients why you\'re the right coach',
      'settings.skills': 'Skills (3+ selected)',
      'settings.skillsTip': 'Help clients find you based on expertise',
      'settings.certifications': 'Certifications',
      'settings.certificationsTip': 'Showcase your credentials to build credibility',
      'settings.socialLinks': 'Social Links',
      'settings.socialLinksTip': 'Let clients see your content and community',
      'settings.priceRange': 'Price Range',
      'settings.priceRangeTip': 'Set clear expectations for potential clients',
      
      // Language Switcher
      'language.english': 'English',
      'language.spanish': 'Español',
      'language.french': 'Français',
      'language.german': 'Deutsch',
      'language.select': 'Select Language',
      
      // Dashboard
      'dashboard.welcome': 'Welcome back',
      'dashboard.overview': 'Overview',
      'dashboard.recentActivity': 'Recent Activity',
      'dashboard.quickActions': 'Quick Actions',
      'dashboard.goodMorning': 'Good {{timeOfDay}}, {{coachName}}',
      'dashboard.totalClients': 'Total Clients',
      'dashboard.totalEarning': 'Total Earning',
      'dashboard.activePrograms': 'Active Programs',
      'dashboard.retentionRate': 'Retention Rate',
      'dashboard.sinceLastMonth': 'Since last month',
      'dashboard.allTimeNet': 'All time net',
      'dashboard.activeClients': 'Active clients',
      'dashboard.subscribedCustomers': 'Subscribed customers',
      'dashboard.loadingMotivation': 'Loading your daily motivation...',
      'dashboard.readyToMakeImpact': 'Ready to make an impact today?',
      'dashboard.actionBoard': 'Action Board',
      'dashboard.actionBoardDescription': 'Tasks that require your immediate attention.',
      'dashboard.noImmediateTasks': 'No immediate tasks.',
      'dashboard.clientStatuses': 'Client Statuses',
      'dashboard.clientStatusesDescription': 'An overview of all your clients and their current status.',
      'dashboard.noClientsYet': 'No clients yet.',
      
      // Programs
      'programs.title': 'Programs',
      'programs.create': 'Create Program',
      'programs.active': 'Active Programs',
      'programs.completed': 'Completed Programs',
      'programs.duration': 'Duration',
      'programs.startDate': 'Start Date',
      'programs.endDate': 'End Date',
      'programs.status': 'Status',
      
      // Progress
      'progress.title': 'Progress',
      'progress.today': 'Today',
      'progress.thisWeek': 'This Week',
      'progress.thisMonth': 'This Month',
      'progress.weight': 'Weight',
      'progress.measurements': 'Measurements',
      'progress.photos': 'Photos',
      'progress.notes': 'Notes',
      
      // Settings
      'settings.title': 'Settings',
      'settings.profile': 'Profile',
      'settings.notifications': 'Notifications',
      'settings.privacy': 'Privacy',
      'settings.account': 'Account',
      
      // AI Coach
      'ai.title': 'AI Coach',
      'ai.generatePlan': 'Generate Plan',
      'ai.trends': 'Trend Analysis',
      'ai.recommendations': 'Recommendations',
      'ai.subscriptionRequired': 'AI Coach requires an active subscription',
      
      // Payouts
      'payout.title': 'Payout Settings',
      'payout.balance': 'Available Balance',
      'payout.method': 'Payout Method',
      'payout.bank': 'Bank Transfer',
      'payout.paypal': 'PayPal',
      'payout.stripe': 'Stripe',
      'payout.request': 'Request Payout',
      
      // Profile Strength
      'profile.strength': 'Profile Strength',
      'profile.completed': 'Completed',
      'profile.missing': 'Missing',
      'profile.recommendations': 'Recommendations',
      'profile.improve': 'Improve Profile',
      'profile.title': 'Profile',
      'profile.description': 'View all your profile details here.',
      'profile.premiumMember': 'Premium Member',
      'profile.freeMember': 'Free Member',
      'profile.starting': 'Starting...',
      'profile.startTrial': 'Start 14-Day Trial',
      'profile.manageBilling': 'Manage Billing',
      'profile.contactPersonalInfo': 'Contact & Personal Information',
      'profile.settingsLegal': 'Settings & Legal',
      'profile.paymentHistory': 'Payment History',
      'profile.loadingPaymentHistory': 'Loading payment history...',
      'profile.date': 'Date',
      'profile.amount': 'Amount',
      'profile.status': 'Status',
      'profile.noPaymentHistory': 'No payment history available',
      
      // Contract Extension
      'contract.extension': 'Contract Extension',
      'contract.available': 'Extension Available',
      'contract.notAvailable': 'Extension Not Yet Available',
      'contract.weeksRemaining': 'Weeks Remaining',
      'contract.requestExtension': 'Request Extension',
      
      // Program Countdown
      'countdown.title': 'Program Timeline',
      'countdown.progress': 'Progress',
      'countdown.timeRemaining': 'Time Remaining',
      'countdown.startsIn': 'Starts In',
      'countdown.completed': 'Program Completed!',
      'countdown.duration': 'Duration',
      'countdown.startDate': 'Start Date',
      'countdown.endDate': 'End Date',
      'countdown.status': 'Status',
      
      // Messages
      'messages.title': 'Messages',
      'messages.motivational': 'Motivational',
      'messages.system': 'System',
      'messages.automated': 'Automated',
      'messages.send': 'Send Message',
      
      // Feature Verification
      'features.title': 'Feature Verification',
      'features.completed': 'Completed Features',
      'features.total': 'Total Features',
      'features.completionRate': 'Completion Rate',
      'features.testAll': 'Test All Features',
      'features.testEndpoint': 'Test Endpoint',
      'features.working': 'Endpoint working',
      'features.failed': 'Endpoint failed',
      'features.notes': 'Implementation Notes',
    }
  },
  es: {
    translation: {
      // Navigation
      'nav.home': 'Inicio',
      'nav.dashboard': 'Panel',
      'nav.programs': 'Programas',
      'nav.progress': 'Progreso',
      'nav.library': 'Biblioteca',
      'nav.coaches': 'Entrenadores',
      'nav.settings': 'Configuración',
      'nav.income': 'Ingresos',
      'nav.clients': 'Clientes',
      'nav.blog': 'Blog',
      'nav.logout': 'Cerrar Sesión',
      
      // Common
      'common.loading': 'Cargando...',
      'common.error': 'Error',
      'common.success': 'Éxito',
      'common.save': 'Guardar',
      'common.cancel': 'Cancelar',
      'common.delete': 'Eliminar',
      'common.edit': 'Editar',
      'common.view': 'Ver',
      'common.close': 'Cerrar',
      'common.back': 'Atrás',
      'common.next': 'Siguiente',
      'common.previous': 'Anterior',
      'common.submit': 'Enviar',
      'common.continue': 'Continuar',
      'common.finish': 'Finalizar',
      'common.morning': 'Mañana',
      'common.afternoon': 'Tarde',
      'common.evening': 'Noche',
      'common.coach': 'Entrenador',
      'common.customer': 'Cliente',
      'common.viewDetails': 'Ver Detalles',
      'common.free': 'Gratis',
      'common.plan': 'Plan',
      'common.noDataAvailable': 'No hay datos disponibles',
      'common.refresh': 'Actualizar',
      
      // Client Status
      'clientStatus.noStatus': 'Sin Estado',
      'clientStatus.waitingOffer': 'Esperando Oferta',
      'clientStatus.missingProgram': 'Programa Faltante',
      'clientStatus.programActive': 'Programa Activo',
      'clientStatus.onTrack': 'En Camino',
      'clientStatus.offTrack': 'Fuera de Camino',
      'clientStatus.soonToExpire': 'Próximo a Vencer',
      
      // Settings
      'settings.changePassword': 'Cambiar Contraseña',
      'settings.updatePassword': 'Actualizar Contraseña',
      'settings.preferences': 'Preferencias',
      'settings.preferredLanguage': 'Idioma Preferido',
      
      // Auth
      'auth.currentPassword': 'Contraseña Actual',
      'auth.newPassword': 'Nueva Contraseña',
      'auth.confirmPassword': 'Confirmar Nueva Contraseña',
      
      // Income
      'income.dashboard': 'Panel de Ingresos',
      'income.description': 'Gestiona tus ganancias, rastrea los pagos de clientes y solicita pagos.',
      'income.currentBalance': 'Saldo Actual',
      'income.totalEarned': 'Total Ganado (Todo el Tiempo)',
      'income.lastMonthIncome': 'Ingresos del Mes Pasado',
      'income.pendingPayouts': 'Pagos Pendientes',
      'income.payouts': 'Pagos',
      'income.noPayoutsYet': 'Aún no hay pagos.',
      'income.noCompletedEarningsYet': 'Aún No Hay Ganancias Completadas',
      'income.clientIncomeDescription': 'Los ingresos de clientes aparecerán aquí una vez que sus períodos de pago estén completos.',
      'income.recentActivity': 'Actividad Reciente',
      'income.clientIncomeBreakdown': 'Desglose de Ingresos de Clientes',
      'income.client': 'Cliente',
      'income.contracts': 'Contratos',
      'income.lastPayout': 'Último Pago',
      
      // Clients
      'clients.management': 'Gestión de Clientes',
      'clients.description': 'Una descripción detallada de todos sus clientes, su estado y nuevas solicitudes.',
      'clients.incomingRequests': 'Solicitudes Entrantes',
      'clients.newRequest': 'Nueva Solicitud',
      'clients.newCustomer': 'Nuevo Cliente',
      'clients.noEmailProvided': 'No se proporcionó email',
      'clients.freePlan': 'Plan Gratuito',
      'clients.startChat': 'Iniciar Chat',
      'clients.viewProfile': 'Ver Perfil',
      'clients.accept': 'Aceptar',
      'clients.decline': 'Rechazar',
      'clients.loadingRequests': 'Cargando solicitudes...',
      'clients.filterClients': 'Filtrar Clientes',
      'clients.clearAll': 'Limpiar Todo',
      'clients.status': 'Estado',
      'clients.badges': 'Insignias',
      'clients.activeFilters': 'Filtros Activos',
      
      // Programs
      'programs.description': 'Gestiona todos tus programas creados. Asígnalos, programa y edítalos con facilidad.',
      
      // Library
      'library.title': 'Tu Biblioteca',
      'library.searchPlaceholder': 'Buscar {{category}}...',
      'library.allContent': 'todo el contenido',
      'library.filter': 'Filtrar',
      'library.filterByType': 'Filtrar por Tipo',
      'library.items': 'elementos',
      
      // Blog
      'blog.title': 'Publicaciones del Blog',
      'blog.searchPlaceholder': 'Buscar {{category}}...',
      'blog.allPosts': 'todas las publicaciones',
      'blog.filter': 'Filtrar',
      'blog.filterByTopic': 'Filtrar por Tema',
      'blog.allTopics': 'Todos los Temas',
      'blog.posts': 'publicaciones',
      
      // Messages
      'messages.loadingConversations': 'Cargando conversaciones...',
      'messages.selectConversation': 'Seleccionar una conversación',
      'messages.chooseConversation': 'Elige una conversación de la lista para comenzar a chatear',
      
      // Blog
      'blog.accessRequired': 'Acceso al Blog Requerido',
      'blog.accessDescription': 'Accede a nuestro contenido exclusivo del blog con conocimientos de expertos, consejos y orientación de nuestros entrenadores profesionales.',
      'blog.subscribeNow': 'Suscribirse Ahora',
      'blog.findCoach': 'Encontrar un Entrenador',
      'blog.thisJustIn': 'Esto Acaba de Llegar',
      
      // My Coach
      'mycoach.coachingHub': 'Centro de Entrenamiento',
      'mycoach.description': 'Tu centro completo de gestión de entrenadores.',
      'mycoach.myCoach': 'Mi Entrenador',
      'mycoach.exploreHistory': 'Explorar e Historial',
      'mycoach.noCoach': 'No tienes ningún entrenador',
      'mycoach.findCoachFromTab': 'Encuentra un entrenador en la pestaña Explorar e Historial.',
      'mycoach.goToExplore': 'Ir a Explorar e Historial',
      
      // Progress
      'progress.tracking': 'Seguimiento de Progreso',
      'progress.unlockDescription': 'Desbloquea el seguimiento detallado del progreso y análisis con un plan de pago. Rastrea tu viaje de fitness, monitorea tendencias y obtén perspectivas personalizadas.',
      'progress.yourProgress': 'Tu Progreso',
      
      // Programs
      'programs.noActiveProgram': 'No se encontró programa activo.',
      'programs.noTasksToday': '¡No hay tareas hoy!',
      
      // Settings
      'settings.coachSettings': 'Configuración del Entrenador',
      'settings.description': 'Dale forma a tu perfil profesional y gestiona la configuración de tu cuenta.',
      'settings.publicProfile': 'Perfil Público',
      'settings.accountSecurity': 'Cuenta y Seguridad',
      'settings.profileStrength': 'Fortaleza del Perfil',
      'settings.weak': 'Débil',
      'settings.fair': 'Regular',
      'settings.good': 'Bueno',
      'settings.excellent': 'Excelente',
      'settings.complete': 'Completo',
      'settings.completeProfileToStandOut': 'Completa tu perfil para destacar:',
      'settings.profileCompleteMessage': '¡Perfecto! Tu perfil está completo y listo para atraer clientes.',
      'settings.profilePhoto': 'Foto de Perfil',
      'settings.profilePhotoTip': 'Una foto profesional genera confianza',
      'settings.completeBio': 'Biografía Completa (100+ caracteres)',
      'settings.completeBioTip': 'Dile a los clientes por qué eres el entrenador adecuado',
      'settings.skills': 'Habilidades (3+ seleccionadas)',
      'settings.skillsTip': 'Ayuda a los clientes a encontrarte basándose en tu experiencia',
      'settings.certifications': 'Certificaciones',
      'settings.certificationsTip': 'Muestra tus credenciales para generar credibilidad',
      'settings.socialLinks': 'Enlaces Sociales',
      'settings.socialLinksTip': 'Deja que los clientes vean tu contenido y comunidad',
      'settings.priceRange': 'Rango de Precios',
      'settings.priceRangeTip': 'Establece expectativas claras para clientes potenciales',
      
      // Language Switcher
      'language.english': 'English',
      'language.spanish': 'Español',
      'language.french': 'Français',
      'language.german': 'Deutsch',
      'language.select': 'Seleccionar Idioma',
      
      // Dashboard
      'dashboard.welcome': 'Bienvenido de nuevo',
      'dashboard.overview': 'Resumen',
      'dashboard.recentActivity': 'Actividad Reciente',
      'dashboard.quickActions': 'Acciones Rápidas',
      'dashboard.goodMorning': 'Buenos {{timeOfDay}}, {{coachName}}',
      'dashboard.totalClients': 'Total Clientes',
      'dashboard.totalEarning': 'Ganancias Totales',
      'dashboard.activePrograms': 'Programas Activos',
      'dashboard.retentionRate': 'Tasa de Retención',
      'dashboard.sinceLastMonth': 'Desde el mes pasado',
      'dashboard.allTimeNet': 'Neto total',
      'dashboard.activeClients': 'Clientes activos',
      'dashboard.subscribedCustomers': 'Clientes suscritos',
      'dashboard.loadingMotivation': 'Cargando tu motivación diaria...',
      'dashboard.readyToMakeImpact': '¿Listo para hacer un impacto hoy?',
      'dashboard.actionBoard': 'Tablero de Acciones',
      'dashboard.actionBoardDescription': 'Tareas que requieren tu atención inmediata.',
      'dashboard.noImmediateTasks': 'No hay tareas inmediatas.',
      'dashboard.clientStatuses': 'Estados de Clientes',
      'dashboard.clientStatusesDescription': 'Una visión general de todos tus clientes y su estado actual.',
      'dashboard.noClientsYet': 'Aún no hay clientes.',
      
      // Programs
      'programs.title': 'Programas',
      'programs.create': 'Crear Programa',
      'programs.active': 'Programas Activos',
      'programs.completed': 'Programas Completados',
      'programs.duration': 'Duración',
      'programs.startDate': 'Fecha de Inicio',
      'programs.endDate': 'Fecha de Fin',
      'programs.status': 'Estado',
      
      // Progress
      'progress.title': 'Progreso',
      'progress.today': 'Hoy',
      'progress.thisWeek': 'Esta Semana',
      'progress.thisMonth': 'Este Mes',
      'progress.weight': 'Peso',
      'progress.measurements': 'Medidas',
      'progress.photos': 'Fotos',
      'progress.notes': 'Notas',
      
      // Settings
      'settings.title': 'Configuración',
      'settings.profile': 'Perfil',
      'settings.notifications': 'Notificaciones',
      'settings.privacy': 'Privacidad',
      'settings.account': 'Cuenta',
      
      // AI Coach
      'ai.title': 'Entrenador IA',
      'ai.generatePlan': 'Generar Plan',
      'ai.trends': 'Análisis de Tendencias',
      'ai.recommendations': 'Recomendaciones',
      'ai.subscriptionRequired': 'El Entrenador IA requiere una suscripción activa',
      
      // Payouts
      'payout.title': 'Configuración de Pagos',
      'payout.balance': 'Saldo Disponible',
      'payout.method': 'Método de Pago',
      'payout.bank': 'Transferencia Bancaria',
      'payout.paypal': 'PayPal',
      'payout.stripe': 'Stripe',
      'payout.request': 'Solicitar Pago',
      
      // Profile Strength
      'profile.strength': 'Fortaleza del Perfil',
      'profile.completed': 'Completado',
      'profile.missing': 'Faltante',
      'profile.recommendations': 'Recomendaciones',
      'profile.improve': 'Mejorar Perfil',
      'profile.title': 'Perfil',
      'profile.description': 'Ve todos los detalles de tu perfil aquí.',
      'profile.premiumMember': 'Miembro Premium',
      'profile.freeMember': 'Miembro Gratuito',
      'profile.starting': 'Iniciando...',
      'profile.startTrial': 'Iniciar Prueba de 14 Días',
      'profile.manageBilling': 'Gestionar Facturación',
      'profile.contactPersonalInfo': 'Contacto e Información Personal',
      'profile.settingsLegal': 'Configuración y Legal',
      'profile.paymentHistory': 'Historial de Pagos',
      'profile.loadingPaymentHistory': 'Cargando historial de pagos...',
      'profile.date': 'Fecha',
      'profile.amount': 'Cantidad',
      'profile.status': 'Estado',
      'profile.noPaymentHistory': 'No hay historial de pagos disponible',
      
      // Contract Extension
      'contract.extension': 'Extensión de Contrato',
      'contract.available': 'Extensión Disponible',
      'contract.notAvailable': 'Extensión Aún No Disponible',
      'contract.weeksRemaining': 'Semanas Restantes',
      'contract.requestExtension': 'Solicitar Extensión',
      
      // Program Countdown
      'countdown.title': 'Cronograma del Programa',
      'countdown.progress': 'Progreso',
      'countdown.timeRemaining': 'Tiempo Restante',
      'countdown.startsIn': 'Comienza En',
      'countdown.completed': '¡Programa Completado!',
      'countdown.duration': 'Duración',
      'countdown.startDate': 'Fecha de Inicio',
      'countdown.endDate': 'Fecha de Fin',
      'countdown.status': 'Estado',
      
      // Messages
      'messages.title': 'Mensajes',
      'messages.motivational': 'Motivacional',
      'messages.system': 'Sistema',
      'messages.automated': 'Automatizado',
      'messages.send': 'Enviar Mensaje',
      
      // Feature Verification
      'features.title': 'Verificación de Características',
      'features.completed': 'Características Completadas',
      'features.total': 'Total de Características',
      'features.completionRate': 'Tasa de Finalización',
      'features.testAll': 'Probar Todas las Características',
      'features.testEndpoint': 'Probar Endpoint',
      'features.working': 'Endpoint funcionando',
      'features.failed': 'Endpoint falló',
      'features.notes': 'Notas de Implementación',
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.dashboard': 'Tableau de bord',
      'nav.programs': 'Programmes',
      'nav.progress': 'Progrès',
      'nav.library': 'Bibliothèque',
      'nav.coaches': 'Entraîneurs',
      'nav.settings': 'Paramètres',
      'nav.income': 'Revenus',
      'nav.clients': 'Clients',
      'nav.blog': 'Blog',
      'nav.logout': 'Déconnexion',
      
      // Common
      'common.loading': 'Chargement...',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.save': 'Enregistrer',
      'common.cancel': 'Annuler',
      'common.delete': 'Supprimer',
      'common.edit': 'Modifier',
      'common.view': 'Voir',
      'common.close': 'Fermer',
      'common.back': 'Retour',
      'common.next': 'Suivant',
      'common.previous': 'Précédent',
      'common.submit': 'Soumettre',
      'common.continue': 'Continuer',
      'common.finish': 'Terminer',
      'common.morning': 'Matin',
      'common.afternoon': 'Après-midi',
      'common.evening': 'Soir',
      'common.coach': 'Entraîneur',
      'common.customer': 'Client',
      'common.viewDetails': 'Voir Détails',
      'common.free': 'Gratuit',
      'common.plan': 'Plan',
      'common.noDataAvailable': 'Aucune donnée disponible',
      'common.refresh': 'Actualiser',
      
      // Client Status
      'clientStatus.noStatus': 'Aucun Statut',
      'clientStatus.waitingOffer': 'En Attente d\'Offre',
      'clientStatus.missingProgram': 'Programme Manquant',
      'clientStatus.programActive': 'Programme Actif',
      'clientStatus.onTrack': 'Sur la Bonne Voie',
      'clientStatus.offTrack': 'Hors Piste',
      'clientStatus.soonToExpire': 'Expire Bientôt',
      
      // Settings
      'settings.changePassword': 'Changer le Mot de Passe',
      'settings.updatePassword': 'Mettre à Jour le Mot de Passe',
      'settings.preferences': 'Préférences',
      'settings.preferredLanguage': 'Langue Préférée',
      
      // Auth
      'auth.currentPassword': 'Mot de Passe Actuel',
      'auth.newPassword': 'Nouveau Mot de Passe',
      'auth.confirmPassword': 'Confirmer le Nouveau Mot de Passe',
      
      // Income
      'income.dashboard': 'Tableau de Bord des Revenus',
      'income.description': 'Gérez vos gains, suivez les paiements des clients et demandez des paiements.',
      'income.currentBalance': 'Solde Actuel',
      'income.totalEarned': 'Total Gagné (Tout Temps)',
      'income.lastMonthIncome': 'Revenus du Mois Dernier',
      'income.pendingPayouts': 'Paiements en Attente',
      'income.payouts': 'Paiements',
      'income.noPayoutsYet': 'Aucun paiement pour le moment.',
      'income.noCompletedEarningsYet': 'Aucun Gain Terminé Encore',
      'income.clientIncomeDescription': 'Les revenus des clients apparaîtront ici une fois leurs périodes de paiement terminées.',
      'income.recentActivity': 'Activité Récente',
      'income.clientIncomeBreakdown': 'Répartition des Revenus Clients',
      'income.client': 'Client',
      'income.contracts': 'Contrats',
      'income.lastPayout': 'Dernier Paiement',
      
      // Clients
      'clients.management': 'Gestion des Clients',
      'clients.description': 'Un aperçu détaillé de tous vos clients, leur statut et les nouvelles demandes.',
      'clients.incomingRequests': 'Demandes Entrantes',
      'clients.newRequest': 'Nouvelle Demande',
      'clients.newCustomer': 'Nouveau Client',
      'clients.noEmailProvided': 'Aucun email fourni',
      'clients.freePlan': 'Plan Gratuit',
      'clients.startChat': 'Commencer le Chat',
      'clients.viewProfile': 'Voir le Profil',
      'clients.accept': 'Accepter',
      'clients.decline': 'Refuser',
      'clients.loadingRequests': 'Chargement des demandes...',
      'clients.filterClients': 'Filtrer les Clients',
      'clients.clearAll': 'Tout Effacer',
      'clients.status': 'Statut',
      'clients.badges': 'Badges',
      'clients.activeFilters': 'Filtres Actifs',
      
      // Programs
      'programs.description': 'Gérez tous vos programmes créés. Assignez-les, planifiez-les et modifiez-les facilement.',
      
      // Library
      'library.title': 'Votre Bibliothèque',
      'library.searchPlaceholder': 'Rechercher {{category}}...',
      'library.allContent': 'tout le contenu',
      'library.filter': 'Filtrer',
      'library.filterByType': 'Filtrer par Type',
      'library.items': 'éléments',
      
      // Blog
      'blog.title': 'Articles de Blog',
      'blog.searchPlaceholder': 'Rechercher {{category}}...',
      'blog.allPosts': 'tous les articles',
      'blog.filter': 'Filtrer',
      'blog.filterByTopic': 'Filtrer par Sujet',
      'blog.allTopics': 'Tous les Sujets',
      'blog.posts': 'articles',
      
      // Messages
      'messages.loadingConversations': 'Chargement des conversations...',
      'messages.selectConversation': 'Sélectionner une conversation',
      'messages.chooseConversation': 'Choisissez une conversation de la liste pour commencer à discuter',
      
      // Blog
      'blog.accessRequired': 'Accès au Blog Requis',
      'blog.accessDescription': 'Accédez à notre contenu exclusif de blog avec des insights d\'experts, des conseils et des conseils de nos entraîneurs professionnels.',
      'blog.subscribeNow': 'S\'abonner Maintenant',
      'blog.findCoach': 'Trouver un Entraîneur',
      'blog.thisJustIn': 'Dernières Nouvelles',
      
      // My Coach
      'mycoach.coachingHub': 'Centre d\'Entraînement',
      'mycoach.description': 'Votre centre complet de gestion d\'entraîneurs.',
      'mycoach.myCoach': 'Mon Entraîneur',
      'mycoach.exploreHistory': 'Explorer et Historique',
      'mycoach.noCoach': 'Vous n\'avez aucun entraîneur',
      'mycoach.findCoachFromTab': 'Trouvez un entraîneur dans l\'onglet Explorer et Historique.',
      'mycoach.goToExplore': 'Aller à Explorer et Historique',
      
      // Progress
      'progress.tracking': 'Suivi des Progrès',
      'progress.unlockDescription': 'Débloquez le suivi détaillé des progrès et les analyses avec un plan payant. Suivez votre parcours fitness, surveillez les tendances et obtenez des insights personnalisés.',
      'progress.yourProgress': 'Vos Progrès',
      
      // Programs
      'programs.noActiveProgram': 'Aucun programme actif trouvé.',
      'programs.noTasksToday': 'Aucune tâche aujourd\'hui !',
      
      // Settings
      'settings.coachSettings': 'Paramètres de l\'Entraîneur',
      'settings.description': 'Formez votre profil professionnel et gérez les paramètres de votre compte.',
      'settings.publicProfile': 'Profil Public',
      'settings.accountSecurity': 'Compte et Sécurité',
      'settings.profileStrength': 'Force du Profil',
      'settings.weak': 'Faible',
      'settings.fair': 'Moyen',
      'settings.good': 'Bon',
      'settings.excellent': 'Excellent',
      'settings.complete': 'Complet',
      'settings.completeProfileToStandOut': 'Complétez votre profil pour vous démarquer :',
      'settings.profileCompleteMessage': 'Parfait ! Votre profil est complet et prêt à attirer des clients.',
      'settings.profilePhoto': 'Photo de Profil',
      'settings.profilePhotoTip': 'Une photo professionnelle inspire confiance',
      'settings.completeBio': 'Biographie Complète (100+ caractères)',
      'settings.completeBioTip': 'Dites aux clients pourquoi vous êtes le bon entraîneur',
      'settings.skills': 'Compétences (3+ sélectionnées)',
      'settings.skillsTip': 'Aidez les clients à vous trouver basé sur votre expertise',
      'settings.certifications': 'Certifications',
      'settings.certificationsTip': 'Montrez vos qualifications pour établir la crédibilité',
      'settings.socialLinks': 'Liens Sociaux',
      'settings.socialLinksTip': 'Laissez les clients voir votre contenu et communauté',
      'settings.priceRange': 'Gamme de Prix',
      'settings.priceRangeTip': 'Définissez des attentes claires pour les clients potentiels',
      
      // Language Switcher
      'language.english': 'English',
      'language.spanish': 'Español',
      'language.french': 'Français',
      'language.german': 'Deutsch',
      'language.select': 'Sélectionner la langue',
      
      // Dashboard
      'dashboard.welcome': 'Bon retour',
      'dashboard.overview': 'Aperçu',
      'dashboard.recentActivity': 'Activité récente',
      'dashboard.quickActions': 'Actions rapides',
      'dashboard.goodMorning': 'Bon {{timeOfDay}}, {{coachName}}',
      'dashboard.totalClients': 'Total Clients',
      'dashboard.totalEarning': 'Gains Totaux',
      'dashboard.activePrograms': 'Programmes Actifs',
      'dashboard.retentionRate': 'Taux de Rétention',
      'dashboard.sinceLastMonth': 'Depuis le mois dernier',
      'dashboard.allTimeNet': 'Net total',
      'dashboard.activeClients': 'Clients actifs',
      'dashboard.subscribedCustomers': 'Clients abonnés',
      'dashboard.loadingMotivation': 'Chargement de votre motivation quotidienne...',
      'dashboard.readyToMakeImpact': 'Prêt à faire une différence aujourd\'hui ?',
      'dashboard.actionBoard': 'Tableau d\'Actions',
      'dashboard.actionBoardDescription': 'Tâches qui nécessitent votre attention immédiate.',
      'dashboard.noImmediateTasks': 'Aucune tâche immédiate.',
      'dashboard.clientStatuses': 'Statuts des Clients',
      'dashboard.clientStatusesDescription': 'Un aperçu de tous vos clients et leur statut actuel.',
      'dashboard.noClientsYet': 'Aucun client pour le moment.',
      
      // Programs
      'programs.title': 'Programmes',
      'programs.create': 'Créer un programme',
      'programs.active': 'Programmes actifs',
      'programs.completed': 'Programmes terminés',
      'programs.duration': 'Durée',
      'programs.startDate': 'Date de début',
      'programs.endDate': 'Date de fin',
      'programs.status': 'Statut',
      
      // Progress
      'progress.title': 'Progrès',
      'progress.today': "Aujourd'hui",
      'progress.thisWeek': 'Cette semaine',
      'progress.thisMonth': 'Ce mois',
      'progress.weight': 'Poids',
      'progress.measurements': 'Mesures',
      'progress.photos': 'Photos',
      'progress.notes': 'Notes',
      
      // Settings
      'settings.title': 'Paramètres',
      'settings.profile': 'Profil',
      'settings.notifications': 'Notifications',
      'settings.privacy': 'Confidentialité',
      'settings.account': 'Compte',
      
      // AI Coach
      'ai.title': 'Coach IA',
      'ai.generatePlan': 'Générer un plan',
      'ai.trends': 'Analyse des tendances',
      'ai.recommendations': 'Recommandations',
      'ai.subscriptionRequired': 'Le Coach IA nécessite un abonnement actif',
      
      // Payouts
      'payout.title': 'Paramètres de paiement',
      'payout.balance': 'Solde disponible',
      'payout.method': 'Méthode de paiement',
      'payout.bank': 'Virement bancaire',
      'payout.paypal': 'PayPal',
      'payout.stripe': 'Stripe',
      'payout.request': 'Demander un paiement',
      
      // Profile Strength
      'profile.strength': 'Force du profil',
      'profile.completed': 'Terminé',
      'profile.missing': 'Manquant',
      'profile.recommendations': 'Recommandations',
      'profile.improve': 'Améliorer le profil',
      'profile.title': 'Profil',
      'profile.description': 'Voir tous les détails de votre profil ici.',
      'profile.premiumMember': 'Membre Premium',
      'profile.freeMember': 'Membre Gratuit',
      'profile.starting': 'Démarrage...',
      'profile.startTrial': 'Commencer l\'Essai de 14 Jours',
      'profile.manageBilling': 'Gérer la Facturation',
      'profile.contactPersonalInfo': 'Contact et Informations Personnelles',
      'profile.settingsLegal': 'Paramètres et Légal',
      'profile.paymentHistory': 'Historique des Paiements',
      'profile.loadingPaymentHistory': 'Chargement de l\'historique des paiements...',
      'profile.date': 'Date',
      'profile.amount': 'Montant',
      'profile.status': 'Statut',
      'profile.noPaymentHistory': 'Aucun historique de paiement disponible',
      
      // Contract Extension
      'contract.extension': 'Extension de contrat',
      'contract.available': 'Extension disponible',
      'contract.notAvailable': 'Extension pas encore disponible',
      'contract.weeksRemaining': 'Semaines restantes',
      'contract.requestExtension': 'Demander une extension',
      
      // Program Countdown
      'countdown.title': 'Chronologie du programme',
      'countdown.progress': 'Progrès',
      'countdown.timeRemaining': 'Temps restant',
      'countdown.startsIn': 'Commence dans',
      'countdown.completed': 'Programme terminé !',
      'countdown.duration': 'Durée',
      'countdown.startDate': 'Date de début',
      'countdown.endDate': 'Date de fin',
      'countdown.status': 'Statut',
      
      // Messages
      'messages.title': 'Messages',
      'messages.motivational': 'Motivationnel',
      'messages.system': 'Système',
      'messages.automated': 'Automatisé',
      'messages.send': 'Envoyer un message',
      
      // Feature Verification
      'features.title': 'Vérification des fonctionnalités',
      'features.completed': 'Fonctionnalités terminées',
      'features.total': 'Total des fonctionnalités',
      'features.completionRate': 'Taux de finalisation',
      'features.testAll': 'Tester toutes les fonctionnalités',
      'features.testEndpoint': 'Tester le point de terminaison',
      'features.working': 'Point de terminaison fonctionnel',
      'features.failed': 'Point de terminaison échoué',
      'features.notes': 'Notes de mise en œuvre',
    }
  },
  de: {
    translation: {
      // Navigation
      'nav.home': 'Startseite',
      'nav.dashboard': 'Dashboard',
      'nav.programs': 'Programme',
      'nav.progress': 'Fortschritt',
      'nav.library': 'Bibliothek',
      'nav.coaches': 'Trainer',
      'nav.settings': 'Einstellungen',
      'nav.income': 'Einkommen',
      'nav.clients': 'Kunden',
      'nav.blog': 'Blog',
      'nav.logout': 'Abmelden',
      
      // Common
      'common.loading': 'Wird geladen...',
      'common.error': 'Fehler',
      'common.success': 'Erfolg',
      'common.save': 'Speichern',
      'common.cancel': 'Abbrechen',
      'common.delete': 'Löschen',
      'common.edit': 'Bearbeiten',
      'common.view': 'Anzeigen',
      'common.close': 'Schließen',
      'common.back': 'Zurück',
      'common.next': 'Weiter',
      'common.previous': 'Vorherige',
      'common.submit': 'Absenden',
      'common.continue': 'Fortfahren',
      'common.finish': 'Beenden',
      'common.morning': 'Morgen',
      'common.afternoon': 'Nachmittag',
      'common.evening': 'Abend',
      'common.coach': 'Trainer',
      'common.customer': 'Kunde',
      'common.viewDetails': 'Details anzeigen',
      'common.free': 'Kostenlos',
      'common.plan': 'Plan',
      'common.noDataAvailable': 'Keine Daten verfügbar',
      'common.refresh': 'Aktualisieren',
      
      // Client Status
      'clientStatus.noStatus': 'Kein Status',
      'clientStatus.waitingOffer': 'Warte auf Angebot',
      'clientStatus.missingProgram': 'Programm fehlt',
      'clientStatus.programActive': 'Programm aktiv',
      'clientStatus.onTrack': 'Auf Kurs',
      'clientStatus.offTrack': 'Nicht auf Kurs',
      'clientStatus.soonToExpire': 'Läuft bald ab',
      
      // Settings
      'settings.changePassword': 'Passwort ändern',
      'settings.updatePassword': 'Passwort aktualisieren',
      'settings.preferences': 'Einstellungen',
      'settings.preferredLanguage': 'Bevorzugte Sprache',
      
      // Auth
      'auth.currentPassword': 'Aktuelles Passwort',
      'auth.newPassword': 'Neues Passwort',
      'auth.confirmPassword': 'Neues Passwort bestätigen',
      
      // Income
      'income.dashboard': 'Einkommens-Dashboard',
      'income.description': 'Verwalte deine Einnahmen, verfolge Kunden-Zahlungen und beantrage Auszahlungen.',
      'income.currentBalance': 'Aktuelles Guthaben',
      'income.totalEarned': 'Gesamt verdient (Alle Zeiten)',
      'income.lastMonthIncome': 'Letztes Monat Einkommen',
      'income.pendingPayouts': 'Ausstehende Auszahlungen',
      'income.payouts': 'Auszahlungen',
      'income.noPayoutsYet': 'Noch keine Auszahlungen.',
      'income.noCompletedEarningsYet': 'Noch keine abgeschlossenen Einnahmen',
      'income.clientIncomeDescription': 'Kundeneinnahmen werden hier angezeigt, sobald ihre Zahlungsperioden abgeschlossen sind.',
      'income.recentActivity': 'Letzte Aktivität',
      'income.clientIncomeBreakdown': 'Kundeneinkommen-Aufschlüsselung',
      'income.client': 'Kunde',
      'income.contracts': 'Verträge',
      'income.lastPayout': 'Letzte Auszahlung',
      
      // Clients
      'clients.management': 'Kundenverwaltung',
      'clients.description': 'Eine detaillierte Übersicht über alle Ihre Kunden, ihren Status und neue Anfragen.',
      'clients.incomingRequests': 'Eingehende Anfragen',
      'clients.newRequest': 'Neue Anfrage',
      'clients.newCustomer': 'Neuer Kunde',
      'clients.noEmailProvided': 'Keine E-Mail angegeben',
      'clients.freePlan': 'Kostenloser Plan',
      'clients.startChat': 'Chat starten',
      'clients.viewProfile': 'Profil anzeigen',
      'clients.accept': 'Akzeptieren',
      'clients.decline': 'Ablehnen',
      'clients.loadingRequests': 'Anfragen werden geladen...',
      'clients.filterClients': 'Kunden filtern',
      'clients.clearAll': 'Alle löschen',
      'clients.status': 'Status',
      'clients.badges': 'Abzeichen',
      'clients.activeFilters': 'Aktive Filter',
      
      // Programs
      'programs.description': 'Verwalten Sie alle Ihre erstellten Programme. Weisen Sie sie zu, planen Sie sie und bearbeiten Sie sie mit Leichtigkeit.',
      
      // Library
      'library.title': 'Ihre Bibliothek',
      'library.searchPlaceholder': '{{category}} durchsuchen...',
      'library.allContent': 'alle Inhalte',
      'library.filter': 'Filter',
      'library.filterByType': 'Nach Typ filtern',
      'library.items': 'Elemente',
      
      // Blog
      'blog.title': 'Blog-Beiträge',
      'blog.searchPlaceholder': '{{category}} durchsuchen...',
      'blog.allPosts': 'alle Beiträge',
      'blog.filter': 'Filter',
      'blog.filterByTopic': 'Nach Thema filtern',
      'blog.allTopics': 'Alle Themen',
      'blog.posts': 'Beiträge',
      
      // Messages
      'messages.loadingConversations': 'Unterhaltungen werden geladen...',
      'messages.selectConversation': 'Wählen Sie eine Unterhaltung',
      'messages.chooseConversation': 'Wählen Sie eine Unterhaltung aus der Liste, um mit dem Messaging zu beginnen',
      
      // Blog
      'blog.accessRequired': 'Blog-Zugang erforderlich',
      'blog.accessDescription': 'Zugang zu unserem exklusiven Blog-Inhalt mit Experteneinblicken, Tipps und Anleitungen von unseren professionellen Trainern.',
      'blog.subscribeNow': 'Jetzt abonnieren',
      'blog.findCoach': 'Trainer finden',
      'blog.thisJustIn': 'Das Neueste',
      
      // My Coach
      'mycoach.coachingHub': 'Trainer-Hub',
      'mycoach.description': 'Ihr vollständiges Trainer-Management-Zentrum.',
      'mycoach.myCoach': 'Mein Trainer',
      'mycoach.exploreHistory': 'Entdecken & Verlauf',
      'mycoach.noCoach': 'Sie haben keinen Trainer',
      'mycoach.findCoachFromTab': 'Finden Sie einen Trainer im Entdecken & Verlauf Tab.',
      'mycoach.goToExplore': 'Zu Entdecken & Verlauf gehen',
      
      // Progress
      'progress.tracking': 'Fortschrittsverfolgung',
      'progress.unlockDescription': 'Schalten Sie detaillierte Fortschrittsverfolgung und Analysen mit einem bezahlten Plan frei. Verfolgen Sie Ihre Fitness-Reise, überwachen Sie Trends und erhalten Sie personalisierte Einblicke.',
      'progress.yourProgress': 'Ihr Fortschritt',
      
      // Programs
      'programs.noActiveProgram': 'Kein aktives Programm gefunden.',
      'programs.noTasksToday': 'Keine Aufgaben heute!',
      
      // Settings
      'settings.coachSettings': 'Trainer-Einstellungen',
      'settings.description': 'Gestalten Sie Ihr professionelles Profil und verwalten Sie Kontoeinstellungen.',
      'settings.publicProfile': 'Öffentliches Profil',
      'settings.accountSecurity': 'Konto & Sicherheit',
      'settings.profileStrength': 'Profil-Stärke',
      'settings.weak': 'Schwach',
      'settings.fair': 'Mäßig',
      'settings.good': 'Gut',
      'settings.excellent': 'Ausgezeichnet',
      'settings.complete': 'Vollständig',
      'settings.completeProfileToStandOut': 'Vervollständigen Sie Ihr Profil, um sich abzuheben:',
      'settings.profileCompleteMessage': 'Perfekt! Ihr Profil ist vollständig und bereit, Kunden anzuziehen.',
      'settings.profilePhoto': 'Profilfoto',
      'settings.profilePhotoTip': 'Ein professionelles Foto schafft Vertrauen',
      'settings.completeBio': 'Vollständige Biografie (100+ Zeichen)',
      'settings.completeBioTip': 'Erzählen Sie Kunden, warum Sie der richtige Trainer sind',
      'settings.skills': 'Fähigkeiten (3+ ausgewählt)',
      'settings.skillsTip': 'Helfen Sie Kunden, Sie basierend auf Expertise zu finden',
      'settings.certifications': 'Zertifizierungen',
      'settings.certificationsTip': 'Zeigen Sie Ihre Qualifikationen, um Glaubwürdigkeit aufzubauen',
      'settings.socialLinks': 'Social Links',
      'settings.socialLinksTip': 'Lassen Sie Kunden Ihre Inhalte und Community sehen',
      'settings.priceRange': 'Preisbereich',
      'settings.priceRangeTip': 'Setzen Sie klare Erwartungen für potenzielle Kunden',
      
      // Language Switcher
      'language.english': 'English',
      'language.spanish': 'Español',
      'language.french': 'Français',
      'language.german': 'Deutsch',
      'language.select': 'Sprache auswählen',
      
      // Dashboard
      'dashboard.welcome': 'Willkommen zurück',
      'dashboard.overview': 'Übersicht',
      'dashboard.recentActivity': 'Letzte Aktivität',
      'dashboard.quickActions': 'Schnellaktionen',
      'dashboard.goodMorning': 'Guten {{timeOfDay}}, {{coachName}}',
      'dashboard.totalClients': 'Gesamtkunden',
      'dashboard.totalEarning': 'Gesamtverdienst',
      'dashboard.activePrograms': 'Aktive Programme',
      'dashboard.retentionRate': 'Kundenbindung',
      'dashboard.sinceLastMonth': 'Seit letztem Monat',
      'dashboard.allTimeNet': 'Gesamtnetto',
      'dashboard.activeClients': 'Aktive Kunden',
      'dashboard.subscribedCustomers': 'Abonnierte Kunden',
      'dashboard.loadingMotivation': 'Lade deine tägliche Motivation...',
      'dashboard.readyToMakeImpact': 'Bereit, heute einen Unterschied zu machen?',
      'dashboard.actionBoard': 'Aktionsboard',
      'dashboard.actionBoardDescription': 'Aufgaben, die deine sofortige Aufmerksamkeit erfordern.',
      'dashboard.noImmediateTasks': 'Keine dringenden Aufgaben.',
      'dashboard.clientStatuses': 'Kundenstatus',
      'dashboard.clientStatusesDescription': 'Eine Übersicht aller deiner Kunden und ihres aktuellen Status.',
      'dashboard.noClientsYet': 'Noch keine Kunden.',
      
      // Programs
      'programs.title': 'Programme',
      'programs.create': 'Programm erstellen',
      'programs.active': 'Aktive Programme',
      'programs.completed': 'Abgeschlossene Programme',
      'programs.duration': 'Dauer',
      'programs.startDate': 'Startdatum',
      'programs.endDate': 'Enddatum',
      'programs.status': 'Status',
      
      // Progress
      'progress.title': 'Fortschritt',
      'progress.today': 'Heute',
      'progress.thisWeek': 'Diese Woche',
      'progress.thisMonth': 'Diesen Monat',
      'progress.weight': 'Gewicht',
      'progress.measurements': 'Messungen',
      'progress.photos': 'Fotos',
      'progress.notes': 'Notizen',
      
      // Settings
      'settings.title': 'Einstellungen',
      'settings.profile': 'Profil',
      'settings.notifications': 'Benachrichtigungen',
      'settings.privacy': 'Datenschutz',
      'settings.account': 'Konto',
      
      // AI Coach
      'ai.title': 'KI-Trainer',
      'ai.generatePlan': 'Plan generieren',
      'ai.trends': 'Trendanalyse',
      'ai.recommendations': 'Empfehlungen',
      'ai.subscriptionRequired': 'KI-Trainer erfordert ein aktives Abonnement',
      
      // Payouts
      'payout.title': 'Auszahlungseinstellungen',
      'payout.balance': 'Verfügbares Guthaben',
      'payout.method': 'Auszahlungsmethode',
      'payout.bank': 'Banküberweisung',
      'payout.paypal': 'PayPal',
      'payout.stripe': 'Stripe',
      'payout.request': 'Auszahlung beantragen',
      
      // Profile Strength
      'profile.strength': 'Profilstärke',
      'profile.completed': 'Abgeschlossen',
      'profile.missing': 'Fehlend',
      'profile.recommendations': 'Empfehlungen',
      'profile.improve': 'Profil verbessern',
      'profile.title': 'Profil',
      'profile.description': 'Sehen Sie hier alle Ihre Profildetails.',
      'profile.premiumMember': 'Premium-Mitglied',
      'profile.freeMember': 'Kostenloses Mitglied',
      'profile.starting': 'Wird gestartet...',
      'profile.startTrial': '14-Tage-Test starten',
      'profile.manageBilling': 'Abrechnung verwalten',
      'profile.contactPersonalInfo': 'Kontakt & Persönliche Informationen',
      'profile.settingsLegal': 'Einstellungen & Rechtliches',
      'profile.paymentHistory': 'Zahlungshistorie',
      'profile.loadingPaymentHistory': 'Zahlungshistorie wird geladen...',
      'profile.date': 'Datum',
      'profile.amount': 'Betrag',
      'profile.status': 'Status',
      'profile.noPaymentHistory': 'Keine Zahlungshistorie verfügbar',
      
      // Contract Extension
      'contract.extension': 'Vertragsverlängerung',
      'contract.available': 'Verlängerung verfügbar',
      'contract.notAvailable': 'Verlängerung noch nicht verfügbar',
      'contract.weeksRemaining': 'Verbleibende Wochen',
      'contract.requestExtension': 'Verlängerung beantragen',
      
      // Program Countdown
      'countdown.title': 'Programm-Zeitplan',
      'countdown.progress': 'Fortschritt',
      'countdown.timeRemaining': 'Verbleibende Zeit',
      'countdown.startsIn': 'Beginnt in',
      'countdown.completed': 'Programm abgeschlossen!',
      'countdown.duration': 'Dauer',
      'countdown.startDate': 'Startdatum',
      'countdown.endDate': 'Enddatum',
      'countdown.status': 'Status',
      
      // Messages
      'messages.title': 'Nachrichten',
      'messages.motivational': 'Motivational',
      'messages.system': 'System',
      'messages.automated': 'Automatisiert',
      'messages.send': 'Nachricht senden',
      
      // Feature Verification
      'features.title': 'Funktionsverifikation',
      'features.completed': 'Abgeschlossene Funktionen',
      'features.total': 'Gesamtfunktionen',
      'features.completionRate': 'Abschlussrate',
      'features.testAll': 'Alle Funktionen testen',
      'features.testEndpoint': 'Endpunkt testen',
      'features.working': 'Endpunkt funktioniert',
      'features.failed': 'Endpunkt fehlgeschlagen',
      'features.notes': 'Implementierungsnotizen',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;

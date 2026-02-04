import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios';

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/verify',
        name: 'VerifyToken',
        component: () => import('../views/VerifyTokenView.vue')
    },
    {
        path: '/setup-2fa',
        name: 'Setup2FA',
        component: () => import('../views/Setup2FAView.vue')
    },
    {
        path: '/verify-2fa',
        name: 'Verify2FA',
        component: () => import('../views/Verify2FAView.vue')
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { requiresAuth: true } // Mark this as protected
    },
     {
        path: '/events',
        name: 'Events',
        component: () => import('../views/EventsView.vue'),
        meta: { requiresAuth: true } // Mark this as protected
    },
    {
        path: '/rules',
        name: 'Rules',
        component: () => import('../views/RulesView.vue'),
        meta: { requiresAuth: true } // Mark this as protected
    },
    {
        path: '/rules/create',
        name: 'CreateRule',
        component: () => import('../views/CreateRuleView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/lists',
        name: 'Lists',
        component: () => import('../views/ListsView.vue'),
        meta: { requiresAuth: true } // Mark this as protected
    },
    {
        path: '/rules/edit/:id',
        name: 'EditRule',
        component: () => import('../views/EditRuleView.vue'),
        props: true // Allows the ID to be passed as a prop if needed
    },
    {
        path: '/customers',
        name: 'Customers',
        component: () => import('../views/CustomersView.vue'),
        props: true // Allows the ID to be passed as a prop if needed
    },
    {
        path: '/customers/:id',
        name: 'CustomerDetail',
        component: () => import('../views/CustomerDetailView.vue'),
        // This ensures the ID from the URL is passed to the component
        props: true
    },
    {
        path: '/global-alerts',
        name: 'GlobalAlerts',
        component: () => import('../views/GlobalAlertsView.vue'),
        props: true
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/SettingsView.vue'),
        props: true
    },
    {
        path: '/audit-logs',
        name: 'AuditLogs',
        component: () => import('../views/AuditLogsView.vue'),
        props: true
    },
    {
        path: '/sanction-screening',
        name: 'SanctionScreening',
        component: () => import('../views/SanctionScreeningView.vue'),
        props: true
    },
    {
        path: '/cases',
        name: 'Cases',
        component: () => import('../views/CasesView.vue'),
        props: true
    },
    {
        path: '/pep-screening',
        name: 'PEPScreening',
        component: () => import('../views/PepScreeningView.vue'),
        props: true
    },
    // 404 Catch-all: This must be the LAST item in the array
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFoundView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        try {
            // Create a small 'check-auth' route on your backend 
            // that returns 200 if req.session.userId exists
            const res = await axios.post('/auth/check-auth');

            if (res.data.statusCode === 200) {
                next();
            } else {
                next('/');
            }
        } catch (err) {
            next('/');
        }
    } else {
        next();
    }
});

export default router
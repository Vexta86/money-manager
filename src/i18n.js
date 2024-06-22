// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    'Money Manager': 'Money Manager',
                    'Welcome': 'Welcome',

                    'Welcome back': 'Welcome back',
                    'Log in': 'Log in',
                    // Add more translations here
                },
            },
            es: {
                translation: {

                    'Money Manager': 'Administrador de Dinero',
                    'Welcome back': 'Bienvenido de vuelta',
                    'Log in': 'Iniciar sesión',
                    'Email': 'Correo Electrónico',
                    'Password': 'Contraseña',
                    "Don't have an account?": '¿No tienes una cuenta?',
                    "Sign up": 'Registrate',


                    'Welcome': 'Bienvenido',
                    "Successful signed up": 'Registrado exitosamente',

                    'Home': 'Inicio',
                    'Income': 'Ingresos',
                    'Expenses': 'Gastos',
                    'Planner': 'Planeador',



                    'Hello': 'Hola',
                    'Log out': 'Cerrar sesión',

                    'Income in': 'Ingresos en',
                    'New Income': 'Ingreso Nuevo',

                    'Expenses in': 'Gastos en',
                    'New Expense': 'Gasto Nuevo',

                    'Day': 'Día',
                    'Name': 'Nombre',
                    'Price': 'Precio',
                    'Uncategorized': 'Sin categoría',
                    'Category': 'Categoría',
                    'Month': 'Mes',
                    'Year': 'Año',
                    'All categories': 'Todas',

                    'Editing': 'Editando',
                    'Date': 'Fecha',
                    'Today': 'Hoy',
                    'Delete': 'Eliminar',
                    'Save': 'Guardar',
                    'Cancel': 'Cancelar',


                    'Changes saved successfully': 'Cambios guardados exitosamente',
                    'Are you sure you want to delete this item?': '¿Seguro que deseas eliminarlo?',

                    'Frequency': 'Frecuencia',

                    'Week': 'Semana',
                    'Weeks': 'Semanas',

                    'week': 'semana',
                    'weeks': 'semanas',

                    'Months': 'Meses',
                    'Years': 'Años',
                    'Days': 'Días',

                    'months': 'meses',
                    'years': 'años',
                    'days': 'días',

                    'day': 'día',
                    'year': 'año',
                    'month': 'mes',

                    'New Frequent Expense': 'Gasto Frecuente Nuevo',
                    'Frequent Expenses': 'Gastos Frecuentes',
                    'Monthly Price': 'Precio Mensual',

                    'Monthly Budget': 'Presupuesto Mensual',

                    'monthly': 'mensualmente',
                    'every': 'cada',



                    'This Month': 'Este Mes',
                    'Last Month': 'Mes Pasado',
                    'Previous Months': 'Meses Anteriores',

                    'Tools': 'Utilidades',

                    'Financial Tools': 'Herramientas Financieras',

                    'Profit': 'Ganancias',
                    'Average': 'Promedio',
                    'Total Income': 'Ingresos Totales',
                    'Total Expenses': 'Gastos Totales',
                    'Total Profit': 'Ganancias Totales',

                    'Average Income': 'Ingreso Promedio',
                    'Average Expenses': 'Gastos Promedio',
                    'Average Profit': 'Ganancias Promedio'


                    // Add more translations here
                },
            },
            // Add more languages here
        },
        lng: 'es',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

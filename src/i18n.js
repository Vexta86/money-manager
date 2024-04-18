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
                    'Category': 'Categoria',
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

                    'Months': 'Meses',
                    'Years': 'Años',
                    'Days': 'Días',

                    'New Frequent Expense': 'Gasto Frecuente Nuevo',
                    'Frequent Expenses': 'Gastos Frecuentes',
                    'Monthly Budget': 'Presupuesto Mensual'



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

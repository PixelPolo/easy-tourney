/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // Utilise la classe 'dark' pour activer le mode sombre
  theme: {
    extend: {
      fontFamily: {
        sans: ['Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        // Palette de couleurs pour le mode clair
        light: {
          background: '#f3f4f6', // bg-gray-100
          card: '#ffffff',
          menu: '#1f2937', // bg-gray-800
          errorMessage: '#ff7200',
          menuText: '#ffffff',
          menuActive: '#22C55E', // green-500
          menuHoverText: '#38a169', // green-400
          profileText: '#38a169', // green-400
          profileHoverText: '#2f855a', // green-700
          logoutButton: {
            default: '#ef4444', // red-500
            hover: '#dc2626', // red-700
          },
          token: {
            valid: '#d1fae5', // Vert clair
            expiring: '#fde68a', // Orange clair
            invalid: '#fee2e2', // Rouge clair
          },
          warning: {
            bg: '#fef3c7', // bg-yellow-100
            border: '#fde68a', // border-yellow-200
            text: '#b45309', // text-yellow-700
            closeText: '#854d0e', // text-yellow-800
          },
          details: {
            completed: '#22c55e', // green-500
            inProgress: '#f59e0b', // yellow-500
            notStarted: '#9ca3af', // gray-400
            active: '#3b82f6', // blue-500
            text: '#1f2937', // gray-800
            background: '#ffffff', // white
            border: '#e5e7eb', // gray-200
          },
          pool: {
            infoBg: '#dbeafe', // blue-100
            infoBorder: '#bfdbfe', // blue-200
            infoText: '#1e40af', // blue-800
            text: '#6b7280', // gray-500
            infoError: '#dc2626', // red-600
            infoWarning: '#ea580c', // orange-600
          },
          poolDetails: {
            card: '#f9fafb',
            text: '#1f2937',
            border: '#e5e7eb',
            hover: '#f3f4f6',
            selected: '#d1fae5',
            selectedErase: '#fee2e2',
          },
          subMenu: {
            background: '#ffffff',
            border: '#e2e8f0',
            text: '#4a5568',
            hoverBackground: '#e2e8f0',
            hoverText: '#2f855a',
            activeText: '#2f855a',
            activeBar: '#38a169',
          },
          buttonVariants: {
            primary: {
              default: '#16a34a', // green-600
              hover: '#15803d', // green-700
            },
            secondary: {
              default: '#6b7280', // gray-500
              hover: '#4b5563', // gray-600
            },
            danger: {
              default: '#ef4444', // red-500
              hover: '#dc2626', // red-600
            },
            warning: {
              default: '#eab308', // yellow-500
              hover: '#ca8a04', // yellow-600
            },
            info: {
              default: '#3b82f6', // blue-500
              hover: '#2563eb', // blue-600
            },
            algo: {
              default: '#9333ea', // purple-600
              hover: '#7e22ce', // purple-700
            },
            disabled: {
              default: '#9ca3af', // gray-400
            },
          },
          form: {
            background: '#ffffff',
            text: '#4a5568', // text-gray-700
            error: '#ef4444', // text-red-500
            iconQuestion: '#9ca3af', // text-gray-400
            tooltip: {
              background: '#374151', // bg-gray-700
              text: '#ffffff',
            },
            border: {
              default: '#d1d5db', // border-gray-300
              error: '#ef4444', // border-red-500
            },
          },
          modal: {
            background: 'rgba(0, 0, 0, 0.5)', // bg-opacity-50
            content: '#ffffff',
          },
          title: '#1f2937', // text-gray-800
        },

        // Palette de couleurs pour le mode sombre
        dark: {
          background: '#111827', // bg-custom_dark_1
          card: '#1f2937', // gray-800
          menu: '#1f2937', // bg-gray-800
          menuText: '#ffffff',
          errorMessage: '#ff7200',
          menuActive: '#22C55E', // green-500
          menuHoverText: '#38a169', // green-400
          profileText: '#38a169', // green-400
          textInCard: '#ff7200', // orange
          profileHoverText: '#2f855a', // green-700
          logoutButton: {
            default: '#dc2626', // red-600 (adoucissement de la couleur rouge)
            hover: '#b91c1c', // red-700 (rouge plus sombre)
          },
          token: {
            valid: '#047857', // Vert plus soutenu
            expiring: '#ca8a04', // Orange plus foncé
            invalid: '#991b1b', // Rouge plus vif
          },
          warning: {
            bg: '#44403c', // bg-gray-700
            border: '#a16207', // border-yellow-600
            text: '#fcd34d', // text-yellow-300
            closeText: '#facc15', // text-yellow-400
          },
          details: {
            completed: '#22c55e', // green-500
            inProgress: '#f59e0b', // yellow-500
            active: '#2563eb', // blue-600
            notStarted: '#6b7280', // gray-500
            text: '#f3f4f6', // gray-100
            background: '#1f2937', // gray-800
            border: '#374151', // gray-700
          },
          pool: {
            infoBg: '#1f2937', // gray-800
            infoBorder: '#64748b', // gray-950
            infoText: '#cbd5e1', // slate-300
            text: '#cbd5e1', // gray-500
            infoError: '#f87171', // red-400
            infoWarning: '#fbbf24', // yellow-500
          },
          poolDetails: {
            card: '#374151',
            text: '#f3f4f6',
            border: '#4b5563',
            hover: '#374151',
            selected: '#2f855a',
            selectedErase: '#450a0a',
          },
          subMenu: {
            background: '#2d3748',
            border: '#374151', // gris sombre
            text: '#cbd5e1', // text-gray-300
            hoverBackground: '#374151',
            hoverText: '#38a169',
            activeText: '#38a169',
            activeBar: '#16a34a',
          },
          buttonVariants: {
            primary: {
              default: '#15803d', // green-700 (plus sombre que le green-600)
              hover: '#166534', // green-800 (vert plus sombre pour hover)
            },
            secondary: {
              default: '#4b5563', // gray-600
              hover: '#374151', // gray-700
            },
            danger: {
              default: '#b91c1c', // red-700 (adoucissement du rouge)
              hover: '#991b1b', // red-800 (rouge plus sombre pour hover)
            },
            warning: {
              default: '#ca8a04', // yellow-600 (jaune plus ocre)
              hover: '#a16207', // yellow-700
            },
            info: {
              default: '#2563eb', // blue-600
              hover: '#1d4ed8', // blue-700
            },
            algo: {
              default: '#7e22ce', // purple-700
              hover: '#6b21a8', // purple-800
            },
            disabled: {
              default: '#6b7280', // gray-500
            },
          },
          form: {
            background: '#1f2937',
            text: '#cbd5e1', // text-gray-300
            error: '#ef4444', // text-red-500
            iconQuestion: '#9ca3af', // text-gray-400
            tooltip: {
              background: '#4b5563', // bg-gray-600
              text: '#ffffff',
            },
            border: {
              default: '#374151', // border-gray-600
              error: '#ef4444', // border-red-500
            },
          },
          modal: {
            background: 'rgba(0, 0, 0, 0.7)', // bg-opacity-70
            content: '#1f2937',
          },
          title: '#f3f4f6', // text-gray-100
        },
      },
    },
  },
  plugins: [],
};

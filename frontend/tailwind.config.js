/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
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
              hover: '#15803d',   // green-700
            },
            secondary: {
              default: '#6b7280', // gray-500
              hover: '#4b5563',   // gray-600
            },
            danger: {
              default: '#ef4444', // red-500
              hover: '#dc2626',   // red-600
            },
            warning: {
              default: '#eab308', // yellow-500
              hover: '#ca8a04',   // yellow-600
            },
            info: {
              default: '#3b82f6', // blue-500
              hover: '#2563eb',   // blue-600
            },
            algo: {
              default: '#9333ea', // purple-600
              hover: '#7e22ce',   // purple-700
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
              error: '#ef4444',    // border-red-500
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
          card: '#1f2937', // bg-custom_dark_1
          menu: '#1f2937', // bg-gray-800
          menuText: '#ffffff',
          errorMessage: '#ff7200',
          menuActive: '#22C55E', // green-500
          menuHoverText: '#38a169', // green-400
          profileText: '#38a169', // green-400
          textInCard: '#ff7200', // gray-500
          profileHoverText: '#2f855a', // green-700
          logoutButton: {
            default: '#dc2626', // red-600 (adoucissement de la couleur rouge)
            hover: '#b91c1c',   // red-700 (rouge plus sombre)
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
              hover: '#166534',   // green-800 (vert plus sombre pour hover)
            },
            secondary: {
              default: '#4b5563', // gray-600
              hover: '#374151',   // gray-700
            },
            danger: {
              default: '#b91c1c', // red-700 (adoucissement du rouge)
              hover: '#991b1b',   // red-800 (rouge plus sombre pour hover)
            },
            warning: {
              default: '#ca8a04', // yellow-600 (jaune plus ocre)
              hover: '#a16207',   // yellow-700
            },
            info: {
              default: '#2563eb', // blue-600
              hover: '#1d4ed8'   // blue-700
            },
            algo: {
              default: '#7e22ce', // purple-700
              hover: '#6b21a8',   // purple-800
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
              error: '#ef4444',    // border-red-500
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

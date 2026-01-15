/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1890ff',
        secondary: '#52c41a',
        warning: '#faad14',
        danger: '#f5222d',
        info: '#13c2c2',
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '32px'],
      },
      screens: {
        'sm': '320px',
        'md': '375px',
        'lg': '414px',
        'xl': '750px',
      },
    },
  },
  plugins: [],
}

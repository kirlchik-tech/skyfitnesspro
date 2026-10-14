import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  const baseStyle = 'rounded-[46px] py-4 px-6 text-[18px] transition-colors font-normal flex justify-center items-center border-none outline-none';
  
  // Салатовая кнопка ("Войти", "Сохранить")
 const primaryStyle = 'bg-[#C6FF00] text-black hover:bg-[#DAFF66] active:bg-black active:text-white disabled:bg-[#F4F5F6] disabled:text-[#D9D9D9]';
  
  // Прозрачная кнопка с рамкой ("Зарегистрироваться")
  const secondaryStyle = 'bg-transparent border border-solid border-black text-black hover:bg-[#F4F5F6] active:bg-[#E9ECED] disabled:border-[#D9D9D9] disabled:text-[#D9D9D9]';

  const styles = variant === 'primary' ? primaryStyle : secondaryStyle;

  return (
    <button className={`${baseStyle} ${styles} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};
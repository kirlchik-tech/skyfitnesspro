import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  const baseStyle = 'rounded-[46px] py-4 px-6 text-[18px] transition-colors font-normal flex justify-center items-center border-none outline-none';
  
  // Салатовая кнопка ("Войти", "Сохранить")
 const primaryStyle = 'bg-[#BCEC30] text-black hover:bg-[#C6FF00] active:bg-black active:text-white disabled:bg-[#F7F7F7] disabled:text-[#999999]';
  
  // Прозрачная кнопка с рамкой ("Зарегистрироваться")
  const secondaryStyle = 'bg-white border border-solid border-black text-black hover:bg-[#F7F7F7] active:bg-[#E9ECED] disabled:border-[#999999] disabled:text-[#999999]';

  const styles = variant === 'primary' ? primaryStyle : secondaryStyle;

  return (
    <button className={`${baseStyle} ${styles} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};
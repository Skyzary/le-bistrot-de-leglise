import React from 'react';
import Link from 'next/link';
import styles from './Button.module.scss';

type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'icon';
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
};

export type ButtonAsButtonProps = ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

export type ButtonAsLinkProps = ButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export const Button = ({ variant = 'primary', fullWidth = false, children, className, href, ...props }: ButtonProps) => {
  const classes = [styles.button, styles[`button--${variant}`], fullWidth ? styles['button--full'] : '', className].filter(Boolean).join(' ');
  
  if (href) {
    return (
      <Link href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
};

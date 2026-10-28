'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Button.module.scss';
import { smoothScrollTo } from '@/components/atoms/SmoothScroll';

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

export const Button = (props: ButtonProps) => {
  const { variant = 'primary', fullWidth = false, children, className } = props;
  const classes = [styles.button, styles[`button--${variant}`], fullWidth ? styles['button--full'] : '', className].filter(Boolean).join(' ');

  if ('href' in props && props.href) {
    const { href, onClick, ...restLinkProps } = props;

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(e);
      }

      if (href.startsWith('#') || href.startsWith('/#')) {
        const id = href.replace(/^\/?#/, '');
        if (id) {
          const targetEl = document.getElementById(id);
          if (targetEl) {
            e.preventDefault();
            smoothScrollTo(targetEl, -70);
            if (window.location.hash !== '#' + id) {
              window.history.pushState(null, '', '#' + id);
            }
          }
        }
      }
    };

    return (
      <Link href={href} onClick={handleLinkClick} className={classes} {...restLinkProps}>
        {children}
      </Link>
    );
  }

  const { href: _h, ...buttonProps } = props as ButtonAsButtonProps;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
};

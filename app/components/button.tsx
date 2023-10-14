import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import sv, { VariantProps } from 'style-variants';
import { MontserratMedium } from './text';

type ButtonVariantsProps = VariantProps<typeof button>;

type ButtonProps = ButtonVariantsProps &
  TouchableOpacityProps & {
    children: string[];
  };

const button = sv({
  base: {
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  variants: {
    size: {
      medium: {
        paddingVertical: 14,
        paddingHorizontal: 32,
      },
    },
    variant: {
      primary: {
        backgroundColor: '#000',
      },
      secondary: {
        backgroundColor: '#fff',
      },
    },
    disabled: {
      true: {
        opacity: 0.6,
      },
    },
  },
  defaultVariants: {
    size: 'medium',
    variant: 'primary',
    disabled: false,
  },
});

const text = sv({
  base: {
    color: 'white',
    fontWeight: '500',
    letterSpacing: -0.17,
    fontSize: 16,
  },
  variants: {
    variant: {
      primary: {
        color: '#fff',
      },
      secondary: {
        color: '#000',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export default function Button({
  style,
  children,
  disabled,
  size,
  variant,
  ...props
}: ButtonProps) {
  const buttonStyles = button({
    disabled,
    size,
    variant,
    style,
  });

  const textStyles = text({
    variant,
  });

  return (
    <TouchableOpacity
      style={buttonStyles}
      activeOpacity={0.8}
      disabled={disabled}
      {...props}>
      <MontserratMedium style={textStyles}>{children}</MontserratMedium>
    </TouchableOpacity>
  );
}

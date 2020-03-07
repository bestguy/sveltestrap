/**
 * Button
 */
export declare type ButtonColor = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
export declare type ButtonSize = "lg" | "sm";
export interface IButtonProps {
    color?: ButtonColor;
    size?: ButtonSize;
    outline?: boolean;
    disabled?: boolean;
    active?: boolean;
}
export declare function Button(props: IButtonProps): void;
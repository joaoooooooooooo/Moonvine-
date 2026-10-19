import { Toast } from '@base-ui/react/toast';

// Keep manager identity independent of edits to the toast presentation.
export const toastManager = Toast.createToastManager();
export const anchoredToastManager = Toast.createToastManager();

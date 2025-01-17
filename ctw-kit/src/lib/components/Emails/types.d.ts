export interface EmailFormData {
  name: string;
  email: string;
}

export interface SendEmailProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

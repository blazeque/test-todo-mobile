import { LoadingSpinner } from './ui/LoadingSpinner';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = 'Carregando...' }: LoadingViewProps) {
  return <LoadingSpinner message={message} />;
}

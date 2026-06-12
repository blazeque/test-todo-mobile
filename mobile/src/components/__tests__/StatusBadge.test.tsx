import { render, screen } from '@testing-library/react-native';
import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('renderiza label do status Pendente', () => {
    render(<StatusBadge status="PENDING" />);
    expect(screen.getByText('Pendente')).toBeTruthy();
  });

  it('renderiza label do status Em Progresso', () => {
    render(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText('Em Progresso')).toBeTruthy();
  });

  it('renderiza label do status Concluída', () => {
    render(<StatusBadge status="COMPLETED" />);
    expect(screen.getByText('Concluída')).toBeTruthy();
  });
});

import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/Form';
import AuthLayout from '../../layouts/login_layout/AuthLayout';

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <AuthLayout title="ACESSO NEGADO">
            <div style={{ textAlign: 'center' }}>
                <p style={{
                    fontSize: '16px',
                    color: '#4b5563',
                    marginBottom: '35px',
                    lineHeight: '1.6'
                }}>
                    Você não tem permissão para acessar esta página. <br />Por favor, faça login para continuar.
                </p>

                <Button text='Ir para Login' onClick={() => navigate('/login')} width="100%" />
            </div>
        </AuthLayout>
    );
}

import type BaseInputProps from './BaseInputProps';

export default interface DocumentInputProps extends BaseInputProps {
    documentType?: 'cpf' | 'cnpj';
}

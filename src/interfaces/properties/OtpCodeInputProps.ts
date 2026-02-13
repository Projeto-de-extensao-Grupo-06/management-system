export default interface OtpCodeInputProps {
    valueState: {
        value: string;
        setValue: React.Dispatch<React.SetStateAction<string>>
    };
    disabled: boolean;
}
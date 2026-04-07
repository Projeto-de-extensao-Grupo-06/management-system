import { useEffect, useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import { Alert } from "../../../components/ui/Alert";
import { Button, Input, PhoneInput } from "../../../components/ui/Form";
import "./configPerfil.css";

interface ProfileForm {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
}

export default function ConfigPerfil() {
	const [profile, setProfile] = useState<ProfileForm>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
	});
	const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);

	useEffect(() => {
		document.title = "Meu Perfil | SolarWay";
	}, []);

	const handleChange = (field: keyof ProfileForm, value: string) => {
		setProfile((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		setAlert({ message: "Dados do perfil salvos com sucesso!", type: "success" });
		setTimeout(() => setAlert(null), 4000);
	};

	return (
		<PageLayout
			title="Meu Perfil"
			backButton={true}
			rightActions={
				<Button
					text="Salvar alterações"
					onClick={handleSave}
					width="fit-content"
					ariaLabel="Salvar alterações do perfil"
				/>
			}
		>
			<div className="profile-container">
				{alert && <Alert message={alert.message} type={alert.type} />}

				<div className="profile-card">
					<h2 className="section-title">Dados Cadastrais</h2>

					<div className="form-grid">
						<div className="field-group">
							<label htmlFor="firstName" className="field-label">
								Nome
							</label>
							<Input
								id="firstName"
								name="firstName"
								value={profile.firstName}
								onChange={(e) => handleChange("firstName", e.target.value)}
								placeholder="Digite seu nome"
							/>
						</div>

						<div className="field-group">
							<label htmlFor="lastName" className="field-label">
								Sobrenome
							</label>
							<Input
								id="lastName"
								name="lastName"
								value={profile.lastName}
								onChange={(e) => handleChange("lastName", e.target.value)}
								placeholder="Digite seu sobrenome"
							/>
						</div>

						<div className="field-group">
							<label htmlFor="email" className="field-label">
								E-mail
							</label>
							<Input
								id="email"
								name="email"
								type="email"
								value={profile.email}
								onChange={(e) => handleChange("email", e.target.value)}
								placeholder="exemplo@solarway.com"
							/>
						</div>

						<div className="field-group">
							<label htmlFor="phone" className="field-label">
								Telefone
							</label>
							<PhoneInput
								id="phone"
								name="phone"
								value={profile.phone}
								onChange={(e) => handleChange("phone", e.target.value)}
								placeholder="(xx) xxxxx-xxxx"
							/>
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
}

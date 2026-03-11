import { useState } from "react";
import "./proposal.css";
import logo from "../../assets/logo-SolarWay.png";
import type { Budget } from "../../interfaces/types/Budget";
import { forwardRef } from "react";

interface ProposalPageProps {
  budget: Budget;
  projectId: number;
  consultantName: string;
  consultantEmail: string;
  clientName: string;
  clientDoc: string;
  clientPhone: string;
  installCity: string;
  installAddress: string;
  installEmail: string;
}

export default forwardRef<HTMLDivElement, ProposalPageProps>(({ budget, projectId, consultantName, consultantEmail, clientName, clientDoc, clientPhone, installCity, installAddress, installEmail }, ref) => {
  const DATE = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const VALID_UNTIL_DATE = new Date();
  VALID_UNTIL_DATE.setDate(VALID_UNTIL_DATE.getDate() + 15);
  const validUntil = VALID_UNTIL_DATE.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const EMAIL_SOLARWAY = "contato@solarway.com.br";

  const COMPANY_LEGAL = "0.296.743 SALVIO CARDOSO";
  const CNPJ = "60.296.743/0001-82";

  const fixedParametersTotal = budget.fixedParameters.reduce((total, p) => total + (p.value || 0), 0);
  const personalizedParametersTotal = budget.personalizedParameters.reduce((total, p) => total + (p.value || 0), 0);
  const engineeringCost = fixedParametersTotal + personalizedParametersTotal;

  return (
    <div className="page" ref={ref}>
      <div className="header">
        <div className="header-left">
          <div className="logo-area">
            <div className="logo-box">
              <img src={logo} alt="Logo SolarWay" className="logo" />
            </div>
            <div className="brand-text">
              <div className="brand-name">Solar<span>Way</span></div>
              <div className="brand-razao">{COMPANY_LEGAL}</div>
            </div>
          </div>
          <div>
            <div className="doc-title">Proposta Técnica e <em>Comercial</em></div>
          </div>
        </div>
        <div className="header-right">
          <div className="proposta-num">#{projectId}</div>
          <div className="meta-block">
            <div className="meta-row">
              <div className="meta-item">
                <div className="meta-label">Data de Emissão</div>
                <div className="meta-value">{DATE}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Válido até</div>
                <div className="meta-value">{validUntil}</div>
              </div>
            </div>
            <div className="meta-row">
              <div className="meta-item">
                <div className="meta-label">CNPJ SolarWay</div>
                <div className="meta-value">{CNPJ}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stripe"></div>

      <div className="empresa-bar">
        <div className="empresa-left">
          <div className="empresa-dot"></div>
          <div className="empresa-info"><strong>SolarWay</strong> — {COMPANY_LEGAL}</div>
        </div>
        <div className="empresa-right">
          <div className="einfo">
            <div className="einfo-label">Consultor</div>
            <div className="einfo-value">{consultantName}</div>
          </div>
          <div className="einfo">
            <div className="einfo-label">E-mail</div>
            <div className="einfo-value">{consultantEmail}</div>
          </div>
        </div>
      </div>

      <div className="cliente-section">
        <div className="cliente-section-header">
          <div className="dot"></div>
          <div className="cliente-section-label">Dados do Cliente</div>
        </div>
        <div className="cliente-grid">
          <div className="cliente-cell">
            <div className="clabel">Nome Completo</div>
            <div className="cvalue">{clientName}</div>
          </div>
          <div className="cliente-cell">
            <div className="clabel">CPF / CNPJ</div>
            <div className="cvalue">{clientDoc}</div>
          </div>
          <div className="cliente-cell">
            <div className="clabel">Telefone / WhatsApp</div>
            <div className="cvalue">{clientPhone}</div>
          </div>
          <div className="cliente-cell">
            <div className="clabel">Cidade / UF</div>
            <div className="cvalue sm">{installCity}</div>
          </div>
        </div>
        <div className="cliente-row2">
          <div className="cliente-cell">
            <div className="clabel">Endereço de Instalação</div>
            <div className="cvalue sm">{installAddress}</div>
          </div>
          <div className="cliente-cell">
            <div className="clabel">E-mail</div>
            <div className="cvalue sm">{installEmail}</div>
          </div>
        </div>
      </div>

      <div className="body">

        <div className="section">
          <div className="section-header">
            <div className="section-num">1</div>
            <div>
              <div className="section-title">Composição do Sistema — Equipamentos</div>
              <div className="section-subtitle">Hardware de alta performance selecionado para máximo rendimento e durabilidade</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Descrição Técnica</th>
                <th style={{ width: "12%" }}>Qtd.</th>
                <th style={{ width: "22%" }}>Valor Unit.</th>
                <th style={{ width: "22%" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {
                budget.materials.map((m, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="td-main">{m.name}</div>
                      </td>
                      <td><span className="qty-pill">{m.quantity}</span></td>
                      <td style={{ fontWeight: 600, color: "var(--cinza-escuro)" }}>R$ {m.unitPrice.toLocaleString("pt-BR", { currency: "BRL", minimumFractionDigits: 2 })}</td>
                      <td>R$ {(m.quantity * m.unitPrice).toLocaleString("pt-BR", { currency: "BRL", minimumFractionDigits: 2 })}</td>
                    </tr>
                  )
                })
              }
              <tr>
                <td>
                  <div className="td-main" style={{ color: "#DD7428" }}>Total em Equipamentos</div>
                </td>
                <td><span></span></td>
                <td></td>
                <td>R$ {budget.materials.reduce((total, m) => total + (m.quantity * m.unitPrice), 0).toLocaleString("pt-BR", { currency: "BRL", minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="section">
          <div className="section-header">
            <div className="section-num">2</div>
            <div>
              <div className="section-title">Serviços e Engenharia</div>
              <div className="section-subtitle">Execução completa por equipe especializada</div>
            </div>
          </div>
          <div className="svc-wrapper">
            <div className="svc-header-row">
              <span className="svc-col-label" style={{ flex: 1.2 }}>Serviço</span>
              <span className="svc-col-label" style={{ flex: 2 }}>Escopo</span>
              <span className="svc-col-label" style={{ flex: 0.8, textAlign: "right" }}>Valor</span>
            </div>
            <div className="svc-row">
              <div className="svc-col" style={{ flex: 1.2 }}>Instalação e Logística</div>
              <div className="svc-col" style={{ flex: 2 }}>Mão de obra especializada, montagem de estruturas em altura, frete, infraestrutura elétrica e equipamentos de segurança.</div>
              <div className="svc-col" style={{ flex: 0.8, textAlign: "right" }}>R$ {engineeringCost.toLocaleString("pt-BR", { currency: "BRL", minimumFractionDigits: 2 })}</div>
            </div>
            <div className="svc-row">
              <div className="svc-col" style={{ flex: 1.2 }}>Projeto e Homologação</div>
              <div className="svc-col" style={{ flex: 2 }}>Elaboração do projeto elétrico, emissão de ART junto ao CREA e trâmites completos com a concessionária local.</div>
              <div className="svc-col" style={{ flex: 0.8, textAlign: "right", color: "var(--verde)", fontSize: "12px", fontWeight: 600 }}>Incluso</div>
            </div>
            <div className="svc-row">
              <div className="svc-col" style={{ flex: 1.2 }}>Comissionamento</div>
              <div className="svc-col" style={{ flex: 2 }}>Testes de desempenho, configuração de monitoramento remoto e treinamento de uso ao cliente.</div>
              <div className="svc-col" style={{ flex: 0.8, textAlign: "right", color: "var(--verde)", fontSize: "12px", fontWeight: 600 }}>Incluso</div>
            </div>
          </div>
        </div>

        <div className="summary">
          <div>
            <div className="summary-label">Investimento Total do Projeto</div>
            <div className="summary-total"><span>R$</span> {budget.subtotal.toLocaleString("pt-BR", { currency: "BRL", minimumFractionDigits: 2 })}</div>
            <div className="summary-note">Impostos inclusos · Sem taxa de vistoria</div>
          </div>

          {
            budget.discount > 0 && (
              <div>
                <div className="summary-label">Investimento Total Com Desconto</div>
                <div className="summary-total-discount"><span>R$</span> {budget.totalCost.toLocaleString("pt-BR", { currency: "BRL", minimumFractionDigits: 2 })}</div>
                <div className="summary-note-discount">Desconto aplicado: {((budget.subtotal - budget.totalCost) / budget.subtotal * 100).toFixed(2)}%</div>
              </div>
            )
          }
        </div>

        {/* <div className="section">
          <div className="section-header">
            <div className="section-num">3</div>
            <div>
              <div className="section-title">Condições de Pagamento</div>
              <div className="section-subtitle">Escolha a modalidade mais adequada ao seu perfil</div>
            </div>
          </div>
          <div className="payment-grid">
            <div className="payment-card">
              <div className="payment-icon">💳</div>
              <div>
                <div className="payment-title">Pagamento à Vista</div>
                <div className="payment-desc">5% de desconto via <span className="payment-highlight">PIX ou Transferência</span>. Valor final: R$ 60.420,48.</div>
              </div>
            </div>
            <div className="payment-card">
              <div className="payment-icon">📅</div>
              <div>
                <div className="payment-title">Financiamento Solar</div>
                <div className="payment-desc">Parcele em até <span className="payment-highlight">60x</span> com taxas competitivas. Sujeito à análise de crédito.</div>
              </div>
            </div>
          </div>
        </div> */}

      </div>

      <div className="footer-stripe"></div>
      <div className="footer">
        <div className="footer-brand">Solar<span>Way</span> — {COMPANY_LEGAL}</div>
        <div className="footer-info">
          <strong>Proposta válida até {validUntil}</strong>
          CNPJ {CNPJ} · SP · {EMAIL_SOLARWAY}
        </div>
      </div>

    </div>
  );
});
import styles from "./ProjectStatus.module.css";

export default function ProjectStatusGraph() {
  const data = [
    { label: "Em andamento", value: 5, color: "#0044B8" },
    { label: "Agendado", value: 3, color: "#1C6321" },
    { label: "Finalizado", value: 3, color: "#9CA3AF" },
  ];

  const max = Math.max(...data.map((item) => item.value));

  return (
    <div className={styles.project_status}>
      <h3 className={styles.project_status_title}>Projetos por Status</h3>

      {data.map((item) => (
        <div key={item.label} className="project-status-row">
          <div className={styles.project_status_row_header}>
            <span className={styles.project_status_label}>{item.label}</span>
            <span className={styles.project_status_value}>{item.value}</span>
          </div>

          <div className={styles.project_status_bar_bg}>
            <div
              className={styles.project_status_bar_fill}
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

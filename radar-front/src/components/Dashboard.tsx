import { useContext, useState, type CSSProperties } from "react";
import { SensorContext } from "../context/SensorContext";

type Idioma = "ES" | "EN";

export const Dashboard = () => {
	const { sensorData, isConnected } = useContext(SensorContext);
	const [idioma, setIdioma] = useState<Idioma>("ES");

	const traducciones = {
		ES: {
			titulo: "RADAR ULTRASÓNICO",
			estado: "ESTADO DEL SISTEMA",
			boton: "Switch to English",
			seguro: "SEGURO",
			precaucion: "PRECAUCIÓN",
			peligro: "PELIGRO",
			izq: "IZQUIERDA",
			cen: "CENTRO",
			der: "DERECHA",
			telemetria: "Telemetría de Red",
			estadoRed: "Estado",
			conectado: "Conectado",
			desconectado: "Desconectado",
			ipEnlace: "IP Enlace",
			refresco: "Refresco",
			preferencias: "Preferencias",
		},
		EN: {
			titulo: "ULTRASONIC RADAR",
			estado: "SYSTEM STATUS",
			boton: "Cambiar a Español",
			seguro: "SAFE",
			precaucion: "CAUTION",
			peligro: "DANGER",
			izq: "LEFT",
			cen: "CENTER",
			der: "RIGHT",
			telemetria: "Network Telemetry",
			estadoRed: "Status",
			conectado: "Connected",
			desconectado: "Disconnected",
			ipEnlace: "Gateway IP",
			refresco: "Refresh Rate",
			preferencias: "Preferences",
		},
	};

	const t = traducciones[idioma];

	const getEstadoText = (estado: string) => {
		if (!isConnected) return "---";
		if (estado === "Peligro") return t.peligro;
		if (estado === "Precaucion") return t.precaucion;
		return t.seguro;
	};

	const getAlertColor = (distancia: number): string => {
		if (!isConnected) return "#333333";
		if (distancia <= 10) return "#ff3b30";
		if (distancia <= 20) return "#ffcc00";
		return "#34c759";
	};

	const layoutStyle: CSSProperties = {
		display: "flex",
		minHeight: "100vh",
		backgroundColor: "#000000",
		color: "#f5f5f7",
		fontFamily: "system-ui, -apple-system, sans-serif",
	};

	const sidebarStyle: CSSProperties = {
		width: "280px",
		backgroundColor: "#111111",
		padding: "2.5rem 2rem",
		borderRight: "1px solid #222",
		display: "flex",
		flexDirection: "column",
	};

	const mainStyle: CSSProperties = {
		flex: 1,
		padding: "2rem 3rem",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "#050505",
	};

	const radarBox = (distancia: number): CSSProperties => {
		const color = getAlertColor(distancia);
		const isDanger = distancia <= 10 && isConnected;

		return {
			flex: "1",
			minWidth: "130px",
			padding: "1.5rem",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			borderRadius: "16px",
			backgroundColor: isDanger ? "rgba(255, 59, 48, 0.08)" : "#111111",
			border: `2px solid ${isDanger ? color : "#222"}`,
			transition: "all 0.1s ease-out",
			boxShadow: isDanger ? `0 0 20px rgba(255, 59, 48, 0.15)` : "none",
			opacity: isConnected ? 1 : 0.4,
		};
	};

	const distanciaCercana = sensorData.sistema.mas_cercano;
	const colorEstado = getAlertColor(distanciaCercana);

	return (
		<div style={layoutStyle}>
			<aside style={sidebarStyle}>
				<div style={{ marginBottom: "3rem" }}>
					<h2
						style={{
							fontSize: "1.2rem",
							letterSpacing: "2px",
							color: "#fff",
							margin: "0 0 0.5rem 0",
						}}>
						{t.titulo}
					</h2>
					<p style={{ color: "#666", fontSize: "0.8rem", margin: 0 }}>
						v1.0.0 - ESP32-CAM
					</p>
				</div>
				<div style={{ marginBottom: "auto" }}>
					<h4
						style={{
							color: "#555",
							fontSize: "0.75rem",
							textTransform: "uppercase",
							letterSpacing: "1px",
							marginBottom: "1rem",
						}}>
						{t.telemetria}
					</h4>
					<div
						style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<span style={{ color: "#888", fontSize: "0.9rem" }}>
								{t.estadoRed}
							</span>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "0.5rem",
								}}>
								<div
									style={{
										width: "8px",
										height: "8px",
										borderRadius: "50%",
										backgroundColor: isConnected ? "#34c759" : "#ff3b30",
										boxShadow: `0 0 8px ${isConnected ? "#34c759" : "#ff3b30"}`,
									}}
								/>
								<span
									style={{
										color: isConnected ? "#fff" : "#ff3b30",
										fontSize: "0.9rem",
										fontWeight: "500",
									}}>
									{isConnected ? t.conectado : t.desconectado}
								</span>
							</div>
						</div>

						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<span style={{ color: "#888", fontSize: "0.9rem" }}>
								{t.ipEnlace}
							</span>
							<span
								style={{
									color: "#ccc",
									fontSize: "0.9rem",
									fontFamily: "monospace",
								}}>
								{isConnected ? "192.168.4.1" : "---.---.-.-"}
							</span>
						</div>

						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<span style={{ color: "#888", fontSize: "0.9rem" }}>
								{t.refresco}
							</span>
							<span
								style={{
									color: "#ccc",
									fontSize: "0.9rem",
									fontFamily: "monospace",
								}}>
								{isConnected ? "250ms" : "---"}
							</span>
						</div>
					</div>
				</div>
				<div style={{ borderTop: "1px solid #222", paddingTop: "1.5rem" }}>
					<h4
						style={{
							color: "#555",
							fontSize: "0.75rem",
							textTransform: "uppercase",
							letterSpacing: "1px",
							marginBottom: "1rem",
						}}>
						{t.preferencias}
					</h4>
					<button
						onClick={() => setIdioma(idioma === "ES" ? "EN" : "ES")}
						style={{
							width: "100%",
							background: "#1a1a1a",
							color: "#aaa",
							border: "1px solid #333",
							padding: "0.8rem",
							cursor: "pointer",
							borderRadius: "8px",
							transition: "0.2s",
							fontWeight: "600",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							gap: "0.5rem",
						}}
						onMouseOver={(e) => (e.currentTarget.style.background = "#222")}
						onMouseOut={(e) => (e.currentTarget.style.background = "#1a1a1a")}>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="2" y1="12" x2="22" y2="12"></line>
							<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
						</svg>
						{t.boton}
					</button>
				</div>
			</aside>
			<main style={mainStyle}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "1rem",
						marginBottom: "2rem",
						padding: "1rem 2rem",
						backgroundColor: "#111",
						borderRadius: "50px",
						border: "1px solid #222",
						opacity: isConnected ? 1 : 0.4,
						transition: "opacity 0.3s ease",
					}}>
					<span
						style={{ color: "#888", letterSpacing: "2px", fontSize: "0.9rem" }}>
						{t.estado}
					</span>
					<div
						style={{
							width: "12px",
							height: "12px",
							borderRadius: "50%",
							backgroundColor: colorEstado,
							boxShadow: `0 0 10px ${colorEstado}`,
						}}
					/>
					<span
						style={{
							color: colorEstado,
							fontWeight: "bold",
							letterSpacing: "1px",
						}}>
						{getEstadoText(sensorData.sistema.estado)}
					</span>
				</div>
				<div
					style={{
						width: "100%",
						maxWidth: "720px",
						aspectRatio: "4/3",
						backgroundColor: "#0a0a0a",
						borderRadius: "16px",
						overflow: "hidden",
						border: "1px solid #222",
						marginBottom: "3rem",
						boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}>
					{isConnected ? (
						<img
							src="http://192.168.4.1:81/stream"
							alt="Video en vivo"
							style={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								display: "block",
							}}
							onError={(e) => {
								e.currentTarget.style.display = "none";
							}}
						/>
					) : (
						<span style={{ color: "#555", letterSpacing: "2px" }}>
							SIN SEÑAL DE VIDEO
						</span>
					)}
				</div>
				<div
					style={{
						display: "flex",
						gap: "1.5rem",
						width: "100%",
						maxWidth: "720px",
						flexWrap: "wrap",
					}}>
					<div style={radarBox(sensorData.sensores.izquierdo)}>
						<span
							style={{
								fontSize: "0.8rem",
								color: "#666",
								letterSpacing: "1px",
								marginBottom: "8px",
							}}>
							{t.izq}
						</span>
						<div
							style={{
								fontSize: "2rem",
								fontWeight: "800",
								color: getAlertColor(sensorData.sensores.izquierdo),
							}}>
							{isConnected ? sensorData.sensores.izquierdo : "--"}{" "}
							<span
								style={{
									fontSize: "1rem",
									color: "#666",
									fontWeight: "normal",
								}}>
								cm
							</span>
						</div>
					</div>

					<div style={radarBox(sensorData.sensores.central)}>
						<span
							style={{
								fontSize: "0.8rem",
								color: "#666",
								letterSpacing: "1px",
								marginBottom: "8px",
							}}>
							{t.cen}
						</span>
						<div
							style={{
								fontSize: "2rem",
								fontWeight: "800",
								color: getAlertColor(sensorData.sensores.central),
							}}>
							{isConnected ? sensorData.sensores.central : "--"}{" "}
							<span
								style={{
									fontSize: "1rem",
									color: "#666",
									fontWeight: "normal",
								}}>
								cm
							</span>
						</div>
					</div>

					<div style={radarBox(sensorData.sensores.derecho)}>
						<span
							style={{
								fontSize: "0.8rem",
								color: "#666",
								letterSpacing: "1px",
								marginBottom: "8px",
							}}>
							{t.der}
						</span>
						<div
							style={{
								fontSize: "2rem",
								fontWeight: "800",
								color: getAlertColor(sensorData.sensores.derecho),
							}}>
							{isConnected ? sensorData.sensores.derecho : "--"}{" "}
							<span
								style={{
									fontSize: "1rem",
									color: "#666",
									fontWeight: "normal",
								}}>
								cm
							</span>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

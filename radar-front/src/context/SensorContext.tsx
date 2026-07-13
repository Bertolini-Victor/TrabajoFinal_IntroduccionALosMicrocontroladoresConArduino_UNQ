import { createContext, useState, useEffect, type ReactNode } from "react";

interface SensorData {
	sensores: {
		izquierdo: number;
		central: number;
		derecho: number;
	};
	sistema: {
		mas_cercano: number;
		estado: string;
	};
}

interface SensorContextType {
	sensorData: SensorData;
	isConnected: boolean;
}

const defaultData: SensorData = {
	sensores: { izquierdo: 200, central: 200, derecho: 200 },
	sistema: { mas_cercano: 200, estado: "Seguro" },
};

export const SensorContext = createContext<SensorContextType>({
	sensorData: defaultData,
	isConnected: false,
});

interface ProviderProps {
	children: ReactNode;
}

export const SensorProvider = ({ children }: ProviderProps) => {
	const [sensorData, setSensorData] = useState<SensorData>(defaultData);
	const [isConnected, setIsConnected] = useState<boolean>(false);

	useEffect(() => {
		const fetchSensores = async () => {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 1000);

			try {
				const response = await fetch("http://192.168.4.1/api/sensores", {
					signal: controller.signal
				});
				
				clearTimeout(timeoutId);

				if (response.ok) {
					const data: SensorData = await response.json();
					setSensorData(data);
					setIsConnected(true);
				} else {
					setIsConnected(false);
				}
			} catch (error) {
				setIsConnected(false);
			}
		};

		const interval = setInterval(fetchSensores, 250);
		return () => clearInterval(interval);
	}, []);

	return (
		<SensorContext.Provider value={{ sensorData, isConnected }}>
			{children}
		</SensorContext.Provider>
	);
};
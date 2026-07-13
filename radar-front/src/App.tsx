import { SensorProvider } from "./context/SensorContext.tsx";
import { Dashboard } from "./components/Dashboard.tsx";

function App() {
	return (
		<SensorProvider>
			<Dashboard />
		</SensorProvider>
	);
}

export default App;

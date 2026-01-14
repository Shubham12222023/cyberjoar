import { MapComponent } from './components/Map/MapComponent';
import { Sidebar } from './components/UI/Sidebar';

function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-900">
      <Sidebar />
      <MapComponent />
    </div>
  );
}

export default App;

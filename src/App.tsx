import AppProvider from './providers';
import AppRouter from './routes';

function App() {
  return (
    <AppProvider>
      <AppRouter></AppRouter>
    </AppProvider>
  );
}

export default App;

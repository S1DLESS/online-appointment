import { Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import HomePage from './pages/HomePage'
import ClientRoutes from './routes/ClientRoutes'
import AdminRoutes from './routes/AdminRoutes'
import { theme } from './styles/theme'


export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<Routes>
				<Route path='*' element={<Navigate to='/' />} />
				<Route path='/' element={<HomePage />} />
				<Route path='/:branchId/*' element={<ClientRoutes />} />
				<Route path='/admin/*' element={<AdminRoutes />} />
			</Routes>
		</ThemeProvider>
	);
}
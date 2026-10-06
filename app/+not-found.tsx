import { Link } from 'expo-router';
import { Body, Screen, styles } from '../src/components/Screen';
export default function NotFound() { return <Screen title="Página no encontrada"><Body>Volvé al inicio para continuar.</Body><Link href="/" style={styles.link}>Ir al inicio</Link></Screen>; }

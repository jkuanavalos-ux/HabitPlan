import { Link } from 'expo-router';
import { Body, Card, Screen, styles } from '../../src/components/Screen';
export default function Menu() {
  return <Screen title="Menú"><Card>
    <Link href="/habits" style={styles.link}>Hábitos</Link><Link href="/goals" style={styles.link}>Objetivos</Link><Link href="/schedule" style={styles.link}>Horario</Link>
    <Link href="/sales" style={styles.link}>Ventas</Link><Link href="/stats" style={styles.link}>Estadísticas</Link><Link href="/journal" style={styles.link}>Diario</Link>
    <Link href="/quotes" style={styles.link}>Frases motivadoras</Link><Link href="/settings" style={styles.link}>Configuración</Link>
    <Link href="/(onboarding)/welcome" style={styles.link}>Bienvenida</Link>
  </Card><Body muted>La navegación está disponible; las funciones se habilitarán por fases.</Body></Screen>;
}

import { Link } from 'expo-router';
import { Body, Card, Screen, styles } from '../../src/components/Screen';
import { repositories } from '../../src/db/repositories';
import { es } from '../../src/i18n';
export default function Home() {
  const summary = repositories.summary();
  return <Screen title={es.baseTitle}>
    <Card><Body>{es.baseDescription}</Body><Body muted>Fase 1 · Base · 100 % offline</Body></Card>
    <Card><Body>{summary.habits} hábitos · {summary.goals} objetivos · {summary.blocks} bloques de horario</Body><Body muted>Los datos se guardan en este dispositivo.</Body></Card>
    <Card><Link href="/habits" style={styles.link}>Ver hábitos precargados →</Link><Link href="/goals" style={styles.link}>Ver objetivos precargados →</Link><Link href="/schedule" style={styles.link}>Ver bloques precargados →</Link></Card>
    <Body muted>Los checks, el Estado y las barras de progreso llegarán en sus fases correspondientes.</Body>
  </Screen>;
}

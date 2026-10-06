import { Link } from 'expo-router';
import { Body, Card, Screen, styles } from '../../src/components/Screen';
import { repositories } from '../../src/db/repositories';
export default function Goals() {
  return <Screen title="Objetivos precargados">{repositories.goals().map(goal => <Card key={goal.id}>
    <Link href={{ pathname: '/goals/[id]', params: { id: goal.id } }} style={styles.link}>{goal.title} →</Link><Body muted>{goal.dueDate ?? 'Sin fecha límite'} · {goal.progressMode}</Body>
  </Card>)}</Screen>;
}

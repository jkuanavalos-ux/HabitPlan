import { useLocalSearchParams } from 'expo-router';
import { Body, Card, Screen } from '../../src/components/Screen';
import { repositories } from '../../src/db/repositories';
export default function Goal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const goal = repositories.goal(id);
  if (!goal) return <Screen title="Objetivo no encontrado"><Body>Este objetivo no está disponible.</Body></Screen>;
  return <Screen title={goal.title}><Card><Body>Inicio: {goal.startDate}</Body><Body>Fecha límite: {goal.dueDate ?? 'Objetivo continuo'}</Body><Body muted>{goal.notes}</Body></Card>
    <Body muted>Actividades precargadas · Controles y progreso: Fase 4.</Body>
    {repositories.activities(goal.id).map(activity => <Card key={activity.id}><Body>{activity.title}</Body><Body muted>{activity.kind}{activity.weeklyTarget ? ` · ${activity.weeklyTarget}/semana` : ''}</Body></Card>)}
  </Screen>;
}

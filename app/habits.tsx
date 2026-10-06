import { Body, Card, Screen } from '../src/components/Screen';
import { repositories } from '../src/db/repositories';
export default function Habits() {
  return <Screen title="Hábitos precargados"><Body muted>Vista de comprobación del seed. Edición y checks: próximas fases.</Body>
    {repositories.habits().map(habit => <Card key={habit.id}><Body>{habit.emoji} {habit.name}</Body><Body muted>{habit.enabled ? 'Activo' : 'Sugerido · desactivado'}</Body></Card>)}
  </Screen>;
}

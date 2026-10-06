import { View } from 'react-native';
import { Body, Card, Screen } from '../src/components/Screen';
import { repositories } from '../src/db/repositories';
const labels: Record<string, string> = { mon: 'Lun', tue: 'Mar', wed: 'Mié', thu: 'Jue', fri: 'Vie', sat: 'Sáb', sun: 'Dom' };
export default function Schedule() {
  return <Screen title="Bloques precargados"><Body muted>Vista de comprobación. La grilla semanal y la edición corresponden a la Fase 5.</Body>
    {repositories.schedule().map(block => <Card key={block.id}><View style={{ height: 4, borderRadius: 4, backgroundColor: block.color }} /><Body>{block.title}</Body><Body muted>{block.start}–{block.end} · {(JSON.parse(block.daysJson) as string[]).map(day => labels[day]).join(', ')}</Body>{block.suggested && <Body muted>Ajuste sugerido</Body>}</Card>)}
  </Screen>;
}

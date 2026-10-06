import { Body, Card, Screen } from './Screen';
import { es } from '../i18n';
export function Placeholder({ title, phase }: { title: string; phase: number }) {
  return <Screen title={title}><Card><Body>Fase {phase}</Body><Body muted>{es.upcoming}</Body></Card></Screen>;
}

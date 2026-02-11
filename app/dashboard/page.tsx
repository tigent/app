import type { Metadata } from 'next';
import { Empty } from './components/empty';

export const metadata: Metadata = {
  title: 'Tigent - Dashboard',
};

export default function Page() {
  return <Empty hasrepos />;
}

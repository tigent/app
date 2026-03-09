import type { Metadata } from 'next';
import { Empty } from './components/empty';

export const metadata: Metadata = {
  title: 'Tigent - Dashboard',
};

export default function Page() {
  return (
    <div className="h-full min-h-0">
      <Empty hasrepos />
    </div>
  );
}

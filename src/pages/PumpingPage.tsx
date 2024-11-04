import { PumpingForm } from '../components/pumping/PumpingForm';
import { PumpingTimer } from '../components/pumping/PumpingTimer';
import { PumpingList } from '../components/pumping/PumpingList';

export function PumpingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pumping Sessions</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PumpingTimer />
          <PumpingForm />
        </div>
        <div>
          <PumpingList />
        </div>
      </div>
    </div>
  );
}

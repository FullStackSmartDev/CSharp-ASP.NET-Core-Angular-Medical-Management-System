using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Queues
{
    public class MedicationsUpdateTaskQueue
    {
        private readonly ConcurrentQueue<MedicationsUpdateItemViewModel> _medicationsUpdateItems;
        private readonly SemaphoreSlim _signal;

        public MedicationsUpdateTaskQueue()
        {
            _medicationsUpdateItems =
                new ConcurrentQueue<MedicationsUpdateItemViewModel>();
            _signal = new SemaphoreSlim(0);
        }

        public void QueueMedicationsUpdateItem(MedicationsUpdateItemViewModel medicationsUpdateItem)
        {
            if (medicationsUpdateItem == null)
                throw new ArgumentNullException(nameof(medicationsUpdateItem));

            _medicationsUpdateItems.Enqueue(medicationsUpdateItem);
            _signal.Release();
        }

        public async Task<MedicationsUpdateItemViewModel> DequeueMedicationsUpdateItem()
        {
            await _signal.WaitAsync();
            _medicationsUpdateItems.TryDequeue(out var workItem);

            return workItem;
        }
    }
}

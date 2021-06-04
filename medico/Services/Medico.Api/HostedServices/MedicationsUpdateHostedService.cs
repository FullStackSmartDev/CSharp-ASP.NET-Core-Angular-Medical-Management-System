using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.Queues;
using Medico.Application.ViewModels;
using Medico.Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Medico.Api.HostedServices
{
    public class MedicationsUpdateHostedService : BackgroundService
    {
        private readonly MedicationsUpdateTaskQueue _medicationsUpdateTaskQueue;
        private readonly IServiceScopeFactory _scopeFactory;

        public MedicationsUpdateHostedService(MedicationsUpdateTaskQueue medicationsUpdateTaskQueue,
            IServiceScopeFactory scopeFactory)
        {
            _medicationsUpdateTaskQueue = medicationsUpdateTaskQueue;
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var medicationsUpdateItem =
                        await _medicationsUpdateTaskQueue.DequeueMedicationsUpdateItem();

                    using (var scope = _scopeFactory.CreateScope())
                    {
                        medicationsUpdateItem.Status = MedicationUpdateStatus.Queued;

                        var medicationsUpdateItemService = scope
                            .ServiceProvider.GetRequiredService<IMedicationsUpdateItemService>();

                        await medicationsUpdateItemService.Update(medicationsUpdateItem);
                    }

                    OperationResult<IEnumerable<MedicationItemInfoViewModel>> medicationsUpdateResult;

                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var scheduleMedicationsUpdateService = scope
                            .ServiceProvider.GetRequiredService<IScheduleMedicationsUpdateService>();

                        medicationsUpdateResult = await scheduleMedicationsUpdateService
                            .RunMedicationsUpdate(medicationsUpdateItem);
                    }

                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var medicationsUpdateItemService = scope
                            .ServiceProvider.GetRequiredService<IMedicationsUpdateItemService>();

                        medicationsUpdateItem.Status = medicationsUpdateResult.Success
                            ? MedicationUpdateStatus.Completed
                            : MedicationUpdateStatus.Error;

                        if (!medicationsUpdateResult.Success)
                            medicationsUpdateItem.Error = medicationsUpdateResult.Error;

                        await medicationsUpdateItemService.Update(medicationsUpdateItem);
                    }
                }
                catch (Exception exception)
                {
                    Console.WriteLine(exception.Message);
                }
            }

            Console.WriteLine("Queued Hosted Service is stopping.");
        }
    }
}

namespace Medico.Domain.Enums
{
    public enum MedicationUpdateStatus
    {
        Scheduled = 1, 
        Queued,
        Running,
        Completed,
        Error
    }
}
